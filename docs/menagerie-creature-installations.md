# The Synthetic Menagerie, creature installation review

## Scope

This is a separate, unlisted review of the museum, based on the camera-safeguards branch. The public rlemor.com production pages and original Octave URL remain unchanged.

All six architectural stations are populated with **real rendered 3D geometry**, not flat concept images:

- 01: Octave / Obsidian Spectrum. Reuse the existing animated 56-bone black-chrome GLB, with its sixteen vivid, cycling rainbow suction-cup emission groups. The standalone specimen page preserves orbit, cinematic/study lights, playback speed, and downloadable 3D model.
- 02: Octave / Experimental Chassis. A lightweight mechanical locator is mounted in the main hall. Selecting its exhibit opens the **unchanged original** KineticOctopus component with its authentic Drag-to-Dock, Extend, Disassemble, X-ray, sequence, and reassemble features. Keeping this original interactive WebGL implementation isolated preserves its controls and avoids colliding with the main hall's renderer.
- 03: Aether / Manta. An original animated manta-wing/glide 3D sculpture with PBR shell, cyan anatomy and hinged wings.
- 04: Medusa / Jellyfish. An original suspended creature with translucent bell, animated tendrils, and bioluminescent light channels.
- 05: Atlas / Scarab. An original armored beetle with jointed legs, hinged shell covers, wing details and an action to accentuate the unveiling.
- 06: Frog / Amphibian. An original dark-chrome articulated tree-frog with blinking-looking optical modules, four hinged limbs, throat lighting, and spring action.

## Experience

One main 3D hall contains six specimen stations, with guided camera visits, free-look, selection and lighting. Select a plinth or item in the collection index, then follow the contextual **Interact with [name]** link to its dedicated exhibit scene.

Dedicated exhibit pages have consistent navigation back to the museum and their own interactive controls. All exhibit routes are unlisted and noindex. Their controls are touch friendly. The older Octave is reused rather than rewritten.

These newly created Aether, Medusa, Atlas and Frog models are **first animated art studies**. Their geometric and material quality should be judged by Rafael before being considered the final photorealistic version or an App Store asset. No still illustrations are passed off as 3D models.

## Technical approach

- Reuse the installed Next.js, React, TypeScript, Three.js stack.
- The four new models are authored in Blender using scripts/build-menagerie-creatures.py, exported as independent animated .glb files, then optimized using gltfpack (meshopt compression).
- Shared Three.js model rendering for each creature, with glTF animation mixers and custom action controls. No new runtime dependencies.
- Reduced-motion preference starts the creature viewer motion paused.
- A single Three.js renderer in the museum hall mounts all six species. The original legacy Octave's full procedural interactive experience is visited through a separate exhibit route to preserve functionality and performance.
- No database, account system, analytics, CMS, kids AI features, or app-specific libraries were added to the museum.

## Acceptance and QA

Run:
- node scripts/verify-menagerie-installations.mjs
- node scripts/verify-octave-spectrum.mjs
- node scripts/verify-menagerie-camera.mjs
- node scripts/verify-menagerie-shell.mjs
- npx eslint app components scripts
- npx tsc --noEmit
- npm run build

Review the actual 3D quality and play controls on desktop and physical iPhone Safari. Automated Chromium/WebKit tests are helpful but are not a substitute for device inspection, tactile responsiveness, animation believability or sustained GPU performance.

## Release decision

Keep changes on a feature branch and draft PR for review. No merge to main and no changes to production until Rafael approves all six exhibits.

