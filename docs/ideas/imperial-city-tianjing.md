# Imperial city — outer hub + inner Tianjing (design workshop)

| Field | Value |
|-------|-------|
| **Status** | `idea` — owner workshop (v3) |
| **Blocked on** | Noble clan count (7 vs 8); gray-layer design pass; phase-1 map nodes |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent workshop, 2026-07-23 |
| **Updated** | 2026-07-23 |

## Intent

Design the **continental capital** — not a single palace on a hill, but a **layered metropolis**: an open imperial hub where every power keeps a footprint, wrapped around **Tianjing** (天京), the Tian Clan's inner home grounds where the sleeping founder lies sealed.

Parent lore: [`imperial-clan.md`](imperial-clan.md). Map pattern: [`local-world-map-split.md`](local-world-map-split.md).

---

## Naming — what 京 means

**京 (jīng)** = capital / royal city / the walled seat of mandate. Not a random syllable — it specifically means *the place where heaven's authority sits*.

So **Tianjing (天京)** is not the whole metropolis. It is the **inner city** — the Tian Clan grounds, palace ring, and underpalace seal. Exactly where 京 belongs.

| Layer | Name | Who lives there |
|-------|------|-----------------|
| **Outer imperial city** | **Longcheng** (龙城) | Everyone: merchants, sect branches, associations, noble clans, petitioners |
| **Inner city** | **Tianjing** (天京) | Tian blood, court, regents, emperor's household — charter forbids sect ownership |
| **Underpalace** | (unnamed on maps) | Sleeping founder seal |

**Player-facing English:** *Longcheng* · *the Imperial City* · inner ring = *Tianjing* when you earn the name.

---

## Role on the continent

| Function | Where |
|----------|-------|
| **Greatest hub** | Outer city — trade, gossip, hiring, manuals, pills |
| **Charter seat** | Charter Hall (outer) — sect homelands licensed; edicts read |
| **Sect presence** | **Branches**, not mountains — envoys, ledger offices, blade courts |
| **Associations** | Continental guild HQs (alchemy, formations, beast tamers — future) |
| **Noble clans** | Heavyweights who aren't sects — marriage, veins, imperial favor |
| **Sleeping deterrence** | Tianjing inner + underpalace — founder sealed below |
| **Not daily tyranny** | Open streets; law through procedure; Dragon Guard at inner wall only |

**Celestial Market** — **rolled into the outer city** as its largest market district (south quarter). Same `marketKey: 'heartlands'`, no separate map node. Continent's greatest open bazaar is *inside* Longcheng, not down the road.

---

## Map placement (Heartlands local map)

Four sect HQs still ring **outer_heartlands**. The imperial metropolis sits **north** — elevated between Sword and Lotus peaks.

```text
        [Sword Hall]     [Imperial City Gate]     [Lotus Pavilion]
                              |
                    [Celestial Market Quarter]
                              |
                      [Charter District]
                              |
                    [Tianjing Inner Gate]  (gated)
                              |
                    [Outer Heartlands] — wilderness hub
           [Void Steps]                    [Phoenix Court]
```

### Phase 1 nodes (implementable)

| Node id | Name | type | Access |
|---------|------|------|--------|
| `imperial_city_gate` | Longcheng Gate *(or TBD)* | `city` | Open — hub entry, associations, noble quarter |
| `celestial_market` | Celestial Market Quarter | `market` | Open — **same id** for save compat; now inside city lore |
| `imperial_charter_hall` | Charter Hall of the Mandate | `outpost` | Open — edicts, examinations, imperial rep |
| `tianjing_inner_gate` | Tianjing Inner Gate | `landmark` | High favor or `reqRealm` 2+ — inner city fiction |

**Map change:** `celestial_market` node moves **north** (into city cluster) instead of south of outer heartlands. Path: sect HQs → outer heartlands OR imperial gate; imperial gate ↔ market quarter ↔ charter ↔ tianjing gate.

**Travel:** imperial city costs **+1 month** from sect HQs vs outer heartlands.

### Phase 2 (later)

- **Imperial sub-map** — outer districts (Envoy Row, Association Hill, Noble Ward, Market Quarter)
- **Tianjing sub-map** — inner ministries, regent courts, palace approach
- Underpalace / Sleeping Seal — endgame

---

## City layers (fiction + player access)

