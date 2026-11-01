# The Synthetic Menagerie V4: White Horizontal Gallery

## Approved direction

Six actual animated 3D specimens are displayed side by side in one horizontal gallery, against a white backdrop and a single long back wall. This replaces the enclosed, multi-row dark museum. The presentation is an open architectural exhibition, not a 2D carousel.

## Layout and material implementation

- components/menagerie/exhibits.ts is the single ordered registry. All six specimens occupy X positions -25, -15, -5, 5, 15, 25, with identical Z coordinates.
- components/menagerie/MuseumStage.ts now creates one long back wall, a white floor, wall-mounted sculptural white display shelves and six real specimen mounts. Side walls and the ceiling are gone.
- A shared, movable studio-light rig illuminates the current bay, reducing GPU work compared with six sets of spotlights.
- components/menagerie/exhibitSpectrum.ts applies vivid pulsing rainbow colors directly to selected real 3D material surfaces: Octave suction cups and optics, Aether's wing circuits, Medusa's bell and tendrils, Atlas's optic details and joint accents, and Frog's eyes, throat and toes. Base dark chrome silhouette remains visible.
- The older kinetic Octave's gallery miniature has additional neon highlights. Its independent original laboratory, including extension, disassembly, X-ray and drag-to-dock, is left intact.
- Dedicated creature exhibit stages use the same white gallery design and palette system. Original animated Blender GLB assets remain unchanged in this branch.

## Horizontal camera and interaction

- components/menagerie/galleryRail.ts implements a pure critically damped horizontal camera, independent of Three.js. Its height, depth and orientation remain fixed.
- Swiping horizontally, mouse dragging, trackpad and mouse-wheel movement, tapping a specimen, clicking an index entry, arrow-key navigation and next/previous buttons all control the same rail.
- Smooth travel can be retargeted before completing without teleportation. Dragging settles toward the nearest sculpture. The rail stops at the first or last exhibit.
- The collection index itself is one horizontally scrollable, snapping strip, not a grid.
- On touch, vertical page scrolling remains native. Reduced-motion visitors receive immediate camera changes.
- This fully removes the previous outside-wall camera failure.

## Verification and QA

Run these checks after a clean npm installation:

- node scripts/verify-menagerie-rail.mjs
- node scripts/verify-menagerie-camera.mjs
- node scripts/verify-menagerie-shell.mjs
- node scripts/verify-menagerie-installations.mjs
- node scripts/verify-octave-spectrum.mjs
- npx tsc --noEmit
- npm run lint
- npm run build

Isolated browser QA completed at Chromium viewport widths 1440, 1024, 768, 390, 320 and WebKit mobile 390. All six rendered exhibits were present. Tests confirmed visibly white frames, saturated creature colors, no horizontal page overflow, no JavaScript errors, smooth focus movement and long-distance transitions, pointer wheel movement, actual emulated touch swipes, reduced motion, and a no-JavaScript fallback.

Automated WCAG 2.0/2.1 A and AA checks on desktop 1440 and mobile 390 found zero detected violations after contrast and accessible-name fixes. Physical iPhone GPU and sustained-performance QA remains a separate approval gate.

## Release discipline

The V4 museum remains an isolated unlisted noindex experiment. Do not merge into main or modify live rlemor.com without approval. This is not a password-protected route.

## Future product

The proposed iOS children's drawing-to-life app is documented separately in docs/creature-studio-ios-concept.md. It is not included in this website release.

