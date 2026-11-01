# OCTAVE / 08 V3: reference-first reconstruction

## Reference and intent

- Primary reference supplied by Rafael: ScreenRecording_10-31-2026 15-35-05_1.mp4, 27.07 seconds.
- Methodology: [elvarofficial/teardown](https://github.com/elvarofficial/teardown) (MIT), especially mechanical solvers, scripted timelines, screenshot review and shared readouts.
- This is an **original stylized machine**, not a representation of a working production robot. Geometry uses normalized simulation units; no physical pressure/force figures are claimed.
- Existing V2 remains live and untouched at /lab/octave-08-b48fb96e068b80318c2b. V3 runs in a separate unlisted preview route.

## Visual reference beats

| Timestamp | Reference observation | V3 design criterion |
| --- | --- | --- |
| 0–2s | Side angle reveals complex links and optic housing | Layered iris and radial chains with visible mechanical continuity |
| 4–6s | Full octopus silhouette with curled tentacles | Eight articulated chains with terminal curling |
| 8–10s | Opening shell reveals inner frame | Real 3D internal frame; cutaway through material transparency |
| 12s | Arm subsystem is displaced along a docking axis | Coherent connected subassemblies |
| 18s+ | Dense controls stay legible during motion | Readouts sampled from the same scene state |

## Mechanical constraints

- One pure solver: components/octave-v3/kinematics.ts, no Three.js.
- tourAt(t) and poseAt(input) must produce identical results for identical inputs, with no randomness or clock calls.
- 8 arms, 18 links per arm, 12 shell panels, an optical core and visible interior truss.
- Disassemble translates an entire connected arm with its mounting hub; shell petals separate along their measured normals without changing orientation.
- The rig, camera director and HUD all sample one authoritative state. Every displayed quantity derives from that state.
- Mouse and touch manipulation use a camera-facing drag plane, local-coordinate offsets and damped reattachment on release.
- The timeline scrubs to exact timestamps and is capable of deterministic automated frame captures.
- A vivid spectral palette belongs on the robot, balanced with pearl ceramic, titanium and graphite. Avoid unnecessary gradient/glow treatments.
- Frame zero displays a legible complete model.

## Frame review

1. Capture full-view stills at 0, 2.5, 6.5, 9, 12.5, 14, 17.5, 20.5, 24 seconds.
2. Capture every 0.2s through disassembly and reassembly critical transitions.
3. Check connection alignment, shell normals, no accidental gaps or collisions, coherent camera framing, correct state readouts and no clipped UI.
4. Run Chromium and WebKit at desktop 1440/1024, tablet 768, mobile 390/320 and test dragging/reassembly.
5. Validate reduced-motion, no-WebGL fallback, index exclusion, route independence and performance tiers.

## Release gate

Do not merge V3 or replace the existing hidden route until screenshot review, pure kinematics tests, browser accessibility/interaction checks and visual approval. Keep rlemor.com production unchanged.