### 1. Outer imperial city — Longcheng

**Who:** Everyone. This is the continent's throat.

#### District roster (owner workshop v3)

| District | What’s here | Game role |
|----------|-------------|-----------|
| **Longcheng Gate** | Checkpoints, Dragon Guard, arrival log | Imperial favor intro; Han Ce |
| **Celestial Market Quarter** | Open bazaar, sect stalls, caravan terminus | `marketKey: 'heartlands'` — **required** |
| **Guild Row** (Association Hill) | Creation-path guilds (see below) | Exams, hire, consign, craft services |
| **Envoy Row** | Great-sect **branch offices** (not HQs) | Charter truce; faction rep; Phoenix-Lotus rumor |
| **Charter District** | Charter Hall, Examination Grounds, Petition Plaza | Edicts, imperial favor, charter petitions |
| **Noble Ward** | Great-clan compounds | Clan rep; marriage; vein permits; side quests |
| **Pilgrim Streets** | Inns, tea houses, cheap gear, rumor | Flavor hub between districts |
| **Licensed Duel Ground** | Sword Bureau–supervised arena | Honor duels; no deaths without charter filing |

**Vibe:** **Loud.** Horizontal chaos contained by law — Phoenix pamphlets across from Lotus ledgers, noble bodyguards in the tea house.

#### Creation-path guilds in Longcheng

Aligns with [`creation-path-guilds.md`](creation-path-guilds.md).

| Guild | Longcheng presence | Rationale |
|-------|-------------------|-----------|
| **Alchemists Guild** | **HQ** | Owner lean — wealth, pills, and patronage pool in the imperial hub |
| **Formations Guild** | **Branch** | HQ = **own city** elsewhere; Heartlands branch is the prestige branch (richest SKUs, exams through mid tier) |
| **Forgers Guild** | **Branch** *(recommend)* | Imperial **weapon & spirit-iron licensing** lives here; HQ deferred — lean **ore-adjacent city later** (Frostbite or dedicated forge town), not Longcheng |
| **Beast Tamers Guild** | **Registry office** only *(phase 2)* | Full branch stays **Emberwild**-adjacent; capital gets papers, not pens |

**Branch vs HQ — Forgers:** keep Longcheng as **branch**. HQ should sit where the work is — veins, forges, military contracts — while the capital branch handles **charter stamps, commissions, and exams**. Same pattern as Formations (autonomy outside, footprint inside).

#### Design note — breadth over pigeonholes (owner 2026-07-23)

**Noble clans** and **great sects** are **institutions with thousands of people**, not guild tags.

| Wrong read | Right read |
|------------|------------|
| “The Wei clan is the bureaucracy clan.” | The Wei are a **great house** — strongest in charter law and veins; also marry into trade, fund swords, own granaries. |
| “Lotus is the trade sect.” | Lotus is a **great sect** — flame-water dao, mountain arrays, inner court — *also* rich and present in every market. |
| “Sword is the law sect.” | Sword is a **Sword Dao sect** — aloof, cultivation-first — *also* takes imperial charter work when war must look honorable |

**Primary lean** = where they’re **hardest to compete with**, not their only business. **Longcheng footprint** = one visible office, not their identity.

#### Envoy Row (sect branches)

Each great sect’s **mountain is home**. Envoy Row is a **satellite compound** — staff rotation, charter business, city investments. Players meet *an office*, not the sect.

| Sect | Great sect (identity) | Longcheng footprint *(one slice)* |
|------|----------------------|-----------------------------------|
| **Celestial Sword** | Sword Dao, aloof masters on Solitary Sword Mountain | **Charter office + duel ground** — licensed sword work; most disciples never leave the mountain |
| **Jade Lotus** | Silk courts, inner politics, lotus dao — a full great sect with its own arrays and immortals | **City compound** — investments, marriage houses, charter lawyers; trade wealth is *part* of power, not the whole sect |
| **Void Temple** | Observatory slopes, sealed sites, pre-heaven study — mystics and oaths | **Archive access desk** — one reading room; the real vaults stay on the mountain |
| **Golden Phoenix** | Flame courts, expansionist history, phoenix dao — humiliated at Dao Wars, still dangerous | **Embassy** — loud, watched; pamphlets and provocation are *politics*, not their cultivation identity |

**Phoenix Gambit** plays out in charter courts and on the mountain — not “the trade sect vs the law sect.”

