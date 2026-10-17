# Body path — External Tempering baseline method (v1)

| Field | Value |
|-------|-------|
| **Status** | `designed` (baseline slice — implement after Issue) |
| **Blocked on** | Material IDs in explore/hunt; body chamber action refactor |
| **Issue** | none yet |
| **Chat / PR** | External/Inner split design — 2026-10-15 |
| **Updated** | 2026-10-16 |

## Intent

**External Tempering (idx 0)** is the mortal **shell**: **skin + flesh**, refined by **working the surface** — paste, grind, drills — not interior soaking. The player stockpiles beast and field goods, **prepares salves**, and ** spends months** in the body chamber (or yard) to harden the exterior until the frame hits **Late / Peak**, then **seals** and **breaks** with a **brace** into **Inner Tempering (idx 1)**.

Inner soaking, bones, organs, pearl, and nerves live in later docs — this file is **only** the default External method.

Parent hub: [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) · Ladder: [`nine-realm-ladder.md`](nine-realm-ladder.md). **Ideal depth:** [`body-external-tempering-depth.md`](body-external-tempering-depth.md).

## Fantasy anchor (xianxia, not qi)

| Qi Condensation | External Tempering |
|-----------------|-------------------|
| Draw ambient qi inward | **Apply** nature to the **outside**; **train** it in |
| Compress in the dantian | **Grind / strike / load** until the skin and meat **hold** |
| Density in one pool | **Two layers** (skin, flesh) on the figure — both matter |
| Late = full enough to leave | Late = **exterior saturated** — interior work would tear an unbraced body |

Common genre images this baseline steals from (one method, many names later): **敷药** (medicated paste), **打炼** (striking / forging drills), **药浴** only as **skin-facing** wash (not organ steep), **铁砂**-style gradual surface hardening (lineages can go hard on sand/iron later).

## What the player must do (checklist)

1. **Choose body path** and open the **Body Chamber** (external mode at idx 0).
2. **Gather** baseline materials from Dustbone (explore, hunt, market).
3. **Mix salve** batches from stash → **salve doses** (inventory or chamber stock).
4. **Apply & grind** on **Skin** and **Flesh** tabs until both reach Settled (80%+) or Peak (100%).
5. **Temper drills** when salve is low — slower, more **fatigue**, optional scar risk if reckless.
6. **Recuperate** when **fatigue** is high (main action or chamber rub-down).
7. **Seal the shell** (capstone — rename from generic “Temper the Vessel” copy at idx 0).
8. **Break Through** → **brace** (Stillness first) → trib → **Inner Tempering** @ idx 1.

No interior soak, no bone tab, no organ tab at idx 0 (tabs **visible but locked** with a one-line reason).

## Baseline manual: **Common External Refinement**

| Field | Value |
|-------|-------|
| Id | `external_common_redwell` |
| Source | Body path start, or Redwell pamphlet (cheap) |
| Teaches | Salve recipe + Apply & grind + Temper drills |
| Does not teach | Brace (separate **Common Stillness Brace** pamphlet or auto at Late), lineages |

Lineage manuals (dragons, poisons, iron sand) **replace** salve recipe and drill flavor later; they do **not** change idx 0’s job (skin + flesh exterior).

## Materials (Dustbone v1 triangle)

| Material | Role | Where |
|----------|------|--------|
| **Beast hide scrap** | Toughness grain — skin progress | Hunt / explore beasts |
| **Beast blood** (fresh) | Binder — flesh progress | Same hunts; stacks |
| **Field grit resin** | Paste base — enables mixing | Explore herb nodes; market |

**One brew (Mix salve):** 1 hide + 1 blood + 1 grit → **3 salve doses** (tune at implement). Cannot mix without at least one of each.

Optional v1.1: **quality** tag on blood (same day vs old) — skip until baseline runs.

## Player verbs (three loops)

### 1. Mix salve (prep)

- **Where:** Body chamber footer or inventory craft row (no separate alchemy chamber required v1).
- **Cost:** materials as above + **½ month** (or 0 months if we want instant prep early playtest).
- **Output:** `salveDoses += 3` (cap e.g. 12 — forces hunting between grind sessions).

