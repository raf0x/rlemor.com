# OCTAVE: Core Shot, gameplay-first prototype

## Purpose

Previous OCTAVE experiments demonstrated procedural mechanical animation and
scripted emotional reactions. They did not give visitors an actual challenge.
This prototype tests **one mechanic** before investing in a 3D game world.

### The essential loop

**Grab** the charged energy core attached to Octave, **pull** to store energy,
then **release** toward the reactor. The core follows a real parabolic trajectory,
ricochets from deflectors and walls, and charges a reactor when it reaches the
target.

- Challenge 1: an open, stationary reactor. Learn the arc.
- Challenge 2: a moving reactor with one deflector. Lead your shot.
- Challenge 3: a moving reactor and two deflectors. Learn the bank shot.
- Eight starting charges, one consumed on each valid launch. Successful
  reactors return two charges, capped at nine.
- Score rewards precision (fewer attempts), speed and ricochets.
- Clear the three reactors for a result screen and replay.
- Run ends after the final charge is spent unsuccessfully, with immediate retry.

### What makes it a game rather than a demo?

There is a learnable physical skill, an explicit objective, consequences for
misses, immediate feedback, escalating challenges, and voluntary replay.
No voice-over, automatic reveal, arbitrary dialogue sequence, or waiting to
unlock the actual interaction.

### Interaction

- **Pointer/touch:** drag the glowing orb backward and release. The preview
  arc samples the same collision solver used by the live projectile. When a
  launch should succeed, the reactor and trajectory show LOCKED ON.
- **Keyboard:** focus the game; arrows change power and arc, Space/Enter
  fires, R restarts, Escape cancels aiming.
- **Sound:** subtle synthesised notes on launch, impact, success; toggleable.
  Audio starts only following an interaction, with no downloaded audio files.
- **Accessibility:** descriptive canvas label, textual status, buttons,
  responsive controls, reduced-motion visual treatment, no-JS explanation.

### Architecture

The prototype deliberately uses HTML Canvas 2D and a small pure TypeScript
physics module, not the full V3 WebGL scene. This is a gameplay spike: prove
the *feel* before building a costly 3D world or sophisticated character rig.

- physics.ts: deterministic arena, parabolic projectile, collision solver,
  predictive shot path, score, charge economy and level progression.
- draw.ts: original vector artwork, rainbow mechanical Octave, trajectory,
  target, obstacles, spring arm, hit effects.
- CoreShot.tsx: input, accessible UI, lifecycle, optional Web Audio.
- Dedicated noindex, nofollow, noarchive route under /lab/.
- No new runtime packages, authentication, database, analytics, storage,
  account system, or public navigation links.

This is intentionally separate from OCTAVE V2 production, V3 mechanical
simulation, and V4 First Contact. Do not merge or replace existing work until
the user explicitly approves the fun factor.

## Testable success criteria

Ask first-time players to play without coaching:

1. Do they discover pull-and-release within approximately ten seconds?
2. Can they complete one target without being told the controls?
3. Does the arc/ricochet feel satisfying and predictable?
4. Is level two more interesting without being unfair?
5. Do they **choose** to replay after reaching the ending or running out?

These are validation hypotheses, not measured achievements. If players do not
voluntarily replay, do not proceed to an expensive 3D treatment.

## QA gates

- Clean install, lint, TypeScript and production build.
- Physics tests: four viewport geometries, all three stages individually
  reachable; entire three-stage completion, loss condition and resize.
- Chromium + WebKit desktop/mobile: renders Canvas, correctly reports robots,
  no horizontal overflow, no runtime errors.
- Real Chromium touch gesture, desktop drag and keyboard play.
- Visual review desktop/mobile, accessibility scan, reduced motion.
- Real iPhone touch feel and GPU/thermal performance, and user's judgment of
  whether the loop is fun, must be evaluated before further development.
