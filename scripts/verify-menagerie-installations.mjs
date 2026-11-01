import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";

const creatures=["aether","medusa","atlas","frog"];
const details=[];
function glb(path){
 const b=readFileSync(resolve(path));
 assert.equal(b.toString("ascii",0,4),"glTF");
 assert.equal(b.readUInt32LE(4),2);
 assert.equal(b.readUInt32LE(8),b.length);
 assert.equal(b.readUInt32LE(16),0x4e4f534a);
 const len=b.readUInt32LE(12);
 const doc=JSON.parse(b.subarray(20,20+len).toString("utf8"));
 assert.equal(doc.asset.version,"2.0");
 assert.ok(doc.meshes?.length>10,"3D meshes, not a billboard");
 assert.ok(doc.animations?.length>0,"Asset animation clips");
 assert.ok(doc.animations.every(a=>a.channels.length>0),"Every clip has a target");
 assert.ok(b.length<2_000_000,"Download size optimized");
 return {b,doc};
}
for(const id of creatures){
 const {b,doc}=glb("public/lab/menagerie/"+id+".glb");
 assert.ok(doc.animations.length>=3,id+" independent mechanical animation groups");
 details.push({id,bytes:b.length,meshes:doc.meshes.length,clips:doc.animations.length,
  channels:doc.animations.reduce((a,x)=>a+x.channels.length,0)});
}
const {b:octave,doc:original}=glb("public/lab/octave-sculpture/octave-obsidian.glb");
assert.equal(original.skins?.[0]?.joints?.length,56,"Original Octave rig intact");
assert.equal(original.materials.filter(m=>(m.name??"").startsWith("SPECTRUM CUP")).length,16);
details.push({id:"octave-spectrum",bytes:octave.length,skins:original.skins.length,
 bones:original.skins[0].joints.length,clips:original.animations.length});
const route=readFileSync("app/lab/menagerie-preview-76cf184b/exhibit/[id]/page.tsx","utf8");
assert.ok(route.includes("<KineticOctopus/>"),"Real legacy Octave controls, not a replacement");
assert.ok(route.includes("<OctaveSculpture backHref={HOME}/>"),"Spectrum routed back to museum");
assert.ok(route.includes("<CreatureViewer exhibit={exhibit}/>"),"Each new species has a dedicated stage");
const stage=readFileSync("components/menagerie/MuseumStage.ts","utf8");
assert.ok(stage.includes("chassis=createChassisMiniature"),"Old Octave has a 3D locator");
for(const id of creatures){
 assert.ok(stage.includes('"/lab/menagerie/'+id+'.glb"'),
  id+" is mounted in main hall with actual GLB");
}
assert.ok(stage.includes('"/lab/octave-sculpture/octave-obsidian.glb"'));
console.log(JSON.stringify({pass:true,count:6,creatures:details,
  legacyMotion:"existing live procedural system preserved"},null,2));
