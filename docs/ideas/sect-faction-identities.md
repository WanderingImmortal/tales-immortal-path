# Sect & faction identities (world bible stub)

| Field | Value |
|-------|-------|
| **Status** | `designed` — Heartlands four have identity docs (separate PRs) |
| **Blocked on** | Lineage manual implementation per sect |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent audit, 2026-07-23; elemental breaths [#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64) |
| **Updated** | 2026-07-23 |

## Intent

Sect **lineage cultivation manuals** need sects that feel like more than rep grinds — element, dao, culture, founder myth, and what they refuse to teach. This doc is the parking lot until each power has a one-page identity.

**Prerequisite for:** [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) sect lineage layers, [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md).

### Design principle — great powers are not job titles (owner 2026-07-23)

Sects and noble clans are **institutions** — mountains, bloodlines, cultivation lines, immortals in the vault. Economic and political **leans** are where they’re hardest to beat, not a one-line class archetype.

| Layer | Identity first | Lean second |
|-------|----------------|-------------|
| **Great sect** | Dao, founder wound, sacred art, homeland array | What they’re also good at (trade, archives, charter law) |
| **Noble clan** | Blood, marriage, centuries, cadet branches | Strongest revenue / influence lane |
| **Longcheng presence** | Satellite office or compound | One visible slice — not the whole org chart |

Fill identities using the template below; **do not** reduce a sect to “the trade faction” or a clan to “the bureaucracy clan.”

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
| **Celestial Sword** | Sword Dao, aloof masters | Allies Lotus; rivals Phoenix | → [`celestial-sword-sect.md`](celestial-sword-sect.md) |
| **Jade Lotus** | Trade, politics, silk | Allies Sword + Void; rivals Phoenix | → [`jade-lotus-sect.md`](jade-lotus-sect.md) |
| **Void Temple** | Pre-heaven knowledge, sealed sites | Allies Lotus; rivals Phoenix | → [`void-temple-sect.md`](void-temple-sect.md) *(PR #66)* |
| **Golden Phoenix** | Expansionist, absorb Lotus | Rivals all three; alignment cost | → [`golden-phoenix-sect.md`](golden-phoenix-sect.md) *(PR #67)* |

Each has: one NPC, one generic quest, one sect pact, combat/dao/market perk. **Identity docs** add cultivation spine, leadership, and lineage sketches.

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

- **Vibe:** (one sentence — the *sect/clan*, not their day job)
- **Cultivation identity:** element / dao / body / forbidden? lineage manual name?
- **What makes them a great power:** mountain, array, immortals, founder myth
- **Primary lean:** where they’re hardest to compete with economically or politically *(not exclusive)*
- **Also has hands in:** (2–4 other pies — marriage, trade, archives, mercenaries…)
- **Longcheng footprint:** one office/compound slice if applicable
- **What they teach / refuse:** outer vs inner court
- **Relationship:** allies, blood feud, imperial court
- **Player hook:** why join / why hate
```

---

## Suggested fill order

1. **Imperial clan** — [`imperial-clan.md`](imperial-clan.md) *(continental anchor)*
2. **Heartlands four** — [`celestial-sword-sect.md`](celestial-sword-sect.md) ✓ · [`jade-lotus-sect.md`](jade-lotus-sect.md) ✓ · [`void-temple-sect.md`](void-temple-sect.md) ✓ · [`golden-phoenix-sect.md`](golden-phoenix-sect.md) ✓ *(merge PRs)*
3. **Dustbone Tribunal** — capture owner backstory; deepen three tribes
4. Jade / Frostbite / Emberwild when those zones get content passes

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