### 2. Apply & grind (primary progress)

- **Where:** Body chamber — active **Skin** or **Flesh** tab.
- **Cost:** **1 salve dose** + **1–2 months** per session.
- **Effect:** +progress on **that layer** (larger on skin when on Skin tab, etc.).
- **Diminishing returns:** repeating the **same** material tier on the same layer within the same band reduces gain (encourages switching tabs and hunting between bursts).
- **Feel:** “Smear, rub, work the paste in with palm and stance drills” — log copy, not a minigame v1.

### 3. Temper drills (secondary progress)

- **Where:** Same chamber; button **Temper drills** (whole figure).
- **Cost:** **2–3 months**; **0–1 salve dose** (optional half-dose bonus if spent).
- **Effect:** small progress to **both** skin and flesh; builds **fatigue**.
- **Risk:** if **either** layer &lt; 40% and fatigue already high → small **scar** (flavor + tiny malus); never death at idx 0.

### Fatigue & recovery

- **Fatigue** 0–100 on `G.bodyChamber.externalFatigue` (namespaced at implement).
- Drills add more than Apply; Apply adds a little.
- **Recuperate** (main world) clears fatigue over months; chamber **Rub down** clears less but doesn’t cost a full recuperate action (optional v1.1).
- At high fatigue, Apply gains are reduced (soft push to rest).

## Progress model

| Meter | Rule |
|-------|------|
| **Skin %** | 0–100 layer progress |
| **Flesh %** | 0–100 layer progress |
| **Realm progress %** | `round((skin + flesh) / 2)` for UI meter / seal tiers |
| **Late gate** | Both skin **and** flesh ≥ **Late threshold** (e.g. 70% each) **or** average ≥ band — **owner pick at implement:** recommend **both ≥ 80%** for Settled seal, **both 100%** for Peak (strict but readable). |
| **Bands** | Early / Mid / Late / Peak — same *spirit* as QC bands; advance from combined exterior progress, auto like QC (no manual “break band” button). |

**Qi parity:** same lifespan cap **80 years** at idx 0; Late exterior ≈ strongest mortal in town.

## Seal & break (idx 0 → idx 1)

| Step | Player-facing |
|------|----------------|
| **Seal** | **Seal the Shell** (capstone) at Settled+ — locks exterior gains, unlocks break |
| **Break** | **Brace the Frame** — Stillness method v1 (wrappings, long still months) |
| **Outcome** | **Inner Tempering** — interior soaking **unlocked**; **not** a realm named “Vessel Establishment” |

**Vessel Establishment** retires as a **realm name**; “establishment” lives in brace **flavor** (“the frame is established enough to hold inner baths”).

## UI sketch (body chamber @ idx 0)

```
External Tempering · Early — Skin 62% · Flesh 48%
Salve doses: 4    Fatigue: 22

[Tabs: Skin | Flesh | (Bones locked) | …]

[ Apply & grind (1 dose, ~1 mo) ]
[ Temper drills (~2 mo) ]
[ Mix salve (1 hide + 1 blood + 1 grit → 3 doses) ]

Hint: Both skin and flesh must harden before the shell can seal.
```

Bones/organs/blood/nerves tabs show **🔒 Inner work — brace through first.** (Meridians tab is **qi path only** — remove from body chamber when migrated; [`body-path-no-meridians.md`](body-path-no-meridians.md).)

## What we are not building in v1

- Limb-only targeting, iron sand pools, poison skins
- Interior soak vats
- Lineage manuals
- Birth marrow bias (hook later: matching grain → less waste on Apply)
- Pills as substitute for salve (pills stay qi lane)

## Implementation crumbs

- `body-chamber.js` — layer gates by `getTrackRealmIdx('vessel')`; idx 0 actions `applyExternalSalve`, `externalDrills`, `mixExternalSalve`
- `data.js` — materials, manual stub, `PATHS.body.realms[0]` display **External Tempering**
- Explore/hunt — drop hide + blood
- Replace idx 0 spine gate: **skin + flesh** peak, not skin-only (migration note for [`BODY_VESSEL_REALM_SPINE`](../../data.js) when coding)
- Consolidation copy @ idx 0: **Seal the Shell** / brace break copy

