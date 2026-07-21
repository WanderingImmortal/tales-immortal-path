# Formations & arrays

| Field | Value |
|-------|-------|
| **Status** | `designed` (vision); v1 residence qi buffs `shipped` |
| **Blocked on** | Cultivation methods P0–P2 for essence fuel bands; roots v2 for rite formations |
| **Issue** | none yet |
| **Chat / PR** | Owner formations brainstorm (cloud agent, 2026-07-21); prior chat *xianxia formations arrays* (not in repo) |
| **Updated** | 2026-07-21 (realm-aligned formation grades; dao/law components) |

## Intent

**Formations** are comprehended **patterns** — diagrams traced with flags, pins, and spirit stones — that **redirect ambient qi or essence** through a small area (home, courtyard, guild hall, market HQ). They are infrastructure, not combat hotkeys.

**Arrays** are **many formations linked** into a larger whole: sect territory, city scale, grand defense or grand cultivation. Same underlying pattern language, different scale and upkeep.

Gameplay stays **simple**: choose a known pattern, lay it at a **valid anchor** (not freehand map drawing), pay upkeep. Fiction carries the “staking flags and drawing meridian lines” fantasy.

**Not in scope for v1:** free placement anywhere on the world map, combat-time inscription, essence-location expansion (sun/moon/vein nodes), guild/auction formations.

---

## Scale ladder

| Tier | Scale | Examples | Player fantasy |
|------|-------|----------|----------------|
| **Formation** | Building or small area | Leader’s courtyard, meditation chamber, future guild/market HQ | “I inscribed my quarters.” |
| **Array** | Sect or city | Mountain defense perimeter, cultivation hall essence pillar, reclaimed sect infra | “Our sect’s grand array shields the peak.” |
| **Grand array** *(optional, far future)* | Region / watershed | Suppression of demon lands, nation-scale weather | “Heaven-defying rite” — rare story beats, not required |

**Rule:** Arrays are **not** a separate magic system — they are **composed formations** with shared nodes, higher build cost, and higher upkeep. See [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) for essence fuel bands (Starved / Formation / Array / Condensate).

---

## How patterns work (fiction → gameplay)

| Fiction | Gameplay (keep simple) |
|---------|------------------------|
| Comprehend a formation manual / diagram | **Study pipeline** (below) — not one button |
| Stake flags, place spirit stones at nodes | **Lay** action: materials + months at a valid anchor |
| Maintain the pattern | **Upkeep** (stones, herbs, labour) — neglect → fade → scatter |
| Ambient qi/essence flows along the lines | Passive or session bonus while pattern is active and fed |
| Talented master pre-inscribes gear | **Equipment formation** — limited charges, wears out |
| One-shot burst on paper | **Talisman formation** — consumed on deploy |

**No combat laying:** cultivators do not trace patterns mid-fight. Pre-built gear and talismans are the combat-adjacent expression.

---

## Deployment modes

| Mode | Where | Durability | Typical use |
|------|-------|------------|-------------|
| **Fixed site** | Residence slot, sect anchor node, (later) guild/market HQ | Until neglected or replaced | Gather, stabilise, ward, condense |
| **Equipment** | Robes, boots, belt, weapon (pre-inscribed) | **Charges** — depletes with use | Instant deploy in danger — blink ward, spirit step, stored strike |
| **Talisman** | Inventory consumable | **One use** | Emergency ward, escape, single burst |

Equipment and talisman formations are **formation-master** content: higher comprehension / Formation Dao investment unlocks blueprints. Wear and consumption are the cost of skipping the “lay at home” requirement.

---

## Primary function (+ hybrids)

Every formation pattern has **one primary job**. UI and balance should read clearly at a glance.

| Primary tag | What it does | Example |
|-------------|--------------|---------|
| **Gather** | Pull qi or essence to a spot | Spirit Gathering (qi cultivate boost) |
| **Stabilise** | Smooth meridian / foundation flow | Qi Stabilizer |
| **Ward** | Defense, concealment, tribulation splash | Iron Wall Ward (perimeter / events) |
| **Condense** | Ambient essence → dew / flask / tank | Sun pillar condensate (array-scale) |
| **Rite** | One-shot or rare breakthrough pattern | Seven-Day Heaven-Defying Array (see roots doc) |