#### Other fixtures (not optional for fiction)

| Fixture | Why |
|---------|-----|
| **Petition Plaza** | Charter law as *theater* — Phoenix vs Lotus visible |
| **Caravan Terminus** | Continental travel hub (fold into Market Quarter or Gate) |
| **Examination Grounds** | Census / root reading — Shen clan, imperial favor |
| **Consignment Row** | High-end auction / escrow *(market-adjacent)* — noble + Lotus overlap |
| **Imperial Granary** | Famine relief politics *(background)* |

**Defer phase 2:** Talisman/scripture guild, mercenary charter hall, full Beast Tamers branch, guild sub-map interiors.

#### Gray Longcheng — rumor-gated undercity *(owner v2)*

Not a separate city — **layers inside Longcheng** the Dragon Guard pretends not to see. Nothing is permanently hidden; you need **rumors** (tea houses, Ying scandal sheets, faction rep, imperial favor low-path) to learn *where* to knock.

**Discovery pattern (future):**

```text
Rumor hook (explore, NPC, chronicle) → contact / back-alley entrance → service unlocks on sub-map or dialogue
```

Once found, stays found (same spirit as forbidden entrances in [`local-world-map-split.md`](local-world-map-split.md)). Charter law still applies — getting caught has consequences.

##### Locked / cut (owner 2026-07-23)

| Fixture | Status |
|---------|--------|
| **Black market annex** | **In** — stolen manuals, embargoed pills, hot goods (includes what a “fence” would do) |
| **Debt houses** | **In** — qi-binding loans, gambling markers |
| **Unlicensed duel pit** | **In** — earn stones, prove yourself, spar/kill for training |
| **Assassins Guild** | **In** — **global** org; Longcheng = Heartlands branch |
| **Poison Guild** | **In** — **separate** org; branch when poison path ships |
| **Information brokers** | **In** — rumor-gated |
| **Shady bounty board** | **In** — at Assassins branch desk |
| **Forgery lane** | **Cut for now** — revisit if charter-doc gameplay needs it |
| **Stolen goods fence** | **Cut** — folded into black market |
| **Examination fixers** | **Parked** — design kept below; needs census/registry gameplay first |
| **Smuggler’s crawl** | `idea` — tunnels; not locked either way |

##### Global syndicates

**Assassins Guild**

| Piece | Fiction |
|-------|---------|
| **Scope** | **Global** — branches in every major hub (Longcheng, Tide Harbor, Bone Crossroads, …) |
| **Power** | **Scales with region** — Heartlands branch fields NS-grade blades; Dustbone sends GC contractors; immortals don’t take grocery runs |
| **Services** | Deniable kills, kidnapping, protection, **gray bounty board** |
| **NPC vs player** | Nobles, sects, rivals hire against the player; player can take contracts later |
| **Relationship** | Sometimes hires **Poison Guild** for toxin work — separate invoice, separate org |

**Poison Guild** *(name TBD — “Poison Hall” in older notes)*

| Piece | Fiction |
|-------|---------|
| **Scope** | **Own tradition** — global branches, not a department of Assassins |
| **Services** | Poisons, antidotes, “accident” consultation, beast toxins, pill tampering |
| **Assassins overlap** | **Contracted sometimes** — Assassins outsource poison kills; Poison Guild still sells to alchemists, nobles, sect labs independently |
| **Game** | **Parked** until poison path / Poison Hall systems exist — Longcheng can show a **sealed door** or wrong-address rumor |

##### Gray fixtures (detail)

| Fixture | Fiction | Game hook (sketch) |
|---------|---------|-------------------|
| **Black market annex** | Back lanes off Celestial Market Quarter | Stolen manuals, hot materials, no paper trail; heat / imperial favor risk on big buys |
| **Debt houses** | Su-linked lenders deny ownership | Borrow stones at vicious rates; qi-binding contract → forced jobs or stat debuff until paid |
| **Unlicensed duel pit** | Below licensed Sword Bureau ground | **Earn money** (stakes), **prove yourself** (reputation), **kill/spar** for combat XP; no charter filing — deaths are “missing persons” |
| **Information brokers** | Listeners, bribed clerks — not one guild | Buy rumors, sect leaks, gray-bounty tips; Ying sheets are cheap; brokers are expensive |
| **Shady bounty board** | Assassins branch back room | Grudges, no questions — **NPCs post here against the player** |

