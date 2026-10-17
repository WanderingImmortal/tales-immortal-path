# Body path — External Tempering (ideal depth)

| Field | Value |
|-------|-------|
| **Status** | `designed` (north star — not v1 scope) |
| **Blocked on** | [`body-external-tempering-baseline.md`](body-external-tempering-baseline.md) v1 shipped |
| **Issue** | none yet |
| **Chat / PR** | Ideal external refine loop — 2026-10-15 |
| **Updated** | 2026-10-15 |

## Intent

The **full** External Tempering fantasy: **stress the shell until it must repair, then repair stronger** — with or without salves, with **part targeting** or **whole-body ordeals**, and **recovery from strain** as a real pacing lever. Same realm index as qi QC; **power between cultivators** differs by **coverage, grain, scars, peak choices**, and **ordeal history**, not by a bigger realm number.

Shippable slice: [`body-external-tempering-baseline.md`](body-external-tempering-baseline.md). This doc is the **depth target**.

## Core loop (ideal)

```
Apply stress (drill / environment / salve-burn)
    → Strain accumulates (global + per region, skin/flesh layers)
    → Repair window (time, rest, salve quality, food)
    → Adaptation (permanent increment + grain tag)
    → Repeat until band / milestone / saturation
```

**Not** “click +1% forever.” **Stress → recover → keep** is the body answer to qi’s **gather → compress**.

| Phase | Player feel | Failure mode |
|-------|-------------|--------------|
| **Stress** | Choose method, target, intensity | Over-strain → injury, wasted batch, scar |
| **Strain** | Meter(s) you must respect | Training while overcooked → malus, no gain |
| **Repair** | Months, salve, recuperate, sleep | Cheap salve “works” but poisons or wastes grain |
| **Adaptation** | Log milestone, figure tint, **stat bump** | Lopsided parts → fine for Late, bad for perfect seal |

Strain is **not** HP (combat HP stays separate). It is **training load** — like fatigue in the baseline doc, but **per region** and tied to **repair quality**.

## Method families (what belongs in External Tempering)

Everything below stops at **skin + flesh** (no organ steep, no bone setting — those are **Inner** @ idx 1).

| Family | Examples (genre) | Targeting | Typical role |
|--------|------------------|-----------|--------------|
| **Impact drills** | Self-strikes, wooden post, iron sand palm, weight drops | **Part** (hands, forearms, torso) | Pure stress → repair; salve optional |
| **Load / static** | Stone vest, stance under weight, chained pulls | Part or whole | Slow adaptation, low waste |
| **Environment** | Waterfall, scouring wind, heat rock, ice pool | **Whole body** (uneven coefficients per region) | Whole-body strain; travel to sites |
| **Sky / ordeal** | Lightning strike, thunder pool (extreme) | Whole | **Peak** milestone or lineage; high scar risk |
| **Chemical external** | Medicated paste, caustic wash, spirit wine rub | **Part** (must have enough paste) | Salve **is** the stressor *or* softens repair |
| **Form / breath** | Manual movement sets | Whole or part | Efficiency (less strain per gain), not free progress |

**Salves — dual role (ideal):**

| Salve tier | During stress | During repair |
|------------|---------------|---------------|
| **Crude** | Can act as **cheap stressor** (burns, strips old weak tissue) — fast, toxic, wastes efficacy | Heals strain poorly; **corruption / grain noise** |
| **Standard** | Mild assist (less strain for same gain) | Normal repair multiplier |
| **Fine** | Rare; aligns grain | Strong repair; enables **clean** peak |

Novel pattern: **the paste does the refining** on rest days; **drills do the refining** on active days; best runs **alternate** (stress day → repair night with matching salve grain).

## Part targeting vs whole-body

**Regions (ideal map)** — align with chamber figure later:

- Head / neck (optional v2 — many manuals skip)
- Torso (chest, back, core flesh)
- Arms, legs
- Hands, feet (classic iron palm / iron leg fantasy)

Each region tracks **skin strain**, **flesh strain**, **adaptation %**, and **dominant grain** (hide, iron, spring, heat, etc.).

| Method | Target rule |
|--------|-------------|
| Paste / iron sand / post striking | **One region** per session (or two if “paired limbs” manual) |
| Waterfall / lightning / long march | **All regions** — gains weighted (e.g. back + arms high, belly low) |
| Weights / stone vest | **Whole** with emphasis on loaded area |

**Why targeting matters:** unlimited whole-body paste would skip travel and drills. Depth assumes **paste is finite** and **regional**; whole-body progress comes from **environment ordeals** or **very expensive** full-frame salve batches.

**Balance gate for Late:** not only average % — require **minimum coverage** (e.g. no region below 60%) *or* accept **lopsided** physique with combat tags (glass belly, iron hands).

## Strain & recovery (ideal mechanics)

