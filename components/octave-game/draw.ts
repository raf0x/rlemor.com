import {
  STAGE_COUNT, arena, predict,
  type Event as GameEvent, type Vec, type World,
} from "./physics";

export interface Particle extends Vec {
  vx: number; vy: number; life: number; initial: number;
  hue: number; radius: number;
}
export interface Effects {
  particles: Particle[];
  shake: number;
  flash: number;
  lastEvent: GameEvent | null;
  eventTime: number;
}
export const createEffects = (): Effects => ({
  particles: [], shake: 0, flash: 0, lastEvent: null, eventTime: 0,
});
export function addEffect(effects: Effects, world: World, event: GameEvent, reduced: boolean): void {
  effects.lastEvent = event;
  effects.eventTime = .75;
  if (reduced) return;
  const g = arena(world.w, world.h, world.stage, world.stageElapsed);
  const point = event === "hit" || event === "won" ? g.target :
    event === "bounce" ? world.orb : g.anchor;
  const count = event === "hit" || event === "won" ? 38 : event === "bounce" ? 15 : 10;
  const baseHue = event === "hit" || event === "won" ? 158 : event === "bounce" ? 38 : 284;
  if (event === "hit") { effects.flash = .52; effects.shake = 5.5; }
  if (event === "bounce") effects.shake = Math.min(4, effects.shake + 2.5);
  if (event === "launch") effects.shake = 2.5;
  for (let i = 0; i < count; i++) {
    const angle = (i * 2.3999632 + world.elapsed * 17) % (Math.PI * 2);
    const speed = 38 + (i % 7) * 21 + (event === "hit" ? 58 : 0);
    effects.particles.push({
      x: point.x, y: point.y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: .50 + (i % 5) * .10, initial: .50 + (i % 5) * .10,
      hue: (baseHue + i * 19) % 360, radius: 1.4 + (i % 3),
    });
  }
  if (effects.particles.length > 180) effects.particles.splice(0, effects.particles.length - 180);
}
export function updateEffects(effects: Effects, dt: number): void {
  effects.shake *= Math.exp(-dt * 14);
  effects.flash *= Math.exp(-dt * 5);
  effects.eventTime = Math.max(0, effects.eventTime - dt);
  for (const p of effects.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 95 * dt;
    p.life -= dt;
  }
  effects.particles = effects.particles.filter(p => p.life > 0);
}

const hsl = (h: number, s = 91, l = 63, alpha = 1) =>
  'hsla(' + ((h % 360 + 360) % 360).toFixed(1) + ',' + s + '%,' + l + '%,' + alpha + ')';
const TAU = Math.PI * 2;
const fmt = (n: number) => Math.floor(n).toString().padStart(2, "0");
function line(ctx: CanvasRenderingContext2D, points: Vec[], stroke: string, width: number): void {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.stroke();
}
function circle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string | CanvasGradient | CanvasPattern): void {
  ctx.beginPath(); ctx.arc(x, y, Math.max(.1, radius), 0, TAU);
  ctx.fillStyle = color; ctx.fill();
}

function background(ctx: CanvasRenderingContext2D, world: World): void {
  const {w,h} = world;
  ctx.fillStyle = "#091723";
  ctx.fillRect(0, 0, w, h);
  const r = ctx.createRadialGradient(w*.54,h*.43,30,w*.54,h*.43,Math.max(w,h)*.84);
  r.addColorStop(0,"#1a2f3e");
  r.addColorStop(.58,"#0e2130");
  r.addColorStop(1,"#07131f");
  ctx.fillStyle=r;ctx.fillRect(0,0,w,h);
  const grid = Math.max(38, Math.min(64, w / 13));
  ctx.strokeStyle="#9fbdd30c";ctx.lineWidth=1;
  ctx.beginPath();
  for(let x=grid/2;x<w;x+=grid){ctx.moveTo(x,0);ctx.lineTo(x,h)}
  for(let y=grid/2;y<h;y+=grid){ctx.moveTo(0,y);ctx.lineTo(w,y)}
  ctx.stroke();
  // Thin technical scale marks, kept out of the playing field.
  ctx.fillStyle="#acc5cf5f";
  for(let i=0;i<6;i++){
    ctx.fillRect(w*.1+i*Math.max(20,w*.045), h-22, i%2===0?14:7,1);
  }
  ctx.strokeStyle="#85acc42d";ctx.lineWidth=1;
  ctx.strokeRect(15.5,15.5,w-31,h-31);
  // Target guide and horizon create orientation without blocking trajectories.
  ctx.setLineDash([4,7]);
  ctx.strokeStyle="#80afc020";
  ctx.beginPath();ctx.moveTo(w*.44,18);ctx.lineTo(w*.44,h-18);ctx.stroke();
  ctx.setLineDash([]);
}

