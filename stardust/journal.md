# Journal — caixaenginyers.com replica migration

## Extract — 10 selected pages captured live, 4 page types (2026-10-26)

- `crawl.mjs --pages <10 plan URLs> --dynamics --concurrency 3`: 10/10 live (playwright, medium wait, HTTP 200). No bot protection, no consent wall in the captures. Capture gaps: none.
- Page types (LLM-inferred): landing 1 (index), static 1 (accesibilidad), form 1 (acceso-bo — online-banking login), program 7 (product/service detail pages).
- Style census at 1440 + 360 → `_computed-styles.json`. Fonts: Lato regular/bold/light (OFL, self-hostable) + fontawesome-alloy icon font, fetched from the theme (`/o/webpublica-theme/fonts/`). Platform: Liferay DXP.
- cap-probe: contentMaxWidth 1148px, shell fluid, consistent across the 4 archetypes.
- Header contract: 1440 → 4 controls (3 menus, 1 search), 10 states; 390 → 0 controls recorded (mobile menu not detected by the explorer; check at recreate).
- Vision check: 10/10 ok (thumbnails).

## Preserve direction — spec promoted verbatim, empty register, dynamics triaged (2026-10-26)

- `stardust/current/{PRODUCT.md,DESIGN.md,DESIGN.json}` → project root, verbatim. `DESIGN.json` added to `.hlxignore` (root `*.md` already ignored).
- `stardust/direction.md` (preserve mode, hands-off activation, roster 10 of 479), register empty — pure replica. No target breakpoints.
- Dynamics: detect on 4 archetypes + reach → 66 draft rows → 10 curated rows in `stardust/dynamic-features.md`, every row with a disposition. Request form = regulated-pii (submission blocked), banking login and search = interim pass-through to source.
- Martech: spec-martech (GTM GTM-P8567G5, no Launch, no OneTrust); CookieFirst CMP found in the rendered DOM and added to `consent.cmp` by hand (not in vendors.json). Contract all `enabled: false`; `scripts/martech.js` scaffolded and hooked (`no CMP · 0 routes enabled`).
- Publish decision recorded in `stardust/eds-conversion-log.md`.

## Recreate — opened; first-page-first collapsed into the ordinary order (2026-10-26)

- The site-scope prep (Track B: 10-page extract, types, modules, dynamics) finished before any page work began, so the two-track first-page-first opening has nothing to run in parallel: the home page is simply the first archetype recreated and the first delivered. No `stardust/first-page/` tree; no RECONCILE needed (the promoted spec is already the full-prep one).
- Archetypes: index (landing), accidentes (program — the most typical of the 7 product pages: photo hero, body, related products, request form), accesibilidad (static), acceso-bo (form). Prototype server: python http.server on :8791 serving `stardust/prototypes/`.

## Recreate — index archetype (2026-10-26)

