import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const polish=readFileSync(new URL('../polish-system.js',import.meta.url),'utf8');
const audio=readFileSync(new URL('../audio-system.js',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const sources=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const guidance=sources.find(x=>x.includes('root.Guidance={pick,direction}'));
const lab=sources.find(x=>x.includes('root.LogicLabModel='));
assert.ok(guidance&&lab,'World direction and teaching engines exist');
assert.ok(html.includes('src="./polish-system.js"'));
assert.ok(sw.includes('./polish-system.js'),'Offline shell ships player tools');
assert.ok(polish.includes('root.PlayerTools='));
assert.ok(polish.includes("json.app!=='lumina'"),'Do not accept arbitrary JSON as player saves');
assert.ok(polish.includes('file.size>125000'),'Import is size limited');
assert.ok(polish.includes('window.confirm('),'Import requires explicit replacement confirmation');
assert.ok(polish.includes('navigator')===false,'Save tools perform no external tracking');
assert.ok(html.includes('id="lab-guide-skip"'),'Learners can skip optional explanation');
assert.ok(html.includes("['lab-guide-skip',()=>{this.guideOpen=false;"),'Skip opens the mission');
assert.ok(audio.includes('ctx.currentTime+.12'),'Music transitions crossfade instead of cutting notes');

const env={window:{Lumina:{}},console};
vm.runInNewContext(guidance,env);
const G=env.window.Lumina.Guidance;
let save={orbs:[],bridgeMiniCheckpoint:false,bridgeCheckpoint:false};
let arrow=G.direction('bridge',save,302,280);
assert.equal(arrow.vertical,-1,'A nearby elevated orb prompts an upward arrow');
assert.equal(arrow.side,0);
assert.equal(G.direction('bridge',save,302),null,'Legacy guidance calls remain backward-compatible');
assert.equal(G.direction('bridge',save,100,280).side,1,'Faraway objectives still guide horizontally');
assert.equal(G.direction('metro',{metroRelays:[false,false]},332,280).vertical,-1,'Metro signals show elevation');
assert.equal(G.direction('bridge',save,302,225),null,'Prompt disappears once player reaches target height');
assert.equal(G.direction('bridge',save,302,400).vertical,-1,'Vertical hints also work below elevated ground');

vm.runInNewContext(lab,env);
const {translateProgram}=env.window.Lumina.LogicLabModel;
const arrays=['SET0','SENSOR0','SENSOR1','OUTPUT'];
const boolean=['ENERGY','NETWORK','AND','NOT_ALARM','AND','OUTPUT'];
for(const lang of ['python','cpp','javascript']){
 const a=translateProgram(lang,arrays),b=translateProgram(lang,boolean);
 assert.doesNotMatch(a,/sensores = \[3, 7, 11\]|sensores\[\] = \{3, 7, 11\}/,'Array code must read current values');
 assert.doesNotMatch(b,/energia, red, alarma = True, True, False|energia = true, red = true, alarma = false/,'Boolean code must read sensor state');
 assert.match(a,/input\(|std::cin|prompt\(/,lang+' arrays read input');
 assert.match(b,/input\(|std::cin|prompt\(/,lang+' logic reads input');
}
function runPython(program,inputs){
 const out=spawnSync('python3',['-c',program],{input:inputs.join('\n')+'\n',encoding:'utf8',timeout:4000});
 assert.equal(out.status,0,'Python preview should actually execute: '+out.stderr);
 return out.stdout.trim().split('\n').at(-1);
}
function runCpp(program,inputs){
 const tmp=spawnSync('bash',['-lc','command -v g++'],{encoding:'utf8',timeout:4000});
 if(tmp.status!==0)throw Error('g++ unavailable on the test runner');
 const fs=requireFs();
 const os=requireOs();
 const path=requirePath();
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lumina-code-'));
 try{
  fs.writeFileSync(path.join(dir,'program.cpp'),program);
  const exe=path.join(dir,'prog');
  const compile=spawnSync('g++',['-std=c++17',path.join(dir,'program.cpp'),'-o',exe],{encoding:'utf8',timeout:15000});
  assert.equal(compile.status,0,'C++ preview should compile: '+compile.stderr);
  const run=spawnSync(exe,[],{input:inputs.join('\n')+'\n',encoding:'utf8',timeout:4000});
  assert.equal(run.status,0,'C++ preview should execute: '+run.stderr);
  return run.stdout.trim().split('\n').at(-1);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
function runJS(program,inputs){
 const data=[...inputs],values=[];
 vm.runInNewContext(program,{prompt:()=>data.shift(),console:{log:value=>values.push(value)}});
 return values.at(-1);
}
function requireFs(){return fs;}
function requireOs(){return os;}
function requirePath(){return path;}
const fs=await import('node:fs'),os=await import('node:os'),path=await import('node:path');
for(const [inputs,expected] of [[['3','7','11'],'10'],[['5','2','9'],'7']]){
 assert.equal(runPython(translateProgram('python',arrays),inputs),expected,'Python arrays generalize');
 assert.equal(runCpp(translateProgram('cpp',arrays),inputs),expected,'C++ arrays generalize');
 assert.equal(String(runJS(translateProgram('javascript',arrays),inputs)),expected,'JavaScript arrays generalize');
}
for(const [inputs,expected] of [[['1','1','0'],true],[['0','1','0'],false],[['1','1','1'],false]]){
 assert.equal(runPython(translateProgram('python',boolean),inputs),expected?'True':'False','Python Boolean generalization');
 assert.equal(runCpp(translateProgram('cpp',boolean),inputs),expected?'1':'0','C++ Boolean generalization');
 assert.equal(runJS(translateProgram('javascript',boolean),inputs),expected,'JavaScript Boolean generalization');
}
console.log('POLISH PASS: vertical navigation, skippable lessons, secure save UI, offline resources, crossfade and executable code in three languages');
