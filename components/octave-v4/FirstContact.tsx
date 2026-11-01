"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ENCOUNTER_COPY, REVEAL_DURATION, clampPointer, encounterAt, isClose,
  type EncounterPhase,
} from "./behavior";
import { createOctaveStage, type Stage } from "../octave-v3/scene";
import type { Vec3 } from "../octave-v3/kinematics";
import styles from "./FirstContact.module.css";

type Pick = NonNullable<ReturnType<Stage["pick"]>>;
type MovingPart = {
  kind: Pick["kind"]; index: number;
  offset: [number, number, number];
};
type Grab = {
  id: number; picked: Pick;
  x: number; y: number;
};
type Actions = { contact: () => void; restart: () => void };

const STEPS = ["NOTICE", "CONTACT", "TRUST", "REVEAL"];
const PHASES: EncounterPhase[] = [
  "unaware", "noticed", "startled", "curious",
  "connected", "reveal", "complete",
];

function silentPreview(): { phase: EncounterPhase; seconds: number } | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("moment");
  if (!raw || !PHASES.includes(raw as EncounterPhase)) return null;
  const seconds = Math.max(0, Math.min(REVEAL_DURATION,
    Number(params.get("seconds") ?? (raw === "reveal" ? 4.4 : 0)) || 0));
  return { phase: raw as EncounterPhase, seconds };
}

