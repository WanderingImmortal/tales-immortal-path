# Work & professions (jobs, labor, craft paths)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | monthly tick; [`settlement-lore.md`](settlement-lore.md) |
| **Issue** | none yet |
| **Chat / PR** | parked 2026-07-25 |
| **Updated** | 2026-07-25 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)

## Intent

**Menial → skilled work** funds cultivation for QC–FE life sim. Merchant/alchemist = capital + craft margin, not infinite porter wages.

## Job tiers

| Tier | Pay (draft) | Gate |
|------|-------------|------|
| Menial | 40–120 low/mo | None |
| Trade | 150–400 low/mo + risk | QC |
| Skilled | mid stones/mo | Rep/apprentice |
| Licensed | Registry | FE+ |
| Self-run | alchemist/merchant margin | Capital |

`actionWork(jobId)` → months → stones ± rep/event.

## Bone Crossroads jobs (starter)

Loader (Dune), Registry copyist, well attendant, bone-marker sweeper, short escort — see [`settlement-lore.md`](settlement-lore.md).

## Fair employer

Pay on time → `cityStanding.contribution++`.

## QC loop without explore RNG

Work → rent → pills/materials → cultivate; craft → market sell.

## Data sketch

`G.employment`, `JOBS` table keyed by `settlementId`.

## Implementation crumbs

`advanceTime`, `WORLD_LOCATIONS`, `story-arcs` Merchant Su
