// Lúmina 0.7.1 — Quiet directional guidance is contextual and optional.
// Run with Node.js 20+: node tests/v071-wayfinding-smoke.mjs
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const mod=scripts.find(x=>x.includes('root.Guidance={pick,direction}'));
assert.ok(mod,'Guidance model must be included in the standalone build');
const env={window:{Lumina:{}}};vm.runInNewContext(mod,env);
const G=env.window.Lumina.Guidance;
assert.ok(G);
const base={
 cityGate:false,cityPowered:false,cityVariableSolved:false,cityNixAwake:false,cityCompleted:false,
 metroRelays:[false,false],roofAntennas:[false,false],archiveNodes:[false,false,false],
 orbs:[],robot:false,beacon:false,bridgeMiniCheckpoint:false,bridgeCheckpoint:false,
 gateBroken:false,labDiscovered:false
};
const next=(scene,over={},x=50)=>G.pick(scene,{...base,...over},x);
assert.equal(next('district').x,606);
assert.equal(next('district',{cityGate:true}).x,1090);
assert.equal(next('district',{cityGate:true,cityPowered:true}).x,1505);
assert.equal(next('district',{cityGate:true,cityPowered:true,cityVariableSolved:true}).x,2040);
assert.equal(next('district',{cityGate:true,cityPowered:true,cityVariableSolved:true,cityNixAwake:true}).x,2240);
assert.equal(next('metro',{},600).x,710,'Nearest unfinished relay rather than first on map');
assert.equal(next('metro',{metroRelays:[false,true]},800).x,340,'Do not guide back to completed relay');
assert.equal(next('metro',{metroRelays:[true,true]}).x,934,'Archive is part of the story before the northern train');
assert.equal(next('metro',{metroRelays:[true,true],guardianDefeated:true}).x,1230,'The train becomes the next goal after the Centinela');
assert.equal(next('metro',{metroRelays:[true,true],beacon:true}).x,1230,'Previously finished runs retain their northern route');
assert.equal(next('rooftops',{},700).x,805);
assert.equal(next('rooftops',{roofAntennas:[true,true]}).x,75);
assert.equal(next('archive',{},480).x,520);
assert.equal(next('archive',{archiveNodes:[true,true,true]}).x,925);
assert.equal(next('archive',{archiveNodes:[true,true,true],guardianDefeated:true}).x,68);
assert.equal(next('harbor').x,185);
assert.equal(next('harbor',{orbs:['move']}).x,473);
assert.equal(next('harbor',{orbs:['move'],robot:true}).x,1140);
assert.equal(next('workshop').x,292);
assert.equal(next('workshop',{orbs:['code']}).x,435);
assert.equal(next('workshop',{orbs:['code'],robot:true,cityVariableSolved:true}).x,95,'Optional LAB does not divert the main objective');
assert.equal(next('workshop',{orbs:['code'],robot:true,cityVariableSolved:true,labDiscovered:true}).x,95);
assert.equal(next('bridge').x,310);
assert.equal(next('bridge',{orbs:['jump']}).x,432);
assert.equal(next('bridge',{orbs:['jump'],bridgeMiniCheckpoint:true}).x,817);
assert.equal(next('bridge',{orbs:['jump'],bridgeMiniCheckpoint:true,bridgeCheckpoint:true}).x,1290);
assert.equal(next('bridge',{orbs:['jump','dash'],bridgeMiniCheckpoint:true,bridgeCheckpoint:true}).x,1440);
assert.equal(next('bridge',{orbs:['jump','dash'],bridgeMiniCheckpoint:true,bridgeCheckpoint:true,gateBroken:true}).x,1693);
assert.equal(next('tower').x,350);
assert.equal(next('tower',{beacon:true}).x,975);
assert.equal(next('guardian'),null);
assert.equal(next('training'),null);
assert.equal(next('ending'),null);
assert.equal(G.direction('metro',base,100).side,1);
assert.equal(G.direction('metro',base,920).side,-1);
assert.equal(G.direction('metro',base,325),null,'Hide arrow when player is close enough to interact');
assert.equal(G.direction('training',base,80),null);
assert.equal(G.direction('district',base,NaN),null);
assert.match(html,/id="guidance-mode"/);
assert.match(html,/value="hint">Solo al pedir Pista/);
assert.match(html,/value="off">Sin flechas/);
assert.match(html,/lumina-guidance-mode-v1/);
assert.match(html,/this\.drawGuidance\(game\)/);
assert.match(html,/game\.guidanceMode==='off'/);
console.log('v0.7.1 navigation PASS: scene goals, nearby suppression, left/right, save options');
