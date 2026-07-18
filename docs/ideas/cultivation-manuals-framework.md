# Cultivation manuals framework

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) owner sign-off; FE redesign direction |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 (essence infrastructure trade-off, method grades, reincarnation sect reclaim) |

## Intent

**Cultivation methods** (manuals for *how you cultivate*) are a separate system from **combat techniques** (manuals for *how you fight*). The active cultivation method should drive chamber gather speed, realm gates, foundation shape, and — at higher tiers — **where** and **when** you can cultivate at all.

Early methods are often **breathing arts** — inward, portable, sect-basement fare. **Essence methods** draw on worldly forces (sun yang, moon yin, storm thunder): potent and high-ceiling, but **infrastructure-hungry** — formations and arrays to gather, direct, and condense essence (sometimes into liquid consumables). Without that setup they underperform a decent **graded qi-gathering** method.

Essence cultivation is **not locked to midgame** — a manual can be learned early — but **affording** the formations/arrays usually lands midgame. Later lives may **reclaim a prior sect** (world-persistent choice) and start with arrays already in place, making top essence methods viable from day one.

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

**Design rule:** first life / QC–FE should **not require** leaving home — breathing + basic circulation covers the tutorial arc. Essence methods are **legal early** but **starved** without formations; midgame is when arrays become affordable, not when the manuals first exist.

---

## Method grades (qi-gathering ladder)

**Every** cultivation method has a **grade** independent of family. Regular qi methods compete on grade alone; essence methods add a second axis (infrastructure).

| Grade | Fiction | Typical gather mult (qi methods) | Availability |
|-------|---------|----------------------------------|--------------|
| **Crude** | Village pamphlet, damaged copy | 0.70–0.85 | Default mortal start |
| **Common** | Sect outer syllabus | 0.90–1.00 | Sect, markets |
| **Superior** | Inner court inheritance | 1.10–1.25 | Quest, rep, rare loot |
| **Peerless** | Ancestor’s complete transmission | 1.30–1.45 | Legendary find, reincarnation unlock |
| **Fragment / incomplete** | Essence scripture missing array chapters | N/A — see essence track | Loot with missing infra knowledge |

**Player sentence:** *“Outer Sect Qi Cycling (common) beats Basic Meditation Breath (crude). Peerless Nine Turn Cycle is still qi-gathering — no storm required — but you’ll hunt for years to find it.”*

Grade stacks with **root grade** (speed) and **root fit** (composition/element match). Essence methods use the same grade labels for **manual quality** (how much ceiling the art allows when infra is perfect).

---

## World essence & infrastructure

**Essence** = a tag on a method, on world tiles, and on **infrastructure** that harvests it.

### Two layers of essence income

| Layer | Source | Yield | Fiction |
|-------|--------|-------|---------|
| **Ambient** | World tile + time/weather | **Trickle** — enough to practise, not to peak | Sitting in dawn light; hair stands in a storm |
| **Directed** | Formation or **Array** | **Bulk** — condense, store, cultivate at full method rating | Sect sun-pillar, thunder-cage array, moon pool |

**Formation** — personal/sect scale (courtyard slot, meditation chamber, portable plate). Existing v1: `FORMATIONS` + residence slots in `formations.js`.

**Array** — sect- or region-scale (defense array node, cultivation hall, reclaimed sect infrastructure). Multi-slot, higher material cost, may need disciples tending it. Essence **condensation** happens here.

### Condensation → consumable (optional loop)

Arrays (and advanced formations) **condense** ambient essence into storable form:

| Product | Example | Use |
|---------|---------|-----|
| **Essence dew** | `sun_yang_dew` | Drink before session; bypasses weak ambient band for one cultivate |
| **Essence bead** | `thunder_bead` | Slower release; several sessions |
| **Essence liquid** | `moon_yin_pool` (array tank) | Cultivate at quarters while pool ≥ threshold |

