"use client";

import * as THREE from "three";

/**
 * Two real, contrasting materials/light environments for the same 3D gallery.
 *
 * Study = daylight-white architecture and neutral illumination.
 * Cinematic = near-black ceramic tiles and focused cool/warm specimen lights.
 *
 * The glossy black tile surface uses small original procedural textures, not
 * external images. Everything remains real 3D and works without postprocessing.
 */
export type GalleryLightMode="study"|"cinematic";

type LightSources={
  hemi:THREE.HemisphereLight;
  ambient:THREE.AmbientLight;
  key:THREE.DirectionalLight;
  rear:THREE.DirectionalLight;
  studio:THREE.SpotLight;
  highlight:THREE.SpotLight;
};
type Palette={
  white:THREE.MeshStandardMaterial;
  shelf:THREE.MeshStandardMaterial;
  graphite:THREE.MeshStandardMaterial;
  trim:THREE.MeshStandardMaterial;
  chrome:THREE.MeshStandardMaterial;
  bronze:THREE.MeshStandardMaterial;
  floor:THREE.MeshStandardMaterial;
};
type Inputs={
  scene:THREE.Scene;
  renderer:THREE.WebGLRenderer;
  palette:Palette;
  lights:LightSources;
  tileSurfaces:THREE.MeshPhysicalMaterial[];
  pools:THREE.MeshBasicMaterial[];
};

export function createBlackTileTexture(
  repeatX:number,repeatY:number,
):THREE.CanvasTexture{
  const canvas=document.createElement("canvas");
  canvas.width=canvas.height=256;
  const cx=canvas.getContext("2d");
  if(!cx)throw new Error("Tile texture canvas unavailable");
  const gradient=cx.createLinearGradient(0,0,256,256);
  gradient.addColorStop(0,"#17232e");
  gradient.addColorStop(.18,"#0b141e");
  gradient.addColorStop(.58,"#060d16");
  gradient.addColorStop(1,"#101922");
  cx.fillStyle=gradient;
  cx.fillRect(0,0,256,256);
  // Thin, crisp grout strokes, a nod to gloss-black tiled civic interiors.
  cx.strokeStyle="#31414d";
  cx.lineWidth=4;
  cx.strokeRect(2,2,252,252);
  cx.strokeStyle="#192c39";
  cx.lineWidth=2;
  cx.beginPath();
  cx.moveTo(7,241);cx.lineTo(247,241);
  cx.moveTo(239,6);cx.lineTo(239,247);
  cx.stroke();
  // Light reflected near the top edge of each lacquered tile, not neon lines.
  const glare=cx.createLinearGradient(0,0,0,53);
  glare.addColorStop(0,"rgba(116,146,169,0.26)");
  glare.addColorStop(.26,"rgba(95,139,165,0.07)");
  glare.addColorStop(1,"rgba(18,30,43,0)");
  cx.fillStyle=glare;cx.fillRect(8,9,238,43);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(repeatX,repeatY);
  texture.anisotropy=4;
  texture.needsUpdate=true;
  return texture;
}

export function createTileMaterial(texture:THREE.Texture){
  return new THREE.MeshPhysicalMaterial({
    color:0xffffff,
    map:texture,
    metalness:.35,roughness:.15,
    clearcoat:1.0,clearcoatRoughness:.07,
    transparent:true,opacity:0,depthWrite:false,
    side:THREE.DoubleSide,
    envMapIntensity:.95,
  });
}
export function createLightPoolTexture(){
  const canvas=document.createElement("canvas");
  canvas.width=canvas.height=128;
  const cx=canvas.getContext("2d");
  if(!cx)throw new Error("Light pool canvas unavailable");
  const g=cx.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,"rgba(255,255,255,.65)");
  g.addColorStop(.18,"rgba(255,255,255,.23)");
  g.addColorStop(.5,"rgba(255,255,255,.045)");
  g.addColorStop(1,"rgba(255,255,255,0)");
  cx.fillStyle=g;cx.fillRect(0,0,128,128);
  const map=new THREE.CanvasTexture(canvas);
  map.colorSpace=THREE.SRGBColorSpace;
  return map;
}

