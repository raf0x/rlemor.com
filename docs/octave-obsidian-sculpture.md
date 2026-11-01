# OCTAVE: Obsidian specimen, first animated 3D sculpture

## Objective

Establish a visual and technical quality gate for The Synthetic Menagerie before constructing a museum or additional robotic creatures.

The original black-chrome, cyan-eyed octopus illustration is the aesthetic target. This is a real sculptural 3D study informed by the reference, not a literal conversion of the 2D picture or a complete photorealistic reproduction.

## Files and construction

- scripts/build-octave-sculpture.py: reproducible Blender 5.0 source. Builds a curved black-chrome mantle, layered eyes, precision metal trim and eight tapered arms. Each arm has modeled suction-cup rings and seven connected bones. Includes looping 120-frame animation at 30 fps.
- public/lab/octave-sculpture/octave-obsidian.glb: real compressed GLB with embedded skeletal animation. Compatible with meshopt-capable glTF 2.0 applications.
- components/octave-sculpture/scene.ts: Three.js gallery, PBR reflections, GLB loader, Meshopt decoder, AnimationMixer, orbit and zoom, camera presets and two lighting styles.
- components/octave-sculpture/OctaveSculpture.tsx and .module.css: editorial exhibit, loading/error states, reduced-motion behavior and GLB download.
- app/lab/octave-sculpture-9d7b2a6f/page.tsx: unlisted noindex route.

No new runtime dependencies, database, analytics, authentication, CMS, or public navigation. Production V1 and previous OCTAVE experiments stay unchanged. The route is unlisted, not password-protected.

## Rebuild the model

With Blender installed, run from the repository root:

    blender -b --python scripts/build-octave-sculpture.py

The script creates editable octave-source.blend and an uncompressed octave-obsidian.glb under public/lab/octave-sculpture.

To optimize the deployed asset, with gltfpack v0.22 or later:

    gltfpack -i public/lab/octave-sculpture/octave-obsidian.glb -o octave-optimized.glb -cc -kn -si 0.45

Copy the optimized GLB over the deployed version only after validating skin and animation. The current deployed asset is the optimized one; the .blend source is generated rather than committed.

## Art direction

- Deep obsidian-black mantle with controlled silver and bronze highlights.
- Cyan front optics with physically modeled lens housings.
- Continuous, tapered arm meshes with mechanically detailed suction cups.
- Cold cyan stage lighting against warm architectural illumination.
- Dim museum gallery, illuminated circular plinth, minimal controls.

This first browser render is not equal to the reference's cinematic photorealism. Treat it as a quality gate, not a finished museum. Do not add Aether, Medusa or Atlas before reviewing the sculpt.

## QA

- Inspect the GLB binary for animation, skin and bones.
- Clean npm install, lint, TypeScript and Next production build.
- Chromium and WebKit desktop/mobile, no overflow or runtime exceptions.
- Pointer orbit/zoom, camera presets, motion pause/play, lighting toggle, reset and GLB download.
- Reduced motion, no-WebGL and no-JavaScript fallbacks.
- Actual iPhone Safari performance and touch feel remain unverified by software emulation.
- Primary gate: does the rendering quality justify an entire museum?

Status: isolated visual prototype only; production unchanged.

