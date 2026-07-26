# Settlement lore (cities & markets)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | none for lore |
| **Issue** | none yet |
| **Chat / PR** | parked 2026-07-25; Threshold rename 2026-07-26 |
| **Updated** | 2026-07-26 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**Cosmology:** [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md)  
**Tiers:** [`city-tiers.md`](city-tiers.md)  
**QC slice:** [`qi-condensation-depth.md`](qi-condensation-depth.md)

## Per-settlement template

History, motivation, power, property gate, jobs, risk tone, marketKey, **cityTier**.

## Priority IDs

`bone_crossroads` (Threshold City) P0 · `celestial_market` P1 · `tide_harbor` P1 · `frost_gate` P2 · `ashvein_village` P2

---

## Threshold City (P0) — id `bone_crossroads`

**Display name:** Threshold City · **Type:** City · **Tier:** 1st ([`city-tiers.md`](city-tiers.md))

### History

Three dynasties fell under the **Law of Dust** (cascades). **Pinwright** pinned spring + ward; First empire became sand. Second built **towering sandstone walls** + Registry on pin. Third garrison collapsed fast. City = **shrunken shell** inside walls built for millions — organised chaos to stay under the cascade **threshold**.

### Motivation

- **Registry:** maintain pin; prevent Fourth Cascade (building caps, census).
- **Dune Riders:** open roads, tolls (HQ flavor at Miraj).
- **Sunscar:** reject soft city.
- **Ashen:** rites; warn against order concentration.

### Power

**Inside:** Registry Quarter (neutral scribes, well-keepers). **Gates:** Sandveil Tribunal — tribes do not garrison oasis (truce, fear, trade). Stationed apex thinner than a classic 1st-tier City Lord; full spines at camps/shrine.

### Property gate (QC v1)

**Rent a room** + **one expensive buyable courtyard/house**. Full cot→manor ladder later ([`personal-residence.md`](personal-residence.md)).

### Physical layers

First spring/channels · Second sandstone towers · Third iron scars · Bone totems = oath-road law.

### Market

Registry bazaar `marketKey: dustbone` — **basics-heavy** (anti-cascade caps). Luxuries = import or travel.

### Risk

Safe inside walls (mostly); roads bandits; wealth display → visibility later.

### Jobs (QC v1)

Loader, Registry copyist, well attendant, bone-marker sweeper, short escort — at **Threshold City**. Fat jobs dry up. Su caravan = prestige risk. See [`work-and-professions.md`](work-and-professions.md), [`qi-condensation-depth.md`](qi-condensation-depth.md).

---

## Celestial Market (P1 stub)

Merit + money; auction inner lots; political risk; auction clerk jobs. Imperial / Longcheng cluster.

## Tide Harbor (P1 stub)

Money talks; Guild power; pirate cargo risk; dock jobs. Strong 1st-tier candidate.

---

## Implementation crumbs

`WORLD_LOCATIONS.bone_crossroads` — `name: 'Threshold City'`; `marketKey`; future `SETTLEMENT_PROFILES`
