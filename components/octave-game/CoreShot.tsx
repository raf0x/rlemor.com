"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  STAGE_COUNT, STAGE_NAMES, STAGE_SUBTITLES,
  arena, createWorld, resizeWorld, setPull, cancelPull, launch, update,
  type Event as GameEvent, type World,
} from "./physics";
import { addEffect, createEffects, drawGame, updateEffects } from "./draw";
import styles from "./CoreShot.module.css";

type Hud = {
  stage: number; mode: World["mode"]; score: number; charge: number;
  attempts: number; totalShots: number; elapsed: number; result: World["lastResult"];
};
type GameControls = { restart: () => void };
const copyHud = (w: World): Hud => ({
  stage: w.stage, mode: w.mode, score: w.score, charge: w.charge,
  attempts: w.attempts, totalShots: w.totalShots, elapsed: w.elapsed,
  result: w.lastResult,
});
const formatTime = (time: number) => {
  const seconds = Math.floor(time);
  return Math.floor(seconds / 60).toString().padStart(2, "0") + ":" +
    (seconds % 60).toString().padStart(2, "0");
};

export default function CoreShot() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<GameControls | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const audioOnRef = useRef(true);
  const [audioOn, setAudioOn] = useState(true);
  const [hud, setHud] = useState<Hud>(() => copyHud(createWorld(1100, 640)));
  const [message, setMessage] = useState("GRAB THE CORE. PULL BACK. LET GO.");
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const canvas=canvasRef.current;
    const wrap=wrapRef.current;
    if (!canvas || !wrap) return;
    const canvasNode=canvas, container=wrap;
    const ctx=canvas.getContext("2d",{alpha:false});
    if (!ctx) { setUnavailable(true); return; }

    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bounds=container.getBoundingClientRect();
    let world=createWorld(Math.max(260,bounds.width),Math.max(320,bounds.height));
    let effects=createEffects();
    let last=performance.now(), lastHud=0, raf=0;
    let pointerId:number|null=null;
    
    let destroyed=false;

    function sound(event:GameEvent) {
      if(!audioOnRef.current) return;
      try {
        const audio=audioRef.current ?? new AudioContext();
        audioRef.current=audio;
        if(audio.state==="suspended")void audio.resume();
        const notes:Record<GameEvent,readonly number[]>={
          launch:[185,122], bounce:[310], miss:[175,126],
          hit:[523,659,784], advance:[670], won:[587,740,880], lost:[176,120],
        };
        const volumes:Record<GameEvent,number>={
          launch:.065,bounce:.045,miss:.045,hit:.065,advance:.036,won:.065,lost:.045,
        };
        notes[event].forEach((frequency,index)=>{
          const oscillator=audio.createOscillator();
          const gain=audio.createGain();
          const begin=audio.currentTime+index*.065;
          const duration=(event==="hit"||event==="won") ? .30 : .14;
          oscillator.type=event==="bounce"?"triangle":"sine";
          oscillator.frequency.setValueAtTime(frequency,begin);
          if(event==="launch")oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(60,frequency*.68),begin+duration);
          gain.gain.setValueAtTime(.0001,begin);
          gain.gain.exponentialRampToValueAtTime(volumes[event],begin+.018);
          gain.gain.exponentialRampToValueAtTime(.0001,begin+duration);
          oscillator.connect(gain).connect(audio.destination);
          oscillator.start(begin);
          oscillator.stop(begin+duration+.015);
        });
      }catch { /* Audio is an optional enhancement. */ }
    }

    function announce(event:GameEvent){
      addEffect(effects,world,event,reduced);
      sound(event);
      if(event==="launch")setMessage("CORE IN FLIGHT");
      if(event==="bounce")setMessage("RICOCHET! KEEP WATCHING.");
      if(event==="miss")setMessage("CLOSE ONE. RELOAD AND TRY AGAIN.");
      if(event==="hit")setMessage(world.lastResult==="bank"?"BANK SHOT! + BONUS":"REACTOR CHARGED!");
      if(event==="advance")setMessage(
        world.stage===1?"NEW CHALLENGE: LEAD THE MOVING TARGET.":"FINAL CHALLENGE: WATCH THE DEFLECTORS.");
      if(event==="won")setMessage("THREE REACTORS ONLINE.");
      if(event==="lost")setMessage("OUT OF CHARGE. TRY A DIFFERENT ARC.");
      if(event!=="bounce" && event!=="launch")setHud(copyHud(world));
    }
    function restart(){
      if(pointerId!==null&&canvasNode.hasPointerCapture(pointerId))
        canvasNode.releasePointerCapture(pointerId);
      pointerId=null;
      world=createWorld(world.w,world.h);effects=createEffects();
      setHud(copyHud(world));setMessage("GRAB THE CORE. PULL BACK. LET GO.");
    }
    controlsRef.current={restart};

    function syncCanvas(){
      const rect=container.getBoundingClientRect();
      const w=Math.max(260,rect.width),h=Math.max(320,rect.height);
      if(Math.abs(w-world.w)>1||Math.abs(h-world.h)>1)resizeWorld(world,w,h);
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const pw=Math.max(1,Math.round(w*dpr)),ph=Math.max(1,Math.round(h*dpr));
      if(canvasNode.width!==pw||canvasNode.height!==ph){
        canvasNode.width=pw;canvasNode.height=ph;
      }
      ctx!.setTransform(dpr,0,0,dpr,0,0);
    }
    const observer=new ResizeObserver(syncCanvas);
    observer.observe(container);
    syncCanvas();

    function point(event:PointerEvent){
      const rect=canvasNode.getBoundingClientRect();
      return {
        x:(event.clientX-rect.left)*(world.w/rect.width),
        y:(event.clientY-rect.top)*(world.h/rect.height),
      };
    }
    function onDown(event:PointerEvent){
      if(event.pointerType==="mouse"&&event.button!==0)return;
      if(pointerId!==null)return;
      if(world.mode!=="ready"&&world.mode!=="aiming")return;
      const p=point(event),g=arena(world.w,world.h,world.stage,world.stageElapsed);
      const within=Math.hypot(p.x-world.orb.x,p.y-world.orb.y) <
        Math.min(106,Math.max(52,world.w*.175));
      const launcherZone=p.x<world.w*.36 && p.y>world.h*.38;
      if(!within&&!launcherZone)return;
      pointerId=event.pointerId;
      canvasNode.focus({preventScroll:true});
      canvasNode.setPointerCapture(event.pointerId);
      setPull(world,p.x-g.anchor.x,p.y-g.anchor.y);
      setMessage("PULL BACK, THEN RELEASE.");
      event.preventDefault();
    }
    function onMove(event:PointerEvent){
      if(pointerId!==event.pointerId)return;
      const p=point(event),g=arena(world.w,world.h,world.stage,world.stageElapsed);
      setPull(world,p.x-g.anchor.x,p.y-g.anchor.y);
      event.preventDefault();
    }
    function endDrag(event:PointerEvent, cancel:boolean){
      if(pointerId!==event.pointerId)return;
      const captured=pointerId;
      pointerId=null;
      if(canvasNode.hasPointerCapture(captured))
        canvasNode.releasePointerCapture(captured);
      if(cancel){cancelPull(world);setMessage("GRAB THE CORE TO AIM.");return;}
      const p=point(event),g=arena(world.w,world.h,world.stage,world.stageElapsed);
      setPull(world,p.x-g.anchor.x,p.y-g.anchor.y);
      const didLaunch=launch(world);
      if(didLaunch)announce("launch");
      else setMessage("PULL THE CORE FARTHER BACK.");
      setHud(copyHud(world));
      event.preventDefault();
    }
    function onUp(event:PointerEvent){endDrag(event,false)}
    function onCancel(event:PointerEvent){endDrag(event,true)}
    function onKey(event:KeyboardEvent){
      if(event.key.toLowerCase()==="r"){event.preventDefault();restart();return;}
      if(event.key==="Escape"){cancelPull(world);setMessage("READY FOR THE NEXT SHOT.");return;}
      if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){
        event.preventDefault();
        if(world.mode!=="ready"&&world.mode!=="aiming")return;
        if(world.mode==="ready"){
          const r=arena(world.w,world.h,world.stage).maxPull;
          setPull(world,-r*.6,r*.32);
        }
        const delta=Math.max(6,world.w*.011);
        setPull(world,
          world.pull.x+(event.key==="ArrowLeft"?-delta:event.key==="ArrowRight"?delta:0),
          world.pull.y+(event.key==="ArrowUp"?delta:event.key==="ArrowDown"?-delta:0));
        setMessage("SPACE OR ENTER TO LAUNCH.");
        return;
      }
      if(event.key===" "||event.key==="Enter"){
        event.preventDefault();
        if(world.mode==="won"||world.mode==="lost"){restart();return;}
        if(world.mode==="ready"){
          const r=arena(world.w,world.h,world.stage).maxPull;
          setPull(world,-r*.65,r*.34);
        }
        if(launch(world))announce("launch");
        setHud(copyHud(world));
      }
    }
    function render(now:number) {
      if(destroyed)return;
      const dt=Math.min(.05,Math.max(0,(now-last)/1000));
      last=now;
      if(!document.hidden){
        const events=update(world,dt);
        for(const event of events)announce(event);
        updateEffects(effects,dt);
        drawGame(ctx!,world,effects,reduced ? 0 : now/1000,reduced);
        if(now-lastHud>120){
          lastHud=now;
          setHud(copyHud(world));
        }
      }
      raf=requestAnimationFrame(render);
    }
    canvasNode.addEventListener("pointerdown",onDown);
    canvasNode.addEventListener("pointermove",onMove);
    canvasNode.addEventListener("pointerup",onUp);
    canvasNode.addEventListener("pointercancel",onCancel);
    canvasNode.addEventListener("keydown",onKey);
    raf=requestAnimationFrame(render);
    setReady(true);
    return()=>{
      destroyed=true;cancelAnimationFrame(raf);observer.disconnect();
      canvasNode.removeEventListener("pointerdown",onDown);
      canvasNode.removeEventListener("pointermove",onMove);
      canvasNode.removeEventListener("pointerup",onUp);
      canvasNode.removeEventListener("pointercancel",onCancel);
      canvasNode.removeEventListener("keydown",onKey);
      controlsRef.current=null;
      if(audioRef.current){void audioRef.current.close().catch(()=>{});audioRef.current=null}
    };
  },[]);

  const terminal=hud.mode==="won"||hud.mode==="lost";
  const won=hud.mode==="won";
  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark}>O<span>8</span></span>
          <span><strong>OCTAVE</strong><small>THE PLAYGROUND</small></span>
          <span className={styles.srOnly}>Return to rlemor.com</span>
        </Link>
        <div className={styles.headerRight}>
          <span className={styles.lab}>LAB 005 / GAMEPLAY TEST</span>
          <Link href="/" className={styles.exit}>EXIT <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>ONE GESTURE. THREE REACTORS.</p>
            <h1>CORE <em>SHOT.</em></h1>
            <p className={styles.description}>Pull the glowing core backwards. Release to sling it into the reactor. Find the right arc, then beat the moving targets.</p>
          </div>
          <p className={styles.sideNote}>AN OCTAVE MINI-GAME<br/><span>DESIGNED TO BE PLAYED,<br/>NOT WATCHED.</span></p>
        </div>

        <div className={styles.gamePanel}>
          <div className={styles.hud} aria-live="off">
            <div className={styles.levelReadout}>
              <span>CHALLENGE {String(hud.stage+1).padStart(2,"0")} / {String(STAGE_COUNT).padStart(2,"0")}</span>
              <strong>{STAGE_NAMES[hud.stage]}</strong>
            </div>
            <div className={styles.stats}>
              <div><span>CHARGES</span><strong>{String(hud.charge).padStart(2,"0")}</strong></div>
              <div><span>SHOTS</span><strong>{String(hud.totalShots).padStart(2,"0")}</strong></div>
              <div><span>TIME</span><strong>{formatTime(hud.elapsed)}</strong></div>
              <div><span>SCORE</span><strong>{hud.score.toLocaleString("en-US")}</strong></div>
            </div>
          </div>

          <div className={styles.stage} ref={wrapRef}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              tabIndex={0}
              role="application"
              aria-label="Core Shot arcade game. Use mouse or touch to drag the glowing core backward and release to fire. Keyboard: focus this game, use arrow keys to aim, Space or Enter to shoot, R to restart."
            />
            {!ready&&!unavailable&&<div className={styles.loader} role="status">BOOTING LAUNCHER</div>}
            {unavailable&&<div className={styles.loader} role="status">This game requires a browser with Canvas 2D support.</div>}
            <noscript><div className={styles.loader}>Enable JavaScript to play Core Shot.</div></noscript>
            <div className={styles.inGameHint} aria-hidden="true">
              <span className={styles.hintDot} />
              {hud.mode==="aiming"?"AIM ASSIST ACTIVE":
                hud.mode==="flying"?"CORE IN FLIGHT":
                hud.mode==="scored"?"REACTOR CHARGED":
                terminal?"RUN COMPLETE":"LAUNCHER READY"}
            </div>
            <div className={styles.coordinates} aria-hidden="true">O8 / CHAMBER {String(hud.stage+1).padStart(2,"0")}</div>
            {terminal&&<div className={styles.endBackdrop}>
              <div className={styles.endPanel} role="status" aria-live="polite">
                <span className={styles.endEyebrow}>{won?"ALL SYSTEMS ONLINE":"RUN TERMINATED"}</span>
                <h2>{won?"NICE SHOT.":"ONE MORE RUN?"}</h2>
                <p>{won?"All three reactors charged. That was all you.":"Out of charge. The next shot could be the one."}</p>
                <div className={styles.endMetrics}>
                  <div><span>SCORE</span><strong>{hud.score.toLocaleString("en-US")}</strong></div>
                  <div><span>SHOTS</span><strong>{hud.totalShots}</strong></div>
                  <div><span>TIME</span><strong>{formatTime(hud.elapsed)}</strong></div>
                </div>
                <button className={styles.playAgain} type="button" onClick={()=>controlsRef.current?.restart()}>
                  PLAY AGAIN <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>}
          </div>

          <div className={styles.gameFooter}>
            <p className={styles.status} aria-live="polite"><span className={styles.blink}/> {message}</p>
            <div className={styles.actions}>
              <button type="button" onClick={()=>{
                const next=!audioOnRef.current;
                audioOnRef.current=next;setAudioOn(next);
              }} aria-pressed={audioOn}>{audioOn?"SOUND ON":"SOUND OFF"} <span aria-hidden="true">{audioOn?"◖))":"◖×"}</span></button>
              <button type="button" onClick={()=>controlsRef.current?.restart()}>NEW RUN <span aria-hidden="true">↺</span></button>
            </div>
          </div>
        </div>
        <div className={styles.below}>
          <div className={styles.levelSteps}>
            {STAGE_NAMES.map((name,index)=>(
              <span key={name} className={
                index<hud.stage||won?styles.done:index===hud.stage?styles.current:""
              }><i/> {String(index+1).padStart(2,"0")} / {name}</span>
            ))}
          </div>
          <p className={styles.footNote}>
            {STAGE_SUBTITLES[hud.stage]}
            <span> ON DESKTOP: FOCUS THE GAME, ARROWS TO AIM, SPACE TO FIRE.</span>
          </p>
        </div>
      </div>
      <footer className={styles.footer}>
        <span>OCTAVE / 08 · GAMEPLAY EXPERIMENT</span>
        <span>NO SIGN-IN. NO SAVE DATA. JUST THE SHOT.</span>
        <Link href="/">RAFAEL LEMOR ↗</Link>
      </footer>
    </main>
  );
}

