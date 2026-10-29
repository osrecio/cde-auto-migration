# Lifted values — caixaenginyers.com (from the landing archetype, 2026-10-26)

Source: live computed styles (measure.mjs, 1440 + 360), `stardust/current/assets/css/main.css` / `clay.css`,
and the inline styles of the Liferay web contents. Tokens live in `stardust/prototypes/canon.css` (`:root`).

## Tokens
| token | value | source |
|---|---|---|
| --ce-blue | #164194 | `.btn-primary` bg, `.child-menu` bar, news titles |
| --ce-blue-link | #4568aa | `a`, `.news-date`, scroll-menu links |
| --ce-navy | #1b2443 | `.heading-right`, `.footer-right` |
| --ce-navy-deep | #071e47 | `#boton-fijo` award card |
| --ce-ink | #434343 | `body` color |
| --ce-tab | #415465 | inactive `#navigation > ul > li > a`, `.bullets .dot` |
| --ce-yellow | #fab03b | `.online .header-button` (Accés), alta step numbers |
| --ce-grey-bg | #ededed | `.footer-left`, mobile Dona't d'alta cell |
| --ce-card-bg | #f8f8f8 | `.news-list .news-item` |
| --ce-dot | #dbdbdb | `.owl-dot span`, `.btn` border |
| --ce-focus-ink | #102137 | Focus quick-access subtitle/title |
| content column | 1148px, gutter calc((100vw-1148px)/2) = 146px @1440 | `.portlet-column-only … max-width:1148px; margin:0 auto` |
| mobile shell | `#main-content` padding 0 15px (<992) | computed @360 |

## Type (faces declared `font-weight: normal`; weight 700 on latoregular is synthesised as on live)
| element | family / size / line-height / weight | source |
|---|---|---|
| body | latoregular 16px / 1.428571429 | main.css `body` |
| strong, b | latobold, weight normal | main.css `strong` |
| h1/h2/h3 | 60/45/36px, lh 1.1, weight 500, margin 20 0 10 | main.css |
| p, ul | margin-bottom .625rem (10px) | main.css |
| .btn | latobold 16/20, padding 12px 18px, radius 25, border 2px #dbdbdb, vertical-align middle | main.css `.btn:not(.btn-unstyled)` |
| .btn-primary | #fff on #164194; hover #1b2443 on #00a5cc | main.css |
| top tabs | latoregular 20/20, padding 15; selected 700 #434343 | computed @1440 |
| child-menu items | latobold 16 / lh 55, padding 0 12 | computed @1440 |
| header buttons | latobold 14/20, padding 15 (desktop) / 12px, padding 15 0 (mobile) | computed |
| section title (`SOLUCIONS…`, `ESTIGUES AL DIA`) | 2em / 1.2em, #000, centered, margin 0 15 20 | inline style |
| section subtitle | latolight 1.4em / 1.2em | inline style |
| news title | latoregular 25px / 1.1, weight 500, #164194 | main.css `.news-title` |
| footer col title | latobold 14/14 weight 500, padding-left 5 | computed |
| footer links | 14/22 | computed |

## Chrome geometry (1440)
| part | value |
|---|---|
| #banner | 205px tall; heading-left 125px (logo 400x76 at y5); heading-right 510px navy panel (0–155) |
| #navigation | tabs at y105 h50; child bar y155 h55 (#164194) full bleed, padding calc(50% - 574px) |
| search launcher | 25x24 white svg, right gutter, y172 |
| footer | floats: left 784+146 grey (#ededed) / right 364+146 navy; both 351.219px + 70 padding; margin-top 40 after last section |
| mobile header (<992) | margin-top 9; logo 237x45 centred; fixed action bar top 52 h51: hamburger 81px #164194 · Accés #fab03b · Dona't d'alta #ededed |
| bullets | fixed right 100 (50 <1200, none <992), dots 8px #415465, active 12px #f9b03c |
| award badge | fixed bottom 10, left 90%, translateX(-80%), 300px, #071e47, radius 10 |

## Section rhythm (top margins, both widths): hero → 20 → quick → 40 → solutions → 20 → alta → 30 → ingenium → 10 → news → 10 → award (10) → 40 → footer
