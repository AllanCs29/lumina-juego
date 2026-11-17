// Smoke tests for the standalone GitHub Pages build of Lúmina v0.9.0.
// Run: node tests/v048-art-smoke.mjs   (Node.js 20+, no dependencies)
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(html,/<title>Lúmina — Juega para aprender \| v0\.9\.0<\/title>/);
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.ok(scripts.length>=20,'All standalone game modules should remain embedded');
scripts.forEach((source,i)=>assert.doesNotThrow(()=>new vm.Script(source,{filename:'script-'+i+'.js'}),'JS syntax '+i));
const rendererSource=scripts.find(source=>source.includes('class Renderer{'));
assert.ok(rendererSource,'Renderer module should exist');
const sandbox={window:{Lumina:{}},Image:class{constructor(){this.complete=false;this.naturalWidth=0}set src(value){this._src=value}}};
vm.runInNewContext(rendererSource,sandbox);
const drawCalls=[];
const grad=()=>({addColorStop(){}});
const ctx={
 fillRect(...p){drawCalls.push(['rect',...p])},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){drawCalls.push(['polygon'])},stroke(){},
 arc(){},ellipse(){},save(){},restore(){},translate(){},scale(){},
 fillText(...p){drawCalls.push(['text',...p])},
 createRadialGradient:grad,createLinearGradient:grad
};
const r=new sandbox.window.Lumina.Renderer({getContext:()=>ctx});
r.artVisibleLeft=0;r.artVisibleRight=480;r.quality='sharp';
const count=(fn)=>{drawCalls.length=0;fn();return drawCalls.length;};
const closePine=count(()=>r.pine(140,305,.73,'mid'));
const farPine=count(()=>r.pine(140,305,.48,'far'));
assert.ok(closePine>farPine,'Close trees should carry more pixel detail');
for(const [name,draw] of [
 ['terrain',()=>r.terrain({x:0,y:305,w:480},1)],
 ['ledge',()=>r.ledge({x:150,y:222,w:104,h:10})],
 ['hurdle',()=>r.hurdle({x:200,y:270,w:48,h:36})],
 ['tower',()=>r.tower(210,305,true)],
 ['guardian',()=>r.guardianModel(200,305,2,false,0,1,false)]
])assert.ok(count(draw)>4,name+' should render geometry');
assert.equal(count(()=>r.materialTexture(900,100,80,50,4)),0,'Offscreen textures should be culled');
const stamp=(quality)=>{r.quality=quality;drawCalls.length=0;
 r.materialTexture(75,100,190,90,13,['#ffffff','#112233'],10);
 return JSON.stringify(drawCalls);};
const sharp=stamp('sharp');
assert.equal(sharp,stamp('sharp'),'Texture must remain stable over frames');
assert.ok(JSON.parse(sharp).length>JSON.parse(stamp('retro')).length,'Nítida adds actual material detail');
assert.match(html,/controlsTutorial/);
assert.match(html,/guardianWorld/);
assert.match(html,/localStorage/);
console.log('Lúmina v0.9.0: '+scripts.length+' scripts + visual smoke checks OK');
