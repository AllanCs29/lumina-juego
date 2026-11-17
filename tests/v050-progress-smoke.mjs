// Lúmina v0.5.0 — save migration, programming lab, and boss checkpoints.
// Run: node tests/v050-progress-smoke.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
const context={window:{Lumina:{}},document:{
 getElementById:(id)=>nodes.get(id)||nodes.set(id,{hidden:false,textContent:'',value:'',addEventListener(){}}).get(id)
}};
const nodes=new Map();
const get=(id)=>context.document.getElementById(id);
const saveScript=scripts.find(x=>x.includes('const KEY=')&&x.includes('root.Save='));
const bossScript=scripts.find(x=>x.includes('class Guardian{'));
assert.ok(saveScript&&bossScript,'Save and Guardian modules must remain present');
vm.runInNewContext(saveScript,context);
vm.runInNewContext(bossScript,context);
const {Save,Guardian,LogicLabModel}=context.window.Lumina;
assert.equal(LogicLabModel.TASKS.length,3);
for(const [i,answer] of [[0,12],[1,10],[2,5]]){
 assert.equal(LogicLabModel.evaluate(i,answer).correct,true,'lesson '+i+' correct');
 assert.equal(LogicLabModel.evaluate(i,answer+1).correct,false,'lesson '+i+' incorrect');
 assert.match(LogicLabModel.evaluate(i,answer).trace,/=/);
}
assert.equal(LogicLabModel.evaluate(0,'').valid,false);
const fresh=Save.fresh();
assert.equal(fresh.guardianCheckpoint,0);assert.equal(fresh.labCompleted.length,0);
const migrated=Save.clean({...fresh,labCompleted:[0,2,2,99],guardianCheckpoint:2,cityFragments:[0]});
assert.equal(migrated.labCompleted.join(','),'0,2');assert.equal(migrated.guardianCheckpoint,2);
assert.equal(migrated.cityFragments.join(','),'0');
let persisted=0,bursts=0;
const root=context.window.Lumina;
root.Physics={levels:{archive:{width:1060}},spawn:(x,y)=>({x,y,vy:0,vx:0,onGround:true,dashTime:0})};
const game={
 scene:'archive',save:{...fresh,guardianCheckpoint:1,energy:40},
 player:{x:310,y:280,vx:0,onGround:true,dashTime:0},
 energy:40,camera:{x:0,y:76},el:{menu:{hidden:false},toast:{hidden:true}},
 input:{reset(){}},fx:{burst(){bursts++;}},
 persist(){persisted++;},updateObjective(){},updateHud(){},sfx(){},flashCaption(){},toast(){},
 updateMenuState(){}
};
const g=new Guardian(game);game.guardian=g;
g.start(false);assert.equal(g.phase,1,'Reopen from saved second round');
assert.equal(game.scene,'guardian');
g.update(2);assert.equal(g.warning,1);
g.update(1.3);assert.ok(g.pulse>0,'Wave attack is active');
game.player.x=310;g.action();assert.equal(g.phase,2,'Correct answer completed round 2');
assert.equal(game.save.guardianCheckpoint,2,'Checkpoint saved immediately');
assert.ok(persisted>0);
g.clock=5.2;g.update(.02);assert.equal(g.beamWarning,true,'Third round beam telegraphed');
assert.ok(g.beamX>0,'Beam target locked');
g.clock=6.5;g.update(.02);assert.equal(g.beamActive,true);
game.player.x=410;g.action();assert.equal(game.save.guardianDefeated,true,'Final answer can finish boss');
assert.equal(game.save.guardianCheckpoint,3,'All rounds complete');
assert.equal(g.active,false,'Returns to world');
game.save.guardianDefeated=false;game.save.guardianCheckpoint=2;game.scene='archive';
g.start(true);assert.equal(g.phase,0,'Explicit replay starts from first round');
assert.equal(game.save.guardianCheckpoint,0,'Explicit replay resets checkpoint');
console.log('v0.5.0 progression PASS: 3 lessons, save migration, patterns, round checkpoints & replay');
