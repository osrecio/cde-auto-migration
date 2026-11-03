---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-26T17:31:38Z
  againstInput: https://www.caixaenginyers.com/hipoteca-jove
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.caixaenginyers.com,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-26T17:31:38Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Hands-off: activated 2026-10-26T17:31:38Z (--hands-off on stardust:replica). Roster: 10 of 479 discovered — the
run's fixed page scope (stardust/.labs/site-plan.json selected pages), not the full site.
First page first: home (index). Publish decision: publish (made by the owner up front).
Martech: carry over the source analytics, tags and consent with every contract part disabled.

## Link audit decision — scope extension repointed (2026-10-27, rollout E2)

The run scope is fixed at the 10 selected pages of the site plan. Every internal target outside it is a
SCOPE EXTENSION (outside the declared caps), not a capture gap, so it stays an absolute link to the source
site (www.caixaenginyers.com) — never authored from a live read, never left as a 404. The listed source
paths (the localize-links report's visible top 20 of ~100 distinct targets; full href×status table in
stardust/rollout/link-audit-results.tsv): see stardust/rollout/link-audit-kept.txt. In-scope targets are
all root-relative (localize-links --check: 0 still localizable). 130 unique hrefs GET-checked in a browser:
130 resolve (2xx/3xx). The es locale tree was never captured (out of scope) — the language switch links
to the source site.
