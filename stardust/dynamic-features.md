# Dynamic features — caixaenginyers.com

_Curated from `stardust/dynamics/dynamic-features.generated-plan.{md,json}` (66 draft rows: 4 probed
archetypes — `/`, `/accesibilidad`, `/acceso-bo`, `/accidentes` — plus reach from the 10-page crawl).
Hands-off: owner decisions are named and the interim tier ships; nothing is decided-out._

## Listings contract

none — no listing blocks in the 10-page scope (the home "Estigues al dia" news teaser is three authored items).

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | chrome-menu (+ m-modal-trigger-aria-haspopup…) | Header menus: segment tabs, "Productes i serveis" mega menu, Accés popup, CA language switch | M | 10/10 | rebuild-native | block | self | planned | interactive | none — the header contract is the spec | stardust/chrome/header-contract.json |
| 2 | chrome-search (+ s-site-search-form-resultados-busqueda…) | Header search overlay / site search form | S | 10/10 | index-backed | block | self | planned | search | interim: submits to the source results page `/resultados-busqueda/-/general-search/PWkTISzrz6FZ/` (outside the 10-page scope); site-wide index is an owner decision | _dynamics.json |
| 3 | f-form-com-liferay-dynamic-data-mapping-form-web-portlet-ddm (+ a-first-party-api-get-o-dynamic-data-mapping-form-field-types) | Product request form ("Sol·licita'l ara" / "Vull informació": name, surname, NIF, email, phone, postcode, consent) | F | 6/10 | rebuild-native | block | needs-backend | planned | forms | regulated-pii (NIF, phone): UI rebuilt, submission blocked with an explicit "no backend connected" message — owner names the endpoint. DDM API is host-bound (404 on target) | _dynamics.json forms |
| 4 | x-sign-in-account-links | Online-banking sign-in (Accés button, `/acceso-bo` login form) | X | 10/10 | embed-passthrough | block | needs-backend | planned | register | interim: login keeps posting to the source banking host; owner confirms the banking endpoint (not decided-out) | _dynamics.json |
| 5 | a-unknown-third-party-host-consent/edge/api-cookiefirst-com | CookieFirst consent manager | A→T | 10/10 | embed-passthrough | runtime | self | planned | martech | carried over as `consent.cmp` in stardust/martech-contract.json, `enabled: false` — owner switch | pages/index.html script src |
| 6 | t-tag-stack (50 T rows) | Google Tag Manager GTM-P8567G5 and everything it loads (ad/retargeting pixels, Adform, OniAd, Opinator, analytics, www.google.com, pixels.spotify.com) | T | 10/10 | embed-passthrough | runtime | self | planned | martech | GTM route in stardust/martech-contract.json, `enabled: false` — owner switch | stardust/martech/tags.json |
| 7 | a-cms-app-settings-object-datalayer | `dataLayer` global | A | 10/10 | embed-passthrough | runtime | self | planned | martech | name kept for GTM | _dynamics.json |
| 8 | a-first-party-api-get-o-js-resolve-modules | Liferay JS module resolver | A | 10/10 | static-snapshot | runtime | self | planned | off-origin data | platform plumbing, renders no content — nothing to rebuild | _dynamics.json |
| 9 | cr-client-rendered-slot-ltr-yui3-js-enabled | YUI/AUI `html` classes | CR | 10/10 | static-snapshot | runtime | self | planned | capture | platform plumbing, no content | _dynamics.json |
| 10 | i18n-locale-variants-es-es-ca-es-x-default | Locale variants ca / es (hreflang) | I18N | 10/10 | rebuild-native | content | needs-business-decision | planned | locale wave | run scope is the 10 ca pages; the es tree is out of scope — language switch keeps linking to the source | hreflang |

## Decision batch

One message to the owner:

1. **Tags and consent** — Google Tag Manager (GTM-P8567G5) and the CookieFirst consent manager are carried over switched off (`stardust/martech-handoff.md`). Turn them on in `stardust/martech-contract.json` when the new host goes live.
2. **Request forms** — the product request form collects personal data (NIF, phone, email). It is rebuilt visually; submission is blocked with a "no backend connected" message until you name the endpoint.
3. **Online banking login** — the Accés a Banca ONLINE form keeps posting to the current banking host; confirm that host for the new site.
4. **Search** — the search box submits to the current results page until a site-wide index exists.
5. **Spanish (es) tree** — outside this run's scope; the language switch keeps linking to the current site.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none — no owner statement; hands-off never decides out | — |
