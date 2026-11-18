// Browser regression with stock Chrome + Node 22 WebSocket. No npm dependencies.
// Headless Chromium does NOT replace physical iOS Safari QA.
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn,spawnSync} from 'node:child_process';
import {readFileSync,mkdirSync,mkdtempSync,writeFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
const root=path.resolve('.');
const mime={'.html':'text/html;charset=utf-8','.svg':'image/svg+xml','.js':'application/javascript','.webmanifest':'application/manifest+json','.md':'text/plain;charset=utf-8'};
const app=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)&&file!==path.resolve(root,'index.html')){res.writeHead(403);res.end();return;}
  const content=readFileSync(file);res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-cache'});res.end(content);
 }catch{res.writeHead(404);res.end('Missing');}
});
await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
const port=app.address().port;
const binary=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(cmd=>{
 const p=spawnSync(cmd,['--version'],{encoding:'utf8'});return !p.error&&p.status===0;
});
assert.ok(binary,'Google Chrome / Chromium is required for browser smoke tests');
const dir=mkdtempSync(path.join(tmpdir(),'lumina-chrome-'));
const chrome=spawn(binary,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
 '--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+dir,
 '--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
let socket;
async function delay(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function until(fn,timeout=18000){
 const start=Date.now();while(Date.now()-start<timeout){try{const result=await fn();if(result)return result;}catch{}await delay(150);}
 throw new Error('Timeout waiting for browser condition');
}
try{
 const activePort=path.join(dir,'DevToolsActivePort');
 const chromePort=await until(()=>existsSync(activePort)?Number(readFileSync(activePort,'utf8').split('\n')[0]):0);
 const targets=await until(async()=>{
  const v=await fetch('http://127.0.0.1:'+chromePort+'/json/list').then(x=>x.json());return v.find(x=>x.type==='page')?.webSocketDebuggerUrl;
 });
 socket=new WebSocket(targets);
 await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
 const pending=new Map();let id=0;const errors=[];
 socket.addEventListener('message',e=>{
  const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);
  if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}
 });
 const send=(method,params={})=>new Promise((resolve,reject)=>{const seq=++id;pending.set(seq,{resolve,reject});socket.send(JSON.stringify({id:seq,method,params}));});
 const evalJs=async expression=>{
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw Error('JS exception: '+JSON.stringify(result.exceptionDetails));
  return result.result?.value;
 };
 await send('Runtime.enable');await send('Page.enable');
 await send('Page.navigate',{url:'http://localhost:'+port+'/'});
 await until(async()=>await evalJs("document.documentElement.dataset.luminaReady==='true'"));
 await delay(350);
 assert.equal(await evalJs("!!window.Lumina.game"),true);
 assert.equal(await evalJs("window.Lumina.LogicLabModel.TASKS.length"),8);
 assert.equal(await evalJs("document.querySelector('link[rel=manifest]')?.getAttribute('href')"),'./manifest.webmanifest');
 const cleanMenu=await evalJs(`(()=>{
  const root=document.querySelector('#menu .menu-controls');
  const top=[...root.children].filter(el=>el.matches('button,details')).map(el=>el.id);
  const more=document.getElementById('menu-more');
  const initialClosed=!more.open;
  const visibleLab=!document.getElementById('lab-open').hidden;
  const visibleNotebook=!document.getElementById('open-notebook').hidden;
  const visibleNew=!document.getElementById('restart').hidden;
  const debugHidden=document.querySelector('[data-dev-only]').hidden;
  more.open=true;
  const advancedClosed=!document.getElementById('menu-settings').open;
  const prefs=[...document.querySelectorAll('.menu-quick-preferences select')].map(el=>el.id);
  more.open=false;
  return {top,initialClosed,visibleLab,visibleNotebook,visibleNew,debugHidden,advancedClosed,prefs};
 })()`);
 assert.equal(cleanMenu.top.join(','),'start,training-open,menu-more','Only play, tutorial and options at menu root');
 assert.equal(cleanMenu.initialClosed,true,'Options start collapsed');
 assert.equal(cleanMenu.visibleLab,false,'Undiscovered LAB does not appear');
 assert.equal(cleanMenu.visibleNotebook,false,'Undiscovered notebook does not appear');
 assert.equal(cleanMenu.visibleNew,false,'No new-game reset on fresh save');
 assert.equal(cleanMenu.debugHidden,true,'Development scenes hidden in player mode');
 assert.equal(cleanMenu.advancedClosed,true,'Rare technical settings remain collapsed');
 assert.equal(cleanMenu.prefs.join(','),'guidance-mode,reading-scale','Essential settings remain discoverable');
 const toolsUi=await evalJs(`(()=>{
  const g=window.Lumina.game,tools=window.Lumina.PlayerTools;
  const pack=tools.pack(g.save),raw=JSON.stringify(pack),copy=tools.unpack(JSON.parse(raw));
  let invalid=false;try{tools.unpack({app:'other',format:1,data:g.save});}catch{invalid=true;}
  const exported=pack.app==='lumina'&&pack.format===1&&copy.version===1;
  const importButton=!!document.getElementById('save-import');
  const exportButton=!!document.getElementById('save-export');
  const replayInitiallyHidden=document.getElementById('guardian-replay').hidden;
  document.getElementById('journey-recap').click();
  const modal=document.getElementById('journey-recap-modal');
  const visible=!modal.hidden;
  const noSpoilers=document.querySelectorAll('#journey-recap-entries .recap-entry').length===1;
  const recapTitle=document.getElementById('journey-recap-title').textContent;
  document.getElementById('journey-recap-close').click();
  return {exported,invalid,importButton,exportButton,replayInitiallyHidden,visible,noSpoilers,
   recapTitle,closed:modal.hidden};
 })()`);
 for(const [key,desc] of Object.entries({
  exported:'Save export and import round-trip validates the save format',
  invalid:'An unrelated file is rejected before replacing progress',
  importButton:'Menu provides manual import',
  exportButton:'Menu provides private export',
  replayInitiallyHidden:'Boss replay is unavailable until defeat',
  visible:'Journey recap can be read from Options',
  noSpoilers:'Journal only reveals discovered scenes',
  closed:'Journal can be closed without interrupting the game'
 }))assert.equal(toolsUi[key],true,desc);
 assert.match(toolsUi.recapTitle,/Bitácora/);
 const assistOptions=await evalJs(`(()=>{
  const g=window.Lumina.game,input=document.getElementById('assist');
  const button=document.getElementById('assist-mode-button');
  const ready=!!button&&!button.hidden;
  input.checked=false;input.dispatchEvent(new Event('change',{bubbles:true}));
  button.click();const enabled=input.checked&&g.save.assist&&button.getAttribute('aria-pressed')==='true';
  button.click();const disabled=!input.checked&&!g.save.assist&&button.getAttribute('aria-pressed')==='false';
  return {ready,enabled,disabled};
 })()`);
 assert.equal(assistOptions.ready,true,'Jump assistance can be found in mobile Options');
 assert.equal(assistOptions.enabled,true,'Optional assistance activates the actual movement setting');
 assert.equal(assistOptions.disabled,true,'Player can disable assistance without restarting');
 const audioPrefs=await evalJs(`(()=>{
  const g=window.Lumina.game,score=g.soundEngine,defs=window.Lumina.Soundtrack;
  const music=document.getElementById('music-button'),effects=document.getElementById('audio-button');
  const musicSlider=document.getElementById('music-volume'),fxSlider=document.getElementById('effects-volume');
  const original={music:score.musicOn,fx:g.audioOn,themes:Object.keys(defs.THEMES).length};
  music.click();const musicOff=!score.musicOn&&g.audioOn;
  effects.click();const fxOff=!g.audioOn&&!score.musicOn;
  music.click();const separate=score.musicOn&&!g.audioOn;
  musicSlider.value='30';musicSlider.dispatchEvent(new Event('input',{bubbles:true}));
  fxSlider.value='65';fxSlider.dispatchEvent(new Event('input',{bubbles:true}));
  effects.click();
  return {original,musicOff,fxOff,separate,musicOn:score.musicOn,fxOn:g.audioOn,
   mv:score.musicVol,fv:score.fxVol,
   storedMusic:localStorage.getItem(defs.KEY.music),
   storedFx:localStorage.getItem(defs.KEY.fxEnabled),
   storedMv:localStorage.getItem(defs.KEY.musicVol),
   storedFv:localStorage.getItem(defs.KEY.fxVol),
   controlsInOptions:!!music.closest('.menu-quick-preferences'),
   ariaMusic:music.getAttribute('aria-pressed'),ariaFx:effects.getAttribute('aria-pressed')};
 })()`);
 assert.equal(audioPrefs.original.music,true,'Original score enabled by default');
 assert.equal(audioPrefs.original.fx,true,'Game effects enabled by default');
 assert.ok(audioPrefs.original.themes>=8,'Scene-specific 8-bit themes are available');
 assert.equal(audioPrefs.musicOff,true,'Music can be muted without affecting effects');
 assert.equal(audioPrefs.fxOff,true,'Effects can also be independently muted');
 assert.equal(audioPrefs.separate,true,'Music can resume with effects muted');
 assert.equal(audioPrefs.musicOn,true);
 assert.equal(audioPrefs.fxOn,true);
 assert.equal(audioPrefs.mv,.3);
 assert.equal(audioPrefs.fv,.65);
 assert.equal(audioPrefs.storedMusic,'on');
 assert.equal(audioPrefs.storedFx,'on');
 assert.equal(audioPrefs.storedMv,'0.3');
 assert.equal(audioPrefs.storedFv,'0.65');
 assert.equal(audioPrefs.ariaMusic,'true');
 assert.equal(audioPrefs.ariaFx,'true');
 assert.equal(audioPrefs.controlsInOptions,true,'Sound settings are in the compact Options menu');
 const first=await evalJs(`(()=>{
   document.getElementById('training-offer-skip').click();
   const game=window.Lumina.game,lab=game.logicLab;
   const locked=document.getElementById('lab-open').disabled;
   const bypass=lab.open(false);
   const notOpened=!lab.active&&document.getElementById('logic-lab').hidden;
   const hiddenOutside=!window.Lumina.LabUnlock.visible(game.save,'district');
   game.save.cityVariableSolved=true;game.save.robot=true;
   game.scene='workshop';game.player.x=733;game.player.y=280;
   game.locked=false;game.el.menu.hidden=true;game.interact();
   for(let i=0;i<8&&!game.el.story.hidden;i++)game.nextDialogue();
   const discovered=game.save.labDiscovered,guideRequired=lab.guideOpen&&document.getElementById('lab-run').disabled;
   const noLanguageYet=document.getElementById('lab-language-panel').hidden;
   document.getElementById('lab-answer').value='12';
   document.getElementById('lab-run').click();
   const didNotBypass=!game.save.labCompleted.includes(0);
   for(let n=0;n<3;n++)document.getElementById('lab-guide-next').click();
   document.getElementById('lab-run').click();
   return {locked,bypass,notOpened,hiddenOutside,discovered,guideRequired,noLanguageYet,didNotBypass,
    active:lab.active,done:game.save.labCompleted.includes(0),title:document.getElementById('lab-title').textContent};
 })()`);
 assert.equal(first.locked,true,'Menu blocks lessons before reaching NIX');
 assert.equal(first.notOpened,true,'Direct attempt does not bypass locked lesson');
 assert.equal(first.hiddenOutside,true,'Undiscovered terminals do not appear');
 assert.equal(first.discovered,true,'NIX workshop unlocks lab after prerequisites');
 assert.equal(first.guideRequired,true,'Explanation precedes answers');
 assert.equal(first.noLanguageYet,true,'No programming language at the beginning');
 assert.equal(first.didNotBypass,true,'Run is disabled until explanation is read');
 assert.equal(first.done,true);assert.match(first.title,/Instrucciones en orden/);
 const program=await evalJs(`(()=>{
  const g=window.Lumina.game,lab=g.logicLab;lab.index=3;lab.render();
  document.getElementById('lab-guide-skip').click();
  const skippedGuide=!lab.guideOpen&&!document.getElementById('lab-run').disabled;
  const add=op=>{const button=document.querySelector('#lab-palette button[data-op="'+op+'"]');
   if(!button)throw Error('Missing palette operation '+op);button.click();};
  for(const op of ['SET2','ADD3','OUTPUT'])add(op);
  document.getElementById('lab-run').click();
  const fixedFails=!g.save.refugePowered&&!g.save.labCompleted.includes(3);
  const fixedDetail=document.getElementById('lab-transfer-status').textContent;
  const trace=document.getElementById('lab-step').textContent;
  document.getElementById('lab-clear').click();
  for(const op of ['READ_CHARGE','ADD3','OUTPUT'])add(op);
  document.getElementById('lab-run').click();
  const worldButton=!document.getElementById('lab-world-result').hidden;
  const completed=g.save.labCompleted.includes(3),powered=g.save.refugePowered,blocks=document.querySelectorAll('#lab-blocks .lab-block').length;
  document.getElementById('lab-world-result').click();
  const returned=!lab.active&&!g.locked&&g.el.menu.hidden&&g.scene==='workshop';
  g.player.x=631;g.player.y=280;
  const physicalPrompt=g.scenePrompt();
  const renderer=g.renderer,orig=renderer.refugeHeater;let renderState=null;
  renderer.refugeHeater=function(x,y,active){renderState={x,y,active};return orig.call(this,x,y,active);};
  try{renderer.world(g);}finally{renderer.refugeHeater=orig;}
  lab.open(true);lab.index=3;lab.render();
  return {skippedGuide,fixedFails,fixedDetail,trace,completed,powered,blocks,worldButton,returned,physicalPrompt,renderState};
 })()`);
 assert.equal(program.skippedGuide,true,'Players can skip extra lesson pages and start coding');
 assert.equal(program.fixedFails,true,'Fixed output cannot pass both inputs');
 assert.match(program.fixedDetail,/A ✓.*B ✕/,'First input passes but transfer fails');
 assert.match(program.trace,/entrada 4.*meta 7/,'Second input is documented');
 assert.equal(program.completed,true,'A generalized recipe completes mission 4');
 assert.equal(program.powered,true,'Workshop heater is saved as active');
 assert.equal(program.blocks,3);
 assert.equal(program.worldButton,true,'Offer world return after success');
 assert.equal(program.returned,true,'World resumes from the LAB without menu');
 assert.match(program.physicalPrompt,/refugio encendido/,'Heater status appears in world');
 assert.equal(program.renderState.active,true,'Renderer draws an opened warm refuge');
 const chosen=await evalJs(`(()=>{
  const game=window.Lumina.game,panel=document.getElementById('lab-language-panel'),select=document.getElementById('lab-language-select');
  const unlocked=!panel.hidden;select.value='python';select.dispatchEvent(new Event('change',{bubbles:true}));
  return {unlocked,selected:game.save.learningLanguage,translated:document.getElementById('lab-code-preview').textContent};
 })()`);
 assert.equal(chosen.unlocked,true,'Languages unlock after first four lessons');
 assert.equal(chosen.selected,'python','Preferred language is saved');
 assert.match(chosen.translated,/carga = entrada/);
 // Complete the remaining exercises using the same palette clicks a player uses.
 const course=await evalJs(`(()=>{
  const game=window.Lumina.game,lab=game.logicLab;
  const solutions={
   1:10,2:5,
   4:['READ_CHARGE','REPEAT3_ADD2','OUTPUT'],
   5:['SET0','SENSOR0','SENSOR1','OUTPUT'],
   6:['ENERGY','NETWORK','AND','NOT_ALARM','AND','OUTPUT'],
   7:['READ_CHARGE','ADD3','TEST5','OUTPUT']
  };
  const results=[];
  for(const [key,answer] of Object.entries(solutions)){
   const i=Number(key);lab.index=i;lab.render();
   for(let n=0;n<3;n++)document.getElementById('lab-guide-next').click();
   if(typeof answer==='number')document.getElementById('lab-answer').value=String(answer);
   else for(const op of answer){
    const button=[...document.querySelectorAll('#lab-palette button')].find(b=>b.dataset.op===op);
    if(!button)throw Error('Missing block '+op+' in mission '+i);
    button.click();
   }
   document.getElementById('lab-run').click();
   results.push({i,done:game.save.labCompleted.includes(i),good:document.getElementById('lab-feedback').dataset.success});
  }
  return {results,mastered:game.save.labMastered,completed:game.save.labCompleted.length};
 })()`);
 assert.equal(course.completed,8,'All eight missions should persist');
 assert.equal(course.mastered,true,'Course graduation should unlock');
 assert.ok(course.results.every(r=>r.done&&r.good==='true'),'Every mission should pass in real DOM');

 const cape=await evalJs(`(()=>{
  const game=window.Lumina.game,r=game.renderer,original=r.poly,signs=[];
  r.poly=function(points,color){if(color==='#8d5c67'){const matrix=r.ctx.getTransform();signs.push(Math.sign(matrix.a*points[2][0]));}
   return original.call(r,points,color);
  };
  try{for(const facing of [1,-1])r.player({...game.player,x:240,y:280,facing,vx:facing*110,anim:'run',gait:2},0);}
  finally{r.poly=original;}
  return signs;
 })()`);
 assert.equal(cape[0],-1,'Facing right: scarf trails left');
 assert.equal(cape[1],1,'Facing left: scarf trails right');

 await send('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:2,mobile:true,screenOrientation:{type:'landscapePrimary',angle:90}});
 await delay(260);
 const fit=await evalJs(`(()=>{
  const label=document.getElementById('lab-feedback'),button=document.querySelector('#lab-palette button'),scale=document.getElementById('reading-scale');
  const base=parseFloat(getComputedStyle(label).fontSize),height=button.getBoundingClientRect().height;
  scale.value='1.3';scale.dispatchEvent(new Event('change',{bubbles:true}));
  const enlarged=parseFloat(getComputedStyle(label).fontSize);
  return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,
   modal:document.querySelector('#logic-lab .lab-panel').getBoundingClientRect().width,
   close:!!document.getElementById('lab-exit'),base,enlarged,height,scale:localStorage.getItem('lumina-reading-scale-v1')};
 })()`);
 assert.ok(fit.modal<=fit.viewport,'Lab modal fits mobile horizontal width');
 assert.ok(fit.base>=14,'Instructional text at least 14px');
 assert.ok(fit.height>=44,'Instruction block has 44px touch target');
 assert.ok(fit.enlarged>fit.base,'Text scale visibly enlarges mission text');
 assert.equal(fit.scale,'1.3','Text-scale preference is stored');
 mkdirSync('artifacts',{recursive:true});
 const img=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 writeFileSync('artifacts/lumina-v060-laboratorio-movil.png',Buffer.from(img.data,'base64'));
 const world=await evalJs(`(()=>{
   const g=window.Lumina.game;g.logicLab.close();g.scene='district';g.player.x=1360;g.player.y=280;
   g.locked=false;g.el.menu.hidden=true;g.interact();
   const opened=g.logicLab.active&&g.logicLab.fromWorld;g.logicLab.close();
   return {opened,unlocked:!g.locked,menuHidden:g.el.menu.hidden};
 })()`);
 assert.equal(world.opened,true,'Open educational kiosk by interacting in playable world');
 assert.equal(world.unlocked,true,'Close kiosk and resume play');
 assert.equal(world.menuHidden,true,'Do not send player to menu after world kiosk');
 const guidance=await evalJs(`(()=>{
  const g=window.Lumina.game,r=g.renderer,G=window.Lumina.Guidance,save={...g.save,cityGate:false};
  const mode=document.getElementById('guidance-mode'),label=document.getElementById('guidance-mode-label');
  g.scene='district';g.locked=false;g.el.menu.hidden=true;g.save.cityGate=false;
  g.camera.x=0;g.player.y=280;
  mode.value='subtle';mode.dispatchEvent(new Event('change',{bubbles:true}));
  g.player.x=100;const right=G.direction(g.scene,g.save,g.player.x)?.side;
  let arrows=0;const old=r.poly;
  r.poly=function(points,color){if(color==='#d5f5df')arrows++;return old.call(r,points,color);};
  try{
   const drawnRight=!!r.drawGuidance(g);
   g.player.x=860;const left=G.direction(g.scene,g.save,g.player.x)?.side,drawnLeft=!!r.drawGuidance(g);
   g.player.x=596;const near=r.drawGuidance(g)===null;
   mode.value='off';mode.dispatchEvent(new Event('change',{bubbles:true}));
   g.player.x=100;const disabled=r.drawGuidance(g)===null;
   mode.value='hint';mode.dispatchEvent(new Event('change',{bubbles:true}));
   const preHint=r.drawGuidance(g)===null;
   g.hint();const afterHint=!!r.drawGuidance(g);
   const oldScene=g.scene,oldX=g.player.x,oldOrbs=g.save.orbs.slice();
   g.scene='harbor';g.player.x=300;g.save.orbs=['move'];
   g.hint();const harborUnpaused=!g.locked&&g.guidancePulse>0;
   g.scene=oldScene;g.player.x=oldX;g.save.orbs=oldOrbs;
   const saved=localStorage.getItem('lumina-guidance-mode-v1');
   mode.value='hint';mode.dispatchEvent(new Event('change',{bubbles:true}));
   return {right,left,drawnRight,drawnLeft,near,disabled,preHint,afterHint,harborUnpaused,saved,arrows,label:label.textContent};
  }finally{r.poly=old;}
 })()`);
 assert.equal(guidance.right,1,'Arrow points east when objective is to the right');
 assert.equal(guidance.left,-1,'Arrow points west after passing objective');
 assert.ok(guidance.drawnRight&&guidance.drawnLeft,'Guidance is drawn in both directions');
 assert.equal(guidance.arrows,3,'Near-target arrows and disabled mode are suppressed');
 assert.equal(guidance.near,true,'Proximity indicator is replaced by use prompt');
 assert.equal(guidance.disabled,true,'Off preference draws no arrow');
 assert.equal(guidance.preHint,true,'Hint-only mode stays quiet until requested');
 assert.equal(guidance.afterHint,true,'Hint button temporarily reveals the arrow');
 assert.equal(guidance.harborUnpaused,true,'On-demand direction in harbor does not pause play with a dialogue');
 assert.equal(guidance.saved,'hint','Preference is persistent');
 assert.match(guidance.label,/Solo con Pista/);

 const streetLesson=await evalJs(`(()=>{
  const game=window.Lumina.game;
  game.academy.openVariable();
  const guide=document.getElementById('variable-teacher').textContent;
  const pseudo=document.getElementById('variable-output').textContent;
  const logic=document.querySelector('#logic-modal .explain-code').textContent;
  game.academy.closeVariable();
  return {explains:guide.includes('cajita'),pseudocode:pseudo.includes('INICIO')&&!pseudo.includes('let carga'),logicPseudo:logic.includes('FIN SI')};
 })()`);
 assert.equal(streetLesson.explains,true,'Variable machine explains before showing code');
 assert.equal(streetLesson.pseudocode,true,'District uses pseudocode, not JavaScript syntax');
 assert.equal(streetLesson.logicPseudo,true,'Logic door also teaches pseudocode');

 const menuMobile=await evalJs(`(()=>{
  const g=window.Lumina.game;g.openMenu();
  const panel=document.querySelector('#menu .menu-v042'),summary=document.querySelector('#menu-more>summary');
  const rect=panel.getBoundingClientRect(),button=document.getElementById('start').getBoundingClientRect();
  const focusable=[...document.querySelectorAll('#menu .menu-controls>button, #menu .menu-controls>details')].map(e=>e.id);
  return {width:rect.width,height:rect.height,vw:innerWidth,vh:innerHeight,playHeight:button.height,optionsHeight:summary.getBoundingClientRect().height,focusable};
 })()`);
 assert.ok(menuMobile.width<=menuMobile.vw+1,'Main menu fits horizontal mobile width');
 assert.ok(menuMobile.height<=menuMobile.vh+1,'Main menu fits horizontal mobile height');
 assert.ok(menuMobile.playHeight>=44,'Primary action remains touch accessible');
 assert.ok(menuMobile.optionsHeight>=44,'Options disclosure remains touch accessible');
 assert.equal(menuMobile.focusable.join(','),'start,training-open,menu-more','Three main menu choices on mobile');
 const menuImage=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 writeFileSync('artifacts/lumina-v081-menu-movil.png',Buffer.from(menuImage.data,'base64'));
 await evalJs(`(()=>{const g=window.Lumina.game;g.el.menu.hidden=true;g.locked=false;return true})()`);
 await delay(320);
 const image=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 writeFileSync('artifacts/lumina-v060-distrito-movil.png',Buffer.from(image.data,'base64'));

 const corePuzzle=await evalJs(`(()=>{
  const g=window.Lumina.game;
  if(g.logicLab.active)g.logicLab.close();
  g.el.menu.hidden=true;g.locked=false;g.transition=null;
  g.scene='metro';g.player.x=710;g.player.y=280;
  g.save.metroRelays=[true,false];g.save.coreProofs.metro=false;
  g.interactRegion();
  const opened=!document.getElementById('world-code-modal').hidden;
  const add=ops=>{for(const op of ops){
   const b=document.querySelector('#world-code-palette button[data-op="'+op+'"]');
   if(!b)throw Error('Missing code block '+op);b.click();
  }};
  add(['ENERGY','NETWORK','OR','NOT_ALARM','AND','OUTPUT']);
  document.getElementById('world-code-run').click();
  const rejected=document.getElementById('world-code-feedback').dataset.correct!=='true'&&!g.save.metroRelays[1];
  document.getElementById('world-code-clear').click();
  add(['ENERGY','NETWORK','AND','NOT_ALARM','AND','OUTPUT']);
  document.getElementById('world-code-run').click();
  const accepted=document.getElementById('world-code-feedback').dataset.correct==='true';
  const beforeReward=!g.save.metroRelays[1];
  document.getElementById('world-code-done').click();
  const rewarded=g.save.metroRelays[1]&&g.save.coreProofs.metro&&document.getElementById('world-code-modal').hidden;
  g.scene='archive';g.player.x=765;g.player.y=280;g.locked=false;
  g.save.archiveNodes=[true,true,false];g.save.coreProofs.archive=false;
  g.interactArchive();
  const archiveOpened=!document.getElementById('world-code-modal').hidden;
  add(['SET0','SENSOR0','SENSOR2','OUTPUT']);
  document.getElementById('world-code-run').click();
  const wrongSensor=document.getElementById('world-code-feedback').dataset.correct!=='true';
  document.getElementById('world-code-clear').click();
  add(['SET0','SENSOR0','SENSOR1','OUTPUT']);
  document.getElementById('world-code-run').click();
  const archiveAccepted=document.getElementById('world-code-feedback').dataset.correct==='true';
  document.getElementById('world-code-done').click();
  const archiveReward=g.save.archiveNodes[2]&&g.save.coreProofs.archive;
  for(let i=0;i<6&&!g.el.story.hidden;i++)g.nextDialogue();
  return {opened,rejected,accepted,beforeReward,rewarded,archiveOpened,wrongSensor,archiveAccepted,archiveReward};
 })()`);
 for(const [key,message] of Object.entries({
  opened:'Second metro relay opens real block programming',
  rejected:'Wrong boolean rule fails on changing sensors',
  accepted:'Correct logic works across four sensor cases',
  beforeReward:'World changes after completing the test, not before',
  rewarded:'Successful program lights real metro relay',
  archiveOpened:'Third memory requires array programming',
  wrongSensor:'Wrong sensor index cannot decode the record',
  archiveAccepted:'Correct array program works across input combinations',
  archiveReward:'Recovered record changes and persists in the world'
 }))assert.equal(corePuzzle[key],true,message);

 const checkpointProof=await evalJs(`(()=>{
  const g=window.Lumina.game,S=window.Lumina.Save,P=window.Lumina.Physics;
  g.scene='district';g.save.scene='district';g.save.started=true;
  g.save.cityGate=true;g.save.cityPowered=true;g.save.cityVariableSolved=true;
  g.player=P.spawn(855,280);g.player.onGround=true;g.locked=false;
  const written=g.recordWorldCheckpoint(),stored=g.save.checkpoints.district.x;
  const reloaded=S.load(g.storage),restored=g.spawn('district').x;
  const invalid=S.clean({...reloaded,checkpoints:{district:{x:9999,y:280}}}).checkpoints.district===undefined;
  g.scene='guardian';g.guardian.returnScene='archive';g.persist();
  const bossSave=S.load(g.storage).scene;
  g.scene='metro';g.save.scene='metro';g.save.checkpoints.metro={x:710,y:280};g.sceneChange('metro',95);
  return {written,stored,restored,invalid,bossSave,entry:g.player.x};
 })()`);
 assert.equal(checkpointProof.written,true,'Standing safely records an autosave checkpoint');
 assert.ok(checkpointProof.stored>=840&&checkpointProof.stored<=860,'Checkpoint is tied to world position');
 assert.ok(Math.abs(checkpointProof.restored-checkpointProof.stored)<1,'Reload restores player at checkpoint');
 assert.equal(checkpointProof.invalid,true,'Untrusted checkpoint outside a level is rejected');
 assert.equal(checkpointProof.bossSave,'archive','Boss progress never replaces archive scene with temporary arena');
 assert.equal(checkpointProof.entry,95,'Entering a scene respects the intended entry point');
 await evalJs(`(()=>{const g=window.Lumina.game;g.scene='metro';g.save.scene='metro';g.player.x=1200;g.player.y=280;g.locked=false;g.transition=null;return true})()`);

 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true,screenOrientation:{type:'portraitPrimary',angle:0}});
 await delay(170);
 const portrait=await evalJs(`(()=>{
  const g=window.Lumina.game;g.locked=false;g.el.menu.hidden=false;g.updateMenuState();
  const menu=document.querySelector('#menu .menu-v042');
  const rect=menu.getBoundingClientRect();
  const feedback=document.getElementById('feedback-open');
  feedback.click();
  const modal=document.getElementById('feedback-modal'),panel=modal.querySelector('.feedback-panel');
  const panelRect=panel.getBoundingClientRect();
  document.getElementById('feedback-category').value='No entendí una misión';
  document.getElementById('feedback-description').value='No entendí cómo leer el sensor del segundo relé y me perdí en el metro.';
  document.getElementById('feedback-copy').click();
  const text=document.getElementById('feedback-result').textContent;
  const noSend=modal.textContent.includes('No se envía automáticamente');
  document.getElementById('feedback-close').click();
  g.el.menu.hidden=true;g.locked=false;
  return {width:rect.width,height:rect.height,vw:innerWidth,vh:innerHeight,feedbackW:panelRect.width,
   feedbackHeight:panelRect.height,feedbackVisible:!modal.hidden||panelRect.width>0,
   text,closed:modal.hidden,noSend};
 })()`);
 assert.ok(portrait.width<=portrait.vw+1,'Main menu fits narrow portrait screens');
 assert.ok(portrait.height<=portrait.vh+1,'Main menu is scrollable in portrait');
 assert.ok(portrait.feedbackW<=portrait.vw+1,'Feedback dialog fits phone width');
 assert.ok(portrait.feedbackHeight<=portrait.vh+1,'Feedback dialog is vertically scrollable');
 assert.equal(portrait.closed,true,'Playtester can leave feedback modal');
 assert.equal(portrait.noSend,true,'Feedback clearly states it is never sent automatically');
 assert.match(portrait.text,/No entendí cómo leer el sensor/,'Playtester observation is included');
 assert.match(portrait.text,/Control: (táctil|teclado)/,'Device control method is included without personal identifiers');
 await send('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:2,mobile:true,screenOrientation:{type:'landscapePrimary',angle:90}});
 await delay(160);

 const storyGate=await evalJs(`(()=>{
  const g=window.Lumina.game;
  if(g.logicLab.active)g.logicLab.close();
  g.el.menu.hidden=true;g.locked=false;g.scene='metro';g.player.x=1230;g.player.y=280;
  g.save.metroRelays=[true,true];g.save.guardianDefeated=false;g.save.beacon=false;g.save.completed=false;
  g.transition=null;g.interactRegion();
  const blocked=!g.transition&&!g.locked;
  const target=window.Lumina.Guidance.pick('metro',g.save,950)?.label;
  g.save.guardianDefeated=true;g.interactRegion();
  const permitted=g.transition?.scene==='harbor';
  g.transition=null;g.locked=false;
  return {blocked,target,permitted};
 })()`);
 assert.equal(storyGate.blocked,true,'The train requires archive permission');
 assert.equal(storyGate.target,'Archivo de Ecos','Guidance points toward the archive');
 assert.equal(storyGate.permitted,true,'Guardian victory grants train access');

 const routeFail=await evalJs(`(()=>{
  const g=window.Lumina.game;g.scene='tower';g.player.x=975;g.player.y=280;
  g.el.menu.hidden=true;g.locked=false;g.save.beacon=true;g.save.signalBalanced=false;
  g.interact();
  const opened=!document.getElementById('route-modal').hidden;
  document.getElementById('route-operator').value='OR';
  document.getElementById('route-alarm').value='negate';
  document.getElementById('route-prediction').value='AISLAR';
  document.getElementById('route-run').click();
  return {opened,failed:document.getElementById('route-status').dataset.success==='false',
   trace:document.getElementById('route-trace').textContent.includes('BOREAL'),
   blocked:!g.save.signalBalanced&&document.getElementById('route-finish').hidden};
 })()`);
 assert.equal(routeFail.opened,true,'The lighthouse opens a final programming challenge');
 assert.equal(routeFail.failed,true,'Unsafe OR rule is rejected');
 assert.equal(routeFail.trace,true,'Diagnostic trace shows environmental states');
 assert.equal(routeFail.blocked,true,'Unsafe routing cannot complete the story');

 const routeImage=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 writeFileSync('artifacts/lumina-v090-final-movil.png',Buffer.from(routeImage.data,'base64'));
 const routeWin=await evalJs(`(()=>{
  const g=window.Lumina.game;
  document.getElementById('route-operator').value='AND';
  document.getElementById('route-alarm').value='negate';
  document.getElementById('route-prediction').value='TRANSMITIR';
  document.getElementById('route-run').click();
  const predictionBlocked=document.getElementById('route-status').dataset.success==='false';
  document.getElementById('route-prediction').value='AISLAR';
  document.getElementById('route-run').click();
  const accepted=document.getElementById('route-status').dataset.success==='true';
  const transmitted=g.save.signalBalanced;
  const available=!document.getElementById('route-finish').hidden;
  const flags=[],r=g.renderer,orig=r.tower;
  r.tower=function(x,y,on){flags.push(on);return orig.call(r,x,y,on);};
  try{g.renderer.world(g);}finally{r.tower=orig;}
  document.getElementById('route-finish').click();
  for(let i=0;i<12&&!g.el.story.hidden;i++)g.nextDialogue();
  return {accepted,predictionBlocked,transmitted,available,light:flags[0],completed:g.save.completed,
    ending:!document.getElementById('ending').hidden,title:document.querySelector('#ending h1')?.textContent};
 })()`);
 assert.equal(routeWin.predictionBlocked,true,'Correct rule needs a correct prediction');
 assert.equal(routeWin.accepted,true,'One rule works across four channel states');
 assert.equal(routeWin.transmitted,true,'The valid routing state is saved');
 assert.equal(routeWin.available,true,'Only valid rule unlocks completion');
 assert.equal(routeWin.light,true,'Lighthouse visibly illuminates on valid routing');
 assert.equal(routeWin.completed,true,'Chapter completion persists');
 assert.equal(routeWin.ending,true,'Player sees ending after final dialogue');
 assert.equal(routeWin.title,'LA RED RESPIRA');
 await evalJs(`(()=>{document.getElementById('ending').hidden=true;window.Lumina.game.locked=false;return true;})()`);

 // Wait for the real service worker to cache the app shell, then reload offline.
 const offlineReady=await evalJs("Promise.race([navigator.serviceWorker.ready.then(()=>true),new Promise(r=>setTimeout(()=>r(false),10000))])");
 assert.equal(offlineReady,true,'PWA worker should activate after opening on localhost');
 await send('Network.enable');
 await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
 await send('Page.reload',{ignoreCache:false});
 await until(async()=>await evalJs("document.documentElement.dataset.luminaReady==='true'"),12000);
 const offline=await evalJs("({ready:!!window.Lumina.game,levels:window.Lumina.game.save.labCompleted.slice(),language:window.Lumina.game.save.learningLanguage,discovered:window.Lumina.game.save.labDiscovered,refuge:window.Lumina.game.save.refugePowered,reading:document.getElementById('reading-scale').value,guidance:window.Lumina.game.guidanceMode,musicOn:window.Lumina.game.soundEngine.musicOn,fxOn:window.Lumina.game.audioOn,musicVol:window.Lumina.game.soundEngine.musicVol,fxVol:window.Lumina.game.soundEngine.fxVol})");
 assert.equal(offline.musicOn,true,'Music stays enabled offline');
 assert.equal(offline.fxOn,true,'Effects stay enabled offline');
 assert.equal(offline.musicVol,.3,'Music volume persists across an offline reload');
 assert.equal(offline.fxVol,.65,'Effects volume persists independently across an offline reload');
 assert.equal(offline.ready,true,'Lúmina should start without network');
 assert.equal(offline.language,'python','Chosen language survives offline restart');
 assert.equal(offline.discovered,true,'Laboratory discovery remains stored offline');
 assert.equal(offline.refuge,true,'Workshop heater survives offline reloading');
 assert.equal(offline.reading,'1.3','Reading scale survives offline reloading');
 assert.equal(offline.guidance,'hint','Direction guidance preference survives offline restart');
 assert.equal(offline.levels.includes(3),true,'Lab progress survives offline restart');
 assert.equal(offline.levels.length,8,'All missions survive offline reload');
 await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
 await delay(150);
 // Follow the logical story from a NEW SAVE using each real in-game puzzle and transition.
 // Positions jump between interaction anchors; a separate physical playtest is still required.
 const journeyCity=await evalJs(`(()=>{
  const g=window.Lumina.game;
  g.start(true);if(g.prologue.active)g.prologue.finish();
  g.el.menu.hidden=true;g.locked=false;
  g.player.x=606;g.player.y=280;g.interact();
  for(const [id,checked] of [['logic-power',true],['logic-network',true],['logic-alarm',false]]){
   const e=document.getElementById(id);e.checked=checked;e.dispatchEvent(new Event('change',{bubbles:true}));
  }
  document.getElementById('logic-try').click();
  const gate=g.save.cityGate;
  g.player.x=1090;g.player.y=280;g.interact();
  const power=g.save.cityPowered;
  g.player.x=1505;g.player.y=280;g.interact();
  for(let n=0;n<2;n++)document.querySelector('#variable-modal .variable-palette button[data-operation=ADD2]').click();
  for(let n=0;n<2;n++)document.getElementById('variable-step').click();
  const variable=g.save.cityVariableSolved;
  g.academy.closeVariable();
  g.player.x=2240;g.player.y=280;g.interact();
  const nixGate=!g.save.cityCompleted&&document.getElementById('city-ending').hidden;
  g.player.x=2040;g.player.y=280;g.interact();
  const editor=g.editor;
  const cityEditor=editor.opened&&editor.id==='cityNix';
  for(const cmd of ['EAST','EAST','PULSE'])editor.append(cmd);
  const solved=window.Lumina.Program.run('cityNix',editor.blocks).success;
  editor.execute();
  return {gate,power,variable,nixGate,cityEditor,solved};
 })()`);
 for(const [name,description] of Object.entries({gate:'City Boolean console authorizes the physical door',
  power:'City relay restores power',variable:'Real variable editor extends the bridge',
  nixGate:'A new player cannot leave Aurora before finding NIX',
  cityEditor:'The NIX puzzle is unlocked in the city',
  solved:'Movement programming wakes the urban NIX'}))assert.equal(journeyCity[name],true,description);
 await until(async()=>await evalJs("!document.getElementById('program-claim').hidden"),15000);
 const journeyDepart=await evalJs(`(()=>{
  const g=window.Lumina.game;
  document.getElementById('program-claim').click();
  const awake=g.save.cityNixAwake;
  g.player.x=2240;g.player.y=280;g.interact();
  const cityEnd=!document.getElementById('city-ending').hidden;
  document.getElementById('city-end-close').click();
  g.updateTransition(2);
  for(let n=0;n<10&&!g.el.story.hidden;n++)g.nextDialogue();
  return {awake,cityEnd,inMetro:g.scene==='metro'};
 })()`);
 assert.equal(journeyDepart.awake,true,'City NIX runs programmed directions');
 assert.equal(journeyDepart.cityEnd,true,'Aurora chapter opens its real ending');
 assert.equal(journeyDepart.inMetro,true,'The real station transition succeeds');

 const journeyArchive=await evalJs(`(()=>{
  const g=window.Lumina.game;
  const talk=()=>{for(let n=0;n<10&&!g.el.story.hidden;n++)g.nextDialogue();};
  const activate=(x)=>{g.player.x=x;g.player.y=280;g.interact();};
  activate(340);const relay1=g.save.metroRelays[0];
  activate(710);
  const coding=!document.getElementById('world-code-modal').hidden;
  const add=ops=>{for(const op of ops){const b=document.querySelector('#world-code-palette button[data-op="'+op+'"]');if(!b)throw Error('Missing '+op);b.click();}};
  add(['ENERGY','NETWORK','AND','NOT_ALARM','AND','OUTPUT']);
  document.getElementById('world-code-run').click();
  const safety=document.getElementById('world-code-feedback').dataset.correct==='true';
  document.getElementById('world-code-done').click();
  activate(934);g.updateTransition(2);talk();
  const entered=g.scene==='archive';
  activate(275);talk();activate(520);talk();
  const memories=g.save.archiveNodes[0]&&g.save.archiveNodes[1];
  activate(765);
  const decode=!document.getElementById('world-code-modal').hidden;
  add(['SET0','SENSOR0','SENSOR1','OUTPUT']);
  document.getElementById('world-code-run').click();
  const arrays=document.getElementById('world-code-feedback').dataset.correct==='true';
  document.getElementById('world-code-done').click();talk();
  activate(925);const guardian=g.guardian.active;
  const pads=[425,330,425];
  for(const x of pads){g.player.x=x;g.player.y=280;g.guardian.action();}
  talk();
  const defeated=g.save.guardianDefeated;
  activate(68);g.updateTransition(2);talk();
  const backMetro=g.scene==='metro';
  activate(1230);g.updateTransition(2);talk();
  return {relay1,coding,safety,entered,memories,decode,arrays,guardian,defeated,backMetro,harbor:g.scene==='harbor'};
 })()`);
 for(const [name,description] of Object.entries({relay1:'First station relay enables normally',
  coding:'Second relay triggers Boolean programming',
  safety:'Safe Boolean program works for the train',
  entered:'The Archive opens after both relays',
  memories:'Two archive records are read in order',
  decode:'Last archive record requires array programming',
  arrays:'Sensor array program decodes memory',
  guardian:'Centinela challenge starts after evidence',
  defeated:'Three Boolean boss phases can be passed',
  backMetro:'Archive return leads to station',
  harbor:'Authorized train reaches the northern harbor'}))assert.equal(journeyArchive[name],true,description);
 const journeyHarbor=await evalJs(`(()=>{
  const g=window.Lumina.game;
  const talk=()=>{for(let n=0;n<12&&!g.el.story.hidden;n++)g.nextDialogue();};
  g.player.x=177;g.player.y=271;g.checkOrbs(g.player);
  const moving=g.save.orbs.includes('move');
  if(g.orbDialog)g.closeOrb();
  g.player.x=473;g.player.y=280;g.interact();g.updateTransition(2);talk();
  const workshop=g.scene==='workshop';
  g.player.x=284;g.player.y=273;g.checkOrbs(g.player);
  const codingOrb=g.save.orbs.includes('code');
  if(g.orbDialog)g.closeOrb();
  g.player.x=435;g.player.y=280;g.interact();
  const editor=g.editor,repair=editor.opened&&editor.id==='nix';
  for(const op of ['EAST','EAST','EAST','PICK'])editor.append(op);
  const program=window.Lumina.Program.run('nix',editor.blocks).success;
  editor.execute();
  return {moving,workshop,codingOrb,repair,program};
 })()`);
 for(const [k,description] of Object.entries({
  moving:'Player collects the movement orb in the harbor',
  workshop:'Workshop entry is connected to the harbor',
  codingOrb:'Player collects the coding orb before NIX',
  repair:'NIX repair editor opens from the actual bench',
  program:'Three movement instructions and PICK rescue the robot'
 }))assert.equal(journeyHarbor[k],true,description);
 await until(async()=>await evalJs("!document.getElementById('program-claim').hidden"),15000);
 const journeyBridge=await evalJs(`(()=>{
  const g=window.Lumina.game;
  const talk=()=>{for(let n=0;n<12&&!g.el.story.hidden;n++)g.nextDialogue();};
  document.getElementById('program-claim').click();talk();
  const robot=g.save.robot;
  g.player.x=95;g.player.y=280;g.interact();g.updateTransition(2);talk();
  const returned=g.scene==='harbor';
  g.player.x=1140;g.player.y=280;g.interact();g.updateTransition(2);talk();
  const bridge=g.scene==='bridge';
  g.player.x=302;g.player.y=225;g.checkOrbs(g.player);
  const jump=g.save.orbs.includes('jump');if(g.orbDialog)g.closeOrb();
  g.player.x=1282;g.player.y=267;g.checkOrbs(g.player);
  const dash=g.save.orbs.includes('dash');if(g.orbDialog)g.closeOrb();
  g.energy=100;g.player.x=1418;g.player.y=280;g.player.onGround=true;
  const old={dash:g.input.consumeDash,axis:g.input.axis,jump:g.input.consumeJump,hold:g.input.holdingJump};
  g.input.consumeDash=()=>true;g.input.axis=()=>({x:1,y:0});g.input.consumeJump=()=>false;g.input.holdingJump=()=>false;
  try{for(let n=0;n<5&&!g.save.gateBroken;n++){g.energy=100;g.move(.05);}}finally{
   g.input.consumeDash=old.dash;g.input.axis=old.axis;g.input.consumeJump=old.jump;g.input.holdingJump=old.hold;
  }
  const crystal=g.save.gateBroken;
  if(crystal){g.player.x=1650;g.player.y=280;g.interact();g.updateTransition(2);talk();}
  const tower=g.scene==='tower';
  if(tower){
   g.player.x=350;g.player.y=280;g.interact();
   const e=g.editor;e.append('REPEAT');e.append('EAST','inner');e.append('PULSE','inner');
   const pulses=window.Lumina.Program.run('beacon',e.blocks).success;
   if(pulses)e.execute();
   return {robot,returned,bridge,jump,dash,crystal,tower,pulses};
  }
  return {robot,returned,bridge,jump,dash,crystal,tower,pulses:false};
 })()`);
 for(const [k,description] of Object.entries({
  robot:'The workshop sequence physically restores NIX',
  returned:'Workshop exit leads back to harbor',
  bridge:'The restored robot lets Iris cross to Boreal',
  jump:'Jump orb is collected in the actual bridge scene',
  dash:'Dash orb is collected before the crystal gate',
  crystal:'A real charged dash breaks the blocking crystal',
  tower:'Crossing the opened barrier enters the tower',
  pulses:'REPETIR three times activates every beacon switch'
 }))assert.equal(journeyBridge[k],true,description);
 await until(async()=>await evalJs("!document.getElementById('program-claim').hidden"),15000);
 const journeyFinish=await evalJs(`(()=>{
  const g=window.Lumina.game;
  document.getElementById('program-claim').click();
  const generator=g.save.beacon;
  g.player.x=975;g.player.y=280;g.interact();
  const routing=!document.getElementById('route-modal').hidden;
  document.getElementById('route-operator').value='AND';
  document.getElementById('route-alarm').value='negate';
  document.getElementById('route-prediction').value='AISLAR';
  document.getElementById('route-run').click();
  const safe=document.getElementById('route-status').dataset.success==='true';
  document.getElementById('route-finish').click();
  for(let n=0;n<14&&!g.el.story.hidden;n++)g.nextDialogue();
  const saved=window.Lumina.Save.load(g.storage);
  return {generator,routing,safe,ending:!document.getElementById('ending').hidden,
   completed:g.save.completed,persisted:saved.completed&&saved.signalBalanced,
   storyMoments:Object.keys(g.save.storyBeats).filter(x=>g.save.storyBeats[x]).length};
 })()`);
 for(const [k,description] of Object.entries({
  generator:'Beacon loop charges the real generator',
  routing:'Final safety puzzle appears at the tower lens',
  safe:'The final rule and prediction pass four states',
  ending:'The complete chapter ends with the proper dialogue',
  completed:'The game marks the chapter as completed',
  persisted:'The finale persists across a fresh save read'
 }))assert.equal(journeyFinish[k],true,description);
 assert.ok(journeyFinish.storyMoments>=6,'Story beats were experienced during the whole route');
 const bossReplay=await evalJs(`(()=>{
  const g=window.Lumina.game;
  document.getElementById('ending').hidden=true;
  g.locked=false;g.el.menu.hidden=false;g.scene='tower';
  g.updateMenuState();
  const control=document.getElementById('guardian-replay');
  const available=!control.hidden&&g.save.guardianDefeated;
  control.click();
  const started=g.guardian.active&&g.guardian.replay&&g.guardian.phase===0&&g.scene==='guardian';
  g.guardian.leave();
  const returned=g.scene==='tower'&&g.save.completed&&g.save.guardianDefeated;
  const announcement=document.getElementById('guardian-attack').getAttribute('aria-live');
  g.locked=false;g.el.menu.hidden=true;
  return {available,started,returned,announcement};
 })()`);
 assert.equal(bossReplay.available,true,'Centinela replay unlocks after first victory');
 assert.equal(bossReplay.started,true,'Replay starts at round one without erasing the campaign');
 assert.equal(bossReplay.returned,true,'Leaving replay restores the prior world and completed story');
 assert.equal(bossReplay.announcement,'polite','Boss warning can be read by assistive technology');

 // Exercise UI at three phone dimensions; physical Safari remains a separate acceptance test.
 for(const profile of [
  {width:667,height:375,type:'landscapePrimary',angle:90},
  {width:932,height:430,type:'landscapePrimary',angle:90},
  {width:390,height:844,type:'portraitPrimary',angle:0}
 ]){
  await send('Emulation.setDeviceMetricsOverride',{width:profile.width,height:profile.height,deviceScaleFactor:2,mobile:true,
   screenOrientation:{type:profile.type,angle:profile.angle}});
  await delay(160);
  const screenFit=await evalJs(`(()=>{
   const g=window.Lumina.game;
   document.getElementById('ending').hidden=true;
   g.locked=false;g.el.menu.hidden=false;
   const menu=document.querySelector('#menu .menu-v042').getBoundingClientRect();
   g.el.menu.hidden=true;
   g.scene='metro';g.player.x=710;g.player.y=280;
   g.save.coreProofs.metro=false;g.save.metroRelays[1]=false;g.interactRegion();
   const core=document.querySelector('#world-code-modal .world-code-panel').getBoundingClientRect();
   document.querySelector('#world-code-palette button').click();
   const target=document.querySelector('#world-code-list button[data-edit=remove]').getBoundingClientRect();
   const add=document.querySelector('#world-code-palette button').getBoundingClientRect();
   document.getElementById('world-code-close').click();
   g.scene='tower';g.save.beacon=true;g.locked=false;g.openRouting();
   const route=document.querySelector('#route-modal .route-panel').getBoundingClientRect();
   document.getElementById('route-close').click();
   return {vw:innerWidth,vh:innerHeight,menuW:menu.width,menuH:menu.height,
    codeW:core.width,codeH:core.height,routeW:route.width,routeH:route.height,
    targetH:target.height,addH:add.height};
  })()`);
  for(const rect of [['menu',screenFit.menuW,screenFit.menuH],['world editor',screenFit.codeW,screenFit.codeH],['final puzzle',screenFit.routeW,screenFit.routeH]]){
   assert.ok(rect[1]<=screenFit.vw+1,rect[0]+' fits '+profile.width+'px width');
   assert.ok(rect[2]<=screenFit.vh+1,rect[0]+' fits '+profile.height+'px height');
  }
  assert.ok(screenFit.addH>=44,'Adding instructions has mobile-sized touch targets');
  assert.ok(screenFit.targetH>=44,'Editing instructions has mobile-sized touch targets');
 }
 assert.deepEqual(errors,[],'No uncaught JavaScript exceptions in browser');
 console.log('Browser PASS: boot, 8 lessons, real palette clicks, save, kiosk, mobile landscape offline navigation and screenshots');
}catch(error){console.error('BROWSER SMOKE FAILURE:',error);process.exitCode=1;}
finally{
 try{socket?.close()}catch{}
 try{chrome.kill('SIGKILL')}catch{}
 app.close();
 // Chrome can finish flushing its profile after the smoke assertions pass.
 // Cleanup must never turn a successful test into a false failure.
 try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:150});}
 catch(e){console.warn('Temporary browser profile cleanup:',e.code);}
}
