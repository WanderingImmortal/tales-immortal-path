# Cultivation manuals framework

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) owner sign-off; FE redesign direction |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

## Intent

**Cultivation methods** (manuals for *how you cultivate*) are a separate system from **combat techniques** (manuals for *how you fight*). The active cultivation method should drive chamber gather speed, realm gates, foundation shape, and — at higher tiers — **where** and **when** you can cultivate at all.

Early methods are often **breathing arts** — inward, portable, sect-basement fare. Mid and high methods increasingly **draw on worldly essence**: sun yang on a mountain at dawn, moon yin under a full moon, thunder qi in the heart of a storm. The fantasy escalates from “cycle breath in a room” to “align your dao with a force of nature.”

This doc is the **framework** (taxonomy, data model, hooks). Foundation **variants** and per-realm journeys are detailed in [`technique-driven-cultivation.md`](technique-driven-cultivation.md) and realm-specific idea files.

---

## Two manual tracks (hard split)

| Track | Player term | Current code | Purpose |
|-------|-------------|--------------|---------|
| **Cultivation method** | Cultivation manual / method | *(none — new pool)* | Active grind engine: gather, density, gates, foundation lineage |
| **Combat technique** | Martial manual / art | `TECHNIQUE_POOL`, `manualShelf`, `comprehendManual()` | Fight moves, intents, sets |

**Do not** fold cultivation methods into `TECHNIQUE_POOL`. Combat comprehension already shares UI (`manualShelf`, travel kit). Reuse **shelf / comprehend / consign** patterns, but separate pools and save keys.

`Focused Breath` today is a **combat buff** in `TECHNIQUE_POOL`, not a cultivation engine — rename or split when methods land so players are not confused.

---

## Method families (not all breathing)

Methods are grouped by **how qi enters the body**, not only by realm tier.

| Family | Tier feel | Fiction | Typical constraints |
|--------|-----------|---------|---------------------|
| **Breathing** | Mortal → Foundation | Inhale/exhale cycles, meridian routes, dantian rhythm | Indoor, sect chamber, low risk |
| **Circulation** | Condensation → Core | Core rotation, meridian loops, pill-assisted cycles | Needs stable foundation; often element-tagged |
| **Absorption** | Foundation → Nascent | Draw from **anchors** in the world | Location, time-of-day, weather, season |
| **Resonance** | Core → Void+ | **Harmonise** with a macro force (sun path, moon tide, storm eye) | Rare windows; high payoff; failure risk |
| **Forbidden / deviant** | Any (gated) | Blood, corpse, soul-siphon, thunder-body | Events, rep, tribulation skew |

**Design rule:** first life / QC–FE should **not require** leaving home — breathing + basic circulation covers the tutorial arc. Absorption and resonance are **aspirational** hooks for midgame manuals and exploration.

---

## World essence (higher-tier draw)

**Essence** = a tag on a method *and* on world state. Cultivation checks both.

| Essence tag | Example method name | World requirement (examples) |
|-------------|---------------------|------------------------------|
| `sun_yang` | *Vermillion Sun Scripture* (fragment) | Daytime, clear sky, high yang tile; stronger summer / noon |
| `moon_yin` | *Pale Moon Refinement* | Night, moon phase ≥ gibbous; weaker new moon |
| `storm_thunder` | *Nine Heavens Induction* | `weather === storm`, optional high elevation |
| `earth_vein` | *Bedrock Breathing* | Spirit vein node, sect array, or mountain depth |
| `water_tide` | *Returning Wave Art* | Coast / river; tide phase if region supports it |
| `wood_spring` | *Verdant Pulse* | Ancient forest, spring season |
| `metal_edge` | *Sharp Qi Forging* | Mine, forge, or battlefield remnant |
| `fire_heart` | *Crimson Furnace Cycle* | Volcano, forge fire, or sun yang + fire root synergy |

Essence methods still use a **base family** (usually absorption or resonance). Breathing is not replaced — it becomes the **fallback** when conditions are unmet (reduced efficiency, not hard block, unless method is `strict: true`).

### Condition UX (player-facing)

- Method card shows: **Ideal** / **Acceptable** / **Starved** (three bands).
- Starved: 25–50% speed, no essence **milestone** progress, possible stability drain.
- Ideal: full speed + essence meter fill (used for foundation variant tags and breakthrough bonuses).
- Optional **“Wait for conditions”** chamber action: advance time until next window (with opportunity cost vs explore).

---

## Data model (proposal)

