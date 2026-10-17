# Editorial Refinement 3: A personal website, not a résumé

**Decision:** Approved by Rafael for development on the existing redesign branch. NOT approved for production or merge.

- Repo: `raf0x/rlemor.com`
- Branch: `redesign/warm-personal-career-first`
- Existing draft PR: https://github.com/raf0x/rlemor.com/pull/1
- Relevant prior direction: `docs/warm-personal-refinement-brief.md`
- Current redesigned Home/Work source: `app/page.tsx`, `app/page.module.css`, `app/work/page.tsx`, `app/work/work.module.css`, `app/globals.css`
- Project and case study: `app/projects/page.tsx`, `app/projects/projects.module.css`, `app/projects/mypepprotocol/page.tsx`, `components/ScreenshotViewer.tsx`
- User-supplied images, to be extracted locally before Codex begins:
  - `design-handoff/editorial-assets/mypepprotocol-hero.png` (1672×941, 2,850,708 bytes)
  - `design-handoff/editorial-assets/world-cup-tracker-historical.png` (894×940, 276,236 bytes)

## Why this refinement is needed

Rafael likes the new, visually simple, colorful career-first homepage, but does NOT want the website to repeat a résumé. The current `/work` page ends in a full reverse-chronological job listing ("The full path / Experience, in order.") with dates. Rafael explicitly rejected that whole presentation. Keep the website as a memorable editorial introduction to skills, real work, and judgment. LinkedIn and the résumé are where the formal chronology belongs.

The rest of the approved site remains stable: warm ivory, dark readable text, restrained lively blue/green/coral/yellow, Lora headings, DM Sans body, open rows and real professional/account contexts. Do not add new boxes or a new style direction.

## Deliverables and exact changes

### A. Remove résumé-like chronology from /work (priority 1)

1. Delete the `Experience, in order.` section, its entire timeline, and associated visible date-grid/list styling from `app/work/page.tsx` and `app/work/work.module.css`. The data array `career` should not remain unused.
2. Do not replace that timeline with a different dated list, CV-style job cards, or a list of every employer in the same form.
3. Keep the three already-approved specialties, in order:
   - **Global Sports & Events**: FIFA featured (real four-tournament commercial-partner/ticketing responsibilities, qualified results), IMG Tickets / Miami Open as a smaller earlier chapter, CHEQ's venue implementation context.
   - **Enterprise SaaS & Customer Success**: Shibumi and CHEQ, grouped by customer work. CHEQ remains ONE employment history, discussed in two relevant contexts without duplication.
   - **Service Operations & Leadership**: Inktel and TEN Lifestyle Group, with real operational responsibilities.
4. Make each specialty **editorial and selective**, not a detailed company-by-company CV. A few impactful lines per relevant example, verified results where they genuinely strengthen credibility. Avoid duplicating content on the homepage.
5. Preserve the supporting facts needed for credibility: FIFA scope/results, personally managed Coca-Cola/Bank of America accounts, Shibumi ARR/retention, Inktel Williams-Sonoma relationship, CHEQ implementations, and Miami Open responsibilities. Dates need not be foregrounded in the grouped narratives. Do not invent accomplishments, roles, or metrics.
6. Preserve existing useful IDs `#sports-events`, `#enterprise`, `#service-operations`, `#fifa`, `#miami-open`, `#shibumi`, `#cheq`, `#inktel`, `#ten-lifestyle`. A legacy `/work#career` link should land sensibly, e.g. put `id="career"` on a suitable visible introductory region, NOT a new timeline. Update any internal links pointing to removed anchors.
7. Contact CTA remains at bottom. Do not add a PDF résumé section as a substitute; LinkedIn is already available on the site.

### B. Replace project lead images with the attached files

**MyPepProtocol**
- Make the exact attached image `mypepprotocol-hero.png` the **primary visual on /projects**, replacing the old lead screenshot. Do not add it to the homepage's compact MyPepProtocol text link.
- This image is colorful PROMOTIONAL / CONCEPT ARTWORK with a rendered phone, syringe, vial, mock protocol widgets and sample values. **It is not a verified actual screenshot of the working app.** Do not caption or describe it as actual UI or clinical data. Suggested accessible caption: "Concept artwork for MyPepProtocol. See the case study for authentic product screens and decisions."
- Retain the existing real screenshots, evidence/caveats, decisions and actual product UI in `/projects/mypepprotocol`. Do not replace factual case-study screenshots with the concept art.
- Render the full visual in a restrained flat media frame with its natural 1672:941 landscape ratio, without unnecessary clipping, cropping, reillustrating, text overlays or upscaling. Use `next/image` and sensible responsive `sizes`; if reencoding for performance, preserve the complete composition and legibility.
- Since the reusable ScreenshotViewer currently announces "Enlarge screenshot," either show this artwork as a noninteractive figure with factual caption, OR extend the existing viewer with one optional accessible label variant (e.g. "Enlarge artwork") while retaining default screenshot behavior everywhere else. No new library.

