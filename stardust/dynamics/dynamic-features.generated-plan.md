<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-26T18:59:39.637Z · input stardust/current/_dynamics.json (4 pages, 66 findings) · target probe https://main--3a4f1d39--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-consent-cookiefirst-com | A | unknown third-party host consent.cookiefirst.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-edge-cookiefirst-com | A | unknown third-party host edge.cookiefirst.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-api-cookiefirst-com | A | unknown third-party host api.cookiefirst.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-pixels-spotify-com | A | unknown third-party host pixels.spotify.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 7 | a-first-party-api-get-o-dynamic-data-mapping-form-field-type | A | first-party API GET /o/dynamic-data-mapping-form-field-types | 1/4 (reach 6/10) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 8 | a-first-party-api-get-o-js-resolve-modules | A | first-party API GET /o/js_resolve_modules | 1/4 (reach 6/10) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 9 | cr-client-rendered-slot-ltr-yui3-js-enabled | CR | client-rendered slot ltr yui3-js-enabled | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 10 | f-form-com-liferay-dynamic-data-mapping-form-web-portlet-ddm | F | form "_com_liferay_dynamic_data_mapping_form_web_portlet_DDMFormPortlet_INSTANCE_ehmP3nuynzl1_fm" → origin /accidentes (9 fields) | 1/4 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 11 | i18n-locale-variants-es-es-ca-es-x-default | I18N | locale variants es-ES,ca-ES,x-default | 4/4 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://altasocio.caixaenginyers.com/ca" |
| 12 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 4/4 (reach 22/10) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 13 | s-site-search-form-resultados-busqueda-general-search-pwktis | S | site search form → /resultados-busqueda/-/general-search/PWkTISzrz6FZ/search/--KEYWORDS-- | 4/4 (reach 0/10) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 14 | t-unknown-third-party-host-www-opinator-com | T | unknown third-party host www.opinator.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 15 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-unknown-third-party-host-tag-oniad-com | T | unknown third-party host tag.oniad.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-unknown-third-party-host-track-adform-net | T | unknown third-party host track.adform.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-unknown-third-party-host-c1-adform-net | T | unknown third-party host c1.adform.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-dsum-sec-casalemedia-com | T | unknown third-party host dsum-sec.casalemedia.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-unknown-third-party-host-rtb-csync-smartadserver-com | T | unknown third-party host rtb-csync.smartadserver.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-ad-360yield-com | T | unknown third-party host ad.360yield.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-unknown-third-party-host-uipglob-semasio-net | T | unknown third-party host uipglob.semasio.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-ps-eyeota-net | T | unknown third-party host ps.eyeota.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-user-sync-fwmrm-net | T | unknown third-party host user-sync.fwmrm.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-idsync-rlcdn-com | T | unknown third-party host idsync.rlcdn.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-x-bidswitch-net | T | unknown third-party host x.bidswitch.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-unknown-third-party-host-ad-yieldlab-net | T | unknown third-party host ad.yieldlab.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-sg-semasio-net | T | unknown third-party host sg.semasio.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-eu-u-openx-net | T | unknown third-party host eu-u.openx.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-unknown-third-party-host-server-seadform-net | T | unknown third-party host server.seadform.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-unknown-third-party-host-pippio-com | T | unknown third-party host pippio.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | t-unknown-third-party-host-sync-crwdcntrl-net | T | unknown third-party host sync.crwdcntrl.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 34 | t-unknown-third-party-host-loadm-exelator-com | T | unknown third-party host loadm.exelator.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 35 | t-unknown-third-party-host-px-ads-linkedin-com | T | unknown third-party host px.ads.linkedin.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 36 | t-unknown-third-party-host-ih-adscale-de | T | unknown third-party host ih.adscale.de | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 37 | t-unknown-third-party-host-simage2-pubmatic-com | T | unknown third-party host simage2.pubmatic.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-unknown-third-party-host-pdw-adf-userreport-com | T | unknown third-party host pdw-adf.userreport.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 39 | t-unknown-third-party-host-aa-agkn-com | T | unknown third-party host aa.agkn.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | t-unknown-third-party-host-load77-exelator-com | T | unknown third-party host load77.exelator.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 41 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 42 | t-unknown-third-party-host-a-audrte-com | T | unknown third-party host a.audrte.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 43 | t-unknown-third-party-host-sync-teads-tv | T | unknown third-party host sync.teads.tv | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 44 | t-unknown-third-party-host-pm-w55c-net | T | unknown third-party host pm.w55c.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 45 | t-unknown-third-party-host-dmp-adform-net | T | unknown third-party host dmp.adform.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 46 | t-unknown-third-party-host-s-ad-smaato-net | T | unknown third-party host s.ad.smaato.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | t-unknown-third-party-host-su-semasio-net | T | unknown third-party host su.semasio.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 48 | t-unknown-third-party-host-bpi-rtactivate-com | T | unknown third-party host bpi.rtactivate.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 49 | t-unknown-third-party-host-dsp-adfarm1-adition-com | T | unknown third-party host dsp.adfarm1.adition.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 50 | t-unknown-third-party-host-redirect-frontend-weborama-fr | T | unknown third-party host redirect.frontend.weborama.fr | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 51 | t-unknown-third-party-host-id5-sync-com | T | unknown third-party host id5-sync.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 52 | t-unknown-third-party-host-eb2-3lift-com | T | unknown third-party host eb2.3lift.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-unknown-third-party-host-onetag-sys-com | T | unknown third-party host onetag-sys.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 54 | t-unknown-third-party-host-cookie-matching-mediarithmics-com | T | unknown third-party host cookie-matching.mediarithmics.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 55 | t-unknown-third-party-host-pixel-onaudience-com | T | unknown third-party host pixel.onaudience.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-unknown-third-party-host-d-turn-com | T | unknown third-party host d.turn.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 57 | t-unknown-third-party-host-ice-360yield-com | T | unknown third-party host ice.360yield.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 58 | t-unknown-third-party-host-pixel-byspotify-com | T | unknown third-party host pixel.byspotify.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 59 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 60 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 4/4 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.facebook.com" |
| 61 | t-unknown-third-party-host-s-seedtag-com | T | unknown third-party host s.seedtag.com | 2/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 62 | t-unknown-third-party-host-ce-lijit-com | T | unknown third-party host ce.lijit.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 63 | t-unknown-third-party-host-sync-aniview-com | T | unknown third-party host sync.aniview.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 64 | x-sign-in-account-links | X | sign-in / account links | 4/4 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 65 | chrome-menu | M | header menu: Accés, ca, Productes i serveis (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 66 | chrome-search | S | header search: Inicia Cerca (chrome only) | 1/1 | index-backed | widget | self | pending | search-index-backed | none (results from the query index; overlay and typeahead per the contract) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 6 row(s) — read-settings, settled-dom-snapshot, chrome-interaction, search-index-backed.
- **One owner decision batch:** 57 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production endpoint; interim capture ships now · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 2 row(s) — no work.
- **Host-bound on the target:** 2 of 2 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 50
- **detect** — 6
- **interactive** — 3
- **off-origin data** — 2
- **capture** — 1
- **forms** — 1
- **locale wave** — 1
- **search** — 1
- **register** — 1
