---
name: Caixa d'Enginyers — current state
colors:
  background: "#ffffff"
  text: "#434343"
  primary: "#164194"
  secondary: "#4568aa"
  accent: "#415465"
  surface: "#ececec"
  border: "#d9d9d9"
  navy: "#1b2443"
  amber: "#fab03b"
typography:
  h1: { fontFamily: latolight, fontSize: 60px, fontWeight: 500 }
  h2: { fontFamily: latoregular, fontSize: 45px, fontWeight: 500 }
  h3: { fontFamily: latoregular, fontSize: 36px, fontWeight: 500 }
  body: { fontFamily: latoregular, fontSize: 16px }
  button: { fontFamily: latobold, fontSize: 16px }
rounded:
  pill: 25px
  card: 10px
  small: 5px
  circle: 50%
components:
  button-primary: { background: "#164194", color: "#ffffff", rounded: 25px }
---
<!-- stardust:provenance writtenBy=stardust:extract mode=prep writtenAt=2026-10-26T17:32:00Z sources=stardust/current/_computed-styles.json,stardust/current/assets/css/main.css -->

# Design — Caixa d'Enginyers (current state, descriptive)

## Overview

Corporate banking site on Liferay. White canvas, dark-grey text (#434343), royal blue (#164194) as the brand primary for buttons, sub-navigation band and headings accents; deep navy (#1b2443) for the header's right column and footer contact block; amber (#fab03b) for the "Accés" button and product-card highlights; light grey (#ececec) for the footer and surface bands.

## Colors

Census-weighted (`_computed-styles.json § aggregate.colors`): #ffffff background, #434343 text, #164194 primary, #4568aa secondary/link, #415465 accent text, #ececec surface, #d9d9d9 hairlines, #1b2443 navy, #fab03b amber.

## Typography

Lato in three self-hosted cuts registered as separate families: `latoregular` (body, headings), `latobold` (buttons, emphasis), `latolight` (hero titles). Ad-hoc scale: 60 / 45 / 36 / 30 / 25 / 22 / 20 / 18 / 16 / 14 px.

## Elevation

Mostly flat; card ring shadow `rgba(14,63,126,.04) 0 0 0 1px …`.

## Components

Pill buttons (radius 25px, latobold 16px), product cards (radius 10px) with coloured headers, photo heroes with a left text column, request form with contact aside (phone / WhatsApp / office finder), 4-column footer.

## Do's and Don'ts

Keep it as captured — this file describes the current state; the replica flow promotes it verbatim.
