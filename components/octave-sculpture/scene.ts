"use client";

/**
 * OCTAVE / 01, a real skinned GLB in a small real-time gallery.
 * Asset geometry, PBR materials and the 4-second skeletal animation are
 * authored and exported in Blender. Three.js only stages and animates it.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type Shot = "hero" | "profile" | "detail";
export type Lighting = "cinematic" | "inspection";

export type SculptureStage = {
  resize: (w:number,h:number)=>void;
  setShot: (v:Shot)=>void;
  setLighting: (v:Lighting)=>void;
  setPlaying: (v:boolean)=>void;
  setSpeed: (v:number)=>void;
  reset: ()=>void;
  dispose: ()=>void;
};

type ReadyDetails = {
  meshes:number;
  triangles:number;
  bones:number;
  clips:number;
  clipName:string;
};
type Callbacks = {
  ready:(details:ReadyDetails)=>void;
  failed:(reason:string)=>void;
  progress:(value:number)=>void;
};
const TAU=Math.PI*2;
function mesh(parent:THREE.Object3D,g:THREE.BufferGeometry,m:THREE.Material,pos:[number,number,number]=[0,0,0]){
  const object=new THREE.Mesh(g,m);
  object.position.set(...pos);
  parent.add(object);
  return object;
}
function line(parent:THREE.Object3D,a:THREE.Vector3,b:THREE.Vector3,mat:THREE.Material,thick:number) {
  const length=a.distanceTo(b);
  const geometry=new THREE.CylinderGeometry(thick,thick,length,8);
  const ob=mesh(parent,geometry,mat);
  ob.position.copy(a).add(b).multiplyScalar(.5);
  ob.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());
  return ob;
}
function haloTexture(){
  const canvas=document.createElement("canvas");
  canvas.width=canvas.height=128;
  const ctx=canvas.getContext("2d");
  if(!ctx)return null;
  const gradient=ctx.createRadialGradient(64,64,1,64,64,64);
  gradient.addColorStop(0,"rgba(207,249,255,0.9)");
  gradient.addColorStop(.12,"rgba(27,197,255,0.82)");
  gradient.addColorStop(.28,"rgba(28,170,255,0.35)");
  gradient.addColorStop(.60,"rgba(10,120,255,0.08)");
  gradient.addColorStop(1,"rgba(0,50,120,0)");
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const map=new THREE.CanvasTexture(canvas);
  map.colorSpace=THREE.SRGBColorSpace;
  return map;
}
function createChamber(scene:THREE.Scene){
  const environment=new THREE.Group();
  scene.add(environment);
  // The original Obsidian exhibit kept a detailed black-metal plinth.
  // Remove its architectural backdrop and vertical walls entirely: visitors
  // must be able to orbit 360° without a wall appearing in front of Octave.
  const graphite=new THREE.MeshStandardMaterial({
    color:0x101a23,metalness:.72,roughness:.32,
  });
  const brushed=new THREE.MeshStandardMaterial({
    color:0x273a45,metalness:.83,roughness:.21,
  });
  const gold=new THREE.MeshStandardMaterial({
    color:0x8c5c2f,metalness:.81,roughness:.25,
  });
  const blue=new THREE.MeshBasicMaterial({color:0x37d8ff,toneMapped:false});
  const dim=new THREE.MeshBasicMaterial({color:0x335769,transparent:true,opacity:.48});
  const floor=mesh(environment,new THREE.PlaneGeometry(170,170),
    new THREE.MeshStandardMaterial({color:0x090f16,roughness:.77,metalness:.08}));
  floor.rotation.x=-Math.PI/2;
  floor.position.y=-.11;
  const base=mesh(environment,
    new THREE.CylinderGeometry(3.52,3.68,.34,120),graphite,[0,.29,0]);
  base.receiveShadow=true;
  mesh(environment,new THREE.CylinderGeometry(3.42,3.43,.07,120),brushed,[0,.49,0]);
  mesh(environment,new THREE.CylinderGeometry(3.06,3.2,.01,120),
    graphite,[0,.532,0]);
  const rings:THREE.Mesh[]=[];
  for(const [radius,tube,height,material] of [
    [3.40,.031,.537,blue],[3.15,.014,.548,blue],
    [2.92,.009,.551,dim],[3.59,.021,.37,gold],
  ] as const){
    const o=mesh(environment,new THREE.TorusGeometry(radius,tube,9,180),
      material,[0,height,0]);
    o.rotation.x=Math.PI/2;
    rings.push(o);
  }
  for(let i=0;i<72;i++){
    const a=i*TAU/72;
    const inner=i%6===0?3.01:3.12;
    line(environment,
      new THREE.Vector3(Math.cos(a)*inner,.552,Math.sin(a)*inner),
      new THREE.Vector3(Math.cos(a)*(inner+(i%6===0?.105:.042)),
        .552,Math.sin(a)*(inner+(i%6===0?.105:.042))),
      i%6===0?blue:gold,i%6===0?.012:.006);
  }
  const warm=new THREE.SpotLight(0xff9c56,175,30,.67,.66,1.15);
  warm.position.set(-5.8,8.1,4.6);
  warm.target.position.set(0,2.6,0);
  scene.add(warm,warm.target);
  const cool=new THREE.SpotLight(0x6fd9ff,145,31,.70,.7,1.2);
  cool.position.set(5.2,6.7,5.1);
  cool.target.position.set(0,2.65,0);
  scene.add(cool,cool.target);
  const top=new THREE.SpotLight(0xffffff,75,23,.58,.64,1.2);
  top.position.set(0,8.7,2.8);
  top.target.position.set(0,2.6,0);
  scene.add(top,top.target);
  const fill=new THREE.DirectionalLight(0x76a4d4,1.4);
  fill.position.set(-3.6,4.5,-3.5);
  scene.add(fill);
  const ambient=new THREE.HemisphereLight(0xaad4ff,0x111821,1.15);
  scene.add(ambient);
  return {environment,rings,warm,cool,top,ambient,fill};
}
export function createOctaveSculptureStage(
  canvas:HTMLCanvasElement,cb:Callbacks,
):SculptureStage {
  let disposed=false;
  const mobile=window.matchMedia("(max-width: 680px)").matches;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:true,powerPreference:"high-performance"});
  const gl=renderer.getContext();
  const dbg=gl.getExtension("WEBGL_debug_renderer_info");
  const gpu=String(dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));
  const software=/swiftshader|llvmpipe|software/i.test(gpu);
  renderer.setPixelRatio(software?.85:Math.min(window.devicePixelRatio||1,mobile?1.25:1.7));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.01;
  renderer.setClearColor(0x070e15,1);
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x090f16);
  scene.fog=new THREE.FogExp2(0x0a141e,.0125);
  const camera=new THREE.PerspectiveCamera(mobile?42:38,1,.1,90);
  const target=new THREE.Vector3(0,2.48,0);
  const defaultDistance=mobile?14.8:10.6;
  camera.position.set(mobile?.1:2.85,mobile?3.0:3.38,defaultDistance);
  const controls=new OrbitControls(camera,canvas);
  controls.target.copy(target);
  controls.enableDamping=true;
  controls.dampingFactor=.052;
  controls.enablePan=false;
  controls.rotateSpeed=.62;
  controls.zoomSpeed=.8;
  controls.minDistance=mobile?7.4:6.4;
  controls.maxDistance=20;
  controls.maxPolarAngle=1.49;
  controls.minPolarAngle=.32;
  controls.touches.ONE=THREE.TOUCH.ROTATE;
  controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;
  controls.update();

  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment();
  const reflection=pmrem.fromScene(room,.045);
  scene.environment=reflection.texture;
  room.dispose();
  const chamber=createChamber(scene);
  // No expensive extra postprocessing pass: the modeled optics and
  // additive cyan halo are genuine real-time scene elements.
  let specimen:THREE.Group|null=null;
  let mixer:THREE.AnimationMixer|null=null;
  let action:THREE.AnimationAction|null=null;
  const glow=haloTexture();
  const opticGlows:THREE.Sprite[]=[];
  const spectrumMaterials=new Map<number,THREE.MeshBasicMaterial>();
  let lastSpectrumTick=-1;
  const SPECTRUM_GROUPS=16;
  // Every sucker has a skinned luminous surface. Only 16 shared material
  // groups are animated, avoiding hundreds of draw calls or point lights.
  // The different phases create intermittent traveling flashes, not a
  // single synchronized on/off blink.
  function updateSpectrum(t:number){
    const tick=Math.floor(t*26);
    if(tick===lastSpectrumTick)return;
    lastSpectrumTick=tick;
    for(const [group,mat] of spectrumMaterials){
      const hue=((group/SPECTRUM_GROUPS+t*.35+
        .026*Math.sin(t*.8+group*.83))%1+1)%1;
      const phase=t*(4.15+(group%3)*.42)+group*2.399963;
      const burst=Math.pow(.5+.5*Math.sin(phase),2.2);
      // A substantial luminous floor keeps *every* cup colorful, even
      // between the sharper bursts. Rainbow hue rotates every ~2.9s.
      const energy=.26+.74*burst;
      mat.color.setHSL(hue,1,.39+.25*energy);
      mat.opacity=.57+.43*energy;
    }
  }
  let playing=!reduced;
  let speed=1;
  let raf=0, prev=performance.now();
  let motionTime=0;
  // Deterministic still-frame QA allows visual checks without sustained
  // software WebGL rendering. Normal visitors see animated 3D.
  const params=new URLSearchParams(window.location.search);
  const stillCapture=params.get("still")==="1";
  // Compare the same geometry at exact color timestamps in automated QA.
  const rawSpectrum=Number(params.get("spectrumAt")??0);
  const spectrumFrame=Number.isFinite(rawSpectrum)?Math.max(0,Math.min(30,rawSpectrum)):0;
  const minFrame=software?62:mobile?28:19;

  let cameraTarget:THREE.Vector3|null=null;

  const loader=new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load("/lab/octave-sculpture/octave-obsidian.glb",(gltf)=>{
    if(disposed)return;
    const model=gltf.scene;
    // GLB from Blender uses Y-up coordinates, original Z-up converted.
    specimen=model;
    specimen.name="Octave — Obsidian mechanical organism";
    specimen.position.y=.55;
    specimen.scale.setScalar(1);
    scene.add(specimen);
    let meshes=0,triangles=0,bones=0;
    specimen.traverse(o=>{
      if(o instanceof THREE.Bone)bones++;
      if(o instanceof THREE.Mesh){
        meshes++;
        const g=o.geometry;
        triangles+=g.index?g.index.count/3:g.getAttribute("position").count/3;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        const brightMaterials:THREE.Material[]=[];
        for(const m of mats){
          const match=/^SPECTRUM CUP (\d{2})/.exec(m.name);
          if(match){
            const group=Number(match[1]);
            let glowMat=spectrumMaterials.get(group);
            if(!glowMat){
              // Use genuinely unlit emission, NOT a heavily overexposed
              // metallic PBR material. PBR intensity previously washed
              // the entire rainbow white under the gallery spotlights.
              glowMat=new THREE.MeshBasicMaterial({
                name:m.name,color:0xffffff,
                toneMapped:false,transparent:true,opacity:.94,
                blending:THREE.AdditiveBlending,
                depthTest:true,depthWrite:false,
                side:THREE.DoubleSide,
              });
              spectrumMaterials.set(group,glowMat);
            }
            brightMaterials.push(glowMat);
          }else{
            if(m instanceof THREE.MeshStandardMaterial){
              m.envMapIntensity=m.metalness>.5?.70:.62;
              m.needsUpdate=true;
            }
            brightMaterials.push(m);
          }
        }
        o.material=Array.isArray(o.material)?brightMaterials:brightMaterials[0];
      }
    });
    if(spectrumMaterials.size!==SPECTRUM_GROUPS){
      console.warn("OCTAVE palette incomplete",spectrumMaterials.size,
        "of",SPECTRUM_GROUPS,"expected color groups");
    }
    updateSpectrum(stillCapture?spectrumFrame:0);
    const clip=gltf.animations[0];
    if(clip){
      mixer=new THREE.AnimationMixer(specimen);
      action=mixer.clipAction(clip);
      action.loop=THREE.LoopRepeat;
      action.play();
    }
    if(glow){
      for(const x of [-.56,.56]){
        const sp=new THREE.Sprite(new THREE.SpriteMaterial({
          map:glow,color:0x63dfff,blending:THREE.AdditiveBlending,
          depthWrite:false,transparent:true,opacity:.68,
          sizeAttenuation:true,
        }));
        sp.position.set(x,2.66,1.26);
        sp.scale.set(.76,.76,1);
        specimen.add(sp);opticGlows.push(sp);
      }
    }
    cb.ready({meshes,triangles:Math.round(triangles),bones,clips:gltf.animations.length,
      clipName:clip?.name??"No embedded animation"});
  },progress=>{
    if(progress.total>0)cb.progress(Math.round(progress.loaded/progress.total*100));
  },err=>{
    console.error("Octave 3D asset failed",err);
    cb.failed("The 3D sculpture could not be loaded.");
  });

  const skyBlue=new THREE.Color(0x6fd9ff);
  const whiteBlue=new THREE.Color(0xffffff);
  const orange=new THREE.Color(0xff9c56);
  const inspectionColor=new THREE.Color(0xffe2b4);
  function frame(now:number){
    if(disposed)return;
    if(now-prev<minFrame){raf=requestAnimationFrame(frame);return;}
    const dt=Math.min(.05,Math.max(0,(now-prev)/1000));prev=now;
    if(playing){
      motionTime+=dt*speed;
      if(mixer)mixer.update(dt*speed);
    }
    updateSpectrum(stillCapture?spectrumFrame:motionTime);
    if(specimen){
      // Head and entire chassis breathe subtly while the GLB armature
      // independently deforms all eight skinned tentacles.
      specimen.position.y=.55+(playing?Math.sin(motionTime*1.28)*.024:0);
    }
    for(const glowSprite of opticGlows){
      (glowSprite.material as THREE.SpriteMaterial).opacity=.59+
        (playing?.12*Math.sin(motionTime*2.8):0);
    }
    for(const ring of chamber.rings.slice(0,2)){
      const mat=ring.material as THREE.MeshBasicMaterial;
      if(playing)mat.color.setHSL(.51+.012*Math.sin(motionTime*.52),1,.63);
    }
    if(cameraTarget){
      camera.position.lerp(cameraTarget,1-Math.exp(-dt*4.5));
      if(camera.position.distanceTo(cameraTarget)<.012)cameraTarget=null;
    }
    controls.update();
    renderer.render(scene,camera);
    if(!stillCapture||!specimen)raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  const shots:Record<Shot,[number,number,number]>={
    hero:mobile?[.1,3.0,14.8]:[2.85,3.38,10.6],
    profile:[10.4,3.8,3.8],
    detail:[1.7,3.26,6.9],
  };
  function resize(w:number,h:number){
    const width=Math.max(1,Math.round(w)),height=Math.max(1,Math.round(h));
    camera.aspect=width/height;camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
  }
  function setShot(v:Shot){
    const vals=shots[v];
    cameraTarget=new THREE.Vector3(...vals);
  }
  function setLighting(value:Lighting){
    const ins=value==="inspection";
    chamber.warm.color.copy(ins?inspectionColor:orange);
    chamber.cool.color.copy(ins?whiteBlue:skyBlue);
    chamber.warm.intensity=ins?170:175;
    chamber.cool.intensity=ins?160:145;
    chamber.top.intensity=ins?180:75;
    chamber.ambient.intensity=ins?2.3:1.15;
    scene.background=new THREE.Color(ins?0x111924:0x090f16);
  }
  function dispose(){
    disposed=true;
    cancelAnimationFrame(raf);
    controls.dispose();
    mixer?.stopAllAction();
    pmrem.dispose();reflection.dispose();
    glow?.dispose();
    scene.traverse(o=>{
      if(o instanceof THREE.Mesh||o instanceof THREE.Line||o instanceof THREE.Points){
        o.geometry.dispose();
        const arr=Array.isArray(o.material)?o.material:[o.material];
        for(const m of arr)m.dispose();
      }
    });
    for(const sprite of opticGlows)(sprite.material as THREE.SpriteMaterial).dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }
  return {
    resize,setShot,setLighting,
    setPlaying(v){playing=v;},
    setSpeed(v){speed=v;},
    reset(){
      playing=!reduced; speed=1;
      setLighting("cinematic");setShot("hero");
    },
    dispose,
  };
}

