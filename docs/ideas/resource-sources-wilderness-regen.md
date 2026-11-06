# Shared resource sources & wilderness regeneration

| Field | Value |
|-------|-------|
| **Status** | `shipped` |
| **Blocked on** | none for Dewcatch / Wei slice |
| **Issue** | none yet |
| **Chat / PR** | [PR #209](https://github.com/WanderingImmortal/tales-immortal-path/pull/209) |
| **Updated** | 2026-11-06 |

## Intent

Distinguish **physical extraction** from a location (or institutional store) from **intentional abstract rewards**. Dewcatch Scrub is the first regenerating wilderness source; Wei’s field gather draws from that stock. Reusable contract — not a full economy or ecology.

## Design notes

### Source types

| Type | Meaning |
|------|---------|
| `finite_stock` | Persistent inventory; decreases on removal; no regen |
| `regenerating_stock` | Persistent inventory; bounded regen on `G.ageMonths` |
| `abstract_reward` | Explicit non-stock grant (duty stipend, explore RNG, sect garden) |

### Schema (runtime on `G.world.resourceSources`)

```text
{
  version: 1,
  byId: {
    <sourceId>: {
      id, type, locationId, ownerKind, ownerId,
      resourceId, stock, maxStock,
      regenAmount, regenPeriodMonths, lastProcessedMonths,
      playerShared, notes
    }
  },
  acquisitions: [{ key, sourceId, amount, atMonths, actorId, … }]  // duplicate guard
}
```

Authored defs live in `RESOURCE_SOURCE_DEFS` / `ABSTRACT_RESOURCE_REWARDS` in `resource-sources.js`.

### Dewcatch (provisional balance)

| Param | Value | Notes |
|-------|-------|-------|
| Source id | `dewcatch_scrub_spirit_herbs` | Location-owned |
| Resource | `spirit_herb` | NPC pouch unit |
| Initial / max | 6 / 10 | Provisional |
| Regen | +1 / 2 months | Clamped to max; large skips deterministic |

### Transfer rules

- Validate source, resource identity, presence (when required).
- All-or-nothing debit; credit receiver once; restore stock if credit fails.
- Reject duplicate `acquisitionKey`.
- Abstract grants use `grantAbstractResourceReward` — never debit location stock.

### Player compatibility (gap)

| Actor | Dewcatch yields | Shared stock? |
|-------|-----------------|---------------|
| Player explore | `dust_root`, `dawn_dew`, `saltbrush_tip`, `marrow_thistle` (alchemy mats) | **No** — remains explore RNG (`abstract_reward` class) |
| Wei / NPC pouch | `spirit_herb` → `cultivationPouch.spiritHerbs` | **Yes** — Dewcatch regenerating source |
| Craft `spirit_herb` elsewhere | Zone explore / shops / sect garden | Separate; not auto-mapped to Dewcatch |

Do **not** invent equivalences between named alchemy reagents and NPC spirit herbs without an owner decision.

### Preserved abstractions

- Lodge duty herb stipend → abstract
- Well-Ring storehouse theft → existing finite `herbStock` (conserved); not this wilderness module
- Sect spirit garden → existing `pendingHerbs`
- Player field-site explore rolls → unchanged

## Prerequisites

- [x] NPC travel / presence ([PR #208](https://github.com/WanderingImmortal/tales-immortal-path/pull/208))
- [x] Wei `gather_field_herbs` + pouch
- [ ] Optional later: player gather sharing a stocked reagent id

## Open questions

- Should player Dewcatch gather eventually deplete a reagent-specific stock?
- Map `spirit_herb` ↔ any named scrub reagent, or keep forever separate?

## Implementation crumbs

- `resource-sources.js` — contract, regen tick (priority 43), transfers
- `npc-ambitions.js` — `executeNpcFieldHerbAction` stocked gather
- `core.js` — migrate on load
- Storehouse pattern reference: `well-ring-lodge.js`