| Meter | Scope | Goes up from | Goes down from |
|-------|--------|--------------|----------------|
| **Global strain** | 0–100 | Any hard session | Recuperate, time, food |
| **Regional strain** | per part | Targeted stress there | Rest + salve applied **to that part** |
| **Open microtrauma** | flag per part | Strain hit threshold | Repair window consumed |
| **Scar load** | count / severity | Repair under strain or crude salve | Only some elixirs later |

**Repair window:** after heavy stress, game suggests (or requires for full gain) **N months** before next stress on that part. Training through the window → **scar** or **0 adaptation**.

**Recuperate** (main action): clears global strain fast, regional slower.

**Dwelling / inn / hot spring:** regional strain clear (world hook for Redwell later).

## Milestones within External Tempering

Two layers: **bands** (Early / Mid / Late / Peak — qi QC parity) and **named milestones** (story, UI toasts, NPC recognition).

### Bands (realm ruler — unchanged)

| Band | Meaning |
|------|---------|
| **Early** | First adaptations; laborer-proof |
| **Mid** | Reliable exterior; local strongman |
| **Late** | Exterior **saturated** — brace door |
| **Peak** | Optional density; harsher brace / trib |

### Named milestones (ideal — pick subset to ship over time)

| Milestone | Trigger (example) | Payoff |
|-----------|-------------------|--------|
| **First stress cycle** | Complete stress + repair once | Tutorial complete |
| **Skin holds edge** | Torso skin adaptation ≥ threshold | Chip: cut resistance flavor |
| **Corded flesh** | Any limb flesh ≥ threshold | Chip: carry/load |
| **Iron palm (regional)** | Hand region grain = iron + 80% | Unarmed tag; NPC fear |
| **Balanced shell** | All regions ≥ 70% | Bonus to brace success |
| **Ordeal survived** | Waterfall or lightning session without scar | Title; peak eligibility |
| **Scarred but full** | Late with scar load ≥ 3 | Different physique tag than “clean late” |
| **Grain set** | One nature ≥ 60% of total adaptations | Locks lean for pearl recipe later |
| **Shell sealed** | Consolidation done | Break unlocked |
| **Braced frame** | Breakthrough 0→1 success | Inner soak unlocked |

Milestones are **not** extra realm indices — they are **achievements inside idx 0** that affect tags, trib, and NPC dialogue.

## Differentiating power at the same realm index

Same **idx 0** on the ladder; world reads **how** you filled the cup.

| Axis | Low end | High end |
|------|---------|----------|
| **Band** | Early external | Peak external |
| **Coverage** | Specialist (iron hands only) | Balanced shell |
| **Grain** | Crude mixed waste | Clean single-nature |
| **Scar load** | Clean refinement | Battle-tempered / ugly |
| **Method tier** | Common salve + post drills | Lineage + ordeal |
| **Brace quality** | Hasty seal | Peak seal + Stillness |
| **Efficiency** | Many months, burnt batches | Fewer months, tight stress/repair |

**Combat / world expression (ideal):** derive from **stats + grain + coverage**, not `realmIdx` alone. **No threshold “build tags”** — train **base stats** (speed, strike, durability, …); if your speed stat outpaces local brackets, you **win foot chases** and NPCs **eventually** call you fast (rumor/seat/dossier hooks), provided rivals didn’t take the same route.

Still useful **derived labels** for dev/debug (balanced vs specialist_arms) — not player-facing unlocks.

Two **Late** externals: one **balanced** stats; another **high palm strike, lower torso durability** — same realm idx, different stat sheet and fights.

**Qi parity note:** idx still gates travel danger and “can touch Foundation-equivalent.” **Within** idx 0, NPCs say “late exterior” vs “early exterior,” not “realm 0.7.”

## What else fits External (checklist for content)

- **Manual forms** — reduce strain, unlock drill tiers  
- **Training sites** — waterfall on map, quarry load yard  
- **Weather / season** — lightning storm window (risk)  
- **Food** — meat stews for repair multiplier (not pills)  
- **Tools** — iron sand tray, post, weighted vest (craft / buy)  
- **Sparring** — optional stress from combat (controlled)  
- **Inspection** — NPC reads your grain/scars (disguise hook later)  

## v1 baseline → depth mapping

| v1 (ship first) | Depth (later) |
|-----------------|---------------|
| Global fatigue | Global + **regional strain** |
| Apply & grind | **Stress** session + **repair** session |
| Mix salve | Salve **tier** + grain + target part |
| Temper drills | Impact + load **family** per manual |
| Skin + flesh tabs | **Regions** under skin/flesh |
| Both layers 80/100% | Coverage rules + milestones |
| — | Waterfall / lightning **ordeals** |

## Excavation — many treasures, one basin (owner lean 2026-10-15)

Genre line (paraphrase): **the body is a hoard of treasure waiting to be excavated.** External Tempering is not one progress bar — it is **many axes** the player can spend **decades** on, limited by **wealth** (materials, sites, manuals) and **dedication** (calendar).

### Trainable axes (ideal — same rules for NPCs)

