"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ARM_COUNT, LINKS_PER_ARM, PANEL_COUNT, TOTAL_LINKS, TOUR_CUES, TOUR_DURATION,
  cueAt, modeInput, poseAt, tourAt, type CameraPreset,
  type MachineMode, type MechanismInput, type Vec3,
} from "./kinematics";
import type { Stage } from "./scene";
import * as THREE from "three";
import styles from "./OctaveV3.module.css";

type Selected = { kind:"arm"|"panel"|"eye";index:number;point:{x:number;y:number;z:number};label:string };
type UIFrame={
  mode:string;phase:string;energy:number;extension:number;teardown:number;
  cutaway:number;time:number;cue:string;selected:string|null;
};
type Controller={
  play:()=>void;pause:()=>void;seek:(t:number)=>void;mode:(m:MachineMode)=>void;
  arm:(n:number)=>void;camera:(preset:CameraPreset)=>void;reset:()=>void;
  speed:(v:number)=>void;
};
const blank=poseAt(tourAt(0));
const starter:UIFrame={
  mode:"tour",phase:"ONLINE",energy:blank.energy,extension:blank.extension,
  teardown:blank.teardown,cutaway:blank.cutaway,time:0,
  cue:cueAt(0).label,selected:null,
};

const newOffsets=(count:number)=>Array.from({length:count},()=>[0,0,0] as [number,number,number]);

function analyticSpring(
  pos:[number,number,number],vel:[number,number,number],
  target:[number,number,number],dt:number,
){
  const w=11.7,t=Math.max(.001,Math.min(dt,.8)),e=Math.exp(-w*t);
  for(let k=0;k<3;k++){
    const x=pos[k]-target[k],v=vel[k],c=v+w*x;
    pos[k]=target[k]+(x+c*t)*e;
    vel[k]=(v-w*c*t)*e;
    if(Math.abs(target[k])<.0001&&Math.abs(pos[k])<.0007&&Math.abs(vel[k])<.004){
      pos[k]=0;vel[k]=0;
    }
  }
}

