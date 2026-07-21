# Formations & arrays

| Field | Value |
|-------|-------|
| **Status** | `designed` (vision); v1 residence qi buffs `shipped` |
| **Blocked on** | Cultivation methods P0–P2 for essence fuel bands; roots v2 for rite formations |
| **Issue** | none yet |
| **Chat / PR** | Owner formations brainstorm (cloud agent, 2026-07-21); prior chat *xianxia formations arrays* (not in repo) |
| **Updated** | 2026-07-21 (grades, hired inscription, primary path) |

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

**Design rule:** every blueprint lists `primitives: [...]` in data. Player-facing UI shows **primary tag**, **blueprint grade**, and (for masters) primitive list.

### Blueprint grades (formation quality)

Formations have a **grade** ladder — same vocabulary as cultivation manuals (crude → common → superior → peerless). Grade is a property of the **diagram/manual**, not the inscriber’s cultivation realm.

| Grade | Fiction | Typical ceiling |
|-------|---------|-----------------|
| **Crude** | Smudged copy, missing nodes | Cottage gather, weak ward |
| **Common** | Sect syllabus pattern | Solid residence / hall formations |
| **Superior** | Inner-court inheritance | Strong kill/ward; essence condense |
| **Peerless** | Ancestor’s complete diagram | Region-threatening arrays; theoretical kill beyond inscriber’s realm |
| **Heaven** *(rite-only)* | Mandate of heaven patterns | Basin ascension, grand arrays — story + rite bucket |

**Upgrade within lineage:** fragment completion, master annotation, better materials at lay time — raises **grade** on the **same** blueprint id.

### Three axes of power (do not collapse)

| Axis | What it is | Drives |
|------|------------|--------|
| **Blueprint grade** | Quality of the pattern itself | **Theoretical ceiling** — peerless kill array *can* threaten an Immortal *if* fully fed and sprung |
| **Master rank + blueprint proficiency** | Inscriber skill | **Realised output** — stability, % of ceiling, fail chance on lay |
| **Cultivator realm** | Your cultivation | **Sustain, backlash, prep** — not automatically the damage cap of a finished trap |

**Owner direction (2026-07-21):** A **Nascent Soul** formation master who spent a life on the profession **can** inscribe a **peerless** kill formation whose *pattern grade* could kill an Immortal — **extremely rare**, years of materials, and only after **thorough planning** to get the target **inside** the sprung array. David-and-Goliath via geometry, not sword qi.

| Factor | Effect |
|--------|--------|
| Lay attempt | High fail if master rank low vs blueprint grade |
| Activated output | Proficiency + rank → % of grade ceiling |
| After spring | Inscriber may be helpless in direct fight — formation did the work |
| Backlash | Weak realm = injury if pattern cracks mid-lay or misfires |
| Luring target | **Required** for kill traps — bait, terrain, allies, arrogance |

**Not:** loot peerless scroll → auto-win. **Yes:** dedicated formation-master run punches **orders of magnitude** above personal realm when the trap is the game.

### Example compositions

| Blueprint | Primary | Primitives | Notes |
|-----------|---------|------------|-------|
| Spirit Gathering | Gather | Sink → Channel → Pool (+ Seal) | v1 shipped |
| Qi Stabilizer | Stabilise | Pool + Seal (+ light Channel) | Dampens meridian noise at pool |
| Iron Wall Ward | Ward | Ward + Seal (+ Channel along perimeter) | Future perimeter anchor |
| Blood Harvest *(hybrid)* | Gather + Kill | Sever → Channel → Pool (+ Seal) | Superior+; Formation Master rank |
| Immortal Slayer Array *(extreme)* | Kill | Trap + Sever + Seal + Ward | Peerless; rank 6+ to lay; target must enter |
| Sun Condensation Plate | Condense | Sink → Condense → Pool | Essence site + array scale later |

**Arrays** reuse the same primitives at larger scale: more physical **anchors** (flags/stones), longer **Channels**, shared **Pools** between sub-formations.

---

## Formation Master (profession)

Being a formation master is **dedication**, not a side perk. Most cultivators **use** formations; fewer **inscribe** them. Profession rank gates what you may attempt; **blueprint proficiency** gates how well you lay a specific diagram.

### Four tracked axes (summary)

| Axis | What it measures | How it rises |
|------|------------------|--------------|
| **Master rank** | Profession — categories you may attempt | Trials, commissions, rank exams |
| **Blueprint proficiency** | Skill on *one* diagram | Trace, lays, upkeep months |
| **Blueprint grade** | Manual quality ceiling | Better manual, annotation, lay materials |
| **Cultivator realm** | Your body’s cultivation | Normal cultivation — gates exam access, backlash tolerance |

**Formation Dao** (late game, optional): unlock **hybrid design** and legendary patterns — analogous to Dao Seeking, **not** the early profession ladder. Reserve “Dao” for that track; early UI says **Formation Master rank** or **Inscriber grade**.

