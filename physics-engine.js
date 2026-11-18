
/* LÚMINA 0.3.5 · Fixed-hitbox platform controller with substep collision.
   Visual sprites never change the physical width or height. */
(function(root){'use strict';
const H=27,W=17;
const levels={
 training:{width:945,ground:[{x:0,y:307,w:945,h:105}],ledges:[{x:404,y:246,w:108,h:11}],hurdles:[{x:317,y:279,w:40,h:28}]},
 guardian:{width:920,ground:[{x:0,y:307,w:920,h:105}],ledges:[{x:170,y:250,w:90,h:10},{x:591,y:246,w:80,h:10}],hurdles:[]},
 metro:{width:1370,ground:[{x:0,y:307,w:1370,h:110}],ledges:[{x:260,y:249,w:105,h:10},{x:641,y:251,w:118,h:10}],hurdles:[{x:480,y:278,w:30,h:29}]},
 rooftops:{width:1070,ground:[{x:0,y:307,w:1070,h:100}],ledges:[{x:260,y:261,w:116,h:10},{x:641,y:243,w:125,h:10}],hurdles:[{x:530,y:280,w:30,h:27}]},
 district:{width:2380,ground:[{x:0,y:307,w:1728,h:90},{x:1812,y:307,w:568,h:90}],bridgeDeck:{x:1728,y:307,w:84,h:12,id:'carga-bridge'},ledges:[{x:302,y:266,w:113,h:10},{x:448,y:247,w:105,h:10},{x:1375,y:265,w:105,h:10},{x:1510,y:242,w:95,h:10},{x:1990,y:259,w:102,h:10}],hurdles:[{x:362,y:285,w:25,h:22},{x:1435,y:280,w:26,h:27}]},
 archive:{width:1060,ground:[{x:0,y:307,w:1060,h:90}],ledges:[{x:218,y:259,w:112,h:11},{x:454,y:238,w:128,h:11},{x:733,y:252,w:125,h:11}],hurdles:[{x:360,y:282,w:27,h:25},{x:663,y:279,w:28,h:28}]},
 harbor:{width:1350,ground:[{x:0,y:307,w:1350,h:90}],ledges:[{x:214,y:255,w:125,h:10},{x:572,y:238,w:115,h:10},{x:760,y:257,w:115,h:10}]},
 workshop:{width:920,ground:[{x:0,y:307,w:920,h:90}],ledges:[]},
 bridge:{width:1850,ground:[{x:0,y:304,w:292,h:90},{x:410,y:302,w:207,h:92},{x:780,y:302,w:223,h:100},{x:1128,y:305,w:722,h:90}],ledges:[{x:265,y:257,w:85,h:12},{x:1003,y:251,w:94,h:12}],moving:[{id:'ice-lift',x:665,y:255,w:90,h:12,amplitude:32,frequency:1.1}],hurdles:[{x:480,y:270,w:29,h:32},{x:1220,y:269,w:33,h:36}]},
 tower:{width:1180,ground:[{x:0,y:308,w:1180,h:90}],ledges:[{x:178,y:255,w:115,h:10},{x:534,y:237,w:150,h:10},{x:754,y:263,w:130,h:10}]}
};
for(const l of Object.values(levels))l.floors=[...l.ground,...l.ledges,...(l.hurdles||[])];
function movingAt(scene,t){return (levels[scene]?.moving||[]).map(m=>({...m,x:m.x+Math.sin(t*m.frequency)*m.amplitude}));}
const CFG=Object.freeze({run:180,acceleration:2150,airAcceleration:1350,friction:2380,airDrag:480,jump:378,upGravity:970,fallGravity:1320,maxFall:700,coyote:.13,jumpBuffer:.15,dashSpeed:370,dashTime:.14,wallSlide:85});
function toward(a,b,c){return a<b?Math.min(a+c,b):Math.max(a-c,b)}
function spawn(x,y){return {x,y,vx:0,vy:0,onGround:true,coyote:CFG.coyote,jumpBuffer:0,dashTime:0,dashReady:true,facing:1,gait:0,wasHoldingJump:false,anim:'idle',landed:false,landTimer:0,jumpTimer:0,support:null}}
function microStep(p,axis,dt,jump,assist,scene,holdingJump,dash,t){
 const level=levels[scene]||levels.bridge;const movers=movingAt(scene,t);
 const hadGround=p.onGround;const prevX=p.x;
 p.coyote=p.onGround?CFG.coyote:Math.max(0,p.coyote-dt);
 if(jump)p.jumpBuffer=CFG.jumpBuffer;else p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);
 p.landTimer=Math.max(0,(p.landTimer||0)-dt);p.jumpTimer=Math.max(0,(p.jumpTimer||0)-dt);
 if(Math.abs(axis)>.12)p.facing=axis>0?1:-1;
 if(p.onGround&&p.support){const platform=movers.find(m=>m.id===p.support);if(platform){const prev=movingAt(scene,t-dt).find(m=>m.id===p.support);if(prev)p.x+=platform.x-prev.x;}}
 if(p.dashTime>0){p.dashTime=Math.max(0,p.dashTime-dt);p.vx=(p.dashDir||p.facing)*CFG.dashSpeed;p.vy=0;}
 else{
  const desired=Math.abs(axis)>.12?axis*CFG.run*((assist ? .9 : 1)):0;
  p.vx=toward(p.vx,desired,dt*(desired?(p.onGround?CFG.acceleration:CFG.airAcceleration):(p.onGround?CFG.friction:CFG.airDrag)));
  if(dash&&p.dashReady){p.dashDir=Math.abs(axis)>.12?Math.sign(axis):p.facing;p.dashTime=CFG.dashTime;p.vx=p.dashDir*CFG.dashSpeed;p.vy=0;p.dashReady=false;p.justDashed=true;p.coyote=0;p.jumpBuffer=0;}
  else{
   if(p.jumpBuffer>0&&p.coyote>0){p.vy=-CFG.jump*(assist?1.03:1);p.onGround=false;p.support=null;p.coyote=0;p.jumpBuffer=0;p.justJumped=true;p.jumpTimer=.15;}
   if(p.vy<0&&p.wasHoldingJump&&!holdingJump&&!p.justJumped)p.vy*=.52;
   p.vy=Math.min(CFG.maxFall,p.vy+(p.vy<0?CFG.upGravity:CFG.fallGravity)*dt);
  }
 }
 p.wasHoldingJump=!!holdingJump;
 p.x=Math.max(0,Math.min(level.width-W,p.x+p.vx*dt));
 // Every crate is a solid obstacle from the side; its top remains jumpable.
 for(const o of level.hurdles||[]){if(p.y+H>o.y+4&&p.y<o.y+o.h&&p.x+W>o.x&&p.x<o.x+o.w){
  if(prevX+W<=o.x+3){p.x=o.x-W;p.vx=0}else if(prevX>=o.x+o.w-3){p.x=o.x+o.w;p.vx=0}
 }}
 if(hadGround&&p.dashTime===0&&Math.abs(p.x-prevX)>.001)p.gait=((p.gait||0)+Math.abs(p.x-prevX)*.075)%(Math.PI*2);
 const bottom=p.y+H;p.y+=p.vy*dt;p.onGround=false;p.support=null;
 if(p.vy>=0){const floors=[...level.floors,...movers];let contact=null;
  for(const f of floors){if(p.x+W>f.x+3&&p.x<f.x+f.w-3&&bottom<=f.y+3&&p.y+H>=f.y){if(!contact||f.y<contact.y)contact=f;}}
  if(contact){p.y=contact.y-H;p.impactSpeed=Math.max(p.impactSpeed||0,p.vy);p.vy=0;p.onGround=true;p.support=contact.id||null;if(!hadGround){p.dashReady=true;p.landed=true;p.landTimer=.16;}
  }
 }
 p.anim=p.dashTime>0?'dash':!p.onGround?(p.vy<0?'jump':'fall'):Math.abs(p.vx)>15?'run':'idle';
 return p;
}
function step(player,axis,dt,jump=false,assist=false,scene='bridge',holdingJump=false,dash=false,worldTime=0){
 const p={...spawn(player.x||0,player.y||0),...player,landed:false,justDashed:false,justJumped:false,impactSpeed:0};dt=Math.max(0,Math.min(dt,.05));axis=Number.isFinite(axis)?Math.max(-1,Math.min(1,axis)):0;
 const steps=Math.max(1,Math.ceil(dt/(1/120))),slice=dt/steps;
 for(let i=0;i<steps;i++)microStep(p,axis,slice,i===0&&jump,assist,scene,holdingJump,i===0&&dash,worldTime-dt+(i+1)*slice);
 return p;
}
function setDistrictBridge(open){const l=levels.district;if(!l)return;const base=[...l.ground,...l.ledges,...(l.hurdles||[])];l.floors=open?[...base,l.bridgeDeck]:base;return l.floors;}
function edgeAhead(p,scene='bridge',dir=1){const level=levels[scene]||levels.bridge,foot=p.y+H,probe=dir>0?p.x+W+26:p.x-26;return !level.floors.some(f=>probe>f.x+3&&probe<f.x+f.w-3&&Math.abs(f.y-foot)<14)}
root.Physics={levels,movingAt,ground:levels.bridge.ground,ledges:levels.bridge.ledges,floors:levels.bridge.floors,CFG,step,spawn,edgeAhead,setDistrictBridge,W,H};
})(typeof window!=='undefined'?(window.Lumina=window.Lumina||{}):(globalThis.Lumina=globalThis.Lumina||{}));


