import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../controller-system.js',import.meta.url),'utf8');
const listeners={},nodes={};
class Input{
 constructor(){this.keys=new Set();this.pad={x:0,y:0};this.jumpQueued=false;this.dashQueued=false;this.action=false;}
 isEditing(){return false;}
 reset(){this.jumpQueued=false;this.dashQueued=false;this.action=false;}
 axis(){return {x:0,y:0};}
 holdingJump(){return false;}
 consumeAction(){const out=this.action;this.action=false;return out;}
 consumeJump(){const out=this.jumpQueued;this.jumpQueued=false;return out;}
 consumeDash(){const out=this.dashQueued;this.dashQueued=false;return out;}
}
class Game{frame(){return 'ok';}openMenu(){this.opened=true;}}
const env={
 navigator:{getGamepads:()=>[]},document:{querySelector:()=>null},
 window:{Lumina:{Input,Game},addEventListener:(event,fn)=>{listeners[event]=fn;}},
 console
};
vm.runInNewContext(source,env);
const controller=env.window.Lumina.Controller;
assert.ok(controller&&controller.normalize&&controller.read);
assert.equal(controller.normalize(.1),0,'Deadzone removes analog drift');
assert.ok(controller.normalize(.9)>.8,'Full stick movement remains fast');
assert.equal(controller.normalize(-.8)<0,true,'Stick supports either direction');
assert.equal(controller.read(null).x,0,'Absent device means neutral');
let pad={connected:true,mapping:'standard',axes:[.9,0],buttons:Array.from({length:16},()=>({pressed:false}))};
env.navigator.getGamepads=()=>[pad];
const input=new Input(),game=new Game();game.locked=false;
env.window.Lumina.game=game;game.input=input;
assert.ok(input.axis().x>.8,'Analog stick moves Iris');
pad.axes[0]=.01;pad.buttons[15].pressed=true;
assert.equal(input.axis().x,1,'D-pad right moves Iris');
pad.buttons[15].pressed=false;pad.buttons[14].pressed=true;
assert.equal(input.axis().x,-1,'D-pad left moves Iris');
pad.buttons[14].pressed=false;pad.buttons[0].pressed=true;
assert.equal(input.consumeJump(),true,'A button queues one jump');
assert.equal(input.consumeJump(),false,'Holding a button does not spam new jumps');
assert.equal(input.holdingJump(),true,'Holding A extends variable jump height');
pad.buttons[0].pressed=false;input.axis();
pad.buttons[0].pressed=true;assert.equal(input.consumeJump(),true,'Pressing A again queues another jump');
pad.buttons[0].pressed=false;input.axis();
pad.buttons[1].pressed=true;
assert.equal(input.consumeDash(),true,'B button queues dash');
assert.equal(input.consumeDash(),false,'Dash does not repeat while button is held');
pad.buttons[1].pressed=false;input.axis();
pad.buttons[2].pressed=true;
assert.equal(input.consumeAction(),true,'X button interacts');
assert.equal(input.consumeAction(),false,'Held X does not repeat interactions');
pad.buttons[2].pressed=false;input.axis();
pad.buttons[9].pressed=true;
assert.equal(game.frame(), 'ok');
assert.equal(game.opened,true,'Start button opens the pause menu');
game.opened=false;game.locked=true;
pad.buttons[9].pressed=false;input.axis();
pad.buttons[9].pressed=true;game.frame();
assert.equal(game.opened,false,'Controller does not close locked dialogs');
game.locked=false;
input.reset();assert.equal(input.consumeJump(),false,'Reset clears queued controller commands');
env.navigator.getGamepads=()=>[];
assert.equal(input.axis().x,0,'Disconnecting returns the axis to neutral');
assert.equal(input.holdingJump(),false,'Disconnected controller releases jump');
console.log('CONTROLLER PASS: deadzones, directions, edges, held jump, dash, interact, pause, locked dialogs, disconnect');
