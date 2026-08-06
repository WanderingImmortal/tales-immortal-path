# Jianghu organization types (sects · clans · tribes · guilds)

| Field | Value |
|-------|-------|
| **Status** | `designed` (taxonomy — design specific orgs against this) |
| **Blocked on** | none for taxonomy; Dustbone sect identities blocked on owner pass |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-07-31 · [`cursor/qc-density-org-stubs-ae81`](../../) |
| **Updated** | 2026-07-31 |

**Sister:** [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) (realm ladder / who can fight whom) · [`sect-faction-identities.md`](sect-faction-identities.md) (named powers) · [`city-tiers.md`](city-tiers.md) (civic ladder)

## Intent

One grid for **what kind of organization something is** — not every power is a sect. Sects, blood-bound groups, and civic guilds differ in **unity**, **recruitment**, **organizational ceiling**, and **how far influence extends**. Apex cultivators at the top can offset a low ceiling; they cannot turn a tribe into a continent-spanning bureaucracy.

**Design order:** lock this taxonomy **before** writing Dustbone lesser sects or fleshing tribes — specific orgs slot into type + scale columns.

## Design notes

### Two axes (don't conflate)

| Axis | Answers | Example |
|------|---------|---------|
| **Apex power** | Strongest individual / hidden card | VR patriarch, tribal spine elder, GC city lord |
| **Organizational strength** | How far the *institution* projects — headcount, logistics, arrays, branches, treasury | Great sect deploys hundreds; local hall deploys dozens |

A **blood tribe** may have one NS spine and still only field **tribal war-bands** across the dunes — unity high, reach limited. A **great sect** may have VR patriarch *and* NS mission elders in twelve cities — unity low day-to-day, reach enormous when mobilized.

Realm pyramid lives in [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md). This doc is **institution shape**.

### Organization types

| Type | Bond | Typical unity | Recruitment | Organizational ceiling (lean) | Player join at QC? |
|------|------|---------------|-------------|--------------------------------|---------------------|
| **Great sect** | Dao + lineage + mountain | Low — factions until external threat | Mass outer court; **root exams** | Continental branches, arrays, archives | Branch trial only; often rejected |
| **Lesser sect / hall** | Local dao + survival | Medium — petty politics, one boss | Open-ish; low bar | One city + nearby wilds | **Yes** — QC foot in door |
| **School / dojo** | Teacher–student | Medium-high | Paid / referred | Courtyard scale | Yes (FE lean; QC pamphlet tier) |
| **Guild** | Craft charter | High for standards, low for politics | Exam + register | Zone branches; hire roster | Craft path, not cultivation ladder |
| **Clan / house** | Blood + marriage | **High** — family shame is real | Born or marry in | Cadet branches; rarely mass recruit | Rare; mostly rep / marriage fiction |
| **Tribe** | Blood + land + rite | **High** — shared survival | Born; ritual adoption rare | Camp + caravan scale; **not** sect headcount | Contracts / oaths, not outer court |
| **Civic seat** | Office + law | N/A (institutional) | Appointed / inherited seat | City garrison, wells, registry | Jobs, bounties, conscription |

**Rule:** tribes / clans / houses are **not** “weak sects.” They are **different social machines**.

### Unity vs faction (owner lock 2026-07-31)

| | **Sect / institution** | **Clan / tribe / house** |
|--|------------------------|---------------------------|
| **Glue** | Shared dao, merit, resources | Blood, ancestor, land |
| **Day-to-day** | Factions, elders, succession fights | Family elders; outward face united |
| **Crisis** | Often unites only under existential threat | Already united; may lack scale to answer threat alone |
| **Weakness** | Coups, doctrine splits, face wars | Small numbers; revenge cycles; blood feuds |
| **Strength** | Deploy many of varied talent | Trust, sacrifice, secrets stay inside |

Sandveil Tribunal tribes = **high unity, camp-scale deployment**, spine deterrence — not mass disciple recruitment. See [`sandveil-tribunal-cultures.md`](sandveil-tribunal-cultures.md).

### Organizational strength tiers (draft)

Use for **influence reach** and **event conscription pool** — not 1:1 with realm.

| Tier | Label | Deploy (fiction) | Examples |
|------|-------|------------------|----------|
| **O** | Outpost | Squad – platoon | Redwell warden guard, well crew |
| **I** | Local | Company – few hundred | Lesser sect hall, clan compound |
| **II** | Regional | Thousands + logistics | Mid-city garrison, strong lesser sect |
| **III** | Basin | Army + arrays | Great sect branch, Threshold coalition |
| **IV** | Hegemon | Multi-zone mobilization | Heartlands great sect, imperial clan |

**Apex offset:** Tier I org + NS spine ≈ can **punch** at Tier III in one battle; cannot **hold** Tier III territory without collapsing logistics.

### Recruitment spectrum

```text
Born into blood ──────────────────────────────► Open enrollment
     tribe/clan          house cadet        lesser sect        great sect branch
                                              (low bar)         (root exam)
```

QC player sweet spot: **lesser sect / hall**, guild register, tribal **contract** (not disciple), civic **conscription**.

### Great sect branch vs lesser sect

| | **Branch (great sect)** | **Lesser sect (local)** |
|--|-------------------------|-------------------------|
| **Bar** | Root grade + trial + age | “Can you sense qi?” / sponsor |
| **Manuals** | Lineage chapters (QC slice) | Crude arts, one signature |
| **Politics** | Inner factions you don't see yet | Petty rival outer disciples |
| **Failure** | Settle for lesser or wander | Porter, mercenary, hermit |
| **Aspiration** | Re-apply after root ascension / Peak QC | Transfer up if rep + talent |

Root checks: [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md). Join ladder detail: [`qc-sect-join-ladder.md`](qc-sect-join-ladder.md).

### Guilds vs sects

Creation-path **guilds** (alchemy, forging, formations) = **charter institutions**. Teach a **craft**, not a cultivation lineage. Dustbone alchemy branch at Threshold — exams, recipe stamp — not “join Alchemy Sect as outer disciple.” See [`creation-path-guilds.md`](creation-path-guilds.md).

### Cities vs orgs

[`city-tiers.md`](city-tiers.md): civic apex (lord realm) ≠ sect depth. Threshold is **1st-tier civic** + **Tribunal truce** — not “the sect city.” Redwell is **4th-tier** — room for **Tier I** lesser sects, not great powers.

## Identity template (per organization)

```markdown
### [Name]

- **Type:** great sect · lesser sect · school · guild · clan · tribe · civic
- **Org tier (I–IV):** deployment / influence reach
- **Apex (realm):** public face + hidden card
- **Unity:** high blood · medium hall · low factional sect
- **Recruitment:** …
- **Sphere:** where they actually matter on the map
- **Player hook (QC):** join · contract · exam · enemy
```

## Prerequisites

- [x] Owner direction: sect ≠ tribe; unity vs factions; org ceiling vs apex
- [ ] Flesh [`sandveil-tribunal-cultures.md`](sandveil-tribunal-cultures.md) (tribe myth gap)
- [ ] Design 2–3 entries in [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md)
- [ ] Map org tiers to world events ([`world-events-layered-battlefield.md`](world-events-layered-battlefield.md))

## Open questions

- [ ] Exact deploy numbers per tier — fiction only or sim hooks later?
- [ ] Can player found org type at FE (school) vs GC (sect) — [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)
- [ ] Clan playable path or NPC-only for v1?

## Implementation crumbs

`factions-expand.js`, `sect.js`, `data.js` `ZONE_FACTION_MECHANICS`, future `G.membership` / org type enum — **docs only until Issues**.
