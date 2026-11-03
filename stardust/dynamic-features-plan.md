# Dynamic features plan — caixaenginyers.com

| phase | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| interactive (C0 foundation) | header: segment tabs, "Productes i serveis" mega menu, Accés popup, language switch, search overlay | nav document | chrome-compare vs `stardust/chrome/header-contract.json` | none | M |
| martech (before deploy) | `scripts/martech.js` scaffolded off (GTM route + CookieFirst CMP) | `stardust/martech-contract.json` | `dynamics-check` martech feature on the published origin | turn parts on | S |
| forms (with the program archetype) | form block: request form UI, submission blocked with a "no backend connected" note | fields authored in the block | renders at 1440/360, gate row | endpoint for regulated-pii submissions | M |
| sign-in (with the form archetype) | login block posting to the source banking host | block rows: action URL, labels | renders; action equals source | banking host | S |
| search (interim) | search box submits to the source results page | — | link resolves | site-wide index | S |