**Hybrid formations** (advanced): a master of **Formation Dao** can comprehend patterns that combine two primaries — e.g. **kill + gather** → harvest **blood essence** from slain foes into a collection node. Hybrids cost more to lay and maintain; not default early-game.

Design rule: **no overlapping +5% soup** — if Cultivation Hall gives sect-wide cultivate %, courtyard formations should lean gather/stabilise/essence/ward, not duplicate the same knob.

---

## Where formations sit (anchors, not “anywhere”)

Owner direction: patterns are laid on **valid anchors**, not arbitrary world tiles.

| Anchor (now / near) | Scale | Notes |
|---------------------|-------|-------|
| **Leader’s residence courtyard** | Formation | **Shipped v1** — `G.sect.residence.formations.slots` |
| **Sect map nodes** | Formation or array | `meditation_chamber`, `cultivation_hall`, `defense_array` — buildings today are flat %; future = host patterns |
| **Guild / market / auction HQ** | Formation | **Later** — when those locations exist |
| **World essence nodes** | Formation (essence) | **Later expansion** — sun terrace, moon pool, vein tap; pattern must match site tag |

Essence formations **require a matching location** to draw fuel (sun yang, moon yin, vein, etc.). Qi formations work on generic ambient qi at any qi-rated anchor.

---

## Upkeep & neglect (owner rule)

**All formations and arrays require upkeep** — nothing runs free.

| State | Effect |
|-------|--------|
| **Maintained** | Full pattern bonus |
| **Lapsed** | Output fades toward ambient-only |
| **Scattered** | Pattern inactive — must **reinscribe** (cheaper than first lay) |

Reincarnation **sect reclaim**: structures and laid patterns may persist; **upkeep is not waived**.

---

## Relationship to other systems

| System | Link |
|--------|------|
| [**Cultivation manuals**](cultivation-manuals-framework.md) | Essence methods need **Formation / Array / Condensate** fuel band; qi methods do not |
| [**Spiritual roots v2**](spiritual-roots-taxonomy-v2.md) | **Rite formations** — basin ascension, composition ascension, stabilise (grade/basin, not “delete element”) |
| [**Watershed pacing**](watershed-realms-lifespan-pacing.md) | Formations/pills as rare aids to cross talent ceiling |
| **Sect buildings** | Buildings = halls & staff; formations = **patterns on the land** at or under those sites |
| **Combat** | No field inscription; talismans & inscribed gear only |

### Rite formations (roots — separate bucket)

One-shot or rare **arrays** for fate shifts: +1 basin tier, capped composition step, breakthrough support. Consumed or burned out on success. Documented in roots taxonomy; **not** courtyard slot buffs.

---

## Pattern primitives (building blocks)

Finished formations are **recipes** of a few **primitives** — the “grammar” every diagram shares. Hybrids are not new magic; they combine primitives (and usually two **primary tags**) in one anchor.

### The eight primitives

| Primitive | What it does in fiction | Typical physical expression |
|-----------|-------------------------|----------------------------|
| **Sink** | Draw ambient qi/essence into the pattern | Outer gathering ring, inward-facing flags |
| **Channel** | Move power along a defined path | Lines between nodes, meridian traces |
| **Pool** | Concentrate power at a node (阵眼 / “eye”) | Central spirit stone, courtyard heart |
| **Seal** | Bind, stabilise, prevent leak or collapse | Corner locks, closure stroke, jade pins |
| **Ward** | Barrier outward — block, deflect, conceal | Perimeter square, mirror facing out |
| **Condense** | Compress gathered essence into storable form | Condensation plate, dew basin |
| **Trap** | Hold, delay, or cage (area or trigger) | Snare lines, closing loop |
| **Sever** | Cut, kill, or convert (lethal or harvest) | Kill zone, blood channel to pool |

**Design rule:** every blueprint lists `primitives: [...]`, `formationGrade`, and optional `requiredComponents` (dao, law, essence tag…). Player-facing UI shows **primary tag** and **formation grade** (e.g. “3rd-grade kill formation”).

### Formation grade (realm-aligned)

**Owner direction (2026-07-21):** Formation **grade** is **not** a peerless/manual-quality ladder. A **1st-grade** formation is meaningfully effective against **1st-grade cultivation** (Qi Condensation band). A **3rd-grade** formation can **stymie or even slay** a Golden Core cultivator when fully laid, fed, and sprung — not because the inscriber out-cultivates them, but because the **pattern grade matches the threat**.

