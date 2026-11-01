"use client";

import * as THREE from "three";
import type { ExhibitId } from "./exhibits";

/**
 * High-contrast animated colors directly on REAL 3D specimen geometry.
 * Material sharing is per species and phase group, not a point light per
 * eye, sucker, filament, wing vein, or joint. The creatures remain rigged.
 */
const BASE_HUE:Record<ExhibitId,number>={
  "octave-spectrum":.54,
  "octave-chassis":.08,
  aether:.55,
  medusa:.82,
  atlas:.07,
  frog:.38,
};
const GROUPS=16;
type Channel={
  material:THREE.MeshBasicMaterial;
  id:ExhibitId;
  group:number;
};
function hash(str:string){
  let result=2166136261;
  for(let i=0;i<str.length;i++){
    result^=str.charCodeAt(i);
    result=Math.imul(result,16777619);
  }
  return result>>>0;
}
function isLightDetail(materialName:string,objectName:string){
  const mat=materialName.toLowerCase(),obj=objectName.toLowerCase();
  if(mat.startsWith("spectrum cup"))return true;
  // The two large Obsidian Octave optical irises were previously fixed cyan;
  // they now share the full vivid changing color language of its cups.
  if(mat.includes("electric cyan optics")||mat.includes("photo-electric inlay"))return true;
  if(mat.includes("energy")||mat.includes("luminous")||mat.includes("light |"))return true;
  return /(iris glow|illuminated|light artery|circuit|conductivity filament|wing optic|glow)/.test(obj) &&
    !/(obsidian|graphite|carbon|recessed)/.test(mat);
}
export function createExhibitSpectrum(){
  const channels:Channel[]=[];
  const palettes=new Map<string,THREE.MeshBasicMaterial>();
  let lastTick=-1;

  function makeMaterial(id:ExhibitId,group:number,isSuction:boolean){
    const key=id+"|"+group+"|"+(isSuction?"s":"c");
    const existing=palettes.get(key);
    if(existing)return existing;
    const material=new THREE.MeshBasicMaterial({
      name:"Menagerie spectrum "+key,
      color:0xffffff,
      side:THREE.DoubleSide,
      toneMapped:false,
      depthWrite:!isSuction,
      transparent:isSuction,
      opacity:1,
    });
    palettes.set(key,material);
    channels.push({material,id,group});
    return material;
  }

  function attach(root:THREE.Object3D,id:ExhibitId){
    let discovered=0;
    root.traverse(obj=>{
      if(!(obj instanceof THREE.Mesh))return;
      const original=Array.isArray(obj.material)?obj.material:[obj.material];
      let didReplace=false;
      const mapped=original.map(m=>{
        const match=/^SPECTRUM CUP (\d{2})/.exec(m.name);
        const suction=!!match;
        if(isLightDetail(m.name,obj.name)){
          // Each eye, seam, node and filament receives a distinct shared
          // colored surface; their geometry and rig remain untouched.
          const phase=suction?Number(match?.[1]??0):
            hash(obj.name+"|"+m.name)%GROUPS;
          didReplace=true;discovered++;
          return makeMaterial(id,phase,suction);
        }
        if(m instanceof THREE.MeshStandardMaterial){
          // Dark graphite retains definition under the bright gallery.
          m.envMapIntensity=m.metalness>.5?.72:.57;
          m.needsUpdate=true;
        }
        return m;
      });
      if(didReplace)obj.material=Array.isArray(obj.material)?mapped:mapped[0];
    });
    lastTick=-1;update(0);
    return discovered;
  }

  function attachCustom(material:THREE.MeshBasicMaterial,id:ExhibitId,group:number){
    channels.push({material,id,group:group%GROUPS});
    lastTick=-1;update(0);
  }

  function update(t:number){
    const tick=Math.floor(t*26);
    if(tick===lastTick)return;
    lastTick=tick;
    for(const {material,id,group} of channels){
      // Full-spectrum hue motion plus offset waves makes eyes and mechanical
      // details extremely visible even when the gallery wall is pure white.
      const primary=BASE_HUE[id];
      const hue=(primary+(group/GROUPS)*.82+t*.31+
        .018*Math.sin(t*1.1+group*.83)+1)%1;
      const phase=t*(4.2+(group%3)*.46)+group*2.399963;
      const flash=Math.pow(.5+.5*Math.sin(phase),1.55);
      const floor=.35+.65*flash;
      material.color.setHSL(hue,1,.43+.16*floor);
      material.opacity=.84+.16*floor;
    }
  }

  function dispose(){
    palettes.forEach(material=>material.dispose());
    palettes.clear();channels.length=0;
  }
  update(0);
  return {attach,attachCustom,update,dispose,count:()=>channels.length};
}

