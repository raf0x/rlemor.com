# Synthetic Menagerie: Study Light and Cinematic Light

## Product decision

Two genuinely distinct real-time 3D environments, selected by the museum's Study Light and Cinematic Light controls.

### Study Light

A pristine white floor and single white back wall, neutral bright illumination, readable plaques and vivid colorful creatures. Default on load.

### Cinematic Light

The same gallery with near-black polished ceramic tiles across the floor and rear wall, thin grout lines, controlled highlights and focused studio spots that make the illuminated creatures stand out. The visual language nods to dramatic black-tiled magical civic interiors without copying specific sets or assets.

The swap is an eased crossfade over roughly one second, changing 3D architecture materials, light intensities, floor and wall treatments, and UI/plaque contrast together. The original rainbow specimen animations continue in both modes.

Only one gallery rear wall remains. The approved one-row horizontal layout, smooth camera travel, wheel/touch gestures and crisp HTML plaques remain untouched.

### Individual species viewers

Aether, Medusa, Atlas and Frog use matching black-ceramic floor mode for their standalone close-up experiences, without adding obstructing walls. Their dark floor uses a textured unlit real 3D plane so strong creature spotlights cannot wash it out to gray. Their original animations and actions remain intact.

Original Obsidian Octave and Experimental Chassis routes, including their custom controls, are preserved. This feature primarily changes the museum's lighting modes; it does not rewrite the old laboratory.

### Performance and testing

A few shared small procedural textures, no external art assets, no extra runtime dependencies and no per-tile meshes. Shared gallery lighting is still used.

Verify with:

- node scripts/verify-menagerie-lighting.mjs
- node scripts/verify-menagerie-shell.mjs
- node scripts/verify-menagerie-inspection.mjs
- node scripts/verify-menagerie-installations.mjs
- npx tsc --noEmit
- npm run lint
- npm run build

WebGL browser visual QA: white and black gallery in desktop/mobile Chromium and WebKit mobile. Four dedicated creatures in desktop Chromium plus Medusa in WebKit mobile. Tests check tile darkness versus daylight whiteness, neon colors, original creature navigation, label contrast, and the ability to toggle both ways.

WCAG A/AA checks on tested white and dark gallery screens found no violations. Physical iPhone Safari sustained performance and final art approval remain outstanding.

### Shipping

Draft, unlisted preview only. Production remains untouched.