Fiction: raw sun yang is too wild to breathe directly at volume — the array **gathers, filters, liquefies**. High-tier breakthroughs may **require** condensed essence, not just trickle cultivation.

### The trade-off (owner direction)

```
essenceMethodEffective =
  method.ceilingMult                    // high when infra satisfied
  × infrastructureSatisfaction          // 0.15 ambient … 1.0 full array
  × condensedStockBonus                 // optional consumable top-up

qiMethodEffective =
  method.gradeMult                      // predictable, portable
  × rootFit
```

| Situation | Essence method (e.g. Vermillion Sun) | Qi method (e.g. Superior Nine Turn) |
|-----------|-------------------------------------|---------------------------------------|
| No formation | **Slow**, low ceiling — worse than common qi art | Full grade speed — **reliable** |
| Courtyard formation | Moderate — approaching parity | Still portable; essence pulls ahead on ceiling |
| Full sect array + stock | **Peak** speed + highest foundation ceiling | Grade-capped; may lack yang-firm variant |

**Design intent:** essence = **investment fantasy** (build the sun pillar, stock dew). Qi-gathering = **road fantasy** (find a better manual, cultivate anywhere). Neither obsoletes the other — rushing a fragment scripture without arrays is a **trap**; staying on peerless qi-gathering is a **valid** peak-FE path with lower tribulation upside.

### Essence tags (world)

| Essence tag | Example method | Ambient source | Typical array |
|-------------|----------------|----------------|---------------|
| `sun_yang` | *Vermillion Sun Scripture* | Daytime, clear sky, high yang tile | Sun-gathering pillar, yang condensation plate |
| `moon_yin` | *Pale Moon Refinement* | Night, moon phase | Moon pool array, yin mirror formation |
| `storm_thunder` | *Nine Heavens Induction* | Storm weather, elevation | Thunder-cage array (dangerous) |
| `earth_vein` | *Bedrock Breathing* | Spirit vein node | Vein tap formation |
| `water_tide` | *Returning Wave Art* | Coast, tide phase | Tide harmoniser array |
| `wood_spring` | *Verdant Pulse* | Ancient forest | Grove resonance formation |
| `metal_edge` | *Sharp Qi Forging* | Mine, battlefield | Edge-refinement furnace |
| `fire_heart` | *Crimson Furnace Cycle* | Volcano, forge | Furnace heart array |

### Infrastructure satisfaction (player-facing)

Method card shows **Infrastructure:** **None / Formation / Array** and current satisfaction %.

| Band | Mult (example) | Notes |
|------|----------------|-------|
| **Ambient only** | 0.15–0.35 | Can “feel” the method; mastery/practice; not viable main grind |
| **Formation active** | 0.55–0.75 | Personal setup; good for hybrid lives |
| **Array + condensate** | 0.90–1.00+ | Full method rating; essence milestones progress |

Optional world band still applies on top (clear sky vs overcast for sun). Arrays reduce weather sensitivity — another reason to build them.

---

## Data model (proposal)

