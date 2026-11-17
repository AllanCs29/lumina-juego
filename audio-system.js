/* Original chiptune score and separate game audio buses. */
(function(root){'use strict';
 const KEY={music:'lumina-music-enabled-v1',musicVol:'lumina-music-volume-v1',fxVol:'lumina-effects-volume-v1',fxEnabled:'lumina-effects-enabled-v1'};
 const read=(key,fallback)=>{try{const v=localStorage.getItem(key);return v===null?fallback:v;}catch{return fallback;}};
 const write=(key,value)=>{try{localStorage.setItem(key,String(value))}catch{}};
 const clamp=v=>Math.max(0,Math.min(1,Number.isFinite(Number(v))?Number(v):0));
 const hz=midi=>440*Math.pow(2,(midi-69)/12);
 const THEMES=Object.freeze({
  district:{bpm:114,bass:[50,53,48,57,50,53,55,57],lead:[74,-1,77,74,72,69,72,-1,74,-1,79,77,74,72,69,-1,72,74,77,-1,79,77,74,72,69,-1,72,74,69,72,74,-1]},
  metro:{bpm:120,bass:[52,55,50,57,52,55,48,50],lead:[76,79,81,-1,79,76,74,-1,76,79,83,81,79,-1,76,74,72,74,76,79,81,79,76,-1,74,76,79,76,74,72,71,-1]},
  rooftops:{bpm:128,bass:[53,57,50,55,53,57,55,57],lead:[77,81,84,81,79,77,-1,74,77,81,84,-1,82,81,79,77,79,82,84,82,81,79,-1,77,74,77,79,81,77,74,72,-1]},
  archive:{bpm:96,bass:[48,51,55,53,48,51,46,55],lead:[72,-1,-1,75,74,-1,70,-1,72,75,-1,79,-1,77,75,-1,72,-1,74,75,79,-1,77,-1,75,74,72,-1,70,-1,72,-1]},
  harbor:{bpm:106,bass:[50,57,53,55,50,55,48,57],lead:[74,-1,77,79,77,74,72,-1,69,72,74,-1,77,74,72,-1,74,77,81,-1,79,77,74,72,69,-1,72,74,72,69,67,-1]},
  workshop:{bpm:110,bass:[53,50,55,48,53,57,55,50],lead:[69,72,74,-1,77,74,72,69,67,69,72,-1,74,77,74,-1,72,74,77,81,79,77,74,-1,72,69,72,74,77,74,69,-1]},
  bridge:{bpm:132,bass:[57,53,55,50,57,55,53,52],lead:[81,84,86,-1,84,81,79,77,81,84,88,86,84,81,79,-1,77,79,81,84,81,79,77,-1,79,81,84,81,79,77,74,-1]},
  tower:{bpm:122,bass:[50,53,57,55,50,57,53,55],lead:[74,77,81,84,81,77,74,-1,72,74,77,79,81,-1,79,77,74,77,81,86,84,81,79,-1,77,79,81,84,81,77,74,-1]},
  guardian:{bpm:140,bass:[52,53,55,50,52,57,55,50],lead:[76,79,83,79,76,-1,74,76,79,83,86,83,79,76,74,-1,76,78,81,84,83,79,76,-1,74,76,79,83,79,76,72,-1]},
  training:{bpm:110,bass:[48,55,53,55,48,53,55,48],lead:[72,76,79,-1,76,72,74,-1,76,79,84,79,76,74,72,-1,72,74,76,79,81,79,76,-1,74,76,79,76,74,72,67,-1]}
 });
 const EFFECTS=Object.freeze({
  menu:[[540,0,.07,'square']],confirm:[[530,0,.055,'triangle'],[800,.085,.10,'square']],
  start:[[330,0,.10,'square'],[495,.12,.10,'square'],[660,.25,.21,'triangle']],
  deny:[[215,0,.13,'sawtooth'],[160,.11,.13,'triangle']],
  collect:[[655,0,.07,'square'],[880,.08,.09,'square'],[1200,.19,.18,'triangle']],
  gate:[[355,0,.10,'square'],[480,.10,.11,'triangle'],[720,.24,.23,'square']],
  bridge:[[180,0,.16,'sawtooth'],[245,.22,.16,'triangle'],[380,.47,.25,'square']],
  success:[[525,0,.075,'triangle'],[715,.085,.10,'square'],[990,.19,.20,'triangle']],
  robot:[[260,0,.11,'square'],[400,.14,.10,'square'],[690,.27,.20,'triangle']],
  portal:[[245,0,.14,'triangle'],[345,.13,.17,'square'],[520,.34,.20,'triangle']],
  step:[[105,0,.052,'triangle']],snowStep:[[92,0,.055,'triangle']],metalStep:[[135,0,.044,'square']],
  jump:[[420,0,.08,'square'],[660,.065,.12,'triangle']],
  land:[[180,0,.09,'triangle'],[110,.065,.06,'square']],
  dash:[[310,0,.075,'sawtooth'],[530,.05,.12,'square'],[850,.12,.10,'triangle']],
  interact:[[590,0,.042,'square'],[710,.06,.07,'triangle']],
  terminal:[[270,0,.09,'square'],[490,.08,.08,'triangle'],[710,.19,.16,'square']],
  switch:[[230,0,.05,'square'],[500,.06,.08,'square']],
  checkpoint:[[560,0,.09,'triangle'],[740,.11,.11,'square'],[880,.23,.21,'triangle']],
  hint:[[440,0,.052,'triangle'],[530,.12,.06,'triangle']]
 });
 function tone(ctx,bus,freq,at,dur,wave,amp,slide=1){
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=wave;o.frequency.setValueAtTime(Math.max(40,freq),at);
  if(slide!==1)o.frequency.exponentialRampToValueAtTime(Math.max(40,freq*slide),at+dur);
  g.gain.setValueAtTime(.0001,at);
  g.gain.exponentialRampToValueAtTime(Math.max(.001,amp),at+Math.min(.016,dur*.18));
  g.gain.exponentialRampToValueAtTime(.0001,at+dur);
  o.connect(g);g.connect(bus);o.start(at);o.stop(at+dur+.02);
 }
 class SoundEngine{
  constructor(game){this.game=game;this.ctx=null;this.musicBus=null;this.fxBus=null;this.next=0;this.step=0;this.theme='';this.lastStep=0;this.stepNoise=null;this.musicOn=read(KEY.music,'on')!=='off';this.musicVol=clamp(read(KEY.musicVol,.55));this.fxVol=clamp(read(KEY.fxVol,.72));}
  unlock(){
   try{
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return false;
    this.ctx=this.game.audio||this.ctx||new Audio();
    this.game.audio=this.ctx;
    if(!this.musicBus){
     this.musicBus=this.ctx.createGain();this.fxBus=this.ctx.createGain();
     this.musicBus.connect(this.ctx.destination);this.fxBus.connect(this.ctx.destination);
    }
    this.volumes();
    if(this.ctx.state==='suspended')this.ctx.resume()?.catch?.(()=>{});
    return true;
   }catch{return false;}
  }
  volumes(){
   if(!this.ctx||!this.musicBus)return;
   const t=this.ctx.currentTime;
   this.musicBus.gain.setTargetAtTime(this.musicOn?.32*this.musicVol:0,t,.025);
   this.fxBus.gain.setTargetAtTime(this.game.audioOn?.42*this.fxVol:0,t,.02);
  }
  scene(){const a=this.game.scene;return THEMES[a]?a:'district';}
  tick(){
   const ctx=this.ctx;
   if(!ctx||ctx.state!=='running'||!this.musicOn||this.musicVol<=0||!this.musicBus)return;
   const theme=this.scene();
   if(theme!==this.theme){
    const previous=this.theme;this.theme=theme;this.step=0;this.next=ctx.currentTime+(previous?.16:.035);
    // Fade between regions rather than abruptly switching synthesizer notes.
    if(previous&&this.musicBus?.gain){
     const volume=this.musicOn?.32*this.musicVol:0;
     this.musicBus.gain.setTargetAtTime(.0001,ctx.currentTime,.025);
     this.musicBus.gain.setTargetAtTime(volume,ctx.currentTime+.12,.11);
    }
   }
   if(this.next<ctx.currentTime-.45){this.next=ctx.currentTime+.035;this.step=0;}
   const data=THEMES[theme],interval=60/data.bpm/2;
   let budget=0;
   while(this.next<ctx.currentTime+.20&&budget++<3){
    const i=this.step%32,n=data.lead[i],t=this.next;
    try{
     if(n>0)tone(ctx,this.musicBus,hz(n),t,interval*.79,'square',.10);
     if(i%4===0)tone(ctx,this.musicBus,hz(data.bass[Math.floor(i/4)]),t,interval*2.8,'triangle',.10);
     if(i%2===0){const rootNote=data.bass[Math.floor(i/4)],intervals=[12,19,16,24];tone(ctx,this.musicBus,hz(rootNote+intervals[Math.floor(i/2)%4]),t,interval*.52,'square',.021);}
    }catch{}
    this.step++;this.next+=interval;
   }
  }
  effect(type){
   if(!this.game.audioOn||this.fxVol<=0||!this.ctx||this.ctx.state!=='running')return;
   const notes=EFFECTS[type]||EFFECTS.menu,t=this.ctx.currentTime;
   const foot=['step','snowStep','metalStep'].includes(type);
   const pitch=foot?(this.lastStep++%2===0?1.07:.94):1;
   try{
    for(const [f,offset,duration,wave] of notes)tone(this.ctx,this.fxBus,f*pitch,t+offset,duration,wave,foot?.052:.087,type==='dash'?.58:type==='land'?.69:1);
    if(['snowStep','metalStep','land','dash'].includes(type))this.texture(type,t);
   }catch{}
  }
  texture(type,t){
   const ctx=this.ctx;
   if(!ctx?.createBuffer||!ctx.createBufferSource||!ctx.createBiquadFilter)return;
   if(!this.stepNoise){
    const rate=ctx.sampleRate||44100,size=Math.max(128,Math.floor(rate*.07));
    this.stepNoise=ctx.createBuffer(1,size,rate);
    const samples=this.stepNoise.getChannelData(0);let state=38591;
    for(let i=0;i<size;i++){state=(Math.imul(1664525,state)+1013904223)>>>0;samples[i]=((state/4294967295)*2-1)*Math.pow(1-i/size,1.25);}
   }
   const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
   src.buffer=this.stepNoise;
   filter.type=type==='snowStep'?'lowpass':'highpass';
   filter.frequency.setValueAtTime(type==='snowStep'?700:type==='metalStep'?1400:950,t);
   gain.gain.setValueAtTime(type==='dash'?.072:.062,t);
   gain.gain.exponentialRampToValueAtTime(.0001,t+.062);
   src.connect(filter).connect(gain).connect(this.fxBus);src.start(t);src.stop(t+.067);
  }
  beep(freq,dur){
   if(!this.game.audioOn||this.fxVol<=0||!this.ctx||this.ctx.state!=='running')return;
   try{tone(this.ctx,this.fxBus,Math.max(60,Math.min(1600,Number(freq)||450)),this.ctx.currentTime,Math.max(.025,Math.min(.30,Number(dur)||.1)),'triangle',.065);}catch{}
  }
 }
 root.Soundtrack={THEMES,EFFECTS,KEY,clamp,hz,SoundEngine};
 const Game=root.Game;
 if(!Game)throw Error('Game must be loaded before soundtrack');
 Game.prototype.unlockAudio=function(){
  if(!this.soundEngine)this.soundEngine=new SoundEngine(this);
  return this.soundEngine.unlock();
 };
 Game.prototype.ambientTick=function(){this.soundEngine?.tick();};
 Game.prototype.sfx=function(type){
  if(this.hapticOn&&typeof navigator!=='undefined'&&typeof navigator.vibrate==='function'&&['collect','success','deny','gate','robot'].includes(type)){
   try{navigator.vibrate(type==='deny'?[15,35,15]:[20])}catch{}
  }
  this.soundEngine?.effect(type);
 };
 Game.prototype.beep=function(freq=450,duration=.1){this.soundEngine?.beep(freq,duration);};
 const oldSetup=Game.prototype.setupDisplay;
 Game.prototype.setupDisplay=function(){
  this.audioOn=read(KEY.fxEnabled,'on')!=='off';
  const outcome=oldSetup.call(this);
  const sound=this.soundEngine||(this.soundEngine=new SoundEngine(this));
  const audioButton=document.getElementById('audio-button');
  if(audioButton){
   const update=()=>{audioButton.textContent='♪ Efectos: '+(this.audioOn?'activados':'desactivados');audioButton.setAttribute('aria-pressed',String(this.audioOn));};
   update();
   audioButton.addEventListener('click',()=>{write(KEY.fxEnabled,this.audioOn?'on':'off');sound.volumes();update();});
  }
  const pref=document.querySelector('.menu-quick-preferences');
  if(pref&&!document.getElementById('music-button')){
   const group=document.createElement('div');group.className='audio-preferences';
   group.innerHTML='<button id="music-button" type="button" class="secondary" aria-pressed="true">♫ Música 8-bit: activada</button>'+
    '<label for="music-volume">Volumen de música <span id="music-volume-value">55%</span></label>'+
    '<input id="music-volume" type="range" min="0" max="100" step="5" value="55" aria-label="Volumen de música 8-bit"/>'+
    '<label for="effects-volume">Volumen de efectos <span id="effects-volume-value">72%</span></label>'+
    '<input id="effects-volume" type="range" min="0" max="100" step="5" value="70" aria-label="Volumen de efectos de juego"/>';
   pref.append(group);
   const style=document.createElement('style');
   style.textContent='.menu-v042 .audio-preferences{display:grid;gap:8px;margin-top:7px;padding:12px;background:#0e2b41;border:1px solid #608992;border-radius:9px}.menu-v042 .audio-preferences>button{min-height:45px;padding:9px 12px;text-align:center;font-weight:800}.menu-v042 .audio-preferences label{display:flex;justify-content:space-between;gap:8px;color:#e6f5e9;font:700 12px/1.4 system-ui}.menu-v042 .audio-preferences label span{color:#a7e5d5}.menu-v042 .audio-preferences input[type=range]{width:100%;min-height:28px;accent-color:#91e5bb;cursor:pointer}.menu-v042 .audio-preferences input[type=range]:focus-visible{outline:3px solid #ffe4a2;outline-offset:3px}';
   document.head.append(style);
  }
  const button=document.getElementById('music-button');
  const music=document.getElementById('music-volume'),effects=document.getElementById('effects-volume');
  const show=()=>{
   if(button){button.textContent='♫ Música 8-bit: '+(sound.musicOn?'activada':'desactivada');button.setAttribute('aria-pressed',String(sound.musicOn));}
   if(music){music.value=String(Math.round(sound.musicVol*100));document.getElementById('music-volume-value').textContent=Math.round(sound.musicVol*100)+'%';}
   if(effects){effects.value=String(Math.round(sound.fxVol*100));document.getElementById('effects-volume-value').textContent=Math.round(sound.fxVol*100)+'%';}
  };
  button?.addEventListener('click',()=>{
   sound.musicOn=!sound.musicOn;write(KEY.music,sound.musicOn?'on':'off');
   if(sound.musicOn){this.unlockAudio();sound.next=0;this.soundEngine.tick();}
   sound.volumes();show();
  });
  music?.addEventListener('input',()=>{sound.musicVol=clamp(music.value/100);write(KEY.musicVol,sound.musicVol);if(sound.musicVol>0&&sound.musicOn)this.unlockAudio();sound.volumes();show();});
  effects?.addEventListener('input',()=>{sound.fxVol=clamp(effects.value/100);write(KEY.fxVol,sound.fxVol);sound.volumes();show();});
  // The earlier ambient option is superseded by the soundtrack, not layered over it.
  const legacy=document.getElementById('ambient-button');if(legacy)legacy.hidden=true;
  show();return outcome;
 };
 const oldMove=Game.prototype.move;
 Game.prototype.move=function(dt){
  const before=this.stepTimer,oldAir=!!this.player?.onGround;
  const result=oldMove.call(this,dt);
  const p=this.player;
  if(p?.onGround&&Math.abs(p.vx)>30&&this.stepTimer<before)this.sfx(['district','rooftops','metro','archive','workshop','tower','guardian','training'].includes(this.scene)?'metalStep':'snowStep');
  if(p?.justJumped)this.sfx('jump');
  if(p?.landed&&!oldAir)this.sfx('land');
  if(p?.justDashed)this.sfx('dash');
  return result;
 };
 const oldInteract=Game.prototype.interact;
 Game.prototype.interact=function(){
  if(this.scenePrompt?.())this.sfx('interact');
  return oldInteract.call(this);
 };
 const oldSceneChange=Game.prototype.sceneChange;
 Game.prototype.sceneChange=function(scene,x){
  const out=oldSceneChange.call(this,scene,x);
  if(this.soundEngine){this.soundEngine.theme='';this.soundEngine.next=0;}
  return out;
 };
 // Web Audio is permission-gated: unlock on the first genuine keyboard or pointer interaction.
 const activate=()=>{root.game?.unlockAudio();};
 document.addEventListener('pointerdown',activate,{once:true,passive:true});
 document.addEventListener('keydown',activate,{once:true});
})(window.Lumina=window.Lumina||{});
