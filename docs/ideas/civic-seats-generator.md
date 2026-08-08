# Civic seats generator

| Field | Value |
|-------|-------|
| **Status** | `building` (v1 on Redwell) |
| **Blocked on** | — |
| **Issue** | none yet |
| **Chat / PR** | `cursor/civic-seats-generator-design` |
| **Updated** | 2026-08-08 |

**Sisters:** [`city-tiers.md`](city-tiers.md) · [`jianghu-organization-types.md`](jianghu-organization-types.md) · [`redwell-starter-city.md`](redwell-starter-city.md) · [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) (orgs, not civic)

## Intent

One **shared civic seat system** so every city (and later outposts) gets living office-holders — lord, market, law, lodging — without hand-writing each face. **Same offices, different people.** Great sects / goliaths stay authored. This system is **who runs the town**, not who runs the jianghu.

Feel: at low realm in a 4th-tier pond, the City Lord is the ceiling. Same generator in a 1st-tier capital rolls a much heavier apex — still an office, not a novel.

## Scope — what it covers

### In

| Piece | Meaning |
|-------|---------|
| **Seat roles** | Persistent offices on a settlement (`city_lord`, `warden`, `market`, `inn`, `jobs`) |
| **Holders** | Rolled person: name, age/lifespan, lean, one tick, optional fate seeds |
| **Succession** | Age-out → new holder + short log |
| **Tier tables** | Which seats exist by city tier |
| **Culture packs** | Name pools + tick flavor by zone (Dustbone first) |
| **Thin interactions** | Meet / glimpse / rumor hooks read seat data (Redwell City Lord pattern) |

### Out (other generators / authored)

| Not this system | Where it lives |
|-----------------|----------------|
| Great sects, lineage manuals, immortal plots | Hand-authored |
| Lesser halls / mid-small sect rise-fall | [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) |
| Full job/bazaar/field content tables | Separate loop generators (later) |
| Loyalty / faction meters | Parked |
| Take-the-town / player becomes lord | Later civic play |
| Hall masters | Sect ecology pass — **not** civic v1 |

## One system, not one system per tier

One engine + **tier profile rows**. Capitals (**1st-tier**) and unique cities stay **authored** (generator off).

### Jobs / well face

Assume **all cities post jobs** by default. Still check `hasJobs` (default true) before rolling the jobs seat / showing Work UI. Crisis flips later — not v1.

## What a rolled holder looks like

```text
G.settlementSeats[settlementId][roleId] = {
  name, bornMonth, deathAgeYears, ageYears,
  lean: graft | clean | merchant | martial | clerk,
  tick: one short habit/line,
  fateSeeds: [stagnate, leave_up, wrong_enemy, age_out]
}
```

Legacy Redwell keys (`G.civicSeats.redwell_*`) are **mirrored** for old saves / call sites.

## Settlement profile

```text
settlementTier: 4
culturePack: 'dustbone'
hasJobs: true
seats: default-from-tier
overrides: { city_lord: { lean: 'graft' } }  // Redwell
labelOverrides: { warden: 'Road warden', ... }
```

## Warden seat

**One person** holds the office (seat id `warden`). Default title: **Captain of the Guard**. Redwell local label: **Road warden**. Implied small guard crew is flavor only — not simulated.

## v1 build slice

1. [x] Shared `ensureSettlementSeats(settlementId)` + tier defaults (`civic-seats.js`)
2. [x] Dustbone culture pack (names + ticks + lean weights)
3. [x] Migrate Redwell onto the kit — keep meet/glimpse/thanks
4. [x] Succession + lean/tick on holders; Work UI honors `hasJobs`
5. **Not v1:** other cities online, capital kit, hall-master gen, full fate pulses, crisis `hasJobs`

## Implementation

- `civic-seats.js` — engine, culture packs, Redwell profile, adapters
- `qc-depth.js` — Redwell meet / jobs / bounty consume seat data
- Capitals / other cities: add `SETTLEMENT_CIVIC_PROFILES` rows later