export default function OctaveV3(){
  const stageRef=useRef<HTMLDivElement|null>(null);
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const controller=useRef<Controller|null>(null);
  const [ready,setReady]=useState(false);
  const [unsupported,setUnsupported]=useState(false);
  const [status,setStatus]=useState("INITIALIZING GEOMETRY");
  const [ui,setUI]=useState<UIFrame>(starter);
  const [playing,setPlaying]=useState(true);
  const [manualMode,setManualMode]=useState<MachineMode|null>(null);
  const [selectedArm,setSelectedArm]=useState(2);
  const [playSpeed,setPlaySpeed]=useState(1);
  const [rendererInfo,setRendererInfo]=useState("DETECTING GRAPHICS");
  const [view,setView]=useState<CameraPreset>("hero");

  useEffect(()=>{
    const canvas=canvasRef.current,holder=stageRef.current;
    if(!canvas||!holder)return;
    const canvasNode = canvas;
    let mounted=true,cleanup:(()=>void)|null=null;
    void import("./scene").then(({createOctaveStage})=>{
      if(!mounted)return;
      let stage:Stage;
      try{stage=createOctaveStage(canvas);}catch(err){
        console.error("OCTAVE V3 failed to initialize WebGL",err);
        setUnsupported(true);setStatus("WEBGL UNAVAILABLE");
        return;
      }
      setRendererInfo(/swiftshader|llvmpipe|software/i.test(stage.rendererName)?"SOFTWARE GRAPHICS":"HARDWARE GRAPHICS");
      const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const url=new URLSearchParams(window.location.search);
      const fixedTime=url.has("frame")?Math.max(0,Math.min(TOUR_DURATION-.01,Number(url.get("frame")||0))):null;
      const clock={
        time:fixedTime??0,playing:!reduced&&fixedTime===null,
        speed:1,mode:"tour" as "tour"|"manual",lastUser:performance.now(),
      };
      const manual:MechanismInput={...tourAt(clock.time)};
      const destination:MechanismInput={...manual};
      const offsets={arm:newOffsets(ARM_COUNT),panels:newOffsets(PANEL_COUNT),eye:[0,0,0] as [number,number,number]};
      const velocity={arm:newOffsets(ARM_COUNT),panels:newOffsets(PANEL_COUNT),eye:[0,0,0] as [number,number,number]};
      const goals={arm:newOffsets(ARM_COUNT),panels:newOffsets(PANEL_COUNT),eye:[0,0,0] as [number,number,number]};
      let currentArm=2,selected:Selected|null=null;
      let lastDraw=performance.now(),lastUi=0,lastPick=0,raf=0;
      let dragging:{id:number;fromX:number;fromY:number;selected:Selected;origin:[number,number,number]}|null=null;
      const userActivity=()=>{clock.lastUser=performance.now();};
      function stopTour(){
        userActivity();
        if(clock.mode==="tour"){
          const frame=tourAt(clock.time);
          for(const prop of ["energy","extension","teardown","cutaway"] as const){
            manual[prop]=frame[prop];destination[prop]=frame[prop];
          }
          manual.isolateArm=frame.isolateArm;
          destination.isolateArm=frame.isolateArm;
        }
        clock.mode="manual";clock.playing=false;
        setPlaying(false);
        setStatus("MANUAL CONTROL");
      }
      const inputForFrame=():MechanismInput=>{
        if(clock.mode==="tour")return tourAt(clock.time);
        return{...manual,time:clock.time};
      };
      function startTour(){
        if(reduced){
          clock.playing=false;clock.mode="manual";
          Object.assign(manual,modeInput("operate",clock.time));
          Object.assign(destination,modeInput("operate",clock.time));
          setPlaying(false);setManualMode("operate");
          return;
        }
        clock.time=0;clock.mode="tour";clock.playing=true;userActivity();
        setStatus("AUTOMATIC ENGINEERING TOUR");setPlaying(true);setManualMode(null);
      }
      const controls:Controller={
        play(){
          clock.playing=!reduced;
          if(clock.mode==="manual")clock.mode="tour";
          setManualMode(null);setPlaying(clock.playing);userActivity();
        },
        pause(){
          clock.playing=false;setPlaying(false);userActivity();
          setStatus("TIMELINE PAUSED");
        },
        seek(time){
          clock.time=Math.max(0,Math.min(TOUR_DURATION-.01,time));
          clock.mode="tour";clock.playing=false;userActivity();
          setPlaying(false);setManualMode(null);
          setStatus("FRAME LOCKED / "+clock.time.toFixed(1)+" S");
        },
        mode(mode){
          stopTour();
          const target=modeInput(mode,clock.time,currentArm);
          Object.assign(destination,target);
          setManualMode(mode);
          setStatus(mode==="teardown"?"MECHANICAL TEARDOWN":mode==="cutaway"?"INTERNAL CUTAWAY":mode==="isolate"?"ARM "+String(currentArm+1).padStart(2,"0")+" / ISOLATED":"SYSTEM REASSEMBLED");
        },
        arm(index){
          currentArm=index;
          setSelectedArm(index);
          stopTour();
          Object.assign(destination,modeInput("isolate",clock.time,index));
          setManualMode("isolate");
          setStatus("ARM "+String(index+1).padStart(2,"0")+" / FOCUS");
        },
        camera(preset){
          stopTour();
          stage.setCamera(preset);setView(preset);
          setStatus("CAMERA / "+preset.toUpperCase());
        },
        reset(){
          stopTour();
          Object.assign(destination,modeInput("operate",clock.time));
          Object.assign(manual,modeInput("operate",clock.time));
          goals.arm.forEach(x=>x.fill(0));goals.panels.forEach(x=>x.fill(0));
          goals.eye.fill(0);stage.setCamera("hero");
          currentArm=2;setSelectedArm(2);
          selected=null;setManualMode("operate");setStatus("ALL SUBSYSTEMS DOCKED");
          setView("hero");
        },
        speed(v){clock.speed=v;setPlaySpeed(v);userActivity();},
      };
      controller.current=controls;
      if(reduced){
        clock.mode="manual";
        clock.playing=false;setPlaying(false);
        Object.assign(manual,modeInput("operate",0));
        Object.assign(destination,modeInput("operate",0));
      }
      const ro=new ResizeObserver(()=>{
        const {width,height}=holder.getBoundingClientRect();
        if(width>0&&height>0)stage.resize(width,height);
      });
      ro.observe(holder);
      const bounds=holder.getBoundingClientRect();
      stage.resize(bounds.width,bounds.height);

      function moveTarget(grab:Selected,delta:Vec3,origin:[number,number,number]){
        const target=grab.kind==="arm"?goals.arm[grab.index]:
          grab.kind==="panel"?goals.panels[grab.index]:goals.eye;
        for(let i=0;i<3;i++)target[i]=Math.max(-2.6,Math.min(2.6,origin[i]+delta[i]));
      }
      function selectLabel(grab:Selected){setStatus("GRABBED / "+grab.label);}

      function onDown(event:PointerEvent){
        if(event.pointerType==="mouse"&&event.button!==0)return;
        if(dragging){
          if(event.pointerType==="touch"&&dragging.id!==event.pointerId)release();
          return;
        }
        const pick=stage.pick(event.clientX,event.clientY,event.pointerType==="touch");
        stopTour();
        if(!pick){selected=null;return;}
        selected={
          kind:pick.kind,index:pick.index,label:pick.label,
          point:{x:pick.point.x,y:pick.point.y,z:pick.point.z},
        };
        const dst=selected.kind==="arm"?goals.arm[selected.index]:
          selected.kind==="panel"?goals.panels[selected.index]:goals.eye;
        dragging={id:event.pointerId,fromX:event.clientX,fromY:event.clientY,
          selected,origin:[...dst] as [number,number,number]};
        stage.controls.enabled=false;
        canvasNode.setPointerCapture(event.pointerId);
        canvasNode.style.cursor="grabbing";
        selectLabel(selected);
        event.preventDefault();
      }
      function release(event?:PointerEvent){
        if(!dragging||(event&&event.pointerId!==dragging.id))return;
        const part=dragging.selected;
        const target=part.kind==="arm"?goals.arm[part.index]:
          part.kind==="panel"?goals.panels[part.index]:goals.eye;
        target.fill(0);
        const id=dragging.id;
        dragging=null;stage.controls.enabled=true;
        if(canvasNode.hasPointerCapture(id))canvasNode.releasePointerCapture(id);
        canvasNode.style.cursor="grab";
        setStatus("MAGNETIC RETURN / "+part.label);
      }
      function onMove(event:PointerEvent){
        if(!dragging){
          if(event.pointerType==="mouse"&&performance.now()-lastPick>95){
            lastPick=performance.now();
            canvasNode.style.cursor=stage.pick(event.clientX,event.clientY,false)?"pointer":"grab";
          }
          return;
        }
        if(dragging.id!==event.pointerId)return;
        const g=dragging;
        const point=new THREE.Vector3(g.selected.point.x,g.selected.point.y,g.selected.point.z);
        const delta=stage.getDragDelta(
          {...g.selected,point},g.fromX,g.fromY,event.clientX,event.clientY,
        );
        moveTarget(g.selected,delta,g.origin);
        event.preventDefault();
      }
      // Dynamic import is for the heavyweight scene. THREE is available
      // in this client module solely for the picking world's vector type.
      canvasNode.addEventListener("pointerdown",onDown,true);
      canvasNode.addEventListener("pointermove",onMove,true);
      canvasNode.addEventListener("pointerup",release);
      canvasNode.addEventListener("pointercancel",release);
      canvasNode.addEventListener("pointerleave",()=>{if(!dragging)canvasNode.style.cursor="grab";});
      const onWheel=()=>stopTour();
      canvasNode.addEventListener("wheel",onWheel,{passive:true});
      const onContextLost=(event:Event)=>{
        event.preventDefault();setUnsupported(true);setStatus("GRAPHICS CONTEXT LOST");
        cancelAnimationFrame(raf);
      };
      canvasNode.addEventListener("webglcontextlost",onContextLost);
      function draw(now:number){
        const dt=Math.max(.001,Math.min(.7,(now-lastDraw)/1000));
        // A frame cap avoids wasting resources on software WebGL.
        const minFrame=/swiftshader|llvmpipe|software/i.test(stage.rendererName)?42:18;
        if(now-lastDraw<minFrame){raf=requestAnimationFrame(draw);return;}
        lastDraw=now;
        if(clock.playing)clock.time=(clock.time+dt*clock.speed)%TOUR_DURATION;
        else if(clock.mode==="manual")clock.time+=dt*.44;
        if(!clock.playing&&clock.mode==="manual"&&now-clock.lastUser>33000&&!reduced){
          startTour();
        }
        if(clock.mode==="manual"){
          const alpha=1-Math.exp(-dt*2.5);
          for(const prop of ["energy","extension","teardown","cutaway"] as const){
            manual[prop]+=((destination[prop] as number)-(manual[prop] as number))*alpha;
          }
          manual.isolateArm=destination.isolateArm;
        }
        for(let i=0;i<ARM_COUNT;i++)analyticSpring(offsets.arm[i],velocity.arm[i],goals.arm[i],dt);
        for(let i=0;i<PANEL_COUNT;i++)analyticSpring(offsets.panels[i],velocity.panels[i],goals.panels[i],dt);
        analyticSpring(offsets.eye,velocity.eye,goals.eye,dt);
        const input=inputForFrame();
        const frame=poseAt({
          ...input,
          manualArmOffsets:offsets.arm,
          manualPanelOffsets:offsets.panels,
          manualEyeOffset:offsets.eye,
        });
        stage.render(frame,now*.001,clock.playing&&clock.mode==="tour",selected?{
          kind:selected.kind,index:selected.index,label:selected.label,
          point:new THREE.Vector3(selected.point.x,selected.point.y,selected.point.z),
        }:null);
        if(now-lastUi>180){
          lastUi=now;
          setUI({
            mode:clock.mode,
            phase:frame.readout.phase,
            energy:frame.readout.energy,extension:frame.readout.extension,
            teardown:frame.readout.separation,cutaway:frame.readout.cutaway,
            time:clock.time,cue:cueAt(clock.time).label,selected:selected?.label??null,
          });
        }
        raf=requestAnimationFrame(draw);
      }
      raf=requestAnimationFrame(draw);
      setReady(true);setStatus(reduced?"REDUCED-MOTION SYSTEM READY":"SIMULATOR ONLINE");
      cleanup=()=>{
        cancelAnimationFrame(raf);ro.disconnect();
        canvasNode.removeEventListener("pointerdown",onDown,true);
        canvasNode.removeEventListener("pointermove",onMove,true);
        canvasNode.removeEventListener("pointerup",release);
        canvasNode.removeEventListener("pointercancel",release);
        canvasNode.removeEventListener("wheel",onWheel);
        canvasNode.removeEventListener("webglcontextlost",onContextLost);
        controller.current=null;stage.dispose();
      };
    }).catch((error)=>{
      console.error("Failed to load OCTAVE V3 stage",error);
      if(mounted){setUnsupported(true);setStatus("STAGE INITIALIZATION FAILED");}
    });
    return()=>{mounted=false;cleanup?.();};
  },[]);

  function actionMode(mode:MachineMode){controller.current?.mode(mode);}
  const cues=TOUR_CUES;
  const pct=(value:number)=>Math.round(value*100);
  return(
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandmark}>O8<span className={styles.brandDot}>.</span></span>
          <div><strong>OCTAVE / 08</strong><span>MECHANICAL SYSTEMS LAB / V3</span></div>
        </div>
        <div className={styles.topright}>
          <span className={styles.signal}><span aria-hidden="true"/> {ready?"SIMULATION ONLINE":"STAGE INITIALIZING"}</span>
          <Link href="/" className={styles.back}>RLEMOR.COM <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className={styles.headline}>
        <div>
          <p className={styles.eyebrow}><span>EXPERIMENT 003</span> / REFERENCE-FIRST MECHANICS</p>
          <h1>Precision in motion.<span> Color in every joint.</span></h1>
          <p className={styles.dek}>Eight articulated arms, one coordinated system. Explore the mechanism, pull it apart, and watch every component find its way home.</p>
        </div>
        <p className={styles.headside}>AN INTERACTIVE STUDY<br/>IN ARTICULATED MOTION<br/><strong>NOT A VIDEO. A MACHINE.</strong></p>
      </div>

      <div className={styles.workspace}>
        <aside className={styles.metrics} aria-label="Mechanism telemetry">
          <div className={styles.sectionTop}><span className={styles.railMark}/> SYSTEM TELEMETRY <span>01</span></div>
          <div className={styles.readout}>
            <span>MANIPULATORS</span>
            <strong>08 <small>/ ACTIVE MODULES</small></strong>
            <p>Eight independently articulated chains</p>
          </div>
          <div className={styles.readout}>
            <span>LINK ASSEMBLIES</span>
            <strong>{TOTAL_LINKS.toString().padStart(3,"0")}</strong>
            <p>{LINKS_PER_ARM} links per arm, constrained at every joint</p>
          </div>
          <div className={styles.readout}>
            <span>DOCK SEPARATION</span>
            <strong>{ui.teardown.toFixed(2)} <small>UNITS</small></strong>
            <p>Computed from the same state as the geometry</p>
          </div>
          <div className={styles.bars}>
            <div className={styles.barsHeading}>LIVE SIMULATED STATE</div>
            <div><span>ENERGY</span><span>{pct(ui.energy)}%</span></div>
            <div className={styles.track}><div style={{width:pct(ui.energy)+"%"}}/></div>
            <div><span>REACH</span><span>{pct(ui.extension)}%</span></div>
            <div className={styles.track}><div style={{width:pct(ui.extension)+"%"}}/></div>
            <div><span>CUTAWAY</span><span>{pct(ui.cutaway)}%</span></div>
            <div className={styles.track}><div style={{width:pct(ui.cutaway)+"%"}}/></div>
          </div>
          <div className={styles.statFoot}>
            <span className={styles.statDot} aria-hidden="true"/>
            ALL METRICS DERIVE FROM THE RIG
          </div>
        </aside>

        <section className={styles.viewer} aria-label="Interactive three-dimensional mechanical octopus simulator">
          <div className={styles.viewerHeader}>
            <span>FIG. 01 / ARTICULATED ORGANISM</span>
            <span>REAL-TIME / THREE.JS</span>
          </div>
          <div className={styles.stage} ref={stageRef}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              role="img"
              aria-label="Interactive 3D machine. Drag a tentacle, a shell panel or the optical core to pull it, release to return. Drag empty space to rotate. Pinch or scroll to zoom."
            />
            <div className={styles.stageLabel} aria-hidden="true">
              <span className={styles.stageMiniSquare}/> OC-08 / PROCEDURAL ASSEMBLY
            </div>
            <div className={styles.stagePhase}>{ui.mode==="tour"?"DIRECTED TOUR":"LIVE CONTROL"} <span>·</span> {ui.phase}</div>
            <div className={styles.stageCoordinate} aria-hidden="true">X / Y / Z</div>
            {unsupported&&<div className={styles.unsupported} role="status">The interactive model requires a browser with WebGL support.</div>}
            {!ready&&!unsupported&&<div className={styles.loading} role="status">INITIALIZING 3D ASSEMBLY</div>}
            <noscript><div className={styles.unsupported}>Enable JavaScript to explore this interactive machine.</div></noscript>
          </div>
          <div className={styles.viewerBottom}>
            <span><span className={styles.littleDot}/> DRAG A COMPONENT <i>/</i> RELEASE TO AUTO-DOCK</span>
            <span>DRAG EMPTY SPACE TO ORBIT</span>
          </div>
        </section>

        <aside className={styles.controls} aria-label="Mechanism controls">
          <div className={styles.sectionTop}><span className={styles.railMark}/> SYSTEM CONTROL <span>02</span></div>
          <p className={styles.controlHint}>Every button drives the same mechanical state as the 3D scene and the readouts.</p>
          <div className={styles.controlModes} role="group" aria-label="Mechanism mode">
            <button type="button" disabled={!ready} className={manualMode==="operate"?styles.actionSelected:styles.action} aria-pressed={manualMode==="operate"} onClick={()=>actionMode("operate")}><span>01</span> OPERATE <span>↗</span></button>
            <button type="button" disabled={!ready} className={manualMode==="teardown"?styles.actionSelected:styles.action} aria-pressed={manualMode==="teardown"} onClick={()=>actionMode("teardown")}><span>02</span> TEARDOWN <span>↗</span></button>
            <button type="button" disabled={!ready} className={manualMode==="cutaway"?styles.actionSelected:styles.action} aria-pressed={manualMode==="cutaway"} onClick={()=>actionMode("cutaway")}><span>03</span> CUTAWAY / X-RAY <span>↗</span></button>
            <button type="button" disabled={!ready} className={manualMode==="isolate"?styles.actionSelected:styles.action} aria-pressed={manualMode==="isolate"} onClick={()=>actionMode("isolate")}><span>04</span> ISOLATE ARM <span>↗</span></button>
          </div>
          <div className={styles.armSelect}>
            <p>ARM SELECTION</p>
            <div role="group" aria-label="Select an arm to inspect">
              {Array.from({length:ARM_COUNT},(_,i)=><button
                type="button" key={i} aria-pressed={selectedArm===i}
                className={selectedArm===i?styles.armActive:styles.armButton}
                onClick={()=>controller.current?.arm(i)} disabled={!ready}
              >{String(i+1).padStart(2,"0")}</button>)}
            </div>
          </div>
          <div className={styles.cameraGroup}>
            <p>CAMERA PRESETS</p>
            <div role="group" aria-label="Camera view">
              {(["hero","three-quarter","profile"] as CameraPreset[]).map(key=><button
                type="button" key={key} disabled={!ready} aria-pressed={view===key}
                onClick={()=>controller.current?.camera(key)}
                className={view===key?styles.presetActive:styles.preset}
              >{key==="three-quarter"?"3/4":key.toUpperCase()}</button>)}
            </div>
          </div>
          <button type="button" disabled={!ready} onClick={()=>controller.current?.reset()} className={styles.reset}>
            <span>↺</span> REASSEMBLE EVERYTHING <span>RESET</span>
          </button>
          <div className={styles.status}>
            <span className={styles.statusDot}/><span role="status" aria-live="polite">{status}</span>
          </div>
          <p className={styles.renderer}>{rendererInfo}</p>
        </aside>
      </div>

      <section className={styles.timeline} aria-label="Automated tour and timeline">
        <div className={styles.tourTop}>
          <div>
            <p className={styles.timelineEyebrow}>ONE MECHANICAL TIMELINE</p>
            <strong>{ui.cue}</strong>
            <span>{cueAt(ui.time).description}</span>
          </div>
          <div className={styles.transport}>
            <button type="button" disabled={!ready} onClick={()=>playing?controller.current?.pause():controller.current?.play()}>
              {playing?"Ⅱ  PAUSE TOUR":"▶  PLAY TOUR"}
            </button>
            <button type="button" disabled={!ready} onClick={()=>{controller.current?.seek(0);controller.current?.play()}}>↺ REPLAY</button>
            <label htmlFor="octave-speed">SPEED</label>
            <select id="octave-speed" value={String(playSpeed)} onChange={e=>controller.current?.speed(Number(e.target.value))}>
              <option value=".5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option>
            </select>
          </div>
        </div>
        <label className={styles.timelineLabel} htmlFor="octave-timeline">
          TOUR POSITION <span>{ui.time.toFixed(1)} / {TOUR_DURATION.toFixed(0)} SEC</span>
        </label>
        <input id="octave-timeline" type="range" min="0" max={TOUR_DURATION-.01} step=".1"
          aria-valuetext={ui.time.toFixed(1)+" seconds"}
          value={Math.min(TOUR_DURATION-.01,ui.time)}
          onChange={e=>controller.current?.seek(Number(e.target.value))}
        />
        <div className={styles.cues}>
          {cues.map(cue=><button key={cue.at} type="button" disabled={!ready}
            onClick={()=>controller.current?.seek(cue.at)}>
            <span>{String(cue.at).padStart(2,"0")}s</span><strong>{cue.label.split("/").at(-1)?.trim()}</strong>
          </button>)}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>OCTAVE / 08 / V3 <i>·</i> REFERENCE-FIRST MECHANICAL STUDY</span>
        <span>THE MODEL AND ITS READOUTS SHARE ONE STATE</span>
        <Link href="/">RAFAEL LEMOR ↗</Link>
      </footer>
    </main>
  );
}
