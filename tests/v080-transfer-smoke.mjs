// Lúmina v0.8 — transfer learning across all programmable challenges.
// Run: node tests/v080-transfer-smoke.mjs
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const src=scripts.find(s=>s.includes('root.LogicLabModel='));
assert.ok(src,'Embedded educational engine must exist');
const context={window:{Lumina:{}}};
vm.runInNewContext(src,context);
const m=context.window.Lumina.LogicLabModel;
assert.equal(Object.keys(m.TRANSFER_CASES).length,4);
for(const i of [4,5,6,7])assert.equal(m.TRANSFER_CASES[i].length,2);
const programs=[
 [3,['READ_CHARGE','ADD3','OUTPUT']],
 [4,['READ_CHARGE','REPEAT3_ADD2','OUTPUT']],
 [5,['SET0','SENSOR0','SENSOR1','OUTPUT']],
 [6,['ENERGY','NETWORK','AND','NOT_ALARM','AND','OUTPUT']],
 [7,['READ_CHARGE','ADD3','TEST5','OUTPUT']]
];
for(const [i,program] of programs){
 const report=m.validateTransfer(i,program);
 assert.equal(report.passed,true,'Mission '+(i+1)+' should generalize');
 assert.equal(report.cases.length,2);
 for(const run of report.cases){
  assert.equal(run.valid,true,'Valid trace for mission '+i+': '+run.error);
  assert.equal(run.correct,true,'Correct output for both environments, mission '+i);
  assert.ok(run.trace.length>=3,'Step-by-step trace');
 }
}
assert.equal(m.validateTransfer(4,['SET0','REPEAT3_ADD2','OUTPUT']).passed,false,'Fixed start cannot solve two starting charges');
assert.equal(m.validateTransfer(7,['SET2','ADD3','TEST5','OUTPUT']).passed,false,'Hardcoded comparison must fail changed input');
assert.equal(m.validateTransfer(5,['SET0','SENSOR0','SENSOR2','OUTPUT']).passed,false,'Wrong sensor index must fail');
assert.equal(m.validateTransfer(6,['ENERGY','NETWORK','OR','NOT_ALARM','AND','OUTPUT']).passed,false,'OR is insufficient if energy is absent');
assert.equal(m.runProgram(5,programs[2][1],{sensors:[1,2]}).valid,false,'Malformed sensor vector');
assert.equal(m.runProgram(6,programs[3][1],{energy:1,network:true,alarm:false,target:true}).valid,false,'Invalid boolean sensor');
assert.match(html,/validateTransfer\(this.index,this.draft\)/);
console.log('v0.8 PASS: five programmable challenges tested in two different environments');
