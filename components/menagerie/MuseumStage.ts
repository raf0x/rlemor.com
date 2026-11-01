"use client";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createChassisMiniature } from "./chassisMiniature";
import { createGalleryRail } from "./galleryRail";
import { createExhibitSpectrum } from "./exhibitSpectrum";
import { EXHIBITS, type Exhibit } from "./exhibits";

export type LightMode="cinematic"|"study";
export type MuseumStage={
  focus:(index:number|null,immediate?:boolean)=>void;
  pan:(distance:number)=>void;
  settle:()=>void;
  getCurrentIndex:()=>number;
  lighting:(mode:LightMode)=>void;
  pick:(clientX:number,clientY:number)=>number|null;
  resize:(width:number,height:number)=>void;
  dispose:()=>void;
};
export type PlaquePosition={
  index:number;
  x:number;
  y:number;
  opacity:number;
  visible:boolean;
};
type Callbacks={
  onReady:()=>void;
  onFailure:(message:string)=>void;
  onSelect?:(index:number)=>void;
  onPlaques?:(positions:readonly PlaquePosition[])=>void;
};

const V=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
function part(
  parent:THREE.Object3D,geometry:THREE.BufferGeometry,
  material:THREE.Material,position:[number,number,number]=[0,0,0],
){
  const obj=new THREE.Mesh(geometry,material);
  obj.position.set(...position);parent.add(obj);return obj;
}
function lineBetween(parent:THREE.Object3D,a:THREE.Vector3,b:THREE.Vector3,
  material:THREE.Material,width=.025){
  const obj=part(parent,new THREE.CylinderGeometry(width,width,a.distanceTo(b),10),material);
  obj.position.copy(a).add(b).multiplyScalar(.5);
  obj.quaternion.setFromUnitVectors(V(0,1,0),b.clone().sub(a).normalize());
  return obj;
}
function ring(parent:THREE.Object3D,radius:number,tube:number,material:THREE.Material,
  at:[number,number,number]){
  const obj=part(parent,new THREE.TorusGeometry(radius,tube,8,110),material,at);
  obj.rotation.x=Math.PI/2;return obj;
}
type GalleryPalette={
  white:THREE.MeshStandardMaterial;
  shelf:THREE.MeshStandardMaterial;
  graphite:THREE.MeshStandardMaterial;
  trim:THREE.MeshStandardMaterial;
  chrome:THREE.MeshStandardMaterial;
  bronze:THREE.MeshStandardMaterial;
};
function makeStation(
  scene:THREE.Scene,exhibit:Exhibit,index:number,materials:GalleryPalette,
  hitVolumes:THREE.Mesh[],accents:THREE.MeshBasicMaterial[],
){
  const frame=new THREE.Group();
  frame.name="exhibit-bay:"+exhibit.id;
  frame.position.set(exhibit.x,0,exhibit.z);
  scene.add(frame);
  const {white,shelf,graphite,trim,chrome,bronze}=materials;
  // The wall itself carries every display. No arches, side walls or ceiling.
  part(frame,new THREE.BoxGeometry(7.78,6.85,.105),trim,[0,4.0,-3.76]);
  part(frame,new THREE.BoxGeometry(7.68,6.75,.108),white,[0,4.0,-3.67]);
  for(const side of [-1,1]){
    part(frame,new THREE.BoxGeometry(.055,6.5,.032),chrome,
      [side*3.78,4.0,-3.59]);
    lineBetween(frame,V(side*2.5,1.10,-3.59),V(side*2.5,1.10,-.77),chrome,.04);
    part(frame,new THREE.BoxGeometry(.13,.25,.17),graphite,
      [side*2.5,1.13,-3.47]);
  }
  part(frame,new THREE.BoxGeometry(7.2,.043,.07),bronze,[0,7.43,-3.54]);
  // Short projecting white display shelf, held up by rails from the wall.
  const stand=part(frame,new THREE.BoxGeometry(6.95,.14,3.62),shelf,
    [0,.86,-1.13]);
  stand.receiveShadow=true;
  part(frame,new THREE.BoxGeometry(6.93,.022,.05),chrome,[0,.84,.69]);
  part(frame,new THREE.BoxGeometry(6.87,.035,.035),bronze,[0,.79,.73]);
  // A subtle colored illuminated orbit on the white shelf distinguishes the
  // specimen without a heavy black pedestal or a glowing UI rectangle.
  const accent=new THREE.MeshBasicMaterial({color:0x18c8fb,toneMapped:false});
  accents.push(accent);
  ring(frame,2.05,.022,accent,[0,.938,-.82]);
  ring(frame,2.34,.010,bronze,[0,.943,-.82]);
  // Actual model mounting origin retained across V3 and V4.
  const mount=new THREE.Group();
  mount.name="specimen-mount:"+exhibit.id;
  mount.userData.exhibitId=exhibit.id;
  mount.position.set(0,.96,-.82);
  frame.add(mount);
  // Exhibit names are native HTML plaques, anchored to a projected 3D point
  // rather than downsampled text painted on a distant CanvasTexture.
  // This completely eliminates blurry labels on iPhone Retina displays.
  // Invisible raycast geometry. Real specimen meshes do NOT need separate
  // event handlers, and every station has an accessible HTML counterpart.
  const hit=part(scene,new THREE.BoxGeometry(6.7,5.0,4.2),
    new THREE.MeshBasicMaterial({color:0xffffff,colorWrite:false,
      depthWrite:false,transparent:true,opacity:0}),
    [exhibit.x,3.0,-.82]);
  hit.userData.exhibitIndex=index;hitVolumes.push(hit);
  // All stations share the SAME movable studio light rig. Six independent
  // spotlights per gallery were too expensive for mobile GPU rendering.
}

