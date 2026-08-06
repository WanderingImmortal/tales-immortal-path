# Redwell starter city (QC home)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | Economy feel playtest |
| **Issue** | none yet |
| **Chat / PR** | `cursor/redwell-living-board-docs` · build 2026-07-28 · pamphlets `cursor/qc-pamphlet-pool` |
| **Updated** | 2026-08-06 |

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
| **Tier** | 4th ([`city-tiers.md`](city-tiers.md)) — lord mid–late FE |
| **Spawn** | **Yes** — replace `bone_crossroads` as default start |

### What Redwell offers the player (usefulness curve)

**Owner lock 2026-08-06:** Redwell is a **good enough** home for rough cultivation through QC into early FE — **not optimal**. More exists out there. You are never *kicked out*; you leave because opportunity pulls harder than the well’s comfort. Staying patiently is always allowed (diminishing returns).

#### Offer by stage

| Stage | What Redwell still gives | Feel |
|-------|--------------------------|------|
| **QC (all bands)** | Inn, jobs, bounties, bazaar QC pamphlets/pills, fields (Ironscar / Dewcatch / Bonehollow), brew, Well-Ring join, rumors | **Home.** Suitable rough cultivation. Soft, complete loop. |
| **Early FE** | Courtyard buy, local top-dog weight rising, Well-Ring peer / found own lodge, still useful fields + civic life | **Still suitable.** Best years to matter here. |
| **Mid FE** | Can be / pressure the lord seat; town politics peak; cultivation returns thin (mats, manuals, peers) | **Usefulness fades.** Comfort remains; growth slows. Natural “leave when ready” window. |
| **Late FE** (if you **take the town**) | Lord seat + skim + Well-Ring leash — local power fantasy; still a small pond | **Extended usefulness** for *civic* play, not for optimal cultivate. Buys time, not a GC path. |
| **Peak FE** | Humble grind: stack stones/fame/disciples slowly **or** chase GC opportunities elsewhere | **Diminishing returns.** Patient hermit-lord valid; ambitious leave. |
| **GC+** | Legend / wrong pond; home base optional | Overqualified. Visit, don’t live the loop. |

#### Soft offer list (what “suitable” means)

- **Shelter + clock life** — rent → FE courtyard; seats turn over; jobs dry and restock  
- **QC economy** — bazaar basics, limited pills, pamphlet pool (no FE+ shelf)  
- **Fields in a day** — grit/herbs/wilder site without Threshold  
- **Institutional foot** — Well-Ring Lodge (join) or later your own early-FE lodge  
- **Board weight** — FE can be local top dog; QC is small but at home  
- **Rough cultivate** — manuals + formations + time work here; no spirit-vein paradise  

#### What it deliberately does **not** offer

- Optimal qi land, FE+ manuals on the shelf, tribe Burst/Marrowfall as daily stock  
- Great-sect lineage, GC peers on the street, Heartlands patronage as a QC lifestyle  
- A forced exile — no script that boots you at mid FE  

#### Why you leave (pull, not push)

| Pull | When it bites |
|------|----------------|
| Better mats / sites / mid city density | Mid FE — growth feels slow |
| Great branch / root exam fantasy | Late QC–FE ambition |
| GC opportunity (treasure, patron, mountain site, crisis) | Peak FE window — or earlier if luck hits |
| Take the town *then* get bored of the skim | Late FE local ceiling |

**Manage when:** player chooses. Mid FE = soft recommendation via thin returns + rumors of denser ponds. Late FE town-take = optional side path. Peak FE = stay humble and stack **or** seek GC. Never a hard “you must leave Redwell” gate.

#### Stay patiently (valid)

Hermit / porter / Well-Ring outer / quiet courtyard lord for decades — allowed. Reward is safety and local story, not power curve. The world should still move (seats age, caravans, rare NPC luck) so patience isn’t a frozen tutorial.

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
| `redwell_city_lord` | Thin apex — well/road fees, “keeps Redwell quiet”; graft cut from hall |
| `redwell_innkeep` | Rent / rooms (common-room can be same person) |
| `redwell_bazaar` | Basics buy/sell |
| `redwell_well_boss` | Jobs |
| `redwell_warden` | Escorts + bounty turn-ins (often the lord’s dirty hands) |

Holders have lifespan; age-out → generated successor + optional one-liner. Murder/grudge rare → vacant → successor. Story arcs ≠ seats.

### Starter-city FE lord — pattern (multi-zone friendly)

**Problem:** Redwell’s lord is the **first FE** the player learns about, lord of the spawn town, and (owner lean) **in bed with the local hall**. He must feel sharp early — without eating design budget that other starter cities will need later, and without turning every 4th-tier lord into the same guy in a different hat.

**Owner locks (2026-08-06):**

| Lock | Decision |
|------|----------|
| What reuses | **Seat role** only — `{city}_city_lord`, ~FE civic apex, thin town face |
| What does **not** reuse | Personality, graft flavor, exit story, tick — **each city different** |
| Design depth for Redwell | **One starter instance card** — not a novel; not a lifelong rival |
| Importance curve | Huge **locally at QC** → often a footnote later — **unless luck/will changes that** |
| Not | Heartlands plot key by default; immortal mentor; “every lord is the corrupt well-boss clone” |

