import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const dir = mkdtempSync(join(tmpdir(), "octave-core-"));
try {
  const source = readFileSync(resolve("components/octave-game/physics.ts"), "utf8");
  writeFileSync(join(dir, "physics.cjs"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText);
  const p = createRequire(import.meta.url)(join(dir, "physics.cjs"));
  const results = [];
  for (const [w,h] of [[1100,640],[768,520],[390,465],[320,390]]) {
    for (const stage of [0,1,2]) {
      const world = p.createWorld(w,h);
      world.stage = stage;
      const g = p.arena(w,h,stage);
      assert.ok(g.anchor.x > 0 && g.anchor.y > 0 && g.anchor.y < h);
      assert.ok(g.target.x < w && g.target.y < h);
      assert.equal(g.bumpers.length, stage === 0 ? 0 : stage === 1 ? 1 : 2);
      let solved = null, lockedCount = 0;
      for(let x=-g.maxPull; x<=-g.maxPull*.30; x+=g.maxPull*.07) {
        for(let y=-g.maxPull*.30; y<=g.maxPull; y+=g.maxPull*.07) {
          p.setPull(world,x,y);
          const shot=p.predict(world);
          if(shot.locked) {
            lockedCount++;
            solved ??={x:world.pull.x,y:world.pull.y,banks:shot.banks};
          }
        }
      }
      assert.ok(solved, "Every level must have a valid shot at viewport " + w + " stage " + stage);
      p.setPull(world,solved.x,solved.y);
      assert.ok(p.predict(world).locked);
      assert.ok(p.launch(world));
      let hit = false, events = [];
      for(let step=0;step<600 && world.mode==="flying";step++){
        events = p.update(world,1/120);
        if(events.includes("hit"))hit=true;
      }
      assert.ok(hit,"Predicted hit must match actual engine at "+w+" stage "+stage);
      assert.equal(world.mode,"scored");
      results.push({w,h,stage:stage+1,pull:solved,lockedOptions:lockedCount,score:world.score});
    }
  }
  const a=p.createWorld(800,500);
  const r=p.arena(800,500,0).maxPull;
  p.setPull(a,-r*.68,r*.2);
  assert.ok(p.launch(a));
  assert.equal(a.charge,p.STARTING_CHARGE-1);
  assert.equal(a.mode,"flying");
  let ticks=0;
  while(a.mode==="flying"&&ticks++<1000)p.update(a,1/120);
  assert.ok(a.mode==="ready"||a.mode==="scored"||a.mode==="lost");
  const b=p.createWorld(1000,600);
  p.setPull(b,-20,20);
  p.cancelPull(b);
  assert.equal(b.mode,"ready");
  assert.equal(b.orb.x,p.arena(1000,600,0).anchor.x);
  p.resizeWorld(b,390,440);
  assert.equal(b.w,390);
  assert.equal(b.h,440);
  // Entire three-stage loop from a real initial world, including moving targets.
  const completeRuns = [];
  for(const [width,height] of [[1100,640],[390,465]]) {
    const game=p.createWorld(width,height);
    let transitions=[];
    for(let stage=0;stage<3;stage++){
      assert.equal(game.stage,stage);
      const g=p.arena(width,height,stage);
      let found=false;
      for(let x=-g.maxPull;x<=-g.maxPull*.3 && !found;x+=g.maxPull*.065){
        for(let y=-g.maxPull*.25;y<=g.maxPull;y+=g.maxPull*.065){
          p.setPull(game,x,y);
          if(p.predict(game).locked){found=true;break;}
        }
      }
      assert.ok(found,"Expected valid shot in full run");
      assert.ok(p.launch(game));
      let hit=false;
      for(let i=0;i<600&&game.mode==="flying";i++){
        if(p.update(game,1/120).includes("hit"))hit=true;
      }
      assert.ok(hit,"Expected each shot to reach a target in live state");
      while(game.mode==="scored")transitions.push(...p.update(game,1/120));
    }
    assert.equal(game.mode,"won");
    assert.equal(game.totalShots,3);
    assert.equal(game.charge,8); // Charges replenish up to a cap of nine
    assert.equal(game.stage,2);
    assert.ok(game.score>2700);
    completeRuns.push({width,height,shots:game.totalShots,score:game.score});
  }
  // Completely missing eight shots should end the run, with no infinite loop.
  const failure=p.createWorld(390,465);
  for(let i=0;i<p.STARTING_CHARGE;i++){
    const g=p.arena(failure.w,failure.h,failure.stage);
    p.setPull(failure,-g.maxPull*.6,-g.maxPull*.2);
    assert.ok(p.launch(failure));
    for(let j=0;j<900&&failure.mode==="flying";j++)p.update(failure,1/120);
    assert.ok(["ready","lost"].includes(failure.mode));
  }
  assert.equal(failure.mode,"lost");
  assert.equal(failure.charge,0);

  console.log(JSON.stringify({passed:true,tests:results.length,completeRuns,missLimit:"passed",levels:results},null,2));
}finally{rmSync(dir,{recursive:true,force:true})}
