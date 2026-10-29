# program encoder — sibling render (template `program`)

Archetype: `/accidentes` → `content/accidentes.html` (read it as the reference encoding).
Siblings: /administraciones-publicas, /ahorro-vida, /asesoramiento-negocios,
/asesoramiento-personalizado, /asseguranca-patinet-electric, /hipoteca-jove.
Source: `stardust/current/pages/<slug>.json` (+ `.html`); verbatim text, never rewritten.

## Document shape (`content/<path>.html`, DA body format)
One section per block, in source order; omit a block the source page lacks. Last section ends
with the `metadata` block: `Title` (capture title), `Description` (capture description; omit when
null), `Template` = `program` (gives `body.program` → 30px footer gap).

1. **product-hero** (section metadata `Style: full-bleed`)
   - row 1: `<p><img src="https://content.da.live/aemcoder/3a4f1d39/media/<slug>/<file>" alt=""></p>`
     = the slider item CSS background (`media.cssBackgrounds[0]`); omit the row if none.
   - row 2: `h1`, text paragraphs (all render 22px), then one paragraph per CTA:
     `<p><strong><a>` = primary, `<p><em><a>` = secondary. Several slides → keep the first slide
     only and log it (no carousel in this block).
2. **product-body** — one row per unit, in order:
   - 1 cell text (p / ul / ol; lists get the yellow bullet);
   - 1 cell picture only (separator `raya-separadora`, centred images);
   - 2 cells = two columns (`.row > .col-md-6` ×2; first column centred, its bold text 22px accent);
   - keyword first cell: `lead` (source `.fs22`), `lead center` / `center`, `boxes` (each further
     cell one grey box; title `<p><strong>`, figure `<em>`, amount `<strong><em>N </em>unit</strong>`);
   - last row: the closing "Contractar ara" CTA alone (`<p><strong><a href="#formulario">`).
   Empty `&nbsp;` spacer paragraphs are NOT authored (block CSS supplies one spacer per unit).
   Tabs/accordions/card grids (ahorro-vida products, hipoteca-jove FIXA/VARIABLE) have no block
   here: author them as successive units (head/body two-column rows or text rows) and log a
   reconstructive downgrade; new blocks only if the sibling gate fails.
3. **product-legal** — one row per small-print paragraph; keyword `compact` when the source has
   `p.fs12` (12px line box) instead of `p > span.fs12`.
4. **related-products** — row 1: `<h2>Productes relacionats</h2>`; then one row per card:
   `[<p><img … alt=""></p>]` `[<p><a href="…">category</a></p><h3><em>top</em> <strong>bottom</strong></h3>]`
   (source `.related__sub`, `.top`, `.bottom`; bottom >10 chars renders 53px automatically).
5. **request-form** — row `<h2>` (Sol·licita'l ara / Vull informació / the source head), then
   keyword rows `intro` (desc; keep the source line break as `<br>`), `fields` (`<ul>` one `<li>`
   per DDM text field label), `consent`, `checkbox` (label text + link), `switch` (legend p +
   label p), `submit` (`<p>Envia</p>` — plain text, the block makes the control), `contact` ×n
   (`<p><img></p><p>label</p><p><a href><strong>link</strong></a></p>`). The block always blocks
   submission with the "No backend connected" message (dynamic-features row 3).

## Links / media
In-scope paths root-relative (`/accidentes`, `/ahorro-vida`, …); everything else absolute
`https://www.caixaenginyers.com/…`; `#formulario` stays. Editorial images via
`da-media-upload.mjs --scope <slug>`; decorative (bullets, arrows, asterisk) live in block CSS.

## Pre-PUT
delivery-lint, media-reconcile --apply, davids-model-lint (D1/D3 🟡 expected), localize-links
--check, sanitise.js, block-roundtrip `--map product-hero=.product-hero__item --map
related-products=section.related --map request-form=section.request` (siblings have no
prototype: the gate row against live is the check).
