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

- **Poisoned?** Load &gt; 0 on a **channel** (blood/flesh, structure, circulation, core — same vocabulary as combat systems).
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

## Legendary exemplar (playtest) — **Ledger Bind** (紫簿断脉)

Use this to stress-test recognition, stickiness, specific cure, grade, and Longcheng fiction before building many legendaries.

### Legend (why it’s famous)

During early **Longcheng** consolidation, a minister opened the **salt ledgers** and tied three noble houses to smuggled venom shipments. He died at his desk — no wound, face purple, meridians like ink. The **Poison Guild** denies the brew; the **Assassins** invoice says “consulting.” Three attempts to copy the antidote from a stolen scrap **failed** until someone used **heart-root from the same swamp hour** as the poison batch. The story is the product; the stats are still resolved from the mix.

### Names

| Context | Name |
|---------|------|
| Common | Ledger Bind |
| Hanzi | 紫簿断脉 |
| Guild alias | “Closing entry” |
| Assassin sheet | Purple ledger |

### Canonical formula (recognition)

Match when mix contains (tolerance ±1 count on minors):

| Reagent | Count | Notes |
|---------|-------|-------|
| `venomroot_heart` | 1 | **Key reagent** — future field rare from Venomroot Swamp |
| `venom_gland` | 2 | Existing beast drop (`data.js` jungle loot) |
| `blood_crystal` | 1 | `alchemy-data.js` |
| `marrow_thistle` | 1 | Stabilizer / blood lean |
| `seep_dew` | 2 | Carrier |

**Recognition:** ≥90% ingredient match + must include `venomroot_heart`. Whisper in brew UI: *“The profile matches the minister’s curse — 紫簿断脉.”*

### Resolved profile (target numbers — tune in playtest)

| Field | Value | Test intent |
|-------|-------|-------------|
| Target channel | **Circulation** (inner-lean) | Qi techniques tax; not “outer poison chip” only |
| Toxicity | 78 | Beats ~50 resist; gradient still matters |
| Dominance | 72 | Same-band top-ups partial; gutter venom cannot feed |
| Typical load (one successful coat/hit) | 55–70 | Starts **severe**, hits **critical** if untreated + reapply |
| Lethality | High moderate | Steady HP pressure at severe+, not spike-per-tick |
| Stickiness | 0.35 | Passive clear crawls |
| Passive clear **cap** | Load ≥ 25 until specific cure | “You never feel safe at lightly poisoned” without cure |
| Poison grade | 2 (QC / early FE band) | Higher realm gets bonus passive clear; mortals in danger |
| Cleanse burden | 85 | Generic antidote: −15% load once; second dose weak |
| Onset | 0 (immediate) | Playtest clarity first |

### Specific cure — **Same-hour heart antidote**

| Reagent | Count |
|---------|-------|
| `venomroot_heart` | 1 | **Must be “paired”** — same harvest tag as poison batch OR fresh within 1 world month of brew (design fiction) |
| `dawn_dew` | 2 | |
| `foundation_root` | 1 | |

Brew in Toxins tab or buy for absurd price from Poison Guild branch (future). One use: **−60% load** or bypass passive cap for 12 months. Without heart: generic pills hit cleanse burden wall.

### Player-facing warnings

- On apply: banner — *Circulation toxin — severe — passive clearance insufficient at your resist.*
- Map: dedicated affliction row; travel confirm at critical.
- Treat like a cold → load stays above cap → **lethal months** (per owner call).

### Playtest scenarios

1. **Mortal baseline resist (~8):** get hit once → load ~60 → verify passive barely drops; active qi detox required to avoid critical within N months.
2. **Body-refined resist (~35):** same hit → longer runway; still hits passive cap without cure.
3. **Realm above grade 2:** bonus clear; poison still sticky — should not trivialize.
4. **Same dominance feed:** second Ledger Bind partial load; **cheap venom gland brew** does not extend.
5. **Recognition:** match formula → lore line + guild rumor flag (content stub).

### Content hooks (later)

- Longcheng gray layer: forged ledger rumor, sealed guild antidote room.
- Jade Lotus purification line contrast (not a full counter without heart).
- Assassins quest references “closing entry.”

---

## Exemplar index

| Id | Name | Role |
|----|------|------|
| `legendary_ledger_bind` | Ledger Bind (紫簿断脉) | First full legendary — stickiness + specific cure + recognition |

Add rows here as more legendaries are designed.
