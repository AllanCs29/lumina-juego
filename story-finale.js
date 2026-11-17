/* Lúmina · Señales del Norte */
(function(root){'use strict';
 const Game=root.Game,Renderer=root.Renderer,Narrative=root.Narrative;
 if(!Game||!Narrative||!Renderer)throw Error('The signal routing system requires the game engine.');
 const html=`<section class="route-panel" tabindex="-1">
  <header class="route-top"><div><small>PROTOCOLO UMBRAL · TRANSMISIÓN FINAL</small><h2 id="route-title">Una señal segura</h2></div><button id="route-close" type="button" aria-label="Volver al faro" class="secondary">×</button></header>
  <p>El generador tiene energía. Ahora necesitas una regla que mantenga aislados los canales con alarma y conecte solo los seguros.</p>
  <p class="route-rule">Un canal debe transmitir cuando tiene <b>red</b> y <b>NO hay alarma</b>. La regla se probará en tres lugares con estados distintos.</p>
  <div class="route-fields">
   <label for="route-operator">1 · Combina las condiciones
    <select id="route-operator"><option value="">Elige un operador...</option><option value="AND">Y · ambas condiciones</option><option value="OR">O · al menos una condición</option></select></label>
   <label for="route-alarm">2 · Consulta el sensor
    <select id="route-alarm"><option value="">Elige qué leer...</option><option value="plain">alarma</option><option value="negate">NO alarma</option></select></label>
  </div>
  <pre class="route-code" id="route-code">SI [red ... alarma] ENTONCES
  TRANSMITIR canal
SINO
  AISLAR canal
FIN SI</pre>
  <p id="route-status" class="route-status" role="status" aria-live="polite">Construye tu condición y ejecútala.</p>
  <pre class="route-trace" id="route-trace" hidden></pre>
  <div class="route-buttons"><button id="route-run" type="button" class="primary">▶ Probar los tres canales</button><button id="route-finish" type="button" class="primary" hidden>✦ Transmitir señal segura →</button></div>
 </section>`;
 const style=`<style>
 #route-modal .route-panel{width:min(660px,95vw);max-height:95dvh;overflow:auto;background:linear-gradient(155deg,#193b4f,#0b253b);border:3px solid #8ed2be;border-radius:12px;padding:18px 21px;color:#eff7ed;box-shadow:8px 10px #061727}
 .route-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.route-top small{font:800 11px/1.5 monospace;color:#a1f4dc}.route-top h2{font:900 clamp(23px,4vw,31px)/1.2 system-ui;margin:3px 0 8px}
 .route-top button{min-width:44px;min-height:44px;font-size:21px}.route-panel p{font-size:14px;line-height:1.5}
 .route-rule{border-left:4px solid #f1c991;background:#23485a;padding:9px 12px}
 .route-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}.route-fields label{display:flex;flex-direction:column;gap:7px;font:800 13px/1.5 system-ui}
 .route-fields select{width:100%;min-height:46px;border:1px solid #a0d6cd;border-radius:8px;background:#09263b;color:#f4fff1;padding:9px;font:700 13px system-ui}
 .route-code,.route-trace{white-space:pre-wrap;background:#071e33;color:#bdf9e4;border:1px solid #698d97;padding:10px;font:700 13px/1.55 monospace;max-height:27dvh;overflow:auto;overflow-wrap:anywhere}
 .route-status{border-left:4px solid #e9bf86;background:#193f50;padding:9px 12px;font-weight:700}.route-status[data-success="true"]{border-color:#6be8ac;color:#b4ffda}
 .route-buttons{display:flex;flex-wrap:wrap;gap:8px}.route-buttons button{flex:1 1 220px;min-height:48px}
 #route-modal button:focus-visible,#route-modal select:focus-visible{outline:3px solid #fce0a5;outline-offset:2px}
 @media(max-width:620px){.route-fields{grid-template-columns:1fr}#route-modal .route-panel{padding:11px 14px}}
 @media(orientation:landscape) and (max-height:500px){#route-modal .route-panel{max-height:98dvh;padding:9px 12px}.route-panel p{font-size:12px;margin:5px 0}.route-top h2{font-size:21px}.route-code{max-height:63px;font-size:11px;padding:6px}.route-trace{max-height:72px;font-size:11px}.route-fields{margin:6px 0}}
 </style>`;
 document.head.insertAdjacentHTML('beforeend',style);
 const modal=document.createElement('div');modal.id='route-modal';modal.className='modal backdrop';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','route-title');modal.innerHTML=html;document.body.append(modal);
 const ending=document.getElementById('ending');
 if(ending){
  const eyebrow=ending.querySelector('.eyebrow'),heading=ending.querySelector('h1'),paragraphs=ending.querySelectorAll('p');
  if(eyebrow)eyebrow.textContent='SEÑALES DEL NORTE · HISTORIA COMPLETADA';
  if(heading)heading.textContent='LA RED RESPIRA';
  if(paragraphs[1])paragraphs[1].textContent='La red vuelve a unir las islas sin borrar las alarmas que deben protegerlas.';
  if(paragraphs[2])paragraphs[2].textContent='El norte sigue frío. Pero el camino ya no está a oscuras.';
  const back=document.getElementById('ending-return');if(back)back.textContent='Seguir explorando en Estación Umbral →';
  const menu=ending.querySelector('button.secondary');if(menu)menu.textContent='Menú principal';
 }
 const oldTransition=Game.prototype.startTransition;
 Game.prototype.startTransition=function(scene,label,x,dialogue){
  if(label==='RETORNO A ESTACIÓN UMBRAL')return oldTransition.call(this,scene,'REGRESO A ESTACIÓN UMBRAL',x,null);
  return oldTransition.call(this,scene,label,x,dialogue);
 };
 const oldInteract=Game.prototype.interact;
 Game.prototype.interact=function(){
  if(this.scene==='tower'&&this.near(975,90)&&this.save.beacon){
   return this.save.signalBalanced?this.finish():this.openRouting();
  }
  return oldInteract.call(this);
 };
 const oldPrompt=Game.prototype.scenePrompt;
 Game.prototype.scenePrompt=function(){
  if(this.scene==='tower'&&this.near(975,90)&&this.save.beacon)
   return this.save.signalBalanced?'E · Recordar la señal restaurada':'E · Verificar la regla del faro';
  return oldPrompt.call(this);
 };
 const oldObjective=Game.prototype.updateObjective;
 Game.prototype.updateObjective=function(){
  oldObjective.call(this);
  if(this.scene==='metro'&&this.save.metroRelays?.every(Boolean)&&!this.save.guardianDefeated&&!this.save.beacon&&!this.save.completed)
   this.el.objective.textContent='Los relés están listos. Entra al Archivo de Ecos y pide autorización al Centinela antes de abordar el tren.';
  if(this.scene==='tower')
   this.el.objective.textContent=!this.save.beacon?'Programa tres pulsos con REPETIR para cargar el generador del faro.':!this.save.signalBalanced?'El generador ya funciona. Ve a la lente y comprueba qué canales son seguros antes de transmitir.':'La luz del faro regresó. Puedes explorar o volver a consultar el resultado.';
 };
 const oldTower=Renderer.prototype.tower;
 Renderer.prototype.tower=function(x,y,active){
  const game=root.game;
  return oldTower.call(this,x,y,game?.scene==='tower'?!!game.save.signalBalanced:active);
 };
 const oldSolved=Game.prototype.solved;
 Game.prototype.solved=function(id){
  oldSolved.call(this,id);
  if(id==='beacon'&&this.save.beacon&&!this.save.signalBalanced)
   this.flashCaption('✦ Generador cargado · verifica la señal en la lente →',3);
 };
 const el=id=>document.getElementById(id);
 Game.prototype.openRouting=function(){
  if(!this.save.beacon){this.toast('Primero restaura el generador de pulsos.');return false;}
  this.locked=true;this.input.reset();
  modal.hidden=false;el('route-operator').value='';el('route-alarm').value='';
  el('route-code').textContent='SI [red ... alarma] ENTONCES\n  TRANSMITIR canal\nSINO\n  AISLAR canal\nFIN SI';
  el('route-status').textContent='Construye tu condición y pruébala en los tres canales.';
  el('route-status').dataset.success='false';
  el('route-trace').hidden=true;el('route-finish').hidden=true;
  modal.querySelector('.route-panel').focus();return true;
 };
 Game.prototype.closeRouting=function(){
  if(modal.hidden)return;
  modal.hidden=true;this.locked=false;this.input.reset();
 };
 Game.prototype.runRouting=function(){
  const op=el('route-operator').value,alarm=el('route-alarm').value,status=el('route-status'),trace=el('route-trace');
  if(!op||!alarm){status.textContent='Elige Y u O y qué valor de alarma leer antes de ejecutar.';status.dataset.success='false';trace.hidden=true;return false;}
  const report=Narrative.evaluateFinal(op,alarm==='negate');
  el('route-code').textContent='SI red '+(op==='AND'?'Y':'O')+' '+(alarm==='negate'?'NO alarma':'alarma')+' ENTONCES\n  TRANSMITIR canal\nSINO\n  AISLAR canal\nFIN SI';
  trace.hidden=false;
  trace.textContent=report.cases.map((c,i)=>'CANAL '+(i+1)+' · '+c.name+
   '\nred: '+(c.network?'VERDADERO':'FALSO')+' · alarma: '+(c.alarm?'VERDADERO':'FALSO')+
   '\n'+c.expression+' → '+c.actual+' · esperado: '+c.expected+' '+(c.correct?'✓':'✕')).join('\n\n');
  status.dataset.success=String(report.passed);
  if(report.passed){
   this.save.signalBalanced=true;this.persist();this.updateObjective();this.lightFlash=2;
   this.fx.burst(975,157,'dash',32);this.sfx('gate');
   status.textContent='✓ Los tres canales responden correctamente. Ahora podemos transmitir sin propagar la alarma.';
   el('route-finish').hidden=false;
  }else{
   const bad=report.cases.find(c=>!c.correct);this.sfx('deny');
   status.textContent='En '+bad.name+' el programa decidió '+bad.actual+', pero necesita '+bad.expected+'. Revisa el valor de cada sensor.';
   el('route-finish').hidden=true;
  }
  return report.passed;
 };
 Game.prototype.finish=function(){
  if(!this.save.signalBalanced){this.openRouting();return;}
  const seen=!!this.save.completed;this.save.completed=true;this.persist();
  const show=()=>{ending.hidden=false;this.locked=true;this.beep(890,.23)};
  if(seen){show();return;}
  const finale=[
   'TRANSMISIÓN FINAL · FARO DEL SILENCIO',
   'NIX: «Fui yo quien aisló las señales para impedir que una alarma defectuosa se copiara en todas las islas. Creí que no había otra manera».',
   'Iris: «No teníamos que elegir entre apagarlo todo o ignorar el peligro. Había que revisar cada canal y transmitir solo donde fuera seguro».',
   'El Puerto, Aurora y Boreal volvieron a recibir la señal. El protocolo conserva aislados los enlaces que todavía están en riesgo.'
  ];
  if(this.save.labMastered)finale.push('NIX: «Y tú sabes por qué funcionó: una misma regla responde a valores distintos».');
  finale.push('Las luces llegan al horizonte como una conversación recuperada. La tormenta sigue allí, pero las islas ya no están solas.');
  this.say(finale,show);
 };
 el('route-close').addEventListener('click',()=>root.game?.closeRouting());
 el('route-run').addEventListener('click',()=>root.game?.runRouting());
 el('route-finish').addEventListener('click',()=>{const g=root.game;if(!g)return;g.closeRouting();g.finish();});
 modal.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();root.game?.closeRouting();}});
 if(root.Lessons){
  const L=root.Lessons;
  if(L.data?.[0])L.data[0].code='registro 1 ← LEER memoria\nregistro 2 ← LEER memoria';
  if(L.data?.[1])L.data[1].code='INICIO\n  LEER registros\n  SI completos ENTONCES MOSTRAR mensaje\nFIN';
  if(L.variables?.[0])L.variables[0].code='INICIO\n  carga ← 1\nFIN';
  if(L.variables?.[1])L.variables[1].code='carga ← 1\ncarga ← carga + 2\nMOSTRAR carga';
  if(L.variables?.[2])L.variables[2].code='INICIO\n  carga ← 1\n  carga ← carga + 2\n  carga ← carga + 2\n  SI carga = 5 ENTONCES ABRIR puente\nFIN';
 }
})(window.Lumina=window.Lumina||{});
