import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const dir = mkdtempSync(join(tmpdir(), "octave-v4-"));
const source = name => readFileSync(join(root, name), "utf8");
try {
  mkdirSync(join(dir, "components/octave-v3"), { recursive: true });
  mkdirSync(join(dir, "components/octave-v4"), { recursive: true });
  for (const [from, to] of [
    ["components/octave-v3/kinematics.ts", "components/octave-v3/kinematics.js"],
    ["components/octave-v4/behavior.ts", "components/octave-v4/behavior.js"],
  ]) {
    const compiled = ts.transpileModule(source(from), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    writeFileSync(join(dir, to), compiled);
  }
  const require = createRequire(import.meta.url);
  const k = require(join(dir, "components/octave-v3/kinematics.js"));
  const b = require(join(dir, "components/octave-v4/behavior.js"));

  assert.equal(b.armToward(1,0), 0);
  assert.equal(b.isClose(0,0), true);
  assert.equal(b.isClose(1,1), false);
  assert.equal(b.clampPointer(Infinity), 0);

  let maxOpeningStep = 0, previous = b.openingAt(0), frames = 0;
  for(let t = 0; t <= b.REVEAL_DURATION; t += .025) {
    const choreo = b.openingAt(t);
    assert.ok(choreo.teardown >= 0 && choreo.teardown <= 1);
    assert.ok(choreo.cutaway >= 0 && choreo.cutaway <= 1);
    assert.ok(choreo.extension >= 0 && choreo.extension <= 1);
    maxOpeningStep = Math.max(maxOpeningStep,
      Math.abs(choreo.teardown - previous.teardown),
      Math.abs(choreo.cutaway - previous.cutaway));
    previous = choreo;
    frames++;
  }
  assert.ok(maxOpeningStep < .035, "Choreography must not jump between 25ms frames");
  assert.ok(b.openingAt(4.5).teardown > .97, "Full opening must reveal the chassis");
  assert.ok(b.openingAt(4.5).cutaway > .97, "Opening must expose the interior");
  assert.ok(b.openingAt(8.8).teardown < .001, "Shell must close fully");
  assert.ok(b.openingAt(8.8).cutaway < .001, "Opaque shell must return");
  assert.deepEqual(b.openingAt(5.2), b.openingAt(5.2), "Exact-frame replay");

  let samples = 0;
  for(const phase of [
    "unaware", "noticed", "startled", "curious", "connected", "reveal", "complete"
  ]) {
    for(let i = 0; i <= 80; i++) {
      const time = i * .11;
      const input = {
        phase, time, phaseTime: time, pointerX: Math.sin(time),
        pointerY: Math.cos(time) * .75, present: true, touchedArm: 3,
      };
      const result = b.encounterAt(input);
      assert.deepEqual(result, b.encounterAt(input), "Scene must be deterministic");
      assert.equal(result.frame.arms.length, k.ARM_COUNT);
      assert.equal(result.frame.panels.length, k.PANEL_COUNT);
      assert.ok(result.frame.arms.every(arm => arm.joints.length === k.LINKS_PER_ARM + 1));
      for(const arm of result.frame.arms) {
        assert.deepEqual(arm.socket, arm.joints[0], "Arm sockets stay attached");
        for(const joint of arm.joints) {
          assert.ok(joint.every(Number.isFinite), "Every joint must be finite");
        }
      }
      for(const panel of result.frame.panels) {
        assert.ok(panel.offset.every(Number.isFinite));
      }
      samples++;
    }
  }

  const dragged = b.encounterAt({
    phase:"complete",time:5,phaseTime:0,pointerX:0,pointerY:0,
    present:true,touchedArm:2,
    drag:{kind:"arm",index:1,offset:[.4,0,.5]},
  }).frame;
  const intact = b.encounterAt({
    phase:"complete",time:5,phaseTime:0,pointerX:0,pointerY:0,
    present:true,touchedArm:2,
  }).frame;
  assert.deepEqual(dragged.arms[1].socket,intact.arms[1].socket);
  assert.ok(k.distance(dragged.arms[1].joints[18],intact.arms[1].joints[18]) > .45);

  console.log(JSON.stringify({
    passed: true, sceneSamples:samples,
    openingSamples:frames, maxOpeningStep:Number(maxOpeningStep.toFixed(5)),
    fullReveal:true, assemblyReturns:true, stableArmRoots:true,
    determinism:true,
  },null,2));
} finally {
  rmSync(dir, {recursive:true,force:true});
}
