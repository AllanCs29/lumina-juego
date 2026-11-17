// Lúmina v0.6.1 — educational block engine, persistence and offline shell.
// Run with Node.js 20+: node tests/v060-missions-smoke.mjs
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,existsSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const sandbox={window:{Lumina:{}}};
const modelSource=scripts.find(script=>script.includes('root.LogicLabModel='));
const saveSource=scripts.find(script=>script.includes('root.Save={'));
assert.ok(modelSource&&saveSource,'Expected embedded modules to remain in the standalone HTML');
vm.runInNewContext(modelSource,sandbox);
vm.runInNewContext(saveSource,sandbox);
const {LogicLabModel:m,Save}=sandbox.window.Lumina;
assert.equal(m.TASKS.length,8);
assert.equal(m.GUIDES.length,8,'Every task must teach before asking');
for(let i=0;i<8;i++)assert.equal(m.GUIDES[i].length,4,'Three guided explanation panels');
assert.match(m.TASKS[0].code,/INICIO/);
assert.match(m.TASKS[1].code,/carga ←/);
assert.doesNotMatch(m.TASKS[0].code,/function|let|const/,'No JS syntax in introductory lessons');
const unlock=sandbox.window.Lumina.LabUnlock;
const locked=Save.fresh();
assert.equal(locked.labDiscovered,false,'New game does not unlock advanced program lab');
assert.equal(unlock.enabled(locked),false);
assert.equal(unlock.visible(locked,'district'),false);
assert.equal(unlock.visible(locked,'workshop'),false);
assert.equal(unlock.canDiscover({...locked,cityVariableSolved:true,robot:true},'workshop'),true);
assert.equal(unlock.canDiscover({...locked,cityVariableSolved:true,robot:true},'district'),false);
assert.equal(Save.clean({...locked,labCompleted:[0]}).labDiscovered,true,'Legacy completion restores lab access');
assert.equal(Save.clean({...locked,labDiscovered:true}).labDiscovered,true,'Discovered workshop persists after saving');
assert.equal(Save.clean({...locked,learningLanguage:'python'}).learningLanguage,'python');
assert.equal(Save.clean({...locked,learningLanguage:'unknown'}).learningLanguage,'pseudo');
const program=['SET2','ADD3','OUTPUT'];
for(const [language,expected] of [['pseudo','INICIO'],['python','carga = 2'],['cpp','int main()'],['javascript','let carga = 2']]){
 assert.match(m.translateProgram(language,program),new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\assert.equal(m.TASKS.length,8);')),'Code preview '+language);
}

assert.equal(m.MAX_BLOCKS,14);
for(const [index,input,result] of [[0,12,true],[0,11,false],[1,10,true],[2,5,true]])assert.equal(m.evaluate(index,input).correct,result);
const recipes=[
 [3,['SET2','ADD3','OUTPUT'],5],
 [4,['SET0','REPEAT3_ADD2','OUTPUT'],6],
 [5,['SET0','SENSOR0','SENSOR1','OUTPUT'],10],
 [6,['ENERGY','NETWORK','AND','NOT_ALARM','AND','OUTPUT'],true],
 [7,['SET2','ADD3','TEST5','OUTPUT'],true]
];
for(const [id,ops,expected] of recipes){
 const result=m.runProgram(id,ops);
 assert.equal(result.valid,true,'Mission '+id+' must execute: '+result.error);
 assert.equal(result.correct,true,'Mission '+id+' must pass');
 assert.equal(result.value,expected,'Mission '+id+' output');
 assert.ok(result.trace.length>=3,'Detailed trace for mission '+id);
 assert.equal(result.trace.at(-1).startsWith('MOSTRAR'),true);
}
assert.equal(m.runProgram(3,['SET2','OUTPUT']).correct,false,'Cannot skip required concept');
assert.equal(m.runProgram(3,['OUTPUT']).valid,false,'Cannot output uninitialized accumulator');
assert.equal(m.runProgram(6,['ENERGY','AND','OUTPUT']).valid,false,'Two boolean arguments required');
assert.equal(m.runProgram(3,['SET2','ADD3','OUTPUT','SET2']).valid,false,'Must end after OUTPUT');
assert.equal(m.runProgram(3,Array(15).fill('SET2')).valid,false,'Instruction limit enforced');
assert.equal(m.runProgram(7,['SET2','ADD3','TEST4','OUTPUT']).correct,false,'Incorrect condition does not pass');
assert.equal(m.sanitizedDraft(3,['SET2','SENSOR0','ADD3','OUTPUT']).join(','),'SET2,ADD3,OUTPUT');
const newSave=Save.fresh();
assert.equal(newSave.labCompleted.length,0);
assert.equal(newSave.labMastered,false);
assert.deepEqual(Object.keys(newSave.labDrafts),[]);
const candidate={...newSave,scene:'archive',orbs:['move','jump'],labCompleted:[0,1,2,3,4,5,6,7,7,500],
 labDrafts:{3:['SET2','ADD3','OUTPUT'],4:['SET0','REPEAT3_ADD2','OUTPUT'],5:['bogus',...Array(20).fill('SENSOR0')]},bridgeCheckpoint:true};
const saved=Save.clean(candidate);
assert.equal(saved.labCompleted.length,8,'Completed levels migrated');
assert.equal(saved.labMastered,true,'All stages recognized');
assert.equal(saved.labDrafts[3].join(','),'SET2,ADD3,OUTPUT');
assert.equal(saved.labDrafts[5].length,14,'Draft bounded and sanitized');
assert.equal(saved.bridgeCheckpoint,true,'Prior checkpoint preserved');
assert.equal(saved.scene,'archive');
assert.equal(saved.orbs.join(','),'move,jump');
const stored={value:''},storage={getItem:()=>stored.value,setItem:(_,v)=>{stored.value=v},removeItem:()=>{stored.value=''}};
assert.equal(Save.save(storage,candidate),true);
const loaded=Save.load(storage);
assert.equal(loaded.labMastered,true);assert.equal(loaded.labCompleted.length,8);
assert.equal(loaded.labDrafts[4][1],'REPEAT3_ADD2');
for(const asset of ['manifest.webmanifest','sw.js','icon.svg']){
 assert.ok(existsSync(new URL('../'+asset,import.meta.url)),asset+' is part of deployment');
}
const manifest=JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));
assert.equal(manifest.display,'standalone');assert.equal(manifest.scope,'./');
assert.match(html,/rel="manifest" href="\.\/manifest.webmanifest"/);
assert.match(html,/id="lab-blocks"/);assert.match(html,/id="lab-palette"/);
assert.match(html,/root.LabStations=Object.freeze/);
console.log('Lúmina v0.6.1 PASS — 8 missions, safe interpreter, save migration, in-world terminals & PWA assets');