| Formation grade | Aligns to realm band (qi path) | Typical effect vs equal target |
|---------------|----------------------------------|--------------------------------|
| **1st** | Qi Condensation | Gather, weak ward, tutorial traps |
| **2nd** | Foundation Establishment | Solid residence/hall patterns; credible FE traps |
| **3rd** | Core Formation (Golden Core) | Kill or hard-control vs GC if target enters pattern |
| **4th** | Nascent Soul | Sect-scale pressure; NS kill traps (extreme prep) |
| **5th** | Void Refinement | Regional arrays |
| **6th** | Dao Seeking | Requires **dao / law components** in pattern (see below) |
| **7th** | Immortal Ascension | Requires dao/law + heaven-grade materials; rite-adjacent |

**Separate from grade — manual condition:** intact vs fragment vs smudged copy affects **lay success, stability, output %** within the **same** formation grade. It does **not** let a 1st-grade diagram kill a Golden Core.

### Dao, law, and high-realm targets

Above Core Formation, formations stop being “just geometry + spirit stones.” To **meaningfully affect** Dao Seeking (or equivalent) opponents, the pattern must include **dao or law** as a necessary component — not optional flair.

| Component type | Fiction | Game role |
|----------------|---------|-----------|
| **Dao fragment** | A cultivator’s comprehended dao wired into a node | Pattern can “read” dao-aligned targets; required for 6th-grade+ offensive/control |
| **Law shard / talisman** | Heaven law, borrowed mandate, sect guardian relic | Stabilises pattern vs transcendent targets; rite arrays |
| **Essence anchor** | Sun vein, moon pool, etc. | Required for essence-heavy grades (parallel track) |

**Complexity** scales with grade: more primitives, hybrid primaries, mandatory component slots, longer lay time, harsher upkeep. **Formation Master grade** caps both **max formation grade you can lay** and **max complexity** you can handle without catastrophic fail.

### Power axes (revised)

| Axis | What it is | Drives |
|------|------------|--------|
| **Formation grade** | What **cultivation band** the pattern threatens at full power | 3rd-grade kill vs GC, not vs Immortal |
| **Master grade + blueprint proficiency** | Inscriber skill | Fail chance, stability, % of grade ceiling |
| **Manual condition** | Copy quality (fragment, smudged, intact) | Output % within grade — **not** cross-grade kills |
| **Cultivator realm** | Your body’s cultivation | Backlash tolerance, exam access, how long you can sustain a lay |

**Dropped:** “peerless formation” as a quality tier that bypasses realm matching.

### Above-grade effects — marrying “grade match” with formation-master fantasy

Grade alignment is the **default rule**. Occasional **above-grade** outcomes are still possible — but through **exceptions**, not a peerless scroll:

| Exception | What happens | Limits |
|-----------|--------------|--------|
| **Stymie, don’t slay** | Lower-grade formation **slows, weakens, alarms, or pins briefly** a higher target | Kill denied; buys time for allies, second array, escape |
| **Array stacking** | Multiple linked formations raise **effective grade** in one zone (+1 step typical, rare +2) | Months of prep, massive upkeep, burns out after spring |
| **External amp** | Feed pattern with **overgrade materials** (spirit vein tap, sacrifice stone, borrowed relic) | **One activation** then formation scatters; rare mats |
| **Target state** | Wounded, in tribulation, suppressed, arrogant inside your ground | Lowers target’s **effective defense grade** for this encounter only |
| **Heaven rite array** | Off-ladder story patterns (basin ascension, etc.) | Not part of normal kill-trap progression; [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) |

**Formation-master playthrough at parity:** Nascent Soul master lays **4th-grade** traps for Nascent Soul enemies — wins by **preparation, luring, hybrids, arrays**, not by 2nd-grade pattern one-shotting an Immortal.

**Rare myth beat (optional):** 3rd-grade base + array stack + vein overcharge + Immortal already crippled = narratively “a formation killed an immortal” — **three exceptions stacked**, not one broken grade.

### Example compositions

