import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(file)=>readFileSync(file,"utf8");
const stage=read("components/menagerie/MuseumStage.ts");
const shell=read("components/menagerie/MenagerieShell.tsx");
const css=read("components/menagerie/MenagerieShell.module.css");
const creature=read("components/menagerie/CreatureStage.ts");
const octave=read("components/octave-sculpture/scene.ts");
const legacy=read("app/lab/menagerie-preview-76cf184b/exhibit/[id]/page.tsx");

// Crisp readable native labels rather than small low-resolution text surfaces.
assert.ok(shell.includes('data-plaque={e.id}'),"Six labels use DOM markup");
assert.ok(shell.includes('onPlaques(positions'),"Labels track the moving camera");
assert.ok(css.includes(".plaqueCopy strong"),"Plaque names are real CSS typography");
assert.ok(css.includes("pointer-events:none"),"Placards never block model selection");
assert.ok(css.includes("font:500 21px"),"Plaques use comfortably large serif labels");
assert.ok(stage.includes("positionPlaques"),"Geometry projects to sharp DOM");
assert.ok(stage.includes(".project(camera)"),"Plaques are anchored to a 3D location");
assert.ok(!stage.includes("signTexture"),"No blurry CanvasTexture plaques");
assert.ok(!stage.includes("new THREE.PlaneGeometry(3.68,.92)"),
  "No low-resolution 3D nameplate");

assert.ok(stage.includes("createGalleryRail"),"Horizontal rail retained");
assert.ok(stage.includes("new THREE.BoxGeometry(72,9.4,.27)"),
  "One architectural wall remains in the museum itself");

// Original user-recorded occlusion occurred while orbiting the single
// Jellyfish exhibit. Each dedicated viewer must be OPEN on every side.
assert.ok(!creature.includes("new THREE.BoxGeometry(26,12,.3)"),
  "Remove blocking rear box from independent creature exhibits");
assert.ok(!creature.includes("new THREE.BoxGeometry(.17,8.5,.4)"),
  "Remove blocking vertical architectural posts");
assert.ok(creature.includes("controls.maxPolarAngle=1.47;"),
  "Camera cannot get trapped under its floor");
assert.ok(creature.includes("new THREE.PlaneGeometry(160,160)"),
  "A large open floor replaces the enclosed gallery");

// Obsidian Octave also rotates freely, maintaining its original scene
// materials, skeletal animations and rainbow suction-cup colors.
assert.ok(!octave.includes("new THREE.BoxGeometry(30,12,.23)"),
  "Obsidian gallery does not enclose its creature");
assert.ok(!octave.includes("new THREE.BoxGeometry(.4,10,3.6)"),
  "Obsidian gallery no longer has side walls");
assert.ok(octave.includes("controls.maxPolarAngle=1.49;"),
  "Obsidian lower camera limit is above stage");
assert.ok(octave.includes("GLTFLoader"),"Actual animated GLB preserved");
assert.ok(legacy.includes("<KineticOctopus/>"),
  "The classic Octave mechanical modes remain unchanged");

console.log(JSON.stringify({
  passed:true,htmlPlaques:true,labelsTrackCamera:true,
  noCanvasTexturePlacards:true,modelPickingUnblocked:true,
  fourCreatureViewersOpen:true,obsidianViewerOpen:true,
  legacyOctavePreserved:true,museumArchitecturePreserved:true,
},null,2));

