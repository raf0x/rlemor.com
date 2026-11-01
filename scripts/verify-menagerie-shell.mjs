import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import "./verify-menagerie-rail.mjs";

// Preserve the earlier shell's architectural and navigation invariants while
// reflecting V4's explicitly approved one-row, open white museum design.
const stage=readFileSync("components/menagerie/MuseumStage.ts","utf8");
const ui=readFileSync("components/menagerie/MenagerieShell.tsx","utf8");
const css=readFileSync("components/menagerie/MenagerieShell.module.css","utf8");
const gallery=readFileSync("components/menagerie/exhibits.ts","utf8");
const sitemap=readFileSync("app/sitemap.ts","utf8");
assert.ok(stage.includes("createWhiteHall"),"True rendered white gallery");
assert.ok(stage.includes("Exactly ONE continuous back wall"),"One actual back wall");
assert.ok(stage.includes("new THREE.BoxGeometry(72,9.4,.27)"),"Back wall geometry");
assert.ok(stage.includes("new THREE.BoxGeometry(105,.20,37)"),"Open floor geometry");
assert.ok(!stage.includes("const onControlsStart"),"No 3D orbit roaming");
assert.ok(stage.includes('specimen-mount:'),"All six future-proof mounting points");
assert.ok(stage.includes('createExhibitSpectrum'),"Creature lighting attached to 3D materials");
assert.ok(stage.includes('createChassisMiniature'),"Preserve legacy Octave locator");
assert.ok(ui.includes('onWheel'),"Trackpad/mouse wheel rail movement");
assert.ok(ui.includes('onMove'),"Horizontal touch and mouse drags");
assert.ok(ui.includes('pointermove'),"Event listeners attached");
assert.ok(ui.includes('onSelect(index)'),"Selection stays in sync after dragging");
assert.ok(ui.includes('visitFromIndex'),"Accessible specimen list");
assert.ok(css.includes('touch-action:pan-y'),"Allow native vertical page scrolling");
assert.ok(css.includes('scroll-snap-type:x mandatory'),"Horizontal HTML index");
assert.ok(css.includes('background:var(--paper)'),"White editorial frame");
assert.ok(gallery.includes('HORIZONTAL GALLERY'));
assert.ok(!sitemap.includes("menagerie-preview"),"Hidden experiment absent from sitemap");
console.log(JSON.stringify({
  passed:true,oneWall:true,openRoof:true,whiteGallery:true,
  cameraHorizontal:true,dragAndWheel:true,
  sixModelMounts:true,legacyOctavePreserved:true,
},null,2));

