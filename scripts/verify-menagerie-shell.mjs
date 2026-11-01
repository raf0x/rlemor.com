import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const folder=mkdtempSync(join(tmpdir(),"menagerie-shell-"));
try {
  const content=readFileSync(resolve("components/menagerie/exhibits.ts"),"utf8");
  const transpiled=ts.transpileModule(content,{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
  }).outputText;
  const file=join(folder,"exhibits.cjs");
  writeFileSync(file,transpiled);
  const {EXHIBITS,getExhibit,nextExhibit}=createRequire(import.meta.url)(file);
  assert.equal(EXHIBITS.length,6);
  assert.equal(EXHIBITS[0].id,"octave-spectrum");
  assert.equal(EXHIBITS[1].id,"octave-chassis");
  assert.deepEqual(EXHIBITS.slice(2).map(x=>x.id),
    ["aether","medusa","atlas","frog"]);
  assert.equal(new Set(EXHIBITS.map(x=>x.id)).size,6);
  assert.equal(new Set(EXHIBITS.map(x=>x.number)).size,6);
  assert.equal(new Set(EXHIBITS.map(x=>x.x+","+x.z)).size,6);
  for(let i=0;i<6;i++){
    const e=EXHIBITS[i];
    assert.equal(getExhibit(i),e);
    assert.equal(e.number,String(i+1).padStart(2,"0"));
    assert.ok(e.x===-5.35||e.x===5.35);
    assert.equal(e.wing,e.x<0?"WEST WING":"EAST WING");
    assert.ok(Number.isFinite(e.z)&&Number.isFinite(e.scale));
    assert.ok(e.scale>.65&&e.scale<1.6);
    assert.ok(e.short.length>25);
  }
  assert.equal(getExhibit(-1),null);
  assert.equal(getExhibit(6),null);
  assert.equal(getExhibit(1.5),null);
  assert.equal(nextExhibit(null,1),0);
  assert.equal(nextExhibit(null,-1),5);
  assert.equal(nextExhibit(5,1),0);
  assert.equal(nextExhibit(0,-1),5);
  assert.equal(nextExhibit(2,1),3);
  assert.equal(nextExhibit(3,-1),2);
  const stage=readFileSync(resolve("components/menagerie/MuseumStage.ts"),"utf8");
  assert.ok(stage.includes('specimen-mount:'),"Future exhibit mounts are explicit");
  assert.ok(stage.includes("new THREE.WebGLRenderer"),"Real 3D gallery");
  assert.ok(stage.includes("intersectObjects(hitVolumes"),"3D pedestal picking");
  const route=readFileSync(resolve("app/lab/menagerie-preview-76cf184b/page.tsx"),"utf8");
  assert.ok(route.includes("index:false"));
  assert.ok(route.includes("follow:false"));
  const sitemap=readFileSync(resolve("app/sitemap.ts"),"utf8");
  assert.ok(!sitemap.includes("menagerie-preview"),"Unlisted route excluded");
  console.log(JSON.stringify({
    success:true,exhibits:EXHIBITS.length,uniquePlinths:true,
    navigationWrap:true,realTime3D:true,mountAnchors:true,
    unlisted:true,robotsNoindex:true,
  },null,2));
}finally{
  rmSync(folder,{recursive:true,force:true});
}