```js
// data.js — new pool
const CULTIVATION_METHOD_POOL = [
  {
    id: 'basic_meditation_breath',
    name: 'Basic Meditation Breath',
    family: 'breathing',
    methodTier: 'mortal',
    methodGrade: 'crude',            // crude | common | superior | peerless
    reqRealm: 0,
    rarity: 'common',
    elements: ['neutral'],
    essences: [],
    rootFit: { pentamixed: 1, mixed: 1, dual: 1, single: 1 },
    profile: {
      gatherMult: 0.80,                // includes grade
      ceilingMult: 1.0,                // foundation / peak ceiling
      densityEfficiency: 1.0,
      stabilityBias: 0.1,
      peakGateSoft: null,
      foundationVariant: 'hasty_meditation'
    },
    infrastructure: null,            // qi methods: no infra req
    comprehendMonths: 2,
    desc: '...'
  },
  {
    id: 'outer_sect_qi_cycling',
    name: 'Outer Sect Qi Cycling',
    family: 'circulation',
    methodTier: 'condensation',
    methodGrade: 'common',
    reqRealm: 0,
    essences: [],
    profile: { gatherMult: 1.0, ceilingMult: 1.05, /* ... */ },
    infrastructure: null
  },
  {
    id: 'vermillion_sun_fragment',
    name: 'Vermillion Sun Scripture (Fragment)',
    family: 'resonance',
    methodTier: 'foundation',
    methodGrade: 'superior',           // manual quality when infra met
    reqRealm: 1,
    rarity: 'rare',
    elements: ['fire'],
    essences: ['sun_yang'],
    rootFit: { fire: 1.15, single: 1.05 },
    profile: {
      gatherMult: 1.0,                 // baseline at full infra; see infrastructure curve
      ceilingMult: 1.35,               // why you bother building the array
      densityEfficiency: 1.1,
      stabilityBias: -0.05,
      foundationVariant: 'yang_firm',
      ambientMult: 0.25,               // trickle without formation
      formationMult: 0.70,
      arrayMult: 1.05
    },
    infrastructure: {
      essence: 'sun_yang',
      minFormation: 'yang_gathering_plate',  // optional personal floor
      optimalArray: 'vermillion_sun_pillar', // sect-scale
      condensateId: 'sun_yang_dew',
      condensatePerMonth: 1              // at full array output
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
  essenceMilestones: { sun_yang: 0 },
  essenceStock: { sun_yang_dew: 0 },   // condensed consumables
  foundationLineage: 'hasty_meditation'
};

// Sect / residence — extends existing formations.js
G.sect.residence.formations.slots     // personal formations
G.sect.arrays = { sun_pillar: { level: 1, condensate: 3 } }  // sect-scale (future)
```

### Derived gather (chamber hook)

Replace or multiply `getChamberCultivateMult()`:

```
effectiveMult =
  root.cultivateSpeedMult
  × methodGradeMult(method.methodGrade)
  × method.profile.gatherMult
  × getInfrastructureMult(method)       // ambient | formation | array | + condensate
  × rootFitMatch(method, root)
  × worldAmbienceMult(essence, world)   // weather/time on top; arrays dampen
  × sect / trait / legacy (unchanged)
```

`getInfrastructureMult`: for `essences.length === 0`, use 1.0. For essence methods, interpolate `ambientMult → formationMult → arrayMult` based on active setup and optional `essenceStock` spend.

`chamberGatherQi()` reads `G.cultivationMethods.activeId`; ceiling for peak checks uses `ceilingMult` (essence methods can exceed peerless qi-gathering **when** infra is built).

---

## Method tiers vs realm

Reuse `CULTIVATION_TIER_ORDER` / `reqRealm` for comprehension gates — **same ladder as combat manuals**, but separate catalog.

| methodTier | reqRealm | Typical families | Player expectation |
|------------|----------|------------------|------------------|
| mortal | 0 | breathing (crude–common) | Start here; creation pick |
| condensation | 0 | breathing, circulation (common–superior) | Sect outer manuals; **graded qi ladder** |
| foundation | 1 | circulation, essence (fragment) | FE identity; essence legal but infra-starved |
| core | 2 | circulation, essence + first arrays | GC grind; arrays become affordable |
| nascent | 3 | essence + multi-array | Sect infrastructure matters |
| void+ | 4+ | resonance arrays, forbidden | Realm-specific fantasies |

**Gate rule:** cannot comprehend method with `reqRealm > G.realmIdx`. Essence manuals may require **array blueprint** comprehension before full rating (fragment without array chapter = ambient only).

---

## Acquisition & progression

