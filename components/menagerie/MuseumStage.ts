"use client";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { createChassisMiniature } from "./chassisMiniature";
import { EXHIBITS, type Exhibit } from "./exhibits";
import { azimuthFrom, clampIntoMuseum, orbitLimits } from "./cameraConstraints";

export type LightMode = "cinematic" | "study";
export type MuseumStage = {
  focus: (index: number | null, immediate?: boolean) => void;
  lighting: (mode: LightMode) => void;
  pick: (clientX: number, clientY: number) => number | null;
  resize: (w: number, h: number) => void;
  dispose: () => void;
};
type Callbacks = { onReady: () => void; onFailure: (message: string) => void };

const vec = (x: number, y: number, z: number) => new THREE.Vector3(x,y,z);
const colors = {
  gold: 0xc39564,
  blue: 0x6cd5ee,
  pale: 0xdfebee,
};
function add(
  parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material,
  pos:[number,number,number] = [0,0,0],
):THREE.Mesh {
  const m=new THREE.Mesh(geometry,material);
  m.position.set(...pos); parent.add(m); return m;
}
function strip(
  parent:THREE.Object3D, a:THREE.Vector3,b:THREE.Vector3,
  material:THREE.Material,thickness:number,
):THREE.Mesh {
  const distance=a.distanceTo(b);
  const obj=add(parent,new THREE.BoxGeometry(thickness,thickness,distance),material);
  obj.position.copy(a).add(b).multiplyScalar(.5);
  obj.quaternion.setFromUnitVectors(vec(0,0,1),b.clone().sub(a).normalize());
  return obj;
}
function torus(
  parent:THREE.Object3D, radius:number, tube:number,
  material:THREE.Material,x:number,y:number,z:number,rotationX=Math.PI/2,
){
  const t=add(parent,new THREE.TorusGeometry(radius,tube,7,100),material,[x,y,z]);
  t.rotation.x=rotationX;
  return t;
}
function labelTexture(exhibit: Exhibit) {
  const c=document.createElement("canvas");
  c.width=896;c.height=300;
  const cx=c.getContext("2d");
  if(!cx)throw new Error("Canvas labels unavailable");
  cx.clearRect(0,0,c.width,c.height);
  cx.fillStyle="#0a151f";
  cx.fillRect(0,0,c.width,c.height);
  cx.strokeStyle="#668595";cx.lineWidth=2;
  cx.strokeRect(4,4,888,292);
  cx.fillStyle="#9ed2de";cx.font="500 43px sans-serif";
  cx.fillText(exhibit.number,40,88);
  cx.strokeStyle="#8db3bc";cx.lineWidth=2;
  cx.beginPath();cx.moveTo(138,53);cx.lineTo(138,240);cx.stroke();
  cx.fillStyle="#e6eff1";cx.font="600 72px Georgia, serif";
  cx.fillText(exhibit.name,166,146);
  cx.fillStyle="#9bb2c0";cx.font="600 28px sans-serif";
  cx.fillText(exhibit.subtitle.toUpperCase(),169,203);
  cx.fillStyle="#70949e";cx.font="500 21px sans-serif";
  cx.fillText("LIVING SPECIMEN",170,250);
  const map=new THREE.CanvasTexture(c);
  map.colorSpace=THREE.SRGBColorSpace;
  map.anisotropy=4;map.needsUpdate=true;
  return map;
}

