# Dynamics parity check — https://main--3a4f1d39--aemcoder.aem.live — 2026-10-27T00:31:17.122Z

Replayed 6 checks over 7 features · pass 6 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Header Accés popup (banca online login dialog) + menus | M | done | click-dialog | PASS | dialog 1440px · heading "Entrada socis" · 0 fields · iframe · Escape closes: true | bancaonline.caixaenginyers.com:302×1 bancaonline.caixaenginyers.com:200×14 |
| Header Accés popup (banca online login dialog) + menus | M | done | dom-count | PASS | 4 × header .nav-top > li.nav-item (min 1) |  |
| Header site search | S | interim | dom-count | PASS | 1 × header form.search[action*="general-search"] (min 1) |  |
| Product request form (name, surname, NIF, email, phone, postcode, consent) | F | scaffolded-awaiting-owner | dom-count | PASS | 11 × .request-form form.request-form-form input (min 5) |  |
| Online-banking sign-in form (/acceso-bo) | X | interim | dom-count | PASS | 12 × .login-form form[method="post"][action*="bancaonline.caixaenginyers.com"] input (min 2) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- Locale variants ca / es (I18N) — interim · owner: The es tree is outside this run's scope; the language switch links to the source site.
- Liferay JS resolver, YUI html classes, dataLayer global (A) — done
