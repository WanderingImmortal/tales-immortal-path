# Sandveil Tribunal — tribe cultures (Sunscar · Miraj · Ashen)

| Field | Value |
|-------|-------|
| **Status** | `designed` (origins locked — culture detail TBD) |
| **Blocked on** | Owner myth pass per tribe (names, wounds, spine) |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-07-31 · PR [#94](https://github.com/WanderingImmortal/tales-immortal-path/pull/94) |
| **Updated** | 2026-07-31 |

**Type taxonomy:** [`jianghu-organization-types.md`](jianghu-organization-types.md) — tribes ≠ sects  
**Lore basin:** [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) · **Zone:** [`dustbone-living-board.md`](dustbone-living-board.md)

## Intent

Flesh **why** Sunscar, Dune Riders (Miraj), and Ashen Priests sit at the Tribunal table — blood unity, coping strategies after the Third Cascade, **not** sect-style mass recruitment. Player interacts via **contracts, trade, oaths** — not outer-disciple ladder ([`qc-sect-join-ladder.md`](qc-sect-join-ladder.md)).

## Design notes

### Shared origin — Model B (owner lock 2026-07-31)

**Not** one tribe that split three ways. **Third Dynasty machine departments** that went feral when the empire dissolved at the pin:

| Old corps | Tribe | Today |
|---------|-------|-------|
| Extraction security / iron-grit legions | **Sunscar** | Warrior camp; Sunscar Burst pill fame |
| Imperial caravan & supply | **Dune Riders (Miraj)** | Caravan medicine; Qi + Driftburst volume |
| Cascade shrine-readers / entropy rites | **Ashen Priests** | Marrowfall; bone-ash omens |

**Shared tie:** intermarried for generations (adjacent posts on the same machine). **Rivalry** = old service contempt (soldiers vs merchants vs priests) — **cousin friction**, not genocide. **Treaty** = kin who remember Third Cascade cost.

Survived Third Cascade **outside** the pin — deployed on roads, quarries, caravans when administrative concentration at Threshold snapped.

### Tribunal ≠ sect

| | **Tribunal seat** | **Lesser sect** | **Great sect branch** |
|--|-------------------|-----------------|------------------------|
| Bond | Blood + survival pact | Dao + hall | Lineage + mountain |
| Unity | High | Medium | Low (factions) |
| Recruit | Born / rare adoption | Open trial | Root exam |
| Scale | Camp + caravan | City hall | Regional |

Three tribes **do not fight to rule Threshold** — concentration risks Fourth Cascade ([`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md)).

### Why they stay outside Threshold

- Pin safety is **narrow** — spring/ward + Registry **order budget**, not room for tribal nation-building.
- **Capturing** the city = becoming next dynasty on the exception → cascade arithmetic.
- **Identity:** mobility + blood; living inside = census + cultural death.
- **Economics:** profit **from** pin (pills, escort, rites) without **spending** the basin’s fuse.

### What exists today (code audit)

| Tribe | Role | NPC | Mechanics |
|-------|------|-----|-------------|
| **Sunscar** | Warrior | Chief Rakhul | War lean; Sunscar Burst pill fame |
| **Dune Riders (Miraj)** | Merchant caravan | Elder Miraj | Qi Pill + Driftburst volume |
| **Ashen Priests** | Rites / decay | Seer Asha | Marrowfall; dense rites |

### Culture slots (owner fill)

#### Sunscar (origin lean locked)

| Field | Draft |
|-------|-------|
| **Origin** | Third Dynasty **iron-grit legions** — quarry/road security; refused Registry indenture after cascades |
| **Ironscar** | Place ≠ tribe — tribe claims warrior ethos; pit is Third-dynasty scar |
| **Name** | Sunscar = burn/initiation on open-sand trial, or scorch line where iron-grit met red sand |
| **Sacred thing** | TBD |
| **Spine / deterrence** | TBD |
| **Player contract types** | Escort, raid, honor duel |

#### Dune Riders (Miraj)

| Field | Draft |
|-------|-------|
| **Origin** | Third Dynasty **caravan corps** — fed the pin |
| **Redwell** | Ancestral water-stop DNA → [`redwell-starter-city.md`](redwell-starter-city.md) |
| **Caravan law** | TBD |
| **Player contract types** | Caravan guard, medicine run |

#### Ashen Priests

| Field | Draft |
|-------|-------|
| **Origin** | Third Dynasty **rite-readers** — warned on concentration; ignored until too late |
| **Return-to-Dust** | Speech/rites vs formal **Law of Dust** |
| **Cave fiction** | Bonehollow tie — [`explore-field-gathering.md`](explore-field-gathering.md) |
| **Player contract types** | Rite escort, marrow haul |

## Prerequisites

- [x] Shared origin model (Model B) + why outside Threshold (2026-07-31)
- [ ] Owner myth pass: sacred things, spine realm, names
- [ ] Cross-link pill fame in [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md)
- [ ] Distinct from lesser sect slots in [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md)

## Open questions

- [ ] Tribal spine realm band — NS? half-step?
- [ ] Player adoption ever, or contract-only forever?
- [ ] Tribunal vote mechanics — flavor or gameplay?

## Implementation crumbs

`data.js` `ZONE_FACTION_MECHANICS.dustbone`, `factions-expand.js`, tribal locations, `npc` greets — lore drives dialogue pass later.
