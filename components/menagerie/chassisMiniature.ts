"use client";

import * as THREE from "three";

/** An architectural miniature of the EXISTING porcelain-and-orange lab creature.
 * The actual extend, disassemble, and X-ray system remains KineticOctopus,
 * opened in its dedicated exhibit route. This miniature is only a locator.
 */
export function createChassisMiniature():{
  group:THREE.Group;
  update:(t:number)=>void;
} {
  const group=new THREE.Group();
  group.name="OCTAVE / Experimental Chassis miniature";
  const white=new THREE.MeshPhysicalMaterial({
    color:0xf0f4f1,metalness:.43,roughness:.22,clearcoat:.7
  });
  const graphite=new THREE.MeshStandardMaterial({
    color:0x233540,metalness:.85,roughness:.25
  });
  const bronze=new THREE.MeshStandardMaterial({
    color:0xb99561,metalness:.87,roughness:.22
  });
  // A deliberately vivid rainbow of genuine suction details and optics.
  // Keep the original mechanically articulated locator geometry intact.
  const colors=Array.from({length:16},(_,i)=>{
    const mat=new THREE.MeshBasicMaterial({toneMapped:false,color:0xffffff});
    mat.color.setHSL(i/16,1,.53);
    return mat;
  });
  const joints:THREE.Group[]=[];
  const add=(geo:THREE.BufferGeometry,material:THREE.Material,pos:[number,number,number],parent:THREE.Object3D=group)=>{
    const mesh=new THREE.Mesh(geo,material);
    mesh.position.set(...pos);
    parent.add(mesh);
    return mesh;
  };
  add(new THREE.SphereGeometry(.68,36,26),white,[0,1.74,0]).scale.set(1,1.28,.95);
  add(new THREE.SphereGeometry(.34,26,18),graphite,[0,1.12,0]);
  add(new THREE.TorusGeometry(.25,.053,12,46),bronze,[0,1.66,.62]);
  add(new THREE.SphereGeometry(.235,26,18),colors[2],[0,1.66,.72]);
  add(new THREE.SphereGeometry(.105,16,12),graphite,[0,1.69,.92]);
  for(let arm=0;arm<8;arm++){
    const theta=(arm+.35)*Math.PI/4;
    const root=new THREE.Group();
    root.position.set(Math.cos(theta)*.50,1.20,Math.sin(theta)*.50);
    group.add(root);joints.push(root);
    const pts:THREE.Vector3[]=[];
    for(let i=0;i<=24;i++){
      const t=i/24;
      const radius=.15+1.26*t+.28*Math.sin(t*Math.PI);
      const phi=theta+.35*t+Math.sin(t*4.3+arm*.9)*.13;
      pts.push(new THREE.Vector3(
        Math.cos(phi)*radius-Math.cos(theta)*.50,
        -t*.91+.18*Math.sin(t*5.4+arm*.65),
        Math.sin(phi)*radius-Math.sin(theta)*.50,
      ));
    }
    const curve=new THREE.CatmullRomCurve3(pts);
    const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,56,.10,9,false),
      arm%2?graphite:white);
    root.add(tube);
    for(let j=1;j<=11;j++){
      const pos=curve.getPoint(j/12);
      const eye=add(new THREE.SphereGeometry(.046,10,8),colors[(arm*7+j*3)%colors.length],
        [pos.x,pos.y-.055,pos.z],root);
      eye.scale.set(1,.6,1);
    }
  }
  return {
    group,
    update:(t:number)=>{
      group.rotation.y=Math.sin(t*.25)*.075;
      colors.forEach((mat,i)=>{
        const hue=(i/16+t*.32+.013*Math.sin(t+i))%1;
        const pulse=.75+.25*Math.sin(t*4+i*1.4);
        mat.color.setHSL(hue,1,.46+.13*pulse);
      });
      for(let i=0;i<joints.length;i++){
        const arm=joints[i];
        arm.rotation.z=.047*Math.sin(t*1.04+i*.69);
        arm.rotation.y=.035*Math.cos(t*.79+i*.73);
      }
    }
  };
}

