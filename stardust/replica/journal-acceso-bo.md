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