## v1 build locks (owner 2026-10-16)

| # | Decision |
|---|----------|
| 1 | **Replace** idx 0 chamber clicks with salve / apply / drills — no parallel old loop. |
| 2 | **Yes** — `External Tempering` @ idx 0, `Inner Tempering` @ idx 1; spine **0 = skin + flesh**. |
| 3 | **Materials:** repurpose **`leather_scrap`** (hide), **`spirit_herb`** or **`heartwood_splint`** (grit/base); add **`beast_blood`** (common) for binder — one new id is clearer than overloading `demon_core`. Wire Dustbone hunt/explore drops. |
| 4 | **Progress model** — see § Breakthrough vs training axes below. |
| 5 | *(was bands)* Simple **% + floors** for v1; QC-style bands when pacing pass lands. |
| 6 | **Trib** — reuse current break pipeline; redo trib scripts later. |
| 7 | **Merge [PR #156](https://github.com/WanderingImmortal/tales-immortal-path/pull/156)** (vessel track + break feedback) **to `main` before** the external implementation branch, or rebase external onto it — avoids conflicting edits in `cultivation.js` / `body-chamber.js` and keeps break testable while external ships. |
| 8 | **Meridians:** do not merely hide — **remove meridian layer from body path** (tab, spine gate, chamber→`G.meridians`). Qi meridians stay on **`btnMeridian` / qi systems** later ([`body-path-no-meridians.md`](body-path-no-meridians.md)). Silhouette art can move to qi chamber in a follow-up. |

## Breakthrough vs training axes (owner 2026-10-16)

**Problem:** If “training = raising part stats,” what sums into **breakthrough** vs **combat build**?

**v1 slice (simple):**

| Track | Feeds seal / break meter? | Feeds power? |
|-------|---------------------------|--------------|
| **Skin %** | Yes | Yes (layer + derived stats) |
| **Flesh %** | Yes | Yes |
| **Specialist training** (speed, palm strike, durability, …) | **No** — depth / v1.1 | **Yes — raises base stats** on `G` (or body stat object), same as qi training raising qi/vitality |

**Not threshold “tags”:** there is no unlock like “Speedster tag at 50 speed.” You train **speed** (or palm force, etc.) as **numeric stats**; in combat you **outpace** rivals who didn’t specialize; **rumors / NPC copy / chronicle** gradually reflect “the fast one” from **observed stats + deeds**, not a badge slot.

**Realm progress (consolidation UI):** `round((skin + flesh) / 2)`.

**Floors (general refinement):**

- **Settled / seal:** `min(skin, flesh) ≥ 80` **and** average ≥ 80.
- **Break Through allowed:** same as seal + consolidated (existing spine).
- **Peak optional:** both **100** — harsher brace/trib, not required to leave.

**Specialist grind (future):** maxing **speed stat** via vest/drills does **not** substitute for flesh/skin floors — you can be faster than most enemies and still **must** bring both layers to Settled to break. Extra stat grind is **zone 2** on that stat (you keep getting faster; enemies on the same path can catch up), not breakthrough bar.

**Diminishing returns:** per-layer gain curve flattens after ~80 (Settled band); breaking becomes attractive because **new basin + tier-II access** beats zone-2 tier-I tail — not because progress hits hard zero.

**When axes ship:** breakthrough meter stays **general-only**; optional cap e.g. “single axis cannot contribute more than X% to break” if any axis is wired into meter by mistake.

## Open questions (narrow)

- Exact month costs vs living clock playback — match other chamber actions first.
- Prep in chamber vs at dwelling forge bench — chamber-only for v1.

## Prerequisites

- [x] Owner sign-off on this doc
- [x] External v1 implement (chat queue — no Issue)
- [x] Material drops + `beast_blood` id
- [x] `External Tempering` / `Inner Tempering` @ idx 0–1 in `PATHS.body`