- Built `stardust/prototypes/index-proposed.html` (clean semantic re-author, text verbatim from the capture) on `canon.css` (tokens, Lato @font-face under the theme's own family names, base, header, footer, buttons, bullets, award badge) + `index.css` (hero carousel, quick access, solutions, alta, Ingenium, news + Focus) + `index.js` (observed behaviours only). Media harvested to `stardust/prototypes/assets/media/` (nothing hot-linked); Liferay asset basenames kept (`layout_icon`, the user-icon document id, `ico_phone_25x25.png`, `Logo-CI-web-400x76-ca.png`) so icon identity matches the source.
- **1440**: 3 iterations (iter1 --full 32.8% / Δ-1589 → image height attrs; iter2 7.53%; iter3 --full) → pixel 7.14% · Δh 0 · content-diff 0🔴/0🟡 · visual-diff 0 · clip 0 · overflow ok · chrome parity quiet · crops header 0.27% / footer 1.40%. Hero-masked number 1.32%.
- **360**: 3 iterations (iter1 --full 16.4% + overflow +328 from the off-canvas child-menu; iter2 22.9% + footer content-box overflow +30; iter3 --full) → pixel 2.37% · Δh -1 · content-diff 0🔴/0🟡 · visual-diff 0 · clip 0 · overflow ok · crops header 0.98% / footer 1.26%.
- cap-probe: PASS at 2560 (content cap 1148 = 1148).
- Post-motion pixel rounds returned to the gated values (7.14% / 2.37%).
- Residuals: (1) hero carousel is nondeterministic on live (autoplay 6 s, autoHeight) — the gate's live 1440 shot froze on slide 2, the prototype renders the captured DOM state (slide 3); ~5.8 pts of the 1440 number, permanent, restoreAtDelivery = owl autoplay/rewind/fadeOut. (2) CookieFirst consent-settings fingerprint button (third-party, martech off). (3) 360 off-canvas drawer approximated (offscreen, 9 chrome-parity deltas). (4) mobile hamburger toggle and bullet click-to-scroll were never exercised by the instruments → not implemented, open item for delivery.
- Canon decisions: chrome gutters fluid via `--ce-gutter` (146px @1440); `.pt` / `.pt-hidden` reproduce Liferay portlet titles (visible-but-clipped vs display:none in #banner/#footer journal portlets) so nothing-lost stays 0; `.hide-accessible` = left -999999px; footer uses the source float model (#footer height 0) with the JS-equalised 351.219px column height lifted as a constant.

## Recreate — acceso-bo archetype (2026-10-26)

Page type `form` — "Accés a Banca ONLINE" login. Files: `stardust/prototypes/acceso-bo-proposed.html`, `stardust/prototypes/acceso-bo.css` (canon.css first), behaviour `index.js` (shared, unchanged).

- **Structure**: canon header/footer copied from index-proposed.html (minus the home-only section bullets and the header "Fundació" button, which is absent on this live page); intro (h1 / h2 22px / 13px recovery link, inline styles of the source article, 1148 cap); login box; full-bleed carousel.
- **Login box**: on live it is a cross-origin iframe (`bancaonline…/CABEm_0_fusionRestyling.action`). Fetched its markup + `CABEmfusionRestyling.css` and recreated inline: 240px .pay-form centred, 39px pill fields `#efefef`, `#0f4d82` pill "Entrar" button, sans-serif at 10px root. Form keeps the source action `https://bancaonline.caixaenginyers.com/BEWeb/3025/6025/identificacion.action` (POST, target _top, hidden OPERACION/IDIOMA/CAJA… fields); no JS submit wiring. The slider overlaps the iframe 165px below its top on live; the box is sized to 165px.
- **Carousel**: home carousel CSS/JS reused (copied into acceso-bo.css); 4 slides from this page (video slide with campaign thumbnail `slide-captacio-video.jpg` + owl play icon, CE FonDipòsit, Focus, Seguretat). Initial state = slide 1 (owl start; the gate's live capture shows slide 1, the extract capture had slide 3 by timing). `overflow-wrap: break-word` from the theme's portlet-content rule (mobile FOCUS card wraps).
- **New media**: slide-fondiposit.jpg, slide-focus.jpg, slide-captacio-video.jpg, owl-video-play.png (focus-lupa.png, slide3.jpg reused).
- **Gate**: 1440 iter1 24.72% (wrong active slide) → iter2 0.30% → iter3 (--full confirm) 0.30%, Δh 2px. 360 iter1 35.43% (Δh -213) → iter2 1.47% → iter3 1.47%, Δh 2px. Content-diff 0 red / 0 nothing-lost (advisory: iframe sr-only labels). Clip 0, overflow ok, visual-diff none. cap-probe PASS at 2560 (after wrapping the intro in a 1148 cap and making the login box fluid).
- **Residuals**: 360 header/footer chrome-parity deltas inherited verbatim from the gated home canon (pixel-neutral); 2px page-height rounding.
- **Motion**: carousel autoplay/fadeOut/dots/pause parity via index.js; theme .15s link transitions added; analytics/Liferay/scroll-mark classes logged as non-visual.
- **Canon back-ports**: none.

## Recreate — accesibilidad archetype (2026-10-26)

Static (accessibility statement) archetype, live https://www.caixaenginyers.com/accesibilidad →
`stardust/prototypes/accesibilidad-proposed.html` + `accesibilidad.css` (canon.css first) + `accesibilidad.js`
(chrome behaviours copied from index.js + responsiveTabs). New media: cabecera_accesibilidad_CAT-min.jpg,
ico_mail/ico_whats/ico_movil.png, ico_bullets_seguridad_online.png, angle-down/up-blue.svg.

| width | iter1 | iter2 | iter3 (--full) | post-motion (--full) |
|---|---|---|---|---|
| 1440 | 6.14%, Δh 20, 4 red | 0.32%, Δh 1 | 0.32%, Δh 1, 2 red (icon glyph) | 0.32%, Δh 1, content-diff 0/0, chrome ✓, clip 0, overflow ok |
| 360 | 21.40%, Δh 720 | 19.28% (accordion state) | 0.71%, Δh 1, 3 red | 0.71%, Δh 1, content-diff 0/0, clip 0, overflow ok |

cap-probe: PASS (0 of 5 rows failed). Motion: 4 parity, 2 missing = GTM analytics classes (not design).

Fixes: iter1→2 main offset (+9, index value 5px) and the hero portlet's non-collapsing 10px; content-diff
sr-only portlet titles, slide link title, hidden slider controls. iter2→3: live mobile accordion loads collapsed
(startCollapsed 'accordion') — replicated, which removed the 720px delta.

Residuals (inherited canon chrome, same as index-360): 360 header region (fixed live header vs in-flow),
hidden search/menu offsets, Grup padding; 360 footer crop 2.65% (1px offsets, pill icon gap). No canon
back-ports made.

## Recreate — accidentes archetype (2026-10-26)

Page type `program` (product/service detail, 7 siblings). Prototype `stardust/prototypes/accidentes-proposed.html`
+ `accidentes.css` (canon.css first; `index.js` reused unchanged for the header — the page has no `.slider`, so its
carousel block is skipped). Modules are named for reuse by the siblings: `.product-hero`, `.product-body`
(`.two-col`, `.separator`, `.list-bullet`, `.pricing`), `.product-cta`, `.product-legal`, `.related`, `.request`
(form + `.channel` aside). Media harvested to `assets/media/`: seg-acc-hero.jpg, raya-separadora.png,
yellow-bullet.png, rp-vida/rp-premier/rp-totsota.png, marker-yellow.png, phone.png, chat.png.

| width | iter | pixel | Δh | content-diff | visual | clip | overflow |
|---|---|---|---|---|---|---|---|
| 1440 | 1 | 4.11% | 26 | 10 red / 20 yellow | 0 | 0 | ok |
| 1440 | 3 (--full) + postmotion | 0.82% | 1 | 0 / 0 | 0 | 0 | ok |
| 360 | 1 | (hot bands 3000–4500) | 36 | 11 red / 20 yellow | 0 | 0 | ok |
| 360 | 3 (--full) + postmotion | 2.04% | 4 | 1 red (false positive) / 0 | 0 | 0 | ok |

cap-probe: PASS (0 of 7 rows). Chrome crops: header 0.24% / 0.98%, footer 0.59% / 0.89% (1440 / 360).

Decisions
- Liferay portlet rhythm: `.portlet` margin-bottom 10; flex rows keep the last child's margin inside, so
  `.product-cta`, `.product-legal`, `.request__head`, `.field--switch` are `display: flow-root`; the related title is an
  inline-block h2 in a centred line box (the source `<center><h2 style="margin:35px">`).
- Content parity: the source's sr-only portlet titles, the hidden owl/play-pause shell, the hidden DDM alerts and
  sr-only field texts are kept (display none / sr-only as on live); related cards stay `div[role=link]` with the
  source onclick (an `<a>` read as a ROLE SWAP).
- Form: DDM geometry lifted from live (col 765/383, field padding 27, label lh 22.857 + clay mark 2px, input 50px
  padding 10/25 border #d9d9d9, consent label inline-block mb 8, toggle 58x25 centred, Envia in 20/12 pagination).
- Header: no `Fundació` button on the product template (removed from this page's chrome markup).

Residuals
- 360 content-diff ICON DIFF on the 'Targeta de crèdit' icon — live element signature is flat #efefef (a live fixed
  overlay occludes the card in the 360 capture); asset md5-identical to the source. Instrument false positive.
- 360 consent checkbox row 72 vs 75 px (3 px).
- Motion: gtm-captacion-visible (GTM martech) not implemented; everything else parity (14).

Canon back-port candidates: product-template footer gap 30 px (applied locally); header without `.hr-fundacio`.

## Recreate — all 4 archetypes gated (2026-10-26)

- index 7.14%/2.37% (hero carousel capture state), acceso-bo 0.30%/1.47%, accesibilidad 0.32%/0.71%, accidentes 0.82%/2.04% (1440/360). All |Δh| ≤ 4 px, clip 0, overflow ok, cap-probe PASS.
- accidentes 360: content-diff ICON DIFF on the "Targeta de crèdit" card is a live capture state (source PNG byte-identical to the build copy; live paints the slot #efefef) — logged in progress.json captureState, not an owner acceptance.
- Canon back-ports for C0: product template gap above footer 30 px (canon 40); no "Fundació" header button on product/login pages; 360 footer crop 2.65% on accesibilidad (shared footer, 1 px shifts + phone-button icon gap); mobile hamburger menu not built (header contract at 390 recorded 0 controls) — observe before delivery.

## Source-fidelity gate — prototype table: 2 PASS / 2 carousel pages open (2026-10-26)

- `gate-all.mjs --stage prototype` at 1440/360: accesibilidad 0.32/0.71 PASS, accidentes 0.82/2.04 PASS; index 14.67/44.83 (Δh 0/124) and acceso-bo 32.3/29.89 (Δh 2/−23) FAIL on pixel only — both carry the Owl autoplay carousel (6 s): the table's fresh build capture lands on another slide (and at 360 the carousel's autoHeight follows the slide) than the cached live capture. Their own gate.sh rounds passed with the carousel at the captured slide.
- Open (next step): make the carousel's capture state deterministic for the table — documented `masks.json` sidecar for the carousel band (timer-driven media, `captureState[].restoreAtDelivery`) or pin the initial slide under the capture freeze — then re-run both tables.

## Handoff — opened; migrate plan — archetypes rendered Path A (2026-10-26)

- Phase 5 opened (`replica handoff start`). Migrate plan: 4 approved archetypes rendered Path A into `stardust/migrated/` (index, accesibilidad, acceso-bo, accidentes; 0 refused); modules[] declared per page for rollout's block dedup.
- 6 program siblings (administraciones-publicas, ahorro-vida, asesoramiento-negocios, asesoramiento-personalizado, asseguranca-patinet-electric, hipoteca-jove) are a pending `program` render unit — they render only after the program archetype (accidentes) is live and gated on the preview origin (#126).
- "Broken" link counts in the render are links to pages outside the 10-page scope; E2 repoints them to the source site.
- Prototype table: index / acceso-bo rows still open on the Owl carousel capture state — the published-origin rows are the counting numbers; revisit with a carousel mask sidecar if they fail there.

## Rollout A-inventory, B-block, B2-dynamic — roster, block plan, dynamic surface re-verified (2026-10-26)

- A-inventory: 10 pages (4 archetypes pending, 6 program siblings content-pending); rollout.json site = aemcoder/3a4f1d39@main, live host main--3a4f1d39--aemcoder.aem.live.
- B-block: 16 distinct module blocks, 17 instances (hero-carousel shared by index + acceso-bo); representative-first plan.
- B2-dynamic: dynamics-plan re-run with --martech --target-origin (preview host) --migrated --chrome → 66 rows, host-bound 2/2, delivered 2 — matches the curated `stardust/dynamic-features.md`; no new row, no disposition change.

## C-deliver — foundation unit done (2026-10-26)

- One foundation subagent authored + deployed styles, Lato/fontawesome-alloy fonts, header (incl. mobile bar + menu rebuilt from a live 390 probe) and footer blocks, /nav + /footer docs (live, noindex), preview-only shell /drafts/foundation-shell.
- Coordinator gate (shell vs live /accesibilidad, crop-compare): header band 1440 0.23% / 360 0.51%; footer band 1440 1.34% / 360 1.93% (residual = live page-content strip over the footer top). chrome-compare exit 0, 12 documented warnings.
- Two fix rounds: 360 mobile bar lost to a short-page stitch artefact (shell lengthened); 360 footer 23 px gap (collapsed margin → padding).
- Foundation frozen (`foundation-freeze.json`).

## C-deliver — archetype units static, form, program done (2026-10-26)

- Three concurrent subagents, each converting + deploying + gating its archetype on the preview origin (published):
  - accesibilidad (static): 1440 0.33% Δh 0 / 360 0.62% Δh 1; blocks page-hero, accessibility-tabs, contact-band.
  - acceso-bo (form): 1440 0.32% Δh 1 (carousel band masked) / 360 13.11% Δh −120 → documented override in gates/all-360/overrides.json: Owl autoHeight carousel freezes on a different slide on each side; per-slide compare 0.92/5.5/6.3/3.7%. Rotation delivered (6 s, rewind, fade, dots, pause/play). Blocks login-intro, login-form, hero-carousel (generic, reused by index).
  - accidentes (program): 1440 1.06% Δh 0 / 360 3.85% Δh 4; blocks product-hero, product-body, product-legal, related-products, request-form; encoder note for siblings in stardust/rollout/units/program-encoder.md.
- Header/footer bands ≤ 2 % on all three at both widths.
- Foundation request (all three units): header 9 px top margin below 992 px pushes main down — scoped overrides in page-hero.css, login-intro.css, product-hero.css; remove at C-final when the foundation fix lands.
- gate-all only gates pages `deployed` in state.json — subagents ran it against a state copy; `--eds-host` needs the https:// scheme. Fix the state for the program cluster and gate-all.
- Owner-visible residuals: live login page's password-encryption script not ported (login still posts to the source banking host) — flag in the dynamics decision batch; GTM-painted grey backdrop behind the request form absent while martech is off.

## C-deliver — archetype unit landing done (2026-10-26)

- Subagent delivered / (content/index.html, 7 new blocks + hero-carousel `center`/`list` variants); acceso-bo re-gated 0.32% after the shared-block change.
- Gate 1440 1.47% Δh −1; 360 carousel-slide override (live and EDS froze on different autoHeight slides, Δh 124; per-slide 0.14/0.14/4.86%). Header/footer crops ≤ 0.42%. Rotation, scroll-spy, sign-up lightbox delivered.
- Foundation request: same ≤991 header margin collapse; scoped override in hero-carousel.css.

## Migrate render — program siblings rendered; C-deliver program cluster open (2026-10-26)

- 6/6 siblings rendered on the program encoder (tabs/accordion variants added to product-body instead of the stacked downgrade), deployed and published; presence 0 missing / 0 hidden, clip 0.
- Gate 1440: 6/6 pass (max 5.82%). Gate 360: 3/6 pass; open after 3 rounds: ahorro-vida 27.6% (2-slide hero, slide-state capture — candidate carousel-slide override), administraciones-publicas 15.45% (drift below hero, mobile duplicate headings), asseguranca-patinet-electric 11.98% (spread misses).
- /accidentes 360 re-run read 12.56% (was 3.85%); local harness shows identical rendering — re-gate on the published origin before gate-all.

## C-deliver — program cluster unit done (2026-10-26)

- Cap-3 decision for the 360 failures: pages stay in the program template — every defect was block-confined (price-card gutters regressed by a later grid rule, unstyled risk scale, dark hero background ending above its text, ahorro-vida's 2-slide hero delivered as one static slide).
- Fixes in product-body / product-hero (new carousel variant for ahorro-vida, both slides verbatim, 5 s autoplay as in the live slider config); hero-carousel untouched.
- Gate 1440 7/7 (max 6.91%), 360 7/7 (max 9.95%), clip 0, missing 0; ahorro-vida carousel-slide override recorded beside the measured number.
- Residuals: accidentes hr above legal text; ahorro-vida slide-2 whole-slide link not reproduced.
- gate-all still needs a state copy with pages `deployed` (stardust/.work/program/probes/state-gate.json) and `--eds-host https://…` — fix state.json before the gate-all unit.

## C-deliver — gate-all unit done (2026-10-27)

- Roster run on the published origin (aem.live) at both widths, fresh captures, state copy stardust/.work/gate-all/state-gate.json (state.json has no `deployed` status).
- 1440: 10/10 PASS full verdict. 360: 7/10 PASS + 3 carousel-slide overrides (index, acceso-bo, ahorro-vida — per-slide parity recorded) → 10/10 delivered; clip 0, content missing/hidden 0.
- update-coverage --gate on both summaries: 10/10 rows matched, 0 flips.

## C-deliver — final unit done; C-deliver closed (2026-10-27)

- Applied the one queued foundation request (four lines, same finding): header `display: flow-root` below 992px in styles.css; scoped stopgaps removed from page-hero, product-hero, hero-carousel, login-intro.
- Re-gate on aem.live with fresh EDS captures: 360 10/10 delivered, pixel numbers unchanged to the decimal (the foundation rule is exactly equivalent); 1440 archetypes 4/4 PASS.
- Foundation re-frozen; coverage updated from the 360 table (0 flips). C-deliver end: 10/10 pages live and gated at both widths.

## D-site — site assembly verified (2026-10-27)

- Assembled sitemap/robots/manifest under stardust/rollout/site; served sitemap on aem.live = assembled (10/10, extra 0, missing 0).
- Redirects: no rows needed (source paths == delivered paths; root is the index document); recorded in eds-conversion-log.md.
- `/` on aem.page answers 200; /nav and /footer published with robots noindex.

## D2-dynamic — parity replay 6/6 PASS on aem.live (2026-10-27)

- Wrote stardust/dynamics/parity.json (6 features: header dialog + menus, search interim, request form awaiting endpoint, banking sign-in interim, locale interim, plumbing); martech contract appended by the replay.
- First replay: login dialog "Escape closes: false" — the hidden modal kept `aria-modal="true"`. Fix: aria-modal set only while open (header.js, no visual change), pushed; replay 6/6 PASS, martech gate: no tag host requested.
- Sign-in form is not submitted by the replay (would hit the production bank); presence of the post form to the banking host is the check. No query-index needed (no listings in scope). Foundation re-frozen.

## E-full-site — 10/10 verified on aem.live (2026-10-27)

- Gate tables (all-1440, all-360) re-applied to coverage: 10/10 rows matched, 0 flips.
- verify.mjs --all: 7 verified; 3 archetypes (accesibilidad, acceso-bo, accidentes) read 404 because `publicUrl()` appends `/` for a folder-form migrated file (`<slug>/index.html`) while deploy published the documents at `/<slug>`. Same checks run on the served URLs (200, 0 about:error, 0 unknown internal links) → recorded verified via update-coverage. Learning logged.
- Headless render, first page of each template at 1440: 1 h1, every block loaded, header + footer present, 0 JS errors; home carousel (restoreAtDelivery: autoplay 6 s) advances unpoked 0 → 1.

## E2-link-audit — every href resolves; out-of-scope targets repointed to source (2026-10-27)

- 217 hrefs on the 10 pages + /nav + /footer (130 unique non-tel/mailto/anchor). localize-links --check PASS: 0 in-scope links left absolute.
- ~100 out-of-scope source targets stay absolute to www.caixaenginyers.com — scope extension, decision recorded in direction.md.
- Browser GET of all 130: 130 resolve (3 retried on a fresh context: navigation-in-place artefacts, 200).

## F-optimize — health 100, 0 open findings over 10 pages (2026-10-27)

- First run inspected 7/10: the folder-form `publicUrl()` bug (see E-full-site) also hid the 3 archetypes. Project-copy lib.mjs now prefers `delivery.deployedUrl`; re-run inspected 10/10, verify 10/10 unaided.
- Health 100/100 (seo 100, ai 100); open P1 0 · P2 0 · P3 0; 11 source-parity items (10 × no JSON-LD on source, 1 P3) informational. GATE pass. Nothing for G-aem to fix.

## G-aem — nothing to autofix (2026-10-27)

- autofix-aem dry run: 0 candidates (no open findings after F). No EDS edits, no re-deploy.

## H-report — summary written (2026-10-27)

- Block ledger brought up to date: 16/16 catalog modules recorded verified with their EDS block names (3 renamed: alta-band → account-signup, ingenium → promo-band, solutions → segments).
- stardust/rollout/report.md: pages 10/10 live+verified, 4 templates, 16 blocks, fidelity tables, dynamic parity 6/6, optimize health 100, owner decisions (martech switch, form endpoint, banking host, search index).

## I-dashboard — dashboard written; rollout A–I complete (2026-10-27)

- stardust/rollout/dashboard/{index.html,data.json}: identified 10 · prototyped 10 · deployed 10 · optimised 10 (after excluding informational source-parity findings, see learnings).

## Handoff — replica run complete (2026-10-27)

- Rollout D-site → I-dashboard closed in one pass after C-deliver. Runner done-check: complete, 0 gaps.
- Delivered: 10/10 selected pages live on aem.live, gated at 1440 and 360, parity 6/6, health 100. Martech carried over disabled (contract, handoff, scripts/martech.js committed). Owner decisions listed in stardust/rollout/report.md.