function drawTentacles(
  ctx: CanvasRenderingContext2D, world: World, t: number,
): void {
  const g=arena(world.w,world.h,world.stage,world.stageElapsed);
  const base=g.base;
  const r=Math.min(64,Math.max(31,world.w*.065));
  const span=world.w<600 ? Math.min(58,world.w*.14) : Math.min(135,world.w*.12,world.h*.25);
  for(let arm=0;arm<8;arm++){
    const a=-.45+arm*TAU/8;
    const phase=Math.sin(t*1.8+arm*1.41);
    const points: Vec[]=[];
    for(let joint=0;joint<=13;joint++){
      const q=joint/13;
      const angle=a+(phase*.22*q*q)+(arm%2===0?1:-1)*q*q*.24;
      const length=r*.45+span*q;
      points.push({x:base.x+Math.cos(angle)*length,y:base.y+Math.sin(angle)*length});
    }
    line(ctx,points,"#08111a",11);
    line(ctx,points,"#415468",6.6);
    for(let j=1;j<points.length;j++){
      const hue=(((arm/8+j/points.length*.3+t*.14)%1)*360);
      line(ctx,[points[j-1],points[j]],hsl(hue,95,61),3.9);
      if(j%2===0){
        circle(ctx,points[j].x,points[j].y,3.6,"#081923");
        circle(ctx,points[j].x,points[j].y,2.25,hsl(hue,95,72));
      }
    }
    circle(ctx,points.at(-1)!.x,points.at(-1)!.y,3.7,"#dbe8f2");
  }

  // Primary articulated launcher arm: physically connected to the charged cell.
  const tip = world.mode==="ready" ? g.anchor :
    world.mode==="aiming" ? world.orb : g.anchor;
  const points:Vec[]=[];
  for(let i=0;i<=13;i++){
    const q=i/13;
    const x=base.x+(tip.x-base.x)*q;
    const y=base.y+(tip.y-base.y)*q-Math.sin(q*Math.PI)*r*.31;
    points.push({x,y});
  }
  line(ctx,points,"#07111b",13);
  line(ctx,points,"#607c90",9);
  for(let i=1;i<points.length;i++){
    const hue=(215+t*40+i*4)%360;
    line(ctx,[points[i-1],points[i]],hsl(hue,96,62),5);
    if(i%2===0)circle(ctx,points[i].x,points[i].y,2.7,"#eef6fd");
  }

  // Head: graphite, brushed silver, and an optical eye, no decorative giant glow.
  ctx.save();ctx.translate(base.x,base.y);
  const face=ctx.createRadialGradient(-r*.33,-r*.37,2,0,0,r*1.25);
  face.addColorStop(0,"#b4ccda");
  face.addColorStop(.44,"#657f92");
  face.addColorStop(1,"#1c3040");
  circle(ctx,0,0,r,face);
  ctx.lineWidth=5;ctx.strokeStyle="#0c1a27";
  ctx.beginPath();ctx.arc(0,0,r-1,0,TAU);ctx.stroke();
  ctx.lineWidth=2;ctx.strokeStyle="#cfdfeb99";
  ctx.beginPath();ctx.arc(0,0,r*.80,0,TAU);ctx.stroke();
  for(let i=0;i<8;i++){
    const a=i*TAU/8+t*.14;
    circle(ctx,Math.cos(a)*r*.86,Math.sin(a)*r*.86,1.8,"#deeff5");
  }
  circle(ctx,r*.06,0,r*.47,"#08141e");
  const hue=(t*65)%360;
  ctx.strokeStyle=hsl(hue,95,70);ctx.lineWidth=Math.max(2,r*.11);
  ctx.beginPath();ctx.arc(r*.06,0,r*.31,0,TAU);ctx.stroke();
  circle(ctx,r*.10,0,r*.19,"#d8faff");
  circle(ctx,r*.15,0,r*.09,"#0d2637");
  ctx.restore();
}