export default function FirstContact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<Actions | null>(null);
  const [phase, setPhase] = useState<EncounterPhase>("unaware");
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [renderer, setRenderer] = useState("");
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current, holder = holderRef.current;
    if (!canvas || !holder) return;
    const canvasNode = canvas;
    let mounted = true;
    let cleanup: (() => void) | null = null;

    void Promise.resolve().then(() => {
      if (!mounted) return;
      let stage: Stage;
      try {
        stage = createOctaveStage(canvasNode);
      } catch (error) {
        console.error("First Contact WebGL initialization failed", error);
        setUnavailable(true);
        return;
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const preview = silentPreview();
      const started = performance.now();
      let currentPhase: EncounterPhase = preview?.phase ?? "unaware";
      let phaseStarted = started;
      let pointer = { x: 0, y: 0, present: false };
      let nearSince: number | null = null;
      let lastTouchedArm = 2;
      let grab: Grab | null = null;
      let moving: MovingPart | null = null;
      let raf = 0;
      let lastDraw = started;
      let lastProgress = -1;
      let mouseHover = false;
      const software = /swiftshader|llvmpipe|software/i.test(stage.rendererName);
      setRenderer(software ? "SOFTWARE RENDERER" : "REAL-TIME 3D");
      setPhase(currentPhase);

      function change(next: EncounterPhase, now = performance.now()) {
        if (currentPhase === next || preview) return;
        currentPhase = next;
        phaseStarted = now;
        setPhase(next);
        if (next === "complete") setRevealProgress(1);
        if (next === "unaware") setRevealProgress(0);
      }

      function contact() {
        if (preview) return;
        const now = performance.now();
        if (currentPhase === "unaware") change("noticed", now);
        else if (currentPhase === "noticed") change("startled", now);
        else if (currentPhase === "curious") change("connected", now);
      }

      function restart() {
        if (preview) {
          window.location.assign(window.location.pathname);
          return;
        }
        if (grab && canvasNode.hasPointerCapture(grab.id)) {
          canvasNode.releasePointerCapture(grab.id);
        }
        grab = null;
        moving = null;
        pointer = { x: 0, y: 0, present: false };
        nearSince = null;
        lastTouchedArm = 2;
        stage.controls.enabled = true;
        stage.setCamera("hero");
        change("unaware");
      }
      actionsRef.current = { contact, restart };

      function updatePointer(event: PointerEvent) {
        const rect = canvasNode.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointer.x = clampPointer((event.clientX - rect.left) / rect.width * 2 - 1);
        pointer.y = clampPointer(1 - (event.clientY - rect.top) / rect.height * 2);
        pointer.present = isClose(pointer.x, pointer.y);
        if (pointer.present && currentPhase === "unaware" && event.pointerType === "mouse") {
          nearSince ??= performance.now();
        } else if (!pointer.present) {
          nearSince = null;
        }
      }

      function onPointerDown(event: PointerEvent) {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        updatePointer(event);
        const pick = stage.pick(event.clientX, event.clientY, event.pointerType === "touch");
        if (!pick && !pointer.present) return;
        if (pick?.kind === "arm") lastTouchedArm = pick.index;

        const before = currentPhase;
        contact();
        if (before === "complete" && pick) {
          if (grab) return;
          grab = { id: event.pointerId, picked: pick, x: event.clientX, y: event.clientY };
          moving = { kind: pick.kind, index: pick.index, offset: [0, 0, 0] };
          stage.controls.enabled = false;
          canvasNode.setPointerCapture(event.pointerId);
          canvasNode.style.cursor = "grabbing";
          event.preventDefault();
        }
      }

      function onPointerMove(event: PointerEvent) {
        updatePointer(event);
        if (grab && grab.id === event.pointerId && moving) {
          const delta: Vec3 = stage.getDragDelta(
            grab.picked, grab.x, grab.y, event.clientX, event.clientY
          );
          for (let i = 0; i < 3; i++) {
            moving.offset[i] = Math.max(-1.7, Math.min(1.7, delta[i]));
          }
          event.preventDefault();
          return;
        }
        if (event.pointerType === "mouse" && currentPhase === "complete") {
          canvasNode.style.cursor = stage.pick(event.clientX, event.clientY, false)
            ? "grab" : "crosshair";
        }
      }

      function onPointerUp(event: PointerEvent) {
        if (!grab || grab.id !== event.pointerId) return;
        if (canvasNode.hasPointerCapture(grab.id)) {
          canvasNode.releasePointerCapture(grab.id);
        }
        grab = null;
        stage.controls.enabled = true;
        canvasNode.style.cursor = "crosshair";
      }
      function onPointerLeave() {
        if (!grab) {
          pointer.present = false;
          nearSince = null;
          mouseHover = false;
        }
      }
      function onPointerEnter() { mouseHover = true; }
      function onContextLost(event: Event) {
        event.preventDefault();
        cancelAnimationFrame(raf);
        setUnavailable(true);
        setReady(false);
      }
      const ro = new ResizeObserver(() => {
        const box = holder.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) stage.resize(box.width, box.height);
      });
      ro.observe(holder);
      const initial = holder.getBoundingClientRect();
      stage.resize(initial.width, initial.height);

      canvasNode.addEventListener("pointerdown", onPointerDown, true);
      canvasNode.addEventListener("pointermove", onPointerMove, true);
      canvasNode.addEventListener("pointerup", onPointerUp);
      canvasNode.addEventListener("pointercancel", onPointerUp);
      canvasNode.addEventListener("pointerleave", onPointerLeave);
      canvasNode.addEventListener("pointerenter", onPointerEnter);
      canvasNode.addEventListener("webglcontextlost", onContextLost);

      function draw(now: number) {
        const minFrame = software ? 42 : 18;
        if (now - lastDraw < minFrame) {
          raf = requestAnimationFrame(draw);
          return;
        }
        const dt = Math.min(.12, Math.max(.001, (now - lastDraw) / 1000));
        lastDraw = now;
        if (!preview) {
          if (currentPhase === "unaware" && nearSince !== null && now - nearSince > 420) {
            change("noticed", now);
          }
          if (currentPhase === "startled" && now - phaseStarted > (reduced ? 300 : 1550)) {
            change("curious", now);
          }
          if (currentPhase === "connected" && now - phaseStarted > (reduced ? 400 : 1450)) {
            change("reveal", now);
          }
          if (currentPhase === "reveal" && now - phaseStarted > (reduced ? 3500 : REVEAL_DURATION * 1000)) {
            change("complete", now);
          }
        }
        if (moving && !grab) {
          const decay = reduced ? 0 : Math.exp(-dt * 8.5);
          moving.offset = moving.offset.map(value => value * decay) as [number, number, number];
          if (Math.hypot(...moving.offset) < .003) moving = null;
        }
        const seconds = preview ? preview.seconds
          : (now - phaseStarted) / 1000;
        const phaseTime = reduced && currentPhase === "reveal" && !preview
          ? 4.6 : seconds;
        const time = preview ? 5.4 : reduced ? 0 : (now - started) / 1000;
        const result = encounterAt({
          phase: currentPhase, time, phaseTime,
          pointerX: pointer.x, pointerY: pointer.y,
          present: preview ? true : pointer.present || mouseHover,
          touchedArm: lastTouchedArm,
          drag: moving,
        });
        if (currentPhase === "reveal") {
          const percentage = Math.round(result.revealProgress * 100);
          if (percentage !== lastProgress) {
            lastProgress = percentage;
            setRevealProgress(percentage / 100);
          }
        }
        stage.setExpression?.(
          pointer.x, pointer.y,
          currentPhase === "unaware" ? .68
            : currentPhase === "startled" ? .47
            : currentPhase === "reveal" ? 1.25
            : 1
        );
        stage.render(result.frame, time, false, null);
        raf = requestAnimationFrame(draw);
      }

      raf = requestAnimationFrame(draw);
      setReady(true);
      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        canvasNode.removeEventListener("pointerdown", onPointerDown, true);
        canvasNode.removeEventListener("pointermove", onPointerMove, true);
        canvasNode.removeEventListener("pointerup", onPointerUp);
        canvasNode.removeEventListener("pointercancel", onPointerUp);
        canvasNode.removeEventListener("pointerleave", onPointerLeave);
        canvasNode.removeEventListener("pointerenter", onPointerEnter);
        canvasNode.removeEventListener("webglcontextlost", onContextLost);
        actionsRef.current = null;
        stage.dispose();
      };
    }).catch(error => {
      console.error("First Contact stage error", error);
      if (mounted) { setUnavailable(true); setReady(false); }
    });

    return () => { mounted = false; cleanup?.(); };
  }, []);

  const copy = ENCOUNTER_COPY[phase];
  const active = phase === "unaware" || phase === "noticed" || phase === "curious";
  const buttonText = phase === "unaware" ? "SAY HELLO"
    : phase === "noticed" ? "REACH OUT"
    : phase === "curious" ? "MAKE CONTACT"
    : phase === "complete" ? "BEGIN AGAIN" : "WAIT & WATCH";
  const revealLabel = revealProgress < .3 ? "THE ARMOR IS OPENING"
    : revealProgress < .73 ? "A GLIMPSE INSIDE" : "COMING BACK TOGETHER";

  return (
    <main className={styles.shell} data-phase={phase}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.symbol}>O<span>·</span>8</span>
          <div><strong>OCTAVE</strong><span>AN EXPERIMENT IN RESPONSE</span></div>
        </div>
        <div className={styles.headerEnd}>
          <span className={styles.edition}>RL / LAB 004</span>
          <Link href="/" className={styles.exit}>EXIT EXPERIENCE <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className={styles.experience}>
        <section className={styles.story} aria-label="Your encounter">
          <div className={styles.storyTop}>
            <p className={styles.kicker}><span className={styles.spark} aria-hidden="true"/> FIRST CONTACT</p>
            <p className={styles.chapter} aria-live="off">{copy.eyebrow}</p>
          </div>
          <div className={styles.words} key={phase}>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
          <div className={styles.invitation}>
            <span className={styles.instructionRule} aria-hidden="true"/>
            <p aria-live="polite" aria-atomic="true">{copy.instruction}</p>
            <button
              className={styles.contact}
              type="button"
              disabled={!ready || (phase !== "complete" && !active)}
              onClick={() => phase === "complete"
                ? actionsRef.current?.restart()
                : actionsRef.current?.contact()}
            >
              <span>{buttonText}</span><span aria-hidden="true">{phase === "complete" ? "↺" : "↗"}</span>
            </button>
            <span className={styles.alternative}>OR INTERACT DIRECTLY WITH OCTAVE</span>
          </div>
        </section>

        <section className={styles.viewer} aria-label="Octave interactive 3D encounter">
          <div className={styles.viewerMeta}>
            <span>SUBJECT 08 / ARTIFICIAL ORGANISM</span>
            <span className={styles.live}><span aria-hidden="true"/> {ready ? "PRESENT" : "AWAITING SIGNAL"}</span>
          </div>
          <div className={styles.stage} ref={holderRef}>
            <div className={styles.orbit} aria-hidden="true"/>
            <div className={styles.orbitSecond} aria-hidden="true"/>
            <canvas
              className={styles.canvas}
              ref={canvasRef}
              role="img"
              tabIndex={0}
              aria-label="Octave, an interactive colorful mechanical octopus. Move or tap near it to be noticed. Touch it again to connect. After the reveal, drag the tentacles to play. Use the Say Hello and Reach Out buttons for keyboard control."
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  actionsRef.current?.contact();
                }
              }}
            />
            <div className={styles.stamp} aria-hidden="true">
              <span>O / 08</span>
              <span>ONE PRESENCE<br/>EIGHT ARMS</span>
            </div>
            {phase === "reveal" && <div className={styles.revealNote} aria-live="polite">
              <span>{revealLabel}</span>
              <div className={styles.revealTrack} aria-hidden="true"><span style={{width: Math.round(revealProgress * 100) + "%"}}/></div>
            </div>}
            {phase === "complete" && <div className={styles.completeNote}>
              <span className={styles.smallStar} aria-hidden="true">✳</span>
              <strong>CONNECTION ESTABLISHED</strong>
              <span>TOUCH / DRAG / EXPLORE</span>
            </div>}
            {unavailable && <div className={styles.fallback} role="status">
              <strong>OCTAVE IS STILL HERE.</strong>
              <p>Your browser could not start the 3D scene. Try a browser with WebGL enabled to meet it.</p>
            </div>}
            {!ready && !unavailable && <div className={styles.loading} role="status">
              <span className={styles.loadingPulse} aria-hidden="true"/>
              GATHERING ITS SENSES
            </div>}
            <noscript><div className={styles.fallback}>Enable JavaScript and WebGL to meet Octave.</div></noscript>
          </div>
          <div className={styles.stageCaption}>
            <span>{phase === "complete" ? "DRAG AN ARM. WATCH IT FIND ITS WAY HOME." : "NOT A VIDEO. AN ENCOUNTER."}</span>
            <span>{renderer || "PROCEDURAL 3D"}</span>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.journey} aria-label="Encounter progress">
          {STEPS.map((step, index) => (
            <div key={step} className={[
              styles.journeyStep, copy.step > index ? styles.past : "",
              copy.step === index ? styles.current : "",
            ].join(" ")}>
              <span className={styles.journeyDot} aria-hidden="true"/>
              <span>{String(index + 1).padStart(2, "0")} / {step}</span>
            </div>
          ))}
        </div>
        <div className={styles.footerEnd}>
          <span>NO SCRIPT. NO POINTS. JUST A RESPONSE.</span>
          <button type="button" onClick={() => actionsRef.current?.restart()}>
            RESTART <span aria-hidden="true">↺</span>
          </button>
        </div>
      </footer>
    </main>
  );
}