```js
// data.js — new pool
const CULTIVATION_METHOD_POOL = [
  {
    id: 'basic_meditation_breath',
    name: 'Basic Meditation Breath',
    family: 'breathing',
    methodTier: 'mortal',           // parallels CULTIVATION_TIERS.reqRealm
    reqRealm: 0,
    rarity: 'common',
    elements: ['neutral'],          // classical element alignment
    essences: [],                   // empty = no world draw
    rootFit: { pentamixed: 1, mixed: 1, dual: 1, single: 1 }, // mult or fit score
    profile: {
      gatherMult: 0.85,
      densityEfficiency: 1.0,
      stabilityBias: 0.1,
      peakGateSoft: null,           // e.g. 0.7 = soft cap until better method
      foundationVariant: 'hasty_meditation',
      strictEssence: false
    },
    comprehendMonths: 2,
    desc: '...'
  },
  {
    id: 'vermillion_sun_fragment',
    name: 'Vermillion Sun Scripture (Fragment)',
    family: 'resonance',
    methodTier: 'foundation',
    reqRealm: 1,
    rarity: 'rare',
    elements: ['fire'],
    essences: ['sun_yang'],
    rootFit: { fire: 1.15, single: 1.05 },
    profile: {
      gatherMult: 1.35,
      densityEfficiency: 1.1,
      stabilityBias: -0.05,
      peakGateSoft: null,
      foundationVariant: 'yang_firm',
      strictEssence: false
    },
    worldReq: {
      sun_yang: { minBand: 'acceptable', idealBand: 'ideal' }
    },
    comprehendMonths: 6,
    desc: '...'
  }
];
```

### Player state

```js
G.cultivationMethods = {
  known: { 'basic_meditation_breath': { comprehended: true, mastery: 0 } },
  activeId: 'basic_meditation_breath',
  methodShelf: { /* parallel to manualShelf — scroll copies */ },
  essenceMilestones: { sun_yang: 0 },  // optional long-term fill per essence
  foundationLineage: 'hasty_meditation' // locked at FE seal from method + choices
};
```

### Derived gather (chamber hook)

Replace or multiply `getChamberCultivateMult()`:

```
effectiveMult =
  root.cultivateSpeedMult
  × method.profile.gatherMult
  × rootFitMatch(method, root)
  × essenceBandMult(activeEssence, worldState)
  × sect / trait / legacy (unchanged)
```

`chamberGatherQi()` reads `G.cultivationMethods.activeId` and applies `densityEfficiency` to density gain; optional `stabilityBias` feeds foundation pillar skew.

---

## Method tiers vs realm

Reuse `CULTIVATION_TIER_ORDER` / `reqRealm` for comprehension gates — **same ladder as combat manuals**, but separate catalog.

| methodTier | reqRealm | Typical families | Player expectation |
|------------|----------|------------------|------------------|
| mortal | 0 | breathing | Start here; creation pick |
| condensation | 0 | breathing, circulation | Sect outer manuals |
| foundation | 1 | breathing, circulation, absorption (weak) | FE identity choice |
| core | 2 | circulation, absorption | GC grind; first essence manuals |
| nascent | 3 | absorption, resonance | Travel + weather matter |
| void+ | 4+ | resonance, forbidden | Realm-specific fantasies |

**Gate rule:** cannot comprehend method with `reqRealm > G.realmIdx` (same as combat). Optional **root composition** hard gates on legendary methods (e.g. single-fire only).

---

## Acquisition & progression

| Source | Tier | Notes |
|--------|------|-------|
| Creation | mortal–condensation | 1 method bundled; CP spend for better tier ([`creation-screen-redesign.md`](creation-screen-redesign.md)) |
| Sect library / quest | condensation–foundation | Rep-gated |
| Explore / corpse loot | foundation–core | Zone-tagged essences |
| Markets | varies | Common breathing cheap; essence fragments expensive |
| Reincarnation unlock | tier ceiling | Better *starting* method tier, not auto endgame scripts |
| Breakthrough reward | next-realm | Sect promotion grants signature method |

**Upgrades within a line:** fragment I → II → complete (same `lineageId`, bump `profile`). Prefer **materials + time** over sacrificing combat techniques.

**Switching active method:**

- **Recommended:** free swap in chamber, **no** mid-FE foundation blend — lineage locks at **Seal** (see technique-driven doc).
- Optional: 1-month “adjust meridians” penalty if swapping across incompatible elements.
- Wrong method for your root: legal but **leaky** (fit mult &lt; 1).

---

## Integration map

