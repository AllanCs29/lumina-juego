import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const hints=readFileSync(new URL('../guided-help.js',import.meta.url),'utf8');
const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).find(x=>x.includes('root.Guidance={pick,direction}'));
assert.ok(script);
assert.match(html,/src="\.\/guided-help\.js"/);
assert.match(readFileSync(new URL('../sw.js',import.meta.url),'utf8'),/guided-help\.js/);
const body={append(){}},head={append(){}};
const elements=[];
const document={body,head,createElement(tag){const e={tag,attrs:{},textContent:'',setAttribute(k,v){this.attrs[k]=v;}};elements.push(e);return e;}};
const root={window:{Lumina:{}},document};
vm.runInNewContext(script,root);
const G=root.window.Lumina.Guidance;
class Game{
 hint(){return 'old hint';}
 flashCaption(t){this.caption=t;}
 sfx(name){this.effect=name;}
}
root.window.Lumina.Game=Game;
vm.runInNewContext(hints,root);
const H=root.window.Lumina.GuidedHelp;
const base={cityGate:false,cityPowered:false,cityVariableSolved:false,cityNixAwake:false,cityCompleted:false,metroRelays:[false,false],archiveNodes:[false,false,false],guardianDefeated:false,orbs:[],robot:false,bridgeCheckpoint:false,bridgeMiniCheckpoint:false,gateBroken:false};
assert.equal(H.key('metro',{...base,metroRelays:[true,false]}),'second');
assert.equal(H.key('archive',{...base,archiveNodes:[true,true,false]}),'array');
assert.equal(H.key('workshop',{...base,orbs:['code'],robot:true}),'exit');
assert.equal(G.pick('workshop',{...base,orbs:['code'],robot:true,cityVariableSolved:true},600).x,95,'LAB is optional, not a required destination');
const g=new Game();
Object.assign(g,{scene:'metro',save:{...base,metroRelays:[true,false]},player:{x:410,y:280},locked:false,guidanceMode:'hint',guidancePulse:0,worldTime:100});
const first=g.hint(),second=g.hint(),third=g.hint(),fourth=g.hint();
assert.match(first,/Relé|relé/,'First hint points to a physical machine');
assert.match(second,/condición/,'Second hint explains the mechanism');
assert.match(third,/energía|alarma/,'Third hint explains the concept');
assert.equal(third,fourth,'Maximum help level does not spoil the solution');
assert.equal(g.guidancePulse,8,'User-requested hints activate only the temporary arrow');
assert.equal(g.caption,fourth,'Hint text is rendered in world');
assert.equal(elements.find(x=>x.attrs['aria-live']==='polite')?.textContent,fourth,'The hint is announced for assistive technologies');
g.save.metroRelays=[true,true];g.save.guardianDefeated=false;
const afterRelay=g.hint();
assert.match(afterRelay,/Archivo/,'A finished relay resets the hints to the new story goal');
g.scene='archive';g.save.archiveNodes=[true,true,false];g.player={x:620,y:280};
assert.match(g.hint(),/Lector|lector/);
assert.match(g.hint(),/arreglo/);
g.scene='bridge';g.save.orbs=[];g.player={x:302,y:280};
const vertical=g.hint();
assert.match(vertical,/↑/,'The first clue indicates a jump to the ledge above Iris');
g.worldTime+=100;
assert.equal(g.hint(),vertical,'Long gap between hint requests resets their specificity');
g.locked=true;
assert.equal(g.hint(),'old hint','Tutorials and overlays keep their existing interaction semantics');
console.log('GUIDANCE PASS: progressive help, safe puzzle teaching, objective reset, vertical arrows and screen readers');
