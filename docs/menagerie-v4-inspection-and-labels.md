# Menagerie V4: unobstructed inspection and crisp labels

## User-reported defects

1. The uploaded November 1, 2026 iPhone recording shows the Medusa viewer losing the creature behind a large pale wall as the visitor rotates the camera. The visitor can also see unnecessary vertical architectural posts.
2. An iPhone screenshot highlights a tiny, blurred name plaque below the Octave specimen in the main white gallery. The nameplate was drawn into a 1024 x 256 HTML CanvasTexture and projected onto a small 3D plane at a distance. On an actual iPhone it became much too small and low resolution to read.

## Engineering fixes

### Independent interactive exhibits

- The four dedicated Aether, Medusa, Atlas and Frog viewers have their rear box wall and surrounding vertical posts removed. They retain their original model geometry, embedded animation, GLB loading, interactive action buttons, zoom, play/pause, two lighting modes, and reset controls.
- Each creature remains surrounded by empty white space and a large neutral floor. The entire object is visible during 360-degree horizontal inspection.
- Pole bounds stop camera movement from descending below the floor, and zoom is limited to a useful inspection range.
- The dedicated Obsidian Spectrum Octave viewer also has its enclosing rear and side walls removed while preserving its black-chrome sculpture, rainbow suction cups, glows, optics, cinematic plinth, skeletal animation and existing controls.
- The Experimental Chassis (the original 08) continues to use its original, untouched KineticOctopus component, so Extend, Disassemble, X-Ray, Drag-to-Dock and reassembly are preserved.

### Crisp plaque labels

- Removed the low-resolution texture-based names from the 3D shelf entirely.
- Added six real HTML/CSS exhibit plaques. Each is projected from a fixed 3D point on its corresponding shelf into the overlay on every camera frame.
- Typography stays sharp and at a readable size on Retina displays. The plaques move naturally as the camera glides horizontally between exhibits.
- Labels are pointer-events:none and aria-hidden because equivalent fully accessible exhibit names already appear in the collection index and focus summary. Plaques do not block touch gestures or direct 3D specimen selection.
- Rendering avoids React state updates per frame. The 3D viewer sends an array of screen positions, and label refs are styled directly.

## Verification

- Run node scripts/verify-menagerie-inspection.mjs to check structural invariants and preservation of the original interaction flows.
- Run existing TypeScript, lint, production-build, rail, and GLB tests.
- Test Chromium desktop, mobile-emulated Chromium, and mobile WebKit for sharp labels, six exhibit names, GLB initialization and zero errors.
- Reproduce the supplied Medusa recording: orbit repeatedly to far side and photograph each orientation. The character remains unobstructed and saturated.
- Repeat obstruction tests for Aether, Atlas, Frog and Obsidian Spectrum Octave.
- Perform accessibility and mobile gesture regression checks; no physical iPhone has been tested by the automated QA harness.
- Keep this review on an isolated feature branch, unlisted and noindex. Production is unchanged.

## Release standard

The preview is a **review candidate**, not a production update. Do not merge or change any public navigation without Rafael's approval.

