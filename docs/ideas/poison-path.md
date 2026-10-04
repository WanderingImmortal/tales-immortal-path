# Poison path — load, crafting, legendaries

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Unified affliction + alchemy tab slice; combat-damage **systems** optional for v1 (target tags only) |
| **Issue** | none yet |
| **Chat / PR** | Cloud design chat — `cursor/poison-design-doc-80ac` |
| **Updated** | 2026-10-04 |

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

### Design intent (mechanics)

- **Not** a coded “instant immortal kill” — **believed** to end those who anchored life in a core. Still one HP bar; **Circulation + Core** both carry load from one affliction record.
- **Insidious:** seeps flesh and bone in fiction; **onset** ramps inner load over months while early UI stays deceptively mild (**worsening** trend is mandatory).
- **Extravagant:** ancient **fixed** formula (strict recognition); brew and cure both **project-tier** gates — not spammable.

### Legend (owner direction — myth as weapon)

**Immortal's Rest** is the Poison Guild’s **metaphorical nuke**: a name everyone whispers, a recipe no outsider has verified, a kill no court will sign in ink. Great powers ** hesitate to stamp the guild out completely** because *what if one vial remains?* The guild cultivates that hesitation — whether or not the arsenal is real.

**The figure (invented — may never have lived):** **Pei Wuxin** (裴无醒 — “Pei who never woke”), called in ballads the **Meridian King**. Stories place him at **peak Dao Manifestation**, half a step from the stories men tell about immortals — a lone apex who humiliated three sect enforcement teams and then accepted a “truce cup” from the guild. He slept mid-sentence; they say his core went to grey ash and his meridians tasted of honey. **No tomb. No witness under oath.** Only guild pamphlets and assassin songs.

**Three layers (game never picks one):**

| Layer | Tell |
|-------|------|
| **Guild gospel** | Pei Wuxin died to 仙眠; the formula survives; the redacted page is mercy for the continent. |
| **Skeptic scroll** | Pei is a composite — deeds borrowed from dead brawlers; he died of qi deviation; the guild rebranded the corpse. |
| **Fabrication thesis** | There was no Pei; the ancient recipe is real but **never successfully brewed** in the current era; empty vials and forged ledgers are enough. |

**What players / NPCs genuinely do not know (unless content later proves it in play):**

- Whether the guild **holds** a working batch today.
- Whether 仙眠 **ever** killed anyone at apex tier (Pei or otherwise).
- Whether the “ancient” formula in the doc is **complete** or a guild honeypot missing one reagent.

**Design payoff:** rumor gates, forged pages, and one optional late-game truth beat — not a lore quiz with a single correct answer in the codex.

**Lore guardrail:** do **not** tie Pei, 仙眠, or the guild nuke story to the **Tian founder** (first public Half-Step at Tianjing, **Immortal now**, sleeping — [`imperial-clan.md`](imperial-clan.md)). Imperial deterrence and guild deterrence are separate fears.

**Contradictions to seed in play:**

- Lotus archives list **ash-core slumber** as a **theoretical** failure mode — no named victim.
- Assassins invoice “consulting” for Pei’s last night — **denies** supplying the toxin.
- A stolen scrap might match the canonical mix — or might be a **decoy** mix that kills brewers.

### Names

| Context | Name |
|---------|------|
| Common | Immortal's Rest |
| Hanzi | 仙眠 |
| Poetic | Sleep without tribulation |
| Guild | The redacted page · Pei’s cup |
| Lotus archives | Ash-core slumber (theoretical — no named victim) |

### Canonical formula (recognition)

**Ancient recipe** — strict match; not emergent from starter herbs.

| Reagent | Count | Notes |
|---------|-------|-------|
| `underpalace_vein_shard` | 1 | **Key** — guild claims pre-mandate origin; may be mislabelled ore |
| `bone_marrow_resin` | 2 | Flesh → bone seep (`alchemy-data.js`) |
| `soul_mist` | 2 | Binds inward |
| `foundation_root` | 1 | Core lean |
| `blood_crystal` | 1 | Blood gate before core |
| `void_ash` | 1 | **Key** — void / tribulation-adjacent drop (TBD item) |

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
