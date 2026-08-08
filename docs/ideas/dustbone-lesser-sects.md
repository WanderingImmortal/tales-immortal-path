# Dustbone lesser sects (design slots)

| Field | Value |
|-------|-------|
| **Status** | `building` (Well-Ring v1 in code) |
| **Blocked on** | Play through; loyalty parked |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-07-31 · owner lean 2026-08-06 corrupt civic hall + FE lord spine · `cursor/redwell-corrupt-hall-design` |
| **Updated** | 2026-08-06 |

**Not:** Sandveil tribes ([`sandveil-tribunal-cultures.md`](sandveil-tribunal-cultures.md)) · great sect branches (Heartlands docs) · guilds ([`creation-path-guilds.md`](creation-path-guilds.md))

**Taxonomy:** [`jianghu-organization-types.md`](jianghu-organization-types.md) · **Join ladder:** [`qc-sect-join-ladder.md`](qc-sect-join-ladder.md) · **Town:** [`redwell-starter-city.md`](redwell-starter-city.md)

## Intent

**Tier I** cultivation halls in Dustbone — where inferior-root QC cultivators actually land. Weaker standards, smaller manuals, local rivals — **foot in the jianghu** without great sect lineage.

**v1 owner lock (2026-08-06):** ship **one** hall in the Redwell band. Mid-city / quarry halls wait. Playtest polish is deferred — prefer full runs for data unless something game-breaking.

## Owner locks (2026-08-06)