function createWhiteHall(scene:THREE.Scene,
  hitVolumes:THREE.Mesh[],accents:THREE.MeshBasicMaterial[],
){
  const white=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.91,metalness:0});
  const shelf=new THREE.MeshStandardMaterial({color:0xf9fafa,roughness:.29,metalness:.12});
  const graphite=new THREE.MeshStandardMaterial({color:0x38434b,roughness:.30,metalness:.69});
  const trim=new THREE.MeshStandardMaterial({color:0xe7ecee,roughness:.58,metalness:.24});
  const chrome=new THREE.MeshStandardMaterial({color:0x758792,roughness:.26,metalness:.83});
  const bronze=new THREE.MeshStandardMaterial({color:0xb79779,roughness:.36,metalness:.78});
  const floorMaterial=new THREE.MeshStandardMaterial({
    color:0xf4f6f5,metalness:.13,roughness:.68,
  });
  // Exactly ONE continuous back wall and ONE horizontal floor.
  const gallery=new THREE.Group();gallery.name="white-horizontal-gallery";
  scene.add(gallery);
  const floor=part(gallery,new THREE.BoxGeometry(105,.20,37),floorMaterial,[0,-.12,2.0]);
  floor.receiveShadow=true;
  const wall=part(gallery,new THREE.BoxGeometry(72,9.4,.27),white,[0,4.56,-4.20]);
  wall.receiveShadow=true;
  part(gallery,new THREE.BoxGeometry(71.7,.07,.14),trim,[0,.10,-4.0]);
  // Linear bronze and graphite accents connect the bays into one exhibition.
  part(gallery,new THREE.BoxGeometry(65,.042,.11),chrome,[0,7.61,-3.94]);
  part(gallery,new THREE.BoxGeometry(65,.035,.12),bronze,[0,1.03,-3.94]);
  for(let i=0;i<EXHIBITS.length-1;i++){
    const x=(EXHIBITS[i].x+EXHIBITS[i+1].x)/2;
    part(gallery,new THREE.BoxGeometry(.035,7.20,.05),trim,[x,3.97,-3.97]);
  }
  // Floor seams create depth without random slabs and without side walls.
  for(let i=-3;i<=3;i++){
    const x=i*10;
    part(gallery,new THREE.BoxGeometry(.018,.009,26),
      new THREE.MeshBasicMaterial({color:0xdde3e4}),[x,.001,7.2]);
  }
  const palette={white,shelf,graphite,trim,chrome,bronze};
  EXHIBITS.forEach((e,i)=>makeStation(scene,e,i,palette,hitVolumes,accents));
  const hemi=new THREE.HemisphereLight(0xffffff,0xe4edf5,2.7);
  scene.add(hemi);
  const ambient=new THREE.AmbientLight(0xffffff,.42);
  scene.add(ambient);
  const key=new THREE.DirectionalLight(0xffffff,2.3);
  key.position.set(-4,10,10);scene.add(key);
  const rear=new THREE.DirectionalLight(0x9db9d1,1.25);
  rear.position.set(4,5,-4);scene.add(rear);
  const studio=new THREE.SpotLight(0xffffff,145,22,.79,.78,1.4);
  studio.position.set(EXHIBITS[0].x-2.0,7.8,4.4);
  studio.target.position.set(EXHIBITS[0].x,2.3,-.9);
  scene.add(studio,studio.target);
  const highlight=new THREE.SpotLight(0xa8cfff,75,19,.86,.78,1.4);
  highlight.position.set(EXHIBITS[0].x+2.6,5.7,-1.1);
  highlight.target.position.set(EXHIBITS[0].x,2.3,-.9);
  scene.add(highlight,highlight.target);
  return {hemi,ambient,key,rear,studio,highlight};
}