### Master ranks

| Rank | Title | Unlocks |
|------|-------|---------|
| **0** | Uninitiated | Benefit from sect/residence patterns laid by others; no solo lay |
| **1** | Pattern Student | Crude lay of **starter** blueprints (high fail, weak output); trace practice |
| **2** | Inscriber | Reliable lay of **single-primary** formations; reinscribe scattered patterns |
| **3** | Formation Adept | Full upkeep tuning; **simple talismans** (one primitive + Seal) |
| **4** | Array Disciple | Assist on **multi-node arrays**; essence formations at tagged sites |
| **5** | Formation Master | **Equipment inscription**; hybrid blueprints; teach disciples |
| **6** | Array Master | Compose / restore sect-scale arrays |
| **7** | Grand Formationist | Grand arrays, rite-grade patterns (story + endgame) |

**Realm gates (soft):** rank exams require minimum cultivation (e.g. Inscriber ≥ Condensation, Array Master ≥ Core). Profession can lag or lead realm slightly but not skip tiers absurdly.

### Rank advancement (not a comprehend button)

Promotion is a **trial**, not `+1 Formation Level`:

1. **Insight threshold** — enough **Formation Insight** (FI) from practice, lays, maintenance, assisted array work.
2. **Proof lay** — inscribe a **standard exam pattern** at a sect hall or borrowed anchor (materials + months; failure delays retry).
3. **Optional witness** — sect formation elder, or NPC master for rogue cultivators.

Failed exam: materials lost, cooldown, no rank. Success: rank-up, log flavour, maybe sect rep.

FI sources: trace sessions, successful first lays, months maintaining active patterns, repairing scattered patterns, array assistant duty, deciphering manuals.

---

## Hired inscription (always allowed)

No run has time to learn every pattern. **Hiring an outside formation master** to decipher, lay, or maintain is **always valid** — markets, sect commissions, rogue masters, allied sect elders.

| Who lays | Player gets | Player does not get |
|----------|-------------|---------------------|
| **Hired NPC** | Active pattern at NPC’s skill level; saves your months | Formation Insight, blueprint proficiency, rank progress |
| **Self** | Proficiency + FI + full control | Time, materials, fail risk |

**Early game default:** cultivator main path hires gather/ward at residence while focusing on realm grind. **Formation-master run** inverts that — you lay and maintain yourself, hire **muscle or bait** instead.

**Cost model:** stones + materials + months (NPC queue) + sometimes rep/favour. Higher blueprint grade or secrecy → premium. Peerless kill-trap inscription may require finding a **rank 6+ NPC** even if *you* hold the manual.

**Sect disciples (later):** in-house formation specialist disciple = recurring salary vs one-off hire.

---

## Formation Master as primary path

Formations are a **viable main identity**, not a side job for every build.

| Cultivator main | Formation Master main |
|-----------------|----------------------|
| Realm + combat techniques first | Master rank + blueprint catalog first |
| Hires formations as needed | Cultivates enough realm to survive backlash; wins via traps, wards, arrays |
| Personal fight power | **Pattern power** — talismans, gear inscriptions, sprung kills |
| Sect = cultivate hall + income | Sect = **anchor network**, array hall, material pipeline |

**Whole playthrough fantasy:** start Pattern Student, never be the strongest in a straight duel, but clear bosses via prepared ground, lured ambushes, and peerless diagrams you spent decades feeding. Reincarnation carries **blueprint unlocks** and **sect array reclaim**, not necessarily combat arts.

**Balance guardrails:** kill-above-realm stays **rare** — setup months, rare manuals, luring gameplay, one-shot or high-upkeep patterns, backlash if it fails. Most formations remain utility (gather, ward, condense), not assassinate-Immortal buttons.

---

## Learning a blueprint (pipeline)

**Problem:** looting a manual and instantly laying feels wrong. **Also wrong:** one global “Comprehend Formation +1” button.

**Solution:** manual → **diagram state** on shelf; **rank + proficiency** gate real inscription.

### Pipeline stages

```
Acquire → Decipher → Trace (×N) → First Lay → Maintain → Master copy
```

| Stage | Player action | Time / cost | Outcome |
|-------|---------------|-------------|---------|
| **Acquire** | Loot, buy, sect grant, residence upgrade | — | Manual on **formation shelf** (separate from combat manuals) |
| **Decipher** | Study at library / formation hall / quarters | Months + optional stones | Diagram readable; know primary + primitive list; **cannot lay yet** if rank too low |
| **Trace** | Practice on **sand table** or scrap anchor | 1–3 sessions: cheap mats + months each | Blueprint proficiency → “ready for first lay”; lowers first-lay fail chance |
| **First lay** | Real anchor, full `layCost` | Materials + months | On success: pattern active + proficiency tier 1; on fail: partial material loss, retry |
| **Maintain** | Pay upkeep each period | Recurring | Proficiency slowly rises; output approaches blueprint cap |
| **Master copy** | High proficiency on this blueprint | — | Lay faster, cheaper reinscribe, or +output band (per-diagram mastery reward) |