| System | Hook |
|--------|------|
| **Roots v2** | `rootFit`, grade = speed stack; composition = which methods are *efficient* not *legal* |
| **Chamber Gather** | Primary consumer of `activeId` + essence band |
| **Foundation / seal** | `foundationVariant` + `essenceMilestones` at seal → [`technique-driven-cultivation.md`](technique-driven-cultivation.md) |
| **FE redesign** | Gather → stabilise → seal; method defines stabilise flavour text and gates |
| **Lifespan pacing** | Method tier + fit is a major lever for 80–90 FE peak target ([`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)) |
| **World / travel** | Regions expose essence strength; storms, moon phase, time-of-day |
| **Tribulation** | Volatile methods (thunder, yang overload) ± trib odds |
| **NPC sense** | Advanced readers detect method lineage / essence saturation ([`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md)) |
| **Body / soul paths** | Parallel **body methods** / **soul meditations** later — same framework, different chamber |

---

## Example methods (sketch catalog)

### Early — breathing (no essence)

| id | Name | Notes |
|----|------|-------|
| `basic_meditation_breath` | Basic Meditation Breath | Default mortal; slow, stable |
| `sect_qi_cycling` | Outer Sect Qi Cycling | Slightly faster; needs sect |
| `impure_meridian_breath` | Impure Meridian Breath | Pentamixed-friendly; leaky but playable |

### Mid — circulation + weak absorption

| id | Name | Essence | Notes |
|----|------|---------|-------|
| `five_phase_minor_cycle` | Five Phase Minor Cycle | — | Pentamixed endgame bait; slow unless all elements represented in root |
| `bedrock_breathing` | Bedrock Breathing | `earth_vein` | +gather on mountain tiles |
| `returning_wave` | Returning Wave Art | `water_tide` | Coast regions |

### High — resonance (owner examples)

| id | Name | Essence | Notes |
|----|------|---------|-------|
| `vermillion_sun_fragment` | Vermillion Sun Scripture (Fragment) | `sun_yang` | Dawn grind; yang-firm foundation |
| `pale_moon_refinement` | Pale Moon Refinement | `moon_yin` | Night-only; high Flow bias |
| `nine_heavens_induction` | Nine Heavens Induction | `storm_thunder` | Storm chase gameplay; deviant thunder root synergy |
| `azure_dragon_vein` | Azure Dragon Vein Art | `earth_vein` + `wood_spring` | Dual essence; forested peaks |

---

## UI (minimal)

1. **Cultivation hub / qi chamber** — active method chip + “Change method” picker (known methods only).
2. **Inventory** — separate section: **Cultivation manuals** vs **Combat manuals** (or filter on `track`).
3. **Method detail** — family, elements, essences, root fit %, current world band, foundation lineage preview.
4. **World map / travel** — optional essence icons on regions (“☀ yang thin”, “⛈ storm likely”).

Reuse `comprehendManual` flow → `comprehendCultivationMethod(id)`.

---

## Implementation phases

| Phase | Scope | Unblocks |
|-------|-------|----------|
| **P0** | `CULTIVATION_METHOD_POOL`, save state, one active method, gather mult only | Pacing tune, creation manual pick |
| **P1** | Method shelf + comprehension UI split from combat | Player-facing identity |
| **P2** | `foundationVariant` lock at seal | FE redesign |
| **P3** | World essence bands (time, weather, region) | Exploration value, high-tier manuals |
| **P4** | Essence milestones + tribulation / NPC read hooks | Late FE–GC fantasy |

**Suggested Issue order:** P0 → roots v2 on creation → P1 → FE redesign with P2.

---

## Prerequisites

- [ ] Owner OK on family taxonomy and essence list
- [ ] [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — `rootFit` rules
- [ ] Chamber balance pass — method mults need target FE age ~80–90 inferior
- [ ] World state: minimal `timeOfDay`, `moonPhase`, `weather` (some exist or stub in explore)
- [ ] Split or rename `Focused Breath` combat vs cultivation naming

## Open questions

- **Strict essence methods:** hard night-only vs always playable at penalty?
- **Multiple essences:** one method requiring sun *and* fire tile — too fiddly early?
- **NPC cultivation:** do rivals use visible methods for sense reads?
- **Method decay:** does obsolete tier method auto-downgrade gather or stay for nostalgia runs?
- **Pentamixed + Five Phase:** reward harmony grind or trap for new players?
- **Body/soul:** same `CULTIVATION_METHOD_POOL` with `path` tag, or separate pools?

## Implementation crumbs

- `chamber.js` — `getChamberCultivateMult()`, `chamberGatherQi()`
- `techniques.js` — shelf/comprehend patterns to clone
- `data.js` — `CULTIVATION_TIERS`, `CHAMBER_BALANCE`, `TECHNIQUE_POOL`
- `foundation.js` — pillar grants, variant id (future)
- `world.js` / `travel.js` — region tags, weather
- `talent.js` — root composition + grade
- [`technique-driven-cultivation.md`](technique-driven-cultivation.md) — foundation variants & seal lock