function makeStation(
  scene:THREE.Scene,exhibit:Exhibit,index:number,
  shared:{
    dark:THREE.MeshStandardMaterial;metal:THREE.MeshStandardMaterial;
    bronze:THREE.MeshStandardMaterial;glass:THREE.MeshPhysicalMaterial;
    cyan:THREE.MeshBasicMaterial;amber:THREE.MeshBasicMaterial;
    darkUnlit:THREE.MeshBasicMaterial;
  },
  hitVolumes:THREE.Mesh[],
  ringMaterials:THREE.MeshBasicMaterial[],
  signageTextures:THREE.Texture[],
) {
  const {x,z,scale}=exhibit;
  const base=new THREE.Group();
  base.position.set(x,0,z);
  scene.add(base);

  // Low, broad gallery plinth, deliberately empty for the sculpture installation.
  const pedestal=add(base,new THREE.CylinderGeometry(2.1,2.18,.44,74),
     shared.dark,[0,.29,0]);
  pedestal.receiveShadow=true;
  add(base,new THREE.CylinderGeometry(2.04,2.06,.07,74),
     shared.metal,[0,.545,0]);
  add(base,new THREE.CylinderGeometry(1.92,1.94,.035,74),
     shared.dark,[0,.592,0]);
  const crown=shared.cyan.clone();
  ringMaterials.push(crown);
  torus(base,2.025,.026,crown,0,.579,0);
  torus(base,1.72,.01,shared.bronze,0,.623,0);
  torus(base,2.15,.019,shared.bronze,0,.32,0);

  // Dedicated local mounting origin for a future 3D specimen. This shell
  // deliberately leaves it empty; later exhibits can attach a GLB or custom
  // interactive scene here without relocating or rebuilding the architecture.
  const specimenMount=new THREE.Group();
  specimenMount.name="specimen-mount:"+exhibit.id;
  specimenMount.position.set(0,.63,0);
  specimenMount.userData.exhibitId=exhibit.id;
  base.add(specimenMount);

  // Vertical manufactured arch. This is architecture, NOT a fake animal.
  const frameHeight=4.0*scale;
  const columnX=1.34*scale;
  for(const side of [-1,1]){
    add(base,new THREE.BoxGeometry(.094,frameHeight,.10),shared.bronze,
       [side*columnX,.65+frameHeight/2,-.27]);
    add(base,new THREE.BoxGeometry(.036,frameHeight*.82,.045),shared.cyan,
       [side*columnX*.985,.69+frameHeight*.5,-.205]);
    add(base,new THREE.BoxGeometry(.32,.11,.30),shared.metal,
       [side*columnX,.73,-.27]);
  }
  // Soft Gothic-inspired arch, rendered with two arc tube meshes.
  const arcPoints:THREE.Vector3[]=[];
  const arcR=columnX;
  for(let i=0;i<=30;i++){
    const a=Math.PI-i*Math.PI/30;
    arcPoints.push(vec(Math.cos(a)*arcR,
      .65+frameHeight+Math.sin(a)*.72*scale,-.27));
  }
  const curve=new THREE.CatmullRomCurve3(arcPoints);
  add(base,new THREE.TubeGeometry(curve,50,.047,6,false),shared.bronze);
  const innerPoints=arcPoints.map(p=>vec(p.x*.976,p.y-.11,p.z+.02));
  add(base,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(innerPoints),50,.016,5,false),shared.cyan);

  // Sparse hovering orientation markers, not invented placeholder animals.
  torus(base,.38,.010,shared.cyan,0,2.25*scale,0,0);
  torus(base,.12,.011,shared.amber,0,2.25*scale,0,0);
  strip(base,vec(-.68,2.25*scale,0),vec(-.43,2.25*scale,0),shared.cyan,.018);
  strip(base,vec(.43,2.25*scale,0),vec(.68,2.25*scale,0),shared.cyan,.018);
  strip(base,vec(0,2.25*scale-.65,0),vec(0,2.25*scale-.43,0),shared.cyan,.018);
  strip(base,vec(0,2.25*scale+.43,0),vec(0,2.25*scale+.65,0),shared.cyan,.018);

  // The sign is true geometry in the room. It will later sit beside an animal.
  const map=labelTexture(exhibit);signageTextures.push(map);
  const sign=add(base,new THREE.PlaneGeometry(2.42,.80),
    new THREE.MeshBasicMaterial({map,transparent:true,side:THREE.DoubleSide}),
    [0,.89,2.16]);
  sign.rotation.x=-.10;
  add(base,new THREE.BoxGeometry(2.46,.035,.08),shared.metal,[0,.46,2.13]);

  // A hidden but raycastable 3D exhibit volume enables direct selection
  // through a click or tap on any pedestal, arch, or reserved display area.
  const hit=add(scene,new THREE.CylinderGeometry(1.85,1.85,3.9,18),
    new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,
      depthWrite:false,colorWrite:false}),
    [x,2.0,z]);
  hit.userData.exhibitIndex=index;
  hitVolumes.push(hit);

  // Architectural lighting belongs to the station, without a full
  // particle field or expensive continuous shadow maps.
  const warm=new THREE.SpotLight(
    index%2===0?0xffbd85:0x92ddff,64,16,.72,.72,1.5,
  );
  warm.position.set(x*.91,7.0,z+.35);
  warm.target.position.set(x,1.1,z);
  scene.add(warm,warm.target);
}

