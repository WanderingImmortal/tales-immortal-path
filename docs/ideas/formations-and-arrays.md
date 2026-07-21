# Formations & arrays

| Field | Value |
|-------|-------|
| **Status** | `designed` (vision); v1 residence qi buffs `shipped` |
| **Blocked on** | Cultivation methods P0–P2 for essence fuel bands; roots v2 for rite formations |
| **Issue** | none yet |
| **Chat / PR** | Owner formations brainstorm (cloud agent, 2026-07-21); prior chat *xianxia formations arrays* (not in repo) |
| **Updated** | 2026-07-21 |

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
| Comprehend a formation manual / diagram | `learnFormation(id)` → `G.knownFormations` |
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

## Shipped today (v1)

| Piece | Location |
|-------|----------|
| Residence slots 0→1→2→3 | `SECT_RESIDENCE.formationSlotsByLevel` in `data.js` |
| Spirit Gathering, Qi Stabilizer | `FORMATIONS` in `data.js` |
| Iron Wall Ward | Stub (`implemented: false`) |
| Lay / clear / cultivate at quarters | `formations.js`, `sect-map.js` |
| Save keys | `G.knownFormations`, `G.sect.residence.formations.slots` |

**v1 gaps vs this doc:** no upkeep, no anchors beyond residence, no equipment/talisman, no arrays, no essence tags, no hybrids.

---

## Implementation phases (suggested)

| Phase | Scope |
|-------|-------|
| **F0** *(shipped)* | Residence qi formations, lay cost, cultivate-at-quarters hook |
| **F1** | Upkeep tick + neglect fade; reinscribe |
| **F2** | Sect anchor nodes (which building hosts which pattern type) |
| **F3** | Essence gather + site tags (with cultivation methods P3) |
| **F4** | Arrays — multi-formation sect scale, condensate |
| **F5** | Equipment + talisman deploy (Formation Dao progression) |
| **F6** | Hybrids; guild/market anchors; grand arrays (story) |

---

## Prerequisites

- [ ] Owner OK: anchors vs free placement ( **anchors** — owner 2026-07-21 )
- [ ] Owner OK: formation vs building bonus split (avoid duplicate cultivate %)
- [ ] Cultivation methods P0–P2 for qi track before essence formations
- [ ] Formation Dao progression design (unlocks hybrids, gear inscription, talisman recipes)
- [ ] Upkeep economy tuning with [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)

## Open questions

- **Formation Dao:** separate stat/track, or gate via comprehension + sect library?
- **Equipment charges:** per-item durability vs shared “inscription fatigue”?
- **Array composition:** explicit “slot 3 links slot 1+2” UI, or abstract array level + type?
- **Iron Wall Ward:** residence slot vs sect perimeter node vs event-only?
- **Hybrid unlock:** one hybrid per life, or catalog of rare diagrams?
- **Grand array:** story-only vs playable late-game — defer until sect/city scale matters

## Implementation crumbs

- `formations.js` — extend for upkeep, anchors, deploy modes
- `data.js` — `FORMATIONS`, `SECT_RESIDENCE`, `SECT_BUILDINGS`, `SECT_MAP_NODES`
- `sect-map.js` — residence UI; future anchor picker
- [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — essence fuel, condensate, array save shape `G.sect.arrays`
- [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — rite formation IDs and outcomes
