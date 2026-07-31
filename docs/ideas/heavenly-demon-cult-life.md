# Heavenly Demon Cult — life ladder (template sect)

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — vertical slice template) |
| **Blocked on** | Intent/dao redo; hidden faction node |
| **Issue** | none yet |
| **Chat / PR** | Planning chat 2026-07-31 |
| **Updated** | 2026-07-31 (FE initiate slice linked) |

## Intent

**One great sect, end to end** — if Demon Cult life feels good from QC whisper to Dao Seeking feast, copy the pattern for Celestial Sword, Lotus, etc.

This doc is the **player journey**: ranks, realms, what you do each decade, where Devouring Intent and Devouring Law land.

Identity doc: [`heavenly-demon-cult.md`](heavenly-demon-cult.md). Intent: [`devouring-intent.md`](devouring-intent.md). Law: [`devouring-law.md`](devouring-law.md).

**Template rule for other sects:** each great power gets a doc like this — *ranks × realms × loops × intent/dao spine*.

---

## At a glance

| | |
|--|--|
| **Vibe** | Hidden consumption cult — take, refine, become; polite envoys, ugly inner rites |
| **Path** | Qi-primary; **blood-fiend** common; any weapon allowed, none required |
| **Homeland** | **Main:** hidden **Gullet Gorge** (HQ). **Branches:** city cells (Redwell, Heartlands, …) — see [`heavenly-demon-cult.md`](heavenly-demon-cult.md) |
| **Lineage** | **Heavenly Demon Canon** (天魔典) |
| **Crown intent** | **Devouring Intent** |
| **Crown law** | **Devouring Law** |
| **Public face** | Rumors, forged merchants, bounty posters |
| **Life loop** | Feed the cell, hunt sparks, survive exposure, grow the maw |

---

## Ranks (sect interior)

| Rank | Title | Rough realm | What changes |
|------|-------|-------------|--------------|
| **0** | **Listener** | QC | Heard the doctrine; not trusted |
| **1** | **Cell Brother/Sister** | QC–FE | Runs errands; Crimson breath pamphlet |
| **2** | **Initiate** | FE | Blood-fiend seal encouraged; outer techniques |
| **3** | **Feeder** | **GC** | **Taking** (2nd intent realm) + Layer 3; predator missions — **earned**, not groomed |
| **4** | **Inner Demon** | Core–NS | Relic rites; expand arts; hunted harder |
| **5** | **Maw Elder** (NPC) | NS+ | Teaches law fragments; political liability |

Promotion = **merit + feeding the cell** (resources, kills, fragments handed up), not meditation alone.

**Player terms:** **Listener** = probation. **Outer disciple** = QC + Layer 1 canon. **Initiate** = FE+.

**Rank vs realm (owner lock 2026-07-31):** **Initiate** = FE sect rank. **Feeder** = **Golden Core** sect rank — above Initiate, not an FE promotion. **Stirring** at FE is rare; **Taking** at GC is the normal Feeder bar.

**Talent & investment — hands off (owner lock 2026-07-31):** the **gorge does not watch you grow**. Lower-rung elders **might** notice a strong merit line or awakened intent — a ledger tick, a grunt, nothing more. They have seen **centuries** of prodigies; talent alone is a **greenhouse flower**. The cult lets initiates **starve, hunt, and kill each other** in the field; only survivors are worth **investment** — or **consumption** if they fail. Hands off until you prove you are asset, not meal.

**Branch gorge secrecy (owner lock 2026-07-31):** **Initiates are not sent to the gorge** — too low, too disposable, too risky if captured or talkative. Rule 2 stands. Seal rites and Layer 2 gaps are handled **in-cell** (envoy, visiting junior elder, blind routes). **Gorge transfer** is for **GC-era Feeders** who proved they are assets, not FE children on a field trip.