| Blueprint | Grade | Primary | Primitives | Notes |
|-----------|-------|---------|------------|-------|
| Spirit Gathering | 1st | Gather | Sink → Channel → Pool (+ Seal) | v1 shipped — treat as 1st-grade |
| Qi Stabilizer | 2nd | Stabilise | Pool + Seal (+ Channel) | FE-band support |
| Iron Wall Ward | 2nd | Ward | Ward + Seal (+ Channel) | Perimeter anchor |
| Golden Core Slayer *(kill)* | 3rd | Kill | Trap + Sever + Seal | Credible vs GC **inside** pattern; master grade ≥ 3 |
| Blood Harvest *(hybrid)* | 3rd | Gather + Kill | Sever → Channel → Pool | Hybrid complexity; master grade ≥ 4 |
| Dao Suppression Lattice | 6th | Trap + Ward | Trap + Ward + **Dao node** | Requires dao fragment component |
| Sun Condensation Plate | 3rd | Condense | Sink → Condense → Pool | Essence site + array scale later |

**Arrays** reuse the same primitives at larger scale: more physical **anchors** (flags/stones), longer **Channels**, shared **Pools** between sub-formations.

---

## Formation Master (profession)

Being a formation master is **dedication**, not a side perk. Most cultivators **use** formations; fewer **inscribe** them. Profession **grade** gates what you may attempt; **blueprint proficiency** gates how well you lay a specific diagram.

### Four tracked axes (summary)

| Axis | What it measures | How it rises |
|------|------------------|--------------|
| **Master grade** | Max formation grade + complexity you can lay | Grade exams, FI |
| **Blueprint proficiency** | Skill on *one* diagram | Trace, lays, upkeep months |
| **Formation grade** | What realm band the **pattern** threatens | Blueprint itself (manual tier) |
| **Manual condition** | Copy quality | Better loot, annotation, sect copy |
| **Cultivator realm** | Your body’s cultivation | Normal cultivation — backlash, exam access |

**Formation Dao** (late game, optional): unlock **hybrid design** and legendary patterns — analogous to Dao Seeking, **not** the early profession ladder. Reserve “Dao” for that track; early UI says **Formation Master grade** or **Inscriber**.

### Master grade vs formation grade

**Owner direction:** Formation Master **grade** should **align with what they can lay** — primarily **max formation grade** and **max pattern complexity** (primitives, hybrids, mandatory dao/law slots).

| Master grade | Title (working) | Max formation grade | Complexity |
|--------------|-----------------|----------------------|------------|
| **0** | Uninitiated | — (use hired only) | — |
| **1** | Pattern Student | 1st | Single primary, ≤4 primitives |
| **2** | Inscriber | 2nd | Single primary, standard seals |
| **3** | Formation Adept | 3rd | Talismans; simple hybrids |
| **4** | Array Disciple | 4th | Multi-node array **assist**; essence sites |
| **5** | Formation Master | 5th | Equipment inscription; full hybrids |
| **6** | Array Master | 6th | Compose arrays; **dao component** integration |
| **7** | Grand Formationist | 7th | Rite-grade arrays (with law/heaven mats) |

Promotion still via **exam + FI** (not a comprehend button). Exam = lay a **standard pattern at your current max grade**.

**Cultivator realm** remains a **soft gate** for exams and backlash — a genius QC student might reach master grade 1, but cannot safely attempt 3rd-grade lay until realm and materials catch up.

### Grade advancement (not a comprehend button)

Promotion is a **trial**, not `+1 Formation Level`:

1. **Insight threshold** — enough **Formation Insight** (FI) from practice, lays, maintenance, assisted array work.
2. **Proof lay** — inscribe a **standard exam pattern** at a sect hall or borrowed anchor (materials + months; failure delays retry).
3. **Optional witness** — sect formation elder, or NPC master for rogue cultivators.

Failed exam: materials lost, cooldown, no grade-up. Success: master grade increases, log flavour, maybe sect rep.

FI sources: trace sessions, successful first lays, months maintaining active patterns, repairing scattered patterns, array assistant duty, deciphering manuals.

---

## Hired inscription (always allowed)

No run has time to learn every pattern. **Hiring an outside formation master** to decipher, lay, or maintain is **always valid** — markets, sect commissions, rogue masters, allied sect elders.

| Who lays | Player gets | Player does not get |
|----------|-------------|---------------------|
| **Hired NPC** | Active pattern at NPC’s skill level; saves your months | Formation Insight, blueprint proficiency, master grade progress |
| **Self** | Proficiency + FI + full control | Time, materials, fail risk |

**Early game default:** cultivator main path hires gather/ward at residence while focusing on realm grind. **Formation-master run** inverts that — you lay and maintain yourself, hire **muscle or bait** instead.

