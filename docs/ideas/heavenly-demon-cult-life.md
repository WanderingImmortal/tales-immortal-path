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
| **3** | **Feeder** | FE–Core | Devouring Intent awakened; missions with teeth |
| **4** | **Inner Demon** | Core–NS | Relic rites; expand arts; hunted harder |
| **5** | **Maw Elder** (NPC) | NS+ | Teaches law fragments; political liability |

Promotion = **merit + feeding the cell** (resources, kills, fragments handed up), not meditation alone.

**Player terms:** **Listener** = probation. **Outer disciple** = QC + Layer 1 canon. **Initiate** = FE+.

**Inner disciple ceiling (owner lock 2026-07-31):** the cult does **not** use orthodox "inner disciple" at FE. **Initiate** and **Feeder** are still outer-band in prestige — shaped assets, not trusted core. True **inner** standing begins at **Inner Demon** (Core+) — inner halls, relic rites, teaching initiates. High bar = strong sect foundation; FE promotion should not feel like you've "made it."

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
| **Promotion path** | Visible — trials toward Initiate | Must earn **transfer to gorge** or breakthrough + vouch |

**Shared QC rule:** still outer. Still Layer 1. Still no Devouring Intent. Main is **better**, not **good**.

---

## Heavenly Demon Canon — layers (realm-tied)

One `lineageId` (`heavenly_demon_devour_line`). Same pattern as Celestial Sword Canon — **realm-tier manual swap**, **shared layer progress** on GC+ ([`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)).

| Layer | Canon name (working) | Realm / rank | What’s in the box |
|-------|----------------------|--------------|-------------------|
| **1** | **Devouring Scripture** (吞经) | QC · outer disciple / cell | Breathing method + combat syllabus (**parked** — damage rework) |
| **2** | **Stained Foundation** (染基篇) | FE · Initiate | Circulation + **Refinement of Taking** (unlock); seal syllabus at peak |
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
| **Path** | Visible Initiate track | Transfer to gorge if FE + clean record |

**Player sentence:** *The cult is a bad employer and a good bad teacher.*

### Blood pill stipend (competition, owner lock 2026-07-31)

Every **3 months** (same tick as tithe — pay **and** compete):

| Rule | Detail |
|------|--------|
| **Pill** | **Blood Coagulant Pill** (working) — small HP / short combat sustain; cult-made, faint blood taste |
| **Pool size** | **1 pill per 4 outer disciples** (round up) — scarcity on purpose |
| **Who gets it** | Top scorers on **merit ledger** that quarter |
| **Merit sources** | Tithe paid on time, cell tasks done, drill attendance (main), hunt yield, **sanctioned spar win**, envoy praise |
| **Tie-break** | Elder pick (main) or envoy pick (branch) — **politics** |
| **Loser** | Nothing. Go buy mortal balms. |

Encourages rivalry without auto-paying everyone. Top outer disciple title is **meaningful** for one season.

**Not given:** qi restore pills (too generous), intent sparks, law fragments.

### Rivals & devour growth (outer band)

| Beat | Detail |
|------|--------|
| **Rivals** | 2–4 named outer NPCs per cell/gorge cohort — shared bunk, same pill pool |
| **Spar** | Sanctioned under elder eye — **typically to the death** at outer/initiate rungs; winner +merit; loser **fed to the winner** if Layer 2 known |
| **Kill** | Unsanctioned outer-on-outer **outside** drill = breaks Rule 5; **in-hall spar to death** = doctrine |
| **Sanctioned hunt** | Cell sends pairs to field — kill log counts for merit; *"devour the weak prey, not the brother"* — **spar is how brothers are prey** |
| **Groundwork** | Outer kills on **sanctioned** hunts count toward later Devouring Intent groundwork |
| **Betrayal** | Kill **outside** sanctioned spar/hunt → corruption + hunt **by the cell** (you became liability) |

**Spar culture (owner lock 2026-07-31):** lower cult rungs (outer, initiate) — **strong eat weak**. The cell does not waste qi on the humiliated; the winner refines what the loser carried. Higher ranks (Feeder+) may use non-lethal trials for specific rites — exceptions are **named**, not default.

Competition is **merit**, not free PvP in town.

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

**Rising out:** FE breakthrough + cell vouch → **transfer candidate** to gorge, or stay branch Initiate (rarer, less respect).

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

**Promotion to Initiate (FE):** Break through + sponsor approves → Layer 2. Branch initiates often **must** visit gorge for seal rites.

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

**First crown moment:** Devouring Intent born — not chosen from a menu. **Feeder** rank = awakened + merit.

---

### Golden Core — *the maw gets teeth*

| Loop | Feel |
|------|------|
| **Feeder missions** | Hunt cultivators who "waste" qi; retrieve tempered relics |
| **Intent climb** | Gluttony → Bottomless; deepen vs expand choices matter in duels |
| **Domain** | GC claim colors as **predatory pressure** — weak flee, not sword-line purity |
| **Union tech** | Heaven-Defying Swallow online (intent + early law) |
| **Life** | Maybe first **safehouse** rest; still no public mountain |
| **Risk** | Sect hunters; Phoenix pamphlets smear you |

**Intent second act:** post-100-use **Appetite Layers** (parked) — cult-specific deepen tree, not generic +%.

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