**World Cup Tracker / Predictor**
- Make exact attached `world-cup-tracker-historical.png` the primary World Cup project visual on `/projects`, replacing the older lead image. Natural 894:940 aspect ratio, preserve full bracket and labels without cropping or redrawing, and allow enlargement using the existing accessible viewer.
- This is a **historical capture** of the independent project. It contains contemporaneous UI labels like "LIVE" / "tournament is underway." Those are screenshot contents, NOT claims the tournament remains live today. The adjacent site caption/copy must explicitly say historical snapshot, completed tournament, independent unofficial project (not FIFA affiliated); do not edit the original screenshot pixels to conceal or rewrite its status.
- If the original 894px-wide capture becomes blurry when enlarged, use a sensible pixel size and let it scroll in the viewer rather than upscaling or recreating it.

**Asset placement and source handling**
- Inputs come from the user's new ZIP, expected locally at `design-handoff/editorial-assets/...`. This handoff folder is **source material**, not production code; do not commit it. Copy only the two selected production assets into clear names under `public/projects/mypepprotocol/` and `public/projects/world-cup-tracker/`. Optimize only when justified and visually verified.
- If `design-handoff/` isn't ignored, add a specific ignore rule to `.gitignore` (do not ignore project image assets).
- Do not commit the previous user-supplied FIFA group photo `IMG_6743.jpeg` or the private layout mockup; explicit publication consent is still pending.

### C. Portrait: circle, not arch

- Current homepage portrait uses arched top + square lower corners; simplify to a **true circle** (`aspect-ratio:1`, `border-radius:50%`, `object-fit:cover`, intentional `object-position` to keep Rafael's face fully visible).
- Apply a consistent circular treatment to the About portrait if it currently uses the same arched style. Do not replace the real personal photo with generated imagery.
- Check that the cropping remains flattering at 1440px, 768px and 390px. Keep the portrait appropriately secondary to the introductory copy, no gradients or excessive decorations.

### D. Organization names: editorial emphasis, NOT a brand-color rainbow

- Keep **FIFA** bold and blue (existing site blue accent `#315BC6`) where it is named in the primary Sports & Events narrative.
- Render **Shibumi**, **CHEQ**, **Inktel**, **TEN Lifestyle Group** in the three homepage specialty descriptions as bold **dark ink**.
- In Selected relationships, emphasize the organization names using bold dark ink: **Coca-Cola**, **Bank of America**, **Williams-Sonoma**, **Inter Miami**, **Miami Marlins**, **Hard Rock Stadium**.
- Use semantic `<strong>` or a small scoped utility class; do not make static names look like hyperlinks. Keep the link styling reserved for actual navigational links. Don't introduce employer-specific logo colors, extra badges, pills, gratuitous logos or a colored-name circus.
- Preserve exact contextual attribution: FIFA is employer, Coca-Cola and Bank of America are personally managed FIFA commercial-partner accounts; Williams-Sonoma is an Inktel service account; Inter Miami/Miami Marlins/Hard Rock Stadium are CHEQ team/venue implementation contexts. Never recast those as employers or personally managed accounts without support.

### E. Editorial cohesion

- Do not resurrect the résumé-style Work timeline elsewhere (homepage, About, footer).
- Maintain four-ish focused Home sections, not a pile of framed cards. Don't add MyPep or World Cup lead images to homepage as those are currently intentional compact secondary links.
- Warm & Personal type and palette stay intact. Strong dark typography; no grey text; clear mobile rhythm and color contrast.
- Do not reopen copy for the MyPepProtocol case study, the existing full Projects page except for image swaps and captions, or unrelated functionality.
- No invented testimonials, fake metrics or sponsor relationships; no implied FIFA endorsement.

## Verification & release gates

Before code: verify clean local branch and latest PR head; inspect file contents and available assets, propose a short file-level plan. Small commits on `redesign/warm-personal-career-first` only; **stage exact filenames, never `git add .`**. Keep `main` untouched.

Validate `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Independently review desktop 1440/1024, tablet 768, mobile 390/320; focus on portrait crop, Work removing entire chronology, bold naming and attribution, project artwork legibility and image fidelity, complete screenshot zoom interactions, and keyboard/reduced-motion/accessibility checks. Check routes and deep links for `/`, `/work`, `/projects`, `/projects/mypepprotocol`, `/about`, `/contact` and the legacy `/work/mypepprotocol` redirect.

Post before/after screenshots of desktop/mobile Home, Work and Projects, plus short QA summary in **existing draft PR #1**. Provide fresh Vercel **preview only**. **NO merge to main, NO production deployment** without Rafael's explicit release approval. The FIFA photograph permission gate still applies.

**Stop with a clear status and questions only for genuinely unresolved rights/data.**