# Approved refinement, Warm & Personal (PR #1)

Status: **Approved by Rafael for redesign implementation, not approved for production.**

Repository: `raf0x/rlemor.com`  
Branch: `redesign/warm-personal-career-first`  
PR: https://github.com/raf0x/rlemor.com/pull/1  
Starting application implementation (prior to this brief): `3a1c615cc536b6e7b83d37d4e2ffc7329b23bd53`  
Review context: `docs/redesign-review.md`

## Product decision

Improve the existing PR, **do not rebuild**. Rafael approves a second design pass that:
1. Groups professional experience by three strengths, rather than putting IMG Tickets / Miami Open almost level with FIFA on the homepage.
2. Makes Warm & Personal more lively, with a restrained multi-color palette, not a site dominated by terracotta.
3. Makes the homepage simpler, shorter, more visual and less boxed-in.

Maintain career-first positioning: Customer Success, enterprise Account Management, global event/ticketing operations. Independent AI-assisted projects are *secondary evidence* of initiative and judgment. Do not inflate engineering identity.

## Career information architecture

**Group A: Global Sports & Events**
- FIFA: primary featured experience; commercial-partner ticketing and CRM operations across four tournaments, culminating in FIFA World Cup 2026.
- IMG Tickets / Miami Open: supporting earlier chapter, **not** a second equal-weight hero. Box Office Manager, 2014–2017, four Miami Open editions at Crandon Park. Responsible for ticketing staff, VIP entrance during each two-week event, inventory, sales, customer escalations, and customer service outside event periods.
- CHEQ: its event and venue implementation *context* (Inter Miami, Miami Marlins, Hard Rock Stadium). Do not imply CHEQ was a sports-event organizer.

**Group B: Enterprise SaaS & Customer Success**
- Shibumi: Enterprise Customer Success Manager; retain verified metrics and customer success story in /work.
- CHEQ: Customer Success Manager, mobile-commerce platform; cross-reference product/customer implementation work here. **One job entry** in the chronological timeline, even when two contexts reference it.

**Group C: Service Operations & Leadership**
- Inktel: Operations Manager; customer service operations, teams, Williams-Sonoma account.
- TEN Lifestyle Group: Account Manager; travel concierge and customer support/client experience. Avoid reducing it simply to an unnamed call center.

**Independent Consulting** (Nov 2023–Aug 2024) remains in the full chronological employment timeline, even though it is not one of the main feature examples.

**Employers are not accounts**: keep Coca-Cola and Bank of America attributed to personally managed FIFA commercial-partner relationships; Williams-Sonoma attributed to Inktel; team/venue implementation contexts attributed to CHEQ. No bare logo wall. Do not imply a company directly employed Rafael if it was a partner, client, event, or venue.

Avoid unverified claims and titles: leave current neutral FIFA role descriptor unless Rafael confirms an official title; omit specific Formula 1 responsibilities, Qualcomm attribution, Panini and host-city claims until verified. Retain the existing documented and qualified résumé-based FIFA metrics, without conflating scopes.

## Approved homepage composition (significantly simpler)

1. **Hero**: keep authentic portrait, warm greeting, strong professional positioning and clear Work/Contact actions. One brief lead, not an oversized marketing headline.
2. **Three areas of experience**: three OPEN EDITORIAL ROWS (no boxed three-card grid), grouped as above. One concise explanatory line or short paragraph each. Make FIFA visually prominent within Group A; mention IMG Tickets and CHEQ without giving IMG its own oversized feature block. Each links naturally into relevant /work anchor(s).
3. **Selected relationships**: concise, understated context band or open rows, 2–3 verified examples, with employer affiliation immediately clear. No standalone block of repetitive lengthy descriptions, no unsupported client logos.
4. **Independent projects**: one large, polished Lighthouse capture and short explanation, ~55–60% of its desktop row (validate its actual displayed size); MyPepProtocol and World Cup Predictor as compact but clear text links with one-sentence context, leading to existing /projects routes. All three retain **large authentic screenshots and accessible enlarge dialogs on /projects**, and the MyPepProtocol case study stays complete. No screenshot redrawing.
5. **Personal note + contact**: short personal signal (travel/football), clear direct contact action. Remove repeated taglines and redundant CTAs wherever that increases density.

Target a meaningful reduction in homepage copy and container count (roughly 30–40% where feasible), measured against current PR, **without deleting essential career details**. Keep detailed evidence on /work and project details on /projects.

