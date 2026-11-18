// Browser-engine compatibility: WebKit is not a replacement for Safari on a physical iPhone.
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {webkit} from 'playwright';

const root=path.resolve('.');
const types={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=http.createServer((request,response)=>{
 try{
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const filename=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!filename.startsWith(root+path.sep)){response.writeHead(403);response.end();return;}
  const content=readFileSync(filename);
  response.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-cache'});
  response.end(content);
 }catch{response.writeHead(404);response.end('Missing');}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
let browser;
try{
 browser=await webkit.launch({headless:true});
 const context=await browser.newContext({viewport:{width:844,height:390},screen:{width:844,height:390},deviceScaleFactor:2,isMobile:true,hasTouch:true,acceptDownloads:true});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.luminaReady==='true',null,{timeout:25000});
 const boot=await page.evaluate(()=>({
  game:!!window.Lumina?.game,hero:window.Lumina?.game?.renderer?.hero?.src.endsWith('/hero-atlas.png'),
  physics:!!window.Lumina?.Physics?.step,help:!!window.Lumina?.GuidedHelp?.key,
  transfer:!!window.Lumina?.PlayerTools?.pack,modal:!!document.getElementById('world-code-modal')
 }));
 for(const [key,value] of Object.entries(boot))assert.equal(value,true,'WebKit boot: '+key);
 await page.waitForFunction(()=>window.Lumina?.game?.renderer?.hero?.complete===true,null,{timeout:12000});
 assert.ok(await page.evaluate(()=>window.Lumina.game.renderer.hero.naturalWidth>=768),'WebKit decodes the original pixel-art PNG');
 if(await page.locator('#training-offer-skip').isVisible())await page.locator('#training-offer-skip').click();
 await page.locator('#start').click();
 await page.evaluate(()=>{
  const g=window.Lumina.game;
  if(g.prologue.active)g.prologue.finish();
  g.el.story.hidden=true;g.el.menu.hidden=true;g.locked=false;g.save.started=true;
  g.player=window.Lumina.Physics.spawn(90,280);
 });
 const startX=await page.evaluate(()=>window.Lumina.game.player.x);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);
 const during=await page.evaluate(()=>{
  const g=window.Lumina.game;
  const axis=g.input.axis().x,received=g.input.keys.has('ArrowRight');
  // Headless WebKit can throttle requestAnimationFrame; drive a fixed number of
  // in-game physics frames while preserving the actual held keyboard event.
  for(let i=0;i<40;i++)g.move(1/60);
  return {x:g.player.x,axis,received,locked:g.locked,editing:g.input.isEditing()};
 });
 await page.keyboard.up('ArrowRight');
 assert.equal(during.received,true,'WebKit dispatches a real held ArrowRight key');
 assert.equal(during.axis,1,'WebKit input becomes the actual game movement axis');
 assert.equal(during.locked,false,'The adventure is not blocked by an overlay');
 assert.ok(during.x>startX+45,'Holding an arrow advances Iris with real physics: '+JSON.stringify({startX,during}));
 await page.evaluate(()=>{const g=window.Lumina.game;g.scene='bridge';g.player=window.Lumina.Physics.spawn(240,277);g.locked=false;});
 const worldHints=await page.evaluate(()=>{
  const g=window.Lumina.game;g.guidanceMode='hint';g.worldTime=50;
  const a=g.hint(),b=g.hint();return {a,b,announcement:document.getElementById('guidance-announcement').textContent};
 });
 assert.match(worldHints.a,/salto|orbe|Orbe/i,'Wayfinding explains the ice jump');
 assert.ok(worldHints.b.length>15,'More detailed second hint is available');
 assert.equal(worldHints.b,worldHints.announcement,'WebKit screen reader status follows hints');
 mkdirSync('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/lumina-webkit-landscape.png',animations:'disabled'});
 await page.evaluate(()=>window.Lumina.game.openMenu());
 await page.evaluate(()=>{
  document.getElementById('menu-more').open=true;
  document.getElementById('menu-settings').open=true;
 });
 await page.locator('#contrast-button').click();
 assert.equal(await page.evaluate(()=>document.body.classList.contains('lumina-contrast')),true,'Contrast switch works in WebKit');
 assert.equal(await page.evaluate(()=>localStorage.getItem('lumina-contrast-v1')),'on','Contrast is stored');
 const [download]=await Promise.all([
  page.waitForEvent('download',{timeout:15000}),
  page.locator('#save-export').click()
 ]);
 assert.match(download.suggestedFilename(),/^lumina-partida-\d{4}-\d{2}-\d{2}\.json$/,'WebKit saves a portable backup');
 const snapshot=await page.evaluate(()=>{
  const g=window.Lumina.game;
  return JSON.stringify(window.Lumina.PlayerTools.pack({...g.save,cityGate:true,started:true,scene:'district'}));
 });
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#save-choose-file').setInputFiles({name:'lumina-partida.json',mimeType:'application/json',buffer:Buffer.from(snapshot)});
 await page.waitForFunction(()=>document.documentElement.dataset.luminaReady==='true'&&window.Lumina?.game?.save?.cityGate===true,null,{timeout:25000});
 assert.equal(await page.evaluate(()=>window.Lumina.game.save.cityGate),true,'Import completes after confirmation and reload');
 assert.equal(await page.evaluate(()=>document.body.classList.contains('lumina-contrast')),true,'High contrast survives reload');
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(200);
 const portrait=await page.evaluate(()=>{
  const r=document.getElementById('rotate-overlay');
  const menu=document.querySelector('#menu .menu-v042').getBoundingClientRect();
  return {rotate:!r.hidden,menuWidth:menu.width,vw:innerWidth,contrast:document.body.classList.contains('lumina-contrast')};
 });
 assert.equal(portrait.rotate,true,'Portrait phone receives a landscape rotation prompt');
 assert.ok(portrait.menuWidth<=portrait.vw+1,'Menu fits portrait width');
 await page.screenshot({path:'artifacts/lumina-webkit-portrait.png',animations:'disabled'});
 assert.deepEqual(errors,[],'No uncaught WebKit JavaScript errors');
 await context.close();
 console.log('WEBKIT PASS: game boot, movement, contextual help, iPhone-style viewport, backup download/import and contrast');
}catch(error){console.error('WEBKIT SMOKE FAILURE:',error);process.exitCode=1;}
finally{try{await browser?.close()}catch{}await new Promise(resolve=>server.close(resolve));}
