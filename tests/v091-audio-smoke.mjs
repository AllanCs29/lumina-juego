import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const audio=readFileSync(new URL('../audio-system.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const store=new Map();
const localStorage={getItem:key=>store.has(key)?store.get(key):null,setItem:(k,v)=>store.set(k,String(v))};
const starts=[];
class AudioContext{
 constructor(){this.state='running';this.currentTime=1;this.destination={};this.gains=[];}
 createOscillator(){const osc={type:'square',frequency:{setValueAtTime() {},exponentialRampToValueAtTime(){}},connect(){return osc},start(t){starts.push(t)},stop(){}};return osc}
 createGain(){const a={gain:{value:0,setTargetAtTime(v){this.value=v},setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){return a}};this.gains.push(a);return a}
}
class Game{
 constructor(){this.audioOn=true;this.scene='district';this.stepTimer=.17;this.player={onGround:true,vx:88};this.input={};}
 setupDisplay(){return 'ok'}
 move(){this.stepTimer=.01;return 'moved'}
 interact(){return 'interacted'}
 sceneChange(scene){this.scene=scene;return scene}
 scenePrompt(){return null}
}
const root={Game};
const document={querySelector(){return null},getElementById(){return null}};
const ctx={window:{Lumina:root,AudioContext},localStorage,document,navigator:{},console};
vm.runInNewContext(audio,ctx,{filename:'audio-system.js'});
const {Soundtrack}=root;
assert.equal(Object.keys(Soundtrack.THEMES).length,10,'Ten original world/encounter music themes');
assert.ok(Object.values(Soundtrack.THEMES).every(t=>t.lead.length===32&&t.bass.length===8));
assert.equal(Object.keys(Soundtrack.EFFECTS).includes('snowStep'),true);
assert.equal(Object.keys(Soundtrack.EFFECTS).includes('metalStep'),true);
assert.match(html,/src="\.\/audio-system\.js"/,'Game loads soundtrack');
assert.match(sw,/\.\/audio-system\.js/,'Offline service worker caches sound module');
const game=new Game();
assert.equal(game.setupDisplay(),'ok');
assert.equal(game.audioOn,true);
assert.equal(game.soundEngine.musicOn,true,'Music enabled by default');
assert.equal(game.unlockAudio(),true);
assert.ok(game.audio instanceof AudioContext);
game.ambientTick();
assert.ok(starts.length>=2,'Music starts pulse and bass voices');
const notes=starts.length;
game.scene='archive';game.ambientTick();
assert.equal(game.soundEngine.theme,'archive','Music changes with the world');
assert.ok(starts.length>notes,'New melody schedules after world transition');
const musicBus=game.soundEngine.musicBus,fxBus=game.soundEngine.fxBus;
assert.ok(musicBus.gain.value>0);
assert.ok(fxBus.gain.value>0);
game.audioOn=false;game.soundEngine.volumes();
assert.equal(fxBus.gain.value,0,'Muting effects does not mute music');
assert.ok(musicBus.gain.value>0);
game.audioOn=true;game.soundEngine.musicOn=false;game.soundEngine.volumes();
assert.equal(musicBus.gain.value,0,'Muting music does not mute effects');
assert.ok(fxBus.gain.value>0);
game.soundEngine.musicOn=true;
game.soundEngine.musicVol=.30;game.soundEngine.fxVol=.65;game.soundEngine.volumes();
assert.ok(Math.abs(musicBus.gain.value-.096)<1e-5);
assert.ok(Math.abs(fxBus.gain.value-.273)<1e-5);
const before=starts.length;game.sfx('collect');game.beep(480,.12);
assert.ok(starts.length>before,'Effects and beep are routed through effects gain');
const after=starts.length;game.audioOn=false;game.sfx('collect');game.beep(480,.12);
assert.equal(starts.length,after,'Effects remain silent when disabled');
game.audioOn=true;
const footsteps=[];game.sfx=name=>footsteps.push(name);
game.scene='harbor';game.move(.016);
assert.equal(footsteps[0],'snowStep','Walking on snow makes steps');
game.scene='metro';game.stepTimer=.17;game.move(.016);
assert.equal(footsteps[1],'metalStep','Walking in station sounds different');
const s=game.soundEngine;
store.set(Soundtrack.KEY.music,'off');
store.set(Soundtrack.KEY.musicVol,'0.2');
store.set(Soundtrack.KEY.fxVol,'0.85');
const fresh=new Soundtrack.SoundEngine(game);
assert.equal(fresh.musicOn,false,'Music toggle survives next game instance');
assert.equal(fresh.musicVol,.2);
assert.equal(fresh.fxVol,.85);
assert.equal(s.musicOn,true,'Existing game settings are not overwritten by save migration');
console.log('AUDIO PASS: original chiptune, walking, independent volumes, persistence and offline asset');
