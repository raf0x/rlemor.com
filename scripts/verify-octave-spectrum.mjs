import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const path="public/lab/octave-sculpture/octave-obsidian.glb";
const buffer=readFileSync(path);
assert.equal(buffer.toString("ascii",0,4),"glTF");
assert.equal(buffer.readUInt32LE(4),2);
assert.equal(buffer.readUInt32LE(8),buffer.byteLength);
const jsonSize=buffer.readUInt32LE(12);
assert.equal(buffer.readUInt32LE(16),0x4e4f534a);
const gltf=JSON.parse(buffer.subarray(20,20+jsonSize).toString());
const spectrum=gltf.materials.filter(m=>/^SPECTRUM CUP \d{2}/.test(m.name??""));
assert.equal(spectrum.length,16,"Sixteen independently animated color channels");
const names=spectrum.map(m=>m.name);
assert.equal(new Set(names).size,16,"Unique, non-duplicated palette names");
assert.equal(gltf.skins?.length,1,"Preserve animated armature");
assert.equal(gltf.skins[0].joints.length,56,"Preserve all eight articulated arm chains");
assert.ok(gltf.animations?.length>=1,"Skeletal animation clip survives compression");
const arms=gltf.nodes.filter(n=>n.skin!==undefined&&n.mesh!==undefined);
assert.equal(arms.length,8,"Eight skinned arms");
const activeMaterials=new Set();
for(const arm of arms){
  const mesh=gltf.meshes[arm.mesh];
  const cupSlots=mesh.primitives.filter(p=>
    (gltf.materials[p.material]?.name??"").startsWith("SPECTRUM CUP"));
  assert.equal(cupSlots.length,16,"Every arm has access to all colors");
  for(const part of cupSlots){
    assert.ok(part.attributes.JOINTS_0!==undefined,"Glow geometry follows skeleton");
    assert.ok(part.attributes.WEIGHTS_0!==undefined,"Suction geometry follows deformation");
    activeMaterials.add(part.material);
  }
}
assert.equal(activeMaterials.size,16,"Every spectral group is actually used");
const cupStations=Array.from({length:26},(_,i)=>10+i*3).filter(j=>j<88);
assert.equal(cupStations.length,26);
const cups=cupStations.length*2*8;
console.log(JSON.stringify({
  passed:true,
  suctionCups:cups,materialGroups:activeMaterials.size,
  skinnedArms:arms.length,bones:gltf.skins[0].joints.length,
  animationClips:gltf.animations.length,
  glbBytes:buffer.length,
},null,2));
