# Cultivation manuals framework

| Field | Value |
|-------|-------|
| **Status** | `building` (P1); body/soul deferred |
| **Blocked on** | FE redesign direction (for P2+); essence infra tuning (P3+) |
| **Issue** | [#50](https://github.com/WanderingImmortal/tales-immortal-path/issues/50) (P0); [#52](https://github.com/WanderingImmortal/tales-immortal-path/issues/52) (P1) |
| **Chat / PR** | P0 [PR #51](https://github.com/WanderingImmortal/tales-immortal-path/pull/51); P1 [PR #53](https://github.com/WanderingImmortal/tales-immortal-path/pull/53) |
| **Updated** | 2026-07-22 (P1 shelf + study UI) |

## Intent

**Cultivation methods** (manuals for *how you cultivate*) are a separate system from **combat techniques** (manuals for *how you fight*). A cultivator follows **one primary method** — it shapes meridians, foundation, and **cultivation path** for that life. This is **not** an equippable slot you swap when loot drops something better.

**Qi methods** draw ambient spiritual qi. **Essence methods** cultivate a **different energy** (sun yang, moon yin, thunder…) — usually **more potent per unit** (density, breakthrough weight, tribulation character), not inherently faster. Both use the same **method grade** ladder (crude → peerless) for manual quality and cultivate speed.

Essence needs formations/arrays to gather and direct that energy at useful volume; qi does not. All infra requires **upkeep**. On the road: ambient trickle or carried condensate.

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

## One path — not an equippable (owner direction)

Xianxia default: you **walk one cultivation road**. The manual you follow rewrites your body; you do not hot-swap arts like gear.

| Concept | Design |
|---------|--------|
| **Primary method** | One `G.cultivationMethod.primaryId` per life (until rare rite) |
| **Manuals on shelf** | Scrolls you **own** ≠ arts you **practice** — loot can sit unread or “studied for reference” |
| **Commitment windows** | Choose / confirm primary at creation; **hard lock at FE seal** (foundation lineage set); optional lock again at major realm pivots |
| **Changing path** | **Meridian-washing rite** — months, materials, foundation crack risk, possible cultivation regression; not a menu click |
| **Upgrading *your* art** | **Same lineage** — complete a fragment, receive master’s annotation, pill polish — bumps **grade** without switching identity |

**Anti-equip feel:** Finding *Inner Court Meridian Cycle* while on *Basic Meditation Breath* does not auto-replace. Options: (a) stash until a future life / disciple, (b) begin expensive **path conversion** rite, or (c) if **pre-seal** and uncommitted, one-time **“this is my path”** choice.

**Anti-punish feel:** Crude start is **real** (rich sect heirs get superior manuals — xianxia) but not a run killer:

- Crude → common **within same lineage** via sect teaching, quest, or reincarnation CP
- **Grade** affects speed and efficiency; it does not hard-block reaching FE peak on inferior roots pacing
- **Power ceiling** differs more by **energy type** (qi vs essence) and **foundation variant** than by starting at common vs crude
- Reincarnation unlocks better **starting** grade / sect reclaim — meta fairness without nullifying birth advantage fantasy

### Meridian-washing — v1 compromise (owner 2026-07-18)

**Thematic default:** you are **stuck with your cultivation path** once committed — very xianxia. Players may find that harsh; meridian-wash is the **safety valve**, not the main loop.

| Rule (v1 proposal) | Detail |
|--------------------|--------|
| **Commit** | Confirm primary at creation; **hard lock at FE seal** |
| **Meridian-wash** | Rare rite to change `primaryId` — costly, risky, months of recovery |
| **When available** | Pre-seal: one **“walk this path”** confirm; post-seal: meridian-wash (frequency TBD — **ship one version, playtest**) |
| **Not in v1** | Casual swap, dual-path cultivation, body/soul method tracks |

**Terminology:** Use **path** / **cultivation path** in UI for method commitment. Reserve **Dao** for the late-game **Dao Seeking** track (`comprehendDao`, fragments) — avoid “walk this dao” on the seal screen.

**Playtest intent:** Run meridian-wash in alpha and **wait for player feedback** before tightening (e.g. once per life) or loosening (e.g. pre-GC only). Balance is iterative — fiction favours permanence; fun favours an escape hatch.

### Scope — qi track only (for now)

**In scope for this framework:** qi-path cultivation chamber, primary method, qi vs essence energy, formations/arrays, foundation lineage at seal.

**Explicitly deferred:** body-path and soul-path cultivation methods. Do not block qi design on three-track parity. When body/soul are designed, decide then whether each track gets its own locked primary or the **qi cultivation path** remains the anchor — **not decided**.

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

## Method grades (shared ladder — qi and essence)

**Every** cultivation method has a **grade** for manual quality: crude → common → superior → peerless. Grade affects **how well you execute the art** (cultivate speed, stability). It applies **equally** to qi-gathering and essence manuals.

| Grade | Fiction | Typical speed mult | Availability |
|-------|---------|-------------------|--------------|
| **Crude** | Village pamphlet, damaged copy | 0.70–0.85 | Default mortal start |
| **Common** | Sect outer syllabus | 0.90–1.00 | Sect, markets |
| **Superior** | Inner court inheritance | 1.10–1.25 | Quest, rep, rare loot |
| **Peerless** | Ancestor’s complete transmission | 1.30–1.45 | Legendary find, reincarnation unlock |
| **Fragment** | Incomplete scripture | Grade capped until completed | Missing chapters / array volume |

**Separate axis — energy type:**

| Energy | What you cultivate | Power character (typical) | Infra |
|--------|-------------------|---------------------------|-------|
| **Qi** | Ambient spiritual qi | Baseline density & foundation; portable | None |
| **Essence** | World force (yang, yin, thunder…) | **Higher power per session** — stronger density jumps, distinct foundation variants | Formation/array to access fuel |

Essence is **not** “faster cultivation.” A **common-grade** essence method and a **common-grade** qi method can cultivate at the **same speed** if infra is met. Essence produces **more potent** results (`powerMult`), not necessarily fewer months-to-peak.

Grade stacks with **root grade** (innate speed) and **root fit** (element/composition match).

### What “peerless qi” means (glossary)

**Peerless qi** is **not** a special energy type. It is the **top grade** of a **plain qi-gathering cultivation method** — a complete breathing or circulation art that draws **ambient spiritual qi** only (no sun yang, no thunder, no array).

| Term | Meaning |
|------|---------|
| **Qi-gathering method** | Cultivation manual whose `essences: []` — works on generic heaven-and-earth qi |
| **Method grade: peerless** | Best-in-class *copy* of that art (ancestor’s full transmission, not a torn fragment) |
| **Peerless qi** (shorthand) | The cultivation style + results from running a **peerless-grade qi method** |

**Example:** *Nine Turn Peerless Cycle* — peerless-grade circulation manual. You meditate, cycle qi through the dantian, raise density. No sun pillar, no storm, no condensed dew required. You can cultivate in a roadside inn, a cave, or your sect chamber with **full rating anywhere**.

**What peerless qi is *not*:**

- Not “peerless foundation” (that’s a foundation **quality** tier — separate axis)
- Not essence cultivation (yang/yin/thunder) — those are a **different track** with higher ceiling but infra cost
- Not automatically **faster** than essence — speed comes from **grade**, not energy type
- Not automatically **stronger** at peak than essence — essence usually wins on **power per unit** and ceiling when infra is paid for
- Wins on **portability** — no array, no condensate, cultivate anywhere at full grade speed

**Why it matters:** “Peerless qi vs Vermillion Sun” compares *best portable qi art* vs *essence path with maintained array* — different **energy**, similar **grade** vocabulary, different **power output** and **infra bill**.

---

## World essence & infrastructure

**Essence** = a tag on a method, on world tiles, and on **infrastructure** that harvests it.

### Two layers of essence access (not “speed tiers”)

| Layer | Source | What it enables | Fiction |
|-------|--------|-----------------|---------|
| **Ambient** | World tile + time/weather | Trickle — practise the art, minimal power gain | Feel the sun; cannot fuel real progress |
| **Directed** | Formation or **Array** (+ upkeep) | Cultivate essence at **full grade speed** with **full power output** | Array gathers, filters, condenses |

Without directed infra, essence methods are **starved of fuel** — not “slow qi,” but **wrong fuel line hooked up**. Qi methods always have fuel (ambient qi).

**Formation** — personal/sect scale (courtyard slot, meditation chamber). Existing v1: `FORMATIONS` + residence slots in `formations.js`. **Full formations vision:** [`formations-and-arrays.md`](formations-and-arrays.md).

**Array** — sect- or region-scale (defense array node, cultivation hall, reclaimed sect infrastructure). Multi-slot, higher build cost, essence **condensation** at scale.

**Owner rule:** **All formations and arrays require upkeep** — stones, materials, disciple labour, or time. Nothing runs for free; power is earned and **paid for continuously**. A neglected array **decays** (output drops, condensate stops, eventually dormant until repaired).

### Upkeep (formations & arrays)

| Cost type | Formation (courtyard) | Array (sect-scale) |
|-----------|----------------------|-------------------|
| **Recurring** | Spirit stones / month, herb incense, occasional jade refresh | Higher stone + material burn; may need attendant disciple shifts |
| **Neglect penalty** | Bonus fades → ambient-only equivalent → pattern scatters (must reinscribe) | Condensate production halts; satisfaction mult slides down over months |
| **Repair** | Re-lay with materials + months (cheaper than first build) | Major event if damaged (siege, tribulation splash) |

Sect reclaim on reincarnation = **structure exists** (skip initial build grind), **not** waived upkeep. You inherit the bill with the mountain.

### Condensation → consumable (travel + storage)

Arrays (and advanced formations) **condense** ambient essence into storable form:

| Product | Example | Use |
|---------|---------|-----|
| **Essence dew** | `sun_yang_dew` | Single-session boost; travel kit item |
| **Essence liquid** | `sun_yang_essence_flask` | **Carried while traveling** — several sessions of near-formation rating for essence methods |
| **Essence bead** | `thunder_bead` | Slower release; several sessions |
| **Array tank** | `moon_yin_pool` (at sect) | Bulk storage at home; decays if array upkeep lapses |

Fiction: raw sun yang is too wild to breathe at volume — the array **gathers, filters, liquefies** (while you pay to keep it running). High-tier breakthroughs may **require** condensed essence, not ambient trickle alone.

### Traveling with an essence method

Essence cultivators are **not locked to sect** — but away from home they have two options:

| Mode | How | Effect |
|------|-----|--------|
| **Ambient only** | Cultivate on the road | Minimal power — maintain the art only |
| **Condensed stock** | Spend essence liquid from travel kit | Full **grade** session for that art; potency from essence type; stock finite |

Qi methods (any grade) need **no stock** — full speed and qi-type power anywhere.

**No free lunch:** Liquid in the kit was produced by a maintained array/formation at home (upkeep already paid). Buying flasks on the market = someone else’s upkeep priced in.

### Qi vs essence — power, not pace (owner direction)

```
cultivateSpeed =
  root.cultivateSpeedMult
  × methodGradeMult(method.methodGrade)    // same formula for qi AND essence
  × rootFit
  × hasEssenceFuel(method) ? 1 : ambientPracticeOnly   // 0 or tiny if no fuel

powerPerSession =
  method.energyTypePowerMult               // qi baseline 1.0; essence often 1.2–1.5+
  × methodGradeMult (partial)
  × infrastructureQuality (essence only)
```

| Comparison | Same grade, fuel available | Typical outcome |
|------------|---------------------------|-----------------|
| Common qi cycling | Common Vermillion Sun + array | **Similar months** to density target |
| | | Essence: **higher density jump**, yang-firm variant, different trib |
| Crude qi start | — | Slower from **grade**, still reaches peak — weaker foundation **variant** |

**Design intent:** Choose **path** (qi road vs sun scripture), not “fast vs slow.” Rich heir with superior qi manual starts **faster** (grade); essence heir needs **array spend** but peaks **harder** if they maintain infra.

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

### Infrastructure satisfaction (essence fuel — player-facing)

Method card shows **Fuel:** **Starved / Formation / Array / Condensate (travel)**.

| Band | Cultivate speed | Power output | Notes |
|------|-----------------|--------------|-------|
| **Starved** (ambient only) | Practice-only (~0) | ~0 | Cannot main-grind essence |
| **Formation** | Full grade speed | Partial–full power | Personal plate; upkeep due |
| **Array + upkeep** | Full grade speed | Full power + milestones | Sect-scale |
| **Condensate dose** | Full grade speed (session) | Full power | Travel bridge |

Weather still modulates array **efficiency**; upkeep must be current or band drops.

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
      gatherMult: 0.80,                // grade → speed
      powerMult: 1.0,                  // qi baseline
      ceilingMult: 1.0,
      densityEfficiency: 1.0,
      stabilityBias: 0.1,
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
      gatherMult: 1.0,
      powerMult: 1.30,                 // essence potency — not extra speed
      ceilingMult: 1.35,
      densityEfficiency: 1.1,
      stabilityBias: -0.05,
      foundationVariant: 'yang_firm'
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
G.cultivationMethod = {
  primaryId: 'basic_meditation_breath',  // ONE path — locked at FE seal
  primaryLocked: false,
  lineageId: 'meditation_breath_line',   // upgrades stay in-lineage
  grade: 'crude',                          // rises via lineage upgrade, not swap
  studiedScrolls: ['outer_sect_qi_cycling'], // owned, not practised
  essenceMilestones: { sun_yang: 0 },
  essenceStock: { sun_yang_dew: 0 },
  foundationLineage: null                  // set at seal
};

// Sect / residence — extends existing formations.js
G.sect.residence.formations.slots
G.sect.arrays = { sun_pillar: { level: 1, condensate: 3 } }
```

### Derived gather (chamber hook)

Replace or multiply `getChamberCultivateMult()`:

```
cultivateSpeed =
  root.cultivateSpeedMult
  × methodGradeMult(G.cultivationMethod.grade)
  × method.profile.gatherMult
  × essenceFuelMult(method)             // 1 if qi or fueled; ~0 if essence-starved
  × rootFitMatch(method, root)
  × sect / trait / legacy

powerPerSession =
  method.profile.powerMult
  × methodGradeMult (partial)
  × essenceFuelQuality
```

`chamberGatherQi()` uses `G.cultivationMethod.primaryId` only. Shelf scrolls do not apply until committed via rite or pre-seal choice.

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
| **Arrays intact** | Sun pillar / moon pool already built — skip **construction**; still pay **upkeep** each year |
| **Manual archive** | Peerless qi art or essence fragment in hall vault |
| **Trade-off** | Enemy faction remembers you; debt/event baggage |

**Player sentence:** *“Run 3 I reclaim my old mountain — the sun pillar is already there, but I still feed it stones every year. I stocked flasks before leaving to explore. Run 1 I found Vermillion Sun at 20 and couldn’t use it until I built the pillar and kept it alive.”*

Tie to [`creation-screen-redesign.md`](creation-screen-redesign.md) origins and `legacy.js` unlock catalog. Reclaim is **earned**, not default new-game+.

**Upgrades within a lineage:** fragment II → complete edition; master annotation; pill polish — raises **`grade`** on the **same** `primaryId` / `lineageId`. Does not feel like equipping a new item — feels like *your* art deepening.

**Changing primary method (meridian-washing rite):**

- **v1:** ship meridian-wash as the only post-commit escape; tune cost/frequency after playtest
- Cost: months, rare materials, stones; **foundation crack** or short regression risk
- Cannot blend — old lineage may leave minor scar (flavour debuff optional)
- Pre-seal: last low-friction **“this is my path”** window

**Wrong method for root:** legal but leaky (`rootFit` &lt; 1) — another reason not to swap lightly.

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
| **Lifespan pacing** | Grade affects months-to-peak; energy type affects **how strong** at peak |
| **World / travel** | Ambient trickle on road; **essence liquid** in travel kit; blueprints by region |
| **Economy** | Formation/array **upkeep** drains stones & materials — core sink |
| **Tribulation** | Volatile essence overload ± trib odds |
| **NPC sense** | Detect method grade + array backing ([`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md)) |
| **Reincarnation / legacy** | Sect reclaim, blueprint unlocks, starting method grade |
| **Body / soul paths** | **Deferred** — qi track first; revisit when those realms are designed |

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

