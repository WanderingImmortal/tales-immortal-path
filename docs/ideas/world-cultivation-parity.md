# World cultivation parity — NPCs, lifespan sinks, flat gains

| Field | Value |
|-------|-------|
| **Status** | `designed` (principles — tune at implement) |
| **Blocked on** | Watershed pacing pass; headless NPC cultivation slice |
| **Issue** | none yet |
| **Chat / PR** | External training / world sim lean — 2026-10-15 |
| **Updated** | 2026-10-15 |

## Intent

The player is **not** the script’s chosen one. They are a **drop in a moving world**: other cultivators **use the same systems** (body external refine, qi gather, etc.), **grow on the clock**, and **leave you behind** if you stall. **Lifespan per realm** should eat **most of a basin** in training time ([`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)). Under that pacing, **flat stat buffs** from training (e.g. weighted vest → later speed) are **acceptable** — calendar and opportunity cost are the brakes, not only soft tags.

**Meta:** creation points / successive runs make it **easier to become someone of import**; first life remains harsh.

## Design notes

### Flat stats vs tags (owner lean 2026-10-15)

| When tags-only win | When flat stats are fine |
|--------------------|---------------------------|
| Fast loops, short basins | **Long basins** — training consumes **years–decades** |
| PvP must read in one tooltip | Power vs **peers** matters more than absolute ceiling |
| Early playtest before pacing | Same math for **player and NPC** (no hidden player inflation) |

**Example (parked):** heavy vest → **speed penalty while worn**; after enough load-months → **small permanent speed** (or vitality / carry). Not broken if vest months **compete** with salve-grind months inside an **80-year External basin**. Fine-tune later; see [`body-external-tempering-depth.md`](body-external-tempering-depth.md) § Parked.

Combine **flat deltas** with **build identity** (grain, scars, region coverage) so two +speed bodies still fight differently.

### Excavation, diminishing returns, breakthrough (owner lean 2026-10-15)

Body path: **many trainable axes**; **additive layers** per region (skin, flesh, bone, …) — idx 1 adds **new +1 terms** (e.g. bone_palm), not multiply old skin/flesh (qi may differ). **Tier-II materials** shift the mountain tail for exterior layers during Inner. Organs: narrow **coefficients** on recovery/tolerance. Detail: [`body-stat-layers-additive.md`](body-stat-layers-additive.md), [`body-external-tempering-depth.md`](body-external-tempering-depth.md) § Excavation.

### Everyone cultivates (sim parity)

**Rule:** If the player can do it, **NPCs can do it** — same manuals (where lore allows), same material costs, same month actions, same failure modes. No player-only cultivation flags on `G` without an NPC equivalent on their state object.

| Player fantasy | Sim requirement |
|----------------|-----------------|
| “I trained under a waterfall for twelve years” | World NPC can occupy site + spend months → same resolver |
| “Sect genius left me behind” | NPC realm idx advances on clock when fed resources / schedule |
| “I’m late FE at 85” | Common NPC outcome at competent peak, not failure |

Implementation direction (client migration): **commands + resolvers on state**, not DOM-only training. NPCs may use **abstracted** schedules (fewer UI steps), not **different rules**.

### Keeping up vs becoming important

| Layer | Meaning |
|-------|---------|
| **Realm idx** | Travel danger, seat gates, “can you enter this fight” |
| **Basin progress** | Early / competent peak / perfected peak inside idx |
| **Build** | Stats + physique tags + resources + backing |
| **Import** | Seats, sect rank, chronicle, grudges — **earned**, not granted at creation |

Creation points bias **starting luck** (marrow, roots, cash, knowledge), not “NPCs freeze while you zoom.”

### Balance knobs (when flat gains stack)

1. **Basin length** — target % lifespan spent **in training** before next break ([`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)).
2. **Diminishing returns** per stat source at same idx (vest speed + drill speed + pill — each tapers).
3. **Watershed rarity** — most NPCs **die at peak** without crossing; player advantage on run 3 is **reach crossing with time left**, not infinite stats.
4. **Relative threats** — scale encounters to **local cultivator bracket**, not player-only curves.

### Anti-patterns

- Player-only “training buttons” with no NPC cost model.
- Flat +10 speed every week at current chamber click speed.
- Chosen-one quests that grant realm skips NPCs cannot take.

## Related

- [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md) — basin consumes life
- [`body-external-tempering-depth.md`](body-external-tempering-depth.md) — external builds, load training parked
- [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md) — jobs, economy, not main character
- [`jianghu-situation-threads.md`](jianghu-situation-threads.md) — consequence when others grow
- Client guardrails: state on `G` / NPC records, commands not DOM (`.cursor/rules/client-migration-guardrails.mdc`)

## Open questions

- How much NPC cultivation is **simulated live** vs **statistical** when off-screen?
- First Issue slice: NPC body external v0 or qi basin pacing only?

## Prerequisites

- [ ] Watershed pacing pass slows player chambers to match vision
- [ ] NPC state shape for cultivation tracks (mirror player `G.cultivation`)
