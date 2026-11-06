# Persistent world formations

| Field | Value |
|-------|-------|
| **Status** | `building` (Well-Ring first install) |
| **Blocked on** | Formation careers / commissions later |
| **Issue** | none yet |
| **Chat / PR** | `cursor/persistent-world-formations` · PR #212 |
| **Updated** | 2026-11-06 (pre-merge verification) |

**Hub:** [`formations-and-arrays.md`](formations-and-arrays.md) · [`npc-agency-well-ring.md`](npc-agency-well-ring.md) · [`personal-residence.md`](personal-residence.md)

## Intent

Formations exist as **physical installations** in the world — owned by institutions or NPCs — independently of the player. First slice: Well-Ring Lodge meditation-court Spirit Gathering. Sets up future demand for formation expertise when lines fade.

## Design notes

### Schema (`G.worldFormations`)

```text
G.worldFormations = {
  version: 1,
  byId: {
    wr_courtyard_spirit_gathering: {
      id, formationId, locationId, siteLabel,
      ownerKind: 'institution', ownerId: 'well_ring_lodge',
      powerMode: 'ambient' | 'stones',
      active, fuel, integrity, scattered,   // same operating shape as residence slots
      originUnresolved
    }
  }
}
```

- **Single authority:** install state lives only in `byId`.
- Lodge holds soft pointers: `G.wellRing.lodge.formationInstallIds` (ids only — no second slot copy).
- Reuses `FORMATIONS` pattern defs + integrity bands from F1a.

### Well-Ring install

| Field | Value |
|-------|-------|
| Id | `wr_courtyard_spirit_gathering` |
| Pattern | `spirit_gathering` (+8% cultivate while running, integrity-scaled) |
| Site | Redwell · Well-Ring meditation court |
| Power | **Ambient** — no spirit-stone burn; integrity still decays from neglect |
| Start | Active, integrity 88 (Sharp) |
| Origin | **Unresolved lore** — not a Redwell grandmaster; second-hand diagram / visiting artisan / departed outer are open |

### Effects

- Eligible: living Well-Ring affiliates **physically present** at Redwell.
- Player: Well-Ring **member** at Redwell only.
- Inactive / scattered / depleted → no benefit.
- Applied once via NPC growth rate mult / player passive support mult.

### Observation

Visiting the lodge shows a short sensory line (operating / worn / scattered). No exact fuel/integrity numbers.

### Tick

`registerWorldTick('worldFormations', …, 38)` before `worldNpcs` growth so growth sees current state. Also hooked from `processWorldTimeLegacy` so the fallback clock path cannot skip decay.

**Verified (pre-merge):** integrity decays via world ticks while the player is away / without opening the lodge; ensure preserves object identity and does not restore starter integrity 88; observation is read-only; benefits are location- and operative-gated once.

**Known limitation:** large batched NPC growth uses presence at tick time for the whole segment (same as other world-NPC systems) — not sub-month presence interpolation.

### Follow-up

Inscription maintenance (ordinary line-retrace): [`formation-inscription-upkeep.md`](formation-inscription-upkeep.md).

## Open questions

- Who originally laid the Well-Ring court pattern?
- When integrity hits scattered, who notices / who can be hired to reinscribe?
- Ambient vs stone-powered for other Dustbone halls?

## Implementation crumbs

- [`world-formations.js`](../../world-formations.js)
- [`well-ring-lodge.js`](../../well-ring-lodge.js) org pointer + migrate
- [`world.js`](../../world.js) `tickWorldNpcGrowth` local mult
- [`passive-cultivation.js`](../../passive-cultivation.js) player lodge mult
- Tests: `scripts/test-world-formations.js`
