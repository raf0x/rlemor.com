# OCTAVE / 08 V4: First Contact

## Product hypothesis

The previous mechanical simulator demonstrated articulated motion but had no visitor goal. V4 is a short, interactive encounter with an apparent living creature. It should make sense without a tutorial, provide visible consequences to user input, and culminate in one deliberate transformation.

This is *scripted expressive behavior*, not an AI agent, sentience, object recognition, or an anatomically/physically accurate robot. No analytics, account, database, external API, or audio permission is required.

## Core loop

1. **Notice**: approach with pointer, or tap / keyboard action. Optical pupil and arm notice.
2. **Startle**: touch once; responsive recoil and dimmed energy.
3. **Return**: an arm reaches toward the visitor as it recovers. Touch a second time.
4. **Trust**: coordinated response; 8.8-second opening exposes the inner chassis.
5. **Play**: in the connected state, move and drag components. Release returns them home. Restart is always available.

Touch-only users need three taps total: wake, startle, connect. On desktop, passive proximity may perform step one. Separate explicit contact and restart controls provide a keyboard path.

No autoplay takeover: V4 does not show its reveal until the user interacts. For reduced-motion preferences, mechanical movement is minimized and an open still is used before returning to the final state. WebGL/JS fallbacks explain requirements.

## Architecture

- V3's pure geometric kinematics remains the one authoritative mechanical pose solver.
- The octave-v4/behavior.ts file is a pure, deterministic choreography layer, with no browser, 3D engine or timing side effects.
- The octave-v4/FirstContact.tsx component owns interactive state, proximity, touch, Drag-to-Dock and the WebGL lifecycle.
- A backwards-compatible optional setExpression() method on the shared V3 scene moves only three existing pupil meshes. V3 never calls it, and therefore retains its prior appearance.
- Dedicated V4 route, metadata noindex, nofollow, noarchive. No navigation or sitemap links, no production changes.
- The moment=unaware|noticed|startled|curious|connected|reveal|complete&seconds=4.4 query freezes a preview pose for screenshot QA.

## Release gates

- Test pure behavior and geometry with node scripts/verify-octave-v4.mjs.
- Run clean npm install, ESLint, TypeScript check, Next.js production build.
- Real browser validation on Chromium and WebKit desktop/mobile: initialization, 3D pixels, no horizontal overflow, touch or mouse flow and restart, keyboard path, reduced motion and no-JS fallback.
- Visual inspect complete state, opening/closure and all viewport compositions, avoid blocking buttons or copy.
- Get Rafael's approval on actual physical-device feel, particularly iOS Safari GPU performance, before merging.
- Do not merge or alter production before review.
