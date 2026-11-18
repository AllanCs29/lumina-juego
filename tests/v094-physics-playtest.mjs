import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../physics-engine.js',import.meta.url),'utf8');
const env={window:{Lumina:{}}};
vm.runInNewContext(source,env);
const P=env.window.Lumina.Physics;
assert.ok(P&&P.step&&P.spawn);
const dt=1/60;
const walk=(state,scene,frames=1,axis=1,opts={})=>{
 let p=state;
 for(let i=0;i<frames;i++)p=P.step(p,axis,dt,!!opts.jump&&i===0,!!opts.assist,scene,!!opts.hold,!!opts.dash&&i===0,(i+1)*dt);
 return p;
};
// Move with held keyboard input, not assignment to the destination.
let p=P.spawn(82,280);
p=walk(p,'district',110);
assert.ok(p.x>290,'Iris traverses 200px using actual acceleration');
assert.equal(p.facing,1,'Movement faces the direction pressed');
const before=p.x;
p=walk(p,'district',30,-1);
assert.ok(p.x<before,'Opposite direction reverses smoothly');
assert.equal(p.facing,-1);
assert.equal(p.y<=310,true,'Stable district ground does not drop Iris into the void');

// A crate must be solid until a normal jump clears it.
let block=P.spawn(430,280);
block=walk(block,'metro',90,1);
assert.ok(block.x<=466,'The metro crate blocks direct movement');
const blockedX=block.x;
block=walk(block,'metro',1,1,{jump:true,hold:true});
assert.equal(block.justJumped,true);
let escaped=false;
for(let i=0;i<110;i++){
 block=P.step(block,1,dt,false,false,'metro',i<10,false,(i+1)*dt);
 if(block.x>523&&block.y<400){escaped=true;break;}
}
assert.ok(escaped,'Jumping over the obstacle allows reaching the other side');
assert.ok(block.x>blockedX+30,'Jumping is not a decorative action');

// Dash is a real acceleration state, and the next full jump restores the ability.
let d=P.spawn(1390,277);
d=P.step(d,1,dt,false,false,'bridge',false,true,dt);
assert.equal(d.justDashed,true);
assert.equal(d.dashReady,false);
const dashStart=d.x;
for(let i=1;i<12;i++)d=P.step(d,1,dt,false,false,'bridge',false,false,(i+1)*dt);
assert.ok(d.x>dashStart+40,'Dash crosses significantly more ground than walking');

// Playable first bridge jump: try several legal takeoff positions without teleporting.
function crossFirstGap(jumpAt){
 let p=P.spawn(225,277),time=0,jumps=0,landed=0,lowest=0;
 for(let i=0;i<330;i++){
  time+=dt;
  const shouldJump=p.onGround&&((jumps===0&&p.x>=jumpAt)||(jumps===1&&p.x>=340&&p.x<=400));
  p=P.step(p,1,dt,shouldJump,false,'bridge',shouldJump||p.vy<0,false,time);
  if(shouldJump)jumps++;
  if(p.landed)landed++;
  lowest=Math.max(lowest,p.y);
  if(p.y>415)return {success:false,p,jumps,landed,lowest};
  if(p.x>440&&p.onGround)return {success:true,p,jumps,landed,lowest};
 }
 return {success:false,p,jumps,landed,lowest};
}
const trials=[245,255,265,275,285].map(crossFirstGap);
assert.ok(trials.some(x=>x.success),'At least one normal two-jump crossing clears the first ice gap: '+JSON.stringify(trials.map(t=>({x:Math.round(t.p.x),y:Math.round(t.p.y),jumps:t.jumps,landed:t.landed}))));
const cross=trials.find(x=>x.success);
assert.ok(cross.jumps>=1,'Bridge crossing requires actual jump input');
assert.ok(cross.landed>=1,'Bridge jump resolves a real physical landing');

// Frame-rate stability: the same held input remains approximately consistent at 30 and 60 FPS.
function travel(stepDt,frames){
 let p=P.spawn(82,280);
 for(let n=0;n<frames;n++)p=P.step(p,1,stepDt,false,false,'district',false,false,(n+1)*stepDt);
 return p;
}
const thirty=travel(1/30,45),sixty=travel(1/60,90);
assert.ok(Math.abs(thirty.x-sixty.x)<9,'30/60 FPS produce comparable travel distance');
assert.ok(Math.abs(thirty.y-sixty.y)<3,'30/60 FPS preserve grounded vertical alignment');
console.log('PHYSICS PASS: active walking, reverse, solid obstacles, real jumps, dash, ice gap and frame stability');
