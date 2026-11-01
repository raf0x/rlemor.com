"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EXHIBITS, getExhibit, nextExhibit } from "./exhibits";
import { createMuseumStage, type MuseumStage, type LightMode } from "./MuseumStage";
import styles from "./MenagerieShell.module.css";

type Nav = {
  focus: (index:number|null)=>void;
  next:(direction:1|-1)=>void;
  lighting:(mode:LightMode)=>void;
};

export default function MenagerieShell(){
  const stageRef=useRef<HTMLCanvasElement|null>(null);
  const stageHolder=useRef<HTMLDivElement|null>(null);
  const controlsRef=useRef<Nav|null>(null);
  const [ready,setReady]=useState(false);
  const [unsupported,setUnsupported]=useState(false);
  const [failure,setFailure]=useState("");
  const [active,setActive]=useState<number|null>(null);
  const [lighting,setLighting]=useState<LightMode>("cinematic");
  const [motionReduced,setMotionReduced]=useState(false);

  useEffect(()=>{
    const canvas=stageRef.current,holder=stageHolder.current;
    if(!canvas||!holder)return;
    const cn=canvas;
    let mounted=true;
    let stage:MuseumStage|null=null;
    let observer:ResizeObserver|null=null;
    let finger:{id:number;x:number;y:number}|null=null;
    let current:number|null=null;

    const focus=(index:number|null)=>{
      current=index;
      setActive(index);
      stage?.focus(index);
    };
    controlsRef.current={
      focus,
      next:(direction)=>focus(nextExhibit(current,direction)),
      lighting:(mode)=>{stage?.lighting(mode);setLighting(mode);},
    };

    const onDown=(event:PointerEvent)=>{
      if(event.pointerType==="mouse"&&event.button!==0)return;
      finger={id:event.pointerId,x:event.clientX,y:event.clientY};
    };
    const onUp=(event:PointerEvent)=>{
      if(!finger||event.pointerId!==finger.id)return;
      const moved=Math.hypot(event.clientX-finger.x,event.clientY-finger.y);
      finger=null;
      if(moved>9)return;
      const hit=stage?.pick(event.clientX,event.clientY);
      if(hit!==null&&hit!==undefined)focus(hit);
    };
    const onCancel=()=>{finger=null;};
    const onKey=(event:KeyboardEvent)=>{
      if(event.metaKey||event.ctrlKey||event.altKey)return;
      const target=event.target as HTMLElement|null;
      if(target?.closest("button, input, textarea, select, a, [contenteditable='true']"))return;
      if(event.key==="ArrowRight"){
        event.preventDefault();controlsRef.current?.next(1);
      }else if(event.key==="ArrowLeft"){
        event.preventDefault();controlsRef.current?.next(-1);
      }else if(event.key==="Escape"){
        event.preventDefault();controlsRef.current?.focus(null);
      }else if(/^[1-6]$/.test(event.key)){
        event.preventDefault();controlsRef.current?.focus(Number(event.key)-1);
      }
    };
    cn.addEventListener("pointerdown",onDown);
    cn.addEventListener("pointerup",onUp);
    cn.addEventListener("pointercancel",onCancel);
    window.addEventListener("keydown",onKey);

    // Static HTML is useful without a GPU. Initialize once after React mounts.
    void Promise.resolve().then(()=>{
      if(!mounted)return;
      setMotionReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      try{
        stage=createMuseumStage(cn,{
          onReady(){if(mounted)setReady(true);},
          onFailure(reason){if(mounted){setUnsupported(true);setFailure(reason);}},
        });
        const bounds=holder.getBoundingClientRect();
        stage.resize(bounds.width,bounds.height);
        observer=new ResizeObserver(()=>{
          const bounds=holder.getBoundingClientRect();
          if(bounds.width>0&&bounds.height>0)stage?.resize(bounds.width,bounds.height);
        });
        observer.observe(holder);
      }catch(error){
        console.error("Menagerie gallery initialization failed",error);
        if(mounted){
          setUnsupported(true);
          setFailure("The interactive gallery needs a browser with WebGL enabled.");
        }
      }
    });

    return()=>{
      mounted=false;
      observer?.disconnect();
      cn.removeEventListener("pointerdown",onDown);
      cn.removeEventListener("pointerup",onUp);
      cn.removeEventListener("pointercancel",onCancel);
      window.removeEventListener("keydown",onKey);
      controlsRef.current=null;
      stage?.dispose();
    };
  },[]);

  function choose(index:number|null){controlsRef.current?.focus(index);}
  function visitFromIndex(index:number){
    choose(index);
    // An index selection must reveal the *3D exhibit*, rather than only
    // changing a gallery camera that is offscreen below the visitor.
    stageHolder.current?.scrollIntoView({
      behavior:motionReduced?"auto":"smooth",block:"center",
    });
  }
  function changeLight(){
    controlsRef.current?.lighting(lighting==="cinematic"?"study":"cinematic");
  }
  const picked=active===null?null:getExhibit(active);
  const title=picked?picked.name:"The gallery";
  const subheading=picked?picked.subtitle:"Six places, one collection.";
  const stationText=picked?picked.number+" / "+String(EXHIBITS.length).padStart(2,"0"):"00 / 06";

  return(
    <main className={styles.page} data-active={picked?.id??"entrance"}>
      <header className={styles.topbar}>
        <div className={styles.identity}>
          <span className={styles.monogram} aria-hidden="true">M<span>·</span></span>
          <div>
            <strong>THE SYNTHETIC MENAGERIE</strong>
            <span>AN EXPERIMENTAL MUSEUM</span>
          </div>
        </div>
        <div className={styles.topRight}>
          <span className={styles.internal}>ARCHITECTURE STUDY / 00</span>
          <Link className={styles.exit} href="/">EXIT TO RLEMOR.COM <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section className={styles.intro} aria-labelledby="museum-title">
        <div>
          <p className={styles.eyebrow}><span className={styles.smallSquare} aria-hidden="true"/> THE FIRST GALLERY <span className={styles.separator}>/</span> AN UNLISTED PREVIEW</p>
          <h1 id="museum-title">A place for <em>impossible life.</em></h1>
          <p className={styles.description}>
            A museum imagined for extraordinary mechanical creatures.
            The architecture is here. The inhabitants will follow.
          </p>
        </div>
        <div className={styles.introSide}>
          <span>THE COLLECTION</span>
          <strong>06 <small>RESERVED EXHIBITS</small></strong>
          <p>First, we build the space they deserve.</p>
        </div>
      </section>

      <section className={styles.viewer} aria-label="Interactive museum gallery and navigation">
        <div className={styles.viewerTop}>
          <span>FIG. 00 / THE ARRIVAL HALL</span>
          <span className={styles.signal}><span aria-hidden="true"/> {ready?"GALLERY ONLINE":unsupported?"3D UNAVAILABLE":"PREPARING GALLERY"}</span>
        </div>
        <div className={styles.stage} ref={stageHolder}>
          <canvas
            ref={stageRef}
            className={styles.canvas}
            role="img"
            tabIndex={0}
            aria-label="Interactive 3D museum hall with six empty exhibit plinths. Swipe or drag to look around, pinch or scroll to zoom. Tap a display to visit it. Use the station buttons below as an accessible alternative."
          />
          <div className={styles.stageTopLeft} aria-hidden="true">
            <span>THE SYNTHETIC MENAGERIE</span>
            <span>{picked?picked.wing:"CENTRAL ATRIUM"}</span>
          </div>
          <span className={styles.coordinates} aria-hidden="true">3D / EXHIBITION ARCHITECTURE</span>

          {!ready&&!unsupported&&
            <div className={styles.loading} role="status">
              <span className={styles.loadingBar} aria-hidden="true"/>
              PREPARING THE GALLERY
            </div>}
          {unsupported&&
            <div className={styles.unavailable} role="status">
              <strong>THE GALLERY IS STILL OPEN TO EXPLORE BELOW.</strong>
              <p>{failure||"WebGL is unavailable."} Use the exhibit index to navigate the collection.</p>
            </div>}
          <noscript>
            <div className={styles.unavailable}>
              <strong>THE COLLECTION IS AVAILABLE BELOW.</strong>
              <p>Enable JavaScript and WebGL to explore the three-dimensional gallery.</p>
            </div>
          </noscript>

          <div className={styles.sceneFooter} aria-hidden="true">
            <span>DRAG TO LOOK <i>/</i> SCROLL TO ZOOM <i>/</i> TAP A PLINTH</span>
            <span>{motionReduced?"STILL ARCHITECTURE":"LIVE ARCHITECTURE"}</span>
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.focusCopy} aria-live="polite" aria-atomic="true">
            <span className={styles.focusCount}>{stationText}</span>
            <div className={styles.focusText}>
              <strong>{title}</strong>
              <span>{subheading}</span>
            </div>
          </div>
          <div className={styles.controlActions}>
            <button className={styles.quietButton} type="button" onClick={()=>choose(null)}
              disabled={active===null} aria-label="Return to museum entrance">
              <span aria-hidden="true">↺</span> ENTRANCE
            </button>
            <button className={styles.quietButton} type="button" onClick={changeLight}
              aria-pressed={lighting==="study"}>
              <span aria-hidden="true">◐</span> {lighting==="cinematic"?"STUDY LIGHT":"CINEMATIC LIGHT"}
            </button>
            <div className={styles.travel} role="group" aria-label="Navigate exhibits">
              <button type="button" aria-label="Previous exhibit" onClick={()=>controlsRef.current?.next(-1)}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" className={styles.next} onClick={()=>
                active===null?choose(0):controlsRef.current?.next(1)}>
                {active===null?"ENTER THE GALLERY":"NEXT EXHIBIT"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.collection} aria-labelledby="collection-heading">
        <div className={styles.collectionIntro}>
          <div>
            <p className={styles.eyebrow}>THE COLLECTION INDEX / SIX FUTURE INSTALLATIONS</p>
            <h2 id="collection-heading">A space for each <em>species.</em></h2>
          </div>
          <p>Explore the architecture of every station. The sculptures and their custom interactions will be installed after the hall is approved.</p>
        </div>
        <div className={styles.index}>
          {EXHIBITS.map((exhibit,i)=>(
            <button type="button" key={exhibit.id}
              className={styles.exhibitRow}
              data-selected={active===i}
              onClick={()=>visitFromIndex(i)}
              aria-pressed={active===i}>
              <span className={styles.srOnly}>Visit station </span>
              <span className={styles.indexNumber}>{exhibit.number}</span>
              <span className={styles.indexName}>
                <strong>{exhibit.name}</strong>
                <span>{exhibit.subtitle}</span>
              </span>
              <span className={styles.indexMeta}>{exhibit.classification}</span>
              <span className={styles.indexArrow} aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className={styles.collectionFoot}>
          <span><span className={styles.smallSquare} aria-hidden="true"/> 06 STATIONS RESERVED. NO CREATURES INSTALLED YET.</span>
          <span>USE ← → OR THE NUMBER KEYS TO MOVE BETWEEN EXHIBITS.</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>THE SYNTHETIC MENAGERIE <i>/</i> ARCHITECTURE STUDY 00</span>
        <span>AN UNLISTED PREVIEW. PRODUCTION REMAINS UNCHANGED.</span>
        <Link href="/">RAFAEL LEMOR ↗</Link>
      </footer>
    </main>
  );
}

