# Golden Core — cultivation journey (substages & core quality)

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner review) |
| **Blocked on** | [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md); [`tribulation-per-realm-limbo.md`](tribulation-per-realm-limbo.md) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent brainstorm, 2026-07-21 |
| **Updated** | 2026-07-21 |

## Intent

Golden Core should feel as fleshed out as Foundation Establishment: named **substages** inside idx 2, a **core quality** ladder (not elemental typing), and a clear capstone before Nascent Soul. The core is **condensed qi** — spirit root carries affinity; techniques carry element; the golden core carries **grade and condition**.

## Design notes

### Substages (early / middle / late)

Colloquial **early / middle / late** in UI; flavor names for chamber/diary:

| Stage | Name | Job | Rough meter |
|-------|------|-----|-------------|
| Early | **Nascent Core** | Stabilise — core fragile after tribulation | ~0–40% |
| Middle | **Expanding Core** | Grow — main calendar sink; capacity, mass, resonance | ~40–80% |
| Late | **Purifying Core** | Polish — impurities, grade, prep for capstone | ~80–100% |

Not separate `realmIdx` values — labels on the same watershed basin.

### Chamber verbs (sketch)

| Stage | Actions |
|-------|---------|
| Nascent | Circulate, anchor — stop wobble / cracks |
| Expanding | Expand resonance, nourish core — **no elemental commit** (grow mass/capacity, not fire/water typing) |
| Purifying | Purify, temper — pills/materials preferred over technique sacrifice |

**Essence** (future) may have elemental draws; core remains untagged refined qi.

### Leaving FE vs peak GC

| Beat | Name | Notes |
|------|------|-------|
| FE exit | **Initial Core Formation** | Thin limbo → immediate tribulation → enter Nascent Core |
| Realm capstone | **Consolidate** (not Seal) | One action; Settled (80%+) or Peak (100%) — e.g. *Consolidate Core* |
| Optional max | **Condense Core** | After peak consolidate — see [`golden-core-condense-peak.md`](golden-core-condense-peak.md) |

Owner preference: retire **Seal Dantian** as qi-path capstone label; keep "seal" for other fiction (sites, blood, etc.). Code already uses `consolidation` internally.

### Core quality (grades)

**Four grades:** Inferior → Standard → Superior → Peak

**Conditions** (separate from grade):

| Condition | Role |
|-----------|------|
| **Cracked** | Healable damage; may cap grade |
| **Broken** | Tribulation scar — capped, no NS path; mostly NPC tragedy — see [`broken-core-cultivators.md`](broken-core-cultivators.md) |
| **Flawed** | Optional permanent scar flag; may fold into Inferior |

**Imprints** (optional tags on **Peak** grade — not grade 5): intent rune, heaven mark, ancestor aid, dao seed. Mutually exclusive or one-per-life TBD. Balance parked.

Foundation variant **echoes** at Initial Core Formation; GC grind **raises** grade within band; **Consolidate** locks grade for NS.

### Power scaling rule (owner)

- **Equal field, equal prep, all else equal → late GC wins 100%.**
- Jianghu is never equal — formations, ambush, home ground, exhaustion, counters. Gap should **feel** uncrossable but **is** crossable with receipts.
- Early vs late: same `realmIdx`, different **stage + grade + foundation echo + condition**. Peak FE may threaten **nascent** GC; should lose to **mid+** expanding GC in a fair fight.

### Realm claim (summary)

**Domain** — physical qi pressure in space (not social metaphor). See [`domain-system.md`](domain-system.md). Expanding Core grows domain; local politics follow from presence.

### Parked with tribulation rework

- Tribulation scars on success — may merge with core **condition**; see tribulation ideas doc.
- [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) — reads band + integrity, not element.

## Prerequisites

- [ ] FE exit redesign (Initial Core Formation)
- [ ] Consolidate copy pass (`PATHS.qi.capstone`, `CULTIVATION_ACTION_GUIDE`)
- [ ] Core quality data model (`grade`, `condition`, optional `imprint`)
- [ ] GC chamber action set (replace generic gather-only grind)

## Open questions

- [ ] Perfect consolidation vs Peak consolidate at GC
- [ ] Imprint obtain paths and exclusivity
- [ ] School vs sect — see [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)
- [ ] Sect founding gate: Peak FE school vs GC full sect

## Implementation crumbs

- `consolidation.js`, `CONSOLIDATION_BY_REALM[2]`, `REALM_PROGRESS_TIERS`
- `chamber.js` — new GC actions; move `condenseCore` off FE (`targetRealmIdx: 1`)
- `foundation.js` — echo into core at formation
- `realm-claims.md`, `combat.js` — core grade in scaling (future)

## Links

- [`golden-core-condense-peak.md`](golden-core-condense-peak.md)
- [`domain-system.md`](domain-system.md)
- [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)
- [`formations-and-arrays.md`](formations-and-arrays.md) — variance within GC band
