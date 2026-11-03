
- (2026-10-27, rollout E) `verify.mjs`/`lib.mjs publicUrl()` turns a folder-form migrated file (`stardust/migrated/<slug>/index.html`) into `/<slug>/`, but deploy publishes such pages at `/<slug>` → false HTTP 404 on 3 archetypes. Sibling rows (migratedHtml null) were fine. Fix upstream: derive the URL from `delivery.deployedUrl` when present.
  Applied in the project copy (stardust/scripts/rollout/lib.mjs `publicUrl()`: `delivery.deployedUrl` pathname wins) at F-optimize, after optimize.mjs silently inspected 7 of 10 pages for the same reason; verify then read 10/10 unaided.

- (2026-10-27, rollout I) `dashboard.mjs` counted source-parity findings (informational by optimize's contract) as open per page, so a clean site read "optimised 0/10". Project copy now filters them with `isSourceParity()` before the per-page count → 10/10.
