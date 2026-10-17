# Warm & Personal redesign review

Review date: October 16, 2026. Branch: `redesign/warm-personal-career-first`.

The homepage now introduces Rafael through customer success, enterprise account management, and large-event operations. FIFA and IMG Tickets / Miami Open lead the experience section; independent projects follow the professional story and account context. The approved warm ivory, terracotta, Lora, DM Sans, fine rules, and open editorial rows are used throughout.

## Preview and scope

- [Vercel preview](https://rlemor-hvngfvc8j-rafael-lemors-projects.vercel.app) — existing Vercel access controls apply.
- Application commit: `3a1c615cc536b6e7b83d37d4e2ffc7329b23bd53`.
- Baseline: `86f38476eb7dcb6e4523b97740c2fad06d4db3f5`; remote `main` matched this baseline when fetched.
- Preview deployment: `dpl_H9R2Ga6Nawbszu5xhhWSmQG6Nn42`, built through the existing Git integration. No production deployment or merge was performed.

| Area | Files and behavior |
| --- | --- |
| Shared design | `app/layout.tsx`, `app/globals.css`, `app/icon.svg`, header/footer components and styles: fonts, light palette, visible focus, skip link, Work navigation and current-page styling |
| Homepage | `app/page.tsx`, `app/page.module.css`: professional introduction, FIFA/IMG stories, contextual accounts, secondary independent projects, personal note and contact |
| Experience | `app/work/page.tsx`, `app/work/work.module.css`: featured FIFA/IMG stories and complete reverse-chronological career history |
| Compatibility and SEO | `next.config.ts`, `app/sitemap.ts`, page metadata: real `/work`, retained `/work/mypepprotocol` redirect, canonicals and sitemap |
| Projects | Projects page/styles, `ScreenshotViewer` and three selected captures: large authentic screenshots, native dialog, keyboard scrolling, Escape/Close and focus return |
| Existing case study | `app/projects/mypepprotocol/`: all four decision chapters, constraints, evidence, lessons, status and live CTA preserved; typography and screenshot presentation updated |
| Personal/contact | About and Contact pages/styles: personal backstory, existing photography and exact contact destinations |
| QA support | Ignored `.qa/` directory; no test package was added to the application's dependencies |

## Evidence

The before captures show the existing public homepage; the after captures come from the protected Vercel preview above. Only existing public photography appears in these captures.

| View | Before | After |
| --- | --- | --- |
| Homepage, 1440px | [Before](review/home-before-1440.webp) | [After](review/home-after-1440.webp) |
| Homepage, 390px | [Before](review/home-before-390.webp) | [After](review/home-after-390.webp) |

Additional preview evidence: [Work at 1440px](review/work-1440.webp), [Projects at 1440px](review/projects-1440.webp), [Contact at 320px](review/contact-320.webp), [screenshot dialog at 320px](review/modal-320.webp).

## Validation

- `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed. The build uses Next.js 16.3.8 and the installed local documentation was reviewed before implementation.
- Local production-server browser checks passed for all six principal pages at 1440, 1024, 768, 390, and 320 pixels.
- The hosted preview passed the same 30 page/viewport checks. Every image decoded, all four primary navigation items remained visible with 44px-high targets, the warm background and Lora heading font were confirmed, and there was no horizontal overflow, broken in-page anchor or browser runtime error.
- Axe WCAG A/AA scans reported zero violations across 18 page/viewport audits and 12 open-dialog audits. This automated result supplements the independent visual review; it is not a claim of exhaustive accessibility certification.
- All four screenshot triggers were exercised at 1440, 390 and 320 pixels: Enter/Space opened the dialog, the full-size image loaded, keyboard scrolling remained available, Escape and Close dismissed it, focus returned to the trigger, and page scrolling was restored.
- Verified skip-link focus, light styling under a dark device preference, reduced-motion scroll behavior, actual Contact navigation, exact email/LinkedIn links, the legacy 308 redirect including its query string, `/work` in the sitemap, and a genuine 404 response. [Machine-readable results](review/verification.json).
- Independent code and screenshot review checked factual relationships, preserved case-study content, desktop/tablet/mobile layout, portrait/travel crops and screenshot detail. Findings fixed: UTF-8 markers that invalidated leading CSS selectors, a literal Contact arrow entity, and the smallest mobile headline's forced line break. A tablet screenshot was recaptured after image decoding.
- The local Windows image folder was normalized to match Git's existing lowercase `public/images` paths. No photograph files were added or renamed in Git.

## Selected production assets

| Asset | Provenance and treatment |
| --- | --- |
| Existing portrait and travel photographs | Already tracked public site assets; reused through `next/image`. No newly supplied group photographs selected. |
| `public/projects/lighthouse/overview-desktop.webp` | Captured October 16, 2026 from the [public Lighthouse demo](https://lighthouse-alpha-two.vercel.app/), HTTP 200, at 1440×1000 with 2× device scale. Original 2880×2000; WebP quality 94; 240,548 bytes. No AI actions, authentication, interface edits or upscaling. No visible emails, phone numbers, credentials or private-session details. Caption identifies the public-demo source. SHA-256: `a75a1188d2f0487d057560dddf255e660baed56a3afe4328dd294354381cce8d`. |
| `public/projects/mypepprotocol/overview-detail.webp` | Derived from the existing 2048×1342 PNG; cropped at x=480 to 1088×1342 to remove lateral margins, then encoded as WebP. Demo content retained; no interface edits or upscaling. |
| `public/projects/world-cup-tracker/overview-detail.webp` | Existing 1122×1402 project PNG encoded as WebP without cropping, interface edits or upscaling. Historical independent-project disclosure retained. |

The former Lighthouse high-resolution capture TODO is resolved. The existing FIFA graphic is an official mark rather than an event photograph, so it was not selected for the new Work page. Private handoff files and new FIFA photos remain outside the commits and preview source.

## Questions retained for Rafael's review

1. Confirm FIFA's official title. The preview uses **Commercial Partner Ticketing / CRM Operations** because the résumé and public title differ.
2. Select specific new FIFA photos and confirm publication rights/consent before any public use. The preview uses existing public imagery.
3. Confirm exact Formula 1 Miami GP responsibilities, Qualcomm attribution, and Panini/host-city details before adding those claims. They are omitted from the redesign.

Production release still requires Rafael's explicit approval.