### What rank gates vs what proficiency gates

| Action | Gated by |
|--------|----------|
| Decipher manual | Realm (read complexity), sometimes sect access |
| Trace practice | Rank ≥ 1 |
| First lay of simple qi formation | Rank ≥ 2, proficiency ready |
| Essence formation at tagged site | Rank ≥ 4 |
| Talisman of pattern | Rank ≥ 3 + proficiency ≥ tier 2 on that blueprint |
| Inscribe gear | Rank ≥ 5 |
| Hybrid blueprint decipher | Rank ≥ 5; Formation Dao for design (not just lay) |

### Manual types

| Type | Learning feel |
|------|----------------|
| **Complete diagram** | Full pipeline; standard proficiency curve |
| **Fragment** | Decipher yields partial primitives — trace more sessions; or ambient-only until missing chapter found |
| **Copied / crude** | Higher fail until rank rises; good for Pattern Student practice |
| **Sect inheritance** | Residence upgrade grants **elder-traced starter** — fiction: they laid it once for you; you still decipher to maintain alone |

### v1 migration note

Current `learnOnResidenceLevel` auto-push to `knownFormations` is **bootstrap** (elder traces starter patterns). When F1 lands, convert to: grant **manual to formation shelf** + auto-decipher for rank 1–2 tutorial, or elder NPC lays first copy without skipping profession intro.

---

## Player state (proposal)

```js
G.formationMaster = {
  rank: 0,                    // 0–7
  insight: 0,                 // FI toward next exam
  lastExamMonth: null,
  examCooldownMonths: 6
};

// Separate from combat manualShelf
G.formationShelf = {
  spirit_gathering: {
    source: 'residence_grant',
    grade: 'common',          // crude | common | superior | peerless
    deciphered: true,
    proficiency: 2,
    traceSessionsDone: 2,
    totalMaintainMonths: 8
  }
};

G.knownFormations = [];       // IDs player may lay (deciphered + rank OK) — or derive from shelf
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
| **F1** | Formation shelf + **decipher/trace** pipeline; Master rank 0–2; upkeep + neglect |
| **F2** | Sect anchor nodes; rank 3–4; exam trials |
| **F3** | Essence gather + site tags (with cultivation methods P3) |
| **F4** | Arrays — multi-formation sect scale, condensate; Array Disciple duties |
| **F5** | Equipment + talisman deploy (rank 5+) |
| **F6** | Hybrids + Formation Dao design; guild/market anchors; grand arrays |

---

## Prerequisites

- [ ] Owner OK: anchors vs free placement ( **anchors** — owner 2026-07-21 )
- [ ] Owner OK: formation vs building bonus split (avoid duplicate cultivate %)
- [ ] Cultivation methods P0–P2 for qi track before essence formations
- [x] Hire outside masters — always OK (owner 2026-07-21)
- [x] Blueprint grades decoupled from inscriber realm; kill-above-realm via planning (owner 2026-07-21)
- [ ] Owner OK: eight primitives (sink, channel, pool, seal, ward, condense, trap, sever)
- [ ] Owner OK: master rank ladder (0–7) and exam-based promotion
- [ ] Owner OK: learn pipeline (decipher → trace → first lay) vs v1 auto-grant migration
- [ ] Upkeep economy tuning with [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)

## Open questions

- **Insight curve:** FI per trace session vs per maintained month — tune in playtest
- **Exam patterns:** one global “standard array” per rank or sect-specific variants?
- **Hire pricing:** flat fee vs % of blueprint grade + secrecy premium
- **Lure gameplay:** abstract event check vs dedicated “spring trap” encounter flow for kill formations
- **Dual profession:** Full formation master run vs cultivator who dabbles — same ranks, slower FI?
- **Equipment charges:** per-item durability vs shared inscription fatigue?
- **Array composition UI:** explicit node graph vs abstract array level + type?
- **Iron Wall Ward:** residence slot vs sect perimeter node?
- **Formation Dao unlock:** separate from rank 7, or rank 7 gates entry to Dao track?
- **Grand array:** story-only vs playable late-game

## Implementation crumbs

- `formations.js` — extend for shelf, decipher/trace, rank gates, upkeep
- `techniques.js` — `comprehendManual` / shelf patterns to **clone UI**, not merge pools
- `data.js` — `FORMATIONS`, `SECT_RESIDENCE`, `SECT_BUILDINGS`, `SECT_MAP_NODES`
- `sect-map.js` — residence UI; future anchor picker
- [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — essence fuel, condensate, array save shape `G.sect.arrays`
- [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — rite formation IDs and outcomes
