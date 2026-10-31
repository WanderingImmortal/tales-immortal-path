# Body skeleton: art-first pipeline (stop hand-tuning bone coordinates)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | owner picks source (A generate / B warp existing SVG) and supplies the art |
| **Issue** | none yet |
| **Chat / PR** | bone fit threads · [#178](https://github.com/WanderingImmortal/tales-immortal-path/pull/178) · [#179](https://github.com/WanderingImmortal/tales-immortal-path/pull/179) |
| **Updated** | 2026-11-01 |

## Why the current approach keeps being "off by a bit"

Bones are coordinates typed against a shell that came from an image generator. The shell has its own pose and proportions (thumb swung out, feet pointing outward, narrow head). Every bone is a guess that must agree with that figure, and "looks like a real skeleton" is judged by eye, so each pass fixes one thing and exposes the next. The audit proves bones are **inside** the shell; it cannot prove they are **anatomically right**.

## Recommended spine: derive the skeleton from the same reference as the shell

`art/body-chamber/reference.png` is the source of `#sil-shell`. Do the same thing for bones:

1. **Generate a skeleton from that image** (image-to-image / edit): same pose, same framing, "anatomical skeleton, X-ray, front view, black on white, no shading". Keep the prompt and seed in `art/body-chamber/README.md`.
2. Save as `art/body-chamber/skeleton-reference.png`; trace with the existing potrace pipeline (`scripts/trace-body-silhouette-reference.js` pattern) into game coordinates.
3. **Split into refinement chunks by region polygons** (hands, arms, legs, feet, ribs, spine, skull; marrow stays procedural). Each chunk is a `<path>` group that already maps to a bone `action`, so refine-hands still lights only hands.
4. Audit keeps the shell-clearance gate; add a per-chunk "non-empty" check.

Why this fixes the "last bit": proportions, thumb, toe order, rib count come from the picture, not from numbers someone tuned. Alignment to the shell is by construction (same source image).

Costs / risks: generators botch fingers/ribs (pick the best of N, hand-fix in an SVG editor once, not in code); traced outlines are filled shapes, so the stroke-based glow/`--bone-weight` CSS needs a fill-style variant; per-bone pulse granularity drops to chunk level (fine for the current design).

## Alternative: warp an existing anatomical SVG

Take a CC0 / public-domain front-view skeleton SVG, fit it to the shell with ~12 landmark points (shoulder, elbow, wrist, hip, knee, ankle, skull top, pelvis) using a per-segment affine transform. Accurate bones, no generation lottery. Cost: license check, one-time landmark mapping script, and the shell's odd limb poses still need per-limb fitting.

## Not recommended

More procedural tuning in `body-chamber.js` (current path). Keep the existing procedural bones only as the fallback and for marrow.

## Open questions
- Generate (A) or warp existing SVG (B)? Can the owner supply a preferred skeleton image?
- Filled traced bones vs outline strokes for the refinement look?
- Keep per-bone ids, or is chunk-level (per region) enough?

## Implementation crumbs
- `scripts/trace-body-silhouette-reference.js`, `scripts/apply-body-silhouette-shell.js` — template for the skeleton trace/apply step
- `scripts/audit-body-overlay-fit.js`, `scripts/render-body-bone-fit.js` — keep as the fit gate / preview (`--refine=<chunk>`)
- `body-chamber.js` `BODY_BONE_DEFS`, `renderBodyBoneOverlay`, `getBodyActionFill`
