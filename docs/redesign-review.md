# Warm & Personal refinement review — PR #1

Review date: October 16, 2026. Branch: `redesign/warm-personal-career-first`.

The approved second pass groups Rafael’s experience into Global Sports & Events, Enterprise SaaS & Customer Success, and Service Operations & Leadership. FIFA is the primary professional feature; IMG Tickets / Miami Open is a supporting earlier chapter. The homepage is shorter and more visual, with one large Lighthouse capture and compact links to the other independent projects.

## Preview and scope

- [Updated Vercel preview](https://rlemor-jonmogcv5-rafael-lemors-projects.vercel.app) — existing Vercel authentication applies.
- Application commit: `0470b2eacdd07c0c166e4143b5941e17ece79b22`; deployment `dpl_J2K8zVEaKfND6uF3TL9CfrTmirXd` is READY, from the existing Git integration.
- Refinement baseline: `08fb97b` (the first-pass application plus the approved refinement brief).
- Production baseline remains `86f38476eb7dcb6e4523b97740c2fad06d4db3f5`. No merge or production deployment was performed.
- [Approved refinement specification](warm-personal-refinement-brief.md).

Changes are limited to Home, Work, global color tokens, the icon, and a few palette substitutions in shared/About/Contact/Projects styles. No new dependency or production asset was added during this pass.

## Before and after

Measurements use the same browser method before and after: whitespace-separated words inside `main`, decoded images, loaded fonts, and actual rendered dimensions. Navigation and footer text are excluded.

| Homepage measure | First pass | Refined |
| --- | --- | --- |
| Visible copy | 426 words | 250 words — 41% less |
| Major sections | 6 | 4 — 33% fewer |
| Height at 1440px | 3,540px | 2,520px — 29% shorter |
| Height at 390px | 5,351px | 3,353px — 37% shorter |
| Lighthouse image at 1440px | About 396px inside a 430px frame | 682px, 57.8% of its row, without a frame |
| Lighthouse image at 1024px | Smaller framed image | 550px, 57.2% of its row |

The three experience areas use open editorial rows. Selected relationships are a short band with immediate employer context. MyPepProtocol and World Cup Tracker retain concise context and their existing destinations. The personal note and direct contact links share one pale-yellow section; repeated taglines and project CTAs have been removed.

| View | Before refinement | Current preview |
| --- | --- | --- |
| Home, 1440px | [First pass](review/home-after-1440.webp) | [Refined](review/refinement-home-1440.webp) |
| Home, 390px | [First pass](review/home-after-390.webp) | [Refined](review/refinement-home-390.webp) |
| Work, 1440px | [First pass](review/work-1440.webp) | [Refined](review/refinement-work-1440.webp) |
| Work, 390px | — | [Refined](review/refinement-work-390.webp) |

Only these four selected review images are retained as PR documentation. The local harness, full screenshot matrix, raw results, and temporary files remain in ignored `.qa/`.

## Visual system

Ivory `#FFFCF7`, Lora headings, DM Sans body, and dark ink remain. Blue `#315BC6` is used for links and selected headings; dark green `#23675A` for smaller editorial labels; coral `#E46A4C` for a short decorative rule; soft yellow for the contact surface. These accents provide rhythm without colored cards.

Against ivory, contrast is 13.06:1 for ink, 5.96:1 for blue, and 6.50:1 for dark green. Coral is decorative and never used as small text. Secondary body text uses the same dark ink as primary text. The site remains light-only.

## Validation

- `npm run lint`, `npx tsc --noEmit`, and the final production build passed on Next.js 16.3.8. Installed local Next.js guidance was reviewed before implementation.
- Local production-server checks passed on all six principal routes at 1440, 1024, 768, 390, and 320px, including image decoding, overflow, fonts, canonicals, mobile navigation, screenshot dialogs, and contact links.
- The actual protected Vercel preview passed the same 30 page/viewport checks. Every image decoded, text/navigation remained readable, and no page overflow or browser runtime error was found. All internal page links and their fragments were checked against the rendered target pages.
- Additional hosted assertions confirmed exactly three homepage experience rows, four homepage sections, seven chronological jobs on Work, all preserved/new Work anchors, and a larger FIFA heading than Miami Open at every requested width. Lighthouse’s actual displayed image width is 55–60% of its desktop row; it fills the content width on tablet/mobile.
- Axe WCAG A/AA scans returned zero violations across 18 page/viewport audits and 12 open-dialog audits. All four screenshot triggers passed Enter/Space opening, Escape/Close dismissal, keyboard-scroll availability, focus return, and page-scroll restoration at 1440, 390, and 320px.
- Verified light-only styling under a dark device preference, reduced-motion scrolling, skip-link focus, actual Contact navigation, exact email/LinkedIn links, canonical URLs, sitemap, the legacy 308 redirect with query-string preservation, and a genuine 404 response.
- Independent product/visual critic review passed for Home and Work at 1440, 768, 390, and 320px. Review focused on career-first hierarchy, FIFA prominence, Miami Open’s supporting role, open rows, palette restraint, Lighthouse size, and mobile wrapping/spacing. No remaining implementation finding was identified.

## Preservation and release gates

- All six principal page routes, canonical URLs, sitemap entries, the legacy `/work/mypepprotocol` redirect, navigation, skip link, email, and LinkedIn destinations remain.
- All four MyPepProtocol decision chapters, evidence/caveats, lessons, status, and live CTA are unchanged. Project page content and the screenshot viewer’s behavior are unchanged.
- Work retains all seven chronological entries, including Independent Consulting. CHEQ appears once in the employment timeline and is cross-referenced between its customer-success and venue-implementation contexts.
- FIFA’s qualified four-tournament metrics and personally managed Coca-Cola/Bank of America relationships remain. Shibumi’s verified results, Inktel’s Williams-Sonoma service-delivery context, and TEN’s travel concierge/client-experience role remain intact.
- Existing `#fifa`, `#miami-open`, and `#career` anchors survive. Home links to `#sports-events`, `#enterprise`, and `#service-operations`.
- The existing public portrait and authentic project captures are reused. No new FIFA photograph or official event graphic was published. Photograph selection and publication rights/consent remain a release gate.
- FIFA’s official title is still unresolved; **Commercial Partner Ticketing / CRM Operations** remains the neutral descriptor. Specific Formula 1 responsibilities, Qualcomm attribution, and Panini/host-city claims remain omitted pending confirmation.

Rafael’s explicit approval is required before merge or production release.
