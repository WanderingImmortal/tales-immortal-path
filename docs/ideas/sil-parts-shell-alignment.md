# Silhouette parts aligned to `#sil-shell`

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for a fit script; full shell split is optional polish |
| **Issue** | none yet |
| **Chat / PR** | arm/hand bone fit thread · [#175](https://github.com/WanderingImmortal/tales-immortal-path/pull/175) (overlay mask → shell only) |
| **Updated** | 2026-11-01 |

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

## Bone overlay fit (shipped slice)

Bones are no longer masked-to-fit — every `BODY_BONE_DEFS` path is **authored inside `#sil-shell`**:

- `node scripts/fit-body-bones-to-shell.js --write` — arm + hand paths from shell scanline midlines (re-run after re-tracing the shell)
- `node scripts/render-body-bone-fit.js [out.svg] [--view=x,y,w,h]` — PNG preview, bones coloured by clearance
- `node scripts/audit-body-overlay-fit.js` — **fails** if any bone is malformed, outside the shell, or too close for its lit stroke; checks joint anchors sit inside their `sil-patch-*` disc
- Hands are per-digit defs (`finger-thumb` … `finger-pinky`) in a generated `<fit:hand>` block; feet are per-toe literals (`toe-big` … `toe-5`, big toe longest, little toe shortest)
- Skull, scapula, sacrum and leg shafts are hand-authored literals in `body-chamber.js`; same audit gates them
- **Refinement chunks** = each bone def's `action` (hands, arms, legs, feet, ribs, spine, skull, marrow). Fill is per action, so refining hands only lights hand bones; the audit fails on unknown or empty chunks. Preview one chunk with `render-body-bone-fit.js --refine=hands`
- Audit densifies straight segments (earlier it only checked line endpoints)

Known gap: muscle / nerve / blood overlays still hug the old arm edge (e.g. `nerve-arm-*`, `blood-arm-*`) — same scanline approach applies.

## Prerequisites

- [~] `scripts/audit-body-overlay-fit.js` checks **parts** against `#sil-shell` (warn only today; parts are hit regions)
- [ ] `node scripts/fit-silhouette-parts-to-shell.js` writes paths; run in PR when touching `sil-shell` or part params

## Open questions

- Should ghost-layer fills use **shell clip per region** instead of `<use href="#sil-hand-l">`?
- When `#sil-shell` is re-traced, do we re-run fit automatically in CI?

## Implementation crumbs

- `scripts/build-body-silhouette-parts.js` — part authoring
- `index.html` — `<path id="sil-*">`, `#body-mask-silhouette-only`
- `body-chamber.js` — `BODY_SILHOUETTE_PART_IDS`, region pulses on `.body-sil-shape`
