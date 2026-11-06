# Institutional procurement & storehouse replenishment

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for Well-Ring slice |
| **Issue** | none yet |
| **Chat / PR** | PR #210 · `cursor/lodge-storehouse-procurement` |
| **Updated** | 2026-11-06 |

## Intent

Institutions replenish finite inventories through **bounded procurement**, not unlimited on-demand generation. Well-Ring Lodge storehouse is the first channel: abstract external supply into existing `herbStock`. Reusable pattern for future sect gardens, mines, merchants, tribute and markets — without building those yet.

## Design notes

### Three layers

| Layer | Role |
|-------|------|
| **Physical source** | Finite / regenerating deposit (e.g. Dewcatch) — geography |
| **Abstract external supply** | Purchases / tribute / deliveries not individually simulated |
| **Institutional inventory** | Stock the org owns after acquisition (Well-Ring `herbStock`) |

Dewcatch does **not** automatically supply the lodge.

### Schema (`G.world.resourceProcurement`)

```text
{
  version: 1,
  byId: {
    well_ring_herb_external: {
      id, institutionId, resourceId, channelType,
      physicalSourceId, destinationKind, destinationId,
      intervalMonths, maxPerDelivery, destinationCapacity,
      cost, lastProcessedMonths, notes
    }
  },
  history: [{ id, procurementId, amount, reason, atMonths, stockBefore, stockAfter, deliveryKey }]
}
```

Channel types (extension points): `abstract_external_supply`, `physical_source`, `controlled_garden`, `controlled_mine`, `merchant`, `tribute`, `market`.

### Well-Ring provisional balance

| Param | Value |
|-------|-------|
| Capacity | 24 (matches baseline `herbStock`) |
| Interval | 4 months |
| Max per delivery | 3 |
| Channel | `abstract_external_supply` |

Theft of 2 leaves a short gap until the next delivery window; emptying the shelves takes many deliveries to refill. Procurement never deletes loss / discovery / investigation records.

### Integration with #209

- Wilderness regen stays on `G.world.resourceSources`.
- Procurement is a sibling schedule on `G.world.resourceProcurement`.
- Lodge duty stipend remains `abstract_reward`; storehouse theft still depletes `herbStock`.

## Prerequisites

- [x] Resource sources (#209)
- [x] Well-Ring storehouse losses (#207)
- [ ] Future: physical supplier link, sect garden as controlled source

## Open questions

- When should lodge switch from abstract supply to a named physical feeder?
- Budget / cost fields — wire only when an institutional treasury exists

## Implementation crumbs

- `resource-sources.js` — procurement defs, process, history, tick (priority 42)
- `well-ring-lodge.js` — `herbCapacity`, migrate hook, inspect
- Destination adapter: `well_ring_storehouse_herbs`