function drawOrb(ctx: CanvasRenderingContext2D, point:Vec, radius:number, t:number, trail=false):void {
  ctx.save();
  ctx.shadowColor="#8ff0ff";
  ctx.shadowBlur=trail?12:24;
  circle(ctx,point.x,point.y,radius,trail?"#96e9ef":"#dcf7ff");
  ctx.shadowBlur=0;
  circle(ctx,point.x,point.y,radius*.72,trail?"#7cbfdc":"#7fe6f7");
  circle(ctx,point.x-radius*.15,point.y-radius*.26,radius*.32,"#fff");
  ctx.strokeStyle=hsl(175+t*95,94,65);ctx.lineWidth=1.3;
  ctx.beginPath();ctx.arc(point.x,point.y,radius+5+Math.sin(t*5)*1.4,0,TAU);ctx.stroke();
  ctx.restore();
}

function drawTarget(ctx: CanvasRenderingContext2D, world:World, t:number, locked:boolean, effects:Effects):void {
  const g=arena(world.w,world.h,world.stage,world.stageElapsed);
  const {x,y,r}=g.target;
  const hue=locked?151:182;
  ctx.save();
  ctx.translate(x,y);
  const outer=r*(1.64+Math.sin(t*2.7)*.065);
  ctx.shadowColor=locked?"#86ffbe":"#58cbf4";ctx.shadowBlur=locked?22:13;
  ctx.strokeStyle=hsl(hue,85,60,.61);ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(0,0,r*1.26,0,TAU);ctx.stroke();
  ctx.shadowBlur=0;
  ctx.setLineDash([r*.22,r*.15]);
  ctx.lineDashOffset=t*r*.42;
  ctx.strokeStyle=hsl(hue,90,69,.68);ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,0,outer,0,TAU);ctx.stroke();
  ctx.setLineDash([]);
  circle(ctx,0,0,r*.85,"#0d2632");
  ctx.strokeStyle=hsl(hue,90,69);ctx.lineWidth=2.8;
  ctx.beginPath();ctx.arc(0,0,r*.73,0,TAU);ctx.stroke();
  const cross=r*.27;
  line(ctx,[{x:-cross,y:0},{x:cross,y:0}],hsl(hue,65,81,.8),1.2);
  line(ctx,[{x:0,y:-cross},{x:0,y:cross}],hsl(hue,65,81,.8),1.2);
  circle(ctx,0,0,3.1,"#dcfefa");
  if(world.mode==="scored"||world.mode==="won"){
    const p=Math.min(1,world.settleElapsed/.85);
    ctx.strokeStyle=hsl(159,90,76,1-p);
    ctx.lineWidth=3-p*2;
    ctx.beginPath();ctx.arc(0,0,r*(1.4+p*2),0,TAU);ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle=locked?"#c2ffd4":"#a8c7d4";
  ctx.font="700 10px ui-monospace, Consolas, monospace";
  ctx.textAlign="center";
  ctx.fillText(locked?"SHOT ALIGNED":"REACTOR / "+fmt(world.stage+1),x,y-r*2.2);
  if(effects.flash>.01){
    ctx.fillStyle="rgba(174,255,209,"+(effects.flash*.20)+")";
    ctx.fillRect(0,0,world.w,world.h);
  }
}

function drawBumpers(ctx: CanvasRenderingContext2D,world:World,t:number):void {
  const g=arena(world.w,world.h,world.stage,world.stageElapsed);
  for(let i=0;i<g.bumpers.length;i++){
    const b=g.bumpers[i];
    const spin=t*(i%2===0?1:-1);
    ctx.save();ctx.translate(b.x,b.y);
    ctx.strokeStyle=hsl(b.hue,96,67,.24);ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(0,0,b.r*1.48,0,TAU);ctx.stroke();
    ctx.rotate(spin);
    ctx.beginPath();
    for(let j=0;j<8;j++){
      const a=j*TAU/8;
      const x=Math.cos(a)*b.r,y=Math.sin(a)*b.r;
      if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.closePath();ctx.fillStyle="#122330";ctx.fill();
    ctx.lineWidth=4;ctx.strokeStyle="#4a6d86";ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,b.r*.73,0,TAU);
    ctx.strokeStyle=hsl(b.hue,91,66,.85);ctx.lineWidth=2.8;ctx.stroke();
    for(let k=0;k<4;k++){
      const a=k*TAU/4;
      circle(ctx,Math.cos(a)*b.r*.45,Math.sin(a)*b.r*.45,2,hsl(b.hue+k*24,94,77));
    }
    circle(ctx,0,0,b.r*.22,"#d1edff");
    ctx.restore();
  }
}