**Cost model:** stones + materials + months (NPC queue) + sometimes rep/favour. Higher **formation grade** or secrecy → premium. 6th-grade work requires NPC with **master grade ≥ 6** and dao-component access.

**Sect disciples (later):** in-house formation specialist disciple = recurring salary vs one-off hire.

---

## Formation Master as primary path

Formations are a **viable main identity**, not a side job for every build.

| Cultivator main | Formation Master main |
|-----------------|----------------------|
| Realm + combat techniques first | Master grade + blueprint catalog first |
| Hires formations as needed | Cultivates enough realm to survive backlash; wins via traps, wards, arrays |
| Personal fight power | **Pattern power** — talismans, gear inscriptions, sprung kills |
| Sect = cultivate hall + income | Sect = **anchor network**, array hall, material pipeline |

**Whole playthrough fantasy:** start Pattern Student, never strongest in a straight duel, but **at parity** you delete targets who step on your 3rd-grade kill ground; at high tier you weave **arrays**, **dao nodes**, and **lures**. Reincarnation carries blueprint unlocks and sect array reclaim.

**Balance guardrails:** kill **above** formation grade requires **stacked exceptions** (stymie, array +1, overcharge mats, wounded target) — not a single scroll. Most play is grade-matched preparation fantasy.

---

## Learning a blueprint (pipeline)

**Problem:** looting a manual and instantly laying feels wrong. **Also wrong:** one global “Comprehend Formation +1” button.

**Solution:** manual → **diagram state** on shelf; **master grade + proficiency** gate real inscription.

### Pipeline stages

```
Acquire → Decipher → Trace (×N) → First Lay → Maintain → Master copy
```

| Stage | Player action | Time / cost | Outcome |
|-------|---------------|-------------|---------|
| **Acquire** | Loot, buy, sect grant, residence upgrade | — | Manual on **formation shelf** (separate from combat manuals) |
| **Decipher** | Study at library / formation hall / quarters | Months + optional stones | Diagram readable; know primary + primitive list; **cannot lay yet** if master grade too low |
| **Trace** | Practice on **sand table** or scrap anchor | 1–3 sessions: cheap mats + months each | Blueprint proficiency → “ready for first lay”; lowers first-lay fail chance |
| **First lay** | Real anchor, full `layCost` | Materials + months | On success: pattern active + proficiency tier 1; on fail: partial material loss, retry |
| **Maintain** | Pay upkeep each period | Recurring | Proficiency slowly rises; output approaches blueprint cap |
| **Master copy** | High proficiency on this blueprint | — | Lay faster, cheaper reinscribe, or +output band (per-diagram mastery reward) |

### What master grade gates vs what proficiency gates

| Action | Gated by |
|--------|----------|
| Decipher manual | Realm (read complexity), sometimes sect access |
| Trace practice | Master grade ≥ 1 |
| First lay of 1st-grade qi formation | Master grade ≥ 2, proficiency ready |
| Lay 3rd-grade kill pattern | Master grade ≥ 3 |
| Essence formation at tagged site | Master grade ≥ 4 |
| Talisman of pattern | Master grade ≥ 3 + proficiency ≥ tier 2 |
| Inscribe gear | Master grade ≥ 5 |
| Hybrid / 6th-grade (dao component) | Master grade ≥ 6; Formation Dao for design |

### Manual types

| Type | Learning feel |
|------|----------------|
| **Complete diagram** | Full pipeline; standard proficiency curve |
| **Fragment** | Decipher yields partial primitives — trace more sessions; or ambient-only until missing chapter found |
| **Copied / smudged** | Higher fail until master grade rises; good for grade-1 practice |
| **Sect inheritance** | Residence upgrade grants **elder-traced starter** — fiction: they laid it once for you; you still decipher to maintain alone |

### v1 migration note

Current `learnOnResidenceLevel` auto-push to `knownFormations` is **bootstrap** (elder traces starter patterns). When F1 lands, convert to: grant **manual to formation shelf** + auto-decipher for master grade 1–2 tutorial, or elder NPC lays first copy without skipping profession intro.

---

## Player state (proposal)

