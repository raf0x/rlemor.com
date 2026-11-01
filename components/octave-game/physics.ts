/**
 * OCTAVE / CORE SHOT
 * An intentionally small, deterministic arcade physics system.
 * Canvas and React are strictly presentation; no Three.js, APIs or storage.
 */
export type Vec = { x: number; y: number };
export type Mode = "ready" | "aiming" | "flying" | "scored" | "won" | "lost";
export type Event = "launch" | "bounce" | "miss" | "hit" | "advance" | "won" | "lost";
export type Orb = Vec & { vx: number; vy: number };
export interface Bumper extends Vec { r: number; hue: number }
export interface Arena {
  anchor: Vec;
  base: Vec;
  target: Vec & { r: number };
  bumpers: Bumper[];
  radius: number;
  maxPull: number;
  gravity: number;
  power: number;
}
export interface World {
  w: number;
  h: number;
  stage: number;
  mode: Mode;
  orb: Orb;
  pull: Vec;
  charge: number;
  score: number;
  elapsed: number;
  stageElapsed: number;
  flightElapsed: number;
  settleElapsed: number;
  attempts: number;
  bumps: number;
  totalShots: number;
  active: boolean;
  trail: Vec[];
  lastResult: "none" | "miss" | "hit" | "bank";
}

export const STAGE_NAMES = ["FIRST SPARK", "MOVING TARGET", "THE RICOCHET"] as const;
export const STAGE_SUBTITLES = [
  "One clean shot. Find the arc.",
  "The reactor moves. Lead your shot.",
  "Use the bumpers, or find a way around.",
] as const;
export const STAGE_COUNT = 3;
export const STARTING_CHARGE = 8;

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(v) ? v : a));
const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

export function arena(w: number, h: number, stage: number, time = 0): Arena {
  const width = Math.max(260, w), height = Math.max(320, h);
  const mobile = width < 600;
  const minimum = Math.min(width, height);
  const stageId = clamp(Math.floor(stage), 0, STAGE_COUNT - 1);
  const target = {
    x: width * (stageId === 0 ? .79 : stageId === 1 ? .80 : .79),
    y: height * (stageId === 0 ? .34 : stageId === 1 ? .34 : .32),
    r: clamp(minimum * .052, mobile ? 22 : 29, 39),
  };
  if (stageId === 1) {
    target.y += Math.sin(time * 1.37 + .4) * height * .094;
  } else if (stageId === 2) {
    target.x += Math.sin(time * 1.13 + 1.1) * width * .045;
    target.y += Math.cos(time * 1.58) * height * .055;
  }
  const bumpRadius = clamp(minimum * .057, mobile ? 20 : 30, 46);
  const bumpers: Bumper[] = stageId === 0 ? [] : stageId === 1
    ? [{ x: width * .54, y: height * .50, r: bumpRadius, hue: 188 }]
    : [
      { x: width * .56, y: height * .49, r: bumpRadius * .97, hue: 289 },
      { x: width * .69, y: height * .67, r: bumpRadius * .86, hue: 42 },
    ];

  const anchor = { x: width * (mobile ? .31 : .26), y: height * (mobile ? .68 : .645) };
  return {
    anchor,
    base: { x: anchor.x - clamp(width * .09, mobile ? 39 : 65, 105), y: anchor.y - clamp(height * .14, mobile ? 52 : 69, 100) },
    target,
    bumpers,
    radius: clamp(minimum * .028, mobile ? 10.5 : 11.5, 16),
    maxPull: Math.min(width * .195, height * .255, 155),
    gravity: height * .68,
    power: mobile ? 8.7 : 8.5,
  };
}

export function createWorld(w: number, h: number): World {
  const geometry = arena(w, h, 0);
  return {
    w, h, stage: 0, mode: "ready",
    orb: { ...geometry.anchor, vx: 0, vy: 0 },
    pull: { x: 0, y: 0 }, charge: STARTING_CHARGE, score: 0,
    elapsed: 0, stageElapsed: 0, flightElapsed: 0, settleElapsed: 0,
    attempts: 0, bumps: 0, totalShots: 0, active: false, trail: [],
    lastResult: "none",
  };
}