export function drawGame(
  ctx: CanvasRenderingContext2D, world: World, effects: Effects, t: number, reduced:boolean,
): void {
  const w=world.w,h=world.h;
  ctx.save();
  ctx.clearRect(0,0,w,h);
  if(!reduced && effects.shake>.15) {
    const x=Math.sin(t*91)*effects.shake;
    const y=Math.cos(t*107)*effects.shake*.7;
    ctx.translate(x,y);
  }
  background(ctx,world);
  const g=arena(w,h,world.stage,world.stageElapsed);
  const trajectory=world.mode==="aiming"?predict(world):null;
  const locked=trajectory?.locked??false;
  ctx.strokeStyle="#92cde027";ctx.lineWidth=1;ctx.setLineDash([3,7]);
  ctx.beginPath();ctx.moveTo(g.anchor.x,g.anchor.y);ctx.lineTo(g.target.x,g.target.y);ctx.stroke();ctx.setLineDash([]);

  drawBumpers(ctx,world,t);
  drawTarget(ctx,world,t,locked,effects);
  drawTentacles(ctx,world,t);
  if(world.mode==="aiming") {
    const pull=Math.hypot(world.pull.x,world.pull.y);
    const load=pull/g.maxPull;
    // Two elastic bands provide visible weight and charge.
    ctx.strokeStyle=hsl(164+load*110,92,68,.82);
    ctx.lineWidth=Math.max(2.5,3+load*1.5);
    ctx.beginPath();
    ctx.moveTo(g.anchor.x-2,g.anchor.y-6);
    ctx.lineTo(world.orb.x,world.orb.y);
    ctx.lineTo(g.anchor.x-2,g.anchor.y+6);
    ctx.stroke();
    if(trajectory) {
      const pts=trajectory.points;
      pts.forEach((p,i)=>{
        const alpha=Math.min(.92,.92-i/Math.max(pts.length,1)*.75);
        circle(ctx,p.x,p.y,Math.max(1.5,3.1-i*.028),
          locked?"rgba(154,255,198,"+alpha+")":"rgba(208,203,255,"+alpha+")");
      });
      if(locked) {
        ctx.strokeStyle="#9fffc0b5";ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(g.target.x,g.target.y,g.target.r*1.76,0,TAU);ctx.stroke();
      }
    }
    ctx.font="700 11px ui-monospace, Consolas, monospace";
    ctx.fillStyle=locked?"#beffcd":"#d1e4ef";
    ctx.textAlign="left";
    ctx.fillText(locked?"LOCKED ON":"POWER "+Math.round(load*100)+"%",g.anchor.x+25,g.anchor.y+38);
  }
  if(world.mode==="flying"||world.mode==="scored"||world.mode==="won") {
    world.trail.forEach((p,i)=>{
      const weight=(i+1)/world.trail.length;
      circle(ctx,p.x,p.y,g.radius*(.08+.42*weight),hsl(173+weight*67,95,65,weight*.45));
    });
  }
  if(world.mode!=="won"&&world.mode!=="lost")drawOrb(ctx,world.orb,g.radius,t);
  if(world.mode==="ready" && world.stage===0 && world.totalShots===0){
    const r=g.maxPull*.60;
    ctx.save();ctx.setLineDash([4,8]);ctx.lineWidth=1.5;
    ctx.strokeStyle="#d3e6fb9a";
    ctx.beginPath();ctx.moveTo(g.anchor.x-8,g.anchor.y+6);
    ctx.lineTo(g.anchor.x-r,g.anchor.y+r*.53);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle="#bfd5e4";ctx.font="700 10px ui-monospace, Consolas, monospace";
    ctx.textAlign="left";
    ctx.fillText("PULL BACK",Math.max(23,g.anchor.x-r),g.anchor.y+r*.53+23);
    ctx.restore();
  }
  // Genuine game events spawn debris particles independent of the physics solver.
  for(const p of effects.particles){
    const a=Math.max(0,p.life/p.initial);
    circle(ctx,p.x,p.y,p.radius*a,hsl(p.hue,94,70,a));
  }
  // Run progress, visible without hiding the playfield.
  const progress=(world.stage+(world.mode==="scored"||world.mode==="won"?1:0))/STAGE_COUNT;
  ctx.fillStyle="#769db447";ctx.fillRect(0,h-4,w,4);
  ctx.fillStyle="#9ce4d4";ctx.fillRect(0,h-4,w*progress,4);
  ctx.restore();
}