function createHall(
  scene:THREE.Scene, hitVolumes:THREE.Mesh[],
  ringMaterials:THREE.MeshBasicMaterial[],signageTextures:THREE.Texture[],
){
  const root=new THREE.Group();scene.add(root);
  const dark=new THREE.MeshStandardMaterial({
    color:0x111a23,metalness:.56,roughness:.38,envMapIntensity:.46,
  });
  const darker=new THREE.MeshStandardMaterial({
    color:0x08131c,metalness:.30,roughness:.59,
  });
  const metal=new THREE.MeshStandardMaterial({
    color:0x334653,metalness:.83,roughness:.26,envMapIntensity:.75,
  });
  const bronze=new THREE.MeshStandardMaterial({
    color:0x795538,metalness:.83,roughness:.27,envMapIntensity:.95,
  });
  const glass=new THREE.MeshPhysicalMaterial({
    color:0x182c38,metalness:.36,roughness:.12,
    transparent:true,opacity:.32,depthWrite:false,side:THREE.DoubleSide,
    clearcoat:.8,clearcoatRoughness:.1,
  });
  const cyan=new THREE.MeshBasicMaterial({color:colors.blue,toneMapped:false});
  const amber=new THREE.MeshBasicMaterial({color:colors.gold,toneMapped:false});
  const dim=new THREE.MeshBasicMaterial({color:0x253746});
  const floor=new THREE.MeshStandardMaterial({
    color:0x0b1219,metalness:.50,roughness:.31,envMapIntensity:.37,
  });

  // One continuous gallery floor with visible broad architectural seams.
  const floorObject=add(root,new THREE.BoxGeometry(23,.36,40),floor,[0,-.26,-3.65]);
  floorObject.receiveShadow=true;
  add(root,new THREE.BoxGeometry(22.8,.28,39.7),darker,[0,8.78,-3.65]);
  add(root,new THREE.BoxGeometry(22.2,8.9,.20),darker,[0,4.3,-19.3]);
  for(const x of [-10.85,10.85]){
    add(root,new THREE.BoxGeometry(.42,8.4,39.4),darker,[x,4.26,-3.65]);
  }

  // Broad side gallery bays and warm vertical fins produce genuine depth.
  for(const side of [-1,1]){
    const wallX=side*10.35;
    for(const [index,z] of [10.5,2.35,-5.75,-13.85,-18.2].entries()){
      add(root,new THREE.BoxGeometry(.72,9.0,.50),metal,[wallX,4.43,z]);
      add(root,new THREE.BoxGeometry(.047,7.7,.22),bronze,
        [wallX-side*.40,4.27,z+.18]);
      if(index<4){
        const center=z-3.9;
        add(root,new THREE.BoxGeometry(.075,5.9,7.2),glass,
          [wallX-side*.22,4.05,center]);
        add(root,new THREE.BoxGeometry(.065,4.7,.12),cyan,
          [wallX-side*.36,4.25,center+2.8]);
        add(root,new THREE.BoxGeometry(.048,4.7,.10),amber,
          [wallX-side*.36,4.25,center-2.8]);
      }
    }
  }

  // Vaulted ceiling beams, linear brass runs, and narrow diffused light.
  for(const z of [13.0,5.25,-2.8,-10.85,-18.2]){
    add(root,new THREE.BoxGeometry(21.8,.45,.54),metal,[0,8.48,z]);
    add(root,new THREE.BoxGeometry(16,.037,.11),bronze,[0,8.19,z+.28]);
    for(const x of [-7.8,-3.35,3.35,7.8]){
      add(root,new THREE.BoxGeometry(1.35,.027,.16),cyan,[x,8.17,z+.30]);
    }
  }

  // Central aisle: parallel linear guides and brass cross-marks.
  for(const side of [-1,1]){
    const x=side*2.64;
    add(root,new THREE.BoxGeometry(.026,.012,34),bronze,[x,.014,-3.3]);
    add(root,new THREE.BoxGeometry(.016,.014,29),dim,[side*2.48,.022,-4.3]);
  }
  for(const z of [10.2,2.1,-6.0,-14.2]){
    add(root,new THREE.BoxGeometry(5.3,.016,.036),bronze,[0,.017,z]);
  }

  // Focal rear wall with luminous archive ring: a destination in the hall.
  add(root,new THREE.BoxGeometry(8.2,6.3,.06),metal,[0,4.26,-19.11]);
  add(root,new THREE.BoxGeometry(7.95,6.05,.065),darker,[0,4.26,-18.98]);
  torus(root,2.08,.039,bronze,0,4.31,-18.88,0);
  torus(root,1.64,.023,cyan,0,4.31,-18.85,0);
  torus(root,.46,.035,amber,0,4.31,-18.81,0);
  strip(root,vec(-3.7,4.31,-18.76),vec(-2.70,4.31,-18.76),cyan,.027);
  strip(root,vec(2.70,4.31,-18.76),vec(3.7,4.31,-18.76),cyan,.027);

  // Measured, warm-cool light contrast; no decorative endless gradients.
  const ambient=new THREE.HemisphereLight(0x94b6d4,0x10141b,1.45);
  scene.add(ambient);
  const key=new THREE.DirectionalLight(0xe6ebeb,2.0);
  key.position.set(0,8,11);scene.add(key);
  const back=new THREE.DirectionalLight(0x4cb5d7,1.6);
  back.position.set(2,6,-13);scene.add(back);
  const entry=new THREE.SpotLight(0xf4b77e,90,25,.85,.83,1.7);
  entry.position.set(0,8.0,12);
  entry.target.position.set(0,0,6);scene.add(entry,entry.target);

  EXHIBITS.forEach((exhibit,index)=>
    makeStation(scene,exhibit,index,
      {dark,metal,bronze,glass,cyan,amber,darkUnlit:dim},
      hitVolumes,ringMaterials,signageTextures));

  return {ambient,key,back,entry};
}

