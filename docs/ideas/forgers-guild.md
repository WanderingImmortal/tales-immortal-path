# Forgers Guild (铸匠会)

| Field | Value |
|-------|-------|
| **Status** | `designed` *(owner sign-off 2026-08-28 — forging pass complete)* |
| **Blocked on** | Implementation — map node, forge profession phases, branch NPCs ([`forging-equipment-tiers.md`](forging-equipment-tiers.md)) |
| **Issue** | none yet — open when building first guild slice |
| **Chat / PR** | Forging pass 2026-08-27–28 — [PR #114](https://github.com/WanderingImmortal/tales-immortal-path/pull/114) |
| **Updated** | 2026-08-28 |

Parent index: [`creation-path-guilds.md`](creation-path-guilds.md) · [`jianghu-organization-types.md`](jianghu-organization-types.md). Mechanics: [`forging-equipment-tiers.md`](forging-equipment-tiers.md). Longcheng footprint: [`imperial-city-tianjing.md`](imperial-city-tianjing.md).

**Design principle:** The Forgers Guild is a **charter institution** — it teaches **craft**, not a cultivation lineage. Your rank is **on the steel**, not in a second reputation bar. It sells violence to anyone who can pay and stamp the paperwork.

---

## Design lock *(owner sign-off 2026-08-28)*

Single-page recap so this pass is not lost. **Build from here**; soft defaults marked *(default lean)*.

### Guild & grandmaster

| Lock | Detail |
|------|--------|
| **Name** | Forgers Guild (铸匠会) |
| **Grandmaster** | **Hong Lian** (洪炼) — Furnace Sovereign (炉君) |
| **Character** | Kind old man, closed eyes, slight smile; **stubborn**, not talented; late Dao Wars rise |
| **Realm** | **Dao Seeking peak** *(default lean: early Manifestation)* |
| **Dao** | **Forge Dao** (铸道) — creation dao (truth in matter), not combat-forward |
| **Specialty** | Ore **purification** + **grade reliability** — fundamentals to the extreme |
| **Craft-title** | Honest Furnace Elder (诚炉翁) |
| **Mark** | **诚** — inspect: *The blade reads honesty.* |
| **Guard** | **Furnace Wardens** (炉卫) — after one assassination; his steel |
| **Forge Knights** | Name **reserved** for future use |

### Organisation

| Lock | Detail |
|------|--------|
| **Public face** | Hong Lian — still at the anvil; not full-time admin |
| **Capital admin** | **Yan Tie** — License Marshal, Longcheng Guild Row |
| **Chief Examiner** | UI name for Register Warden (册守) — master roll sign-off, not signup |
| **Signup desk** | **Branch Registrar** per zone hub |
| **HQ** | **Furnaceheart City** (炉心城) — **own map node**, 2nd-tier regional *(lean)* |
| **Branches** | Longcheng (licensing), Threshold (QC), Frost Gate *(lean)*, others ph.2 |
| **Exam ceilings** *(default lean)* | Zone branches → Spirit Smith (5); Longcheng → Dao Smith (7); HQ → peak |

### Furnaceheart

| Lock | Detail |
|------|--------|
| **Geography** | Spirit-iron crater bowl; vein roads; volcanic/ore margin; **imported food** |
| **Atmosphere** | Amber twilight + forge-light holes; industrial, proud |
| **Hong Lian beat** | **Light in the dark** — warmest honest hearth in the haze |
| **Defences** *(partial)* | Furnace Wardens locked; ballistas/golems TBD |
| **vs Luo** | Compound next door — neighbor rival |

### House of Luo (sketch)

| Lock | Detail |
|------|--------|
| **Role** | Noble house — **volume / margin** vs guild **quality / truth** |
| **Business** | Spirit-metal leases, ore export, private smelter |
| **Not** | Fake guild stamps — **diluted** convenient metal |
| **NPCs** | Unnamed — patriarch / factor TBD at build time |

### Forge scope

| Lock | Detail |
|------|--------|
| **One guild** | Metal + leather/hide + fabric/weave — same tier + grade math |
| **Dragon hide etc.** | Tier-N material → tier-N recipe — not metal-only |
| **Material catalog** | Implementation pass still needed ([`forging-equipment-tiers.md`](forging-equipment-tiers.md)) |

### Player

| Lock | Detail |
|------|--------|
| **QC visit Furnaceheart** | Allowed — bottom rung, no legend commissions |
| **Craft-title + mark** | Master Smith+ exam at branch; Chief Examiner + Hong Lian co-sign |

### Still open when building *(not blocking design)*

Chief Examiner NPC name · Luo patriarch · outer council seat first holder · defences mix · assassination attacker named or vague · first slice = Threshold branch vs exam UI only · lore: fightable Hong Lian, cult steel policy, sect parallel forges

---

## At a glance

| | |
|--|--|
| **Vibe** | Hot metal, cold contracts — **standards, stamps, and signatures** in a world where every sect claims their blade is heaven-blessed. |
| **Path** | **Creation-path craft** (qi gear primary in v1); body/soul forging verbs later |
| **Charter name** | **Forgers Guild** (铸匠会) — simple, imposing; no cute sub-brand |
| **HQ** | **Furnaceheart City** (炉心城) — **own map node** (ore-adjacent, Frostbite margin) |
| **Heartlands branch** | **Guild Row, Longcheng** — licensing, imperial commissions, mid-tier exams |
| **Guild spine** | **Grandmaster Hong Lian** (洪炼) — *Furnace Sovereign* (炉君); **Dao Seeking peak** *(lean early Manifestation)*; **Forge Dao** — not combat-forward |
| **Capital admin** | **License Marshal Yan Tie** (严铁) — day-to-day Longcheng paperwork; Hong Lian still forges |
| **Allies / rivals** | **House of Luo** (ore leases — partner and competitor); **Alchemists Guild** (adjacent patronage); **Celestial Sword** / **Golden Phoenix** (both buy, neither owns) |
| **Player feel** | “My signature is on the blade.” Rank up by **work**, not gossip. |

---

## Guild spine — **not sect, not noble house** (owner lean)

**Personality:** **Pragmatic and contract-minded** — aloof like Sword on the surface, but for **different reasons**. Sword ignores politics because cultivation is the point. Forgers ignore *loyalty* because **metal outlasts factions**.

| | **Alchemists Guild** | **Formations Guild** | **Forgers Guild** *(this doc)* |
|--|---------------------|----------------------|--------------------------------|
| **Bond** | Wealth + patronage pools | Pattern standards + array city | **Charter stamp + signature on steel** |
| **HQ lean** | Imperial Longcheng | Own city (arrays need space) | **Ore-adjacent forge city** — veins, military contracts |
| **Reputation** | Skill + **rep bar** (consumables, market) | FI rank + guild standing | **Smith rank only** — work speaks ([`forging-equipment-tiers.md`](forging-equipment-tiers.md)) |
| **Spine type** | *(TBD — court alchemist dynasty?)* | *(TBD — array patriarch?)* | **Living legend at the anvil** — not hidden |
| **Dao Wars** | Sold to everyone who could pay | Neutrality via indispensability | **Re-armed the continent** — took no side, stamped all sides |
| **Player feel** | “Who do I owe for this pill?” | “Can I read this diagram?” | “Does this blade carry my name?” |

**Sect copy trap to avoid:** a hidden immortal smith who secretly forged every legendary weapon. The guild is **not** a mountain cult. Hong Lian is **famous**, not buried. The spine is **the charter register** plus **one smith so good that ignoring him is expensive**.

**Working epithet:** **Furnace Sovereign** (炉君) — *Hong Lian* (洪炼) = *flood* + *temper/refine*

---

## Grandmaster specialty — **owner lock (2026-08-27)**

**Not** an all-rounder. **Not** a gimmick niche. **Simple proficiency taken to extremes** — the boring steps done perfectly for 180 years.

### What he’s #1 at

| Step | Skill | Why it matters |
|------|-------|----------------|
| **1. Purify** | **Spirit-iron refinement** — strips slag, mixed qi, cursed grit, noble dilution | Bad ore caps grade no matter how fancy the hammer work |
| **2. Forge** | **Grade reliability** — from honest stock, his pieces land **上品 / 极品** at rates no one else matches | Everyone can forge; almost no one forges **consistently well** |

```text
Sect elder:  named blade, dao inscription, sect legend
Luo smelter: cheap lot, fast ingot, profit margin
Hong Lian:   clean ore → honest steel → correct grade, again and again
```

**Vibe line:** “No tricks. No heavenly names. Just **clean metal** and **correct pins**.”

### What he’s **not** (and why that’s fine)

| Not his lane | Who owns it |
|--------------|-------------|
| Flashiest kill-blade / named heavenly sword | Sword Sect elders |
| Inscription / array gear | Formations crossover |
| Fastest army tonnage | Mercenary forges |
| Ore leases and export politics | House of Luo |

He makes **weapons** — plain ones. A Hong Lian blade might look unremarkable in the hand. The extremity is in the **grade roll** and the **honest ingot**, not in glow effects or chronicle titles.

### Why this reads believable

- **Specialist without a gimmick** — purification + consistency is one craft axis, not “good at everything.”
- **Explains guild authority** — the register codified **grade language** (下品→极品) because *he proved buyers could trust pins when the metal wasn’t lying*.
- **Explains Luo friction** — Luo dilutes lots for margin; Hong Lian **refuses** to forge from their “convenient” stock without re-purification.
- **Player fantasy echo** — the forge loop you already have (materials → craft → grade). He’s what the loop looks like at VR peak.

### Rejected forks (for the record)

| Option | Why passed |
|--------|------------|
| All-rounder | Too good to be real |
| Proof-Smith only (arbitration, no weapons) | Too institutional; owner wants a **crafter** |
| Finishing-only (last ten breaths) | Too niche / support-NPC feel |
| Inscription / dao-channel specialist | Steals Formations + sect lanes |

---

## Plain language — jargon & who you actually meet

**Words that sound fussy:**

| Jargon | Plain English |
|--------|----------------|
| **Charter** | The guild’s **official license** — rules the mandate recognizes (who can stamp steel, what grades mean, neutrality). |
| **Register** / **Master Register** | The **official list** of certified smiths — names, ranks, craft-titles, marks. Like a professional roll of doctors or lawyers. |
| **Register Warden** | **Chief examiner** + keeper of the master list — signs off serious exams. **UI name: Chief Examiner**; lore title: Register Warden (册守). **Not** the famous face. |
| **Branch Registrar** | **Front desk** at a branch — first exams, recipe filing, local buy/sell. |
| **License Marshal** | **Capital paperwork boss** — Yan Tie; licenses, commissions, imperial forms. |

### Exam chain (who signs what)

```text
Apprentice / mid rank exam:
  Branch examiner  →  tests you at the anvil
  Branch Registrar →  files pass locally, updates your guild rank

Master Smith+ (craft-title + personal mark like 诚):
  Branch examiner  →  tests you
  Register Warden  →  enters you in the Master Register at HQ (“this exam counted”)
  Grandmaster      →  co-signs top stamp (Hong Lian — until he names a full deputy)

Peak / dispute:
  Chief Appraiser or Grandmaster
```

So yes — **Register Warden is “above the examiner”** for anything that goes in the **permanent master book**. Day-to-day apprentice exams mostly stop at the branch.

### Who the outside world sees *(sect-leader comparison)*

| Visibility | Who | Sect analogue |
|------------|-----|----------------|
| **The name everyone knows** | **Hong Lian** — Grandmaster, Furnace Sovereign, still at the forge | **Patriarch / Immortal** on the mountain — fame, authority, symbol |
| **The person you meet in the capital** | **Yan Tie** — License Marshal, Guild Row desk | **Sect envoy** — handles business, not the legend |
| **The person you meet at home** | **Branch Registrar** — Threshold, Frost Gate, … | **Local hall head** |
| **Mostly invisible** | **Chief Examiner** *(Register Warden)* — HQ records, exam sign-off for master roll | **Inner archivist / head examiner** — important, not a celebrity |

**Hong Lian is the public face** — highest office, most publicity, most power. He is **not** doing admin; he **still forges**. The guild does **not** replace him with “just representatives” for authority — but **practically**, you interact with **desks** (Yan Tie, branch registrars) unless you pilgrimage to Furnaceheart.

**Register Warden is not acting as sect leader.** He’s senior staff — the guy who makes sure the **official list** is honest. Outsiders might know the *title* exists; they don’t tell stories about him at tea houses.

```text
Stories at tea houses:     Hong Lian, his steel, the 诚 mark, the Furnace Wardens
Paperwork you file:        Yan Tie (Longcheng) or Branch Registrar (local)
Permanent “you’re legit”:    Chief Examiner + Hong Lian’s co-sign (master roll)
```

**Player UI:** use **Chief Examiner** everywhere players see the role. **Register Warden** (册守) stays in lore, chronicle, and NPC dialogue flavor.

---

### Two kinds of seat

| Kind | Binds to | Examples |
|------|----------|----------|
| **Charter office** | **Function** — may have a usual HQ desk, but the *job* is what matters | Register Warden, Chief Appraiser, License Marshal |
| **Branch seat** | **Zone hub** — player walks in here | Threshold Registrar, Longcheng Guild Row, Frost cold-forge desk |

```text
Charter offices  →  "what the guild does"     (some travel, some dual-hat)
Branch seats     →  "where you walk in"         (exams, buy/sell, local hire)
Grandmaster      →  person first, HQ second    (Hong Lian; successor might move — unlikely)
```

**Rule:** branch registrars are **always** geographic. Peak craft authority and register custody are **usually HQ**. Imperial paperwork is **always Longcheng**.

### Hierarchy (lean)

```text
GRANDMASTER — Hong Lian @ Furnaceheart main forge
    │  craft apex · Master Register · peak exams · Furnace Wardens
    │
CHARTER COUNCIL — senior smiths (Master Smith+), rarely unanimous
    │  standards votes · mark disputes · succession proof
    │
CHARTER OFFICES — functional elders (not all at one city)
    │  Register Warden · Chief Appraiser · License Marshal · Commission Broker
    │
ZONE BRANCHES — one primary hub per zone
    └── Branch Registrar + examiners + hire roster + local intake
```

**Not a sect pyramid.** No outer/inner court, no cultivation lineage. You join by **exam + register**, not disciple oath.

### Charter offices *(functional — location lean)*

| Office | Hanzi *(stub)* | Usual seat | Realm lean | Job |
|--------|----------------|------------|------------|-----|
| **Grandmaster** | 炉君 | Furnaceheart | **Dao Seeking peak** *(lean early Manifestation)* | Apex craft; **Forge Dao**; still at anvil; co-signs register |
| **Chief Appraiser** | 品正 | Furnaceheart | Master+ | Grade disputes; calibrates exam blades; *The blade reads honesty* is the reference |
| **Chief Examiner** *(Register Warden)* | 册守 | Furnaceheart | Master+ | **Chief examiner for the master roll** — UI: **Chief Examiner**; signs off serious exams |
| **License Marshal** | 铁符使 | **Longcheng** | CF+ | Spirit-iron licensing; imperial charter; **Yan Tie** — day-to-day admin |
| **Commission Broker** | 工单行 | Longcheng + HQ | CF+ | Post/fill tier commissions; military & noble contracts |
| **Purification Elder** | 炼真座 | Furnaceheart *(Frost deputy lean)* | Master+ | Ore intake standards; Luo lot disputes — **Hong Lian’s lane** |
| **Branch Registrar** | 分号执事 | **Each zone hub** | FE+ | **Guild signup desk** — apprentice exam, recipe register, local exams |

**Register Warden vs signup:** walking in to **join / first exam** → **Branch Registrar** (Threshold, Longcheng, …). **Register Warden** keeps the **master book** when you earn **Master Smith+** and register your **craft-title + 诚-style mark** — copy filed at HQ. Hong Lian still co-signs as grandmaster until a deputy is named.

**Owner note:** Hong Lian **dual-hats** Grandmaster + de facto Purification Elder. Register Warden = trusted deputy *(stub)* — he forges; he does not want to chase paperwork.

**Charter Council — what “rotating / outer seat” means:** seven seats total — Register Warden, Chief Appraiser, License Marshal (Yan Tie), Branch Regent (Longcheng), Branch Regent (Furnaceheart), plus **Outer Seat** (轮值). The **Outer Seat** is **one vote shared by non-Heartlands zones** (Dustbone, Frostbite, Jade, Emberwild) — they **take turns** each term so Longcheng doesn’t set every pin alone. Plain English: *“whose zone is on the council this year.”*

### Branch seats *(geographic — one per zone hub)*

Pins from [`creation-path-guilds.md`](creation-path-guilds.md):

| Zone | Hub | Branch seat | Registrar | Branch specialty *(lean)* | Exam ceiling *(lean)* |
|------|-----|-------------|-----------|---------------------------|------------------------|
| **Heartlands** | Longcheng — Guild Row | **Capital branch** | **Yan Tie** — License Marshal *(runs the desk)* | Licensing, commissions, richest hire roster | Dao Smith (rank 7) |
| **Frostbite** | Frost Gate Outpost | Frost branch | *(stub)* | Cold-steel, ore escort; **Purification deputy** | Spirit Smith (5) |
| **Dustbone** | Threshold City | Dustbone branch | *(stub)* | QC recipe register, apprentice exams | Artisan (3) |
| **Jade** | Tide Harbor | Registry office *(ph.2)* | *(stub)* | Import/export stamp only at first | — |
| **Emberwild** | Ashvein Village | Outpost *(ph.2)* | *(stub)* | Hunter gear, crude iron | Journeyman (2) |

**HQ (Furnaceheart)** is **not** a zone branch — it is the **forge city**: peak exams, purification hall, Charter Council, grandmaster forge. Sits Frostbite **margin** (ore-adjacent) but serves the **whole charter**.

### What players touch (v1 lean)

| Player need | Where |
|-------------|-------|
| QC apprentice exam, recipe register | **Threshold** branch |
| Sell gear properly, mid exams | Zone branch when it exists |
| Spirit-iron license, commission post | **Longcheng** |
| Craft-title + mark registration | Any branch **Master Smith+** exam pass; copy filed HQ |
| Peak exam / legend commission | **Furnaceheart** pilgrimage (late) |

### Elder naming — avoid sect copy

| Call them | Not |
|-----------|-----|
| **Registrar**, **Appraiser**, **Marshal**, **Branch Regent** | Elder of the Inner Forge Court |
| **Hall seat** (座) | Peak |
| **Registered smith** | Disciple |

### Open (structure)

- [x] **Furnaceheart** — own map node (ore-adjacent) — owner 2026-08-27
- [x] **Chief Examiner UI name** — player-facing; lore = Register Warden (册守) — owner 2026-08-28
- [ ] Chief Examiner deputy NPC — name when needed
- [ ] Outer Seat — which zone holds council first (Dustbone vs Frostbite)?

---

## Leadership *(summary — see [Organisation](#organisation--structure--geography-owner-lean-2026-08-27))*

| Role | Name | Seat type | Notes |
|------|------|-----------|-------|
| **Grandmaster** | **Hong Lian** (洪炼) | Charter @ HQ | Dao Seeking peak; Forge Dao; still forges daily |
| **License Marshal** | **Yan Tie** (严铁) | Branch @ Longcheng | **Admin** — licenses, commissions, exams; runs the capital desk |
| **Threshold Registrar** | *(stub)* | Branch @ Threshold | QC exams, recipe registration |
| **Chief Examiner** | *(stub deputy)* | HQ internal | Master list sign-off — **UI: Chief Examiner**; Hong Lian co-signs |
| **Charter Council** | Branch Regents + office holders | Mixed | Standards votes; rarely agree |

**Succession:** Grandmaster title passes by **unanimous Charter Council + proof forge** — successor must forge a **Supreme-grade tier-7 commission** before the register turns. Hong Lian is old; council is **split** on whether the next grandmaster must be guild-born or can be a sect exile.

---

## Grandmaster Hong Lian (洪炼) — guild spine

| Field | Value |
|-------|-------|
| **Epithet** | **Furnace Sovereign** (炉君) |
| **True name** | **Hong Lian** (洪炼) — *vast* + *refine in fire* |
| **Realm** | **Dao Seeking peak** *(owner lean: early Dao Manifestation)* — **Forge Dao**; combat is **ordinary** for his tier |
| **Talent** | **Not gifted** — owner lock: dedication + stubbornness, not prodigy |
| **Specialty** | **Ore purification** + **grade reliability** — fundamentals to the extreme ([owner lock](#grandmaster-specialty--owner-lock-2026-08-27)) |
| **Public face** | **Kind old man** — slight smile, eyes usually **closed** |
| **Personal craft-title** | **Honest Furnace Elder** (诚炉翁) *(owner lean)* — registered at Master rank; simpler than grandmaster epithet |
| **Signature mark** | **诚** (*honest*) — tiny stamp near tang or pommel ([locked](#signature-mark--owner-lock-2026-08-27)) |
| **Where** | **Furnaceheart main hall** — audiences by **commission queue**, not favor |
| **Guard** | **Furnace Wardens** (炉卫) — hired muscle; armed with his steel. **Forge Knights** — parked name for something else later |
| **Role** | Apex **crafter** **and** keeper of the **Master Register** (名匠册) |

### Presentation — the smile and the closed eyes

To strangers he reads as **harmless** — soft voice, unhurried hands, a grandfather at a hearth.

| Surface | Truth behind the eyelids |
|---------|--------------------------|
| Slight, patient smile | He has heard every excuse for bad steel |
| Eyes closed while he listens | He is **not** sleeping — he is **measuring** you the way he measures ore |
| Slow nods, never rushes an answer | Will tempered longer than any blade he has ever made |
| Offers tea before business | You are in **his** furnace rhythm now |

**Owner line:** *Hiding behind those eyelids is a will stronger than any blade he's ever made.*

He opens his eyes only when he must — to read a flaw in metal, or to let someone understand they have exhausted his patience.

### Origin — not talented, just stubborn

Hong Lian was **never** a prodigy. No sect recruited him young. No vein opened at his touch. He **scraped** — failed apprenticeships, bad ore lots, years of **Inferior** work he refused to sell as anything else.

What he had:

- **Stubbornness** — re-smelt the same lot ten times rather than ship a lie
- **Patience** — outlast teachers who wanted shortcuts
- **Honesty** — a reputation for poverty before a reputation for greatness

His cultivation advanced **late and ugly** — not on a mountain, but in the gap between hammer strokes. **Dao Seeking** came when he finally **understood metal as law**, not just technique. He may be **half-step toward Manifestation** — the forge answers him in ways it shouldn’t for a “mere smith” — but he has **never** oriented that toward killing. He is proof the guild path is **work**, not heaven’s favor.

### Forge Dao — what that even means *(sketch — owner 2026-08-27)*

**Sword Dao** is a **wield dao**: comprehend the sword → become the sword → **fight** as the law.

**Forge Dao** (铸道) *(working name)* is a **creation dao**: comprehend **transformation and truth in matter** → the metal **cannot lie** around you → **make** as the law.

| | **Wield dao** (Sword, Phoenix flame…) | **Creation dao** (Forge, Alchemy…) |
|--|--------------------------------------|-------------------------------------|
| **Question** | How do I **strike** / **channel**? | How do I **change** / **stabilize** matter? |
| **Dao Seeking** | Sees the law of the **cut**, the **flame** | Sees the law of **phase**, **pin**, **honest form** |
| **Manifestation** *(if reached)* | **Wears** sword law — duels rewrite terrain | **Wears** craft law — **material in radius obeys truth** (slag separates, grades stabilize) |
| **Combat** | Primary expression | **Side effect** — he is dangerous because his **gear** and **guards** are perfect, not because he throws forge-fire |
| **Weirdness** | Players get it immediately | Feels odd until you frame it as **infrastructure**, not a beam attack |

**Hong Lian’s expression:** at the anvil, ore **yields** impurity. Hammers **find** the true line. A 诚 mark is not branding — it is **statement of material fact** under his dao. That is why the continent trusts his pins.

**Not designed today:** full Forge Dao cultivation track for players ([`law-taxonomy.md`](law-taxonomy.md) — *dao importance asymmetry* parked). For v1, forging stays **profession + smith rank**; Hong Lian is the **lore proof** that creation paths can reach Seeking/Manifestation without looking like Sword Dao.

**Alchemy parallel *(one line)*:** Alchemy Dao = **change of essence / dose / reaction** — pills, not palm strikes. Same “creation not wield” family; detail when alchemy guild ships.

### Dao Wars arc — late rise *(owner lock)*

He was **not** a notable figure for most of the war. A small independent forge. Correct pins. No banner.

| Phase | Hong Lian |
|-------|-----------|
| **Early / mid war** | Background noise — one more smith in a continent drowning in smiths |
| **While sects rushed** | Purified every lot; forged slowly; **refused dilution** even when clients screamed |
| **Turning point** | Commanders noticed blades **didn’t snap** — then noticed the **same signature** on steel from a dozen losing sides |
| **Late war** | Reputation **carried by the weapons**, not by him — the powerful came to the forge; he did not go to them |
| **Post-war** | Charter neutrality codified **because** everyone already depended on his pins |

**Player memory:** “For years nobody knew his face. Everyone knew when the steel was **his**.”

### The assassination — and the Furnace Wardens *(owner lock)*

**At least one real attempt** — mid-to-late Dao Wars, when his signature was spreading but his face was still obscure.

| Beat | Detail |
|------|--------|
| **Who** | *(lean)* rival forge backed by a sect cutout — wanted his register **or** his silence on diluted ore |
| **What happened** | Night strike on the small forge; Hong Lian **survived** (closed eyes, closed doors, refused to flee the furnace) |
| **After** | He did **not** become a fighter. He **hired** — discharged soldiers, failed cultivators, honest mercenaries. **Decent muscle**, not legends |
| **The twist** | Armed them with **his** work — plain blades, honest pins, no heavenly names. Steel that **didn’t snap**. Guards became **formidable** because the craft held |
| **Today** | **Forge Knights** *(lean)* / Furnace Wardens (炉卫) — permanent hall guard. Everyone assumes the old man is soft. The knights are the reminder |

**Lesson he took:** *I will not pretend the world is kind. I will equip the people who stand between me and the fire.*

No more assassination attempts made public after the wardens were seen **breaking** a second team without losing a blade edge. Rumors say the third group never found the forge.

### Craft today

Unremarkable-looking weapons and ingots. No heavenly names, no spectacle. When Hong Lian signs **Supreme** (极品), the continent believes it — because he spent a lifetime refusing to stamp a lie.

**The two steps nobody skips around him:**

1. **Purify** — even House of Luo’s “export grade” ore gets re-smelted in his hall.
2. **Forge** — from that stock, his grade outcomes are what examiners calibrate against.

### Why rivals didn’t erase him

Stacked reasons — assassination attempt proved the last mile:

| Reason | Detail |
|--------|--------|
| **Not worth killing early** | No territory, no secret manual — just a **poor** smith with correct pins |
| **Arms-dealer math** | Kill the neutral forge → **your** contract gets worse steel |
| **Everyone’s customer** | Late-war factions all had officers carrying his work |
| **The Furnace Wardens** | After the first attempt, killing him meant fighting **his steel** in someone else's hands |
| **Indispensable** | By peak fame, killing him meant declaring war on **supply** |

### What he wants

- **Standards hold** — guild stamp means something when sect pamphlets lie.
- **Ore access** — veins stay open; noble leases (Luo) don’t monopolize spirit-iron.
- **No sect ownership** — Sword and Phoenix may **hire** guild masters; they may not **own** the register.

### What he won’t do

- Duel for honor — “Bring a broken blade; that is a conversation.”
- Forge from **unpurified** lots to save time — “Fast slag is still slag.”
- Forge **named** cursed weapons for cults without charter review.
- Leave Furnaceheart for court politics — **Yan Tie** handles Longcheng.

---

## Craft signatures & personal titles *(owner lean 2026-08-27)*

Separate from **guild smith rank** (Apprentice → Forge Saint in [`forging-equipment-tiers.md`](forging-equipment-tiers.md)). Two layers:

| Layer | What it is | When |
|-------|------------|------|
| **Smith rank** | Guild standard title — tier gate, exams, sell mult | Rank 1–9 on promotion |
| **Personal craft-title** (匠号) | **Your** name on the work — path, character, specialty | **Master Smith (rank 4)+** — register mark at guild branch |
| **Signature mark** (款识) | Tiny physical imprint on each piece | Same registration — proves the title |

### Signature mark — **owner lock (2026-08-27)**

**Hong Lian:** single character **诚** (*honest*) — stamped small near the tang, inside the pommel, or on the ingot face. Visible only if you know where to look. No banner crest, no glow.

**Inspect flavor (owner lock):**

| Surface | Copy |
|---------|------|
| **Log / first read** | *The blade reads honesty.* |
| **Tooltip / full inspect** | *Mark: Honest (诚) · Honest Furnace Elder (诚炉翁)* |

Hanzi stays **secondary** per [`forging-equipment-tiers.md`](forging-equipment-tiers.md) — English leads; brackets on tooltips only.

**Rule:** grandmaster mark is **simple**. Flashy sigils are sect vanity; guild trust is **small and true**.

**Player marks (later):** other registered smiths pick from a preset list or guild-approved single character at Master Smith+ — each with its own short inspect line (e.g. 寒 → *The steel reads cold.*). Hong Lian’s **诚** is the reference everyone knows.

### Personal craft-titles — examples

Earned at **Master Smith+**, chosen or granted at registration. Shorter and more personal than rank title.

| Smith | Craft-title (EN) | Hanzi | Why |
|-------|------------------|-------|-----|
| **Hong Lian** | **Honest Furnace Elder** | 诚炉翁 | Honest metal + hearth + old man (*翁*) |
| *(player examples)* | Frostbite Edge | 寒锋匠 | Zone specialty |
| *(player examples)* | Road Nail | 道钉匠 | Humble, stubborn |

**Hong Lian vs epithet:** **诚炉翁** (Honest Furnace Elder) is his **registered craft-name** — what buyers see on the mark. **炉君** (Furnace Sovereign) is the **grandmaster epithet** the continent uses in chronicle and charter — heavier, institutional.

```text
On the steel:     tiny 诚 + 诚炉翁
Inspect line:     "The blade reads honesty."
In charter law:   Grandmaster Hong Lian, the Furnace Sovereign
In guild exams:   Law Smith (rank 8) — craft rank; cultivation Dao Seeking+
```

### Player loop (later)

- Rank 4 exam → register **craft-title** + **mark design** (preset list or short custom)
- Forged gear shows mark on inspect; sell price bonus if mark matches registered title
- Appraisal (Phase F) reads mark before stats — Hong Lian line: *The blade reads honesty.*

---

## Geography

Aligns with [`creation-path-guilds.md`](creation-path-guilds.md) and [`imperial-city-tianjing.md`](imperial-city-tianjing.md).

| Site | Presence | Services |
|------|----------|----------|
| **Furnaceheart City** | **HQ** — own node | Main forge, Charter Council, peak exams | Masterwork arbitration, tier 8–9 exams, military contracts, ore intake |
| **Longcheng — Guild Row** | **Branch** | Spirit-iron licensing, imperial commissions, exams through **Spirit Smith** *(lean)* |
| **Threshold City** | **Branch** | QC–FE exams, recipe registration, buy surplus gear |
| **Frost Gate Outpost** | **Branch** *(lean)* | Cold-steel specialty, ore escort contracts |
| **Tide Harbor** | **Registry office** *(phase 2)* | Jade-path import/export stamps |

**HQ rationale:** forges belong on **veins and rivers of ore**, not in the capital. Longcheng handles **law and money**; Furnaceheart handles **fire**.

**Furnaceheart City** — see [full sketch](#furnaceheart-city-brainstorm-owner-starting-points-2026-08-28) below.

---

## Furnaceheart City — brainstorm *(owner starting points 2026-08-28)*

**Not gospel** — starting ideas to react to. Hong Lian is kindly; the city can be **industrial and strange** without being **miserable**.

### Is it technically a city?

**Yes — a City** per [`city-tiers.md`](city-tiers.md) (not Outpost/Camp). UI shows type chip **City**.

| Question | Lean |
|----------|------|
| **Civic tier** | **2nd-tier regional** *(lean)* — lord ~Nascent Soul; guild charter makes it *feel* bigger than civic rank |
| **Who rules on paper?** | **Charter Mayor** (炉城主) — elected/appointed under guild charter; **Hong Lian veto** on forge law |
| **Guild vs city** | City = people, wells, markets, housing. Guild = standards, main forges, exam halls. **Overlapping but not identical** — like a university town where the university is the reason the town exists |

Not an imperial capital. Not a sect mountain. A **forge city** — reason to exist is ore + fire.

### Geography nearby *(stub)*

| Feature | Lean |
|---------|------|
| **Crater bowl** | Collapsed spirit-iron scar — city sits **inside** the rim; ore lifts climb the inner walls |
| **Vein roads** | Cart tracks to Frostbite ore fields + Luo lease pits; constant ore traffic |
| **Ash wind** | Prevailing wind carries **cinder** from the furnace district — explains haze without “evil darkness” |
| **Cold margin** | Frostbite approaches north/east — cold air meets hot smog → **perpetual bronze twilight** in the lower districts |
| **Not** | Dead wasteland — farms on the rim outside the bowl; food comes in; it's **busy**, not post-apocalyptic |

### Sky & atmosphere — **both** *(owner 2026-08-28)*

**City:** amber twilight, forge-light holes at night, industrial cathedral — busy and proud, not miserable.

**Hong Lian:** the **warm forge in the haze** — outside, smog and racket; in his hall, the **brightest fire in the crater**. Kindly old man until he works; then **determination and respect for the Forge Dao** show on his face — closed eyes, slight smile, hammer that does not lie. He is the **light in the dark** without making the city grimdark: the city is harsh; **he** is the reason people trust the guild.

```text
Furnaceheart at night:   thousands of orange mouths in the smog
Hong Lian’s forge:       one steady white-gold hearth — quiet, honest, the one you walk toward
```

**Optional rule:** upper rim districts have clearer sky — rich rent higher; main forge district stays hazy.

### Who lives there *(owner 2026-08-28)*

| Population | Lean |
|------------|------|
| **Core** | Smiths, smelters, ore haulers, charter clerks, Furnace Wardens |
| **Secondary** | Traders, caravan handlers, food importers, tavern keepers, tool sellers |
| **Sparse** | Farmers — **rim only**; crater bowl + vein fields + volcanic lean = **bad for crops** |
| **Food / timber / cloth** | **Imported** — caravan terminus at the rim; trade solves what geology denies |
| **Size feel** | **Medium city** — not Longcheng; bigger than Threshold; dense industrial core, thinner residential rim |

### Player visit timing *(owner 2026-08-28)*

**Run-dependent** — no hard gate; **wealth and rank** gate the experience.

| Visitor | Experience |
|---------|------------|
| **QC cultivator** | Can **reach** Furnaceheart and **survive** — bottom of the social ladder; apprentice exams, gawking at the main forge, **no** great-weapon commissions |
| **Mid realm + smith rank** | Meaningful exams, craft-title registration pilgrimage, hire roster |
| **Late** | Peak exams, legend commissions, Hong Lian queue |

*Fantasy:* you can **see** the legend early; you **cannot buy** the legend early.

### House of Luo — the compound *(what it is)*

From [`imperial-city-tianjing.md`](imperial-city-tianjing.md) — **House of Luo** (罗氏) are **Heartlands nobles** whose **primary lean** is **spirit-metal leases and ore politics**. They are **not** the Forgers Guild.

| | **Forgers Guild** | **House of Luo** |
|--|-------------------|------------------|
| **What** | Charter institution — standards, exams, stamps | **Noble house** — owns/mined **vein leases**, export margins |
| **Furnaceheart** | Runs the **main forges** and register | Has a **private compound** next to the guild — townhouses, ore ledgers, negotiators |
| **Longcheng** | Branch on Guild Row (Yan Tie) | Also owns **Longcheng townhouses** — ore deals at court |
| **Relationship** | Needs Luo **ore**; hates Luo **dilution** | Needs guild **stamps** to export at premium; wants **exclusive** leases |

**The Luo compound at Furnaceheart** = their **local HQ**: scribes, lease managers, guards, maybe a private smelter — **neighbor and rival**, not boss. Hong Lian re-smelts their “export grade” stock before it touches his anvil. Plot hook: Luo offers you a **cheap lot**; guild appraiser says it’s lying.

**Player lean:** visible antagonist **pressure**, not a must-fight villain — trade, bribes, better ore if you look away.

### Hong Lian’s guard — **Furnace Wardens** *(owner lock 2026-08-28)*

| | |
|--|--|
| **Name** | **Furnace Wardens** (炉卫) — **locked** for his bodyguards |
| **Forge Knights** | **Parked** — save for another role (elite order? military charter? player escort tier?) |
| **What** | Hired muscle after assassination — discharged soldiers, failed cultivators |
| **Why scary** | **Hong Lian’s** plain steel — doesn’t snap |
| **Faces** | Not needed yet |

### Unique defences *(starting points — pick later)*

Hong Lian doesn’t duel; the **city** must deter sieges. Mix lean:

| Option | Read |
|--------|------|
| **Furnace Wardens** (炉卫) | His armed guard — **formidable because of his steel**, not cultivation legends |
| **Ballista / scorpion batteries** | Crater **rim emplacements** — charter city has seen wars; practical artillery |
| **Purification golems** *(lean)* | Not flashy war-puppets — **ore-fed automatons** that guard vein lifts; slow, heavy, guild-maintained; feel **crafted** not sect-summoned |
| **Smog veil** | Invaders misread the haze — formations **drift** in heat shimmer (minor array, formations guild contract) |

**Not lean:** hidden immortal formation under every street — too sect-like.

### City rules *(charter law — starting points)*

Guild charter doubles as **local forge law** inside the crater:

| Rule | Why |
|------|-----|
| **No false stamp** | Selling slag as 上品 = exile or worse |
| **Open vein access** | Luo leases operate but **cannot seal the guild intake** |
| **Neutral forge** | Sect banners **down** in the main furnace district — charter neutrality visible |
| **Night noise** | Hammers may run **24h** in industrial zone — residential rim has quiet hours |
| **Weapon draw** | Permitted in industrial belt; **forbidden** near exam halls and Hong Lian’s queue |

---

## Forge scope — metal, leather, fabric *(owner lean 2026-08-28)*

**Forge Dao / Forgers Guild ≠ metal only.** One creation path, **multiple material families** — same tier + grade math, different recipes and specialties.

| Family | Examples | Guild lane |
|--------|----------|------------|
| **Metal** | Spirit iron, ore ingots, blades, plate | Core — Hong Lian’s lane (purification) |
| **Leather / hide** | Beast hide, **dragon hide** armor, straps | Same guild — **tanner-smith** specialty; heat-set, qi-stitch, temper hides |
| **Fabric / weave** | Spirit silk, celestial thread, formation-thread cloaks | Same guild — **weave-smith** specialty; often partners with formations for inscriptions |

**Rule for implementation ease:** if you **craft wearable gear** through the forge chamber loop, it’s **forging** — dragon hide chestplate uses **tier N hide + tier N recipe**, same grade roll as a metal chest. Material tier can be **vague** at high end (one “tier 7 dragon hide” beats inventing fifteen ore names) — **honesty pin** still applies.

**Not alchemy:** pills, brews, store-fills — Alchemists Guild.  
**Not formations-only:** array plates without craft — Formations Guild.  
**Overlap OK:** inscribed silk cloak = forge base + formation inscription layer (later phase).

**Specialties** = registered craft-titles / branch flavor (Frostbite cold-steel, dragon-hide master, etc.) — **one charter**, many benches.

**Material tier note:** `dragon_hide_t7` and `spirit_iron_ingot_t7` both mean **“tier-7 crafting input”** — not every high-tier mat is ore. See [`forging-equipment-tiers.md`](forging-equipment-tiers.md) for gear tier/grade; material catalog pass still TBD.

---

## Material & equipment tiers — where we are

**You did a lot** in [`forging-equipment-tiers.md`](forging-equipment-tiers.md). Quick map:

| Axis | Status | Notes |
|------|--------|-------|
| **Gear tier** (1–9) | **Designed**; **4 tiers in code** | Aligns to cultivation realm index |
| **Gear grade** (下品→极品) | **Designed**; **Phase B building** | 4 grades, stat mults in `forge-data.js` |
| **Smith rank** (9 ranks) | **Designed**; **4 ranks in code** | Apprentice → Master today |
| **Forge materials by tier** | **⚠️ Not done** | Recipes use flat IDs (`iron_ore`, `frost_essence`) — **no material tier field** yet |
| **Alchemy parallel** | Reagents have **scarcity** (common/uncommon/rare) + pills have **tier** (mortal/earth/Tier 1 QC book) — **two axes** |

**What’s missing for forge (lean):**

```text
Material tier N  →  used in gear tier N recipes (like alchemy Tier 1 book)
Material grade   →  optional scarcity within tier (honest ingot vs slag lot)
Gear tier        →  output realm band (already designed)
Gear grade       →  craft quality roll (Phase C)
```

**Dustbone today:** `ironscar_grit`, `sun_stone` etc. are alchemy reagents with scarcity — forge can **reuse** some IDs or add parallel inputs (`spirit_iron_ingot_t1`, `dragon_hide_t4`, …) when a materials pass ships. **High-tier mats need not be ore** — see [Forge scope](#forge-scope--metal-leather-fabric-owner-lean-2026-08-28). Not blocking Furnaceheart fiction.

---

## History (sketch)

### Before the mandate

Smithing guilds were **local** — city stamps, family forges, sect armories. No continent-wide standard. Quality was **buyer beware**.

**Founder myth (lean):** the first **Master Register** was a wartime ledger — names of smiths whose blades **did not snap** when the Warring States turned cultivator. The modern guild is that ledger **with a furnace attached**.

### Dao Wars — the re-armament decade

| Beat | Detail |
|------|--------|
| **Early wars** | Sect forges prioritize disciples; mercenary steel is slag; Hong Lian is **nobody** |
| **Mid war** | Scrapes by on purification work — correct pins, no banner, **refuses dilution** |
| **Late war turn** | Commanders notice blades that **don’t snap**; small **mark** on the tang spreads; powerful come to **him** |
| **Assassination** | One serious night strike — survives; hires **Furnace Wardens**, arms them with his steel |
| **Hong Lian’s rise** | Reputation carried by **weapons**, not charisma — grade language (下品→极品) spreads because pins were **trustworthy** |
| **Charter neutrality** | Codified because all sides already depended on his steel |
| **Post-war** | Imperial mandate recognizes **spirit-iron licensing** — Longcheng branch opens on Guild Row |

**Player memory:** “Every faction hated each other. Everyone still paid the guild.”

### Now

- **Neutral arms dealer** — sells to imperial guard, sect envoys, noble houses, and (quietly) demon cult cutouts if papers look valid.
- **House of Luo** — strongest ore mafia; guild needs their leases; Luo needs guild stamps for export.
- **Tension with Alchemists** — alchemists court the wealthy; forgers court the **violent**. Overlap on patronage, not doctrine.

---

## Player-facing services (by branch)

Mirrors smith ranks in [`forging-equipment-tiers.md`](forging-equipment-tiers.md). **No `forge.reputationXp`** — exams gate **charter upgrades**, not a second grind bar.

| Service | Branch | Gate |
|---------|--------|------|
| **Rank exam** | Zone hub | Smith rank + cultivation minimum |
| **Recipe registration** | Any branch | Artisan+ |
| **Commission post** | Longcheng, HQ | Tier + grade request; NPC masters bid |
| **Spirit-iron license** | Longcheng | FE+ lean |
| **Gear appraisal** | Artisan+ branches | Read grade / hidden flaws |
| **Hire guild smith** | Branch roster | Pay + wait months |
| **Sell forged gear** | Market panel | Artisan unlocks proper sales |

### Exam ceiling (branch vs HQ) — *draft, align with creation-path-guilds*

| Site | Can examine through (lean) |
|------|--------------------------|
| **Zone branch** | Through **Spirit Smith (rank 5)** / tier-5 gear |
| **Longcheng branch** | Through **Dao Smith (rank 7)** — richest branch SKUs |
| **Furnaceheart HQ** | **Law Smith / Forge Saint** — peak grades, charter mastery |

Day-to-day forging should not require a pilgrimage to HQ until **high tier**.

---

## Relationship — House of Luo (罗氏)

**Not the same institution.** Easy confusion — both touch ore.

| | **House of Luo** | **Forgers Guild** |
|--|------------------|-------------------|
| **Type** | Noble house ([`imperial-city-tianjing.md`](imperial-city-tianjing.md)) | Charter guild |
| **Power** | Leases, politics, Longcheng townhouses | Standards, exams, signatures |
| **Wants** | Control export margins | Control **quality meaning** |
| **Player** | Marriage / contract quests later | Craft progression loop |

**Friction:** Luo wants **exclusive** spirit-iron export stamps. Hong Lian wants **open veins** and **merit-based** master ranks. They trade — they do not trust.

### Volume vs quality *(owner lean 2026-08-28 — matches prior dilution lore)*

| | **Forgers Guild** | **House of Luo** |
|--|-------------------|------------------|
| **Product** | **Best** — honest pins, reliable 上品/极品, slower | **Most** — high tonnage, export lots, “good enough” |
| **Speed** | Takes time — purification, no shortcuts | Fast smelt, **diluted** lots, margin on volume |
| **Market** | Premium commissions, charter trust, “wait for Hong Lian” | Undercut unlicensed smiths, flood **common** stock, sell ore + middling ingot to armies |
| **Reputation** | *The blade reads honesty.* | *It’s Luo ore — it’ll do.* |
| **Analogy** | Artisan watchmaker | Steel mill with a noble stamp |

**Not:** Luo doesn’t make **fake** guild stamps (that’s criminal). They make **convenient** metal — export grade that **technically passes** until someone like Hong Lian re-smelts it.

**Player hook:** cheap Luo ingot vs guild-purified stock — save money now vs grade ceiling later.

**Luo lore depth today:** thin — no dedicated doc, no patriarch name. See [rundown](#house-of-luo--locked-lore-rundown) below.

### House of Luo — locked lore rundown

**Status:** sketch only — [`imperial-city-tianjing.md`](imperial-city-tianjing.md) noble table + guild friction in this file. **No** `house-of-luo.md` yet.

| Field | Locked / lean |
|-------|----------------|
| **Hanzi** | 罗氏 |
| **Type** | **Noble house** — not guild, not sect |
| **Origin** | **Forge-town nobles** — grew up around industry, not court blood first |
| **Primary lean** | **Spirit-metal leases, ore politics** — who digs, who exports |
| **Also in** | Formation plate investments; sells to **Sword and Phoenix alike** (neutral profit); hires **Qin** guards; Longcheng **townhouses** |
| **Power band** | Patriarch ~**Nascent Soul** public; hidden **VR** ancestor max (standard noble house rule) |
| **Furnaceheart** | **Compound** near guild — lease scribes, private smelter, export ledgers |
| **vs Guild** | **Volume / margin** vs **quality / truth**; partners who don’t trust each other |
| **Named NPCs** | **None yet** — patriarch, Furnaceheart factor, Longcheng envoy all TBD |
| **Open** | Patriarch name; how corrupt vs merely sharp; cadet branch plot |

**Related noble (not Luo):** **House of Qin** (秦氏) — martial mercenaries; **ore leases with Luo** per imperial-city table.

---

## Dustbone presence (QC starter)

Parallel to alchemy in [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md):

| Actor | Role |
|-------|------|
| **Guild branch (Threshold)** | Register QC recipes, buy/sell **common** gear, apprentice exams |
| **Ironscar quarry** | Feeds **materials**, not guild identity — grit is honest slag |
| **Sunscar / road smiths** | Unregistered makers — cheap, no stamp, no grade guarantee |
| **Player forge chamber** | Same recipes; guild fiction = **when you want the stamp** |

**Lean:** QC forging loop works **without** guild membership; guild adds **exam rank-ups**, **better sell prices**, and **licensed commissions** later.

---

## Cross-links

- Smith ranks, grades, phases: [`forging-equipment-tiers.md`](forging-equipment-tiers.md)
- Sibling guild geography: [`creation-path-guilds.md`](creation-path-guilds.md)
- Noble ore politics: [`imperial-city-tianjing.md`](imperial-city-tianjing.md) (House of Luo)
- Org type rules: [`jianghu-organization-types.md`](jianghu-organization-types.md)
- Frostbite neighbors: [`frostbite-yin-sect.md`](frostbite-yin-sect.md), [`body-path-sect.md`](body-path-sect.md)

---

## Prerequisites

- [x] Guild = charter craft institution, not sect (owner prior)
- [x] Longcheng branch; HQ ore-adjacent (owner prior)
- [x] Smith rank = public reputation — no second rep bar (owner prior)
- [x] **Grandmaster specialty** — ore purification + grade reliability (fundamentals extreme) — owner 2026-08-27
- [x] **Character pass v1** — kind old man, closed eyes, untalented stubborn, late Dao Wars rise — owner 2026-08-27
- [x] **Assassination + Furnace Wardens** — one attempt, hired guards with his gear — owner 2026-08-27
- [x] **Personal craft-titles** — register at Master Smith+; Hong Lian = 诚炉翁 — owner 2026-08-27
- [x] **Chief Examiner UI name** — owner 2026-08-28
- [x] **Furnaceheart atmosphere** — amber haze + Hong Lian as light in the dark — owner 2026-08-28
- [x] **House of Luo** — volume vs guild quality — owner 2026-08-28
- [x] **Forge scope** — metal + leather + fabric under one guild — owner 2026-08-28
- [x] **Furnace Wardens** name locked; Forge Knights reserved — owner 2026-08-28
- [x] **Owner sign-off** — forging pass complete — 2026-08-28
- [ ] **Implementation:** map node · branch NPCs · material tier catalog · forge phases (see [`forging-equipment-tiers.md`](forging-equipment-tiers.md))

## Open questions *(deferred to build — see [Design lock](#design-lock-owner-sign-off-2026-08-28))*

## Implementation crumbs

- Live forge loop: `forge-data.js`, `crafting.js`, `forge-chamber.js`
- Smith ranks today: 4 levels — expand to 9 per [`forging-equipment-tiers.md`](forging-equipment-tiers.md)
- Guild exam UI: mirror formation shelf pattern (`formations.js` F2b) until branch halls exist
- Longcheng Guild Row: attach to `imperial-city-tianjing` map nodes when capital ships
- Phase F stub: Forgers Guild / Longcheng NPC appraiser in forging doc