| Lock | Decision |
|------|----------|
| How many halls in Redwell v1? | **One** |
| Where? | Redwell fringe / in-town compound — not a second downtown sect war |
| Civic tie? | **Yes** — hall is entangled with town power through **graft**, not clean vassalage |
| Public face | Respectable local cultivation hall — “helps the road / well / escorts” |
| Private glue | Shady deals, kickbacks, look-aways — **city lord takes the cut** |
| Graft spine | **Lord ↔ hall master ↔ warden** — **dirty partners** (locked), not shell corp |
| Hall ownership | Real lesser hall with its **own** master; lord takes a cut + cover |
| Realm weight | **Lord = mid–late FE** · **Hall master = early FE** · warden below both (QC–Peak QC lean) |
| Cosmic corruption track? | **No** — municipal graft / jianghu dirt, not cycle-stain ([`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md)) |
| City lord design depth | Seat + starter instance; **office** reuses, **person** does not; open fate (not scripted footnote) — [`redwell-starter-city.md`](redwell-starter-city.md) |
| Hall name | **Well-Ring Lodge** (locked) |
| Disciples (fiction) | ~25–40 outer QC · ~3–6 inner (late QC / early FE) · master + steward — **low** Tier I, fits a well-town |
| Player founds own hall? | Gate **early FE** (same as world lodges) — [`player-organization-paths.md`](player-organization-paths.md); Peak FE = expand. Soft pressure first in Redwell — not instant open war |
| Slot B (quarry hall) | **Deferred** — optional later as Ironscar-edge camp/dojo, not v1 |
| Slot C (mid city) | **Deferred** until mid city exists |

## Design notes

### Slot A — Well-Ring Lodge (Redwell v1)

Named for the well’s sand-brick ring — civic and dull on purpose (the people who “guard” it).

| Field | Lock / draft |
|-------|----------------|
| **Display name** | Well-Ring Lodge |
| **Data id** | `well_ring_lodge` |
| **Type** | Lesser sect / hall · **Org tier I** (small end) |
| **Where** | Fringe compound near the well / road gate — not a mountain |
| **Apex** | Early FE hall master (own person) · lord mid–late FE senior partner · no hidden NS |
| **Public stand for** | Keep Redwell’s well and road quiet; train local youth so grit thieves don’t own the night; honest breath, honest wages |
| **Actually stand for** | Shared skim of well/road/escort money; monopoly on “respectable” QC muscle in town; stay useful enough that nobody asks hard questions |
| **Practice** | Crude earth/water Dustbone circulation — well-draw breath, road grit, loader stamina. Closest bazaar cousins: Redwell Well Breath, Ironscar Loader’s Cycle, Saltbrush Road Breath. **One hall manual** not on the bazaar shelf (slightly better gather/stability — still common-grade trash by Heartlands standards) |
| **Combat lean** | Street practical — Well-Road Guard vibe, grit palms; not sword lineage |
| **Point (design)** | QC join ladder + town density: missions, rival, obligations, dirty choices — **sits on top of** job → field → brew → cultivate, does not replace it |
| **Recruitment** | **Stone “registration” fee** (crooked sash deposit) — no trial required; later reads as a scam |
| **Rival** | One named outer who climbs on merit *(name TBD — see faces)* |
| **Scheme?** | **Yes — in the shadows by default.** Public: helpful lodge. Private: ledger with the lord. They open blades only when cornered (open war risks exposing the partnership). |

#### Headcount (fiction vs what the game needs)

| Layer | Fiction | What player needs in v1 |
|-------|---------|-------------------------|
| Outer disciples | ~25–40 QC (porters, escorts, well kids) | Ambient lines + mission pool; not 40 simulated NPCs |
| Inner / core | ~3–6 late QC / early FE | Master + optional steward face; rival is usually outer climbing |
| Master | Early FE | Named seat when interactions ship |
| Total feel | Small company — “everyone knows everyone” | Ranking day / muster pulse once a year |

Not hundreds. Not a great-sect outer court. If Redwell feels like a sect city, the hall is too big.

#### What the player **sees** (QC city life)

| Surface | Looks like |
|---------|------------|
| Map / town | Lodge compound on the fringe — train yard, sand-brick hall, cistern |
| Rumors | “Well-Ring keeps the road quiet” · rare sour line about escorts that never find the bandits |
| Bazaar / jobs | Hall disciples take fat escort slots first when you’re an outsider |
| Join | Pay registration stones → outer sash → missions |
| Inside | Merit from missions; monthly board rank; yearly promotion tournament; sometimes an ugly errand |
| Manual | Hall pamphlet after merit gate — not free day one; slightly better than bazaar |
| Rival | Same merit climb; shows on monthly board |
| Refuse join | Town still works; you just hit the soft ceiling of outsider treatment |

#### How it impacts city life (even if you never join)

| Loop | Impact |
|------|--------|
| Jobs | Soft preference for lodge affiliates on escorts / grit runs |
| Bounties | Warden board sometimes “already handled” — hall took the purse |
| Fields | Hall parties on Ironscar/Dewcatch — competition flavor, not a hard lockout |
| Rumors / clock | Occasional pulse: ranking day, road quiet, sour embezzlement whisper |
| FE courtyard | You’re a settled neighbor — politics get closer; still not automatic conspiracy membership |
| Threshold visit later | Lodge name means nothing there — correct small-pond feel |

**Does not** gate cultivate, brew, or rent. Hermit / porter path stays valid.

#### Well-Ring v1 — playable slice (sketch for build)

**Goal:** spice for ~QC decades — stone-fee join (scam beat later), missions, merit board, yearly tournament, one hall manual, light dirty choices. **Not** full conspiracy sim, city-lord dialogue, or player founding.

##### Tackle order

1. Lock join / merit / manual / names *(this pass)*  
2. Owner confirm remaining picks  
3. **Implement** thin membership + missions on Redwell (reuse jobs/bounty UX)  
4. Later: graft reveals, lord interactions, player founding pressure  

##### What the player sees in town

| Surface | v1 |
|---------|-----|
| **Entry** | Button / panel at Redwell: **Well-Ring Lodge** (same hub family as Jobs / Bounty / Lodge) |
| **Outside (not member)** | Short blurb + **Pay registration** (stone fee) — sold as sash / outer roll fee |
| **Inside (member)** | Merit, monthly outer board, mission list, yearly tournament, claim hall manual when gated, leave lodge |
| **Map node** | Optional later — v1 can be town panel only |
| **Rumors** | 2–3 Well-Ring lines; later a sour “registration fee never comes back” whisper |

##### Join — stone fee (crooked, no trial)

**Owner lean 2026-08-06:** No trial / no time gate to join. Pay **stones** for an outer sash. Day one feels normal. Later it recontextualizes as **they scammed you**.

| Step | v1 |
|------|-----|
| Gate | At Redwell, any QC (Early ok) |
| Cost | Registration / sash fee — e.g. **~25–40 stones** (tune: ~1–2 fat job months) |
| Fiction (day one) | “Outer roll fee. Keeps the lodge in grit and ink.” |
| Fiction (later) | Fee never returned; feeds the lord–master skim |
| Result | `G.affiliation = { factionId: 'well_ring_lodge', rank: 'outer', merit: 0 }` |
| Refund? | **Never** |
| Leave + rejoin | Rejoin pays again (or harsher) |

##### Faces (name options — pick)

| Role | Options | Notes |
|------|---------|-------|
| Hall master (early FE) | **Master Liang** · **Master Qiao** · **Master Ren** · **Lodge Master Wen** | Avoid “Helan” (reads as Helen). Ren = ironic “benevolence” |
| Rival outer | **Wei Shun** · **Outer Wei** · **Yan Qiu** · **Lu Ping** | Merit climber on the monthly board |
| City lord | “Redwell City Lord” | No dialogue v1 |

**Locked:** Master **Liang** + rival **Wei Shun**.

**Name notes (for non-speakers):** ordinary surname + given-name combos — not secret lore codes. Rough sense only:

| Name | Feel |
|------|------|
| **Liang** (梁) | Common surname; also “beam/bridge” — solid, civic, fits a dull well-town master |
| **Wei** (魏/卫 etc.) | Common surname sound |
| **Shun** (顺) | Given name vibe — “smooth / go along” — mild irony for a climber who goes along with the skim |

##### Merit (v1) · Loyalty (**parked**)

**Owner lock 2026-08-06:** Well-Ring ships with **one public meter = merit**. Full **loyalty** as a second bar is **parked** — come back for larger / shady sects with factions.

| Track | Well-Ring v1 | Later (parked) |
|-------|--------------|----------------|
| **Merit** | Missions, monthly board, tournament, manual gate | Same idea — contributions |
| **Loyalty / trust (corrupt wing)** | **Parked** as a full system. Optional tiny hidden flag only if dirty-pouch / scam recontext needs it at implement time — not a player-facing bar | Visible loyalty for faction elders / evil-shady wings |

Dirty jobs in v1: pay **more merit** (and stones). Refuse dirty: keep sash, small merit hit or master note. Snitch / expose-lord content stays out of v1.

##### Merit, monthly board, yearly tournament

| Piece | v1 |
|-------|-----|
| **Merit** | From missions (dirty pays more). Drives board rank |
| **Monthly board** | Outers ordered by merit (player + rival + 2–3 fake names). Small panel / log |
| **Yearly promotion tournament** | Once/year: months + log, light risk. High merit seeds better; winner gets merit burst + “inner nod” flavor (not full inner rank sim) |
| **Rival** | Always on the board; sometimes snipes mission flavor |

**Obligations (light):** long idle → merit decay. Very gone → sash revoked (rejoin = pay again).

##### Missions (3–5 types)

Months like jobs. Stones + **merit**.

| Id | Name | Months | Clean/dirty | Payoff |
|----|------|--------|-------------|--------|
| `wr_road_escort` | Road Quiet Escort | 2–3 | Clean | Stones + merit |
| `wr_well_muster` | Well Muster Duty | 1 | Clean | Low stones + merit |
| `wr_scrub_cull` | Scrub Cull | 2 | Clean (risk) | Stones + merit |
| `wr_grit_run` | Grit Crate Run | 2 | Clean | Stones + merit |
| `wr_sealed_pouch` | Sealed Pouch Errand | 1–2 | **Dirty** | Extra stones + merit |

##### Hall manual — slightly better than bazaar

| Field | Lock |
|-------|------|
| Name | **Well-Ring Quiet Breath** (`well_ring_quiet_breath`) |
| Origin | **Master’s patched notebook** (locked) — years refining bazaar breath into a lodge syllabus |
| Grade | Common, QC — **noticeably better** than bazaar pamphlets; **not** crazy (early FE ceiling) |
| Unlock | Member + merit gate (or after one ranking year) |
| Shelf | **Not** on Redwell bazaar |
| Extra scam (optional) | Small “manual courtesy” stones to claim the copy |

##### Dirty visibility (v1 lean)

- Join fee feels normal at first; **recontextualizes** later (rumor / master slip / after sealed pouch).  
- First missions stay clean.  
- Sealed pouch after a bit of merit **or** low rate in pool.  
- Refuse dirty → keep sash, merit hit, master notes it.  
- **No** expose-the-lord quest in v1.

##### Soft outsider tax (even if never join) — optional v1

- Escort job pay slightly worse / dries faster for non-members — **nice if cheap**; skip if it fights job code.  
- Rumor lines alone are enough for v1 minimum.

##### Explicitly **not** v1

- City lord conversations / take the town  
- Full graft ledger UI  
- Player founding a rival hall  
- Inner rank / FE promotion track  
- Housing inside the lodge  
- 40 simulated disciples  

##### Success feel

> Pay the sash fee (feels normal) → missions between cultivate → merit ticks the monthly board against Wei Shun → yearly tournament → earn Quiet Breath → sealed pouch someday → *oh, the registration fee was the first scam.* Hermit path still fine.

#### Player opens their own school / hall in Redwell

**Owner lock 2026-08-06:** Player founding gate matches the world — **early FE** can found a small lodge/hall (Well-Ring’s weight class). **Peak FE** expands cap/renown — not the first time you’re allowed to exist. See [`player-organization-paths.md`](player-organization-paths.md).

QC join era stays earlier; founding is still **after** you break into FE.

| Reaction | Lean |
|----------|------|
| Immediate open war? | **No** — shadows first; open war is loud and risks the lord’s cover |
| Immediate notice? | **Yes** — lord + Well-Ring both care; this is their pond |
| Soft ire | Charter fee / “road contribution” (pay the cut) · warden shakedown · rumor smear · disciple poaching attempts · dry preferential jobs |
| Hard ire | Refuse the cut **or** steal their outers **or** expose the skim → escalate (sabotage, framed bounty, hall duel pressure) |
| Buy peace | Pay / share a skim / stay tiny (dojo, not rival hall) · or leave Redwell and found elsewhere |
| Weight | Early-FE player lodge ≈ peer to Well-Ring **master**; still under mid–late FE **lord** |
| Lord vs lodge | Usually **aligned** against a new rival; rare split if player bribes one side |

**Tiny teaching dojo** (a few students, no charter swagger) ≠ full hall — milder reaction. **Named hall with recruitment** = threat.

#### Conspiracy shape (v1 spine — dirty partners **locked**)

**Owner lock (2026-08-06):** peer embezzlers, not shell corp. Realm split: **lord mid–late FE** · **hall master early FE**.

| Role | Seat / person | Job in the graft |
|------|---------------|------------------|
| **Senior partner (cut + cover)** | `redwell_city_lord` — **mid–late FE** | Civic face; larger quiet share; protects the arrangement |
| **Junior partner (runs the hall)** | Hall master — **early FE**, own person | Day-to-day hall; dirty missions; “keeps the road quiet” cover |
| **Dirty hands** | `redwell_warden` — below both (QC–Peak QC lean) | Look-aways, steered bounties, padded escorts — loyal to the *deal* |

Optional seasoning: well boss job skim, bazaar fence, innkeep rumor filter.

**Not equals in town power or cultivation** — lord is heavier. **Partners in the crime** — master isn’t a sock puppet; he manages the hall and takes his cut. Public story: respectable hall + respectable lord. Private ledger: shared embezzlement.

**If lord’s fate fires** (leaves on breakthrough, dies, rare find): hall can keep running under the early-FE master (greedier, cleaner, or hunted) — open fate for both.

**Lord importance:** first FE the player learns about — **local** ceiling *today*. Open fate. Label “Redwell City Lord” fine until interactions. Detail: [`redwell-starter-city.md`](redwell-starter-city.md).

#### What “tied to the city” means in play

- Hall is **not** the city government and **not** a clean temple of civic virtue.
- Town needs the hall’s QC muscle for road trouble; hall needs the town’s cover and cash.
- Player can be **inside** (dirty missions + manual + rival) or **outside** (jobs/bounties still work; hall is ambient conspiracy).
- Exposing the graft is a **later** beat (Threshold notice / mid-city pressure / FE courtyard politics) — not required for QC join loop.

#### Explicitly not this hall

- Heavenly Demon branch cell
- Great sect outer court
- Cosmic corruption / soul-stain content
- Open war with the lord/warden while the deal holds (they’re in bed together until something breaks)

---

### Slot B — Quarry / warrior lean (deferred)

| Field | Draft |
|-------|-------|
| **Working name** | *TBD* — e.g. Sand-Scar Hall |
| **Type** | Lesser sect · **Org tier I** (or camp/dojo lean) |
| **Status** | **Parked** — not Redwell v1 |
| **Note** | Not Sunscar tribe — adjacent culture. Revisit as Ironscar-edge presence after Redwell hall ships. |

---

### Slot C — Mid city (deferred)

| Field | Draft |
|-------|-------|
| **Working name** | *TBD* |
| **Type** | Lesser sect · **Org tier I–II** |
| **Status** | **Parked** until mid city hub exists |
| **Player hook later** | First place FE feels small; GC on the street |

---

### Explicitly not these slots

- Sandveil tribes (blood, contract, not mass disciple)
- Threshold great sect branches (root exam — separate ladder)
- Alchemy / Formations guild (craft charter)

## Prerequisites

- [x] Owner lean: one Redwell hall, civic graft spine
- [x] Dirty partners locked — lord mid–late FE · hall master early FE · not shell corp
- [x] City lord = senior partner; open fate / seat pattern for other starters
- [x] Hall card drafted — name lean **Well-Ring Lodge**; headcount; practice; player-see; rival-hall pressure
- [x] Hall name **Well-Ring Lodge** locked
- [x] Player hall gate aligned — early FE found / Peak FE expand (was Peak-only)
- [x] Names locked: Master Liang + Wei Shun
- [x] Join = stone fee scam (no trial)
- [x] Manual = master’s patched notebook (better than bazaar, not crazy)
- [x] Merit = public board meter; **loyalty parked** for later factiony/shady sects
- [x] Monthly merit board + yearly tournament
- [x] Build when owner asks — membership + missions (v1 in `qc-depth.js`)

## Open questions

- [x] Confirm hall model: **dirty partners** (locked) — not shell corp
- [x] Realm split: lord mid–late FE · hall master early FE
- [x] Confirm name: **Well-Ring Lodge**
- [x] Player founding gate vs early-FE NPC master — aligned (early FE)
- [x] Join = stones, no trial (scam beat later)
- [x] Master / rival names: Liang / Wei Shun
- [x] Manual = patched notebook
- [x] Loyalty as full meter — **parked** (return for larger shady sects)
- [x] Lord name + one memorable tick — only when interactions exist; “Redwell City Lord” fine until then
  → **v1 shipped:** generated seat name as **City Lord {Name}**; thin meet / glimpse / thanks (depth later)
- [x] Refuse dirty: **keep sash + small merit hit** (locked for v1)
- [x] FE courtyard vs conspiracy — **still outsider** for v1 (no auto membership)
- [ ] Preferred *seeded* fate ramps for this lord (not a forced outcome): stagnate / leave on breakthrough / rare find / wrong enemy
- [ ] Later: world “chance to ascend” opportunity pulses for NPCs (parked — don’t block Redwell hall on this)
- [ ] Later: **loyalty** meter for factiony/shady sects (parked)

## Implementation crumbs

`data.js` faction defs, `WORLD_LOCATIONS` hall node, `story-arcs.js` mission pool, seat flags for graft standing — **after** name + spine seats locked. No build Issue yet.
