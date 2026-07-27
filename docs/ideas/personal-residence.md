# Personal residence (rent → buy → hire)

| Field | Value |
|-------|-------|
| **Status** | `building` (QC minimal home) |
| **Blocked on** | Full ladder: [`economy-framework.md`](economy-framework.md), [`work-and-professions.md`](work-and-professions.md) |
| **Issue** | none yet |
| **Chat / PR** | QC playtest `cursor/qc-playtest-fixes` |
| **Updated** | 2026-07-27 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**Vision split:** [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md)  
**QC cut:** [`qi-condensation-depth.md`](qi-condensation-depth.md)

## Intent

**Personal anchor** without founding sect: **rent → buy → hire** guards/staff. `G.dwelling` separate from `G.sect`. Nomads stay travel-kit only.

## QC minimal home (shipping)

| Mode | What |
|------|------|
| **Rent** | Lodge → home screen (fiction + rest bonus + Rest here). Monthly rent tick. |
| **Buy** | Same + small **courtyard chest** (`G.dwelling.stash.materials`, cap 12) for reagents |
| **Homeless** | Lodge opens rent/buy shop; rest penalty |

Do **not** reuse sect Leader’s Quarters / `canAccessResidenceStash` for this.

## Full ladder (later)

**Rent:** Cot → room → suite → townhouse lease (zone multipliers). Monthly pay; eviction if broke.

**Buy:** Plot (build) → house → manor. Formation slots, hire slots, defences at owner tiers.

## Hire (not disciples)

Porter, night watch, bodyguard, shop clerk, furnace tender — wages/month; slots by property tier.

## Eventually

Migrate off `G.sect.residence` / Leader's Quarters as **only** home; sect HQ = bonus layer.

## Related

[`world-standing-and-property.md`](world-standing-and-property.md), [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md)

## Data sketch

```text
G.dwelling = { mode, zoneId, settlementId, tier, deed, stash, formations, hires, rentPaidThrough }
```

## Implementation crumbs

`qc-depth.js` (Lodge popup / stash), later `residence-stash.js` patterns, `formations.js`, `travel-kit.js`
