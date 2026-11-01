# Synthetic Menagerie: safe interior camera navigation

## Defect

The uploaded iPhone recording (November 1, 2026) showed that unrestricted
OrbitControls rotation, elevation and zoom could direct the camera at blank
side walls, the ceiling and the floor, or take the viewpoint outside the
hall's visible architectural geometry. The collection lost orientation
and seemed broken even though the WebGL scene was still rendering.

## Scope

A targeted camera/navigation fix to the existing museum shell. Preserve
approved architecture, lighting, exhibit positions, copy, the shared
three-dimensional scene, six exhibit destinations and noindex preview.

## Implementation

- components/menagerie/cameraConstraints.ts contains pure, testable
  entrance and exhibit view safety bounds.
- Entrance: ±0.245 rad azimuth from center, 1.38–1.59 rad polar,
  14.8–22.35 world-unit dolly range. This preserves the interior
  establishing shot rather than letting the visitor zoom through walls.
- Exhibit: ±0.335 rad relative to the selected plinth, 1.20–1.65 rad
  polar, 4.2–8.8 unit dolly. Users can inspect from different angles
  while remaining inside the designed exhibition area.
- The camera has final backstop bounds: x ±9.3, y 1.25–7.55,
  z -17.6 to +18.35. These correspond to the existing 3D hall.
- Bounds are relaxed ONLY while the camera travels automatically from
  one known-safe viewing position to another. They are reinstated once
  the guided move finishes.
- Visitors can interrupt a guided move with a drag; the camera stops
  traveling and stays constrained around its present orientation.
- Guided camera interpolation uses wall-clock time so slow GPU rendering
  does not make an exhibit transition appear stuck.
- Reset View works even when the entrance is already selected. The same
  control reads Entrance when the user is visiting a station.
- The optional cameraDebug=1 query exposes read-only testing coordinates
  on the canvas. This is not analytics and is never shown normally.

## Verification

- Run node scripts/verify-menagerie-camera.mjs: 14 camera profiles covering
  entrance and six exhibits on desktop and mobile. 378 sampled extrema
  across yaw, pitch and dolly remain inside the safe interior volume.
- Existing node scripts/verify-menagerie-shell.mjs confirms six exhibit
  positions, navigation and future model mounting anchors remain intact.
- Chromium desktop/mobile browser tests reproduce large horizontal,
  vertical and diagonal swipes, extreme wheel/pinch zoom, guided focus and
  return to entrance. All six exhibit destinations were traversed.
- Screenshot review after abusive input confirms the plinths, bronze
  elements and cyan gallery lighting remain visible rather than blank walls.
- Axe WCAG A/AA on tested desktop/mobile viewports reports no violations.
  Reduced-motion navigation, no-JavaScript fallback and WebKit mobile touch
  navigation were also tested.
- TypeScript, ESLint and Next production build passed.

## Shipping

Feature preview only. Do not merge or update public navigation or production
until Rafael reviews the improved gallery camera. Emulated mobile testing
is not equivalent to physical iPhone Safari testing.

