import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

// Transpile only the pure kinematics module. No browser or WebGL is required,
// and no runtime dependency is added to the site.
const root = resolve(import.meta.dirname ?? dirname(new URL(import.meta.url).pathname), "..");
const temp = mkdtempSync(join(tmpdir(), "octave-v3-"));
const file = join(temp, "kinematics.cjs");
const source = readFileSync(join(root, "components/octave-v3/kinematics.ts"), "utf8");
writeFileSync(file, ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText);
const k = createRequire(import.meta.url)(file);
rmSync(temp, { recursive: true, force: true });

const {
  ARM_COUNT, LINKS_PER_ARM, PANEL_COUNT, TOTAL_LINKS, TOUR_DURATION,
  tourAt, poseAt, modeInput, cueAt, length, distance, sub,
} = k;
assert.equal(ARM_COUNT, 8);
assert.equal(LINKS_PER_ARM, 18);
assert.equal(PANEL_COUNT, 12);
assert.equal(TOTAL_LINKS, 144);
assert.equal(TOUR_DURATION, 26);
assert.equal(cueAt(12.5).label, "03 / TEARDOWN");
assert.equal(cueAt(24.5).label, "07 / RESUME");

let maxJointStep = 0;
let minLink = Infinity, maxLink = 0;
let previous = null;
for (let i=0; i<260; i++) {
  const t=i/10, input=tourAt(t), frame=poseAt(input);
  assert.deepEqual(frame, poseAt(tourAt(t)), `Frame ${t} is deterministic`);
  assert.equal(frame.arms.length, 8);
  assert.equal(frame.panels.length, 12);
  assert.equal(frame.readout.links, frame.arms.length * LINKS_PER_ARM);
  assert.equal(frame.readout.energy, frame.energy);
  assert.equal(frame.readout.cutaway, frame.cutaway);
  assert.equal(frame.readout.extension, frame.extension);
  assert.ok(frame.teardown>=0 && frame.teardown<=1);
  assert.ok(frame.readout.activeSubsystems>=0 && frame.readout.activeSubsystems<=21);
  assert.ok(frame.arms.every(arm=>arm.joints.length===LINKS_PER_ARM+1));
  for (const arm of frame.arms) {
    assert.deepEqual(arm.socket, arm.joints[0]);
    for (let j=1; j<arm.joints.length; j++) {
      const dist=distance(arm.joints[j], arm.joints[j-1]);
      assert.ok(Number.isFinite(dist), "Every link position must be finite");
      minLink=Math.min(minLink,dist);maxLink=Math.max(maxLink,dist);
      assert.ok(dist>.12 && dist<.60, `Connected link dimension within tolerance, t=${t}`);
      if (previous) maxJointStep=Math.max(
        maxJointStep, distance(arm.joints[j], previous.arms[arm.arm].joints[j]));
    }
  }
  for (const panel of frame.panels) {
    assert.ok(Math.abs(length(panel.normal)-1)<1e-10, "Every shell normal is normalized");
    assert.ok(panel.offset.every(Number.isFinite), "Every shell offset is finite");
  }
  previous=frame;
}
assert.ok(maxJointStep < .12, `Smooth 0.1-second frame transition: ${maxJointStep}`);
const start=poseAt(tourAt(0)), end=poseAt(tourAt(TOUR_DURATION-.0001));
assert.ok(Math.abs(start.energy-end.energy)<.005);
assert.ok(Math.abs(start.extension-end.extension)<.005);
for (let i=0;i<ARM_COUNT;i++)for(let j=0;j<=LINKS_PER_ARM;j++) {
  assert.ok(distance(start.arms[i].joints[j],end.arms[i].joints[j])<.002,
    "Seamless tour-loop geometry");
}
const teardown=poseAt(modeInput("teardown",12.5));
assert.ok(Math.abs(teardown.readout.separation-.76)<1e-9);
assert.equal(teardown.readout.activeSubsystems,21);
for (const p of teardown.panels){
  assert.ok(Math.abs(length(p.offset)-.51)<1e-9,"Panels separate along their true normals");
  assert.ok(distance(p.offset,p.normal.map(x=>x*.51))<1e-9);
}
const inspect=poseAt(modeInput("cutaway",14.5));
assert.equal(inspect.cutaway,1);
const isolated=poseAt(modeInput("isolate",18.2,4));
assert.equal(isolated.isolateArm,4);
assert.equal(isolated.isolationWeight,1);
const operated=poseAt(modeInput("operate",19.0));
assert.equal(operated.teardown,0);
const manual=modeInput("operate",14);
manual.manualArmOffsets=Array.from({length:8},(_,i)=>i===0?[.5,.2,.1]:[0,0,0]);
manual.manualPanelOffsets=Array.from({length:12},(_,i)=>i===0?[.2,0,.1]:[0,0,0]);
const modified=poseAt(manual),unmodified=poseAt(modeInput("operate",14));
assert.ok(distance(modified.arms[0].joints[0],unmodified.arms[0].joints[0])<1e-8,
  "Dragged arm retains its root joint");
assert.ok(distance(modified.arms[0].joints[18],unmodified.arms[0].joints[18])>.3,
  "Dragged arm tip moves");
assert.ok(distance(sub(modified.panels[0].offset,unmodified.panels[0].offset),[.2,0,.1])<1e-9,
  "Manual shell offsets derive from the same model");

console.log(JSON.stringify({
  success:true, samples:260, arms:ARM_COUNT, links:TOTAL_LINKS, panels:PANEL_COUNT,
  minLink:Number(minLink.toFixed(4)),maxLink:Number(maxLink.toFixed(4)),
  maxJointStep:Number(maxJointStep.toFixed(4)),loop: "continuous",
  frameDeterminism:"passed",dragAnchors:"passed",
},null,2));