**Inner disciple ceiling (owner lock 2026-07-31):** the cult does **not** use orthodox "inner disciple" at FE. **Initiate** and **Feeder** are still outer-band in prestige — shaped assets, not trusted core. True **inner** standing begins at **Inner Demon** (Core+) — inner halls, relic rites, teaching initiates.

**Branch vs main (owner lock 2026-07-31):** same **rank names**, different **posting**. Both are firmly **outer / QC treatment** — no intent, no inner halls, no trust with secrets.

---

## Main cult vs branch cells

| | **Main cult** (Gullet Gorge) | **Branch cell** (Redwell, etc.) |
|--|------------------------------|--------------------------------|
| **What it is** | Hidden HQ — doctrine, elders, canon archive | Smuggled contact point in the mortal world |
| **QC rank name** | **Outer disciple** | **Cell Brother/Sister** (same layer, worse posting) |
| **Layer 1** | Proper **Devouring Scripture** copy from the archive | **Abridged** pamphlet (same text, no gorge seal) |
| **Shelter** | Outer barracks — shared quarters (basic residence) | **Cell safehouse** — bunk while tithe current; lose access if disowned |
| **Instruction** | Group drills, assigned elder rotation | Envoy checks in monthly; you're on your own |
| **Tithe** | To the gorge — fixed, predictable | To the cell — harsher if harvests were thin |
| **If caught** | Gorge may send lawyers / silence / revenge | **Deny you** is default |
| **Promotion path** | Visible — trials toward Initiate | Earn **GC/Feeder** before gorge is even discussed |

**Shared QC rule:** still outer. Still Layer 1. Still no Devouring Intent. Main is **better**, not **good**.

---

## Heavenly Demon Canon — layers (realm-tied)

One `lineageId` (`heavenly_demon_devour_line`). Same pattern as Celestial Sword Canon — **realm-tier manual swap**, **shared layer progress** on GC+ ([`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)).

| Layer | Canon name (working) | Realm / rank | What’s in the box |
|-------|----------------------|--------------|-------------------|
| **1** | **Devouring Scripture** (吞经) | QC · outer disciple / cell | Breathing method + combat syllabus (**parked** — damage rework) |
| **2** | **Stained Foundation** (染基篇) | FE · Initiate | Circulation + **Remnant Refine** (conversion); seal syllabus at peak |
| **3** | **Feeding Rites** (饲魔篇) | Core · Feeder | Devouring Intent techniques; mission arts |
| **4** | **Inner Maw** (内噬篇) | NS · Inner Demon | Expand arts as techniques; relic rites |
| **5+** | **Heaven’s Receipt** (天账篇) | Dao Seeking+ | Law fragments + union arts; elder-only beats |

**Layer 1 detail (owner lock 2026-07-31):**

| Slot | Art (working) | Role |
|------|---------------|------|
| **Breath** | **Outer Devouring Breath** (Devouring Scripture ch.1) | Apex QC method — `lineageId: heavenly_demon_devour_line`; **gorge name**; branch gets abridged pamphlet only |
| **Combat 1** | **Gnawing Palm** | Light qi nip — teaches *take a little* — **parked** |
| **Combat 2** | **Blood Refining Art** | Exists today — outer steal |
| **Combat 3** (optional) | **Flee and Feed** | Utility — escape + small heal on kill — **parked** |

**Combat arts parked (owner 2026-07-31):** Gnawing Palm, Flee and Feed, and new Layer 2 arts wait on **damage system rework**. Layer 1 lifestyle (breath, tithe, hunts, merit) does not depend on them.

Outer disciples get **Layer 1 only** (main or branch). No intent curriculum. No law. Branch pamphlets may be **incomplete**; main copies are **sealed**.

### Theme lock — devouring ≠ hunger (owner 2026-07-31)

**Devouring** = **consume, take, assimilate, use for yourself** — qi, merit, technique echo, fear, resources, life. **Hunger / maw / feast** are *imagery*, not the whole doctrine. Outer syllabus teaches **small takings** before the great ones.

**Naming:** **No "Cell" in gorge-facing text** — that word is branch slang only. Main outer disciples learn **Outer Devouring Breath** from sealed **Devouring Scripture**.

### Layer 1 manual — what Devouring Scripture actually does

**Cultivation method:** *Heavenly Demon Canon · Devouring Scripture* (ch.1: **Outer Devouring Breath**). Apex-cult QC breath — refined, not a crude forbidden pamphlet.

| Effect | Detail |
|--------|--------|
| **Gather** | **Strong common–superior tier** for QC (cult invested in the art) — competes with sect heir breaths |
| **Stability** | **No manual penalty** — demonic cultivation done *correctly* is not "leaky" |
| **Power** | Combat-qi lean — breath channels killing momentum into the dantian **cleanly** |
| **FE seal** | If still primary at Seal → often stamps **`blood_fiend`** — **chosen cult identity**, not a cracked foundation |
| **Unlocks** | Outer combat syllabus when shipped — Blood Refining exists today; Gnawing Palm / Flee and Feed **parked** |
| **Branch pamphlet** | Incomplete copy may **lack pages** — downside is **access**, not art quality |

**Not in Layer 1:** intent, law, meridian canon.

#### Where the downsides actually live (not the manual)

| Downside | Source |
|----------|--------|
| **Orthodox shunning** | Markets, healers, sects refuse or overcharge; bounty risk |
| **Corruption / sacrilege** | **Your acts** — massacre feeding, forbidden rites, mandate bites ([`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md)) |
| **Cult predation** | Tithe, disown, hunt — the cell eats you too |
| **Personality / rumor** | NPCs say you're cold, hungry-eyed; harmony sects won't hire you — **social**, optional light dialogue flags |
| **Exposure** | Walking the proper path hates you; that's the price of apex demonic lineage |