export function createGalleryLighting(inputs:Inputs){
  const {scene,renderer,palette,lights,tileSurfaces,pools}=inputs;
  let mode:GalleryLightMode="study";
  let blend=0,target=0;
  const whiteBackground=new THREE.Color(0xf9faf8);
  const darkBackground=new THREE.Color(0x04080e);
  const background=new THREE.Color().copy(whiteBackground);
  const initial=new Map<THREE.MeshStandardMaterial,THREE.Color>();
  const dark=new Map<THREE.MeshStandardMaterial,THREE.Color>();
  function colors(material:THREE.MeshStandardMaterial,hex:number){
    initial.set(material,material.color.clone());
    dark.set(material,new THREE.Color(hex));
  }
  colors(palette.white,0x080e16);
  colors(palette.shelf,0x0c141e);
  colors(palette.graphite,0x131d29);
  colors(palette.trim,0x101923);
  colors(palette.chrome,0x435260);
  colors(palette.bronze,0x977047);
  colors(palette.floor,0x060d15);
  const tempColor=new THREE.Color();
  const studioDay=new THREE.Color(0xffffff);
  const studioNight=new THREE.Color(0xf3f5ff);
  const highlightDay=new THREE.Color(0xa8cfff);
  const highlightNight=new THREE.Color(0x46c9ff);

  function render(){
    background.copy(whiteBackground).lerp(darkBackground,blend);
    scene.background=background;
    for(const [material,from] of initial){
      material.color.copy(from).lerp(dark.get(material)!,blend);
    }
    palette.floor.metalness=.13+blend*.38;
    palette.floor.roughness=.68-blend*.52;
    palette.white.roughness=.91-blend*.55;
    palette.shelf.roughness=.29-blend*.13;
    for(const surface of tileSurfaces){
      surface.opacity=blend;
    }
    for(const pool of pools){
      pool.opacity=blend*.55;
    }
    // Darkening the architecture does not darken the specimen. Focused,
    // brighter studio lights replace broad white daylight in this mode.
    lights.hemi.intensity=2.7-blend*2.1;
    lights.ambient.intensity=.42-blend*.25;
    lights.key.intensity=2.3-blend*1.72;
    lights.rear.intensity=1.25+blend*.38;
    lights.studio.intensity=145+blend*135;
    lights.highlight.intensity=75+blend*115;
    lights.studio.color.copy(tempColor.copy(studioDay).lerp(studioNight,blend));
    lights.highlight.color.copy(tempColor.copy(highlightDay).lerp(highlightNight,blend));
    renderer.toneMappingExposure=.95-blend*.09;
  }

  function setMode(next:GalleryLightMode,immediate=false){
    mode=next;
    target=next==="study"?0:1;
    if(immediate){blend=target;render();}
  }
  function update(deltaSeconds:number){
    if(Math.abs(target-blend)<.0007){
      if(blend!==target){blend=target;render();}
      return;
    }
    // Crossfade the entire architectural and lighting environment in ~1s.
    const f=1-Math.exp(-Math.min(.18,Math.max(0,deltaSeconds))*4.5);
    blend+=(target-blend)*f;
    render();
  }
  render();
  return {
    setMode,update,
    current:()=>mode,
    blend:()=>blend,
  };
}



/**
 * A matching pair of lighting environments for the four standalone species
 * viewers. No physical walls are introduced: those were explicitly removed
 * after visitor QA found they blocked 360-degree specimen inspection.
 */
export function createInspectionLighting(opts:{
  scene:THREE.Scene;
  renderer:THREE.WebGLRenderer;
  floor:THREE.MeshStandardMaterial;
  pedestal:THREE.MeshStandardMaterial;
  underplate:THREE.MeshStandardMaterial;
  tiled:THREE.MeshBasicMaterial|THREE.MeshPhysicalMaterial;
  warm:THREE.SpotLight;
  cool:THREE.SpotLight;
  top:THREE.SpotLight;
  hemi:THREE.HemisphereLight;
}){
  let blend=0,target=0;
  const background=new THREE.Color();
  const day=new THREE.Color(0xf9faf8);
  const night=new THREE.Color(0x03070d);
  const whiteFloor=opts.floor.color.clone();
  const darkFloor=new THREE.Color(0x071019);
  const whitePedestal=opts.pedestal.color.clone();
  const darkPedestal=new THREE.Color(0x1b2732);
  const whiteUnderplate=opts.underplate.color.clone();
  const darkUnderplate=new THREE.Color(0x0a131e);
  function updateVisual(){
    opts.scene.background=background.copy(day).lerp(night,blend);
    opts.floor.color.copy(whiteFloor).lerp(darkFloor,blend);
    opts.floor.roughness=.72-blend*.55;
    opts.floor.metalness=.12+blend*.31;
    opts.pedestal.color.copy(whitePedestal).lerp(darkPedestal,blend);
    opts.underplate.color.copy(whiteUnderplate).lerp(darkUnderplate,blend);
    opts.tiled.opacity=blend;
    opts.warm.intensity=116+blend*110;
    opts.cool.intensity=118+blend*105;
    opts.top.intensity=58+blend*90;
    opts.hemi.intensity=2.0-blend*1.40;
    opts.renderer.toneMappingExposure=.98-blend*.075;
  }
  function setMode(mode:GalleryLightMode,immediate=false){
    target=mode==="cinematic"?1:0;
    if(immediate){blend=target;updateVisual();}
  }
  function update(dt:number){
    if(Math.abs(target-blend)<.0007){
      if(target!==blend){blend=target;updateVisual();}
      return;
    }
    blend+=(target-blend)*(1-Math.exp(-Math.min(.16,Math.max(0,dt))*4.5));
    updateVisual();
  }
  updateVisual();
  return {setMode,update,blend:()=>blend};
}

