"use client";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createExhibitSpectrum } from "./exhibitSpectrum";
import { createBlackTileTexture,
  createInspectionLighting } from "./galleryLighting";

export type CreatureName="aether"|"medusa"|"atlas"|"frog";
export type CreatureStage={
  resize:(w:number,h:number)=>void;
  play:(value:boolean)=>void;
  light:(value:"cinematic"|"study")=>void;
  action:()=>void;
  reset:()=>void;
  dispose:()=>void;
};

function add(parent:THREE.Object3D,g:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0){
 const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
export function createCreatureStage(
 canvas:HTMLCanvasElement,id:CreatureName,
 ready:()=>void,
 failure:(message:string)=>void,
):CreatureStage{
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const mobile=window.matchMedia("(max-width: 700px)").matches;
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:"high-performance"});
 const gl=renderer.getContext();
 const info=gl.getExtension("WEBGL_debug_renderer_info");
 const gpu=String(info?gl.getParameter(info.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));
 const software=/swiftshader|llvmpipe|software/i.test(gpu);
 renderer.setPixelRatio(software?.8:Math.min(window.devicePixelRatio||1,mobile?1.25:1.6));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=.98;
 const scene=new THREE.Scene();
 scene.background=new THREE.Color(0xf9faf8);
 const camera=new THREE.PerspectiveCamera(mobile?44:38,1,.1,80);
 // The manta is a broad, horizontal wing. It was almost edge-on in the
 // original generic 3D viewer, so the creature read as a small silver line.
 // Each species now has an intentionally framed museum portrait.
 const view:Record<CreatureName,{position:[number,number,number];target:[number,number,number]}>={
   aether:{position:[mobile?1.7:2.6,mobile?5.1:5.25,mobile?12.1:7.7],target:[0,1.8,0]},
   medusa:{position:[1.8,3.65,mobile?11.6:9.7],target:[0,2.45,0]},
   atlas:{position:[2.25,4.25,mobile?10.8:8.65],target:[0,1.76,0]},
   frog:{position:[1.85,3.85,mobile?10.3:8.15],target:[0,1.56,0]},
 };
 const originalPosition=new THREE.Vector3(...view[id].position);
 const originalTarget=new THREE.Vector3(...view[id].target);
 camera.position.copy(originalPosition);
 const controls=new OrbitControls(camera,canvas);
 controls.target.copy(originalTarget);
 controls.enableDamping=true;controls.dampingFactor=.07;
 controls.enablePan=false;
 controls.rotateSpeed=.65;controls.zoomSpeed=.8;
 // Full 360-degree azimuth inspection in open space. The visitor cannot
 // orbit through a wall or descend below the model's floor.
 controls.minDistance=4.4;controls.maxDistance=14.0;
 controls.minPolarAngle=.38;controls.maxPolarAngle=1.47;
 controls.update();
 const env=new THREE.PMREMGenerator(renderer);
 const room=new RoomEnvironment();
 const envTex=env.fromScene(room,.04);
 scene.environment=envTex.texture;room.dispose();

 const graphite=new THREE.MeshStandardMaterial({color:0xdbe4e4,metalness:.21,roughness:.42});
 const dark=new THREE.MeshStandardMaterial({color:0xf8fafa,metalness:.13,roughness:.36});
 const bronze=new THREE.MeshStandardMaterial({color:0xb49475,metalness:.78,roughness:.34});
 const cyan=new THREE.MeshBasicMaterial({color:0x63dff7,toneMapped:false});
 const platform=new THREE.Group();scene.add(platform);
 add(platform,new THREE.CylinderGeometry(2.65,2.75,.29,100),graphite,0,.24,0);
 add(platform,new THREE.CylinderGeometry(2.56,2.57,.065,100),dark,0,.42,0);
 const rim=add(platform,new THREE.TorusGeometry(2.54,.024,9,140),cyan,0,.48,0);
 rim.rotation.x=Math.PI/2;
 const rim2=add(platform,new THREE.TorusGeometry(2.70,.025,9,140),bronze,0,.22,0);
 rim2.rotation.x=Math.PI/2;
 const floorMaterial=new THREE.MeshStandardMaterial({
  color:0xf3f6f4,metalness:.12,roughness:.72,
 });
 const floor=add(scene,new THREE.PlaneGeometry(160,160),floorMaterial,0,-.01,0);
 floor.rotation.x=-Math.PI/2;
 const tileTexture=createBlackTileTexture(76,76);
 // The original lacquered physical material reflected the large studio
 // spotlights until the entire floor became GRAY. Use a carefully graded
 // dark ceramic texture on real floor geometry instead, so the specimens
 // receive the bright spots but the room stays genuinely black. Tiny grout
 // and glaze strokes are already baked into the procedural tile map.
 const darkTile=new THREE.MeshBasicMaterial({
  map:tileTexture,color:0xe0e8f2,toneMapped:false,
  transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,
 });
 const tilePlane=add(scene,new THREE.PlaneGeometry(160,160),darkTile,0,-.005,0);
 tilePlane.rotation.x=-Math.PI/2;
 // No physical backdrop or side walls. The former back wall obstructed
 // the creature after visitors orbited around it (reproduced in the
 // uploaded iPhone recording). Open 360-degree inspection is intentional.
 // The neutral floor and constant scene background are all that remain.
 const warm=new THREE.SpotLight(0xffa86e,116,27,.7,.7,1.2);
 warm.position.set(-5.1,7,4.9);warm.target.position.set(0,2.4,0);scene.add(warm,warm.target);
 const cool=new THREE.SpotLight(0x69c9fa,118,28,.73,.67,1.2);
 cool.position.set(5.0,6.3,5.5);cool.target.position.set(0,2.2,0);scene.add(cool,cool.target);
 const top=new THREE.SpotLight(0xd4ecff,58,20,.8,.7);
 top.position.set(0,8,2);top.target.position.set(0,2.7,0);scene.add(top,top.target);
 const hemi=new THREE.HemisphereLight(0xffffff,0xe0ecf2,2.0);scene.add(hemi);
 const inspection=createInspectionLighting({
  scene,renderer,floor:floorMaterial,pedestal:graphite,underplate:dark,
  tiled:darkTile,warm,cool,top,hemi,
 });
 let statue:THREE.Group|null=null;
 let mixer:THREE.AnimationMixer|null=null;
 let actions:THREE.AnimationAction[]=[];
 let playing=!reduced;
 let actionTime=0,elapsed=0;
 let raf=0,last=performance.now();
 const targetFrameMs=software?52:mobile?30:17;
 const showLightDebug=new URLSearchParams(window.location.search).has("lightDebug");
 let disposed=false;
 const spectrum=createExhibitSpectrum();

 const loader=new GLTFLoader();
 loader.setMeshoptDecoder(MeshoptDecoder);
 loader.load("/lab/menagerie/"+id+".glb",gltf=>{
  if(disposed)return;
  statue=gltf.scene;
  statue.name="Menagerie specimen / "+id;
  const bb=new THREE.Box3().setFromObject(statue);
  const size=bb.getSize(new THREE.Vector3());
  // Center each species within the same exhibit composition. The earlier
  // bottom-only placement put a flying manta nearly flat against the
  // platform and left most of the useful screen empty.
  const fit=Math.min(6.0/Math.max(.1,size.x),4.45/Math.max(.1,size.y),
    5.1/Math.max(.1,size.z),2.50);
  const centerY=id==="medusa"?2.58:id==="aether"?2.48:id==="frog"?2.03:2.05;
  statue.scale.setScalar(fit);
  statue.position.set(-(bb.min.x+size.x*.5)*fit,
    centerY-(bb.min.y+size.y*.5)*fit,
    -(bb.min.z+size.z*.5)*fit);
  statue.userData.restY=statue.position.y;
  statue.userData.restScale=fit;
  scene.add(statue);
  // Vivid independently changing material channels on actual eye, wing,
  // filament and joint geometry. The underlying animation remains intact.
  spectrum.attach(statue,id);
  mixer=new THREE.AnimationMixer(statue);
  actions=gltf.animations.map(clip=>{
    const a=mixer!.clipAction(clip);
    a.loop=THREE.LoopRepeat;a.play();
    return a;
  });
  ready();
 },undefined,err=>{
  console.error("Creature failed",id,err);
  failure("The 3D specimen could not be loaded.");
 });

 function draw(now:number){
  if(disposed)return;
  if(now-last<targetFrameMs){raf=requestAnimationFrame(draw);return;}
  const realDt=Math.max(0,(now-last)/1000);
  const dt=Math.min(.055,realDt);last=now;
  inspection.update(realDt);
  if(showLightDebug)canvas.dataset.lightBlend=inspection.blend().toFixed(3);
  if(playing){
    elapsed+=dt;mixer?.update(dt);
    spectrum.update(elapsed);
  }
  if(actionTime>0&&statue){
    actionTime=Math.max(0,actionTime-dt);
    const weight=Math.pow(Math.sin((3.8-actionTime)/3.8*Math.PI),2);
    if(id==="frog"){
      const restY=statue.userData.restY as number;
      statue.position.y+=(restY+.65*weight-statue.position.y)*.18;
    }
    if(id==="medusa")statue.scale.setScalar((statue.userData.restScale as number)*(1+.12*weight));
    if(id==="aether")actions.forEach(a=>a.timeScale=1+1.5*weight);
    if(id==="atlas")actions.forEach(a=>a.timeScale=.6+1.8*weight);
  }else if(statue){
    if(statue.userData.restY!==undefined)statue.position.y+=(statue.userData.restY-statue.position.y)*.14;
    if(statue.userData.restScale!==undefined)statue.scale.setScalar(statue.userData.restScale);
    actions.forEach(a=>a.timeScale=1);
  }
  if(playing&&rim.material instanceof THREE.MeshBasicMaterial)rim.material.color.setHSL(.51+.02*Math.sin(elapsed*.9),1,.55);
  controls.update();
  renderer.render(scene,camera);
  raf=requestAnimationFrame(draw);
 }
 raf=requestAnimationFrame(draw);
 function action(){
  if(!statue)return;
  actionTime=3.8;
 }
 function resize(w:number,h:number){
  const width=Math.max(1,Math.round(w)),height=Math.max(1,Math.round(h));
  camera.aspect=width/height;camera.updateProjectionMatrix();
  renderer.setSize(width,height,false);
 }
 function light(value:"cinematic"|"study"){
  inspection.setMode(value,reduced);
  if(showLightDebug){
    canvas.dataset.lightTarget=value;
    canvas.dataset.lightBlend=inspection.blend().toFixed(3);
  }
 }
 function reset(){
  controls.reset();
  camera.position.copy(originalPosition);
  controls.target.copy(originalTarget);controls.update();
  light("study");
  playing=!reduced;actionTime=0;
 }
 function dispose(){
  disposed=true;cancelAnimationFrame(raf);controls.dispose();
  mixer?.stopAllAction();
  scene.traverse(obj=>{
    if(obj instanceof THREE.Mesh){
      obj.geometry.dispose();
      for(const m of Array.isArray(obj.material)?obj.material:[obj.material])m.dispose();
    }
  });
  spectrum.dispose();
  tileTexture.dispose();
  envTex.dispose();env.dispose();renderer.dispose();renderer.forceContextLoss();
 }
 return {resize,play(v){playing=v},light,action,reset,dispose};
}