export function resizeWorld(world: World, w: number, h: number): void {
  if (w <= 0 || h <= 0) return;
  const sx = w / world.w, sy = h / world.h;
  world.orb.x *= sx; world.orb.y *= sy;
  world.orb.vx *= sx; world.orb.vy *= sy;
  world.pull.x *= sx; world.pull.y *= sy;
  world.trail.forEach(p => { p.x *= sx; p.y *= sy; });
  world.w = w; world.h = h;
}

export function setPull(world: World, dx: number, dy: number): void {
  if (world.mode !== "ready" && world.mode !== "aiming") return;
  const geometry = arena(world.w, world.h, world.stage, world.stageElapsed);
  // Pull backwards to load the launcher, never launch into Octave itself.
  const x = Math.min(0, dx);
  const y = dy;
  const magnitude = Math.hypot(x, y);
  const ratio = magnitude > geometry.maxPull ? geometry.maxPull / magnitude : 1;
  world.pull = { x: x * ratio, y: y * ratio };
  world.orb = {
    x: geometry.anchor.x + world.pull.x,
    y: geometry.anchor.y + world.pull.y, vx: 0, vy: 0,
  };
  world.mode = "aiming";
}

export function cancelPull(world: World): void {
  if (world.mode !== "aiming") return;
  const a = arena(world.w, world.h, world.stage, world.stageElapsed).anchor;
  world.mode = "ready";
  world.pull = { x: 0, y: 0 };
  world.orb = { ...a, vx: 0, vy: 0 };
}

export function launch(world: World): boolean {
  if (world.mode !== "aiming" || world.charge <= 0) return false;
  const strength = Math.hypot(world.pull.x, world.pull.y);
  if (strength < arena(world.w, world.h, world.stage).maxPull * .17) {
    cancelPull(world);
    return false;
  }
  const power = arena(world.w, world.h, world.stage).power;
  world.orb.vx = -world.pull.x * power;
  world.orb.vy = -world.pull.y * power;
  world.charge--;
  world.attempts++;
  world.totalShots++;
  world.mode = "flying";
  world.flightElapsed = 0;
  world.bumps = 0;
  world.active = true;
  world.trail = [{ x: world.orb.x, y: world.orb.y }];
  world.lastResult = "none";
  return true;
}

export function physicsStep(
  orb: Orb, g: Arena, dt: number,
): { bounced: boolean; missed: boolean } {
  let bounced = false;
  orb.vy += g.gravity * dt;
  orb.x += orb.vx * dt;
  orb.y += orb.vy * dt;
  const margin = g.radius + 5;
  if (orb.y < margin && orb.vy < 0) {
    orb.y = margin;
    orb.vy = -orb.vy * .83; bounced = true;
  }
  for (const b of g.bumpers) {
    const dx = orb.x - b.x, dy = orb.y - b.y;
    const dist = Math.hypot(dx, dy);
    const limit = b.r + g.radius;
    if (dist > 0 && dist < limit) {
      const nx = dx / dist, ny = dy / dist;
      orb.x = b.x + nx * (limit + .2);
      orb.y = b.y + ny * (limit + .2);
      const dot = orb.vx * nx + orb.vy * ny;
      if (dot < 0) {
        orb.vx -= 2.07 * dot * nx;
        orb.vy -= 2.07 * dot * ny;
        // A small arcade impulse makes deflections satisfying.
        orb.vx += nx * 33;
        orb.vy += ny * 33;
        bounced = true;
      }
    }
  }
  return { bounced, missed: false };
}

function advanceOrb(orb: Orb, geometry: Arena, w: number, h: number, dt: number): { bounce: boolean; out: boolean } {
  const collision = physicsStep(orb, geometry, dt);
  let bounce = collision.bounced;
  const margin = geometry.radius + 4;
  if (orb.x >= w - margin && orb.vx > 0) {
    orb.x = w - margin; orb.vx = -orb.vx * .78; bounce = true;
  }
  if (orb.x <= margin && orb.vx < 0) {
    orb.x = margin; orb.vx = -orb.vx * .78; bounce = true;
  }
  return { bounce, out: orb.y > h + geometry.radius * 3 };
}