```js
G.formationMaster = {
  grade: 0,                   // master grade 0–7; caps layable formation grade
  insight: 0,
  lastExamMonth: null,
  examCooldownMonths: 6
};

G.formationShelf = {
  spirit_gathering: {
    source: 'residence_grant',
    formationGrade: 1,        // realm-aligned pattern grade
    manualCondition: 'intact', // fragment | smudged | intact
    deciphered: true,
    proficiency: 2,
    traceSessionsDone: 2,
    totalMaintainMonths: 8
  }
};

G.knownFormations = [];       // IDs player may lay (deciphered + master grade OK) — or derive from shelf
G.sect.residence.formations.slots = [];
```

---

## Shipped today (v1)

| Piece | Location |
|-------|----------|
| Residence slots 0→1→2→3 | `SECT_RESIDENCE.formationSlotsByLevel` in `data.js` |
| Spirit Gathering, Qi Stabilizer | `FORMATIONS` in `data.js` |
| Iron Wall Ward | Stub (`implemented: false`) |
| Lay / clear / cultivate at quarters | `formations.js`, `sect-map.js` |
| Save keys | `G.knownFormations`, `G.sect.residence.formations.slots` |

**v1 gaps vs this doc:** no upkeep, no anchors beyond residence, no equipment/talisman, no arrays, no essence tags, no hybrids, no formation master ranks (residence level auto-grants manuals — **bootstrap only**, replace when F1+ lands).

---

## Implementation phases (suggested)

| Phase | Scope |
|-------|-------|
| **F0** *(shipped)* | Residence qi formations, lay cost, cultivate-at-quarters hook |
| **F1** | Formation shelf + decipher/trace; master grade 0–2; upkeep + neglect |
| **F2** | Sect anchor nodes; master grade 3–4; grade exams |
| **F3** | Essence gather + site tags (with cultivation methods P3) |
| **F4** | Arrays — multi-formation sect scale, condensate; Array Disciple duties |
| **F5** | Equipment + talisman deploy (master grade 5+) |
| **F6** | Hybrids + Formation Dao design; guild/market anchors; grand arrays |

---

## Prerequisites

- [ ] Owner OK: anchors vs free placement ( **anchors** — owner 2026-07-21 )
- [ ] Owner OK: formation vs building bonus split (avoid duplicate cultivate %)
- [ ] Cultivation methods P0–P2 for qi track before essence formations
- [x] Hire outside masters — always OK (owner 2026-07-21)
- [x] Formation grade realm-aligned (1st = QC band, 3rd = GC band); no peerless tier (owner 2026-07-21)
- [x] Master grade caps layable formation grade + complexity; dao/law components for 6th+ (owner 2026-07-21)
- [ ] Owner OK: above-grade exception table (stacking rules for array +1, overcharge, stymie-only)
- [ ] Owner OK: eight primitives (sink, channel, pool, seal, ward, condense, trap, sever)
- [ ] Owner OK: master grade ladder (0–7) aligned to max layable formation grade
- [ ] Owner OK: learn pipeline (decipher → trace → first lay) vs v1 auto-grant migration
- [ ] Upkeep economy tuning with [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)

## Open questions

- **Insight curve:** FI per trace session vs per maintained month — tune in playtest
- **Exam patterns:** one global “standard array” per rank or sect-specific variants?
- **Hire pricing:** flat fee vs % of formation grade + secrecy premium
- **Above-grade stacking:** max +1 effective grade from arrays, or +1 from overcharge — both stackable or pick one?
- **Stymie duration:** how long can 2nd-grade pin inconvenience a 4th-grade target?
- **Dao component source:** player dao track only, or lootable fragments / sect relics?
- **Dual profession:** Full formation master run vs cultivator who dabbles — same grades, slower FI?
- **Equipment charges:** per-item durability vs shared inscription fatigue?
- **Array composition UI:** explicit node graph vs abstract array level + type?
- **Iron Wall Ward:** residence slot vs sect perimeter node?
- **Formation Dao unlock:** separate from master grade 7, or grade 7 gates entry to Dao track?
- **Grand array:** story-only vs playable late-game

## Implementation crumbs

- `formations.js` — extend for shelf, decipher/trace, master grade gates, upkeep
- `techniques.js` — `comprehendManual` / shelf patterns to **clone UI**, not merge pools
- `data.js` — `FORMATIONS`, `SECT_RESIDENCE`, `SECT_BUILDINGS`, `SECT_MAP_NODES`
- `sect-map.js` — residence UI; future anchor picker
- [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — essence fuel, condensate, array save shape `G.sect.arrays`
- [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — rite formation IDs and outcomes
