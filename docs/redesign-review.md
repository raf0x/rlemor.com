# Warm & Personal — final FIFA photo review

Review date: October 16, 2026. Branch: `redesign/warm-personal-career-first`. Existing [draft PR #1](https://github.com/raf0x/rlemor.com/pull/1).

## Final FIFA matchday integration

[Final application preview: Work](https://rlemor-h85cqqd76-rafael-lemors-projects.vercel.app/work). Existing Vercel authentication applies. Verified application commit: `6b3dec88d08759bb8dc6ee907fe385f751ff7dc2`; the following documentation commit only adds review evidence.

Rafael approved public use of his matchday photograph, originally `IMG_6690 (1).jpeg`. Only the selected optimized WebP was copied to `public/images/fifa-world-cup-2026-matchday.webp`: 1600×1200, 376,340 bytes, SHA-256 `744d99ff8e95dee9664d9c0c4d83fd5bf79c038faf4878c478be2bba64c11887`. The production asset is byte-identical to the supplied WebP. Source photographs and handoff files remain outside Git.

One semantic figure now sits within the Work FIFA feature, after both responsibility paragraphs and before the metrics. Next.js Image uses intrinsic dimensions and responsive sizes; the full natural 4:3 composition remains visible with `object-fit: contain`. A dark 15px caption, modest spacing and square edges preserve the editorial treatment without decorative framing.

- Alt: “FIFA World Cup 2026 stadium ceremony with France and England flags displayed across the pitch.”
- Caption: “FIFA World Cup 2026. A matchday view I photographed while working in tournament ticketing operations.”

| Fresh hosted Work screenshots | Review evidence |
| --- | --- |
| Desktop · 1440px | [Full page](review/matchday-work-1440.webp) |
| Mobile · 390px | [Full page](review/matchday-work-390.webp) |

Final QA passed locally and against the actual protected preview:

- `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed.
- All six routes at 1440, 1024, 768, 390 and 320px: 30 page/viewport checks, decoded images, loaded fonts, no horizontal overflow or browser runtime errors. Photo placement, exact alt/caption, natural ratio, dark caption and unframed styling passed at every width.
- 18 page and 12 open-dialog Axe WCAG A/AA audits: zero violations. All four screenshot/artwork controls passed keyboard opening, scrolling, Escape/Close, focus return and scroll restoration. Reduced motion, skip-link focus, mobile navigation and light-only styling passed.
- All internal routes/fragments and ten Work anchors resolved. Exact contact destinations, canonicals, sitemap, legacy `/work/mypepprotocol` 308 with query preservation, and 404 behavior passed. The three external live projects and both GitHub project links returned HTTP 200.
- The hosted original matchday WebP and both approved project PNGs were fetched and SHA-256 matched. Lighthouse imagery, circular portraits and authentic case-study screenshots remain intact. Independent source and hosted visual review passed at all five widths.
- Only Work TSX/CSS and the selected WebP changed in the application commit. Home, About, Contact, Projects, case-study content, shared components and dependencies are unchanged from `1daa42d`; its World Cup Tracker “View Project” cleanup is preserved.

The older group photograph `IMG_6743.jpeg` remains uncommitted and unpublished. Draft PR #1 stops for Rafael’s final product/design and release review. No merge or production deployment was performed; production remains on `86f38476eb7dcb6e4523b97740c2fad06d4db3f5`.

## Earlier approved editorial refinement

The earlier pass implemented all five decisions in the [approved editorial brief](editorial-refinement-brief.md). Work is now a selective introduction to three professional strengths rather than a résumé. The warm visual system and career-first homepage remain intact. The following evidence records that earlier pass; the final preview and Work screenshots are above.

## Earlier preview and changes

- [Earlier editorial Vercel preview](https://rlemor-j2mraef95-rafael-lemors-projects.vercel.app); existing Vercel authentication applies.
- Application commit: `319539934d3e2c5e0fa038967128fc7f6ab5dcda`.
- Before-refinement baseline: `b88b8ca`; production remains on `86f38476eb7dcb6e4523b97740c2fad06d4db3f5`.

| Approved refinement | Implementation |
| --- | --- |
| Remove résumé chronology | Deleted the full Work timeline, career array, role/date stacks and obsolete date-grid styles. The three specialties keep meaningful examples and qualified results. `#career` now targets the visible introduction. |
| MyPepProtocol concept artwork | The supplied full 1672×941 composition is the Projects lead visual. Caption, alternative text, enlargement control, instructions and region label identify it as artwork. Genuine case-study screens remain unchanged. |
| World Cup historical capture | The supplied complete 894×940 image is the Projects lead visual. Adjacent copy identifies a historical snapshot of the completed tournament, an independent/unofficial project, and no FIFA affiliation or endorsement. Original LIVE/status pixels are unaltered. |
| Circular portraits | Home and About use the same real square photograph with a true 1:1 circular treatment, `object-fit: cover`, centered positioning and no extra zoom. |
| Organization emphasis | FIFA remains bold blue in the primary sports narrative. Shibumi, CHEQ, Inktel, TEN Lifestyle Group and selected account/venue names are semantic strong text in dark ink; static names do not become links. |

There are no new dependencies, routes, libraries or unrelated feature changes. Homepage project links remain compact text links for MyPepProtocol and World Cup Tracker.

## Before / after screenshots

Before images show the preceding application; after images are captured from the protected preview above. Images are selected PR documentation, not the complete local QA output.

| Page / viewport | Before | After |
| --- | --- | --- |
| Home · 1440px | [Before](review/editorial-before-home-1440.webp) | [After](review/editorial-after-home-1440.webp) |
| Home · 390px | [Before](review/editorial-before-home-390.webp) | [After](review/editorial-after-home-390.webp) |
| Work · 1440px | [Before](review/editorial-before-work-1440.webp) | [After](review/editorial-after-work-1440.webp) |
| Work · 390px | [Before](review/editorial-before-work-390.webp) | [After](review/editorial-after-work-390.webp) |
| Projects · 1440px | [Before](review/editorial-before-projects-1440.webp) | [After](review/editorial-after-projects-1440.webp) |
| Projects · 390px | [Before](review/editorial-before-projects-390.webp) | [After](review/editorial-after-projects-390.webp) |

## Selected production images and fidelity

Only the two approved images were copied into `public/projects/`. Both production files are byte-identical to the handoff originals. No crop, redraw, text overlay, status alteration or source upscaling was performed. `next/image` serves responsive previews; enlarged images load only when opened.

| Production asset | Source dimensions / SHA-256 |
| --- | --- |
| `public/projects/mypepprotocol/concept-artwork.png` | 1672×941; 2,850,708 bytes; `5f76ff99d2082f3ddc2a9995e1cfbe678deebc827d548552bd54c2dfbc5fdc04` |
| `public/projects/world-cup-tracker/historical-tournament.png` | 894×940; 276,236 bytes; `0959ab94b593f1b3eff19ffe616ca52d892d7e032408ff58e82df05b33835c70` |

The MyPepProtocol image is promotional concept artwork with illustrative widgets/values, not verified working-app UI or clinical data. The World Cup image is a historical capture; its original in-progress wording does not describe the tournament’s current status. It enlarges at its 894px source width and scrolls without interpolation beyond the original pixels.

`design-handoff/` and the duplicate local `editorial-assets/` source folder are ignored. The extracted files, source README/manifest, private mockup, unapproved FIFA team photograph, local test harness, full screenshot matrix and raw QA output remain outside the commits and preview source.

## QA

- `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed with the installed Next.js 16.3.8 documentation reviewed before editing.
- Local production-server checks passed on all six pages at 1440, 1024, 768, 390 and 320px.
- The actual protected Vercel preview passed all 30 page/viewport checks across the same five widths, with decoded images, loaded fonts, no horizontal overflow and no browser runtime errors. All internal route/fragment links resolved against rendered target pages.
- Hosted assertions confirmed three editorial Work specialties, no ordered chronology or rejected timeline heading, `#career` on the introduction, and all ten preserved Work anchors. Home still has four focused sections and the large Lighthouse visual; both portrait treatments are square circles at every width. Required Home organization names are bold dark ink, FIFA is bold blue, and static emphasized names are not links.
- Artwork and historical-image dimensions, natural aspect ratios, accessible enlargement labels and factual captions passed. Both hosted original PNG files were fetched and SHA-256 checked against the handoff manifest: byte-identical.
- All four enlargement controls passed at 1440, 390 and 320px: Enter/Space opening, actual keyboard scrolling when overflow exists, Escape/Close dismissal, focus return, scroll restoration and no display beyond source resolution. The case-study viewer retains its default screenshot terminology; the concept image uses artwork terminology throughout.
- Axe WCAG A/AA scans reported zero violations across 18 page/viewport audits and 12 open-dialog audits. Skip-link focus, mobile navigation, reduced motion, light-only styling under a dark device preference, exact contact destinations, canonical URLs, sitemap, the legacy 308 redirect with query-string preservation and a genuine 404 response passed.
- Independent source and visual review passed on Home, Work, Projects and About across all five requested widths. Review covered portrait/head visibility, editorial hierarchy without chronology, bold naming and attribution, full image composition, honest artwork/historical captions, and natural-resolution enlargement.

## Preserved substance and release gates

- All four MyPepProtocol decision chapters, evidence/caveats, lessons, status, authentic case-study images and live CTA are unchanged.
- All six page routes, canonicals, sitemap entries, contact links, navigation, skip link and the legacy `/work/mypepprotocol` redirect survive.
- Work retains `#sports-events`, `#enterprise`, `#service-operations`, `#fifa`, `#miami-open`, `#shibumi`, `#cheq`, `#inktel` and `#ten-lifestyle`; `#career` lands at the introduction.
- FIFA’s qualified four-tournament results and personally managed Coca-Cola/Bank of America relationships remain. Shibumi’s verified results, Inktel’s Williams-Sonoma service-delivery context, CHEQ’s implementation context, TEN’s concierge/client-experience work, and Miami Open responsibilities remain accurate.
- FIFA’s official title is unresolved. The editorial narrative describes the work without asserting an official title. Unverified Formula 1 responsibilities, Qualcomm attribution, and Panini/host-city claims remain omitted.
- The earlier FIFA group photograph (`IMG_6743.jpeg`) is not committed or published. The separately approved matchday photograph is integrated as documented above.

This preview is for product/design review. No merge or production deployment was performed; Rafael’s explicit release approval is still required.