**Familiar seat ≠ familiar person.** Future starters clone the *office*, not the Redwell man. Dustbone grit-graft lord should not feel like a Frost Gate ice-clerk or Tide Harbor dock boss.

#### Fate space — not a predictable script

Xianxia world rule (owner 2026-08-06): **opportunities are not player-only.** Seats and named faces can catch rare breaks — breakthrough, treasure, patronage, fleeing upward — or die stupid, stagnate, or age out. Will + luck, not a fixed “FE disposable” track.

**Possible outcomes for a 4th-tier lord** (examples, not a checklist every run):

| Outcome | Feel |
|---------|------|
| Age out / quiet succession | Common — seat continues, name fades |
| Wrong enemy | Common-ish seasoning — journal note |
| Stagnate forever in the well-town | Common — many do |
| Break through (e.g. FE→GC) and **leave** | Uncommon — town loses its ceiling; rumor pulse |
| Rare treasure / inheritance / formation find | Rare — power spike or theft war |
| Patron / mid-city / tribe notice | Uncommon — pulled upward or crushed |
| Player involvement | Optional — help, hinder, replace, ignore |

**Do not** script Redwell’s first lord as “must die as a footnote.” Do **seed** him as local-important with **open fate** — most runs he’ll stay small; some runs the world surprises you.

**“Chance to ascend” (parked — don’t build the full engine for Redwell v1):** any character *can* rise via opportunity or will. Needs a later world pulse / chronicle / rumor system so NPC luck isn’t fake. For now: design seats so **exit ramps exist**, don’t implement a universal opportunity sim yet. See Open questions.

**Template fields (reuse the blanks — fill differently per city):**

| Field | What to fill once per city |
|-------|----------------------------|
| Seat id | `{city}_city_lord` |
| Apex realm | ~FE / strong Peak QC (4th-tier) — *starting* ceiling, not destiny |
| Public job | Thin civic apex — fees, order, face of the town |
| Private lean | Graft / clean / merchant / martial — **city-specific** |
| Starter tick | **One** memorable habit or line |
| Fate seeds | 2–3 *possible* ramps (leave / treasure / wrong enemy / stagnate) — not a scripted campaign |

**Redwell starter instance (fill names later — structure locked):**

| Field | Lock / draft |
|-------|----------------|
| Seat | `redwell_city_lord` |
| Starting realm | **Mid–late FE** (heavier than hall master; local top dog today) |
| Public | Quiet well-town boss; capital barely knows his name |
| Private | Senior embezzlement partner with early-FE hall master; warden as dirty hands |
| Stands out because | First FE on the board; **this** town’s grit-graft flavor — not a generic lord template personality |
| Fate seeds | Stagnate in Redwell · age out · skim once too often · **rare:** break through and leave for mid city / Threshold · **rare:** Ironscar/road find |
| Do not design | Full biography, guaranteed death, immortal arc, “he can never leave FE” |

**Hall triangle (v1 locked — dirty partners):** **lord mid–late FE (senior cut + cover) ↔ hall master early FE (runs hall) ↔ warden (dirty hands)**. Real joinable hall; they embezzle together — not a shell corp. Detail: [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md).

**Other zones later:** same *office*, different person and lean. Don’t invent a new lord *system* per starter — don’t clone Redwell’s conspiracy either.

### Just outside (no Threshold required)

| Site | Role |
|------|------|
| **Ironscar Quarry** | Nearest — metals/grit |
| **Dewcatch Scrub** | Herbs — day trip |
| **Bonehollow Caverns** | Wilder — optional / slightly later |

### Linked later — one corrupt fringe hall

Owner 2026-08-06: **Well-Ring Lodge** locked — dirty partners (lord mid–late FE + early-FE master + warden). ~25–40 outers. Player may found their own lodge at **early FE** (Peak FE expands) — soft cut/squeeze first, not instant war. Design: [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md) · [`player-organization-paths.md`](player-organization-paths.md). “Redwell City Lord” fine until interactions. Not cosmic corruption.

### Explicitly not Redwell v1

NS flyovers, mid city, full tribe camps, Su wage board, dense Registry, Heartlands patronage, residence cultivate %, Taiwu-grade NPC social, multiple in-town halls.

### Success feel

> Inn → job or bounty → bazaar balm/QC pamphlet/pill → Ironscar or scrub → brew → cultivate. Join Well-Ring or stay hermit. At early FE, buy the sand-brick courtyard — still at home. By mid FE the well feels small; leave when opportunity pulls, or take the town and linger. Come back in 200 years — new innkeep, same seat. Still nobody in Threshold.

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

- Exact pamphlet pool list / names (content pass) — mostly shipped
- Innkeep starting name flavor
- Mid-city caravan restock timing numbers
- Thin Registry desk in Redwell — yes/no for v1 UI
- City lord starter name + one memorable tick
- Hall name / master name
- How far to push NPC “chance to ascend” pulses before a real opportunity engine exists (parked)

## Implementation crumbs

`data.js` `WORLD_LOCATIONS` / `ZONE_MAP_LAYOUT`, `core.js` / `main.js` spawn, `qc-depth.js` lodge/dwelling, market/shop tables, `world-clock` monthly flush, seat state on `G`, field sites from [`explore-field-gathering.md`](explore-field-gathering.md).
