/* Core gameplay: world checkpoints and physically situated programming challenges. */
(function(root){'use strict';
 const Game=root.Game,Physics=root.Physics,Model=root.LogicLabModel,Narrative=root.Narrative;
 if(!Game||!Physics||!Model||!Narrative)throw Error('Game core has not finished loading');
 const MISSIONS=Object.freeze({
  metro:Object.freeze({
   index:6,title:'Relé dos · Comprobación de seguridad',
   context:'La red no puede alimentar un tren mientras falte energía, no exista conexión o esté activa una alarma. Construye una secuencia que funcione aunque cambien los sensores.',
   lesson:'Una variable booleana solo puede ser VERDADERO o FALSO. Y necesita que las dos entradas sean verdaderas; NO invierte el valor de la alarma. Cada bloque deja un valor disponible para el siguiente.',
   palette:['ENERGY','NETWORK','NOT_ALARM','AND','OR','OUTPUT'],
   cases:Object.freeze([
    {energy:true,network:true,alarm:false,target:true},
    {energy:false,network:true,alarm:false,target:false},
    {energy:true,network:false,alarm:false,target:false},
    {energy:true,network:true,alarm:true,target:false}
   ]),
   hints:['Empieza por LEER energía y LEER red. ¿Con qué bloque decides si ambas están disponibles?',
    'También hay que LEER NO alarma: una alarma encendida debe negar el paso.',
    'Cuando combines energía, red y ausencia de alarma, termina con MOSTRAR resultado. Una instrucción debe funcionar para todos los sensores.']
  }),
  archive:Object.freeze({
   index:5,title:'Registro tres · Datos del hielo',
   context:'Las dos primeras lecturas contienen partes de una coordenada. La tercera es una comprobación independiente. Recupera la suma de los primeros dos sensores incluso cuando cambien sus números.',
   lesson:'Un arreglo guarda varios datos en posiciones numeradas. El primero está en sensores[0] y el segundo en sensores[1]. Inicializa una variable antes de ir acumulando las lecturas.',
   palette:['SET0','SET2','SENSOR0','SENSOR1','SENSOR2','OUTPUT'],
   cases:Object.freeze([
    {sensors:[3,7,11],target:10},
    {sensors:[5,2,9],target:7},
    {sensors:[8,1,13],target:9},
    {sensors:[2,0,6],target:2}
   ]),
   hints:['Primero guarda 0 en la variable carga. Así podrás añadir datos sin arrastrar valores anteriores.',
    'Suma las posiciones 0 y 1. La lectura de la posición 2 no forma parte de la coordenada.',
    'Después de sumar ambas lecturas, termina con MOSTRAR resultado. Prueba varios arreglos.']
  })
 });
 const safeScenes=Object.freeze({district:2330,metro:1320,rooftops:1020,archive:1000,harbor:1190,workshop:750,tower:1050});
 function goodCheckpoint(scene,p){
  return Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&p.x>=22&&p.x<=(safeScenes[scene]||0)&&p.y>=100&&p.y<=335;
 }
 function shouldChallenge(save,scene){
  if(!save||!MISSIONS[scene])return false;
  if(scene==='metro')return !save.metroRelays?.[1]&&!save.coreProofs?.metro;
  return !save.archiveNodes?.[2]&&!save.coreProofs?.archive;
 }
 function checkProgram(scene,blocks){
  const m=MISSIONS[scene];if(!m||!Array.isArray(blocks)||blocks.length>14)return {passed:false,cases:[],error:'Secuencia inválida'};
  const cases=m.cases.map(input=>Model.runProgram(m.index,blocks,input));
  return {passed:cases.every(x=>x.valid&&x.correct),cases,error:cases.find(x=>!x.valid)?.error||''};
 }
 root.CoreWorld=Object.freeze({MISSIONS,safeScenes,goodCheckpoint,shouldChallenge,checkProgram});
 const style=document.createElement('style');
 style.textContent=`
 .world-code-panel{width:min(700px,96vw);max-height:min(94dvh,760px);overflow:auto;color:#f0f8ee;background:linear-gradient(155deg,#203c50,#0b2439);border:3px solid #95dcc8;border-radius:12px;box-shadow:7px 8px #081c2b;padding:14px 19px}
 .world-code-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.world-code-header small{color:#b3efda;font:800 11px/1.5 monospace}.world-code-header h2{font:900 clamp(19px,3.5vw,27px)/1.2 system-ui;margin:4px 0}
 .world-code-header button{min-width:44px;min-height:44px;font-size:21px}
 .world-code-panel p,.world-code-panel summary{font:500 14px/1.5 system-ui}
 .world-code-panel details{border-left:3px solid #e3cb91;background:#234659;padding:8px 11px;margin:8px 0}
 .world-code-panel summary{cursor:pointer;font-weight:800}
 .world-code-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:10px 0}
 .world-code-layout>div{min-width:0;background:#12364a;border:1px solid #547d89;padding:10px;border-radius:8px}
 .world-code-layout b{font:800 12px/1.5 system-ui}
 .world-code-palette,.world-code-list{display:grid;gap:6px;margin-top:8px}
 .world-code-palette button,.world-code-list button{min-height:44px;border:1px solid #69989e;border-radius:5px;color:#f4fff5;background:#204f63;font:700 12px/1.3 ui-monospace,monospace;padding:9px;text-align:left;overflow-wrap:anywhere}
 .world-code-list>div{display:flex;align-items:center;gap:6px;background:#183f54;padding:5px;border-radius:6px}
 .world-code-list>div>span{flex:1;min-width:0;overflow-wrap:anywhere;font:700 12px/1.3 ui-monospace,monospace}
 .world-code-list>div button{min-height:44px;min-width:44px;padding:7px;text-align:center}
 .world-code-list>div button:disabled{opacity:.4}
 .world-code-actions{display:flex;gap:8px;flex-wrap:wrap}.world-code-actions button{flex:1 1 180px;min-height:47px}
 .world-code-feedback{padding:10px 12px;background:#204b57;border-left:4px solid #edd09a;min-height:40px}
 .world-code-feedback[data-correct=true]{border-color:#70efb4;color:#d0ffe4}
 .world-code-trace{white-space:pre-wrap;background:#071d31;color:#beecda;font:700 12px/1.55 ui-monospace,monospace;padding:9px;overflow:auto;max-height:21dvh}
 .world-code-panel button:focus-visible,.world-code-panel summary:focus-visible{outline:3px solid #ffe1a3;outline-offset:2px}
 .world-code-panel button{touch-action:manipulation}
 @media(max-width:650px){.world-code-layout{grid-template-columns:1fr}.world-code-panel{padding:9px 12px}.world-code-panel p{font-size:13px}.world-code-palette{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(orientation:landscape) and (max-height:500px){.world-code-panel{max-height:98dvh;padding:7px 10px}.world-code-layout{grid-template-columns:1fr 1fr;gap:6px;margin:5px 0}.world-code-palette{grid-template-columns:repeat(2,minmax(0,1fr))}.world-code-palette button{min-height:44px;padding:5px}.world-code-panel p{font-size:12px;margin:5px 0}.world-code-trace{max-height:80px}}
 `;
 document.head.append(style);
 const modal=document.createElement('div');modal.id='world-code-modal';modal.className='modal backdrop';modal.hidden=true;
 modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','world-code-title');
 modal.innerHTML=`<section class="world-code-panel" tabindex="-1">
   <header class="world-code-header"><div><small>REPROGRAMAR UNA MÁQUINA · INSTRUCCIONES REALES</small><h2 id="world-code-title"></h2></div><button id="world-code-close" class="secondary" type="button" aria-label="Cerrar y volver al mundo">×</button></header>
   <p id="world-code-context"></p>
   <details><summary>📖 ¿Cómo funciona? Leer una explicación corta</summary><p id="world-code-lesson"></p></details>
   <div class="world-code-layout">
    <div><b>Instrucciones disponibles</b><div class="world-code-palette" id="world-code-palette"></div></div>
    <div><b>Tu secuencia, de arriba hacia abajo</b><div class="world-code-list" id="world-code-list" role="list"></div></div>
   </div>
   <p class="world-code-feedback" id="world-code-feedback" role="status" aria-live="polite">Construye una secuencia y pulsa Ejecutar.</p>
   <pre id="world-code-trace" class="world-code-trace" hidden></pre>
   <div class="world-code-actions">
    <button id="world-code-help" class="secondary" type="button">Pista</button>
    <button id="world-code-clear" class="secondary" type="button">Limpiar</button>
    <button id="world-code-run" class="primary" type="button">▶ Ejecutar</button>
    <button id="world-code-done" class="primary" type="button" hidden>✓ Continuar la aventura →</button>
   </div>
  </section>`;
 document.body.append(modal);
 const el=id=>document.getElementById(id);
 let active=null,blocks=[],hints=0,game=null,from=null;
 const draft=()=>blocks.slice();
 const feedback=(message,correct=false)=>{const out=el('world-code-feedback');out.textContent=message;out.dataset.correct=String(correct);};
 const label=op=>root.LogicLabModel?.OPS?.[op]||({
  ENERGY:'LEER energía',NETWORK:'LEER red',NOT_ALARM:'LEER NO alarma',AND:'Y · combinar',OR:'O · combinar',
  SET0:'carga ← 0',SET2:'carga ← 2',SENSOR0:'SUMAR sensor[0]',SENSOR1:'SUMAR sensor[1]',SENSOR2:'SUMAR sensor[2]',OUTPUT:'MOSTRAR resultado'
 }[op]||op);
 const render=()=>{
  const m=MISSIONS[active];if(!m)return;
  el('world-code-palette').replaceChildren(...m.palette.map(op=>{
   const b=document.createElement('button');b.type='button';b.dataset.op=op;b.textContent='+ '+label(op);b.disabled=blocks.length>=14;return b;
  }));
  el('world-code-list').replaceChildren(...blocks.map((op,i)=>{
   const row=document.createElement('div');row.setAttribute('role','listitem');
   const title=document.createElement('span');title.textContent=String(i+1).padStart(2,'0')+' · '+label(op);row.append(title);
   for(const [dir,sign,available] of [['up','↑',i>0],['down','↓',i<blocks.length-1],['remove','×',true]]){
    const b=document.createElement('button');b.type='button';b.dataset.edit=dir;b.dataset.index=String(i);b.textContent=sign;b.disabled=!available;b.setAttribute('aria-label',(dir==='remove'?'Eliminar':dir==='up'?'Subir':'Bajar')+' instrucción '+(i+1));row.append(b);
   }
   return row;
  }));
  el('world-code-done').hidden=true;
 };
 const open=(g,scene)=>{
  if(!shouldChallenge(g.save,scene)||!MISSIONS[scene])return false;
  active=scene;game=g;from=document.activeElement;blocks=[];hints=0;
  g.locked=true;g.input.reset();modal.hidden=false;
  el('world-code-title').textContent=MISSIONS[scene].title;
  el('world-code-context').textContent=MISSIONS[scene].context;
  el('world-code-lesson').textContent=MISSIONS[scene].lesson;
  el('world-code-trace').hidden=true;feedback('Construye una secuencia para comprobar entradas diferentes.');
  render();modal.querySelector('.world-code-panel')?.focus();return true;
 };
 const close=()=>{
  if(modal.hidden)return;
  modal.hidden=true;active=null;game?.input.reset();if(game)game.locked=false;
  if(from?.isConnected)from.focus?.();
 };
 const complete=()=>{
  const g=game,scene=active;if(!g||!scene)return;
  g.save.coreProofs=g.save.coreProofs||{};
  g.save.coreProofs[scene]=true;
  if(scene==='metro'){
   g.save.metroRelays[1]=true;g.fx.burst(710,257,'dash',24);g.lightFlash=.7;
  }else{
   g.save.archiveNodes[2]=true;root.StoryProgress.discover(g.save,'data');
   g.fx.burst(765,264,'dash',20);g.refreshNotebook();
  }
  g.persist();g.updateObjective();g.sfx('gate');close();
  if(scene==='archive')g.say([...root.Narrative.ARCHIVE_LOGS[2],
   'NIX: «Antes guardábamos respuestas. Ahora podemos leer datos nuevos y calcular sin saber de antemano qué traerá el hielo».']);
  else g.say([
   'IRIS: «No le dijimos al relé que se encendiera siempre. Le enseñamos a comprobar si era seguro hacerlo».',
   'NIX: «Eso significa que, si cambian los sensores mañana, la misma instrucción todavía podrá protegernos. El acceso al Archivo está listo».'
  ]);
 };
 el('world-code-close').addEventListener('click',close);
 el('world-code-palette').addEventListener('click',event=>{
  const btn=event.target.closest('button[data-op]');if(!btn||!active||blocks.length>=14)return;
  blocks.push(btn.dataset.op);render();feedback('Instrucción añadida. Puedes cambiar su orden antes de ejecutar.');
 });
 el('world-code-list').addEventListener('click',event=>{
  const btn=event.target.closest('button[data-edit]');if(!btn||!active)return;
  const i=Number(btn.dataset.index),action=btn.dataset.edit;
  if(!Number.isInteger(i)||i<0||i>=blocks.length)return;
  if(action==='remove')blocks.splice(i,1);
  else if(action==='up'&&i>0)[blocks[i],blocks[i-1]]=[blocks[i-1],blocks[i]];
  else if(action==='down'&&i<blocks.length-1)[blocks[i],blocks[i+1]]=[blocks[i+1],blocks[i]];
  render();feedback('Secuencia modificada. Ejecútala cuando estés listo.');
 });
 el('world-code-help').addEventListener('click',()=>{if(!active)return;
  const suggestions=MISSIONS[active].hints;feedback('PISTA · '+suggestions[Math.min(hints++,suggestions.length-1)]);});
 el('world-code-clear').addEventListener('click',()=>{blocks=[];render();el('world-code-trace').hidden=true;feedback('Área de instrucciones vacía. Puedes empezar otra vez.');});
 el('world-code-run').addEventListener('click',()=>{
  if(!active||!game)return;
  const report=checkProgram(active,draft());
  if(!report.cases.length){feedback('Añade instrucciones válidas para ejecutar.');return;}
  const m=MISSIONS[active];
  const trace=el('world-code-trace');trace.hidden=false;
  trace.textContent=report.cases.slice(0,2).map((result,i)=>{
   const env=m.cases[i],state=active==='metro'?'energía='+env.energy+', red='+env.network+', alarma='+env.alarm:'sensores=['+env.sensors.join(', ')+']';
   return 'CASO '+(i+1)+' · '+state+'\n'+(result.trace||[]).join('\n')+'\nRESULTADO '+String(result.value)+' · '+(result.correct?'✓':'✕')+(result.error?' · '+result.error:'');
  }).join('\n\n');
  if(report.passed){feedback('✓ Tu misma secuencia funcionó en todos los estados, incluso cuando cambiaron los datos.',true);
   el('world-code-done').hidden=false;game.sfx('success');return;}
  if(report.error){feedback('Prueba de ejecución: '+report.error);game.sfx('deny');return;}
  const failed=report.cases.findIndex(r=>!r.correct);
  feedback(failed>=2?'Tus primeros estados funcionan, pero cambian otros sensores. ¿La lógica sigue siendo correcta?':'La salida del caso '+(failed+1)+' no coincide. Lee el recorrido paso a paso.');game.sfx('deny');
 });
 el('world-code-done').addEventListener('click',complete);
 modal.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.stopPropagation();close();}
  if(event.key==='Tab'){
   const controls=[...modal.querySelectorAll('button:not([disabled]):not([hidden]),summary')].filter(node=>node.getClientRects().length>0);
   if(!controls.length)return;
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 const oldRegion=Game.prototype.interactRegion;
 Game.prototype.interactRegion=function(){
  if(this.scene==='metro'&&this.near(710,67)&&shouldChallenge(this.save,'metro')){open(this,'metro');return;}
  return oldRegion.call(this);
 };
 const oldArchive=Game.prototype.interactArchive;
 Game.prototype.interactArchive=function(){
  if(this.scene==='archive'&&this.near(765,65)&&shouldChallenge(this.save,'archive')){open(this,'archive');return;}
  return oldArchive.call(this);
 };
 const oldPrompt=Game.prototype.scenePrompt;
 Game.prototype.scenePrompt=function(){
  if(this.scene==='metro'&&this.near(710,67)&&shouldChallenge(this.save,'metro'))return 'E · Programar relé de seguridad';
  if(this.scene==='archive'&&this.near(765,65)&&shouldChallenge(this.save,'archive'))return 'E · Decodificar registros de sensores';
  return oldPrompt.call(this);
 };
 const oldObjective=Game.prototype.updateObjective;
 Game.prototype.updateObjective=function(){
  oldObjective.call(this);
  if(this.scene==='metro'&&!this.save.metroRelays?.[1]&&this.save.metroRelays?.[0])
   this.el.objective.textContent='El primer relé funciona. Acércate al segundo y construye una condición que lo active de forma segura.';
  if(this.scene==='archive'&&this.save.archiveNodes?.[0]&&this.save.archiveNodes?.[1]&&!this.save.archiveNodes?.[2])
   this.el.objective.textContent='Dos memorias recuperadas. El tercer lector necesita un programa que lea los sensores y calcule una coordenada.';
 };
 // Save only stable, walkable places; boss arenas and platform hazards keep their own checkpoints.
 const oldPersist=Game.prototype.persist;
 Game.prototype.persist=function(){
  if(this.scene==='guardian'){
   const live=this.scene;this.scene=this.guardian?.returnScene||'archive';
   try{return oldPersist.call(this)}finally{this.scene=live;}
  }
  return oldPersist.call(this);
 };
 const oldSpawn=Game.prototype.spawn;
 Game.prototype.spawn=function(scene){
  const base=oldSpawn.call(this,scene),saved=this.save?.checkpoints?.[scene];
  if(this._newSceneTransition||!this.save?.started||scene!==this.save.scene||!goodCheckpoint(scene,saved)||scene==='bridge')return base;
  const x=saved.x;
  if(scene==='district'&&(!this.save.cityGate&&x>730||!this.save.cityPowered&&x>1260||!this.save.cityVariableSolved&&x>1720))return base;
  return Physics.spawn(saved.x,saved.y);
 };
 const oldSceneChange=Game.prototype.sceneChange;
 Game.prototype.sceneChange=function(scene,x){
  this._newSceneTransition=true;
  try{return oldSceneChange.call(this,scene,x);}
  finally{this._newSceneTransition=false;this.worldCheckpointClock=0;}
 };
 Game.prototype.recordWorldCheckpoint=function(){
  const p=this.player,scene=this.scene;
  if(!this.save?.started||!safeScenes[scene]||this.guardian?.active||this.controlsTutorial?.active||this.transition||this._newSceneTransition||this.locked||!p?.onGround||!goodCheckpoint(scene,p))return false;
  const last=this.save.checkpoints?.[scene];
  if(last&&Math.abs(last.x-p.x)<26&&Math.abs(last.y-p.y)<12)return false;
  if(!this.save.checkpoints)this.save.checkpoints={};
  this.save.checkpoints[scene]={x:Math.round(p.x),y:Math.round(p.y)};
  this.persist();return true;
 };
 const oldMove=Game.prototype.move;
 Game.prototype.move=function(dt){
  const result=oldMove.call(this,dt);
  if(this.scene==='guardian'||this.scene==='training'||this.transition||!this.save.started)return result;
  this.worldCheckpointClock=(this.worldCheckpointClock||0)+Math.max(0,Math.min(dt,.1));
  if(this.worldCheckpointClock>=2.5){this.worldCheckpointClock=0;this.recordWorldCheckpoint();}
  return result;
 };
 const storeOnExit=()=>{
  const g=root.game;if(!g)return;
  if(!modal.hidden)return;
  g.recordWorldCheckpoint?.();
 };
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')storeOnExit();});
 window.addEventListener('pagehide',storeOnExit);
 // Opt-in, private playtest feedback: nothing leaves the device until the player chooses to share it.
 const advanced=document.querySelector('#menu-settings .menu-settings-content');
 if(advanced){
  const openButton=document.createElement('button');
  openButton.id='feedback-open';openButton.className='secondary';openButton.type='button';
  openButton.textContent='✎ Compartir comentario de la partida';
  advanced.append(openButton);
  const feedbackModal=document.createElement('div');feedbackModal.id='feedback-modal';
  feedbackModal.className='modal backdrop';feedbackModal.hidden=true;
  feedbackModal.setAttribute('role','dialog');feedbackModal.setAttribute('aria-modal','true');
  feedbackModal.setAttribute('aria-labelledby','feedback-title');
  feedbackModal.innerHTML=`<section class="feedback-panel" tabindex="-1">
   <header class="feedback-head"><h2 id="feedback-title">Tu experiencia en Lúmina</h2><button id="feedback-close" class="secondary" type="button" aria-label="Cerrar comentarios">×</button></header>
   <p>¿Algo fue confuso, difícil o no funcionó? Cuenta lo que pasó. La información se copia para que puedas enviársela a quien compartió el juego. <strong>No se envía automáticamente.</strong></p>
   <label for="feedback-category">¿Qué te ocurrió?</label>
   <select id="feedback-category"><option value="No supe adónde ir">No supe adónde ir</option><option value="No entendí una misión">No entendí una misión</option><option value="Controles o movimiento">Controles o movimiento</option><option value="Error técnico">Error técnico</option><option value="Historia y ritmo">Historia y ritmo</option><option value="Algo que me gustó">Algo que me gustó</option></select>
   <label for="feedback-description">¿Qué parte y qué cambiarías?</label>
   <textarea id="feedback-description" rows="4" maxlength="2000" placeholder="Describe lo que ocurrió o lo que esperabas que pasara..."></textarea>
   <p id="feedback-message" role="status" aria-live="polite"></p>
   <pre id="feedback-result" class="feedback-result" hidden></pre>
   <div class="feedback-actions"><button id="feedback-copy" class="primary" type="button">Copiar comentario</button><button id="feedback-cancel" class="secondary" type="button">Volver al juego</button></div>
  </section>`;
  document.body.append(feedbackModal);
  const feedbackStyle=document.createElement('style');
  feedbackStyle.textContent=`
   #feedback-modal .feedback-panel{max-height:94dvh;overflow:auto;width:min(520px,95vw);padding:15px 18px;color:#f1f8ee;background:#102d41;border:2px solid #8fcebd;border-radius:12px}
   #feedback-modal .feedback-head{display:flex;justify-content:space-between;gap:10px;align-items:start}#feedback-modal .feedback-head h2{margin:0 0 8px;font:900 23px/1.2 system-ui}#feedback-modal .feedback-head button{min-width:44px;min-height:44px}
   #feedback-modal p{font:500 13px/1.5 system-ui}#feedback-modal label{display:block;font:800 13px/1.4 system-ui;margin:10px 0 5px}
   #feedback-modal select,#feedback-modal textarea{width:100%;padding:9px;background:#193d52;color:#effff4;border:1px solid #8fc4c0;border-radius:6px;font:500 15px/1.5 system-ui}
   #feedback-modal .feedback-actions{display:flex;flex-wrap:wrap;gap:9px}#feedback-modal .feedback-actions button{flex:1 1 160px;min-height:46px}
   #feedback-modal .feedback-result{white-space:pre-wrap;overflow-wrap:anywhere;background:#061c30;padding:10px;color:#ceeedd;font:12px/1.5 monospace;max-height:25dvh;overflow:auto}
   #feedback-modal button:focus-visible,#feedback-modal textarea:focus-visible,#feedback-modal select:focus-visible{outline:3px solid #ffde9e;outline-offset:2px}
   @media (orientation:landscape) and (max-height:500px){#feedback-modal .feedback-panel{max-height:99dvh;padding:8px 12px}#feedback-modal p{margin:5px 0}#feedback-modal label{margin:4px 0 2px}}
  `;
  document.head.append(feedbackStyle);
  const closeFeedback=()=>{feedbackModal.hidden=true;openButton.focus();};
  openButton.addEventListener('click',()=>{
   feedbackModal.hidden=false;document.getElementById('feedback-result').hidden=true;
   document.getElementById('feedback-message').textContent='';
   feedbackModal.querySelector('.feedback-panel')?.focus();
  });
  document.getElementById('feedback-close').addEventListener('click',closeFeedback);
  document.getElementById('feedback-cancel').addEventListener('click',closeFeedback);
  feedbackModal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closeFeedback();}});
  document.getElementById('feedback-copy').addEventListener('click',async()=>{
   const area=document.getElementById('feedback-description');
   const content=area.value.trim();const message=document.getElementById('feedback-message');
   if(content.length<5){message.textContent='Cuéntanos qué ocurrió con al menos una frase breve.';area.focus();return;}
   const g=root.game,scene=g?.scene||'sin iniciar',mode=document.body.classList.contains('touch-enabled')?'táctil':'teclado';
   const text=[
    'Lúmina — Comentario de juego',
    'Lugar: '+scene,
    'Tipo: '+document.getElementById('feedback-category').value,
    'Pantalla: '+Math.round(window.innerWidth)+'×'+Math.round(window.innerHeight),
    'Control: '+mode,
    'Comentario: '+content
   ].join('\n');
   const result=document.getElementById('feedback-result');result.textContent=text;result.hidden=false;
   try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);message.textContent='✓ Copiado. Ya puedes compartirlo cuando quieras.';
   }catch{message.textContent='No pude copiar automáticamente. Selecciona el texto de abajo y cópialo manualmente.';}
  });
 }
})(window.Lumina=window.Lumina||{});
