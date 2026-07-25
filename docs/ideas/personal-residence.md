# Personal residence (rent → buy → hire)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | [`economy-framework.md`](economy-framework.md), [`work-and-professions.md`](work-and-professions.md) |
| **Issue** | none yet |
| **Chat / PR** | parked 2026-07-25 |
| **Updated** | 2026-07-25 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**Vision split:** [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md)

## Intent

**Personal anchor** without founding sect: **rent → buy → hire** guards/staff. `G.dwelling` separate from `G.sect`. Nomads stay travel-kit only.

## Rent tiers (QC)

Cot → room → suite → townhouse lease (zone multipliers). Monthly pay; eviction if broke.

## Buy tiers

Plot (build) → house → manor. Formation slots, hire slots, defences at owner tiers.

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

`residence-stash.js`, `formations.js`, `travel-kit.js`, `sect-map.js` residence node
