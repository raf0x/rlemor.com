# Editorial refinement 3 — product/design review

Review date: October 16, 2026. Branch: `redesign/warm-personal-career-first`. Existing [draft PR #1](https://github.com/raf0x/rlemor.com/pull/1).

This pass implements all five decisions in the [approved editorial brief](editorial-refinement-brief.md). Work is now a selective introduction to three professional strengths rather than a résumé. The warm visual system and career-first homepage remain intact.

## Preview and changes

- [Updated Vercel preview](https://rlemor-j2mraef95-rafael-lemors-projects.vercel.app); existing Vercel authentication applies.
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
- The new FIFA team photograph is not committed or published. Specific photo selection and publication rights/consent still require Rafael’s approval.

This preview is for product/design review. No merge or production deployment was performed; Rafael’s explicit release approval is still required.
