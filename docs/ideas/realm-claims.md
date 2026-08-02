# Realm claims (abilities per watershed)

| Field | Value |
|-------|-------|
| **Status** | `designed` (expanded — per-realm depth pass 2026-08-02) |
| **Blocked on** | [`nine-realm-ladder.md`](nine-realm-ladder.md) indices in code; optional 7-realm subset shippable first |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent **City map expansion** ([bc-184cf92b](https://cursor.com/agents/bc-184cf92b-97ab-4567-a507-0109efd6f5ba)), 2026-07-19–21; expanded 2026-08-02 |
| **Updated** | 2026-08-02 |

## Intent

Each mortal realm grants a **claim** — one identity players feel at breakthrough: a verb, a travel change, or world reaction. Not just bigger stats or unlocking an existing button without fanfare.

**Presentation:** breakthrough line + scene chip `✦ Domain` (example).  
**Three claim types:** Verb · Aura (world reaction) · Jurisdiction (where you can go).

Aligns with [`world-scale-and-travel.md`](world-scale-and-travel.md) and [`local-world-map-split.md`](local-world-map-split.md). Golden Core **Domain** detail: [`domain-system.md`](domain-system.md). QC **Perception** detail: [`qi-condensation-depth.md`](qi-condensation-depth.md).

---

## Summary table (nine-realm qi path)

Uses indices from [`nine-realm-ladder.md`](nine-realm-ladder.md) (`0–8`).

| Idx | Realm | Claim | One-line identity |
|-----|-------|-------|-------------------|
| 0 | Qi Condensation | **Perception** | You are no longer blind to qi |
| 1 | Foundation Establishment | **Anchor** | Your foundation holds; the world cannot shake you casually |
| 2 | Core Formation | **Domain** | Your core projects — space near you answers to you |
| 3 | Nascent Soul | **Sovereignty** | The soul walks outside the body; distance is negotiable |
| 4 | Deity Transformation | **Transformation** | The mortal shell no longer contains you — the region feels your presence |
| 5 | Void Refinement | **Passage** | Space is a suggestion |
| 6 | Dao Seeking | **Law (seek)** | You read the rules — comprehend, hunt fragments |
| 7 | Dao Manifestation | **Law (wear)** | You embody a law — local imposition, not study |
| 8 | Immortal Ascension | **Transcendence** | Mortality's contract is void |

**Half-Step Immortal** (peak before idx 8 breakthrough): see [`nine-realm-ladder.md`](nine-realm-ladder.md) — threshold at heaven's gate; not a separate claim row.

---

## Power vs geography (qi path)

Same 5 zones on the map; **friction** drops as claims stack. Baseline: **8mo** zone travel, **2mo** local walk.

```text
QC ─── FE ─── GC ─── NS ─── DT ─── Void ─── Seek ─── Wear ─── Immortal
 │      │      │      │      │       │       │        │          │
walk   walk   light  sky    region  blink   law      law       above
only   +probe body   zones  pressure local  sense    wear      map
```

| Idx | Realm | Local (2mo base) | Zone (8mo base) | Geography feel |
|-----|-------|------------------|-----------------|----------------|
| 0–1 | QC, FE | Full | Full | Mortal scale — every month counts |
| 2 | Golden Core | **0–1mo** (Light Body) | Full | Town shrinks; continent still far |
| 3 | Nascent Soul | Trivial in-zone | **2–3mo** (Sky Travel) | Continent is yours |
| 4 | Deity Transformation | Trivial | **2–3mo** (maintain) | **Region** reacts — not faster travel, deeper presence |
| 5 | Void Refinement | **Blink** between nodes | **1–2mo** optional | Geometry bends |
| 6–7 | Dao Seek / Wear | As Void+ | As Void+ | Law-sense, forbidden thin warnings |
| 8 | Immortal | Narrative / free | Trivial / narrative | Left the walk loop |

**Owner lock:** GC = local flight only; NS = zone flight. Deity Transformation does **not** add another flight tier — it adds **regional presence** (see idx 4 below).

---

## Per-realm depth (qi path)

### 0 — Qi Condensation · **Perception**

> *You are no longer blind to qi.*

| Type | What players get |
|------|------------------|
| **Verb** | Qi-feel — sense mortal vs has-qi; comparative *heavier / even / lighter* (effective power, not realm labels); vague element hints |
| **Aura** | Explore and NPC flavor — "something wrong" on hidden things (tease sealed sites before FE **Probe**) |
| **Jurisdiction** | None — still a person on the road |

**Not:** flight, domain, full spiritual sense ([`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) stays NS+).

**Deep doc:** [`qi-condensation-depth.md`](qi-condensation-depth.md)

---

### 1 — Foundation Establishment · **Anchor**

> *Your foundation holds; the world can't shake you casually.*

| Type | What players get |
|------|------------------|
| **Verb** | **Intent**, **Physique**, sealed-site **Probe** (existing unlocks — formalize as claim) |
| **Aura** | **Rooted** — cheaper recuperate; resist zone environmental chip (Frostbite cold, Emberwild heat) |
| **Jurisdiction** | Factions, deeper explore — still **grounded** (full walk costs) |

*This is "I'm a cultivator now," not "I'm a lord."*

**Deep doc:** [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md) (journey TBD)

---

### 2 — Core Formation (Golden Core) · **Domain**

> *Your core projects — space near you answers to you.*

| Type | What players get |
|------|------------------|
| **Verb** | Sect, forbidden (existing); optional combat **qi lock** (one enemy debuff) — "domain" in fights |
| **Aura** | **Pressure** — weak NPCs defer, intimidate action, faction first impressions; Look Around finds higher-tier figures |
| **Jurisdiction** | **Light Body** — local travel **2mo → 0–1mo**; zone travel unchanged |

*First realm where others react to your existence.*

**Deep docs:** [`domain-system.md`](domain-system.md), [`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md)

---

### 3 — Nascent Soul · **Sovereignty**

> *The soul walks outside the body; distance is negotiable.*

| Type | What players get |
|------|------------------|
| **Verb** | **Soul sense** — better reads across zone; **nascent projection** (light) — one remote faction interact per X months without walking |
| **Aura** | Sovereignty pressure — stronger than GC domain; NS overwrites GC domain weight while present |
| **Jurisdiction** | **Sky Travel** — zone **8mo → 2–3mo**; Heartlands weight opens narratively |

*The **continent** shrinks, not just the town.*

**Deep doc:** [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md)

---

### 4 — Deity Transformation · **Transformation** *(draft — owner to tune)*

> *The mortal shell no longer contains you. The jianghu names you with fear.*

| Type | What players get |
|------|------------------|
| **Verb** | **Regional presence** — your qi registers across a city/sphere, not just arm's reach; sects and NPCs use different dialogue tier |
| **Aura** | **Deity-pressure radius** — deference escalates beyond GC/NS personal domain; weak cultivators may flee without combat |
| **Jurisdiction** | **Not more flight** — keep NS sky-travel band; add **sphere recognition** (events, faction stance, chronicle) |

**Design intent:** idx 4 is the step from "powerful individual" to "force that bends a **region**." Void (idx 5) then bends **space**; Dao (6–7) bends **rules**.

**Body skin:** **Titan step** — bound crossing without qi flight (physical sovereignty).  
**Soul skin:** **Embodied avatar** — projection carries more weight, longer range.

**Open:** exact radius (one city vs whole zone); overlap with GC domain clash rules.

---

### 5 — Void Refinement · **Passage**

> *Space is a suggestion.*

| Type | What players get |
|------|------------------|
| **Verb** | **Blink** — jump between two local map nodes (cooldown or qi spike); **void skip** — chance to avoid travel/explore road encounters |
| **Aura** | **Spatial authority** — sealed pockets others can't reach; rings matter less narratively |
| **Jurisdiction** | Zone travel may drop to **1–2mo**; extreme zones less punishing without hard realm gates |

*Void is **geometry**, not raw damage.*

**Body skin:** **Step through** — one bound ignores terrain.  
**Soul skin:** **Soul blink** — projection snaps between nodes.

**Note:** Today in **7-realm code**, Void = idx 4; transcendence perks (`void_step`, etc.) live here. Migration shifts to idx 5.

---

### 6 — Dao Seeking · **Law (seek)**

> *You don't just use qi — you read the rules.*

| Type | What players get |
|------|------------------|
| **Verb** | **Dao panel** (existing); **law-sense** — faction dao alignment, tribulation lean, forbidden "thin dao" warnings |
| **Aura** | Comprehending laws feeds immortal-layer legislation preview ([`immortal-world-layer.md`](immortal-world-layer.md)) |
| **Jurisdiction** | Read the board — know which grounds answer to which law before entering |

**Seeking** = study, hunt fragments, read — **not** wear.

**Today in 7-realm code:** Dao Seeking = idx 5 (`DAO_SEEKING_REALM_IDX`).

---

### 7 — Dao Manifestation · **Law (wear)** *(draft — owner to tune)*

> *The law is not in your notes — it is on your skin.*

| Type | What players get |
|------|------------------|
| **Verb** | **Embody one law** locally — chosen dao imposes on space (muffle weak techniques, skew tribulation character, formation interaction) |
| **Aura** | Others sense **which** law you wear; faction and heaven react differently than generic "high realm" |
| **Jurisdiction** | Bridge to immortal politics — preview **legislation** without full Court layer |

**Distinction from idx 6:** Seeking **comprehends**; Manifestation **wears**. Seeking is library; Manifestation is armor.

**Body skin:** **Law-forged flesh** — physique expresses worn law.  
**Soul skin:** **Law-bound soul** — will attacks carry law flavor.

**Open:** one law per life vs swappable; gate to Half-Step / idx 8.

---

### 8 — Immortal Ascension · **Transcendence**

> *Mortality's contract is void.*

| Type | What players get |
|------|------------------|
| **Verb** | True reincarnation fork; transcendence perks; lifespan effectively unbounded for run purposes |
| **Aura** | Above mortal standing / apprehension axes — different social rules |
| **Jurisdiction** | **No travel friction** on mortal map (or trivial); loop shifts to jurisdiction / Works ([`immortal-world-layer.md`](immortal-world-layer.md)) |

**Half-Step** (peak before final breakthrough): standing at heaven's gate — tribulation / Court / chaos revelation hooks; see nine-realm-ladder stub.

**Not:** "+stats" — you left the mortal board's rules.

---

## Body & soul paths (same index, different skin)

Shared `realmIdx` gates; breakthrough text and chip name vary by `G.path`. One mechanical unlock, three presentation strings.

| Idx | Qi claim | Body skin | Soul skin |
|-----|----------|-----------|-----------|
| 0 | Perception | **Iron sense** — pain, weather, terrain | **Spirit stir** — unease toward soul-path |
| 1 | Anchor | **Iron Skin** — resist physical zone hazards | **Embryo** — soul mass begins |
| 2 | Domain | **Shockwave** — physical intimidation | **Soul pressure** |
| 3 | Sovereignty | **Leap** — bound crossing (fly reskin) | **Soul flight** — projection |
| 4 | Transformation | **Titan step** | **Embodied avatar** |
| 5 | Passage | **Step through** | **Soul blink** |
| 6 | Law (seek) | **Law-tempered bone** | **Law-touched will** |
| 7 | Law (wear) | **Law-forged flesh** | **Law-bound soul** |
| 8 | Transcendence | Path-specific immortal epithet | Path-specific immortal epithet |

---

## What NOT to do

- **Nine new buttons** — most claims modify existing verbs (travel, explore, look around)
- **Flying at QC** — collapses local map before it matters
- **Pure passives only** — "+5% explore" doesn't feel like a realm; pair with one felt verb
- **Identical unlock rows on all three paths** — share milestone *index*, vary presentation
- **Deity Transformation = more flight** — NS owns continent travel; DT owns regional presence

---

## Integration with existing unlocks

Many claims **formalize** what exists today:

| Existing (7-realm code) | Claim home (9-realm target) |
|---------------------------|----------------------------|
| Cultivate, explore @ QC | Perception |
| Intent, physique, search @ FE | Anchor |
| Sect, forbidden @ Core | Domain |
| Heartlands weight @ NS | Sovereignty |
| Dao panel @ Dao Seeking (idx 5 → 6) | Law (seek) |
| True reincarnation @ Immortal | Transcendence |

**Separate from claims:** `TRANSCENDENCE_PERKS` in `data.js` are **perfect-breakthrough combat/stat picks** per realm — not realm identity. Do not conflate with claim chips.

Add **travel mults** and **breakthrough fanfare** as new implementation work.

---

## Travel mult API (sketch)

```javascript
function getZoneTravelMonths(zoneId) {
  const base = ACTION_MONTHS.travel;
  return Math.max(1, Math.round(base * getRealmTravelMult('zone')));
}
function getLocalTravelMonths(locationId) {
  const base = ACTION_MONTHS.localTravel;
  return Math.max(0, Math.round(base * getRealmTravelMult('local')));
}
```

---

## Smallest shippable slice (7-realm subset)

Ship against **today's indices** first; extend when nine-realm migration lands:

1. Claim string on breakthrough + scene chip (derive from `realmIdx`)
2. **GC (2):** local travel mult + one pressure reaction (NPC or log)
3. **NS (3):** zone travel mult
4. **Void (4 today / 5 target):** blink — defer until local map split ships

---

## Prerequisites

- [ ] Breakthrough / `fullRender` hook for claim announcement
- [ ] Travel functions in `world.js` + `locations.js`
- [ ] Nine-realm names in `PATHS` (or map 7→9 claims with gaps)
- [ ] Owner tune pass on idx 4 and idx 7 drafts

## Open questions

- [ ] Store claims explicitly vs derive from table?
- [ ] Body/soul paths — all 9 skins or subset at launch?
- [x] QC Perception = light qi-feel — [`qi-condensation-depth.md`](qi-condensation-depth.md)
- [ ] Deity Transformation radius — one city vs whole zone?
- [ ] Dao Manifestation — one worn law per life vs swappable?
- [ ] GC combat qi-lock — v1 or v2?

## Implementation crumbs

- `data.js` — `ACTION_UNLOCKS`, `ACTION_MONTHS`, `PATHS.*.realms`, `TRANSCENDENCE_PERKS` (separate system)
- `cultivation.js` / breakthrough flow
- `world.js`, `locations.js` — travel
- `ui.js` — `renderScenePanel` chip
- `npc.js`, `ambient-npcs.js` — pressure reactions
- [`cultivation-realm-depth-pass.md`](cultivation-realm-depth-pass.md) — umbrella; this doc is the capability matrix

## Links

- [`nine-realm-ladder.md`](nine-realm-ladder.md) — indices, lifespan, half-step
- [`world-scale-and-travel.md`](world-scale-and-travel.md) — philosophy
- [`domain-system.md`](domain-system.md) — GC domain depth
- [`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md) — GC substages
