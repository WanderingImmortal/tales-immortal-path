# Poison path — load, crafting, legendaries

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Unified affliction + alchemy tab slice; combat-damage **systems** optional for v1 (target tags only) |
| **Issue** | none yet |
| **Chat / PR** | Cloud design chat — `cursor/poison-design-doc-80ac` |
| **Updated** | 2026-10-05 |

## Intent

Poison is **crafted from ingredients and skill**, not chosen from a fixed type chart. Each vial is a resolved instance (toxicity, dominance, load, lethality, stickiness, grade). Victims carry **poison load** until passive metabolism, active detox, or a **paired cure** clears it. Lethal overworld outcomes are allowed when load stays critical and the player ignores obvious warnings — reincarnation is the lesson. **Legendary** poisons are **recognized formulas with history**, not stat cheats.

Related: [`combat-damage-depth.md`](combat-damage-depth.md) (inner/outer systems), [`forging-equipment-tiers.md`](forging-equipment-tiers.md) (battle coats), [`imperial-city-tianjing.md`](imperial-city-tianjing.md) (Poison Guild), [`gu-cultivation-system.md`](gu-cultivation-system.md) (symbiosis later — not poison reskin), [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md) (materials).

---

## Core model: poison load (not fuel)

- **Poisoned?** Load &gt; 0 on a **channel** (blood/flesh, structure, circulation, core — same vocabulary as combat systems). Apex toxins may bind **multiple channels** in one affliction (see Immortal's Rest).
- **How bad?** **Severity bands** derived from load: lightly → moderately → severely → critically.
- **Each tick** (combat exchange or world month): apply **symptoms at current severity** (HP, debuffs, map pressure). Load is **not** “spent per hit” like ammo.
- **Big dose** = start high on the bar and **stay** harmful longer as load clears — not “more toxin = bigger damage every tick.”

### Severity (UI)

| Load band (tune) | Label | Player read |
|------------------|-------|-------------|
| Low | Lightly | Chip, inhibition |
| Mid | Moderately | Real regen / stat drag |
| High | Severely | Fight shape changes |
| Very high | Critically | Lethal map warnings |

Show: **name** (or “unknown tincture”), **band + bar**, **trend** (worsening / stable / easing), optional **load %** for nerds.

---

## Crafting (emergent + saved formulas)

- **No fixed dev recipe catalog** for ordinary play. Reagents carry **affinities** (system lean, sharp vs lingering, stabilizers) → **resolver** outputs a **vial instance**.
- **Player formulas:** saved ingredient mix + optional name (“Redwell alley blend”). Re-brew runs failure / waste / potency variance again.
- **UI:** separate **Toxins** tab in **Alchemy Chamber**; shared skill, materials, cauldron/flame; output = vials and coats, not pill tiers.
- **Skill:** failure chance, material waste, potency variance (same mix → slightly different stats). Optional later: identify unknown vials.

### Legendary recognition

World data holds **recognized formulas** (canonical mix ± tolerance, aliases, lore, sect secrets). When a brew **matches**, UI/lore: *“This matches [name].”* Stats still from **resolver + skill** unless optional “authentic key reagent” micro-bonus. Fame = NPC fear, quests, antidote economy — not a hidden damage multiplier.

---

## Vial stats (data shape)

| Field | Role |
|-------|------|
| **Toxicity** | vs **apply resist** on hit; contributes to **cleanse burden** |
| **Dominance** | Channel control; stacking rules |
| **Load applied** | How much toxin sticks (after resist) |
| **Lethality** | Harshness at a severity band (HP/month, debuff weight) |
| **Stickiness** | Multiplier on **passive** clearance (0.3 = binds) |
| **Clearance floor** (optional) | Passive cannot drop load below band until specific cure / heavy active detox |
| **Poison grade** | Emergent from reagents + crafter realm + skill; “meant for” which cultivators |
| **Target system lean** | Which channel primarily receives load |
| **Onset** (optional) | Slow poisons: fraction of load activates over first N months |

---

## Resistance & clearance

### Baseline mortal

Humans get **small base poison resist** (~5–10 on a 0–100 scale — tune). Implies **small passive clearance**, not zero: ignoring a **real** toxin still kills; treating a street poison like a cold **inhibits** you until you **actively** refine (qi detox, seclusion, antidote, guild).

### Passive clearance

- Driven mainly by **poison resist** (+ **realm vs poison grade**: higher realm clears poisons “meant for” lower grades faster).
- **Cap:** passive alone cannot clear past a **floor** on sticky / legendary toxins.
- **Stickiness** on the vial slows passive clear.

### Active clearance

- Antidotes, techniques, detox projects — large load drops or bypass passive cap.
- **Cleanse burden** on poison gates **active** clears (weak pill vs stubborn toxin).
- **Specific cure:** some legendaries require **named materials** (as hard to source as the poison). Generic antidote partial at best.

### Apply vs metabolism (open)

Default recommendation: **one poison resist** for both “how much sticks” and passive clear until playtest says split (e.g. pills that help metabolism only).

---

## Stacking & dominance (same channel)

One **dominant** profile per channel for pulses.

| Situation | Rule |
|-----------|------|
| **Higher dominance** | New poison becomes dominant; **one-time salvage** (~25–40% of old **remaining load** folded into new). Can **worsen** severity. |
| **Lower dominance** | **No meaningful load add** — blocks “one god poison + infinite cheap vials.” Flavor: inferior toxin fails to take hold. |
| **Same dominance band** | **Partial load add** (~25–40% of new vial’s load) — extends duration / depth, not full second dose. |
| **Similar toxicity** (±15% band) | Optional **merge** load; dominance within band. |
| **Different channels** | Independent (blood + meridian both run). |

Optional second gate for feeding: new **toxicity** must be ≥ ~50–60% of dominant’s to add load in same band.

---

## Combat vs overworld

- **Same load pool**, not 1 turn = X months.
- Combat: apply symptoms each exchange; clearance per exchange (optionally faster under stress — tune).
- Map: symptoms + **lethal** if critically loaded; **obvious** HUD + confirm on time advance when critical.
- **Enemies:** full affliction model eventually; v1 **templates** (same fields as vials). Player → enemy uses full crafted instances.

### Migration note

Today `combat.js` uses `poisonTurns` / `poisonDmgPct` on `combatStatus` (fight-only). Replace with **`G.afflictions[]`** (or equivalent) when implementing.

---

## Ship slices (suggested)

1. Resolver + vial + affliction + combat ticks (toxicity, load, passive clear stub)
2. Toxins tab + **saved formulas**
3. Skill: failure, waste, potency variance
4. Map drip + lethal warnings + resist-driven passive clear + cap
5. Dominance stacking
6. Legendary recognition + one exemplar (below) + specific cure content

---

## Open questions

- [ ] Single resist vs apply / metabolism split
- [ ] Critical band: **steady** HP loss vs **escalating** neglect
- [ ] Poison grade: purely emergent vs legendary **minimum grade**
- [ ] Exact dominance band width and partial-load %

---

## Implementation crumbs

| Area | Files / hooks |
|------|----------------|
| Alchemy UI | `alchemy-chamber.js`, `alchemy-data.js`, `alchemy.js` |
| Combat | `combat.js`, `combat-spine.js` → unified hit profile later |
| Body resist | `body-chamber.js` (`poisonResistPct`, `diseaseResistPct`) |
| Materials | `data.js` explore loot, future toxin reagents |
| World time | `world-scheduler.js` affliction tick |
| Death / lesson | `legacy.js` reincarnation |
| Coats | `forging-equipment-tiers.md` battle coat hook |

---

## Legendary exemplar (playtest) — **Immortal's Rest** (仙眠)

Primary stress test: **dual-channel** load, **insidious onset**, apex **grade / stickiness / cleanse burden**, myth-heavy recognition. Jianghu-tier legendaries (e.g. Ledger Bind) reuse the same template at lower power later.

### At a glance (spec sheet)

| | |
|--|--|
| **Role** | Poison Guild **deterrent myth** + apex mechanical test |
| **Channels** | Circulation + Core (one affliction, two loads) |
| **Delivery** | Lore: **ingested** (truce cup, wine); combat: **ingest or coated wound** — not miasma cloud (owner lean) |
| **Who brews** | Guild claims monopoly; player can match **recognition mix** if they obtain keys — proof is dangerous |
| **Ancient victim (scroll)** | **Qing Meridian** (~55k y BP) — maybe real, maybe parable |
| **Modern 仙眠 victim** | **None attested** — hazy disappearances **rumored** to be 仙眠; **no** named Pei tie (author) |
| **Truth in save** | **None by default** — **no** confirmed 仙眠 deployment; **no** attested Immortal kill |
| **Deterrent today** | **Unspent myth** + Qing depth + core/circulation **theory** + maybe stock |
| **DM-tier menace (daily)** | **Poison dao** broadly — crafted grades, coats, jianghu legendaries — **not** 仙眠 |

### Design intent (mechanics)

- **Kill vs hamper:** **no confirmed Immortal kill** in canon the game asserts. On **true Immortals**, owner lean: **significant hamper** (core / circulation load, costly cleanse, charter-scale embarrassment, maybe centuries of weakened claim) — **lethal outcome left vague** until playtest / late content.
- **Peak Manifestation** is the proven fear band; **Immortal** is the **rumor ceiling** the guild sells.
- **Insidious onset**, dual channel, project-tier brew/cure — unchanged below.

---

### Who did it kill? Were they real? (author working truth)

The **playable default** is: **no save flag** says who died or whether 仙眠 was in the cup. For writing and rumor tiers, use this **working** table (adjust in content, don’t hard-code one truth):

| Figure | Real person? | Real 仙眠 kill? | What most powers **believe** today |
|--------|----------------|-----------------|-----------------------------------|
| **Qing Meridian** (~55k y BP) | **Probably** a real specialist class (vein-calibrators existed); **this name** may be guild brand on an anonymous corpse | **Unknown** — scroll describes the **syndrome** (ash core, sweet meridians) more reliably than the man | “The poison is **older than the mandate**” |
| **Pei Wuxin** (~380 y BP) | **Probably** real audit; **disappearance** real; cause contested | **Unproven** — qi deviation, silence buyout, and 仙眠 are all plausible in fiction | “It **still happens** in living memory” (380y is **yesterday** to a 50k-year patriarch) |
| **Any true Immortal** | N/A | **No attested case** in records players trust | “Even **仙** might not wake” — **hamper / scar**, not proven slay |

**Nobody credible claims** the sleeping Tian founder was tested. Deterrence today is **not** “we killed an Immortal once” — it is “this toxin **eats the same anchors Immortals still use** (core, circulation), antidote is **almost as hard as the brew**, and the guild **might** still have a page.”

**Why that deters **present-day** Immortals and half-steps:**

- They already **fear core damage** more than HP ([`combat-damage-depth.md`](combat-damage-depth.md)) — 仙眠 hits both inner channels.
- **Cleanse burden 98** + paired cure = a **project**, not a pill — public Immortal acting against the guild risks **visible weakness** or **centuries** tied to detox ([`immortal-powers-adaptation.md`](immortal-powers-adaptation.md) — authority with witnesses).
- **Mutual deterrence:** wiping the guild might expose **noble invoice chains**; Assassins and Lotus both **lose** if the gray market collapses.
- **Optional whisper (never confirmed):** a post-war sect Immortal **refused to chair a purge vote** after a sealed vial was shown — story only.

Mechanics stay **grade 8–9** for data; **Immortal NPC** hooks = heavy debuff / plot malus, not `if (immortal) die`.

---

### How the story **shifted** (legend morph)

| Phase | What changed |
|-------|----------------|
| **~55k y — scroll** | Clinical **syndrome name** tied to **Qing** (or placeholder “the calibrator”). No guild brand yet — a **pharmacopeia warning**. |
| **~75k–5k y — trade era** | Syndicates **rename** the syndrome **仙眠**; sell **antidote anxiety**; “do not exterminate the mixers.” Victim becomes **parable**, details drop. |
| **Dao War cascade** | Rumor **weaponized**: coalitions recall **near-purge aborted** when a negotiator mentioned the redacted formula. Qing and Pei **not yet one story**. |
| **~450 y — reconstruction** | Guild **re-brews** with modern reagents; **unifies** scroll + assassin notes; **Pei** chosen as **relatable** modern face (auditor, not war god). |
| **~380 y — Pei moment** | Ballads **merge** Pei + 仙眠; **Meridian King** fiction **replaces** boring job title for street spread. |
| **Imperial Sky now** | **Redacted page** in Longcheng; **Immortal** is public category → name reads **louder** than at scroll time; **same** toxin, **stronger** marketing. |

**Pattern:** body (**syndrome**) stays stable; **victim** and **title** get **upgraded** for each audience (scholars → Qing, jianghu → Pei, charter politics → “even 仙 sleeps”).

---

### How the **rumor spread** (and keeps spreading)

**Not** one true broadcast — **layered** channels (unlock by fame, sense, gray rep):

1. **Guild apparatus** — apprentice oath on Pei’s name; **empty vault** tour; price lists with **仙眠: inquiry only**; forged scraps **leaked on purpose**.
2. **Assassin songs** — cup imagery, **deny** supplying toxin (credibility through false denial).
3. **Sect archives** — Lotus: **ash-core slumber** theoretical; Sword: “purge is **not** worth the core risk” (internal minute, leaked).
4. **Apex memory** — patriarchs who lived **Vein charter wars** remember **the sign**, not Pei; they **vouch** the guild is ancient; that **validates** the nuke without confirming stock.
5. **Charter politics** — failed **young** Immortal or half-step **never** gets “guild extermination” on agenda; players hear *“the vote did not happen”* without minutes.
6. **Player** — brew match → recognition line; **proof** is self-incriminating.

**Weight test for “would Immortals **today** care?”** **Yes**, if you sell **core/circulation risk + political stain + maybe stock**, not **“we murdered 仙 once.”** The Pei refresh (**380y**) makes it **recent gossip** for long-lived apex; Qing makes it **deep time** for scholars — **two speeds**, one fear.

---

### Legend (myth as weapon — summary)

**Immortal's Rest** is the Poison Guild’s **metaphorical nuke**: unverified recipe, unsigned kills, **hesitation to extirpate**. Ancient **org**; **~450y** **reconstructed** brew (modern reagents). See Qing / Pei sections below for victims.

**Owner lean on origin:** guild **ancient** across Warring States; **lean B** = latest working mix is **reverse-engineered**, not that the guild is young.

---

### “Immortal” in the name

**仙** predates public ascension — threshold **above Manifestation** in scrolls. Mandate-era Immortals made the ladder **visible**; the poison name **gained** deterrence, not new chemistry. On a **true Immortal**, treat as **hamper / costly cure / rumor**, not proven kill.

---

### Timeline (author spine — [`world-timeline-author-spine.md`](world-timeline-author-spine.md))

Anchors use **~100,000-year Warring States** + **~3,000-year Imperial Sky** ([`world-timeline-author-spine.md`](world-timeline-author-spine.md) owner lean 2026-10-04). Tune when the calendar exists.

| When (before present) | Beat |
|------|------|
| **~75,000–85,000 years** (**Vein charter wars** slice) | **Poison trade confederacies** cross faction lines — precursors to the guild name. |
| **~55,000 years** (**Fragment hunts** slice) | Pharmacopeia fragment records **仙眠** and **Qing Meridian** (青脉真人). Guild claims lineage to this scroll. |
| **Most of the 100k era → Dao cascade** | Guild trades all sides; **仙眠 rumor** deters extermination. Ancient apex NPCs may remember **one slice**, not the whole era. |
| **~3,000 years ago** | **Dao Wars** end; mandate begins. Guild survives charter politics ([`imperial-city-tianjing.md`](imperial-city-tianjing.md)). |
| **~1,100 years ago** | **Longcheng branch** storefront / redacted-page theater — not guild founding. |
| **~450 years ago** | **Latest reconstruction** of brewable 仙眠 (modern reagents — lean B). |
| **~380 years ago** | **Pei Wuxin** — Longcheng **myth refresh** (see below). |
| **Present** | Young peace; Tian founder **Immortal**, sleeping. |

**If the ancient victim was real:** **Qing Meridian**, not Pei. Pei is Imperial Sky embroidery, cover story, or PR — not Warring States history.

---

### Who was Qing Meridian (青脉真人) — ancient layer

**Scroll version (~55k y BP, Fragment hunts slice):** a **vein-calibrator** — peak-adjacent specialist who maps ley lines and **circulation stress** for war coalitions (not a sect patriarch, not an Immortal). A house (name deliberately lost / forged in guild copies) hired him to trace a rival’s array skirt; he **completed the map** and was found **asleep at the drafting table**, core ash-grey, meridians sweet — same motifs as 仙眠 later.

**Why poison (if true):** he was about to **sell the same map to both sides** or expose a coalition member’s hidden vein-theft; killing with a blade would have been an act of war; **sleep without tribulation** discredits his readings as dao failure.

**Guild use:** cite Qing to prove 仙眠 **predates** the Longcheng branch; skeptics say the scroll **post-dates** Qing and the name was inserted ~450y ago when they reconstructed the brew.

**Game:** no quest asserts Qing lived; grotto/Archive read can add **slice** context only.

---

### Who was Pei Wuxin — and why poison?

**Guild ballad version:** **Pei Wuxin** (裴无醒), the **Meridian King** — rogue peak **Dao Manifestation** who humiliated three sect enforcement teams, then drank a truce cup and never woke.

**Author working identity ( richer — use for quests/rumors ):**
Pei was **not** a wandering duelist. He was a **Meridian Inquisitor** (查脉使): a rare peak-Manifestation **specialist** who reads circulation and core stress for courts and sects — hired **~380 years ago** by a coalition of minor halls to investigate **linked deaths** in Longcheng’s gray toxin trade (the **ancient guild’s** local branch, already centuries old).

**Why he was poisoned (motive — guild internal truth vs public):**

| Tell | Story |
|------|--------|
| **Guild gospel** | Pei demanded they drink with him under witness to prove innocence; they “reluctantly” honored the rite — 仙眠 was mercy. |
| **Author lean** | Leadership could not allow a **credible apex auditor** to publish vein-proofs tying batches to noble clients. The cup was **premeditated** — truce theater. Death or qi deviation, same outcome for the investigation. |
| **Skeptic** | Pei died of **forced breakthrough failure** during a raid; the guild retroactively sold 仙眠 after reconstructing the formula decades earlier. |
| **Fabrication** | Pei existed but **walked away**; “never woke” is metaphor for bought silence. |

**Why poison (not a blade):** a Manifestation auditor’s **core and meridians are the evidence**. A public killing invites array retaliation; **仙眠** (or the **story** of it) discredits the man — “he drank, he slept, his dao was hollow.”

**No tomb. No sworn witness.** Assassins may have provided the **room**, not the brew ([`imperial-city-tianjing.md`](imperial-city-tianjing.md) — separate org).

**When is “Pei”?** **~380 years before present** — Imperial Sky, **not** the player’s month. For a peak-Manifestation patriarch (~50k-year life), that is **recent gossip**; for mortals it is **history class**.

**Was he “peak DM”?** Yes — **peak Dao Manifestation** specialist, **not** Half-Step / **not** true Immortal. Ballads exaggerate him into a rogue “Meridian King.”

**“Why waste 仙眠 on only a peak DM?” (deterrent logic)** — the **smart** Immortal objection; answers differ by layer:

| Layer | Answer |
|-------|--------|
| **Guild street gospel** | They **did** use 仙眠; Pei **never woke**; the investigation **died** — outstanding **political** result, not wasted on tier. Message: *we will spend the name on **anyone** who threatens the ledger.* |
| **Author lean (recommended)** | They **did not** expend real 仙眠 on Pei. Cup was **common toxin**, **qi sabotage**, or **theater**; syndrome **rebranded** when the formula was **reconstructed ~450y** ago. **Nuke stays unused** in verified memory — scarier for Immortals who ask “is the vial **still** full?” |
| **Skeptic in-world** | Pei’s tier **proves** propaganda — if the guild had a true Immortal-killer they’d **hint**, not **spend**, on an auditor. |
| **Believer in-world** | You **never know** if the vial was spent; **empty vault** might mean used on Pei **or** bluff. |

**Player-facing:** do **not** imply the guild casually burns 仙眠 on sub-Immortal targets unless a quest **proves** it. Default fear = **stock + Qing depth + Pei attribution**, not “they routinely waste the nuke.”

---

### Three layers (game never picks one)

| Layer | Tell |
|-------|------|
| **Guild gospel** | Pei died to 仙眠; ancient formula; redacted page = mercy. |
| **Skeptic scroll** | Pei composite; Qing Meridian was the real ancient death; **~450y** reconstruction swapped extinct reagents for modern ones. |
| **Fabrication thesis** | No Pei; empty vials; formula incomplete honeypot; fear alone deters extermination. |

**What players / NPCs genuinely do not know (unless content proves it):**

- Whether the guild **holds** a working batch today.
- Whether 仙眠 **ever** killed Qing, Pei, or anyone at apex tier.
- Whether the published canonical mix is **complete** or a decoy.

**Design payoff:** deterrent fiction + optional proof in play — not a codex with one truth flag by default.

**Lore guardrail:** do **not** tie Pei, Qing, or 仙眠 to the **Tian founder** (first public Half-Step at Tianjing, **Immortal now**, sleeping).

**Contradictions to seed:**

- Lotus: **ash-core slumber** theoretical — no Pei, maybe footnote on Qing.
- Assassins: invoice for “Pei’s night,” deny toxin.
- Stolen scrap: real mix vs brew-killer decoy.
- Void Temple Archive: Warring States pharmacopeia **exists** — may use older guild sigils, not today’s Longcheng trade name.
- Ancient patriarch NPC: *“We bought antidote from the same sign in the western vein wars.”*

### Names

| Context | Name |
|---------|------|
| Common | Immortal's Rest |
| Hanzi | 仙眠 |
| Poetic | Sleep without tribulation |
| Guild | The redacted page · Pei’s cup |
| Lotus archives | Ash-core slumber (theoretical — no named victim) |

### Canonical formula (recognition)

**Recognized mix** — strict match for legend recognition; **author truth (B):** largely **modern substitutions** for extinct Warring States reagents. Emergent crafting can hit the same profile if the resolver agrees.

| Reagent | Count | Notes |
|---------|-------|-------|
| `underpalace_vein_shard` | 1 | **Key (guild label)** — likely **`redvein_chip` + `sun_stone`** or similar modern pair in implementation |
| `bone_marrow_resin` | 2 | Flesh → bone seep (`alchemy-data.js`) |
| `soul_mist` | 2 | Binds inward |
| `foundation_root` | 1 | Core lean |
| `blood_crystal` | 1 | Blood gate before core |
| `void_ash` | 1 | **Key** — lab/tribulation-adjacent **modern** trace; ancient text said “post-seal ash” (TBD item) |

**Recognition:** both keys present + ≥85% mix match. Brew UI: *“The cauldron stills as if ashamed. This profile matches 仙眠 — Immortal's Rest.”*

### Resolved profile (target numbers — tune in playtest)

| Field | Value | Test intent |
|-------|-------|-------------|
| **Channels** | **Circulation + Core** (one affliction, two loads) | Qi tax + core / breakthrough vulnerability |
| Toxicity | **92** | Very high |
| Dominance | **95** | Apex; cheap toxins cannot feed |
| Initial load (one hit / coat) | **40–55** total inner | Insidious — not critical day one |
| Lethality | **Moderately high** | Steady at severe+; not burst-per-tick |
| Stickiness | **0.12** | Extremely sticky (× passive clear) |
| Passive clear **cap** | **≥ 40** per affected channel until specific cure | Trapped in severe band |
| Poison grade | **8–9** (peak Manifestation / pre-ascension) | Targets apex **below** true Immortal; realm bonus on clear; core channel stays cruel |
| Cleanse burden | **98** | Generic antidote ~ useless |
| **Onset** | **3–6 months** | Load migrates to circulation/core |

**Load split (sketch):** `circulationLoad` and `coreLoad` start ~30% / ~10% of applied total; each month of onset shifts toward **50/50** at full ramp. Optional mild **flesh** flag for log flavor only early. UI severity = **worst channel** + trend.

**Dual-channel rules:** one affliction id, **one dominance** (95) for the whole toxin; stacking / feeding judged against **dominant affliction on either touched channel** — cannot feed 仙眠 with cheap blood poison on flesh while core load runs. Second 仙眠 application: same dominance band → partial load add to **both** channels.

**Symptoms:**

- **Circulation:** technique cost, qi regen suppression, weak generic detox.
- **Core:** consolidation / breakthrough malus; tribulation-prep flags; “core hum” logs.

### Specific cure — **Wake the Core draught**

Hard to craft as the poison itself. Partial help must not trivialize cap.

| Reagent | Count |
|---------|-------|
| `void_ash` | 1 | **Paired** to poison batch (same fiction as other legendary pairs) |
| `foundation_root` | 2 | |
| `lotus_dew` | 1 | Jade Lotus purifier line — [`jade-lotus-sect.md`](jade-lotus-sect.md) |
| `life_death_catalyst` | 1 | **Key** — Cycle / Life / Death content (TBD item) |

One dose: **−50% load on both channels** + bypass passive cap **6 months**. Full clear needs **two** doses or one dose plus costly seclusion / Lotus rite.

### Player-facing warnings

- Early: *“Something sweet lingers — lightly poisoned (**worsening**).”*
- Mid onset: dual-channel row, severity climbing.
- Critical map travel: lethal confirm.

### Playtest scenarios

1. **QC victim:** onset still reaches critical if ignored.
2. **High resist, low grade:** fooled early; cap holds severe.
3. **High realm:** circulation eases somewhat; **core** load still sticky.
4. **Dominance:** street venom cannot feed; second 仙眠 partial extend only.
5. **Lore:** guild gospel vs skeptic vs fabrication — no `truthFlags.peiWasReal` in save by default.

### Content hooks (later)

- Poison Guild: redacted page tour, **empty vault** rumor, apprentice oath on Pei’s name.
- Forged formula scrap (decoy brew kills / wastes keys).
- Great power quest: “verify the nuke” — ends inconclusive or with a **single** vial MacGuffin (owner call).
- Jade Lotus: theoretical ash-core notes only.
- Assassins: song about the cup, invoice denies toxin.

### Still open (仙眠-only — rest of system in [Open questions](#open-questions))

- [ ] **Critical band on map:** steady HP loss vs escalating neglect while untreated
- [ ] **Decoy formula:** exact mix that wastes keys / injures brewer (guild honeypot)
- [ ] **Guild vault beat:** empty vs one vial vs bluff — owner call when content ships
- [ ] **`life_death_catalyst`** item source (dao / trib / craft)
- [ ] **Qing vs Pei** in UI recognition — show both names on full match or Pei-only for modern guild

---

## Secondary exemplar (jianghu tier) — **Ledger Bind** (紫簿断脉)

Longcheng minister; **circulation-only**; paired `venomroot_heart` cure. Better **first code milestone** before dual-channel 仙眠. Sketch: grade 2, toxicity ~78, dominance ~72, stickiness 0.35, cleanse burden 85 — detail in chat / future Issue.

---

## Exemplar index

| Id | Name | Role |
|----|------|------|
| `legendary_immortals_rest` | Immortal's Rest (仙眠) | Apex playtest — dual channel, onset, myth |
| `legendary_ledger_bind` | Ledger Bind (紫簿断脉) | Jianghu tier — single channel, simpler cure |

Add rows here as more legendaries are designed.
