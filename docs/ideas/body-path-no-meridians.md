# Body path — meridians are qi-only (design lock)

| Field | Value |
|-------|-------|
| **Status** | `designed` (lock) |
| **Blocked on** | Body chamber refactor / spine migration |
| **Issue** | none yet |
| **Updated** | 2026-10-15 |

## Intent

**Meridians** are the **qi path’s secondary circulation** — rivers that serve the **dantian (heart)**. They are **not** part of body forging, exterior/interior tempering, pearl, or physique birth.

Do **not** assume body Nascent Physique (or any body realm) gates on meridian opens, meridian layer %, or `G.meridians` from the body chamber.

## Design rule

| System | Meridians |
|--------|-----------|
| **Qi / dantian** | Yes — open meridians, meridian chamber, techniques, foundation |
| **Body / vessel** | **No** — use skin, flesh, bone, organ, blood, nerve, pearl, rune, source layers only |

Body **nerves** (Nerve Sea, neural capstone) stay for **Essence Pearl / refinement** — not the same as qi meridians.

## Implementation debt (do not forward-design around this)

Live repo may still show:

- Body chamber **Meridians** tab and `BODY_CHAMBER_LAYERS.meridians`
- `BODY_VESSEL_REALM_SPINE[3].layers: ['meridians']` + `requireNervesRefined` in `data.js`
- Body actions that set `G.meridians[index]` from chamber clicks

Treat as **legacy misplaced qi mechanic** until migration (**owner 2026-10-16:** remove from body path — not hide-only). Meridians live on **qi meridian action / qi chamber** when implemented. New body docs and Issues must **not** add body progression on meridians.

## Related

- [`nine-realm-ladder.md`](nine-realm-ladder.md) — Nascent Physique row  
- [`body-stat-layers-additive.md`](body-stat-layers-additive.md) — layer stack  
- [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md) — figure layers (meridian **art** may become qi-only view or deleted from body silhouette)