/**
 * Real-time, interactive architecture. No species meshes are loaded in V0.
 * Desktop supports orbit and zoom. On touch, choose exhibits through the
 * HTML index or tap a plinth, then orbit with one finger / pinch to zoom.
 */
export function createMuseumStage(canvas:HTMLCanvasElement,callbacks:Callbacks):MuseumStage {
  const mobile=window.matchMedia("(max-width: 720px)").matches;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dead=false;
  let renderer:THREE.WebGLRenderer;
  try{
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,
      powerPreference:"high-performance"});
  }catch{
    callbacks.onFailure("This browser could not initialize the 3D gallery.");
    throw new Error("WebGL initialization failed");
  }
  const gl=renderer.getContext();
  const ext=gl.getExtension("WEBGL_debug_renderer_info");
  const name=String(ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));
  const software=/swiftshader|llvmpipe|software/i.test(name);
  renderer.setPixelRatio(software?.75:Math.min(window.devicePixelRatio||1,mobile?1.12:1.55));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.12;
  renderer.setClearColor(0x080d14);
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x090f18);
  scene.fog=new THREE.FogExp2(0x090f18,.016);
  const camera=new THREE.PerspectiveCamera(mobile?57:46,1,.12,120);
  const entrancePos=vec(0,mobile?3.4:3.75,mobile?17.2:18.0);
  const entranceTarget=vec(0,2.65,-4.1);
  camera.position.copy(entrancePos);
  const controls=new OrbitControls(camera,canvas);
  controls.target.copy(entranceTarget);
  controls.enableDamping=true;
  controls.dampingFactor=.072;
  controls.enablePan=false;
  controls.rotateSpeed=.48;
  controls.zoomSpeed=.67;
  // Restricted entrance orbit: the original unlimited angle and 32m dolly
  // could move the visitor behind the shell or face only blank walls.
  Object.assign(controls,orbitLimits("entrance",
    azimuthFrom(entrancePos,entranceTarget)));
  controls.touches.ONE=THREE.TOUCH.ROTATE;
  controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;
  controls.update();

  let environmentSource:THREE.PMREMGenerator|null=null;
  let environmentMap:THREE.WebGLRenderTarget|null=null;
  if(!software){
    environmentSource=new THREE.PMREMGenerator(renderer);
    const room=new RoomEnvironment();
    environmentMap=environmentSource.fromScene(room,.045);
    scene.environment=environmentMap.texture;
    room.dispose();
  }

  const hitVolumes:THREE.Mesh[]=[];
  const rings:THREE.MeshBasicMaterial[]=[];
  const labels:THREE.Texture[]=[];
  const hall=createHall(scene,hitVolumes,rings,labels);

  // Install real animated, independently modeled GLBs. The gallery retains
  // one Three.js renderer; no nested WebGL canvases or opaque screenshots.
  const mixers:THREE.AnimationMixer[]=[];
  const specimenRoots:THREE.Object3D[]=[];
  const loader=new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const assets=[
    ["octave-spectrum","/lab/octave-sculpture/octave-obsidian.glb"],
    ["aether","/lab/menagerie/aether.glb"],
    ["medusa","/lab/menagerie/medusa.glb"],
    ["atlas","/lab/menagerie/atlas.glb"],
    ["frog","/lab/menagerie/frog.glb"],
  ] as const;
  const immersiveMounts=EXHIBITS.map(e=>
    scene.getObjectByName("specimen-mount:"+e.id));
  for(const [id,path] of assets){
    const index=EXHIBITS.findIndex(e=>e.id===id);
    const mount=immersiveMounts[index];
    if(!mount)continue;
    loader.load(path,gltf=>{
      if(dead)return;
      const sculpture=gltf.scene;
      const bb=new THREE.Box3().setFromObject(sculpture);
      const size=bb.getSize(new THREE.Vector3());
      const scale=Math.min(3.2/Math.max(.1,size.x),
        3.6/Math.max(.1,size.y),3.0/Math.max(.1,size.z),2.0);
      sculpture.scale.setScalar(scale);
      sculpture.position.set(-bb.min.x*scale-size.x*scale*.5,
        -bb.min.y*scale,
        -bb.min.z*scale-size.z*scale*.5);
      sculpture.name="Installed exhibit: "+id;
      mount.add(sculpture);
      specimenRoots.push(sculpture);
      const mixer=new THREE.AnimationMixer(sculpture);
      for(const clip of gltf.animations){
        const action=mixer.clipAction(clip);
        action.loop=THREE.LoopRepeat;
        action.play();
      }
      if(gltf.animations.length)mixers.push(mixer);
    },undefined,error=>{
      console.error("Could not load Menagerie exhibit",id,error);
    });
  }
  // The legacy Octave is a procedural model with a separate authentic
  // interactive lab. Present a light porcelain miniature in the hall and
  // open its full original controls via the dedicated museum exhibit route.
  const chassis=createChassisMiniature();
  const chassisMount=scene.getObjectByName("specimen-mount:octave-chassis");
  if(chassisMount){
    const box=new THREE.Box3().setFromObject(chassis.group);
    const sz=box.getSize(new THREE.Vector3());
    const factor=Math.min(3.1/sz.x,3.4/sz.y,3.1/sz.z,1.5);
    chassis.group.scale.setScalar(factor);
    chassis.group.position.set(
      -(box.min.x+sz.x*.5)*factor,
      -box.min.y*factor,
      -(box.min.z+sz.z*.5)*factor,
    );
    chassisMount.add(chassis.group);
    specimenRoots.push(chassis.group);
  }
  const raycaster=new THREE.Raycaster();
  const pointer=new THREE.Vector2();
  const cameraGoal=entrancePos.clone();
  const targetGoal=entranceTarget.clone();
  let traveling=false;
  let activeFocus:number|null=null;
  let raf=0,last=performance.now(),elapsed=0;
  const minFrame=software?56:mobile?28:18;
  const search=new URLSearchParams(window.location.search);
  const still=search.get("still")==="1";
  // A read-only camera trace for automated stress testing. Never enabled
  // during normal visits or used for analytics.
  const cameraDebug=search.get("cameraDebug")==="1";

  function restoreViewBounds(fromCurrent=false){
    const position=fromCurrent?camera.position:cameraGoal;
    const target=fromCurrent?controls.target:targetGoal;
    Object.assign(controls,orbitLimits(activeFocus===null?"entrance":"exhibit",
      azimuthFrom(position,target)));
    controls.enableDamping=true;
    if(fromCurrent){
      // An interrupted guided move should not yank the camera abruptly
      // from its midway location to the next exhibit.
      const radius=camera.position.distanceTo(controls.target);
      controls.minDistance=Math.min(controls.minDistance,radius);
      controls.maxDistance=Math.max(controls.maxDistance,radius+.05);
    }
  }

  function prepareGuidedTravel(){
    // These bounds are released ONLY while our own interpolation moves
    // between two known-safe camera poses inside the room. Otherwise the
    // OrbitControls zoom bounds would snap a 22m entrance shot to an 8m
    // exhibit shot mid-animation, causing the camera to jump.
    controls.minAzimuthAngle=-Infinity;
    controls.maxAzimuthAngle=Infinity;
    controls.minPolarAngle=0;
    controls.maxPolarAngle=Math.PI;
    controls.minDistance=0;
    controls.maxDistance=100;
    controls.enableDamping=false;
  }

  const onControlsStart=()=>{
    if(!traveling)return;
    traveling=false;
    restoreViewBounds(true);
  };
  controls.addEventListener("start",onControlsStart);

  function focus(index:number|null,immediate=false) {
    if(index!==null&&!EXHIBITS[index])return;
    activeFocus=index;
    if(index===null){
      cameraGoal.copy(entrancePos);targetGoal.copy(entranceTarget);
    }else{
      const e=EXHIBITS[index];
      // Approach an exhibit from the central aisle. The back of the sculpture
      // position remains clear when actual models are installed later.
      const direction=e.x<0?-1:1;
      cameraGoal.set(e.x*.46,2.9,e.z+(mobile?6.0:5.0));
      targetGoal.set(e.x,2.0,e.z-.28);
      if(mobile)cameraGoal.x+=direction*.35;
    }
    traveling=!immediate&&!reduced;
    if(traveling){
      prepareGuidedTravel();
    }else{
      camera.position.copy(cameraGoal);
      controls.target.copy(targetGoal);
      restoreViewBounds();
      controls.update();
      clampIntoMuseum(camera.position);
      camera.lookAt(controls.target);
    }
  }

  function lighting(mode:LightMode){
    const inspect=mode==="study";
    hall.ambient.intensity=inspect?2.55:1.45;
    hall.key.intensity=inspect?3.2:2.0;
    hall.back.intensity=inspect?2.3:1.6;
    hall.entry.intensity=inspect?115:90;
    (scene.background as THREE.Color).setHex(inspect?0x14202b:0x090f18);
    scene.fog=new THREE.FogExp2(inspect?0x14202b:0x090f18,inspect?.011:.016);
  }

  function pick(clientX:number,clientY:number):number|null {
    const rect=canvas.getBoundingClientRect();
    if(rect.width<=0||rect.height<=0)return null;
    pointer.set((clientX-rect.left)/rect.width*2-1,
      -((clientY-rect.top)/rect.height*2-1));
    camera.updateMatrixWorld();
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects(hitVolumes,false);
    if(!hits.length)return null;
    const n=hits[0].object.userData.exhibitIndex;
    return typeof n==="number"?n:null;
  }

  const onLost=(event:Event)=>{
    event.preventDefault();
    callbacks.onFailure("The WebGL context was lost. Refresh to re-enter the museum.");
    cancelAnimationFrame(raf);
  };
  canvas.addEventListener("webglcontextlost",onLost);

  function draw(now:number){
    if(dead)return;
    if(now-last<minFrame){raf=requestAnimationFrame(draw);return;}
    const realDt=Math.max(0,(now-last)/1000);
    const dt=Math.min(.09,realDt);
    last=now;
    if(!reduced){
      elapsed+=dt;
      for(const mixer of mixers)mixer.update(dt);
      chassis.update(elapsed);
    }
    if(traveling){
      // Guided camera travel uses wall-clock time, not the capped lighting
      // frame delta. Otherwise software WebGL and busy phones can make a
      // short exhibit transition take many seconds or appear stuck.
      const ease=1-Math.exp(-Math.min(.45,realDt)*4.1);
      camera.position.lerp(cameraGoal,ease);
      controls.target.lerp(targetGoal,ease);
      if(camera.position.distanceTo(cameraGoal)<.032&&
        controls.target.distanceTo(targetGoal)<.032){
        camera.position.copy(cameraGoal);
        controls.target.copy(targetGoal);
        traveling=false;
        restoreViewBounds();
      }
    }
    if(!reduced){
      for(let i=0;i<rings.length;i++){
        const hue=.51+Math.sin(elapsed*.35+i*.65)*.018;
        rings[i].color.setHSL(hue,.94,.55+Math.sin(elapsed*.8+i*.85)*.07);
      }
    }
    controls.update();
    // Last-resort guard against zoom/rotation edge cases, including kinetic
    // touch gestures and attempts to orbit through the ceiling or side walls.
    const beforeClamp=camera.position.clone();
    clampIntoMuseum(camera.position);
    if(!camera.position.equals(beforeClamp))camera.lookAt(controls.target);
    if(cameraDebug){
      canvas.dataset.cameraPos=[
        camera.position.x.toFixed(3),camera.position.y.toFixed(3),
        camera.position.z.toFixed(3),
      ].join(",");
      canvas.dataset.cameraDistance=
        camera.position.distanceTo(controls.target).toFixed(3);
      canvas.dataset.cameraAzimuth=controls.getAzimuthalAngle().toFixed(4);
      canvas.dataset.cameraPolar=controls.getPolarAngle().toFixed(4);
      canvas.dataset.cameraMode=traveling?"travel":
        activeFocus===null?"entrance":"exhibit";
    }
    renderer.render(scene,camera);
    if(!still)raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  callbacks.onReady();

  function resize(w:number,h:number){
    const width=Math.max(1,Math.round(w)),height=Math.max(1,Math.round(h));
    camera.aspect=width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    if(still){
      // Exact-frame captures must be valid even when ResizeObserver fires
      // after the one and only reduced-render frame.
      renderer.render(scene,camera);
    }
  }

  function dispose(){
    if(dead)return;
    dead=true;
    cancelAnimationFrame(raf);
    canvas.removeEventListener("webglcontextlost",onLost);
    controls.removeEventListener("start",onControlsStart);
    controls.dispose();
    const geometries=new Set<THREE.BufferGeometry>();
    const materials=new Set<THREE.Material>();
    scene.traverse(o=>{
      if(o instanceof THREE.Mesh||o instanceof THREE.Line||o instanceof THREE.Points){
        geometries.add(o.geometry);
        for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);
      }
    });
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    // Clone-owned GLBs, including their skinned geometry, are already part
    // of the scene traversal above. No duplicate WebGL contexts to close.
    mixers.forEach(m=>m.stopAllAction());
    labels.forEach(l=>l.dispose());
    environmentMap?.dispose();environmentSource?.dispose();
    renderer.dispose();renderer.forceContextLoss();
  }
  return {focus,lighting,pick,resize,dispose};
}

