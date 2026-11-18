/* Lúmina · Optional, progressively specific world guidance without automatic solutions. */
(function(root){'use strict';
 const Game=root.Game,Guidance=root.Guidance;
 if(!Game||!Guidance)throw Error('Contextual help requires the adventure and route model');
 const entries=Object.freeze({
  district:Object.freeze({
   gate:['La consola Z02 reúne tres sensores. Observa cuáles permiten abrir la puerta.','Y requiere entradas verdaderas; NO invierte un sensor. Prueba las combinaciones.'],
   power:['La red necesita un nodo eléctrico conectado después de superar Z02.','La puerta abierta permite llegar al nodo. Usa la interacción junto al mecanismo.'],
   variable:['La compuerta numérica depende de lo que guarda la variable carga.','Sigue cada cambio de la variable: una orden usa el valor producido por la anterior.'],
   nix:['El eco de NIX está al final de la plaza. Necesita una secuencia de acciones.','Programa el movimiento de NIX y una orden de activar cuando llegue al mecanismo.'],
   exit:['La ruta norte continúa tras la plaza. Busca el acceso a Estación Umbral.','NIX debe estar despierto antes de abandonar Aurora por primera vez.']
  }),
  metro:Object.freeze({
   first:['Busca los dos relés que alimentan el tren. Interactúa con el que falta.','Acércate a cada relé y usa E / USAR. El segundo comprueba la seguridad.'],
   second:['El relé necesita una condición que funcione con sensores cambiantes.','Combina energía, conexión y alarma. Prueba qué ocurre cuando una entrada cambia.'],
   archive:['El permiso del tren está dentro del Archivo de Ecos. Busca su acceso.','Entra al Archivo, recupera los registros y habla con el Centinela.'],
   train:['Los relés y la autorización están listos. El tren conduce al puerto.','Busca el acceso del extremo este y usa E / USAR para viajar.']
  }),
  archive:Object.freeze({
   readers:['Los lectores guardan fragmentos de la historia. Busca el siguiente.','Dos registros se recuperan al interactuar; el tercero requiere código.'],
   array:['El último registro tiene un arreglo de sensores con valores cambiantes.','Un arreglo tiene posiciones numeradas desde cero. Lee las necesarias, no copies resultados.'],
   guardian:['Los tres recuerdos permiten acceder al Centinela.','Sus condiciones se responden como VERDADERO o FALSO. Observa cada sensor.'],
   return:['La autorización ya es tuya. Regresa al tren por la entrada del Archivo.','Sal por el oeste y después avanza hacia el extremo este del metro.']
  }),
  harbor:Object.freeze({
   orb:['Recoge el orbe cercano para aprender los controles de exploración.','Muévete hacia la luz azul; después encontrarás el taller de NIX.'],
   workshop:['El cuerpo de NIX se encuentra en un taller junto al puerto.','Busca la entrada de madera y pulsa E / USAR.'],
   bridge:['Con NIX restaurado ya puedes cruzar la salida hacia la pasarela.','El arco del extremo este conduce a la Pasarela Boreal.']
  }),
  workshop:Object.freeze({
   orb:['La consola de NIX está protegida por un orbe de programación.','Recoge la luz violeta antes de usar el banco de reparación.'],
   robot:['El robot necesita llegar a la batería siguiendo instrucciones.','Traza una ruta de movimientos, recoge la batería y comprueba cada paso.'],
   exit:['NIX está restaurado. Puedes volver al Puerto o visitar el LAB opcional.','La salida está al oeste. El LAB sirve para practicar, pero no bloquea la historia.']
  }),
  bridge:Object.freeze({
   jump:['El orbe de salto está sobre una repisa. Busca un lugar seguro para impulsarte.','Salta cerca de la primera cornisa. Mantener SALTAR aumenta la altura.'],
   mini:['La primera baliza conserva el avance después de saltar el hueco.','Toma impulso cerca del borde y aterriza sobre la siguiente plataforma.'],
   checkpoint:['Aprovecha la plataforma móvil para alcanzar la baliza de nieve.','Observa el movimiento del hielo y salta cuando esté cerca de tu lado.'],
   dash:['Hay una reserva de impulso antes de la barrera de cristal.','El orbe ámbar desbloquea IMPULSO. La estación cercana permite recargarlo.'],
   crystal:['La barrera no se rompe caminando; necesita un impacto de impulso.','Cárgalo cerca de la estación y usa SHIFT / IMPULSO contra el cristal.'],
   exit:['El arco del final de la pasarela conduce al faro.','Una vez abierta la barrera, sigue hacia el este y entra al faro.']
  }),
  tower:Object.freeze({
   generator:['La consola del generador necesita emitir tres pulsos.','REPETIR ejecuta el mismo conjunto de instrucciones varias veces.'],
   final:['La lente debe decidir qué canales pueden transmitir con seguridad.','Comprueba la regla en todos los estados; no basta con que funcione para Aurora.'],
   completed:['La señal está restaurada. Puedes repasar lo aprendido o seguir explorando.','Desde el menú puedes leer la bitácora y volver a combatir al Centinela.']
  }),
  rooftops:Object.freeze({
   antenna:['Las azoteas tienen dos antenas por conectar.','Explora ambas direcciones y activa las antenas que estén apagadas.'],
   return:['Las antenas ya funcionan. Regresa a Aurora.','Vuelve al acceso del oeste para regresar a la ciudad.']
  })
 });
 function key(scene,save){
  if(scene==='district')return !save.cityGate?'gate':!save.cityPowered?'power':!save.cityVariableSolved?'variable':!save.cityNixAwake?'nix':'exit';
  if(scene==='metro')return !save.metroRelays?.[0]?'first':!save.metroRelays?.[1]?'second':!save.guardianDefeated&&!save.beacon&&!save.completed?'archive':'train';
  if(scene==='archive')return !save.archiveNodes?.[0]||!save.archiveNodes?.[1]?'readers':!save.archiveNodes?.[2]?'array':!save.guardianDefeated?'guardian':'return';
  if(scene==='harbor')return !(save.orbs||[]).includes('move')?'orb':!save.robot?'workshop':'bridge';
  if(scene==='workshop')return !(save.orbs||[]).includes('code')?'orb':!save.robot?'robot':'exit';
  if(scene==='bridge')return !(save.orbs||[]).includes('jump')?'jump':!save.bridgeMiniCheckpoint?'mini':!save.bridgeCheckpoint?'checkpoint':!(save.orbs||[]).includes('dash')?'dash':!save.gateBroken?'crystal':'exit';
  if(scene==='tower')return !save.beacon?'generator':!save.signalBalanced?'final':'completed';
  if(scene==='rooftops')return save.roofAntennas?.every(Boolean)?'return':'antenna';
  return null;
 }
 function message(scene,save,point,tier,x,y,GuidanceModel=Guidance){
  const branch=key(scene,save),lines=entries[scene]?.[branch];
  if(!lines)return '';
  if(tier>=1)return lines[Math.min(tier-1,lines.length-1)];
  const direction=GuidanceModel.direction(scene,save,x,y);
  if(direction){
   const sign=direction.vertical?(direction.vertical<0?'↑':'↓'):(direction.side<0?'←':'→');
   return sign+' '+point.label+'. Busca el elemento iluminado en el escenario.';
  }
  return 'Estás cerca de '+point.label+'. Pulsa E / USAR para interactuar.';
 }
 const live=document.createElement('span');
 live.id='guidance-announcement';live.setAttribute('role','status');live.setAttribute('aria-live','polite');
 live.className='guidance-reader-only';document.body.append(live);
 const style=document.createElement('style');style.textContent=`
 .guidance-reader-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important}
 `;
 document.head.append(style);
 // Optional visibility mode: higher text contrast, clearer input outlines, no gameplay advantage.
 const settings=document.querySelector?.('#menu-settings .menu-settings-content');
 if(settings){
  const b=document.createElement('button');b.type='button';b.id='contrast-button';b.className='secondary';
  let enabled=false;
  try{
   const saved=window.localStorage.getItem('lumina-contrast-v1');
   enabled=saved==='on'||saved===null&&!!window.matchMedia?.('(prefers-contrast: more)').matches;
  }catch{}
  const sync=()=>{
   document.body.classList.toggle('lumina-contrast',enabled);
   b.textContent=enabled?'◈ Alto contraste: activado':'◈ Alto contraste: desactivado';
   b.setAttribute('aria-pressed',String(enabled));
  };
  settings.append(b);sync();
  b.addEventListener('click',()=>{
   enabled=!enabled;sync();
   try{window.localStorage.setItem('lumina-contrast-v1',enabled?'on':'off');}catch{}
  });
  const css=document.createElement('style');css.textContent=`
   body.lumina-contrast .menu-panel,body.lumina-contrast .lab-panel,body.lumina-contrast .editor-panel,
   body.lumina-contrast .world-code-panel,body.lumina-contrast .recap-card,body.lumina-contrast .feedback-panel,
   body.lumina-contrast .route-panel{background:#071b2d!important;border-color:#e5fbec!important;color:#fff!important}
   body.lumina-contrast .hud,body.lumina-contrast .prompt,body.lumina-contrast .orb-hud,
   body.lumina-contrast .energy-hud,body.lumina-contrast .quick-actions button,
   body.lumina-contrast .training-hud,body.lumina-contrast .guardian-hud{
    background:#071b2df4!important;color:#fff!important;border:1px solid #ecf9e8!important;text-shadow:0 1px #000!important}
   body.lumina-contrast button:focus-visible,body.lumina-contrast input:focus-visible,
   body.lumina-contrast select:focus-visible{outline:3px solid #ffe29a!important;outline-offset:3px!important}
  `;document.head.append(css);
 }
 // Accessibility cannot live only in the HUD: landscape phones hide that area.
 const assistInput=document.getElementById?.('assist'),options=document.querySelector?.('#menu-settings .menu-settings-content');
 if(assistInput&&options){
  const b=document.createElement('button');b.type='button';b.id='assist-mode-button';b.className='secondary';
  const sync=()=>{
   const value=!!assistInput.checked;
   b.textContent=value?'✦ Asistencia de salto: activada':'✦ Asistencia de salto: desactivada';
   b.setAttribute('aria-pressed',String(value));
  };
  options.append(b);sync();
  b.addEventListener('click',()=>{
   assistInput.checked=!assistInput.checked;
   assistInput.dispatchEvent(new Event('change',{bubbles:true}));
   sync();
  });
  assistInput.addEventListener('change',sync);
  const update=Game.prototype.updateMenuState;
  Game.prototype.updateMenuState=function(){const r=update.call(this);sync();return r;};
 }
 const movement=Game.prototype.move;
 Game.prototype.move=function(dt){
  const previous=this.player?.y,scene=this.scene,result=movement.call(this,dt);
  if(scene==='bridge'&&Number.isFinite(previous)&&previous>380&&this.player?.y<320&&this.save?.started&&!this.save?.assist){
   this.fallStreak=(this.fallStreak||0)+1;
   if(this.fallStreak===3)this.flashCaption('¿Te cuestan los saltos? Activa Asistencia en Opciones.',4);
  }
  return result;
 };
 const originalHint=Game.prototype.hint;
 Game.prototype.hint=function(){
  if(this.locked||['training','guardian','ending'].includes(this.scene))return originalHint.call(this);
  const point=Guidance.pick(this.scene,this.save,this.player?.x||0);
  const branch=key(this.scene,this.save);
  if(!point||!branch)return originalHint.call(this);
  const id=this.scene+':'+branch+':'+point.x;
  const elapsed=this.worldTime-(this.lastHelp?.when??-999);
  const tier=this.lastHelp?.id===id&&elapsed<95?Math.min(2,this.lastHelp.tier+1):0;
  const text=message(this.scene,this.save,point,tier,this.player.x,this.player.y);
  this.lastHelp={id,tier,when:this.worldTime};
  this.guidancePulse=this.guidanceMode==='hint'?8:this.guidancePulse;
  this.flashCaption(text,tier===0?3.4:4.9);
  live.textContent=text;
  this.sfx?.('hint');
  return text;
 };
 root.GuidedHelp=Object.freeze({entries,key,message});
})(window.Lumina=window.Lumina||{});
