"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {createCreatureStage,type CreatureStage,type CreatureName} from "./CreatureStage";
import {type Exhibit} from "./exhibits";
import styles from "./CreatureViewer.module.css";

const actions:Record<CreatureName,{label:string;note:string;name:string}> = {
  aether:{label:"GLIDE",note:"Trigger an expressive wing and tail movement.",name:"The Manta"},
  medusa:{label:"PULSE",note:"Watch the glass bell and filaments expand.",name:"The Jellyfish"},
  atlas:{label:"UNFOLD",note:"See the armored shell and flight mechanisms move.",name:"The Scarab"},
  frog:{label:"HOP",note:"Wake the creature with a playful spring.",name:"The Amphibian"},
};

export default function CreatureViewer({exhibit}:{exhibit:Exhibit}){
 const id=exhibit.id as CreatureName;
 const canvas=useRef<HTMLCanvasElement>(null);
 const holder=useRef<HTMLDivElement>(null);
 const stage=useRef<CreatureStage|null>(null);
 const [loaded,setLoaded]=useState(false);
 const [error,setError]=useState("");
 const [playing,setPlaying]=useState(true);
 const [lighting,setLighting]=useState<"cinematic"|"study">("study");
 useEffect(()=>{
  const node=canvas.current,area=holder.current;
  if(!node||!area)return;
  let alive=true;let instance:CreatureStage|null=null;
  let ro:ResizeObserver|null=null;
  // React's development Strict Mode runs effect setup + cleanup twice.
  // Postpone WebGL allocation until after that probe, avoiding
  // forceContextLoss() on a canvas that is immediately reused.
  void Promise.resolve().then(()=>{
   if(!alive)return;
   try{
    instance=createCreatureStage(node,id,
     ()=>{if(alive)setLoaded(true)},
     message=>{if(alive)setError(message)}
    );
    stage.current=instance;
    ro=new ResizeObserver(()=>{
     const b=area.getBoundingClientRect();
     if(b.width&&b.height)instance?.resize(b.width,b.height);
    });
    ro.observe(area);
    const b=area.getBoundingClientRect();
    instance.resize(b.width,b.height);
    setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
   }catch(e){
    console.error("Creature gallery unavailable",e);
    if(alive)setError("This device could not initialize WebGL.");
   }
  });
  return()=>{alive=false;ro?.disconnect();instance?.dispose();stage.current=null;};
 },[id]);
 const behavior=actions[id];
 function reset(){
  stage.current?.reset();
  setLighting("study");
  setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
 }
 return (
  <main className={styles.page} data-lighting={lighting}>
   <header className={styles.header}>
    <Link href="/lab/menagerie-preview-76cf184b" className={styles.back}>← MUSEUM COLLECTION</Link>
    <span>THE SYNTHETIC MENAGERIE <span className={styles.muted}> / EXHIBIT {exhibit.number}</span></span>
   </header>
   <section className={styles.intro}>
    <div>
     <p className={styles.overline}>{exhibit.classification} / ORIGINAL ANIMATED SCULPTURE</p>
     <h1>{exhibit.name}<em>.</em></h1>
     <p>{exhibit.short}</p>
    </div>
    <div className={styles.label}><span>SPECIMEN {exhibit.number}</span><strong>{behavior.name}</strong><span>{exhibit.wing}</span></div>
   </section>
   <section className={styles.exhibit} aria-label={"Interactive animated 3D "+exhibit.name}>
    <div className={styles.stage} ref={holder}>
     <canvas ref={canvas} className={styles.canvas} role="img"
       aria-label={"Interactive 3D "+exhibit.name+". Drag or swipe to orbit and pinch or scroll to zoom. Buttons below control motion, lighting and behavior."}/>
     <span className={styles.stamp}>{exhibit.name.toUpperCase()} / {exhibit.number}</span>
     {!loaded&&!error&&<div className={styles.load} role="status">PREPARING SPECIMEN...</div>}
     {error&&<div className={styles.load} role="status">{error}</div>}
     <noscript><div className={styles.load}>Enable JavaScript and WebGL to see the animated specimen.</div></noscript>
     <span className={styles.hint}>DRAG TO ORBIT · SCROLL OR PINCH TO ZOOM</span>
    </div>
    <div className={styles.controls}>
     <div className={styles.note}>
      <strong>{behavior.name}</strong><span>{behavior.note}</span>
     </div>
     <div className={styles.buttons}>
      <button type="button" disabled={!loaded} className={styles.primary}
       onClick={()=>{stage.current?.action()}}>
       {behavior.label} <span aria-hidden="true">↗</span></button>
      <button type="button" disabled={!loaded} onClick={()=>{
       stage.current?.play(!playing);setPlaying(v=>!v);
      }}>{playing?"PAUSE":"PLAY"}</button>
      <button type="button" disabled={!loaded} onClick={()=>{
       const next=lighting==="cinematic"?"study":"cinematic";
       stage.current?.light(next);setLighting(next);
      }}>{lighting==="cinematic"?"STUDY LIGHT":"CINEMATIC LIGHT"}</button>
      <button type="button" disabled={!loaded} onClick={reset}>RESET ↺</button>
     </div>
    </div>
   </section>
   <footer className={styles.footer}>
    <p>AN ORIGINAL ANIMATED GLB, BUILT FOR THIS MUSEUM. YOU ARE THE VISITOR, NOT THE OPERATOR.</p>
    <Link href="/lab/menagerie-preview-76cf184b">RETURN TO THE MUSEUM ↗</Link>
   </footer>
  </main>
 );
}

