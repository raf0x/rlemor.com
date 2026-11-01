"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createOctaveSculptureStage, type SculptureStage, type Shot, type Lighting } from "./scene";
import styles from "./OctaveSculpture.module.css";

type Details = {meshes:number;triangles:number;bones:number;clips:number;clipName:string};
const cameraLabels:Record<Shot,string>={hero:"THREE-QUARTER",profile:"PROFILE",detail:"CLOSE-UP"};

export default function OctaveSculpture() {
  const canvas=useRef<HTMLCanvasElement|null>(null);
  const area=useRef<HTMLDivElement|null>(null);
  const stage=useRef<SculptureStage|null>(null);
  const [ready,setReady]=useState(false);
  const [unsupported,setUnsupported]=useState(false);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(0);
  const [details,setDetails]=useState<Details|null>(null);
  const [shot,setShot]=useState<Shot>("hero");
  const [lighting,setLighting]=useState<Lighting>("cinematic");
  const [playing,setPlaying]=useState(true);
  const [speed,setSpeed]=useState(1);

  useEffect(()=>{
    const element=canvas.current;
    const holder=area.current;
    if(!element||!holder)return;
    let alive=true;
    let current:SculptureStage|null=null;
    let observer:ResizeObserver|null=null;

    void Promise.resolve().then(()=>{
      if(!alive)return;
      try {
        current=createOctaveSculptureStage(element,{
          ready(info){
            if(!alive)return;
            setReady(true);setDetails(info);setLoading(100);
          },
          failed(message){if(alive){setUnsupported(true);setError(message);}},
          progress(percent){if(alive)setLoading(percent);},
        });
        stage.current=current;
        const rect=holder.getBoundingClientRect();
        current.resize(rect.width,rect.height);
        observer=new ResizeObserver(()=>{
          const rect=holder.getBoundingClientRect();
          if(rect.width>0&&rect.height>0)current?.resize(rect.width,rect.height);
        });
        observer.observe(holder);
        const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if(reduced)setPlaying(false);
      } catch (err) {
        console.error("Octave sculpture stage failed",err);
        if(alive){setUnsupported(true);setError("This browser could not initialize the 3D gallery.");}
      }
    });
    return ()=>{
      alive=false;
      observer?.disconnect();
      current?.dispose();
      stage.current=null;
    };
  },[]);

  function selectShot(v:Shot){
    setShot(v);stage.current?.setShot(v);
  }
  function togglePlay(){
    const next=!playing;setPlaying(next);stage.current?.setPlaying(next);
  }
  function toggleLight(){
    const next:Lighting=lighting==="cinematic"?"inspection":"cinematic";
    setLighting(next);stage.current?.setLighting(next);
  }
  function selectSpeed(v:number){
    setSpeed(v);stage.current?.setSpeed(v);
  }
  function reset(){
    stage.current?.reset();
    setShot("hero");setLighting("cinematic");
    const reduced=typeof window!=="undefined"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPlaying(!reduced);setSpeed(1);
  }
  return(
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.identity}>
          <span className={styles.mark} aria-hidden="true"><span>O</span><span>8</span></span>
          <div><strong>THE SYNTHETIC MENAGERIE</strong><small>EXHIBITION STUDY / 001</small></div>
        </div>
        <Link className={styles.exit} href="/">RETURN TO RLEMOR.COM <span aria-hidden="true">↗</span></Link>
      </header>

      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>SPECIMEN NO. 01 <span className={styles.eyebrowLine}/> AN ORIGINAL MECHANICAL ORGANISM</p>
          <h1>Meet <em>Octave.</em></h1>
          <p className={styles.subhead}>Black-chrome anatomy. Electric-blue optics. Eight animated tentacles, now alive with vivid rainbow light pulsing through every suction cup.</p>
        </div>
        <p className={styles.footprint}>001 / 004 <span>THE FIRST EXHIBIT</span><span>IN AN UNBUILT MUSEUM</span></p>
      </div>

      <section className={styles.exhibit} aria-label="Octave interactive 3D exhibit">
        <div className={styles.exhibitTop}>
          <span>EXHIBIT 01 / OBSIDIAN</span>
          <span className={styles.live}><span aria-hidden="true"/> {ready?"LIVE SCULPTURE":"PREPARING SCULPTURE"}</span>
        </div>
        <div className={styles.stage} ref={area}>
          <canvas
            ref={canvas}
            role="img"
            aria-label="Interactive 3D sculpture of a glossy black robotic octopus with two glowing cyan eyes and eight metallic tentacles with suction cups. Drag or swipe to orbit. Pinch or scroll to zoom. Use the view buttons below for accessible camera presets."
            className={styles.canvas}
          />
          <div className={styles.cornerLabel} aria-hidden="true">
            <span>OCTAVE / 01</span>
            <span>OBSIDIAN SERIES</span>
          </div>
          <div className={styles.cornerRight} aria-hidden="true">
            3D / MATERIALS / MOTION
          </div>
          {!ready&&!unsupported&&
            <div className={styles.loading} role="status">
              <span className={styles.loader} aria-hidden="true"/>
              <strong>FORMING OCTAVE</strong>
              <span>{loading>0?loading+"% LOADED":"INITIALIZING 3D MODEL"}</span>
            </div>
          }
          {unsupported&&
            <div className={styles.unavailable} role="status">
              <strong>THE SCULPTURE IS UNAVAILABLE</strong>
              <p>{error||"The 3D model could not load."} Try a recent browser with WebGL enabled.</p>
            </div>
          }
          <noscript><div className={styles.unavailable}>Enable JavaScript to explore the 3D sculpture.</div></noscript>
          <div className={styles.stageHint} aria-hidden="true">DRAG TO ORBIT <span>·</span> PINCH OR SCROLL TO ZOOM</div>
        </div>
        <div className={styles.toolbar} aria-label="Exhibit controls">
          <div className={styles.viewGroup} role="group" aria-label="Camera view">
            {(["hero","profile","detail"] as const).map(key=><button type="button"
              key={key} disabled={!ready} aria-pressed={shot===key}
              className={shot===key?styles.viewActive:styles.view}
              onClick={()=>selectShot(key)}
            >{cameraLabels[key]}</button>)}
          </div>
          <div className={styles.actionGroup}>
            <button type="button" disabled={!ready} className={styles.option} onClick={togglePlay} aria-pressed={playing}>
              <span className={styles.icon} aria-hidden="true">{playing?"Ⅱ":"▶"}</span>
              {playing?"PAUSE MOTION":"PLAY MOTION"}
            </button>
            <button type="button" disabled={!ready} className={styles.option} onClick={toggleLight} aria-pressed={lighting==="inspection"}>
              <span className={styles.icon} aria-hidden="true">◐</span>
              {lighting==="cinematic"?"STUDIO LIGHT":"CINEMATIC LIGHT"}
            </button>
            <button type="button" disabled={!ready} className={styles.option} onClick={reset}>
              <span className={styles.icon} aria-hidden="true">↺</span> RESET
            </button>
          </div>
        </div>
      </section>

      <div className={styles.afterword}>
        <div className={styles.afterMain}>
          <p className={styles.eyebrow}>THE OBJECT, NOT AN ILLUSTRATION</p>
          <h2>Made to be examined.</h2>
          <p>A genuine three-dimensional sculpture with metallic surfaces, layered optics, and a skeletal rig. Each suction cup has its own modeled light aperture; brilliant colors shift and ripple independently around the arms.</p>
        </div>
        <div className={styles.buildNotes}>
          <div><span>CONSTRUCTION</span><strong>Original Blender geometry</strong></div>
          <div><span>ANIMATION</span><strong>{details?details.clips+" embedded GLB animation"+(details.clips===1?"":"s"):"Skeletal motion"}</strong></div>
          <div><span>ARTICULATION</span><strong>{details?details.bones+" actual bones":"Eight independently rigged arms"}</strong></div>
          <div><span>EXAMINATION</span><strong>Full orbit / close-up / light study</strong></div>
          <div className={styles.speeds}>
            <span>MOTION RATE</span>
            <div role="group" aria-label="Animation playback speed">
              {[.5,1,1.5].map(value=><button type="button" key={value} disabled={!ready}
                aria-pressed={speed===value} onClick={()=>selectSpeed(value)}
              >{value.toFixed(1)}×</button>)}
            </div>
          </div>
          <a className={styles.download} href="/lab/octave-sculpture/octave-obsidian.glb" download="octave-obsidian.glb">
            DOWNLOAD THE ANIMATED 3D MODEL <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>THE SYNTHETIC MENAGERIE <i>/</i> ORIGINAL 3D STUDY</span>
        <span>A PRIVATE PROTOTYPE. NOTHING ON THE MAIN WEBSITE HAS CHANGED.</span>
        <Link href="/">RAFAEL LEMOR ↗</Link>
      </footer>
    </main>
  );
}

