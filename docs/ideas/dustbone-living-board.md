# Dustbone living board (zone vision)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Redwell v1 shipping first ([`redwell-starter-city.md`](redwell-starter-city.md)) |
| **Issue** | none yet |
| **Chat / PR** | [L·WIP] Redwell design park — planning 2026-07-28 |
| **Updated** | 2026-07-28 |

**Hub:** [`dustbone-starter-gameplay.md`](dustbone-starter-gameplay.md)  
**Build-first child:** [`redwell-starter-city.md`](redwell-starter-city.md)  
**Lore:** [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) · [`city-tiers.md`](city-tiers.md) · [`settlement-lore.md`](settlement-lore.md)

## Intent

Dustbone should feel like a **board that keeps moving** whether you cultivate or not. You are one piece; cultivation makes you a **bigger piece** — more doors, more of the board you can shove. Webapp lifespan sim: readable clock motion + layered places, not hundreds of AI NPCs.

## Design notes

### Cultivation = board weight (by city)

Weight is **relative to which city you’re in**.

| Your realm (rough) | Redwell (4th) | Mid city (3rd, unnamed) | Threshold (1st) |
|--------------------|---------------|-------------------------|-----------------|
| **QC** | Small but *at home* | Insignificant visitor | Ant under ancient walls |
| **FE** | Can be **top dog** locally | Respectable; don’t swagger — **GC** walk here | Still small |
| **GC** | Overqualified / local legend | Can throw some weight | Useful hands, not top dog |
| **NS+** | Wrong pond | Big presence | Where top dogs walk |

**Heartlands grip:** **B** — local day-to-day in QC Redwell years; soft patronage politics later / higher weight.

Do **not** gate having a loop behind FE. Redwell fully supports QC life.

### Three-city civic ladder

| Role | Tier | Feel | Who walks around |
|------|------|------|------------------|
| **Redwell** (locked) | **4th** | First home; FE top dog | Mortals, QC–FE |
| **Mid city** (unnamed) | **3rd** | Regional hub | **GC** common enough to humble FE |
| **Threshold City** | **1st** | Pinwright / Law of Dust capital — **not your streets** | Occasional **NS** spectacle; Dao Seeking / Manifestation **spines** at camps/shrine/dunes — not street furniture |

**Camps / Miraj** = outposts & tribe HQs, not cities.

**Cascade:** three **spread-out** cities dilute order density so Threshold isn’t forced to be every function on the pin. Clumping them recreates the nexus problem — travel distance is load-bearing.

**Spawn:** new game starts in **Redwell**, not Threshold (code today: `bone_crossroads` — moves when Redwell ships).

**Build cut:** deep Redwell → Threshold as visit weight → mid city third. Don’t ship three empty hubs.

### Geopolitics — annex vs soft vassalage

| Threat | What blocks it |
|--------|----------------|
| **Hard annex** | Cascade liability on dense foreign rule of the pin + deterrence spines |
| **Soft vassalage** | Not blocked by sand alone — multipolar patrons, bad colony / good hinge, spines answer **flags** not clerks |

Cascade lore ≠ magical Switzerland. Heartlands may **lean** on Dustbone; they can’t **own** it cleanly. QC doesn’t live under patronage (grip B).

### What “breathes” means

Clock-driven pulses, not NPC day sims:

- Job board dries / refreshes
- Caravan / road notices
- Bazaar stock (see Redwell)
- Rumor ticks
- Standing / visibility later

**Taiwu-like full social sandbox** (marry/feud/kill among all NPCs): parked. Steal the *feeling* via **civic seats** + rare rumors — not a second game.

### Civic seats (NPC turnover)

Seats persist; holders age/die and get successors. Story arcs (Su, rivals) = unique IDs, not seats. Murder/grudge = rare seasoning.

### Presence ladder

| Presence | Redwell | Mid | Threshold |
|----------|---------|-----|-----------|
| Mortals + QC–FE | Daily | Common | Underfoot |
| GC | Rare | **Streets** | Present, not ceiling |
| Occasional NS | Almost never | Rare flash | **Capital spectacle** (rare pulses, not weekly weather) |
| Spines (Dao Seeking / Manifestation) | Rumor | Rumor / crisis | Camps / shrine / dunes |
| Heartlands fingerprints | Grip B background | Later | Lore until higher weight |

### Build tiers (zone)

| Tier | Scope |
|------|--------|
| **A** | Redwell depth + nearby fields + alchemy + cultivate baseline |
| **B** | Redwell clock pulse + seats + Threshold visit (thin) |
| **C** | Mid city, camps, bosses, visibility, patronage beyond B |

## Prerequisites

- [x] Owner locks: Redwell name/origin, three-city ladder, grip B, seats, no residence cultivate buff
- [ ] Ship [`redwell-starter-city.md`](redwell-starter-city.md) v1
- [ ] Mid city name + Threshold visit pass
- [ ] Expand QC pamphlet pool (variety for bazaar draws) — separate content pass

## Open questions

- Mid city name / vibe
- Exact map spacing between the three cities
- When Threshold thin visit ships vs after Redwell playtest

## Implementation crumbs

`WORLD_LOCATIONS`, spawn default, `ZONE_MAP_LAYOUT`, world clock pulses, seat state on `G`, market stock tables — follow Redwell child first.
