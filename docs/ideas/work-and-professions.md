# Work & professions (jobs, labor, craft paths)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | monthly tick; [`settlement-lore.md`](settlement-lore.md) |
| **Issue** | none yet |
| **Chat / PR** | parked 2026-07-25 |
| **Updated** | 2026-07-26 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**QC cut:** [`qi-condensation-depth.md`](qi-condensation-depth.md)

## Intent

**Menial → skilled work** funds cultivation for QC–FE life sim. Merchant/alchemist = capital + craft margin, not infinite porter wages. Fat jobs **run out of work** for a while — no fake earnings caps; calendar time is the cost.

## Job tiers

| Tier | Pay (draft) | Gate |
|------|-------------|------|
| Menial | 40–120 low/mo | None |
| Trade | 150–400 low/mo + risk | QC |
| Skilled | mid stones/mo | Rep/apprentice |
| Licensed | Registry | FE+ |
| Self-run | alchemist/merchant margin | Capital |

`actionWork(jobId)` → months → stones ± rep/event.

## Redwell jobs (QC v1 starter)

At **Redwell** (`redwell`): well attendant, grit/loader, short escort, sweeper/marker, maybe letter copyist. Steady vs risk; fat jobs dry up. Su Heartlands caravan = prestige outlier (capital/caravan — **not** Redwell daily). Miraj is **not** the wage board. See [`redwell-starter-city.md`](redwell-starter-city.md), [`settlement-lore.md`](settlement-lore.md).

## Fair employer

Pay on time → `cityStanding.contribution++` (later).

## QC loop without explore RNG

Work → rent → pills/materials → cultivate; craft → market sell. Explore feeds materials only.

## Data sketch

`G.employment`, `JOBS` table keyed by `settlementId`.

## Implementation crumbs

`advanceTime`, `WORLD_LOCATIONS`, `story-arcs` Merchant Su