**Legal vs gray — bounty boards:**

| Board | Where | Posts |
|-------|-------|-------|
| **Charter bounty** | Charter District | Licensed warrants, demon beasts, sect-approved targets — paper trail |
| **Gray bounty** | Assassins branch | Faces, grudges, missing persons — hires blades |

##### Examination fixers — parked *(design retained)*

**Owner (2026-07-23):** Good fiction, but **too much prerequisite work** — imperial census, examination loop, registry consequences — before fixers earn their place. Keep the idea; **do not ship** in Longcheng gray layer v1.

**Blocked on:** examination / imperial favor system with meaningful records; maybe player identity on census; gray-bounty scrub use case.

The **official** Examination Grounds (Proctor **Shen Kui**, House of Shen) maintain the **imperial census** — who cultivates, declared roots, charter standing, sect affiliations on record. That registry is power: marriage eligibility, academy entry, travel papers, imperial favor audits.

**Fixers** (when implemented) = gray market around the registry — corrupt clerks, disowned Shen **cadet cousins**, not a guild.

| Service | What it does | Who wants it |
|---------|--------------|--------------|
| **Record scrub** | Remove or alter a name on the census | Fugitives, people hiding from gray bounty |
| **Root re-write** | Falsify declared root grade / element on file | Noble marriages, academy back doors |
| **Backdated pass** | Insert a fake “examination passed” date | Cultivators who skipped census years |
| **Ghost entry** | Plant a false record to frame a rival | Clan feuds, Phoenix/Lotus charter games |
| **Duplicate identity** | Second file under alias | Smugglers, assassins, double agents |
| **Seal of silence** | Bribe to lose a pending audit | Debt house clients, black market regulars |

**Shen clan politics (future):** Main line (**Shen Kui**) runs legitimate examinations and would **disown** cadet branches caught fixing.

**Player hooks (future):**

- Hire a fixer to **drop off the gray bounty board** (scrub) — expensive, imperial favor risk if caught
- Use a fixer to **inflate root record** for a sect recruitment event — alignment / favor consequences
- **Refuse** and report — favor with Shen main line, enemy of undercity
- Fixer quest chain: someone planted a **ghost entry** framing the player — investigate Charter District vs gray clerk