**Design lock:** do **not** nerf `stabilityBias` or foundation quality on cult canon methods in data — when implemented, Devouring Scripture should be a **good** method with a **bad reputation**.

#### Manual presentation (player-facing)

| | **Main gorge** | **Branch pamphlet** |
|--|----------------|---------------------|
| **Title** | *Heavenly Demon Canon · Devouring Scripture* (Layer 1) | *Devouring Scripture* (abridged) — **no** "cell" on cover |
| **Ch.1** | **Outer Devouring Breath** | Same art name; may lack later chapters |
| **Opening line** | *"What heaven takes, the wise take first. What others hold, you refine into yourself."* | Same; cheap ink |

```
封面  Cover — open maw sigil
第一章  Ch.1 — Outer Devouring Breath
第二章  Ch.2 — Gnawing Palm
第三章  Ch.3 — Blood Refining Art
第四章  Ch.4 — Flee and Feed
封底  Back — Five Takings (outer rules)
```

---

## Outer disciple benefits (why stay?)

Downside is tithe, predation, exposure. Upside must be **real** or the loop is just punishment.

| Benefit | Main gorge | Branch cell |
|---------|------------|-------------|
| **Residence** | Shared **outer barracks** — free rest, better than inn while posted | **Safehouse bunk** (2–4 cots) while tithe **current** — not ownership, not privacy |
| **Manual** | Sealed Layer 1 + hall cultivate time | Pamphlet Layer 1 + alone |
| **Instruction** | Drills, elder correction | Envoy tips only |
| **Blood pills** | Quarterly **merit pool** (see below) | Same pool — **win or go without** |
| **Black route** | Gorge storehouse prices | Cell dead-drop catalog (thin) |
| **Rivals** | Barracks pecking order, sanctioned spars | Cell "brothers" competing for envoy favor |
| **Growth hook** | Kill/devour in **trial hunts** (intent groundwork later) | Field kills + cell tasks feed competition score |
| **Path** | Visible Initiate track | Stay branch until **GC/Feeder** merits gorge transfer — not FE |

