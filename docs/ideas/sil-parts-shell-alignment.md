# Silhouette parts aligned to `#sil-shell`

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | none for a fit script; full shell split is optional polish |
| **Issue** | none yet |
| **Chat / PR** | arm/hand bone fit thread · [#175](https://github.com/WanderingImmortal/tales-immortal-path/pull/175) (overlay mask → shell only) |
| **Updated** | 2026-10-31 |

## Intent

Players see **`#sil-shell`** (traced outline). **`sil-upper-arm-*` / `sil-hand-*`** are separate procedural capsules from `scripts/build-body-silhouette-parts.js`. They were meant to tile into one figure, but they **extend past** the shell — so anything tuned or masked against “parts” disagrees with what you see. Goal: **one coherent silhouette** — parts should **fill the shell interior** per region (or be derived from the shell), not rough outer approximations.

## Current split (why bones felt wrong)

| Asset | Role |
|-------|------|
| `#sil-shell` | Visible gray body, skin sheen, overlay clip (after #175) |
| `sil-*` parts | Click/hover regions, ghost layer pulses, legacy mask union |
| `sil-patch-*` | Joint discs; good anchors (shoulder/elbow/wrist) |

Bones/muscles should use **shell + patches**, not hand/mitten paths that poke outside the trace.

## Options (pick one spine)

### A. Shrink-to-fit capsules (fastest)

Keep `taperedLimb()` / mitten hand **generators**, but add `scripts/fit-silhouette-parts-to-shell.js`:

1. Sample `#sil-shell` polygon (same as audit).
2. For each part, reduce radii / shorten hand template until **all vertices** are inside shell (or max inscribed clearance ≥ margin).
3. Emit updated `d` strings into `index.html` (or regenerate via `build-body-silhouette-parts.js`).

Pros: small diff, keeps parametric editing. Cons: still capsule-ish hands, not exact trace.

### B. Clip parts to shell (better shape)

Generate candidate capsule → **polygon clip** against shell (intersection). Store result paths per part. Limbs follow trace curvature better.

Pros: parts truly **subset of shell**. Cons: need clipper (inline Sutherland–Hodgman on flattened paths, or a tiny dep).

### C. Re-cut subpaths from `#sil-shell` (best match, most work)

Split the single traced shell into limb/torso subpaths (manual in Inkscape once, or semi-auto by joint wedges). Parts **are** shell geometry.

Pros: matches art exactly. Cons: shell updates require re-export; harder to parametrize “widen arm 8°”.

### D. Shell-only display, parts = interaction only (hybrid — partial today)

**Display / overlays:** only `#sil-shell` (+ patches). **Hit tests:** keep simplified polys or shrunk parts **inside** shell (invisible). Already done for bone **mask** in #175; extend to muscle guides and audits.

Pros: no visible mismatch. Cons: ghost tab fills on `sil-hand-l` still wrong until A/B/C.

## Recommended sequence

1. **Done / merging:** overlay mask = shell + patches (#175); bones anchored to patches; audit vs shell.
2. **Next implementable chunk (Issue):** **A + audit gate** — fit script fails CI if any part vertex exits shell; regen hand/forearm/upper-arm paths.
3. **Later:** B or C if hands still look wrong for layer fill / martial intent art.

## Prerequisites

- [ ] `scripts/audit-body-overlay-fit.js` checks **parts** against `#sil-shell` (not only bones)
- [ ] `node scripts/fit-silhouette-parts-to-shell.js` writes paths; run in PR when touching `sil-shell` or part params

## Open questions

- Should ghost-layer fills use **shell clip per region** instead of `<use href="#sil-hand-l">`?
- When `#sil-shell` is re-traced, do we re-run fit automatically in CI?

## Implementation crumbs

- `scripts/build-body-silhouette-parts.js` — part authoring
- `index.html` — `<path id="sil-*">`, `#body-mask-silhouette-only`
- `body-chamber.js` — `BODY_SILHOUETTE_PART_IDS`, region pulses on `.body-sil-shape`
