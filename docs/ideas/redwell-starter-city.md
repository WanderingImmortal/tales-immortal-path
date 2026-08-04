# Redwell starter city (QC home)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | Economy feel playtest |
| **Issue** | none yet |
| **Chat / PR** | `cursor/redwell-living-board-docs` · build 2026-07-28 · pamphlets `cursor/qc-pamphlet-pool` |
| **Updated** | 2026-08-04 |

**Zone vision:** [`dustbone-living-board.md`](dustbone-living-board.md)  
**Hub:** [`dustbone-starter-gameplay.md`](dustbone-starter-gameplay.md)  
**Related:** [`personal-residence.md`](personal-residence.md) · [`explore-field-gathering.md`](explore-field-gathering.md) · [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md) · [`work-and-professions.md`](work-and-professions.md) · [`commerce-and-markets.md`](commerce-and-markets.md)

## Intent

**Redwell** is Dustbone’s **4th-tier starter city** — where new games spawn and QC life actually happens. Threshold is the capital you visit later and feel small in. Neighbor in Redwell; nobody in Threshold.

## Design notes

### Identity

| Field | Lock |
|-------|------|
| **Display** | Redwell |
| **Data id** | `redwell` (suggested) |
| **Type** | City |
| **Tier** | 4th ([`city-tiers.md`](city-tiers.md)) — lord ~FE / strong Peak QC |
| **Spawn** | **Yes** — replace `bone_crossroads` as default start |

### Origin

After the **Third Cascade**, people who wanted walls and wages — but not another life on the pin — clustered at a Dune Rider water-stop in the **Second red sand layer**, days from Threshold. **Third-dynasty extraction crews** (not later tomb-scavengers) had chewed nearby ridges; those scars + iron-grit sand are **Ironscar** (quarry place + mats — **not** a tribe; **Sunscar** is the tribe). The well held; grit trade held. Local rule: **no towers, no dense Registry core, no second Threshold**. Sandveil counts it 4th-tier; capital barely notices.

**Registry** = Threshold pin/census/building-cap bureaucracy. Redwell may have a thin desk — not a capital-style admin pile.

### In town — v1 loops

#### Bazaar (basics only)

| Sells | v1 |
|-------|-----|
| Staples | Food/water kits, crude tools, travel basics |
| Medicine | Healing balms (mortal-grade) |
| Pills | Qi Restore Pills (limited stock) — not tribe Burst/Marrowfall |
| Manuals | **QC-realm techniques only** — see stock rules |
| Not sold | FE+ techniques, rare gear, tribe specialties, formation books, luxuries |

#### Bazaar stock

| Rule | v1 |
|------|-----|
| Run out? | **Yes** — finite shelf |
| Staples / balms / Qi pills | Small counts; **restock monthly** (same calendar as rent/jobs) |
| QC manuals | **Pool** of QC pamphlets; shelf shows **2–3 slots**; **rare** restock (seasonal / mid-city caravan) **redraws** from pool (prefer not-owned). Same forever SKUs = dead UI |
| Already own draw? | Reroll / skip / mark owned — don’t force dead buys |
| Staple catalog | Mostly fixed; thin caravan extras optional later |
| Sell-to-bazaar | Separate loop; demand can dry like jobs |

#### Redwell Inn (rent)

Plain timber-and-adobe rooms over the common hall. Rent room → home screen (rest / Rest here). Monthly **low** stones. Homeless = local rest penalty.

#### Tavern / common room

**Same building** as Inn (downstairs). Drink/loiter → rumor line. **Bounty board:** low postings (grit thieves, road cutters, debt-skippers) — QC–early FE; pay **under** a fat job month.

#### Courtyard buy (FE only)

**Gate:** Foundation Establishment. One plot. Benefits **while in Redwell only**.

**Look:** sand-brick yard on quiet edge, half-dead shade tree, one-room hall, reagent lean-to, cistern on town well. No towers, no spirit well.

**Cost (provisional):** ~1–2 years solid Redwell wages → draft **~80–150 mid**. Small upkeep.

**Does:** owned rest / safe place to cultivate (no rent); ~12-slot reagent chest; soft “settled” fiction.

**Does not:** **cultivate speed** (only **manuals + formations** buff speed in this game); formation slots on this yard; hires; sect HQ; worldwide shield. Fancier material homes later — not now.

#### Jobs

Well attendant, grit/loader, short escort, sweeper/marker, maybe letter copyist. Fat jobs **dry up**. No Merchant Su as Redwell daily wage.

### Civic seats (named faces)

| Seat | Owns |
|------|------|
| `redwell_innkeep` | Rent / rooms (common-room can be same person) |
| `redwell_bazaar` | Basics buy/sell |
| `redwell_well_boss` | Jobs |
| `redwell_warden` | Escorts + bounty turn-ins |

Holders have lifespan; age-out → generated successor + optional one-liner. Murder/grudge rare → vacant → successor. Story arcs ≠ seats.

### Just outside (no Threshold required)

| Site | Role |
|------|------|
| **Ironscar Quarry** | Nearest — metals/grit |
| **Dewcatch Scrub** | Herbs — day trip |
| **Bonehollow Caverns** | Wilder — optional / slightly later |

### Explicitly not Redwell v1

NS flyovers, mid city, full tribe camps, Su wage board, dense Registry, Heartlands patronage, residence cultivate %, Taiwu-grade NPC social.

### Success feel

> Inn → job or bounty → bazaar balm/QC pamphlet/pill → Ironscar or scrub → brew → cultivate. At FE, buy the sand-brick courtyard. Come back in 200 years — new innkeep, same seat. Still nobody in Threshold.

## Suggested build chunks (implementable)

1. `WORLD_LOCATIONS.redwell` + map node + **spawn default** here; Threshold remains capital node  
2. Redwell Inn rent + FE courtyard buy (no cultivate %)  
3. Bazaar shelf + monthly consumable restock + QC manual **pool draw**  
4. Jobs + dry-up; common-room rumors + low bounty board  
5. Seat holders (generate + succession)  
6. Wire Ironscar + Dewcatch as day trips from Redwell  

**Parallel content (other agent):** expand **QC technique/pamphlet pool** so bazaar draws have variety — see Open questions / manuals framework.

## Prerequisites

- [x] Owner design lock (this doc)
- [x] Location + spawn (`redwell` default)
- [x] Inn rent + FE courtyard + jobs + bazaar stock + seats (thin)
- [x] QC pamphlet pool v1 ([`qc-technique-pamphlet-pool.md`](qc-technique-pamphlet-pool.md))
- [ ] Economy feel playtest

## Open questions

- Exact pamphlet pool list / names (content pass)
- Innkeep starting name flavor
- Mid-city caravan restock timing numbers
- Thin Registry desk in Redwell — yes/no for v1 UI

## Implementation crumbs

`data.js` `WORLD_LOCATIONS` / `ZONE_MAP_LAYOUT`, `core.js` / `main.js` spawn, `qc-depth.js` lodge/dwelling, market/shop tables, `world-clock` monthly flush, seat state on `G`, field sites from [`explore-field-gathering.md`](explore-field-gathering.md).