/**
 * Gallery navigation is a lateral rail. No OrbitControls can rotate the
 * visitor outside the room because the camera never changes Y/Z or yaw.
 * Close-up full-orbit remains available in each dedicated creature page.
 */
export function createMuseumStage(
  canvas:HTMLCanvasElement,callbacks:Callbacks,
):MuseumStage {
  const mobile=window.matchMedia("(max-width: 720px)").matches;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dead=false,raf=0,last=performance.now(),motionTime=0;
  const debug=new URLSearchParams(window.location.search);
  const still=debug.get("still")==="1";
  let renderer:THREE.WebGLRenderer;
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:true,
      powerPreference:"high-performance"});
  }catch(error){
    callbacks.onFailure("This device could not initialize the 3D gallery.");
    throw error;
  }
  const gl=renderer.getContext();
  const ext=gl.getExtension("WEBGL_debug_renderer_info");
  const gpu=String(ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));
  const software=/swiftshader|llvmpipe|software/i.test(gpu);
  renderer.setPixelRatio(software?.7:Math.min(window.devicePixelRatio||1,mobile?1.1:1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.95;
  renderer.setClearColor(0xf9faf8,1);
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xf9faf8);
  const camera=new THREE.PerspectiveCamera(mobile?51:41,1,.1,125);
  const rail=createGalleryRail(EXHIBITS.map(e=>e.x),0);
  const height=mobile?3.15:3.20,depth=mobile?14.1:12.5;
  const focalY=mobile?2.48:2.49;
  const lookZ=-.7;
  function alignCamera(){
    const x=rail.state().x;
    camera.position.set(x,height,depth);
    camera.lookAt(x,focalY,lookZ);
    camera.updateMatrixWorld();
  }
  alignCamera();

  let pmrem:THREE.PMREMGenerator|null=null;
  let envMap:THREE.WebGLRenderTarget|null=null;
  if(!software){
    pmrem=new THREE.PMREMGenerator(renderer);
    const room=new RoomEnvironment();
    envMap=pmrem.fromScene(room,.045);
    scene.environment=envMap.texture;
    room.dispose();
  }
  const hitVolumes:THREE.Mesh[]=[];
  const accentMaterials:THREE.MeshBasicMaterial[]=[];
  const lights=createWhiteHall(scene,hitVolumes,accentMaterials);
  const spectrum=createExhibitSpectrum();
  const mixers:THREE.AnimationMixer[]=[];
  const installed=new Set<string>();
  const loader=new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const assets=[
    ["octave-spectrum","/lab/octave-sculpture/octave-obsidian.glb"],
    ["aether","/lab/menagerie/aether.glb"],
    ["medusa","/lab/menagerie/medusa.glb"],
    ["atlas","/lab/menagerie/atlas.glb"],
    ["frog","/lab/menagerie/frog.glb"],
  ] as const;

  for(const [id,url] of assets){
    const mount=scene.getObjectByName("specimen-mount:"+id);
    if(!mount)continue;
    loader.load(url,gltf=>{
      if(dead)return;
      const creature=gltf.scene;
      const bounds=new THREE.Box3().setFromObject(creature);
      const size=bounds.getSize(new THREE.Vector3());
      const scale=Math.min(6.5/Math.max(.1,size.x),
        4.55/Math.max(.1,size.y),4.7/Math.max(.1,size.z),2.15);
      const centerY=id==="aether"?2.50:id==="medusa"?2.80:2.39;
      creature.scale.setScalar(scale);
      creature.position.set(
        -(bounds.min.x+size.x*.5)*scale,
        centerY-(bounds.min.y+size.y*.5)*scale,
        -(bounds.min.z+size.z*.5)*scale,
      );
      creature.name="Installed specimen: "+id;
      spectrum.attach(creature,id);
      mount.add(creature);
      installed.add(id);
      canvas.dataset.loadedExhibits=[...installed].sort().join(",");
      if(gltf.animations.length){
        const mixer=new THREE.AnimationMixer(creature);
        for(const clip of gltf.animations)mixer.clipAction(clip).play();
        mixers.push(mixer);
      }
    },undefined,error=>{
      console.error("Failed to load museum specimen",id,error);
      canvas.dataset.failedExhibits=(canvas.dataset.failedExhibits||"")+" "+id;
    });
  }

  // A lightweight architectural representation of the older kinetic Octave.
  // Its authentic extension, X-ray, disassembly and drag-to-dock are retained
  // unchanged in the museum's dedicated exhibit route.
  const chassis=createChassisMiniature();
  const chassisMount=scene.getObjectByName("specimen-mount:octave-chassis");
  if(chassisMount){
    const bounds=new THREE.Box3().setFromObject(chassis.group);
    const size=bounds.getSize(new THREE.Vector3());
    const factor=Math.min(5.65/Math.max(.1,size.x),4.3/Math.max(.1,size.y),
      4.5/Math.max(.1,size.z),1.7);
    chassis.group.scale.setScalar(factor);
    chassis.group.position.set(
      -(bounds.min.x+size.x*.5)*factor,
      2.35-(bounds.min.y+size.y*.5)*factor,
      -(bounds.min.z+size.z*.5)*factor
    );
    chassisMount.add(chassis.group);
    installed.add("octave-chassis");
  }
  const picker=new THREE.Raycaster();
  const pointer=new THREE.Vector2();
  const plaqueVector=new THREE.Vector3();
  let lastAccentTick=-1;
  function positionPlaques(){
    if(!callbacks.onPlaques)return;
    // Project the front edge of every physical shelf into CSS pixels.
    // Unlike canvas-texture signs, these labels never get blurry or small
    // when the visitor browses between displays.
    const width=Math.max(1,canvas.clientWidth);
    const height=Math.max(1,canvas.clientHeight);
    const result:PlaquePosition[]=EXHIBITS.map((e,index)=>{
      plaqueVector.set(e.x,.53,1.0).project(camera);
      const x=(plaqueVector.x*.5+.5)*width;
      const y=(-plaqueVector.y*.5+.5)*height;
      const visible=plaqueVector.z>-1&&plaqueVector.z<1&&
        x>-100&&x<width+100&&y>32&&y<height-40;
      const opacity=Math.max(.72,Math.min(1,1-Math.abs(x-width*.5)/Math.max(1,width)*.25));
      return {index,x,y,visible,opacity};
    });
    callbacks.onPlaques(result);
  }

  function focus(index:number|null,immediate=false){
    const desired=index===null?0:index;
    if(desired<0||desired>=EXHIBITS.length)return;
    const selected=rail.moveTo(desired,immediate||reduced);
    callbacks.onSelect?.(selected);
    if(immediate||reduced)alignCamera();
  }
  function pan(distance:number){
    rail.panBy(distance);
    alignCamera();
  }
  function settle(){
    const current=rail.settle(reduced);
    callbacks.onSelect?.(current);
    if(reduced)alignCamera();
  }
  function lighting(mode:LightMode){
    const inspect=mode==="study";
    lights.hemi.intensity=inspect?3.7:2.7;
    lights.ambient.intensity=inspect?.72:.42;
    lights.key.intensity=inspect?3.1:2.3;
    lights.rear.intensity=inspect?1.45:1.25;
    lights.studio.intensity=inspect?190:145;
    lights.highlight.intensity=inspect?100:75;
    renderer.toneMappingExposure=inspect?1.04:.95;
  }
  function pick(clientX:number,clientY:number):number|null{
    const rect=canvas.getBoundingClientRect();
    if(rect.width<=0||rect.height<=0)return null;
    pointer.set((clientX-rect.left)/rect.width*2-1,
      -((clientY-rect.top)/rect.height*2-1));
    picker.setFromCamera(pointer,camera);
    const matches=picker.intersectObjects(hitVolumes,false);
    if(!matches.length)return null;
    const result=matches[0].object.userData.exhibitIndex;
    return typeof result==="number"?result:null;
  }
  function draw(now:number){
    if(dead)return;
    const realDt=Math.max(0,(now-last)/1000);
    const minFrame=software?56:mobile?28:16;
    if(realDt*1000<minFrame){raf=requestAnimationFrame(draw);return;}
    last=now;
    const dt=Math.min(.12,realDt);
    rail.update(realDt);
    alignCamera();
    const currentX=rail.state().x;
    lights.studio.position.x=currentX-2.0;
    lights.studio.target.position.x=currentX;
    lights.highlight.position.x=currentX+2.6;
    lights.highlight.target.position.x=currentX;
    if(!reduced){
      motionTime+=Math.min(dt,.06);
      mixers.forEach(mixer=>mixer.update(Math.min(dt,.06)));
      chassis.update(motionTime);
      spectrum.update(motionTime);
      const tick=Math.floor(motionTime*20);
      if(tick!==lastAccentTick){
        lastAccentTick=tick;
        accentMaterials.forEach((mat,i)=>{
          const hue=(EXHIBITS[i].accentHue+motionTime*.28)%1;
          mat.color.setHSL(hue,1,.48+.09*Math.sin(motionTime*3+i*1.4));
        });
      }
    }
    if(debug.get("railDebug")==="1"){
      const state=rail.state();
      canvas.dataset.railX=state.x.toFixed(4);
      canvas.dataset.targetX=state.targetX.toFixed(4);
      canvas.dataset.railSelected=String(state.selectedIndex);
      canvas.dataset.railMoving=String(state.moving);
      canvas.dataset.cameraY=String(camera.position.y);
      canvas.dataset.cameraZ=String(camera.position.z);
    }
    renderer.render(scene,camera);
    positionPlaques();
    if(!still)raf=requestAnimationFrame(draw);
  }
  const onLost=(event:Event)=>{
    event.preventDefault();
    callbacks.onFailure("The gallery's 3D renderer was interrupted. Refresh to enter again.");
    cancelAnimationFrame(raf);
  };
  canvas.addEventListener("webglcontextlost",onLost);
  raf=requestAnimationFrame(draw);
  callbacks.onReady();

  function resize(w:number,h:number){
    const width=Math.max(1,Math.round(w)),height=Math.max(1,Math.round(h));
    camera.aspect=width/height;camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    alignCamera();
    if(still)renderer.render(scene,camera);
    positionPlaques();
  }
  function dispose(){
    if(dead)return;
    dead=true;
    cancelAnimationFrame(raf);
    canvas.removeEventListener("webglcontextlost",onLost);
    mixers.forEach(m=>m.stopAllAction());
    const geometry=new Set<THREE.BufferGeometry>();
    const material=new Set<THREE.Material>();
    scene.traverse(obj=>{
      if(obj instanceof THREE.Mesh){
        geometry.add(obj.geometry);
        const mats=Array.isArray(obj.material)?obj.material:[obj.material];
        mats.forEach(x=>material.add(x));
      }
    });
    geometry.forEach(x=>x.dispose());
    material.forEach(x=>x.dispose());
    spectrum.dispose();
    envMap?.dispose();pmrem?.dispose();
    renderer.dispose();renderer.forceContextLoss();
  }

  return {focus,pan,settle,getCurrentIndex:()=>rail.state().selectedIndex,
    lighting,pick,resize,dispose};
}

