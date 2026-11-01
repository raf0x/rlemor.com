# The Synthetic Menagerie
## Architecture Study 00, isolated preview

### Product decision

Build and approve the museum shell *before* installing creatures. This is a
real navigable 3D hall with six designed display stations, not a 2D card grid
or a promise that unfinished exhibits already exist.

The architecture should communicate the intended museum experience on its own:
confident composition, dramatic gallery lighting, controlled metallic detail,
atmosphere, purposeful sightlines and intuitive navigation.

### Scope delivered

- Unlisted route: /lab/menagerie-preview-76cf184b
- Next.js page metadata: noindex, nofollow, noarchive
- Actual Three.js architectural environment: vaulted hall, rear focal wall,
  illuminated plinths, three stations in each side wing
- Six reserved named exhibit locations, matching the approved collection
- Click/tap a 3D plinth or choose its exhibit from the accessible index
- Smooth guided camera moves, free-look orbit, mouse wheel or pinch zoom
- Previous, next, entrance, and study/cinematic lighting controls
- Keyboard number keys 1-6, Left/Right arrows, and Escape
- Accessible selection summary, reduced-motion treatment, no-JS and WebGL
  fallbacks, fully responsive mobile layout
- No new runtime dependencies, data persistence, analytics, authentication,
  fake specimen models or public navigation

### Collection and placement contract

The shared registry in components/menagerie/exhibits.ts owns the ordering,
position, names and wing association. One local THREE.Group named
specimen-mount:<exhibit-id> is anchored at the top of each corresponding plinth.
The architectural hall and interaction system do not depend on a particular
species model.

| Station | Wing | Exhibit | Next milestone |
| --- | --- | --- | --- |
| 01 | West | Octave / Obsidian Spectrum | Install existing polished animated GLB |
| 02 | East | Octave / Experimental Chassis | Preserve old mechanical controls in an integrated exhibit experience |
| 03 | West | Aether / Manta | New original animated 3D asset |
| 04 | East | Medusa / Jellyfish | New original animated 3D asset |
| 05 | West | Atlas / Scarab | New original animated 3D asset |
| 06 | East | Frog / Amphibian | New original animated 3D asset |

All six plinths are intentionally empty in this preview. Do not confuse a
reserved installation with a completed 3D creature. In particular, do not
merge older Octave's independent Three.js canvas blindly into the same
renderer; preserve its extension, disassembly and X-ray interactions using a
dedicated exhibit mode or an isolated routed experience once approved.

### Interaction decisions

- **Arrival**: camera looks down the central aisle, presenting all six plinths.
- **Visit**: choose a station via its 3D hit volume, Previous/Next, or the
  ordered collection index; camera glides from the central aisle to its plinth.
- **Inspect**: free orbit and zoom while at a station. No forced autoplay.
- **Return**: Entrance button or Escape returns to central atrium.
- **On mobile**: single-finger orbit, pinch zoom, taps, and big navigation
  controls. Selecting from the index scrolls the gallery back into view.
- **Accessible path**: every 3D interaction has an ordinary HTML control.
- **Reduced motion**: no ambient pulses, camera jumps instead of gliding.
- **Failure mode**: collection information remains accessible if WebGL fails.

### Art direction

The hall is a dark architectural volume, with six restrained exhibit structures:
black stone-like floor, vertical machined metal ribs, bronze inlays,
ice-cyan lighting and subtly luminous plinth rings. Keep objects and
documentation independent. Avoid random particles, enormous branding,
inappropriate glassmorphism, fake metrics or decorative UI badges.

### QA / release gate

- Pure exhibit registry/position tests.
- Clean npm install, TypeScript, ESLint and Next production build.
- Chromium: 1440, 1024, 768, 390 and 320; WebKit: 1440 and 390.
- WebGL canvas rendered, six selections, correct labels, HTTP 200,
  no horizontal overflow, no JS errors, noindex metadata.
- Click/tap on actual 3D plinth; guided camera, next, previous, entrance,
  keyboard shortcuts, study light.
- WCAG 2.0/2.1 A/AA axe checks on desktop and mobile.
- Reduced motion and no-JavaScript HTML fallback.
- Actual physical iPhone GPU behavior and subjective art direction still
  require Rafael's review before promoting any of this to production.

### Release decision

**Draft and preview only.** This work branches from existing main production,
and does not modify V2, V3, First Contact, Core Shot or the spectrum sculpture.
No museum link should be added to public site navigation until the collection
and its two Octave exhibits receive explicit approval.

