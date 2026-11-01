import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {createRequire} from "node:module";
import ts from "typescript";

const folder=mkdtempSync(join(tmpdir(),"menagerie-v4-"));
try{
  for(const [file,out] of [
    ["components/menagerie/exhibits.ts","exhibits.cjs"],
    ["components/menagerie/galleryRail.ts","galleryRail.cjs"],
  ]){
    const source=readFileSync(resolve(file),"utf8");
    writeFileSync(join(folder,out),ts.transpileModule(source,{
      compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
    }).outputText);
  }
  const localRequire=createRequire(import.meta.url);
  const {EXHIBITS,getExhibit,nextExhibit}=localRequire(join(folder,"exhibits.cjs"));
  const {createGalleryRail}=localRequire(join(folder,"galleryRail.cjs"));
  assert.equal(EXHIBITS.length,6);
  assert.deepEqual(EXHIBITS.map(e=>e.id),[
    "octave-spectrum","octave-chassis","aether","medusa","atlas","frog",
  ]);
  assert.deepEqual(EXHIBITS.map(e=>e.x),[-25,-15,-5,5,15,25]);
  assert.equal(new Set(EXHIBITS.map(e=>e.z)).size,1,"All exhibits share a Z plane");
  assert.ok(EXHIBITS.every(e=>e.z===0));
  assert.ok(EXHIBITS.every(e=>e.wing==="HORIZONTAL GALLERY"));
  assert.equal(new Set(EXHIBITS.map(e=>e.id)).size,6);
  assert.equal(nextExhibit(0,-1),0);
  assert.equal(nextExhibit(5,1),5);
  assert.equal(nextExhibit(2,1),3);
  assert.equal(getExhibit(-1),null);
  assert.equal(getExhibit(6),null);
  const xs=EXHIBITS.map(e=>e.x);
  const rail=createGalleryRail(xs);
  assert.deepEqual(rail.state(),{
    x:-25,targetX:-25,selectedIndex:0,moving:false,
  });
  rail.moveTo(5);
  assert.equal(rail.state().x,-25,"A selection starts from the current camera position");
  assert.equal(rail.state().targetX,25);
  let last=-25;
  for(let i=0;i<250;i++){
    const x=rail.update(.016);
    assert.ok(x>=last-.0001,"Glide must be monotonic");
    assert.ok(x>=-25&&x<=25,"Never leave the visible wall");
    last=x;
  }
  assert.equal(rail.state().x,25);
  rail.moveTo(0);
  rail.update(.11);
  const halfway=rail.state().x;
  rail.moveTo(3);
  assert.equal(rail.state().x,halfway,"A new selection must never teleport");
  assert.equal(rail.state().targetX,5);
  for(let i=0;i<250;i++)rail.update(.016);
  assert.equal(rail.state().x,5);
  assert.equal(rail.state().selectedIndex,3);
  rail.panBy(1_000);
  assert.equal(rail.state().x,25,"Clamps excessive touch drag");
  assert.equal(rail.atEdge(1),true);
  rail.panBy(-1_000);
  assert.equal(rail.state().x,-25);
  assert.equal(rail.atEdge(-1),true);
  rail.panBy(6.0);
  assert.equal(rail.settle(),1,"Swipe crosses half-way to the next station");
  for(let i=0;i<180;i++)rail.update(.016);
  assert.equal(rail.state().x,-15);
  rail.panBy(Number.NaN);
  assert.equal(rail.state().x,-15,"Invalid input does not corrupt the camera");
  rail.moveTo(5,true);
  assert.equal(rail.state().x,25);
  assert.equal(rail.state().moving,false);
  assert.throws(()=>createGalleryRail([0,0,1]));
  assert.throws(()=>createGalleryRail([]));
  const stage=readFileSync("components/menagerie/MuseumStage.ts","utf8");
  assert.ok(stage.includes('specimen-mount:'),"All six mount origins retained");
  assert.ok(stage.includes("createGalleryRail"));
  assert.ok(stage.includes("new THREE.WebGLRenderer"));
  assert.ok(!stage.includes("new OrbitControls"),"No free camera orbit");
  assert.ok(stage.includes("Exactly ONE continuous back wall"));
  assert.ok(readFileSync("components/menagerie/MenagerieShell.tsx","utf8").includes("onMove"),"Horizontal touch handler retained");
  const route=readFileSync("app/lab/menagerie-preview-76cf184b/page.tsx","utf8");
  assert.ok(route.includes("index:false")&&route.includes("follow:false"));
  const sitemap=readFileSync("app/sitemap.ts","utf8");
  assert.ok(!sitemap.includes("menagerie-preview"));
  console.log(JSON.stringify({passed:true,exhibits:EXHIBITS.length,
    oneRow:true,verticalDrift:false,cameraRail:true,extremeDragClamped:true,
    smoothTravel:true,rapidRetarget:true,sharedSpecimenMounts:true,
    unlisted:true},null,2));
}finally{
  rmSync(folder,{recursive:true,force:true});
}