function meetsTarget(orb: Orb, g: Arena): boolean {
  return distance(orb, g.target) < g.target.r + g.radius * .58;
}

export function predict(world: World): { points: Vec[]; locked: boolean; banks: number } {
  if (world.mode !== "aiming" || Math.hypot(world.pull.x, world.pull.y) < 8) {
    return { points: [], locked: false, banks: 0 };
  }
  const start = arena(world.w, world.h, world.stage, world.stageElapsed);
  const orb: Orb = { ...world.orb, vx: -world.pull.x * start.power, vy: -world.pull.y * start.power };
  const points: Vec[] = [{ x: orb.x, y: orb.y }];
  const dt = 1 / 120;
  let banks = 0;
  for (let i = 1; i <= 420; i++) {
    const g = arena(world.w, world.h, world.stage, world.stageElapsed + i * dt);
    const result = advanceOrb(orb, g, world.w, world.h, dt);
    if (result.bounce) banks++;
    if (i % 9 === 0) points.push({ x: orb.x, y: orb.y });
    if (meetsTarget(orb, g)) return { points, locked: true, banks };
    if (result.out) break;
  }
  return { points, locked: false, banks };
}

export function update(world: World, dt: number): Event[] {
  const events: Event[] = [];
  const delta = clamp(dt, 0, .06);
  if (world.active && world.mode !== "won" && world.mode !== "lost") world.elapsed += delta;
  world.stageElapsed += delta;
  if (world.mode === "flying") {
    const count = Math.ceil(delta / (1 / 120));
    const step = delta / Math.max(1, count);
    const stageStart = world.stageElapsed - delta;
    for (let i = 0; i < count; i++) {
      world.flightElapsed += step;
      const geometry = arena(world.w, world.h, world.stage, stageStart + (i + 1) * step);
      const result = advanceOrb(world.orb, geometry, world.w, world.h, step);
      if (result.bounce) {
        world.bumps++;
        if (world.bumps <= 6) events.push("bounce");
      }
      if (world.trail.length === 0 || distance(world.orb, world.trail[world.trail.length - 1]) > 6) {
        world.trail.push({ x: world.orb.x, y: world.orb.y });
        if (world.trail.length > 36) world.trail.shift();
      }
      if (meetsTarget(world.orb, geometry)) {
        world.mode = "scored";
        world.settleElapsed = 0;
        const precisionBonus = Math.max(0, 300 - (world.attempts - 1) * 85);
        const bankBonus = world.bumps > 0 ? 180 : 0;
        const speedBonus = Math.max(0, 220 - Math.floor(world.stageElapsed * 9));
        world.score += 650 + precisionBonus + bankBonus + speedBonus;
        world.lastResult = world.bumps ? "bank" : "hit";
        events.push("hit");
        break;
      }
      if (result.out || world.flightElapsed > 5) {
        world.mode = world.charge <= 0 ? "lost" : "ready";
        world.lastResult = "miss";
        world.pull = { x: 0, y: 0 };
        world.trail = [];
        const a = arena(world.w, world.h, world.stage, world.stageElapsed).anchor;
        world.orb = { ...a, vx: 0, vy: 0 };
        events.push(world.mode === "lost" ? "lost" : "miss");
        break;
      }
    }
  }
  if (world.mode === "scored") {
    world.settleElapsed += delta;
    if (world.settleElapsed > .95) {
      if (world.stage >= STAGE_COUNT - 1) {
        world.mode = "won";
        events.push("won");
      } else {
        world.stage++;
        world.stageElapsed = 0;
        world.mode = "ready";
        world.attempts = 0;
        world.bumps = 0;
        world.charge = Math.min(9, world.charge + 2);
        const a = arena(world.w, world.h, world.stage).anchor;
        world.orb = { ...a, vx: 0, vy: 0 };
        world.pull = { x: 0, y: 0 };
        world.trail = [];
        world.lastResult = "none";
        events.push("advance");
      }
    }
  }
  return events;
}