**Player sentence:** *The cult is a bad employer and a good bad teacher.*

### Blood pill stipend — by rank band (owner lock 2026-07-31)

Same **3-month tick** as tithe. Pill = **Blood Coagulant Pill** (working) — small HP / combat sustain; cult-made.

Mechanism **changes by stage** — not one rule for everyone.

#### Outer (QC) — merit pool, winner-take-all

| Rule | Detail |
|------|--------|
| **Pool** | **1 pill per 4 outer disciples** (round up) |
| **Who gets it** | Top merit scorers that quarter |
| **Merit** | Tithe, tasks, drill, hunt yield, spar win, envoy praise |

Scarcity on purpose. Most get nothing.

#### Initiate (FE) — **separate pool**, still lethal competition

| Rule | Detail |
|------|--------|
| **Pool** | **1 pill per 4 initiates** — **not** shared with outers |
| **Who gets it** | Top merit that quarter (same sources + Layer 2 hunts) |
| **Rivals** | **No persistent rival loop** — lethal spars **kill** too often; bunkmates rotate. Named NPCs exist; don't invest comeback fiction |

Initiate = different **pool**, same **cutthroat** economy. Death is cheap; the cult doesn't groom recurring duelists.

#### Feeder (GC) — **ranked stipend** + rival loop

| Cohort rank (quarterly) | Pills / quarter |
|-------------------------|-----------------|
| **1st** | **2** |
| **2nd** | **1** |
| **3rd** | **1** |
| **4th+** | **0** (buy mortal balms) |

**Ranking** from merit ledger + **sanctioned feeder spars** (see rivals below). Predictable income — stage feels different from initiate scramble.

**Not given at any band:** qi restore pills, intent sparks, law fragments.

### Rivals & spars — by rank band (owner lock 2026-07-31)

#### Outer + Initiate — lethal default

| Beat | Detail |
|------|--------|
| **Rivals** | 2–4 names per cohort — **replaceable** when spar kills |
| **Spar** | Sanctioned — **typically to the death**; winner +merit; loser fed to winner if Layer 2 |
| **Hunts** | Sanctioned field kills — merit + groundwork |
| **Betrayal** | Unsanctioned kill → corruption + cell hunt |

#### Feeder (GC) — **persistent rivals** + investment calculus

| Beat | Detail |
|------|--------|
| **Rivals** | **2–3 persistent** named Feeders in your cohort — same pill ladder, years of overlap |
| **Spar default** | **To yield** or elder **stops** before death — you've been **invested in**; dying for nothing wastes resources |
| **Death match** | **Sanctioned only** — high merit stake, elder present; *not* casual bunk beef |
| **Comeback loop** | Lose a ranked spar → rival climbs pill rank; rival **trains** (3–6 months fiction) → returns **stronger**, not instant outclass — capped growth per arc so player can rematch |
| **Player loss** | Drop rank, lose stipend tier; train, hunt, rematch — same comeback rules apply to you |
| **Sacrifice** | Cult **will** spend you on suicide missions, bait, siege — **for gain**. Not petty hall murder |

**GC doctrine:** *"The maw does not throw away meat it already swallowed."* — sacrifice is strategic, not wasteful.

**Spar culture summary:** outer/initiate = strong eat weak. Feeder = strong **test** weak, but stock is **inventory** until spent usefully.

Competition is **merit**, not free PvP in town.

### Merit ledger (owner sketch 2026-07-31)

**Two jobs:** (1) **track disciple ranking** within cohort/cell/branch; (2) **gate access** to sect resources (blood pills, hall time, trials, Layer pages).

| Source | Weight |
|--------|--------|
| Tithe on time | Baseline |
| Sanctioned hunts / kills logged | High |
| Spar outcomes | High |
| Drill / task completion | Medium |
| Envoy / elder praise | Low — rare |

