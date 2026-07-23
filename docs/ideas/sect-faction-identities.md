# Sect & faction identities (world bible stub)

| Field | Value |
|-------|-------|
| **Status** | `idea` — owner pass needed before sect lineage manuals |
| **Blocked on** | Owner lore for Heartlands four + other zones |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent audit, 2026-07-23; elemental breaths [#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64) |
| **Updated** | 2026-07-23 |

## Intent

Sect **lineage cultivation manuals** need sects that feel like more than rep grinds — element, dao, culture, founder myth, and what they refuse to teach. This doc is the parking lot until each power has a one-page identity.

**Prerequisite for:** [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) sect lineage layers, [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md).

---

## What exists in code today (audit)

### Dustbone — **Sandveil Tribunal** *(richest zone)*

| Piece | In game? |
|-------|----------|
| Structure | Three tribes — Sunscar (warrior), Dune Riders (merchant), Ashen Priests (mystic) |
| Politics | Exclusive allied patrons; Grand Sandveil Treaty; incite tribal war |
| Locations | Sunscar camp, Ashen shrine, bone crossroads, miraj waystation |
| NPCs | Chief Rakhul, Elder Miraj, Seer Asha — one-line greets |
| Mechanics | Broker peace, omen pacts, caravan quests |

**Gap:** Owner backstory for Tribunal may live outside repo or in chat — **not yet in `docs/ideas/`**. Worth writing down before it drifts. Tribes have **roles** but thin **myth** (why ash? why sunscar? what broke before the Tribunal?).

### Heartlands — **Four Powerhouse Sects** *(thinnest — priority)*

| Sect | One-line in data | Relationship sketch |
|------|------------------|---------------------|
| **Celestial Sword** | Blade-first, duels | Allies Lotus; rivals Phoenix |
| **Jade Lotus** | Trade, politics, silk | Allies Sword + Void; rivals Phoenix |
| **Void Temple** | Pre-heaven knowledge, sealed sites | Allies Lotus; rivals Phoenix |
| **Golden Phoenix** | Expansionist, absorb Lotus | Rivals all three; alignment cost |

Each has: one NPC, one generic quest, one sect pact, combat/dao/market perk. **No** cultivation identity, founder, sacred art name, or why they're different from each other beyond stat perks.

### Other zones *(stubs)*

| Zone | Powers | Depth |
|------|--------|-------|
| **Jade** | Storm Dragon + Tidal Lotus | Rival-allies; sea routes; one quest each |
| **Frostbite** | Frostpeak Monastery | Isolation, cold resist, ascetic |
| **Emberwild** | Emberwild Collective | Beast tamers, primal |

---

## Identity template (fill per power)

Use one block per sect/clan/tribe. Lineage manuals hang off this.

```markdown
### [Name]

- **Vibe:** (one sentence players remember)
- **Cultivation identity:** element / dao / body / forbidden? market breath or unique lineage?
- **Sacred art:** working name for their lineage manual (e.g. Celestial Sword Cycle)
- **What they teach:** outer disciples get ___; inner court gets ___
- **What they refuse:** (e.g. Lotus won't teach blood; Void won't teach without oath)
- **Founder / wound:** one myth beat
- **Sacred site:** HQ or forbidden tie-in
- **Relationship:** allies, blood feud, imperial court
- **Player hook:** why join / why hate
```

---

## Suggested fill order

1. **Heartlands four** — most players see them; cold-war web already in data
2. **Dustbone Tribunal** — capture owner backstory in writing; deepen three tribes
3. **Jade pair** — sea identity distinct from Heartlands Lotus
4. Frostbite / Emberwild when those zones get content passes

---

## Open questions

- [ ] Imperial clan / throne — separate doc or subsection here?
- [ ] Are Heartlands sects **qi-only** lineages or mixed paths?
- [ ] Does Golden Phoenix have a **depraved** deep layer manual (evil uncapped tier)?
- [ ] Tribunal: same cultivation line across three tribes, or three different natures?

## Prerequisites

- [ ] Owner pass on Heartlands four (minimum)
- [ ] Elemental breath PR merged ([#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64))

## Implementation crumbs

- `data.js` — `FACTION_DEFINITIONS`, `FACTION_NPCS`, `WORLD_LOCATIONS` sect HQs
- `factions-expand.js` — dustbone treaty / war
- Future: `CULTIVATION_METHOD_POOL` sect `lineageId` entries per identity doc