| Source | Tier | Notes |
|--------|------|-------|
| Creation | mortal–condensation | 1 **graded** method bundled; CP for better grade/tier |
| Sect library / quest | condensation–foundation | Rep-gated; common → superior qi arts |
| Explore / corpse loot | foundation–core | Essence fragments + **array blueprints** |
| Markets | varies | Common breathing cheap; blueprints expensive |
| Reincarnation unlock | grade ceiling, blueprints, **sect reclaim** | See below |
| Breakthrough reward | next-realm | Sect promotion grants signature method |

### Reincarnation — sect reclaim (meta hook)

If a prior life’s **world state** preserved the player’s sect (founder legacy, story choice, not wiped by calamity):

| Reclaim perk | Effect |
|--------------|--------|
| **Sect standing restored** | Start as recognised heir, not stranger |
| **Arrays intact** | Sun pillar / moon pool already built — essence methods at **array** rating immediately |
| **Manual archive** | Peerless qi art or essence fragment in hall vault |
| **Trade-off** | Enemy faction remembers you; debt/event baggage |

**Player sentence:** *“Run 3 I reclaim my old mountain — Vermillion Sun is viable at 16 because grandpa’s array still turns. Run 1 I found the same manual at 20 and it was useless until I spent forty years building the pillar.”*

Tie to [`creation-screen-redesign.md`](creation-screen-redesign.md) origins and `legacy.js` unlock catalog. Reclaim is **earned**, not default new-game+.

**Upgrades within a line:** fragment I → II → complete (same `lineageId`, bump `profile` + unlock array chapter). Prefer **materials + time** over sacrificing combat techniques.

**Switching active method:**

- **Recommended:** free swap in chamber, **no** mid-FE foundation blend — lineage locks at **Seal** (see technique-driven doc).
- Optional: 1-month “adjust meridians” penalty if swapping across incompatible elements.
- Wrong method for your root: legal but **leaky** (fit mult &lt; 1).

---

## Integration map

| System | Hook |
|--------|------|
| **Roots v2** | `rootFit`, grade = speed stack; composition = efficiency not legality |
| **Chamber Gather** | `activeId` + `methodGrade` + `getInfrastructureMult()` |
| **Formations v1** | `formations.js`, `FORMATIONS` — extend with `essenceGather`, `condensate` |
| **Arrays (new)** | Sect buildings / `defense_array` / cultivation hall — multi-slot essence harvest |
| **Foundation / seal** | `ceilingMult` + `essenceMilestones` → [`technique-driven-cultivation.md`](technique-driven-cultivation.md) |
| **FE redesign** | Gather → stabilise → seal; method + infra at seal sets lineage |
| **Lifespan pacing** | Qi-grade path = steady; essence path = slow early, spike after array ([`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)) |
| **World / travel** | Ambient essence strength; blueprints looted by region |
| **Alchemy / materials** | Condensate crafting, array construction costs |
| **Tribulation** | Volatile essence overload ± trib odds |
| **NPC sense** | Detect method grade + array backing ([`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md)) |
| **Reincarnation / legacy** | Sect reclaim, blueprint unlocks, starting method grade |
| **Body / soul paths** | Parallel method pools per chamber |

---

## Example methods (sketch catalog)

### Qi-gathering — graded ladder (no essence)

| id | Name | Grade | gatherMult | Notes |
|----|------|-------|------------|-------|
| `basic_meditation_breath` | Basic Meditation Breath | crude | 0.80 | Default mortal |
| `outer_sect_qi_cycling` | Outer Sect Qi Cycling | common | 1.00 | Sect outer |
| `inner_court_meridian_cycle` | Inner Court Meridian Cycle | superior | 1.18 | Rep-gated |
| `nine_turn_peerless_cycle` | Nine Turn Peerless Cycle | peerless | 1.38 | Rare; portable endgame qi path |
| `impure_meridian_breath` | Impure Meridian Breath | common | 0.95 | Pentamixed-friendly |

### Essence — same tiers, infra-gated

