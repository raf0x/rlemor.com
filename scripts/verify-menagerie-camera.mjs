import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {createRequire} from "node:module";
import ts from "typescript";

const dir=mkdtempSync(join(tmpdir(),"menagerie-camera-"));
try {
  for (const [source,out] of [
    ["components/menagerie/cameraConstraints.ts","camera.cjs"],
    ["components/menagerie/exhibits.ts","exhibits.cjs"],
  ]) {
    writeFileSync(join(dir,out),ts.transpileModule(
      readFileSync(resolve(source),"utf8"),{
        compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
      }
    ).outputText);
  }
  const require=createRequire(import.meta.url);
  const camera=require(join(dir,"camera.cjs"));
  const {EXHIBITS}=require(join(dir,"exhibits.cjs"));
  const p=(x,y,z)=>({x,y,z});
  const entrance={position:p(0,3.75,18),target:p(0,2.65,-4.1)};
  const mobileEntrance={position:p(0,3.4,17.2),target:p(0,2.65,-4.1)};
  const checks=[];
  const verify=(type,position,target,label)=>{
    const base=camera.azimuthFrom(position,target);
    const limits=camera.orbitLimits(type,base);
    assert.ok(limits.minAzimuthAngle<limits.maxAzimuthAngle);
    assert.ok(limits.minPolarAngle<limits.maxPolarAngle);
    assert.ok(limits.minDistance<limits.maxDistance);
    const angle=Math.atan2(position.x-target.x,position.z-target.z);
    assert.ok(angle>=limits.minAzimuthAngle-1e-5&&angle<=limits.maxAzimuthAngle+1e-5,label+" yaw");
    const r=Math.hypot(position.x-target.x,position.y-target.y,position.z-target.z);
    assert.ok(r<=limits.maxDistance+1e-5&&r>=limits.minDistance-1e-5,label+" radius");
    assert.ok(camera.insideMuseum(position),label+" default position");

    // Every corner of the permitted OrbitControls spherical volume must
    // remain inside the physical 3D museum. This catches ceiling, outside
    // wall and floor clipping before any browser or GPU work.
    for(const theta of [
      limits.minAzimuthAngle,(limits.minAzimuthAngle+limits.maxAzimuthAngle)/2,limits.maxAzimuthAngle
    ]){
      for(const phi of [limits.minPolarAngle,
        (limits.minPolarAngle+limits.maxPolarAngle)/2,
        limits.maxPolarAngle]){
        for(const distance of [limits.minDistance,
          (limits.minDistance+limits.maxDistance)/2,limits.maxDistance]){
          const point=p(
            target.x+distance*Math.sin(phi)*Math.sin(theta),
            target.y+distance*Math.cos(phi),
            target.z+distance*Math.sin(phi)*Math.cos(theta)
          );
          assert.ok(camera.insideMuseum(point),label+" orbit outside room "+JSON.stringify({theta,phi,distance,point}));
        }
      }
    }
    checks.push({label,base:base.toFixed(3),minDist:limits.minDistance,maxDist:limits.maxDistance});
  };
  verify("entrance",entrance.position,entrance.target,"entrance desktop");
  verify("entrance",mobileEntrance.position,mobileEntrance.target,"entrance mobile");
  for(const e of EXHIBITS)for(const mobile of [false,true]){
    const dir=e.x<0?-1:1;
    const pos=p(e.x*.46+(mobile?dir*.35:0),2.9,e.z+(mobile?6:5));
    const target=p(e.x,2,e.z-.28);
    verify("exhibit",pos,target,e.id+" "+(mobile?"mobile":"desktop"));
  }
  const bad=p(50,-30,-90);
  camera.clampIntoMuseum(bad);
  assert.ok(camera.insideMuseum(bad));
  assert.equal(bad.x,camera.INTERIOR_BOUNDS.maxX);
  assert.equal(bad.y,camera.INTERIOR_BOUNDS.minY);
  assert.equal(bad.z,camera.INTERIOR_BOUNDS.minZ);
  assert.equal(camera.azimuthFrom(p(0,2,10),p(0,2,0)),0);
  console.log(JSON.stringify({passed:true,profiles:checks.length,sampledPositions:checks.length*27,
    wallsProtected:true,ceilingProtected:true,floorProtected:true,checks},null,2));
}finally{
  rmSync(dir,{recursive:true,force:true});
}

