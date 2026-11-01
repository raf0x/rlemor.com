import {
  ARM_COUNT, PANEL_COUNT, TAU, clamp01, smooth, mix, poseAt,
  type MachineFrame, type MechanismInput, type Vec3,
} from "../octave-v3/kinematics";

export type EncounterPhase =
  | "unaware" | "noticed" | "startled" | "curious"
  | "connected" | "reveal" | "complete";

export const REVEAL_DURATION = 8.8;

export interface EncounterInput {
  phase: EncounterPhase;
  time: number;
  phaseTime: number;
  pointerX: number;
  pointerY: number;
  present: boolean;
  touchedArm: number;
  drag?: {kind: "arm" | "panel" | "eye"; index: number; offset: Vec3} | null;
}

export const ENCOUNTER_COPY: Record<EncounterPhase, {
  eyebrow: string; title: string; description: string; instruction: string;
  step: number;
}> = {
  unaware: {
    eyebrow: "01 / THE ARRIVAL",
    title: "You're not alone.",
    description: "There's something here. It hasn't noticed you yet.",
    instruction: "Move closer, or tap to say hello.",
    step: 0,
  },
  noticed: {
    eyebrow: "02 / THE GLANCE",
    title: "It sees you.",
    description: "Eight arms. One curious mind. It seems to be watching.",
    instruction: "Try touching it.",
    step: 1,
  },
  startled: {
    eyebrow: "03 / THE REACTION",
    title: "You startled it.",
    description: "Not everything is ready to be touched.",
    instruction: "Give it a moment.",
    step: 2,
  },
  curious: {
    eyebrow: "03 / THE RETURN",
    title: "It's coming back.",
    description: "Curiosity goes both ways.",
    instruction: "Touch it again.",
    step: 2,
  },
  connected: {
    eyebrow: "04 / THE CONNECTION",
    title: "Something clicked.",
    description: "For the first time, it isn't pulling away.",
    instruction: "Watch what happens.",
    step: 3,
  },
  reveal: {
    eyebrow: "05 / THE OPENING",
    title: "A little more of itself.",
    description: "What looks like armor can also be an invitation.",
    instruction: "Stay with it.",
    step: 3,
  },
  complete: {
    eyebrow: "06 / FIRST CONTACT",
    title: "It remembers you.",
    description: "No instructions now. Just the two of you.",
    instruction: "Move around. Touch an arm. See how it responds.",
    step: 4,
  },
};

export const ZERO: Vec3 = [0, 0, 0];

export function clampPointer(x: number): number {
  return Math.max(-1, Math.min(1, Number.isFinite(x) ? x : 0));
}

/** The central encounter area, generous enough for touch and narrow screens. */
export function isClose(x: number, y: number): boolean {
  const px = clampPointer(x), py = clampPointer(y);
  return Math.hypot(px / .80, py / .88) <= 1;
}

export function armToward(x: number, y: number): number {
  const angle = (Math.atan2(clampPointer(y), clampPointer(x)) - Math.PI / 8 + TAU) % TAU;
  return Math.floor(angle / (TAU / ARM_COUNT) + .5000001) % ARM_COUNT;
}

/** Pure, frame-independent choreography. Each part belongs to the existing mechanism. */
export function openingAt(seconds: number) {
  const t = Math.max(0, Math.min(REVEAL_DURATION, Number.isFinite(seconds) ? seconds : 0));
  const unfold = smooth((t - 1.05) / 2.15);
  const returnHome = smooth((t - 5.10) / 2.55);
  const inner = smooth((t - 2.45) / 1.30) * (1 - smooth((t - 5.65) / 1.85));
  return {
    teardown: unfold * (1 - returnHome),
    cutaway: inner,
    extension: mix(.30, .09, smooth((t - .30) / 1.40))
      + .38 * smooth((t - 7.15) / 1.45),
    pulse: smooth((t - 3.25) / 1.05) * (1 - smooth((t - 5.80) / 1.80)),
    progress: t / REVEAL_DURATION,
  };
}

/**
 * One authoritative scene state. The same pose solver from V3 drives every
 * interaction. Manual arm offsets only bend distal links; sockets stay seated.
 */
