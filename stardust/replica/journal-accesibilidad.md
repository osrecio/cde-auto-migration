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