**Cult disposition:** rank is **not** merit alone. **Sheer strength** (realm, fight record, last spar) can bump ledger standing — *"The gorge respects teeth."* Tie-breaks and demotions use strength when merit is close. Hands-off, but the ledger is real.

**Player-facing:** quarterly placement (*"2nd of 11 initiates"*) — progression feedback without mentorship fiction.

**Initiate v1:** merit drives **initiate-only pill pool**; full ledger UI TBD.

---

## Outer disciple rules (The Five Takings — working)

Rules taught with Layer 1. Break them → demotion, disown, or **fed to a Feeder**.

| # | Rule | Plain meaning |
|---|------|----------------|
| **1** | **What you take, the maw takes first** | Tithe on time. Cell/gorge before personal hoarding. |
| **2** | **Do not name the gorge in town** | No HQ location, no elder names, no routes. |
| **3** | **Do not consume in the open** | No blood arts on main street; cultivate in safehouse/hall. |
| **4** | **Outer takes only what is given** | Hunts, trials, sanctioned spars — not random citizens or unsanctioned brothers. |
| **5** | **The cell settles outer disputes** | No guard, no public duels — bring it to envoy / drill master. |

**Unspoken 6:** *If you are disowned, you were never ours.*

Main adds barracks discipline (curfew, rotation). Branch adds *never lead hunters to the safehouse*.

---

## Life by realm (what you're actually doing)

### Qi Condensation — *outer disciple at the main cult*

**Status:** Lowest rank **at the gorge**, but you're on **sacred soil**. Expendable still — initiates die in drills — yet you're not a throwaway asset like a branch cell.

**How you're treated:**

| Who | Treatment |
|-----|-----------|
| **Elders / drill masters** | Cold, exacting — *"The maw has many teeth; prove you are not food."* |
| **Senior outer disciples** | Pecking order, spars, shared quarters |
| **Inner ranks** | You bow; they don't learn your name until you break through |
| **The doctrine** | *"Starve with discipline. Feed the gorge. Earn Layer 2."* |

**Simple monthly loop:**

```
1. Cultivate  — Layer 1 in assigned hall (not hiding in an inn)
2. Drill      — group breath + basic combat under elder eye
3. Gorge task — quarry, hunt, kitchen, wall patrol — rotation
4. Tithe      — fixed quota to the main storehouse
5. Report     — attendance; absence without leave = demotion or expulsion
```

**What you have:** real canon copy, barracks (**basic residence**), peers, merit shot at **blood pills**, a **path** if you survive FE.

**What you don't have:** intent, inner halls, law, elder trust, freedom to leave easily, private room.

---

### Qi Condensation — *branch cell (Cell Brother/Sister)*

**Status:** **Expendable.** The cell owns your usefulness. Not family. Not gorge stock.

**How you're treated:**

| Who | Treatment |
|-----|-----------|
| **Envoy / cell lead** | Polite, vague, always watching if you talk |
| **Main cult** | You don't exist until you transfer or break through loud enough |
| **Mortals** | Normal — you hide the pamphlet |
| **Orthodox cultivators** | Dangerous if they smell blood on your breath |
| **The doctrine** | *"Starve quietly. Feed us. Become useful."* |

**Simple monthly loop:**

```
1. Cultivate  — Layer 1 breath when safe (often alone)
2. Cell task  — deliver, collect, look away, one small hunt
3. Tithe      — stones or reagents to the cell (not optional)
4. Live       — rent, jobs, field — you're still a townsperson with a secret
5. Report     — monthly check-in; miss twice → cut loose (or worse)
```

**What you have:** Layer 1 pamphlet, **safehouse bunk** (if tithe paid), merit competition for **blood pills**, rivals, cell tasks.

**What you don't have:** gorge protection, drills, sealed canon, privacy, pills if you rank low.

**Rising out:** FE breakthrough on branch = **Initiate** with cell seal and incomplete Layer 2 — normal. **Gorge transfer** only after **GC + Feeder** (or exceptional merit); Initiates are **not** sent to HQ.

