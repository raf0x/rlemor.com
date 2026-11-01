"use client";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  ARM_COUNT, LINKS_PER_ARM, PANEL_COUNT, TAU,
  type CameraPreset, type MachineFrame, type Vec3,
} from "./kinematics";

type Picked = {
  kind: "arm" | "panel" | "eye";
  index: number;
  point: THREE.Vector3;
  label: string;
};
export interface Stage {
  render: (frame: MachineFrame, time: number, autoCamera: boolean, selected: Picked | null) => void;
  resize: (width: number, height: number) => void;
  pick: (x: number, y: number, isTouch: boolean) => Picked | null;
  getDragDelta: (start: Picked, startX: number, startY: number, x: number, y: number) => Vec3;
  setCamera: (preset: CameraPreset) => void;
  getYaw: () => number;
  rendererName: string;
  dispose: () => void;
  controls: OrbitControls;
}

function mesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
) {
  const result = new THREE.Mesh(geometry, material);
  result.position.set(...position);
  parent.add(result);
  return result;
}

export function createOctaveStage(canvas: HTMLCanvasElement): Stage {
  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true, powerPreference: "high-performance",
  });
  const gl = renderer.getContext();
  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  const rendererName = String(debug
    ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
    : gl.getParameter(gl.RENDERER));
  const software = /swiftshader|llvmpipe|software/i.test(rendererName);
  const mobile = window.matchMedia("(max-width: 720px)").matches;

  renderer.setPixelRatio(software ? .82 : Math.min(window.devicePixelRatio || 1, mobile ? 1.2 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.17;
  renderer.setClearColor(0x0e1724, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(41, 1, .1, 85);
  const baseDistance = mobile ? 15.8 : 13.9;
  camera.position.set(1.4, 1.12, baseDistance);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = .08;
  controls.enablePan = false;
  controls.rotateSpeed = .56;
  controls.minDistance = 7.1;
  controls.maxDistance = 21;
  controls.minPolarAngle = .23;
  controls.maxPolarAngle = Math.PI - .23;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xbfdafc, 0x162031, 2.55));
  const key = new THREE.DirectionalLight(0xe5f2ff, 3.4);
  key.position.set(-4, 6, 8); scene.add(key);
  const magenta = new THREE.DirectionalLight(0xd4a3ff, 2.5);
  magenta.position.set(5, -1.5, 2.5); scene.add(magenta);
  const cyan = new THREE.DirectionalLight(0x52e2ef, 1.55);
  cyan.position.set(0, 2, -6); scene.add(cyan);

  const root = new THREE.Group();
  scene.add(root);

  const pearl = new THREE.MeshStandardMaterial({
    color:0xdce8f5, metalness:.44, roughness:.31,
    transparent:true, opacity:1, depthWrite:false, side:THREE.DoubleSide,
  });
  const pearlVariant = pearl.clone(); pearlVariant.color.setHex(0xb9d0e8);
  const graphite = new THREE.MeshStandardMaterial({
    color:0x192e41, metalness:.67, roughness:.32,
  });
  const metal = new THREE.MeshStandardMaterial({
    color:0x8eafc4, metalness:.76, roughness:.26,
  });
  const dark = new THREE.MeshStandardMaterial({
    color:0x070e1e, metalness:.48, roughness:.21,
  });
  const dimIris = new THREE.MeshBasicMaterial({color:0x40536c,toneMapped:false});
  const irisRing = new THREE.MeshBasicMaterial({color:0x7c68ff,toneMapped:false});
  const energyCore = new THREE.MeshBasicMaterial({color:0x4adcf4,toneMapped:false});
  const glowLilac = new THREE.MeshBasicMaterial({color:0xc9a2ff,toneMapped:false});

  // Real cutaway interior, not a 2D x-ray illustration.
  const inner = new THREE.Group();root.add(inner);
  const nucleus = mesh(inner,new THREE.IcosahedronGeometry(.77,1),graphite);
  nucleus.rotation.z=.18;
  const cageMat = new THREE.MeshStandardMaterial({
    color:0x73aeca,metalness:.74,roughness:.35,wireframe:true,
  });
  mesh(inner,new THREE.IcosahedronGeometry(.80,1),cageMat);
  for(let axis=0;axis<3;axis++){
    const torus=mesh(inner,new THREE.TorusGeometry(.69+axis*.045,.026,8,48),axis===1?energyCore:metal);
    torus.rotation.set(axis*.82,axis*.61+.34,axis*.17);
  }
  for(let i=0;i<ARM_COUNT;i++){
    const a=(i/ARM_COUNT)*TAU+Math.PI/8;
    const rod=mesh(inner,new THREE.CylinderGeometry(.04,.04,1.55,9),i%2?metal:graphite);
    rod.rotation.z=a-Math.PI/2;
  }

  const panels:THREE.Mesh[]=[];
  const panelNormals:THREE.Vector3[]=[];
  for(let i=0;i<PANEL_COUNT;i++){
    const phi=(i/PANEL_COUNT)*TAU+.035,span=TAU/PANEL_COUNT-.07;
    const geom=new THREE.SphereGeometry(.995,14,21,phi,span,.24,Math.PI-.48);
    const part=mesh(root,geom,i%3===1?pearlVariant:pearl);
    panels.push(part);
    panelNormals.push(new THREE.Vector3(-Math.cos(phi+span/2),0,Math.sin(phi+span/2)));
    const seams=new THREE.LineSegments(new THREE.EdgesGeometry(geom,30),new THREE.LineBasicMaterial({
      color:0x7795b0,transparent:true,opacity:.28,
    }));
    part.add(seams);
  }

  const equator=mesh(root,new THREE.TorusGeometry(.94,.038,8,72),graphite);
  equator.rotation.x=Math.PI/2;
  const crown = new THREE.Group();root.add(crown);
  mesh(crown,new THREE.CylinderGeometry(.3,.38,.17,32),graphite);
  mesh(crown,new THREE.CylinderGeometry(.22,.22,.18,32),metal,[0,.16,0]);
  mesh(crown,new THREE.CylinderGeometry(.15,.15,.025,32),energyCore,[0,.28,0]);

  const eye = new THREE.Group();root.add(eye);
  const eyeMeshes:THREE.Mesh[]=[];
  const eyeMesh=(geometry:THREE.BufferGeometry,material:THREE.Material,pos:[number,number,number])=>{
    const m=mesh(eye,geometry,material,pos);
    eyeMeshes.push(m);return m;
  };
  eyeMesh(new THREE.CylinderGeometry(.43,.46,.22,40),graphite,[0,0,.04]).rotation.x=Math.PI/2;
  eyeMesh(new THREE.SphereGeometry(.335,32,22),dark,[0,0,.20]);
  eyeMesh(new THREE.TorusGeometry(.36,.054,10,46),metal,[0,0,.22]);
  eyeMesh(new THREE.TorusGeometry(.29,.025,8,46),irisRing,[0,0,.33]);
  eyeMesh(new THREE.TorusGeometry(.196,.013,8,36),energyCore,[0,0,.42]);
  eyeMesh(new THREE.SphereGeometry(.142,24,18),irisRing,[0,0,.445]);
  eyeMesh(new THREE.SphereGeometry(.075,18,12),energyCore,[0,0,.541]);
  eyeMesh(new THREE.SphereGeometry(.033,14,10),dark,[0,0,.60]);
  for(let a=0;a<6;a++){
    const phi=a*TAU/6;
    eyeMesh(new THREE.SphereGeometry(.035,10,9),metal,[Math.cos(phi)*.39,Math.sin(phi)*.39,.252]);
  }
  for(const side of [-1,1]){
    const pod=new THREE.Group();pod.position.set(side*.57,-.19,.70);pod.rotation.y=side*.56;
    root.add(pod);
    mesh(pod,new THREE.CylinderGeometry(.18,.21,.12,20),graphite).rotation.x=Math.PI/2;
    mesh(pod,new THREE.SphereGeometry(.14,20,14),dark,[0,0,.12]);
    mesh(pod,new THREE.TorusGeometry(.145,.016,7,24),glowLilac,[0,0,.18]);
  }

  // The entire arm is always posed by one joint chain. Instancing keeps the
  // draw-call count low, even though every subassembly is individually shaped.
  const count=ARM_COUNT*LINKS_PER_ARM;
  const cylinder=new THREE.CylinderGeometry(.5,.5,1,12);
  const jointSphere=new THREE.SphereGeometry(.5,12,9);
  const torusGeom=new THREE.TorusGeometry(.5,.082,7,16);
  const stripGeom=new THREE.BoxGeometry(1,1,1);
  const shellMaterial=new THREE.MeshStandardMaterial({color:0xe6effa,metalness:.37,roughness:.33});
  const spectralMat=new THREE.MeshBasicMaterial({
    color:0xffffff,transparent:true,opacity:.86,depthWrite:false,toneMapped:false,
  });
  const brightMat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const housing=new THREE.InstancedMesh(cylinder,shellMaterial,count);
  const sleeve=new THREE.InstancedMesh(cylinder,spectralMat,count);
  const spine=new THREE.InstancedMesh(cylinder,graphite,count);
  const joint=new THREE.InstancedMesh(jointSphere,metal,count);
  const collar=new THREE.InstancedMesh(torusGeom,graphite,count);
  const led=new THREE.InstancedMesh(stripGeom,brightMat,count);
  const hubs:THREE.Group[]=[];
  for(let arm=0;arm<ARM_COUNT;arm++){
    const pivot=new THREE.Group();root.add(pivot);hubs.push(pivot);
    mesh(pivot,new THREE.CylinderGeometry(.225,.26,.3,18),graphite);
    mesh(pivot,new THREE.CylinderGeometry(.188,.188,.14,18),metal,[0,.19,0]);
    const rim=mesh(pivot,new THREE.TorusGeometry(.197,.029,8,22),glowLilac,[0,.30,0]);
    rim.rotation.x=Math.PI/2;
  }
  for(const inst of [housing,sleeve,spine,joint,collar,led]){
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    inst.frustumCulled=false;root.add(inst);
  }
  const tempQ = new THREE.Quaternion();
  const tempQ2 = new THREE.Quaternion();
  const axisY=new THREE.Vector3(0,1,0);
  const axisZ=new THREE.Vector3(0,0,1);
  const start=new THREE.Vector3(),end=new THREE.Vector3(),mid=new THREE.Vector3(),dir=new THREE.Vector3();
  const matrix=new THREE.Matrix4(),size=new THREE.Vector3(),v=new THREE.Vector3(),color=new THREE.Color(),tint=new THREE.Color();
  const pickPositions = Array.from({length:count},()=>new THREE.Vector3());
  const put=(inst:THREE.InstancedMesh,i:number,pos:THREE.Vector3,q:THREE.Quaternion,scale:THREE.Vector3)=>{
    matrix.compose(pos,q,scale);
    inst.setMatrixAt(i,matrix);
  };
  for(let arm=0;arm<ARM_COUNT;arm++){
    for(let j=0;j<LINKS_PER_ARM;j++){
      const idx=arm*LINKS_PER_ARM+j;
      housing.setColorAt(idx,new THREE.Color(0xffffff));
      sleeve.setColorAt(idx,new THREE.Color(0xffffff));
      led.setColorAt(idx,new THREE.Color(0xffffff));
    }
  }
  const rings:THREE.LineLoop[]=[];
  for(const radius of [2.35,3.55,4.72]){
    const points=[] as THREE.Vector3[];
    for(let j=0;j<160;j++){
      const a=TAU*j/160;
      points.push(new THREE.Vector3(Math.cos(a)*radius,Math.sin(a)*radius,-1.75));
    }
    const ring=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({color:0x3e6480,transparent:true,opacity:.31}));
    scene.add(ring);rings.push(ring);
  }

  const raycaster=new THREE.Raycaster(),ndc=new THREE.Vector2(),tempProject=new THREE.Vector3();
  const dragRay=new THREE.Raycaster(),plane=new THREE.Plane(),intersection=new THREE.Vector3();
  const selectedColor=new THREE.Color(0x99f4ff);
  let lastSnapshotKey="";
  let lastColorTick=-1;
  function applyFrame(frame:MachineFrame,time:number,autoCamera:boolean,selected:Picked|null){
    // Geometry is derived solely from frame. Every panel and arm has a
    // connected parent and a well-defined docking point.
    root.rotation.y = Math.sin(frame.time*.11)*.11;
    root.rotation.z = Math.sin(frame.time*.22)*.028;
    eye.position.set(...frame.opticalPosition);
    crown.position.y=frame.crownHeight;
    pearl.opacity=1-frame.cutaway*.79;
    pearlVariant.opacity=pearl.opacity;
    nucleus.visible=frame.cutaway>.04||frame.teardown>.15;
    for(let i=0;i<PANEL_COUNT;i++)panels[i].position.set(...frame.panels[i].offset);
    spectralMat.opacity=.82*frame.energy+.12;
    irisRing.color.setHSL(((time*.105)+.75)%1,.90,.62);
    energyCore.color.setHSL(((time*.105)+.52)%1,.95,.62);
    const poseKey=[
      frame.time.toFixed(3),frame.teardown.toFixed(3),
      frame.extension.toFixed(3),frame.cutaway.toFixed(3),frame.isolateArm,
    ].join("|");
    if(poseKey!==lastSnapshotKey){
      lastSnapshotKey=poseKey;
      for(let arm=0;arm<ARM_COUNT;arm++){
        const spec=frame.arms[arm];
        const socket=spec.socket;
        hubs[arm].position.set(...socket);
        hubs[arm].rotation.z=spec.angle-Math.PI/2;
        for(let j=0;j<LINKS_PER_ARM;j++){
          const idx=arm*LINKS_PER_ARM+j;
          start.set(...spec.joints[j]);end.set(...spec.joints[j+1]);
          mid.copy(start).add(end).multiplyScalar(.5);
          dir.copy(end).sub(start);
          const span=dir.length();
          dir.normalize();tempQ.setFromUnitVectors(axisY,dir);
          tempQ2.setFromUnitVectors(axisZ,dir);
          const t=j/LINKS_PER_ARM;
          const thick=Math.max(.066,.214-t*.132);
          size.set(thick*1.94,span*.76,thick*1.94);
          put(housing,idx,mid,tempQ,size);
          size.set(thick*2.04,span*.64,thick*2.04);
          put(sleeve,idx,mid,tempQ,size);
          size.set(thick*.91,span*1.08,thick*.91);
          put(spine,idx,mid,tempQ,size);
          size.setScalar(thick*1.74);
          put(joint,idx,end,tempQ,size);
          size.set(thick*2.05,thick*2.05,thick*2.05);
          put(collar,idx,start,tempQ2,size);
          v.copy(mid).addScaledVector(axisZ,thick*.84);
          size.set(thick*.80,span*.22,thick*.24);
          put(led,idx,v,tempQ,size);
          pickPositions[idx].copy(mid);
        }
      }
      for(const inst of [housing,sleeve,spine,joint,collar,led])inst.instanceMatrix.needsUpdate=true;
    }
    const colorTick=Math.floor(time*19);
    if(colorTick!==lastColorTick||frame.isolateArm!==null||!!selected){
      lastColorTick=colorTick;
      for(let arm=0;arm<ARM_COUNT;arm++){
        for(let j=0;j<LINKS_PER_ARM;j++){
          const idx=arm*LINKS_PER_ARM+j;
          const hue=((time*.22+arm/ARM_COUNT+(j/LINKS_PER_ARM)*.16)%1+1)%1;
          color.setHSL(hue,.99,.62);
          const faded=frame.isolateArm!==null&&frame.isolateArm!==arm;
          const highlight=selected?.kind==="arm"&&selected.index===arm;
          tint.copy(color);
          if(faded)tint.lerp(new THREE.Color(0x52667b),.78);
          if(highlight)tint.lerp(selectedColor,.38);
          sleeve.setColorAt(idx,tint);
          led.setColorAt(idx,highlight?selectedColor:tint);
          housing.setColorAt(idx,new THREE.Color(0xffffff).lerp(tint,highlight?.74:.50));
        }
      }
      for(const inst of [housing,sleeve,led])
        if(inst.instanceColor)inst.instanceColor.needsUpdate=true;
    }
    if(autoCamera){
      // Deterministic director view, derived from the same time as the rig.
      const yaw=.11+Math.sin(time*.17)*.31;
      const elev=.65+Math.sin(time*.13)*.65;
      camera.position.set(Math.sin(yaw)*baseDistance,elev,Math.cos(yaw)*baseDistance);
      controls.target.set(0,0,0);
    }
    controls.update();
    renderer.render(scene,camera);
  }

  function pick(clientX:number,clientY:number,touch:boolean):Picked|null {
    const rect=canvas.getBoundingClientRect();
    ndc.set((clientX-rect.left)/rect.width*2-1,-((clientY-rect.top)/rect.height*2-1));
    camera.updateMatrixWorld();root.updateWorldMatrix(true,true);
    raycaster.setFromCamera(ndc,camera);
    const solid=raycaster.intersectObjects([...eyeMeshes,...panels],false)[0];
    let closest={idx:-1,distance:Infinity};
    const reach=touch?30:19;
    for(let i=2;i<pickPositions.length;i++){
      if(i%LINKS_PER_ARM<2)continue;
      tempProject.copy(pickPositions[i]).applyMatrix4(root.matrixWorld).project(camera);
      if(tempProject.z < -1 || tempProject.z > 1)continue;
      const px=rect.left+(tempProject.x+1)*rect.width*.5;
      const py=rect.top+(1-tempProject.y)*rect.height*.5;
      const d=Math.hypot(px-clientX,py-clientY);
      if(d<closest.distance)closest={idx:i,distance:d};
    }
    if(closest.idx>=0&&(closest.distance<reach*.65||(!solid&&closest.distance<reach))){
      const arm=Math.floor(closest.idx/LINKS_PER_ARM);
      return{kind:"arm",index:arm,
        point:pickPositions[closest.idx].clone().applyMatrix4(root.matrixWorld),
        label:"ARM "+String(arm+1).padStart(2,"0")};
    }
    if(!solid)return null;
    const eyeIndex=eyeMeshes.indexOf(solid.object as THREE.Mesh);
    if(eyeIndex>=0)return{kind:"eye",index:0,point:solid.point.clone(),label:"OPTICAL CORE"};
    const panelIndex=panels.indexOf(solid.object as THREE.Mesh);
    if(panelIndex>=0)return{kind:"panel",index:panelIndex,
      point:solid.point.clone(),label:"SHELL "+String(panelIndex+1).padStart(2,"0")};
    return null;
  }

  function getDragDelta(grab:Picked,x0:number,y0:number,x:number,y:number):Vec3 {
    const rect=canvas.getBoundingClientRect();
    camera.getWorldDirection(v);
    plane.setFromNormalAndCoplanarPoint(v,grab.point);
    const rayAt=(px:number,py:number):THREE.Vector3|null=>{
      ndc.set((px-rect.left)/rect.width*2-1,-((py-rect.top)/rect.height*2-1));
      dragRay.setFromCamera(ndc,camera);
      return dragRay.ray.intersectPlane(plane,intersection);
    };
    const from=rayAt(x0,y0)?.clone();
    const to=rayAt(x,y)?.clone();
    if(!from||!to)return [0,0,0];
    root.updateWorldMatrix(true,true);
    const pointA=root.worldToLocal(from);
    const pointB=root.worldToLocal(to);
    return [pointB.x-pointA.x,pointB.y-pointA.y,pointB.z-pointA.z];
  }

  function resize(width:number,height:number) {
    const w=Math.max(1,Math.round(width)),h=Math.max(1,Math.round(height));
    camera.aspect=w/h;camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
  }
  function setCamera(preset:CameraPreset){
    const positions:Record<CameraPreset,[number,number,number]>={
      "hero":[1.4,1.12,baseDistance],
      "three-quarter":[baseDistance*.45,2.9,baseDistance*.86],
      "profile":[baseDistance*.83,1.65,baseDistance*.56],
    };
    camera.position.set(...positions[preset]);
    controls.target.set(0,0,0);controls.update();
  }
  function dispose(){
    controls.dispose();
    const geometries=new Set<THREE.BufferGeometry>();
    const materials=new Set<THREE.Material>();
    scene.traverse(o=>{
      if(o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.Points){
        geometries.add(o.geometry);
        for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);
      }
    });
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  }
  return {
    render:applyFrame,resize,pick,getDragDelta,setCamera,controls,rendererName,dispose,
    getYaw:()=>Math.atan2(camera.position.x,camera.position.z)*180/Math.PI,
  };
}