### Essence — same grades, different energy

| id | Name | Grade | powerMult | Infra | Notes |
|----|------|-------|-----------|-------|-------|
| `vermillion_sun_fragment` | Vermillion Sun Scripture (Fragment) | superior | 1.30 | Sun pillar array | Starved without fuel; potent when fed |
| `pale_moon_refinement` | Pale Moon Refinement | common | 1.22 | Moon pool | Same speed as common qi at full fuel |
| `nine_heavens_induction` | Nine Heavens Induction | superior | 1.40 | Thunder-cage array | High tribulation character |
| `bedrock_breathing` | Bedrock Breathing | common | 1.15 | Vein tap formation | Entry essence — formation-only |

---

## UI (minimal)

1. **Cultivation hub / qi chamber** — **Your cultivation path** (primary method + grade + lineage); no casual swap button.
2. **Inventory** — **Cultivation scrolls** (uncommitted) vs **Combat manuals**; committed path shown separately.
3. **Method detail** — grade, energy type (qi/essence), fuel state, power vs speed breakdown, seal lock warning.
4. **Pre-seal** — one-time **“Walk this path”** confirm; post-seal only **meridian-washing** rite (dangerous).

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

- [x] Meridian-wash as v1 compromise — playtest before locking frequency (owner 2026-07-18)
- [x] Qi track only for now; body/soul methods deferred (owner 2026-07-18)
- [x] Qi vs essence = energy type / power, shared grade for speed (owner 2026-07-18)
- [x] Travel: ambient minimal + carried condensate (owner 2026-07-18)
- [x] All formations/arrays require upkeep — nothing free (owner 2026-07-18)
- [ ] Owner OK on infra curve (ambient vs formation vs array mults)
- [ ] Array vs formation scope — which sect buildings host arrays
- [ ] [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — `rootFit` rules
- [ ] Chamber balance — peerless qi vs essence+array ceiling targets for FE age ~80–90
- [ ] Sect reclaim: which world flags persist across lives
- [ ] Split or rename `Focused Breath` combat vs cultivation naming

## Open questions

- **Meridian-washing frequency:** once per life post-seal, once ever, or GC-gate only? → **ship v1, playtest**
- **Lineage upgrade UI:** “Complete scripture” vs new item — how shown?
- **Fragment without blueprint:** ambient practice only until array chapter found?
- **Upkeep tuning:** flat stones/month vs scaling with array output?
- **Dual essence arrays:** one array or chained formations?
- **NPC cultivation:** sense reads primary path + grade, not shelf clutter?
- **Pentamixed + Five Phase:** reward or trap?

## Implementation crumbs

- `chamber.js` — `getChamberCultivateMult()`, `chamberGatherQi()`
- `techniques.js` — shelf/comprehend patterns to clone
- `data.js` — `CULTIVATION_TIERS`, `CHAMBER_BALANCE`, `TECHNIQUE_POOL`
- `foundation.js` — pillar grants, variant id (future)
- `formations.js` — residence formations v1; extend per [`formations-and-arrays.md`](formations-and-arrays.md)
- `data.js` — `FORMATIONS`, `SECT_RESIDENCE`, `CHAMBER_BALANCE`
- `talent.js` — root composition + grade
- [`technique-driven-cultivation.md`](technique-driven-cultivation.md) — foundation variants & seal lock
