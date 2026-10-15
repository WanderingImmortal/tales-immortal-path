# Body path — External Tempering baseline method (v1)

| Field | Value |
|-------|-------|
| **Status** | `designed` (baseline slice — implement after Issue) |
| **Blocked on** | Material IDs in explore/hunt; body chamber action refactor |
| **Issue** | none yet |
| **Chat / PR** | External/Inner split design — 2026-10-15 |
| **Updated** | 2026-10-15 |

## Intent

**External Tempering (idx 0)** is the mortal **shell**: **skin + flesh**, refined by **working the surface** — paste, grind, drills — not interior soaking. The player stockpiles beast and field goods, **prepares salves**, and ** spends months** in the body chamber (or yard) to harden the exterior until the frame hits **Late / Peak**, then **seals** and **breaks** with a **brace** into **Inner Tempering (idx 1)**.

Inner soaking, bones, organs, pearl, and nerves live in later docs — this file is **only** the default External method.

Parent hub: [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) · Ladder: [`nine-realm-ladder.md`](nine-realm-ladder.md).

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

Bones/organs/blood/meridians/nerves tabs show **🔒 Inner work — brace through first.**

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

## Open questions (narrow)

- Exact month costs vs living clock playback — match other chamber actions first.
- Strict **both 100%** vs average-only Late — playtest after first slice.
- Prep in chamber vs at dwelling forge bench — chamber-only for v1.

## Prerequisites

- [ ] Owner sign-off on this doc
- [ ] GitHub Issue: “External Tempering v1 — salve + apply + drills”
- [ ] Material drops on Dustbone hunt table
- [ ] Retire **Vessel Establishment** realm string @ idx 1 in `PATHS.body` when Inner ships