Examples at idx 0 (skin + flesh only — no “fake” bone stats):

| Axis | Trained by (examples) | Specialist fantasy |
|------|------------------------|---------------------|
| **Speed / evasion** | Load vest, spring drills, light grain | Fastest mortal in the county |
| **Durability / soak** | Iron sand, hide grain, impact volume | Walk through knives |
| **Strike / weight** | Palm post, corded flesh | One-hit caravan ender |
| **Grip / wrestle** | Torso load, sinew baths | Cannot be peeled off |
| **Tolerance** | Heat/cold/poison external washes | Environment survival |
| **Recovery** | Fine salves, repair discipline | Back tomorrow |

**Generalist:** spread decades → **good at everything a bit**, tops none. **Specialist:** palms-only → **fearsome in range**, softer elsewhere. Both valid; NPCs and rivals occupy the same space.

Flat stat bumps per axis are OK when **years** are the cost ([`world-cultivation-parity.md`](world-cultivation-parity.md)).

### Three zones inside one realm (avoid “waste” and “never break”)

| Zone | Feel | Mechanic (lean) |
|------|------|-----------------|
| **1 — Productive** | Every season matters | Steep part of curve; clear gains |
| **2 — Asymptotic (“legendary mortal”)** | Dedication still pays, barely | Same idx; years for tiny gains; **peer respect**, not new realm |
| **3 — Misaligned grind** | Should not happen if UX honest | Chasing axis **already at idx ceiling** without breakthrough |

**Diminishing returns:** not “pointless” — **asymptotic**. UI should show **years-to-next-tick** so a 60-year palm monk *chose* zone 2 on one axis, not got tricked.

**When breakthrough is clearly better:** crossing adds **(a)** lifespan runway, **(b)** **new layers to train** (bone, organ), **(c)** **tier-II material access** for exterior (optional re-grind), **(d)** new **addends** in combat math — not a wipe. Body lean is **+1 +1** per layer, not multiply old stats (see [`body-stat-layers-additive.md`](body-stat-layers-additive.md)).

### Carry-forward (so the next realm isn’t “your life was a lie”)

| Fear | Answer |
|------|--------|
| “I spent 60y on palms; Inner trivializes it” | **skin_palm + flesh_palm stay**; Inner adds **bone_palm** (and organ regulation) as **new terms** |
| “Generalist wasted breadth” | Breadth → **brace quality**, tier-II eligibility everywhere, fewer scar failures |
| “Should’ve broken at Late” | **Late break** = less time for Inner addends; **Peak break** = more runway for bone + tier-II |

**Lean rules:** full stack in [`body-stat-layers-additive.md`](body-stat-layers-additive.md). Summary:

1. **Retention:** tier-I adaptation % and grains **frozen forward** on break (seal/brace tune edge cases only).
2. **Addition:** idx 1 palm strike uses **skin + flesh + bone + …** — deeper palms = train **bones in the palm**, not buff old numbers by ×1.2.
3. **Tail shift:** further **skin** work in Inner uses **higher-tier** materials / grade track — not endless tier-I hide paste.
4. **Organs:** mostly **coefficients** on recovery/tolerance/stress budget, not limb strike addends.
5. **Relative power:** compare to **NPCs at same idx**; Late external specialist still matters until peers Inner.

**Crossing vs grinding (decision prompt):**

- **Break now:** new basin, time left in life, inner verbs unlock, ceilings rise.
- **Stay grinding:** push one axis toward **legendary mortal** (zone 2) — worth it for **duel king** runs; wrong for **reach Inner before 80** runs.

Same pattern as QC: Late enough to leave; Peak optional. External adds **which axis** you perfect, not only one bar.

### Wealth vs dedication

| | Wealth | Dedication |
|--|--------|------------|
| Buys | Materials, sites, manuals, fine salve | Calendar months |
| Without other | Fast **noisy** grain, scars | Slow **clean** grain |
| NPC parity | Rich idle young master vs poor palm monk | Both on world clock |

## Parked (owner 2026-10-15)

**Weighted vest / load training as stat “builds”.** Wear heavy load during external refine (or travel?) → **speed / evasion penalty now**; adaptation after load-months → **small permanent speed** (flat stat OK under long basin pacing — see [`world-cultivation-parity.md`](world-cultivation-parity.md)). Same family as stone vest, chained weights, quarry yard. Opens **build diversity** but needs **fine tuning** vs salve-grind months. **Do not implement** until external v1; revisit with combat spine + NPC parity.

## Open questions

- Head/neck inclusion — many manuals ignore; skip v1 depth?  
- Lightning as playable vs scripted trib-only — owner call.  
- Scar permanence vs heal at Inner — lean: some scars permanent flavor.  

## Prerequisites

- [ ] External v1 baseline implemented  
- [ ] Region map on body figure (anatomy rebuild)  
- [ ] Tag system on `G.bodyChamber` or physique stub for combat  