#### Branch tithe loop (owner lock 2026-07-31)

Branch life needs **manual pressure** — not a menu checkbox. You **go pay** or you **fall out of favor**.

| Beat | Detail |
|------|--------|
| **Cadence** | Every **3 months** (calendar tick) — envoy message or dead-drop window opens |
| **Pay how** | Meet envoy at tavern / marked ruin / night market stall; or leave stones + reagents at **cell dead drop** |
| **Amount** | Scales lightly with realm (QC low, FE higher); thin harvest months = **same demand** (cult doesn't care about your job drought) |
| **On time** | Brief nod. Maybe a task offer. Rep holds. |
| **Miss once** | Warning line: *"The maw remembers what it is owed. Do not withhold twice."* |
| **Miss twice** | **Disowned** — pamphlet burns worthless; no Layer 2 path; cult rep crashes |
| **Miss twice + knew secrets** | **Hunted** — cell sends a Feeder to recover tithe **with interest** (ambush event, not instant game over) |
| **Pay while disowned** | Too late for trust; may only buy **silence** (expensive) not reinstatement |

**Player fantasy:** cult is useful (canon, path, identity) but **predatory** — same doctrine that teaches devouring applies to *you* if you stop feeding them.

**Main cult contrast:** gorge outer disciples tithe on-site (storehouse rotation). **No travel loop** — absence from drills is the parallel failure mode.

**Survive and grow:** tithe forces jobs, field, sell loot — ties branch QC into Redwell economy without new zone lore. FE breakthrough + clean tithe record = stronger **transfer** pitch to gorge.

---

### Qi Condensation — *Listener (before outer / cell)*

| Loop | Feel |
|------|------|
| **Contact** | Envoy pamphlet, tavern rumor, forbidden shelf in wrong city |
| **Listener tasks** | One-off errands; no canon yet — *"see if you can keep a secret"* |
| **Combat** | Whatever you had before; cult teaches **survive**, not dominate |
| **Risk** | Lowest; envoy vanishes if you blab |

Listener → outer / cell = pass a **silence test**. Main: inducted at gorge. Branch: receive **Layer 1 pamphlet**.

**Promotion to Initiate (FE):** Break through + sponsor approves → Layer 2. **Branch:** seal and manual stay **cell-side** — no gorge travel ([`heavenly-demon-cult-fe-initiate.md`](heavenly-demon-cult-fe-initiate.md)).

---

### Foundation Establishment — *Anchor the stained seal*

**Full slice:** [`heavenly-demon-cult-fe-initiate.md`](heavenly-demon-cult-fe-initiate.md) — main vs branch, Layer 2, loops, Feeder promotion.

| Loop | Feel |
|------|------|
| **Rank** | **Initiate** — Layer 2 **Stained Foundation**; **taking unlock** mid-FE; blood-fiend seal at **peak** |
| **Chamber** | Same FE grind as everyone; cult adds **fasting meditations** (flavor months) |
| **Awaken intent** | Groundwork + spark — Maw-Womb Shard, envoy trance, witness feed ([`devouring-intent.md`](devouring-intent.md)) |
| **Techniques** | Blood Refining Art exists today; new form arts **parked** (damage rework) |
| **Life** | Main: initiate hall + hunt teams; Branch: rent, bounty 1, higher tithe |
| **Pacing** | Inferior root **peak FE ~80–90** — decades as Initiate is normal |
| **Risk** | Exposure, orthodox shunning, cult disown if tithe breaks |

**First crown moment (Initiate):** Devouring Intent **Stirring** born — not chosen from a menu. **Feeder** rank comes at **GC** with **Taking** (see intent doc).

---

### Golden Core — *the maw gets teeth* (Feeder rank)

| Loop | Feel |
|------|------|
| **Feeder missions** | Hunt cultivators who "waste" qi; retrieve tempered relics |
| **Pill stipend** | **Ranked** quarterly — 1st gets 2, 2nd–3rd get 1 ([`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md)) |
| **Rival loop** | **Persistent** cohort rivals; spars to yield; comeback arcs — not initiate slaughter |
| **Investment** | Cult won't let you **die for nothing** in a bunk spat; **will** sacrifice you when worth it |
| **Intent** | **Taking** (2nd realm) normal here; Feast later |
| **Life** | Safehouse, predator missions, bounty tier 2 |
| **Risk** | Sect hunters; you're visible now |

---

### Nascent Soul — *hunted apex predator*

| Loop | Feel |
|------|------|
| **Inner Demon** | Relic custody; teach initiates; envoy to other cells |
| **Intent** | Maw Domain; divided heart if you kept a weapon intent |
| **Law prep** | Fast nine days; witness elder feed; first **Morsel** fragment |
| **Life** | Name on charters; Lotus might trade silence for leverage |
| **Risk** | Assassination quests from "righteous" sects |

---

### Dao Seeking — *Devouring Law*

| Loop | Feel |
|------|------|
| **Fragments** | Receipt of Heaven's Tax; forbidden ground clears ([`devouring-law.md`](devouring-law.md)) |
| **Comprehend** | Months in cell archive — not open Intent Pool like Sword Sect |
| **Techniques** | Law arts (buff peel, formation gnaw); union arts at peak |
| **Life** | You are **infrastructure** — cult sends you to bite zone problems |
| **Risk** | Mandate Bite–tier sacrilege if careless |

**Dao does not replace intent** — form vs law vs union.

---

## Daily / monthly loops (sect skin)

Copy this table when designing Sword / Lotus life:

| Loop | Demon Cult flavor | Generic sect equivalent |
|------|-------------------|-------------------------|
| **Contribution** | Feed the cell (reagents, kills, tithe) | Sect merit / missions |
| **Teach** | Initiates copy your hunger | Outer court drills |
| **Market** | Black route; forged papers | Sect quartermaster |
| **Rest** | Safehouse (if rank) | Residence / inn |
| **Rumor** | Who's hunting feeders this season | Charter politics |
| **Cultivate** | Canon method + fasting beats | Lineage manual |
| **Combat** | Intent expression + later law procs | Intent / dao per sect |

---

## Join paths (player choice)

| Path | Fantasy |
|------|---------|
| **A — Envoy** | Redwell rumor → meet Envoy of the Third Maw → quests → outer disciple |
| **B — Forbidden manual** | Find cult syllabus page → cell contacts you |
| **C — Survival** | Near-death vs demon tagged foe → mirrored hunger spark |

All paths converge at **Initiate** rank; awakening still needs spark + groundwork.

---

## What makes this a useful template

When Celestial Sword (or another sect) gets the same pass, copy sections:

1. **At a glance** — vibe, path, lineage, crown intent, crown law  
2. **Ranks** — 5–6 interior titles tied to realms  
3. **Life by realm** — loops, risks, crown moments  
4. **Daily loops table** — reskin contribution/teach/market  
5. **Join paths** — 2–3 entry stories  
6. **Intent doc + Law doc** — separate technique families  

Demon Cult is first because it's **deviant** (non-weapon intent) and **hidden** (forces rumor/bounty loops orthodox sects skip).

---

## Prerequisites

- [ ] Intent + dao system redo (gates, families)
- [ ] One playable join path (envoy chain)
- [ ] Gullet Gorge zone (later — not v1)

## Open questions

- Tithe % vs flat cell fee — **branch: 3-month manual pay stub** (see branch tithe loop)
- Hunt event severity when disowned (ambush tier vs bounty poster only)
- Can player lead a cell (sect founder parallel)?
- Expose Maw Elder as recurring NPC name

## Implementation crumbs

- Faction `heavenly_demon_cult` rep + ranks on `G`
- Story `fate: demon_cell` / envoy arc
- Bounty board hooks in Redwell