## /work refinement

Group experience into the three coherent specialties, with strong hierarchy and readable editorial sections. Keep FIFA featured with existing backed-up scope/metrics. Treat IMG Tickets / Miami Open as supporting experience, not its own equal-size hero. CHEQ may appear in both events and SaaS descriptions but is one employer. Retain a compact, complete reverse-chronological career list with accurate dates/role titles, including Independent Consulting. Where content duplicates, favor one detailed passage and shorter cross-references. Preserve meaningful deep-link anchors (notably `#fifa`, `#miami-open`, `#career`) or update every referring link together.

**Imagery constraint:** Newly supplied FIFA group/private photographs are NOT cleared for publishing yet. They must remain uncommitted and absent from the preview and production unless Rafael explicitly confirms permissions and selected images. Continue using the existing public portrait. If an authentic rights-cleared event photo is unavailable, make the event section beautiful without a new photo and document the release gate; do not silently source a misleading photo or fabricate permission.

## Visual design system (Option 2 evolved, not a mash-up)

Retain **light mode only**, warm-white/ivory backgrounds, Lora display headings, DM Sans body, large readable typography, dark body text, linear left-to-right reading, whitespace and hairline dividers.

Starting palette:
- Ivory canvas `#FFFCF7`
- Dark ink `#29312D` (primary and secondary body text; no grey text)
- Lively blue `#315BC6` (links and selective headings/labels)
- Coral `#E46A4C` (large highlights/decorative bars, not small text on ivory)
- Green `#368675` (ornaments/light fills; use a darker accessible shade for normal-size text)
- Soft yellow `#F2CE74` (occasional highlight/background only)

Check WCAG AA for ALL text, including small colored text; choose darker blue/green/coral variants for text as required. Color should provide thoughtful editorial rhythm: one purposeful accent per section, not random multi-colored cards. Avoid gradients, glassmorphism, giant rounded cards, unnecessary pills, floating art, excessive icons and animations. Do not add a new color-heavy component library.

Minimize borders and boxed content. Use subtle tinted backgrounds sparingly (perhaps once for the contact block); retain strong hierarchy using typography, spacing, imagery and alignment. Design in desktop and mobile together.

## Changes in scope

Prioritize `app/page.tsx`, `app/page.module.css`, `app/work/page.tsx`, `app/work/work.module.css`, `app/globals.css` and *minimal* related shared styles to integrate palette consistently. Keep `/projects`, `/projects/mypepprotocol`, `/about` and `/contact` harmonious with the revised palette without reopening their content or breaking existing behavior. Avoid broad rewrites and new dependencies.

Keep:
- All six live page routes and canonical/sitemap entries.
- Legacy `/work/mypepprotocol` redirect; avoid reviving `/work` → `/projects`.
- Real contact email and LinkedIn links, accessible nav and skip link.
- MyPepProtocol's substantive case study chapters, caveats and CTAs.
- Existing screenshot viewer: Enter/Space, Escape, Close, focus return, scroll, reduced motion.
- SEO, image optimization and existing deployed production untouched.

## Delivery and acceptance

1. First: inspect working tree/branch status and relevant files. Present a short file-level plan.
2. Implement in **small reviewable commits** on `redesign/warm-personal-career-first`; stage specific files only, **never `git add .`**. Do not commit the extracted design handoff, group/private photos, local QA artifacts, or secrets.
3. Validate lint, TypeScript, production build, all routes and internal links. Test 1440, 1024, 768, 390 and 320px, including no overflow, large-font legibility, light-only treatment, real image decoding, reduced motion, nav/skip, and screenshot viewer dialogs.
4. Run an independent visual/UX critic pass specifically for: career-first hierarchy, no awkward Miami Open promotion, color restraint/contrast, fewer boxes, larger readable Lighthouse hero media and coherent mobile spacing. Fix discovered defects without broadening scope.
5. Update **existing draft PR #1**, not a new PR. Provide fresh 1440px and 390px screenshots of the homepage and /work, plus a short before/after summary, QA evidence and any unresolved photo/title gates.
6. Provide updated Vercel branch preview for human review. **STOP before merge or production deployment.** Rafael must explicitly approve release.

If choices arise, prefer the simplest editorial presentation consistent with this brief; ask only for genuinely missing publication rights or disputed facts. Do not invent career claims or imply organizational endorsement.
