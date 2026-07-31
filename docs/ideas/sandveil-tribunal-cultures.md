# Sandveil Tribunal — tribe cultures (Sunscar · Miraj · Ashen)

| Field | Value |
|-------|-------|
| **Status** | `idea` — **myth gap**; roles exist in code, culture thin |
| **Blocked on** | Owner lore pass |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-07-31 · gap noted in [`sect-faction-identities.md`](sect-faction-identities.md) · [`cursor/qc-density-org-stubs-ae81`](../../) |
| **Updated** | 2026-07-31 |

**Type taxonomy:** [`jianghu-organization-types.md`](jianghu-organization-types.md) — tribes ≠ sects  
**Lore basin:** [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) · **Zone:** [`dustbone-living-board.md`](dustbone-living-board.md)

## Intent

Flesh **why** Sunscar, Dune Riders (Miraj), and Ashen Priests sit at the Tribunal table — blood unity, coping strategies after the Third Cascade, **not** sect-style mass recruitment. Player interacts via **contracts, trade, oaths** — not outer-disciple ladder ([`qc-sect-join-ladder.md`](qc-sect-join-ladder.md)).

## Design notes

### Tribunal ≠ sect

| | **Tribunal seat** | **Lesser sect** | **Great sect branch** |
|--|-------------------|-----------------|------------------------|
| Bond | Blood + survival pact | Dao + hall | Lineage + mountain |
| Unity | High | Medium | Low (factions) |
| Recruit | Born / rare adoption | Open trial | Root exam |
| Scale | Camp + caravan | City hall | Regional |

Three tribes **do not fight to rule Threshold** — concentration risks Fourth Cascade ([`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md)).

### What exists today (code audit)

| Tribe | Role | NPC | Mechanics |
|-------|------|-----|-------------|
| **Sunscar** | Warrior | Chief Rakhul | War lean; Sunscar Burst pill fame |
| **Dune Riders (Miraj)** | Merchant caravan | Elder Miraj | Qi Pill + Driftburst volume |
| **Ashen Priests** | Rites / decay | Seer Asha | Marrowfall; dense rites |

**Gap:** why ash? why sunscar? what broke before the Treaty? — **fill below.**

### Culture slots (owner fill)

#### Sunscar

| Field | TBD |
|-------|-----|
| **Origin wound** | |
| **Sacred thing** | |
| **Relation to Ironscar quarry** | Place ≠ tribe — tribe claims warrior ethos, not the pit |
| **Spine / deterrence** | |
| **Player contract types** | Escort, raid, honor duel |

#### Dune Riders (Miraj)

| Field | TBD |
|-------|-----|
| **Origin wound** | |
| **Caravan law** | |
| **Redwell relationship** | Water-stop history → [`redwell-starter-city.md`](redwell-starter-city.md) |
| **Player contract types** | Caravan guard, medicine run |

#### Ashen Priests

| Field | TBD |
|-------|-----|
| **Origin wound** | |
| **Return-to-Dust rites** | Speech vs formal Law of Dust |
| **Cave fiction** | Bonehollow tie — [`explore-field-gathering.md`](explore-field-gathering.md) |
| **Player contract types** | Rite escort, marrow haul |

## Prerequisites

- [ ] Owner myth pass per tribe
- [ ] Cross-link pill fame in [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md)
- [ ] Distinct from lesser sect slots in [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md)

## Open questions

- [ ] Tribal spine realm band — NS? half-step?
- [ ] Player adoption ever, or contract-only forever?
- [ ] Tribunal vote mechanics — flavor or gameplay?

## Implementation crumbs

`data.js` `ZONE_FACTION_MECHANICS.dustbone`, `factions-expand.js`, tribal locations, `npc` greets — lore drives dialogue pass later.
