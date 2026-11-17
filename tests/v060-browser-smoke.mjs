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
 const first=await evalJs(`(()=>{
   document.getElementById('training-offer-skip').click();
   document.getElementById('lab-open').click();
   const game=window.Lumina.game,lab=game.logicLab;
   document.getElementById('lab-answer').value='12';document.getElementById('lab-run').click();
   return {active:lab.active,done:game.save.labCompleted.includes(0),title:document.getElementById('lab-title').textContent};
 })()`);
 assert.equal(first.active,true);assert.equal(first.done,true);assert.match(first.title,/Funciones/);
 const program=await evalJs(`(()=>{
  const g=window.Lumina.game,lab=g.logicLab;lab.index=3;lab.render();
  for(const op of ['SET2','ADD3','OUTPUT']){
   const button=document.querySelector('#lab-palette button[data-op="'+op+'"]');
   if(!button)throw Error('Missing palette operation '+op);button.click();
  }
  document.getElementById('lab-run').click();
  return {done:g.save.labCompleted.includes(3),blocks:document.querySelectorAll('#lab-blocks .lab-block').length,
   text:document.getElementById('lab-feedback').textContent};
 })()`);
 assert.equal(program.done,true);assert.equal(program.blocks,3);
 // Complete the remaining exercises using the same palette clicks a player uses.
 const course=await evalJs(`(()=>{
  const game=window.Lumina.game,lab=game.logicLab;
  const solutions={
   1:10,2:5,
   4:['SET0','REPEAT3_ADD2','OUTPUT'],
   5:['SET0','SENSOR0','SENSOR1','OUTPUT'],
   6:['ENERGY','NETWORK','AND','NOT_ALARM','AND','OUTPUT'],
   7:['SET2','ADD3','TEST5','OUTPUT']
  };
  const results=[];
  for(const [key,answer] of Object.entries(solutions)){
   const i=Number(key);lab.index=i;lab.render();
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

 await send('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:2,mobile:true,screenOrientation:{type:'landscapePrimary',angle:90}});
 await delay(260);
 const fit=await evalJs(`(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,
  modal:document.querySelector('#logic-lab .lab-panel').getBoundingClientRect().width,
  close:!!document.getElementById('lab-exit')}))()`);
 assert.ok(fit.modal<=fit.viewport,'Lab modal fits mobile horizontal width');
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
 await delay(320);
 const image=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 writeFileSync('artifacts/lumina-v060-distrito-movil.png',Buffer.from(image.data,'base64'));

 // Wait for the real service worker to cache the app shell, then reload offline.
 const offlineReady=await evalJs("Promise.race([navigator.serviceWorker.ready.then(()=>true),new Promise(r=>setTimeout(()=>r(false),10000))])");
 assert.equal(offlineReady,true,'PWA worker should activate after opening on localhost');
 await send('Network.enable');
 await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
 await send('Page.reload',{ignoreCache:false});
 await until(async()=>await evalJs("document.documentElement.dataset.luminaReady==='true'"),12000);
 const offline=await evalJs("({ready:!!window.Lumina.game,levels:window.Lumina.game.save.labCompleted.slice()})");
 assert.equal(offline.ready,true,'Lúmina should start without network');
 assert.equal(offline.levels.includes(3),true,'Lab progress survives offline restart');
 assert.equal(offline.levels.length,8,'All missions survive offline reload');
 await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
 await delay(150);
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