| id | Name | Grade | ceilingMult | Infra | Notes |
|----|------|-------|-------------|-------|-------|
| `vermillion_sun_fragment` | Vermillion Sun Scripture (Fragment) | superior | 1.35 | Sun pillar array | Trap without array; best FE ceiling if built |
| `pale_moon_refinement` | Pale Moon Refinement | common | 1.20 | Moon pool | Weaker ceiling than peerless qi; wins with array + night stock |
| `nine_heavens_induction` | Nine Heavens Induction | superior | 1.45 | Thunder-cage array | Storm chase + array build |
| `bedrock_breathing` | Bedrock Breathing | common | 1.15 | Vein tap formation | Gentler essence entry — formation-only, no array |

---

## UI (minimal)

1. **Cultivation hub / qi chamber** — active method chip + “Change method” picker (known methods only).
2. **Inventory** — separate section: **Cultivation manuals** vs **Combat manuals** (or filter on `track`).
3. **Method detail** — grade, family, essences, infra requirement, ambient vs array rating, condensate stock, ceiling preview.
4. **Sect map** — array construction on cultivation hall / defense array; formation slots for personal essence plates.
5. **World map** — ambient essence thin/rich; blueprint POIs.

Reuse `comprehendManual` flow → `comprehendCultivationMethod(id)`. Array blueprints may be separate manuals (`track: 'array'`).

---

## Implementation phases

| Phase | Scope | Unblocks |
|-------|-------|----------|
| **P0** | Method pool, **methodGrade**, save state, active method, gather mult (qi only) | Pacing tune, creation manual pick |
| **P1** | Method shelf + comprehension UI split from combat | Graded qi ladder visible |
| **P2** | `foundationVariant` + `ceilingMult` at seal | FE redesign |
| **P3** | Essence ambient trickle + **formations** that gather/condense | First essence methods |
| **P4** | **Arrays**, condensate items, infrastructure mult curve | Full essence trade-off |
| **P5** | Reincarnation sect reclaim + blueprint legacy | Meta power spike |
| **P6** | Essence milestones + tribulation / NPC read hooks | Late FE–GC fantasy |

**Suggested Issue order:** P0 → roots v2 → P1 → P2 → P3–P4 (essence infra) → P5 with legacy pass.

---

## Prerequisites

- [ ] Owner OK on infra curve (ambient vs formation vs array mults)
- [ ] Array vs formation scope — which sect buildings host arrays
- [ ] Condensate: inventory item vs array tank only
- [ ] [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — `rootFit` rules
- [ ] Chamber balance — peerless qi vs essence+array ceiling targets for FE age ~80–90
- [ ] Sect reclaim: which world flags persist across lives
- [ ] Split or rename `Focused Breath` combat vs cultivation naming

## Open questions

- **Fragment without blueprint:** sell manual before array chapter exists — ambient-only until found?
- **Portable formations:** travel kit essence plate vs must cultivate at sect?
- **Array upkeep:** disciples, stones/month, or one-time build?
- **Dual essence arrays:** sun + fire furnace — one array or chained formations?
- **NPC cultivation:** rivals show method grade + visible array backing?
- **Peerless qi vs essence ceiling:** should peerless nine-turn match inferior essence at full array, or always lose on ceiling?
- **Pentamixed + Five Phase:** reward or trap?
- **Body/soul:** same pool with `path` tag, or separate?

## Implementation crumbs

- `chamber.js` — `getChamberCultivateMult()`, `chamberGatherQi()`
- `techniques.js` — shelf/comprehend patterns to clone
- `data.js` — `CULTIVATION_TIERS`, `CHAMBER_BALANCE`, `TECHNIQUE_POOL`
- `foundation.js` — pillar grants, variant id (future)
- `formations.js` — residence formations v1; extend for essence gather + condensate
- `data.js` — `FORMATIONS`, `SECT_RESIDENCE`, `CHAMBER_BALANCE`
- `talent.js` — root composition + grade
- [`technique-driven-cultivation.md`](technique-driven-cultivation.md) — foundation variants & seal lock