**Not the same as:** creation-screen root test ([`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md)) — that’s heaven’s truth. Census is **what the empire believes**. Fixers change belief, not biology (until a much later fate-rite tier, if ever).

##### Who feeds the undercity (not exclusive)

- **House of Ying** — cheap rumors → broker introductions
- **House of Pei** — deniable assets (publicly denies)
- **House of Su** — debt houses, smuggling (denies ownership)
- **House of Shen cadets** — examination fixers *(parked — main line denies when this ships)*
- **Golden Phoenix embassy** — provocateurs, not the whole syndicate
- **Guild Row back doors** — off-book pills and commissions

**Open (owner):**

- [x] Assassins Guild — **global**, regional power scales
- [x] Poison Guild — **separate**; sometimes contracts with Assassins
- [x] Shady bounty — **Assassins branch desk**
- [x] Forgery lane — **cut for now**
- [x] Fence — **folded into black market**
- [x] Examination fixers — **parked** until census/examination gameplay exists
- [ ] Discovery: rumor-only vs rep-gated vs alignment-gated?

**Gray layer v1 (ship when Longcheng sub-map):** Assassins branch · black market · debt houses · duel pit · information brokers · Poison Guild stub door. *Not* fixers.

#### Noble clans — **7 recommended** (owner pick 6–8)

Massive houses — cadet branches, marriage lines, mortal retainers by the thousand. **Primary lean** = economic gravity center, not a job title.

| # | Clan | Hanzi | Who they are | Strongest in *(not only)* | Also has hands in |
|---|------|-------|--------------|---------------------------|-------------------|
| 1 | **House of Wei** | 魏氏 | Old charter blood; Chancellor **Wei An** is one branch | Vein permits, ministry appointments | Granaries, marriage to Sword cadets, private guard |
| 2 | **House of Shen** | 沈氏 | Census gentry; **Shen Kui** runs examinations | Root records, academy patronage | Tea trade, spirit-beast breeding, Void archive donations |
| 3 | **House of Pei** | 裴氏 | Palace-adjacent for generations; **Pei Yin**’s order, not all Pei | Inner Service influence, gate access | Silk, assassination insurance (denied publicly), land in outer Heartlands |
| 4 | **House of Qin** | 秦氏 | Martial house — duels are culture, not a mercenary sign | Mercenary contracts, arena stakes | Ore leases with Luo, political marriages, pill imports from Ye |
| 5 | **House of Su** | 苏氏 | Merchant princes; compete with Lotus **commercially**, not as a sect war | Warehousing, auction, caravan bonds | Owns banks, funds Phoenix pamphlets sometimes, cultivates in-house |
| 6 | **House of Ye** | 叶氏 | Herb valleys outside Longcheng; alchemy is **legacy**, not guild membership | Pill ingredients, garden estates | Marriage to Wei, sect disciple sponsorship, smuggling rivalries with Su |
| 7 | **House of Luo** | 罗氏 | Forge-town nobles with Longcheng townhouses | Spirit-metal leases, ore politics | Sells to Sword and Phoenix alike, formation plate investments, Qin guard hires |

**Optional 8th — Ying** 应氏: scandal sheets and rumor — **also** owns print shops, bribes clerks, cultivates gossip dao; not “the information clan.”

**Power band:** patriarch **Nascent Soul** public face; one hidden **VR** ancestor max; no sect homeland charter.

**Rep model (later):** don’t ship eight tracks in phase 1 — start with one clan questline that shows *internal* faction (cadet branch vs main line), not a single perk.

### 2. Inner Tianjing (天京) — Tian Clan home grounds

**Who:** Tian blood, emperor's household, regents, Inner Service. Sect envoys **summoned**, never resident.

| District | Hook |
|----------|------|
| **Inner Gate** | Pei Yin (Inner Service) — favor / realm check |
| **Ministry ring** | Veins, Rites, War (ceremonial) |
| **Regent courts** | Blood-branch plotting |
| **Palace mount** | Emperor audiences (rare, high favor) |
| **Street shrine** | Public sleeping-dragon cult — *not* the real seal |

**Vibe:** Quiet after Longcheng's noise. Gold, jade, formation shimmer. You need a reason. The city **outside** the inner wall is for the world; **Tianjing** is for the mandate.

### 3. Underpalace — Sleeping Seal (endgame)

- Founder Half-Step burial / seal array
- Tie to `heartlands_root`, `celestial_observatory`
- Stirring the seal = continental calamity Chekhov's gun

---

## Court structure — **owner lock (v2)**

Sect power bands: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) — **public elders** ≈ Nascent Soul; **patriarch / public apex** ≈ Void Refinement; **ancestor vault** above that (Dao Seeking+, hidden).

| Role | Fiction |
|------|---------|
| **Emperor** | **Tian Xu** (天煦) — *middle-aged in appearance*, young by immortal standards (~200 mortal years, looks 40). **Void Refinement peak** — same public tier as a great sect patriarch (idx `4` today; idx `5` after nine-realm ladder ships). Composes edicts, holds audiences; not a child puppet, not the founder. Ancient Tian ancestors and the buried founder sit above him — same pyramid as the sects. |
| **Regent Council** | Still schemes — emperor is capable, so regents compete for **influence**, not regency. Hardliners want him to break sects; pragmatists want balance. |
| **Founder** | Sealed under Tianjing — ultimate deterrence |

**Why this works:**
- Emperor can be a **real NPC** at sect-leader power without breaking the board
- "Young" for immortals = still has centuries ahead — succession not urgent, but blood branches still plot
- Player late-game audiences matter — you're talking to someone who could flatten a Core Formation fool
- Regent council shifts from "rule in his name" to "counselors who want their branch on the throne when he ascends further"

### Court cast (updated)

| Role | Name | Job |
|------|------|-----|
| **Emperor** | Tian Xu (天煦) | VR peak; visible at high favor — patriarch-tier |
| **Chancellor of Charter** | Wei An (魏安) | Bureaucracy; Wei clan; first contact |
| **Regent (hardline)** | Tian Lian (天濂) | Blood branch — break sect autonomy |
| **Regent (pragmatist)** | Tian Mo (天默) | Blood branch — Lotus-adjacent trade |
| **Examination Proctor** | Shen Kui (沈魁) | Shen clan; census / examination |
| **Dragon Guard captain** | Han Ce (韩策) | Inner gate; five-claw law |
| **Inner Service** | Pei Yin (裴音) | Tianjing gatekeeper |
| **Founder shrine keeper** | Old Gu (顾翁) | Street shrine; riddles |

---

## Charter law (unchanged core)

| Rule | Fiction |
|------|---------|
| **No sect war in the capital** | Envoy Row truce |
| **Licensed homelands** | Sect arrays registered at Charter Hall |
| **Edict precedence** | Imperial edict > sect custom in neutral ground |
| **Five claws** | Tian only — inner Tianjing and imperial regalia |
| **Contained rivalry** | Feud outside charter seats |

**Phoenix Gambit:** petitions filed in **Charter District** — outer city, visible to everyone. Absorption = charter coup.

---

## Imperial faction (draft)

| Field | Value |
|-------|-------|
| id | `tian_clan` |
| zone | `heartlands` |
| name | Tian Clan (Imperial Mandate) |
| emoji | 🐉 |
| type | `imperial` |

**Rep:** separate **`imperialFavor`** track. Noble clans may get their own mini-rep later (`wei_clan`, etc.) — defer until roster locked.

---

## Relationship to four sects (outer city = branches)

See **Envoy Row** above — great sects first; Longcheng offices are **one footprint**.

Homeland mountains stay on the map. Envoy Row compounds are **staffed rotations**, not second HQs. A Lotus envoy negotiates charter law; Lotus disciples still train on the mountain.

---

## Visual / map theme

- **Outer Longcheng:** wide avenues, mixed architecture (sect styles clash), market sprawl, noise
- **Inner Tianjing:** uniform imperial dragon aesthetic, five claws, qi-vein gardens, silence
- **Contrast:** sect peaks = wild vertical; outer city = horizontal hub; inner Tianjing = depth

```text
[Longcheng Outer Wall]
   ├─ Longcheng Gate + Caravan Terminus
   ├─ Celestial Market Quarter (south — busiest)
   ├─ Guild Row — Alchemists HQ · Formations Branch · Forgers Branch
   ├─ Envoy Row (four sect branches) + Licensed Duel Ground
   ├─ Charter District + Petition Plaza + Examination Grounds
   ├─ Noble Ward (7–8 compounds)
   ├─ Pilgrim Streets / Consignment Row
   ├─ Gray layer *(rumor-gated)* — Assassins · Poison Guild stub · black market · debt · duel pit
   └─ [Tianjing Inner Wall — formation gate]
        └─ Tianjing (palace mount, ministries)
             └─ Underpalace (sealed)
```

---

## Player journey (phase 1)

1. **Longcheng Gate** — hub intro; imperial favor; Han Ce warns on five claws.
2. **Celestial Market Quarter** — existing heartlands market, new lore framing.
3. **Charter Hall** — edicts, Phoenix-Lotus rumor board, examination.
4. **Tianjing Inner Gate** — gated; Pei Yin; tease inner content.

Combat stays outside the city charter zone (wilderness, sect mountains).

---

## Open questions (owner)

- [x] **Outer city name:** Longcheng (龙城) — locked
- [x] **Inner = Tianjing** — locked
- [x] **Market quarter** — required, inside Longcheng — locked
- [x] **Alchemists Guild** — HQ in Longcheng — locked
- [x] **Formations Guild** — Branch in Longcheng (HQ elsewhere) — locked
- [x] **Forgers Guild** — Branch in Longcheng; HQ deferred elsewhere — **recommend locked**
- [ ] **Noble clans:** 7 core (Wei, Shen, Pei, Qin, Su, Ye, Luo) + optional Ying?
- [x] **Emperor Tian Xu** — VR peak — locked
- [ ] **Phase 1 nodes:** gate + market + charter + tianjing gate — enough?

## Prerequisites

- [x] [`imperial-clan.md`](imperial-clan.md) core lore
- [ ] Outer city name
- [ ] Noble clan pass (light)
- [ ] Then: `data.js` map relayout + faction stub

## Implementation crumbs (later)

- `data.js` — relocate `celestial_market` north; add `imperial_city_gate`, `imperial_charter_hall`, `tianjing_inner_gate`
- `FACTION_DEFINITIONS.tian_clan`, noble clan stubs
- `factions.js` — `imperialFavor`
- Phase 2: outer + inner sub-maps
