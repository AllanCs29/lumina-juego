/* Lúmina · Player tools, journey recap and optional replay. No analytics, remote storage or hidden reports. */
(function(root){'use strict';
 const Game=root.Game,Renderer=root.Renderer,Save=root.Save;
 if(!Game||!Renderer||!Save)throw Error('Player tools require the game engine.');
 const KEY_BACKUP='lumina-previous-save-before-import-v1';
 function pack(save){
  return {app:'lumina',format:1,version:'0.9.3',exportedAt:new Date().toISOString(),data:Save.clean(save)};
 }
 function unpack(json){
  if(!json||typeof json!=='object'||Array.isArray(json)||json.app!=='lumina'||json.format!==1||!json.data||json.data.version!==1)
   throw Error('El archivo no es un respaldo compatible de Lúmina.');
  return Save.clean(json.data);
 }
 const advance=document.querySelector('#menu-settings .menu-settings-content');
 const buttons={};
 const button=(id,label,visible=true)=>{
  const b=document.createElement('button');b.id=id;b.className='secondary';b.type='button';b.textContent=label;b.hidden=!visible;
  advance?.append(b);buttons[id]=b;return b;
 };
 const exportBtn=button('save-export','↓ Exportar partida a un archivo');
 const importBtn=button('save-import','↑ Recuperar partida desde un archivo');
 const undoBtn=button('save-undo','↶ Deshacer última importación',false);
 const replayBtn=button('guardian-replay','♢ Repetir encuentro con el Centinela',false);
 const storyBtn=button('journey-recap','◈ Recordar mi historia');
 const help=document.createElement('p');help.className='backup-notice';
 help.textContent='Los respaldos se guardan en tu dispositivo. Importar pide autorización y nunca comparte datos con servidores.';
 advance?.append(help);
 const status=document.createElement('p');status.id='save-transfer-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.className='backup-status';
 advance?.append(status);
 const input=document.createElement('input');input.type='file';input.id='save-choose-file';input.accept='.json,application/json';input.hidden=true;
 input.setAttribute('aria-label','Elegir respaldo de Lúmina');advance?.append(input);
 const story=document.createElement('div');story.id='journey-recap-modal';story.className='modal backdrop';story.hidden=true;
 story.setAttribute('role','dialog');story.setAttribute('aria-modal','true');story.setAttribute('aria-labelledby','journey-recap-title');
 story.innerHTML='<section class="recap-card" tabindex="-1"><header class="recap-head"><h2 id="journey-recap-title">Bitácora de la expedición</h2><button id="journey-recap-close" class="secondary" type="button" aria-label="Cerrar bitácora">×</button></header><p>Las memorias aparecen cuando Iris y NIX las descubren. No revela lo que todavía no has jugado.</p><div id="journey-recap-entries" class="recap-entries"></div><button type="button" class="secondary" id="journey-recap-back">Volver</button></section>';
 document.body.append(story);
 const style=document.createElement('style');
 style.textContent=`
 .backup-notice{font:500 12px/1.5 system-ui;color:#c7ddd6;padding:7px 2px;margin:0}.backup-status{font:700 12px/1.5 system-ui;color:#bff3e0;margin:0}
 .recap-card{width:min(600px,95vw);max-height:95dvh;overflow:auto;border:3px solid #91d5c2;border-radius:12px;background:linear-gradient(140deg,#183b4d,#0b253a);padding:16px 20px;color:#f2f9ed}
 .recap-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.recap-head h2{margin:0 0 9px;font:900 25px/1.2 system-ui}.recap-head button{min-width:44px;min-height:44px;font-size:20px}
 .recap-card p{font:500 13px/1.5 system-ui}
 .recap-entries{display:grid;gap:8px;margin:11px 0}
 .recap-entry{border-left:4px solid #6edec4;border-radius:5px;background:#153b51;padding:9px 12px}
 .recap-entry b{display:block;font:800 13px/1.4 system-ui;color:#bdf4d9}
 .recap-entry p{margin:5px 0;font-size:12px;line-height:1.55}
 .recap-card #journey-recap-back{min-height:44px;width:100%}
 .recap-card button:focus-visible{outline:3px solid #ffdea5;outline-offset:3px}
 @media(orientation:landscape) and (max-height:500px){.recap-card{max-height:98dvh;padding:8px 12px}.recap-entry{padding:6px}.recap-card p{font-size:11px;margin:4px 0}}
 `;
 document.head.append(style);
 const storage=()=>root.game?.storage||window.localStorage;
 const notify=(message)=>{status.textContent=message;};
 function downloadBackup(){
  const g=root.game;if(!g)return;
  try{
   const data=JSON.stringify(pack(g.save),null,2);
   const blob=new Blob([data],{type:'application/json'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='lumina-partida-'+new Date().toISOString().slice(0,10)+'.json';
   document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
   notify('✓ Respaldo generado. Guárdalo en Archivos para llevar tu partida a otro dispositivo.');
  }catch{notify('No fue posible generar el respaldo. Inténtalo desde un navegador compatible.');}
 }
 async function importBackup(file){
  if(!file)return false;
  if(file.size>125000||file.size<10){notify('El archivo no tiene un tamaño válido para una partida.');return false;}
  let payload;
  try{payload=unpack(JSON.parse(await file.text()));}
  catch(err){notify('No se importó: '+(err?.message||'archivo inválido'));return false;}
  const next=payload.labCompleted?.length||0,now=root.game?.save.labCompleted?.length||0;
  if(!window.confirm('Se reemplazará tu partida actual ('+now+' retos de laboratorio) por la importada ('+next+' retos). ¿Confirmas?')){
   notify('Importación cancelada; tu partida no cambió.');return false;
  }
  try{
   const store=storage(),previous=store.getItem(Save.KEY);
   if(previous)store.setItem(KEY_BACKUP,previous);
   if(!Save.save(store,payload))throw Error('No se pudo escribir el progreso');
   notify('✓ Partida importada. Recargando la aventura...');
   window.location.reload();return true;
  }catch{notify('No se pudo restaurar. Comprueba que el navegador permita guardar datos.');return false;}
 }
 exportBtn?.addEventListener('click',downloadBackup);
 importBtn?.addEventListener('click',()=>input.click());
 input.addEventListener('change',async()=>{const file=input.files?.[0];input.value='';if(file)await importBackup(file);});
 undoBtn?.addEventListener('click',()=>{
  const store=storage(),saved=store.getItem(KEY_BACKUP);
  if(!saved){notify('No hay una importación anterior para deshacer.');return;}
  if(!window.confirm('¿Restaurar la partida previa a la última importación?'))return;
  try{
   const data=Save.clean(JSON.parse(saved));
   if(!Save.save(store,data))throw Error('Sin almacenamiento');
   store.removeItem(KEY_BACKUP);window.location.reload();
  }catch{notify('No se pudo deshacer la importación.');}
 });
 replayBtn?.addEventListener('click',()=>{
  const g=root.game;if(!g?.save.guardianDefeated)return;
  g.el.menu.hidden=true;g.locked=false;g.guardian.start(true);
 });
 const openRecap=()=>{
  const g=root.game;if(!g)return;
  const keys=['metro','archive','guardian','harbor','workshop','nix','bridge','tower'];
  const entries=document.getElementById('journey-recap-entries');entries.replaceChildren();
  const intro=document.createElement('div');intro.className='recap-entry';
  intro.innerHTML='<b>DISTRITO AURORA</b><p>Iris descubrió el cierre de la red y decidió buscar las señales de NIX.</p>';
  entries.append(intro);
  let unlocked=0;
  for(const id of keys){
   if(!g.save.storyBeats?.[id])continue;
   unlocked++;
   const lines=root.Narrative.BEATS[id],entry=document.createElement('div');entry.className='recap-entry';
   const name=document.createElement('b');name.textContent=lines[0];entry.append(name);
   const text=document.createElement('p');text.textContent=lines.slice(1).join(' ');entry.append(text);
   entries.append(entry);
  }
  if(!unlocked){const note=document.createElement('p');note.textContent='Tu siguiente recuerdo está más allá de Aurora.';entries.append(note);}
  story.hidden=false;story.querySelector('.recap-card')?.focus();
 };
 const closeRecap=()=>{story.hidden=true;storyBtn?.focus();};
 storyBtn?.addEventListener('click',openRecap);
 document.getElementById('journey-recap-close')?.addEventListener('click',closeRecap);
 document.getElementById('journey-recap-back')?.addEventListener('click',closeRecap);
 story.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();closeRecap();}});
 // Only reveal replay/restore controls when their actions actually make sense.
 const oldMenu=Game.prototype.updateMenuState;
 Game.prototype.updateMenuState=function(){
  const result=oldMenu.call(this);
  if(replayBtn)replayBtn.hidden=!this.save.guardianDefeated;
  try{if(undoBtn)undoBtn.hidden=!this.storage.getItem(KEY_BACKUP);}catch{if(undoBtn)undoBtn.hidden=true;}
  return result;
 };
 // World-visible responses to optional advanced skills, not just a progress counter.
 const oldLab=Renderer.prototype.labStation;
 Renderer.prototype.labStation=function(x,y,complete=0){
  oldLab.call(this,x,y,complete);
  const scene=root.game?.scene,done=root.game?.save.labCompleted||[];
  const effects={workshop:{skill:4,label:'BUCLE',color:'#a2f1c9'},archive:{skill:5,label:'SENSORES',color:'#a8d9ff'},
    metro:{skill:6,label:'LÓGICA',color:'#f1deb0'},tower:{skill:7,label:'DEPURADO',color:'#e0c4fd'}};
  const effect=effects[scene];
  if(!effect||!done.includes(effect.skill))return;
  this.r(x+29,y-33,68,24,'#102c42');
  this.r(x+32,y-30,62,17,'#315969');
  this.r(x+35,y-27,56,10,effect.color);
  this.text(effect.label,x+63,y-20,'#11354b',8,'center');
  this.glow(x+64,y-26,22,effect.color+'44');
 };
 root.PlayerTools=Object.freeze({pack,unpack,downloadBackup,importBackup,KEY_BACKUP});
})(window.Lumina=window.Lumina||{});