export function encounterAt(input: EncounterInput): {
  frame: MachineFrame;
  attention: number;
  respondingArm: number;
  revealProgress: number;
} {
  const t = Math.max(0, input.time);
  const since = Math.max(0, input.phaseTime);
  const x = clampPointer(input.pointerX);
  const y = clampPointer(input.pointerY);
  const phase = input.phase;
  const awake = phase !== "unaware";
  const active = phase === "curious" || phase === "connected" || phase === "complete";
  const attention = input.present && awake ? 1 : awake ? .42 : 0;
  const breath = Math.sin(t * 1.55);
  const reachArm = phase === "startled" || phase === "curious"
    ? Math.max(0, Math.min(ARM_COUNT - 1, input.touchedArm))
    : armToward(x, y);
  const arms: Vec3[] = Array.from({length: ARM_COUNT}, (_, index) => {
    const theta = TAU * (index / ARM_COUNT) + Math.PI / 8;
    const idle = awake ? .035 : .015;
    const base: [number, number, number] = [
      Math.cos(theta) * breath * idle,
      Math.sin(theta) * breath * idle,
      Math.sin(t * 1.1 + index) * idle,
    ];
    if ((phase === "noticed" || active) && index === reachArm) {
      const strength = phase === "noticed" ? .28 : phase === "curious" ? .78 : .48;
      const wave = Math.sin(t * 2.2) * .075;
      base[0] += x * strength + Math.cos(theta) * (wave + .12);
      base[1] += y * strength + Math.sin(theta) * (wave + .12);
      base[2] += .10;
    }
    if (phase === "startled") {
      const recoil = 1 - smooth(since / .78);
      base[0] -= Math.cos(theta) * .65 * recoil;
      base[1] -= Math.sin(theta) * .65 * recoil;
    }
    if (phase === "connected") {
      const hum = .16 * Math.sin(since * 3.4 + index * .6);
      base[0] += Math.cos(theta) * hum;
      base[1] += Math.sin(theta) * hum;
    }
    if (input.drag?.kind === "arm" && input.drag.index === index) {
      base[0] += input.drag.offset[0];
      base[1] += input.drag.offset[1];
      base[2] += input.drag.offset[2];
    }
    return base;
  });

  const panels: Vec3[] = Array.from({length: PANEL_COUNT}, (_, index) =>
    input.drag?.kind === "panel" && input.drag.index === index ? input.drag.offset : ZERO
  );
  const reveal = openingAt(since);
  const isReveal = phase === "reveal";
  const startleFactor = phase === "startled" ? 1 - smooth(since / 1.12) : 0;
  const energy = phase === "unaware" ? .25
    : phase === "startled" ? mix(.95, .50, startleFactor)
    : isReveal ? mix(.80, 1, reveal.pulse)
    : phase === "noticed" ? .65 : .94;
  const extension = isReveal ? reveal.extension
    : phase === "unaware" ? .12 + breath * .015
    : phase === "startled" ? .09 + (1 - startleFactor) * .13
    : phase === "noticed" ? .25
    : phase === "curious" ? .39
    : phase === "connected" ? .51 : .53;
  const eye: Vec3 = [
    (awake ? x * .23 * attention : 0) +
      (input.drag?.kind === "eye" ? input.drag.offset[0] : 0),
    (awake ? y * .22 * attention : 0) +
      (input.drag?.kind === "eye" ? input.drag.offset[1] : 0),
    (awake ? .05 * attention : 0) +
      (input.drag?.kind === "eye" ? input.drag.offset[2] : 0),
  ];
  const model: MechanismInput = {
    time: t, energy: clamp01(energy), extension: clamp01(extension),
    teardown: isReveal ? reveal.teardown : 0,
    cutaway: isReveal ? reveal.cutaway : 0,
    isolateArm: null, isolationWeight: 0,
    manualArmOffsets: arms,
    manualPanelOffsets: panels,
    manualEyeOffset: eye,
  };
  return {
    frame: poseAt(model),
    attention,
    respondingArm: reachArm,
    revealProgress: isReveal ? reveal.progress : phase === "complete" ? 1 : 0,
  };
}

