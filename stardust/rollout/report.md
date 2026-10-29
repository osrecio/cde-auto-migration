# Rollout report — caixaenginyers.com → AEM Edge Delivery (2026-10-27)

Scope: the 10 selected pages of the site plan (479 discovered). Live origin: https://main--3a4f1d39--aemcoder.aem.live/

| | |
|---|---|
| **Pages** | 10 / 10 live (published) and verified · 0 pending · 0 failed |
| **Templates** | 4 — landing (home, 1 page), static (accesibilidad), form (acceso-bo), program (accidentes + 6 siblings) |
| **Blocks** | 16 catalog modules → 16 EDS blocks verified (alta-band → account-signup, ingenium → promo-band, solutions → segments; rest same name) + header/footer chrome, award, columns, cards, section-bullets support blocks |
| **Fidelity (published origin vs live source)** | 1440: 10/10 PASS (pixel 0.32–6.91 %). 360: 7 PASS (0.62–9.95 %) + 3 carousel-slide overrides (/, /acceso-bo, /ahorro-vida — autoplay heroes freeze on different slides; per-slide parity 0.03–6.3 %). Clipped 0 · missing/hidden content 0 on every page |
| **Dynamic parity** | 6/6 replay PASS: login dialog, menus, search (interim → source results), request form (UI; endpoint awaiting owner), banking sign-in (posts to source bank host), martech gated off |
| **Quality (optimize)** | health 100/100; open P1 0 · P2 0 · P3 0; 11 source-parity items (no JSON-LD on source) informational |
| **Links** | 130 unique hrefs resolve; in-scope links root-relative; ~100 out-of-scope targets keep pointing to the source site |
| **Site** | served sitemap 10 = assembled 10; `/` 200; /nav + /footer noindex; no redirect rows needed |

## Still to deliver / owner decisions
1. Turn on Google Tag Manager (GTM-P8567G5) and the consent manager in `stardust/martech-contract.json` when the production host goes live (`stardust/martech-handoff.md`).
2. Name the endpoint for the product request form (regulated personal data).
3. Confirm the online-banking host the login posts to.
4. Site-wide search index (search currently hands off to the source results page).
5. The remaining 469 discovered pages and the es locale tree are outside this run's scope.
