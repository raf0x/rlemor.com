# Octave: spectrum suction cups

A restrained enhancement to the original Obsidian 3D sculpture. No change to
the existing gallery architecture, camera interaction or core animation.

## Visual direction

Each of the 416 modeled suction cups across eight tentacles now has a real
skinned, 3D emitting surface, a colored inner aperture and an outer light
corona. The metallic graphite rim remains visible to preserve mechanical
detail and contrast.

Sixteen shared neon color channels are scattered across all arms and both cup
rows. Every group continuously cycles through the full visible hue spectrum,
with staggered, smoothly eased intermittent pulses. Colors stay bright enough
to remain legible between pulses, and are not all synchronized.

The GLB contains static colorful apertures and its original looping skeletal
animation. The web preview's real-time Three.js scene drives color variation.
The color effect is not independently embedded as a GLB animation.

## Architecture and performance

- scripts/build-octave-sculpture.py: maintains a single skinned mesh per arm;
  adds low-polygon light discs and coronas that follow the real arm bones.
- components/octave-sculpture/scene.ts: maps 16 named imported palette
  materials to shared, unlit additive MeshBasicMaterial renderers, with vivid
  RGB hues and smooth staggered brightness.
- No per-cup individual point lights, particles, additional JS packages or
  full-frame bloom shaders. 16 palette updates are capped at 26Hz.
- Pausing the exhibit freezes motion and color. Reduced-motion users start
  with a colorful static sculpture, with optional manual playback.
- The still=1&spectrumAt=1.5 query enables deterministic visual captures to
  compare color at exact timestamps, rather than arbitrary real-time moments.

## Quality gates

- Run node scripts/verify-octave-spectrum.mjs to validate eight skinned arms,
  all sixteen channels on each arm, preserved skeletal animation and cup count.
- Chromium and WebKit viewport screenshots, 1440/768/390/320 where supported.
- Compare exact-color timestamps to ensure a perceptible change.
- Confirm no horizontal overflow, JS errors, or missing WebGL rendering.
- Real-device iPhone frame-rate, GPU thermal behavior and aesthetic review
  remain separate approval gates.

This preview is on a feature branch and should not be merged to production
without user approval.
