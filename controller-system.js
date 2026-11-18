/* Lúmina · optional standard gamepad support. No external libraries or controller identifiers saved. */
(function(root){'use strict';
 const Input=root.Input,Game=root.Game;
 if(!Input||!Game)throw Error('Controller module requires game input');
 const DEADZONE=.19;
 function normalize(v){
  const value=Number.isFinite(v)?Math.max(-1,Math.min(1,v)):0;
  const abs=Math.abs(value);
  return abs<DEADZONE?0:Math.sign(value)*(abs-DEADZONE)/(1-DEADZONE);
 }
 const pressed=(pad,i)=>!!pad?.buttons?.[i]?.pressed;
 const connected=()=>{
  try{return [...(navigator.getGamepads?.()||[])].find(p=>p&&p.connected!==false&&p.mapping==='standard')||null;}
  catch{return null;}
 };
 function read(pad){
  const x=normalize(pad?.axes?.[0]),y=normalize(pad?.axes?.[1]);
  const left=pressed(pad,14),right=pressed(pad,15),up=pressed(pad,12),down=pressed(pad,13);
  return {
   x:Math.abs(x)>.01?x:(right?1:0)-(left?1:0),
   y:Math.abs(y)>.01?y:(down?1:0)-(up?1:0),
   jump:pressed(pad,0),dash:pressed(pad,1)||pressed(pad,5),
   action:pressed(pad,2)||pressed(pad,3),
   pause:pressed(pad,9)
  };
 }
 const neutral=()=>({x:0,y:0,jump:false,dash:false,action:false,pause:false});
 function sample(input){
  if(!input.controller)input.controller={now:neutral(),previous:neutral(),queued:{jump:false,dash:false,action:false,pause:false},seen:false};
  const data=input.controller;
  const pad=connected();
  const next=pad?read(pad):neutral();
  const editing=input.isEditing?.()||false;
  const old=data.now;
  data.previous=old;
  data.now=next;
  // Prevent hot-plug, page return and overlay dismissal from firing an action unexpectedly.
  if(!pad||editing||!root.game||root.game.locked){
   for(const key of ['jump','dash','action','pause'])data.queued[key]=false;
   data.seen=!!pad;return data;
  }
  for(const key of ['jump','dash','action','pause'])
   if(next[key]&&!old[key])data.queued[key]=true;
  data.seen=true;
  return data;
 }
 const priorReset=Input.prototype.reset;
 Input.prototype.reset=function(){
  priorReset.call(this);
  const pad=connected();
  this.controller={now:pad?read(pad):neutral(),previous:neutral(),
   queued:{jump:false,dash:false,action:false,pause:false},seen:!!pad};
 };
 const originalAxis=Input.prototype.axis;
 Input.prototype.axis=function(){
  const keyboard=originalAxis.call(this),data=sample(this);
  const {x,y}=data.now;
  if(!data.seen||this.isEditing()||root.game?.locked)return keyboard;
  return {x:Math.abs(x)>.01?x:keyboard.x,y:Math.abs(y)>.01?y:keyboard.y};
 };
 const originalHold=Input.prototype.holdingJump;
 Input.prototype.holdingJump=function(){
  const held=originalHold.call(this);
  return held||(!this.isEditing()&&!root.game?.locked&&!!this.controller?.now?.jump);
 };
 for(const [method,key] of [['consumeJump','jump'],['consumeDash','dash'],['consumeAction','action']]){
  const previous=Input.prototype[method];
  Input.prototype[method]=function(){
   sample(this);
   const ordinary=previous.call(this);
   const pressedButton=!!this.controller?.queued?.[key];
   if(this.controller)this.controller.queued[key]=false;
   return ordinary||pressedButton;
  };
 }
 const frame=Game.prototype.frame;
 Game.prototype.frame=function(t){
  // The pause button only enters the menu; it never closes dialogs unexpectedly.
  const state=sample(this.input);
  if(state.queued.pause){
   state.queued.pause=false;
   if(!this.locked&&!this.editor?.opened&&!this.controlsTutorial?.active&&!this.guardian?.active)
    this.openMenu();
  }
  return frame.call(this,t);
 };
 const settings=document.querySelector('#menu-settings .menu-settings-content');
 let label=null;
 if(settings){
  label=document.createElement('small');
  label.id='controller-status';label.setAttribute('role','status');
  label.textContent='Mando: conecta uno compatible para moverte con la palanca o cruceta. A: saltar; B o RB: impulso; X o Y: usar; Start: pausa.';
  settings.append(label);
 }
 const show=()=>{
  if(!label)return;
  const connectedPad=connected();
  label.textContent=connectedPad?
   '✓ Mando conectado · palanca/cruceta: mover · A: saltar · B/RB: impulso · X/Y: usar · Start: pausa':
   'Mando: disponible al conectar uno compatible · A: saltar · B/RB: impulso · X/Y: usar · Start: pausa';
 };
 window.addEventListener('gamepadconnected',show);
 window.addEventListener('gamepaddisconnected',show);
 // Backgrounding a phone/tab releases stale touch and gamepad buttons and parks the game safely.
 document.addEventListener?.('visibilitychange',()=>{
  if(document.visibilityState!=='hidden')return;
  const g=root.game;
  if(!g)return;
  g.input?.reset();
  if(!g.locked&&!g.transition&&!g.editor?.opened&&!g.controlsTutorial?.active&&
    !g.guardian?.active&&g.el?.story?.hidden){
   g.recordWorldCheckpoint?.();
   g.openMenu();
  }
 });
 show();
 root.Controller=Object.freeze({DEADZONE,normalize,read,connected});
})(window.Lumina=window.Lumina||{});
