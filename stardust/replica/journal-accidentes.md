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
