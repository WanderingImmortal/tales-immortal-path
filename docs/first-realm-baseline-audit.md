# First-realm cultivation & combat baseline audit

| Field | Value |
|-------|-------|
| **Status** | Baseline audit (code-evidence, 2026-11-03 AEST) |
| **Scope** | `realmIdx === 0` on each track: Qi Condensation, External Tempering, Sea Opening |
| **Out of scope** | Mechanics overhaul, extremity system, Body alchemy redesign, new Spirit/FE invention |
| **Related design** | [`qi-condensation-depth.md`](ideas/qi-condensation-depth.md), [`body-external-tempering-baseline.md`](ideas/body-external-tempering-baseline.md), [`spirit-path-full-design.md`](ideas/spirit-path-full-design.md), [`cultivation-progression-audit-stage3a.md`](ideas/cultivation-progression-audit-stage3a.md) |

---

## Executive summary

The three first realms are **implemented to different depths**. Qi Condensation has the most coherent loop (bands, gather-only chamber, QC→FE crossing + tribulation). External Tempering has a **playtest salve loop** (skin/flesh, seal, break) with materials bypassed via `freeMixMaterials`. Sea Opening has a **short prelude** (40% gate, no seal required) but **almost no first-realm combat identity** because `soul_condensation` techniques require Soul Mass / embryo gates far beyond Sea Opening.

Combat uses a shared scaler (`COMBAT_BALANCE`) that ties enemy HP/damage to **player power**, so “several months developed” cultivators can beat **single** `minRealm: 0` templates (wolf, corrupted cultivator) but there is **no mortal-soldier encounter tier** to test squad tactics. Body path enjoys higher base HP and crush-nature basics; Qi gains versatility from techniques + Breath-linked dantian; Spirit at idx 0 relies on weak-scaled basics and prelude % bonuses unless the player already has embryo/mass from another track.

**Highest-value next implementation task (recommended):** Ship **Sea Opening combat verbs** — at minimum, realm-0 spirit techniques that do not require Soul Mass, plus UI/combat hooks promised in `SOUL_CHAMBER_ABILITIES` Phase 2 — so the spirit track has a testable first-realm identity before deeper palace work.

---

## Method

- Trace **runtime code** in `.js` modules (not lore essays alone).
- Compare to **stated intent** in the three path design notes above and [`nine-realm-ladder.md`](ideas/nine-realm-ladder.md) (idx 0 rows).
- Flag **design contradictions** where docs disagree; do not pick canon.
- Pacing numbers cross-check [`scripts/audit-cultivation-progression.js`](../../scripts/audit-cultivation-progression.js) findings in [`cultivation-progression-audit-stage3a.md`](ideas/cultivation-progression-audit-stage3a.md).

---

## Cross-cutting architecture

| Track ID | Legacy `G.path` | Realm 0 name | Starting stats (`PATHS.*.base` in `data.js`) |
|----------|-----------------|--------------|-----------------------------------------------|
| `dantian` | `qi` | Qi Condensation | qi 12, vit 4, spi 5, will 3, hp 70 |
| `vessel` | `body` | External Tempering | qi 4, vit 12, spi 2, will 4, hp 140 |
| `spirit` | `soul` | Sea Opening | qi 5, vit 5, spi 10, will 8, hp 80 |

**Files:** [`cultivation-tracks.js`](../cultivation-tracks.js) (three tracks, focus track, soul embryo @ idx 3), [`consolidation.js`](../consolidation.js) (seal/break gates), [`cultivation.js`](../cultivation.js) (breakthrough execution), [`combat.js`](../combat.js) + [`combat-spine.js`](../combat-spine.js).

**Shared progress tiers** (`REALM_PROGRESS_TIERS` in `data.js`): Settled **80%**, Peak **100%**, Hasty **55%** (`hastyEnabled: false` — stub only).

```mermaid
flowchart TB
  subgraph qc [Dantian @ 0]
    G[Gather Qi weekly] --> B[Bands: early→mid→late→peak]
    B -->|late or peak| BT[Break Through 6mo]
    BT --> TR[Tribulation on success]
  end
  subgraph et [Vessel @ 0]
    S[Salve apply / drills] --> SL[Seal the Shell @ 80% skin+flesh]
    SL --> BR[Break → Inner Tempering]
  end
  subgraph so [Spirit @ 0]
    P[Prelude actions] -->|≥40%| SB[Break → Sea Stilling]
  end
```

---

## 1. Qi Condensation — implementation map

### Implemented

| Area | Behavior | Primary references |
|------|----------|-------------------|
| **Band progression** | Cumulative gather-units: Mid **90**, Late **220**, Peak **320**. Auto band advances grant max Qi (+4/+6/+8). | `QC_BAND_*` in [`qc-depth.js`](../qc-depth.js) |
| **Break gate** | No seal; `hasQcBandBreakthroughReady()` = **Late or Peak** only. | [`consolidation.js`](../consolidation.js) `canBreakthroughToNextRealm`, [`qc-depth.js`](../qc-depth.js) |
| **Chamber loop** | **Gather Qi** only @ QC; Expand / Refine / Condense blocked. | [`chamber.js`](../chamber.js), [`CHAMBER_BALANCE.gatherQi`](../data.js) |
| **Gather credit** | Each gather week applies `getChamberGatherProgressUnits()` → `applyQcGatherBandProgress`. | [`passive-cultivation.js`](../passive-cultivation.js), [`chamber.js`](../chamber.js) |
| **QC→FE crossing** | 6-month seclusion; styles Steady Settle / Force the Basin / Read the Audit; entry stat bumps + `applyQcFeFoundationPillarGrant`. | [`cultivation.js`](../cultivation.js), [`qc-fe-foundation.js`](../qc-fe-foundation.js) |
| **Life sim slice** | Redwell jobs, rent, field sites, qi-feel, travel caution. | [`qc-depth.js`](../qc-depth.js) |
| **Methods** | `CULTIVATION_METHOD_POOL` with many `reqRealm: 0` manuals; gather mult via [`cultivation-methods.js`](../cultivation-methods.js). | [`data.js`](../data.js) |
| **Combat linkage** | Breath pool linked to dantian Qi; density from gather drives qi offense; band adds +0–10 cultivation power. | [`COMBAT_PATH.qi`](../data.js), [`core.js`](../core.js) `getCultivationPowerStat`, [`combat.js`](../combat.js) |

### Placeholder / blocked by design

- Expand Dantian, Refine Foundation @ QC (intentionally blocked — FE wiring).
- `CONSOLIDATION_BY_REALM[0]` peak targets (qi fill, density) — **legacy meter** for qi path consolidation UI; **not** the QC band exit gate.
- Hasty seal tier (disabled).

### Intended identity (design)

From [`qi-condensation-depth.md`](ideas/qi-condensation-depth.md): accumulate, circulate, refine, store; **limited early external manipulation**; versatility via qi techniques; Late ~40–44y inferior pacing target; Peak optional.

**Match:** Gather + density + technique shelf aligns well. External manipulation is mostly **technique-shaped**, not a separate subsystem — acceptable for v1.

---

## 2. External Tempering — implementation map

### Implemented

| Area | Behavior | Primary references |
|------|----------|-------------------|
| **Spine @ idx 0** | Layers **skin + flesh** only; deeper tabs visible but locked. | `BODY_VESSEL_REALM_SPINE[0]`, [`body-chamber.js`](../body-chamber.js) |
| **Progress meter** | Realm % = average of spine layer %. Flesh tab unlocks at **50%** skin. | `BODY_CHAMBER_LAYERS`, [`body-chamber.js`](../body-chamber.js) |
| **Settled floor** | Both layers ≥ **80%** before **Seal the Shell**. | `getBodyVesselSettledFloorBlockReason` |
| **External loop** | Mix salve (2 wk), Apply (6 wk, 1 dose, +14% layer), Drills (10 wk, +6% both, fatigue). | `BODY_EXTERNAL_TEMpering_BALANCE`, [`body-chamber.js`](../body-chamber.js) |
| **Playtest bypass** | `freeMixMaterials: true`, starter doses — **no hunt required**. | `BODY_EXTERNAL_TEMpering_BALANCE` |
| **Fatigue / scar** | High fatigue reduces gains; reckless drills can add `foundationCracks`. | [`body-chamber.js`](../body-chamber.js) ~1679 |
| **Legacy layer grinds** | 2-week Temper/Harden/etc. still grant stackable combat bonuses (caps in `BODY_CHAMBER_BONUS_CAPS`). | `BODY_CHAMBER_ACTIONS`, [`body-chamber.js`](../body-chamber.js) |
| **Break** | Requires vessel track **consolidated** + spine settled. | `canVesselTrackBreakthrough`, [`cultivation-tracks.js`](../cultivation-tracks.js) |
| **Physique** | Parallel Iron Body-style project in same chamber (`physique-cultivation.js`) — separate from salve spine. | [`physique-cultivation.js`](../physique-cultivation.js) |

### Placeholder vs design doc

| Design ([`body-external-tempering-baseline.md`](ideas/body-external-tempering-baseline.md)) | Code today |
|---------------------------------------------------------------------------------------------|------------|
| Material triangle (hide, blood, grit) required to mix | Bypassed when `freeMixMaterials` |
| Months per apply session | **Weeks** (6 wk apply, 10 wk drills) — faster calendar |
| Full overstrain / recoverable harm bands | Partial (fatigue mult, scar → `foundationCracks`) |
| Ideal depth: part targeting, ordeal history | Not implemented (expected) |

**Match:** Shell + salve + seal + brace fantasy is **present**; crafting is explicitly a **PoC**, not final alchemy.

### Poor-resource vs exceptional-resource (Body)

| Profile | Cultivation | Combat @ ~same calendar time |
|---------|-------------|------------------------------|
| **Poor** (`freeMixMaterials: false`, no starter doses, drills-only when salve-starved) | Slower layer %; fatigue limits apply gains; must hunt between mixes | Fewer stackable layer bonuses if player skips 2 wk grinds; lower vit/HP from chamber bonuses |
| **Exceptional** (playtest free mix + starter doses + parallel 2 wk grinds to stack caps) | Faster 80% seal; can peak-grind to 100% | Up to **+10%** physical damage/defense/HP etc. from capped bonuses + high vit + **Stamina** pool |

---

## 3. Sea Opening — implementation map

### Implemented

| Area | Behavior | Primary references |
|------|----------|-------------------|
| **Prelude meter** | 0–100% via three 2-week actions (+20% each, stack bonuses max 3×). | `SOUL_PALACE_PRELUDE_ACTIONS`, [`soul-chamber.js`](../soul-chamber.js) |
| **Latent condense** | Optional prelude condense (+latent mass, cap **9** pre-birth). | `SOUL_PALACE_CONDENSE_ACTIONS.prelude` |
| **Break gate @ 0** | **`preludeProgress ≥ 40%`** — **no seal/consolidation required**. | `canSpiritTrackBreakthrough` in [`soul-chamber.js`](../soul-chamber.js) |
| **Post-break quirk** | On spirit break success, **`markSpiritTrackConsolidated(newIdx)`** auto-marks the **new** realm settled. | [`cultivation.js`](../cultivation.js) |
| **Deep palace** | Locked until soul embryo (`canAccessSoulPalaceDeep`). | [`cultivation-tracks.js`](../cultivation-tracks.js), [`soul-chamber.js`](../soul-chamber.js) |
| **Combat resource** | Focus from will/spirit; basics use **`soul-cut`** nature on combat spine. | [`COMBAT_PATH.soul`](../data.js), [`combat-spine.js`](../combat-spine.js) |

### Placeholder / unfinished

- **`SOUL_CHAMBER_ABILITIES`** — listed in UI data, **Phase 2 combat hooks not built** (header comment in [`soul-chamber.js`](../soul-chamber.js)).
- **`soul_condensation` techniques** — gated on `hasActiveSoulMass()` / embryo (`getSoulCondensationMassBlockReason` in [`soul-mass.js`](../soul-mass.js)); **not Sea Opening tools**.
- Spirit damage in combat (`applySpiritDamageToEnemy`) adjusts damage vs weak interiors — **does not erase memories, techniques, or profession progress** (no such hooks in code).

### Intended identity (design)

From task brief + [`spirit-path-full-design.md`](ideas/spirit-path-full-design.md): develop Sea of Consciousness; everyone has a sea; basic spiritual attacks may **disrupt consciousness** without permanent erasure from ordinary hits.

**Match:** Prelude cultivation exists; **combat disruption is HP/stress-only** via spine — no consciousness debuff system at idx 0. Permanent erasure is **not implemented** (aligned with intent). **Gap:** lack of usable spirit techniques at idx 0.

---

## 4. Combat expectations audit

### Shared combat model

- **Resources:** Qi → Breath (linked to dantian); Body → Stamina; Soul → Focus ([`COMBAT_PATH`](../data.js)).
- **Technique costs:** Pool-based via `getTechniqueCombatCost` — spends **path combat resource**, not template `costType` ([`combat.js`](../combat.js)).
- **Damage pipeline:** `calcBasicAttackDamage` / `calcCombatTechniqueDamage` → optional `combatSpine` `resolveCombatHit` (stress + breaks).
- **Enemy scaling:** HP/Dmg rise with `getPlayerOffensivePower()` and `G.maxHp` ([`COMBAT_BALANCE`](../data.js)) — fights stay relevant as player grows.

### Early power (order-of-magnitude @ realm 0, no gear)

| Path | Typical basic hit scale | Durability | Notes |
|------|-------------------------|------------|-------|
| Qi | Low–mid until density stacks from gather | hp 70 | Techniques + Breath refill after fights |
| Body | Higher (vit × 1.5 × 0.78 scale) | hp **140** | Stamina regen scales with vit; chamber % stacks |
| Soul | Low (will+spi average × 0.55) | hp 80 | Soul techniques mostly blocked pre-embryo |

**`minRealm: 0` enemies:** Feral Spirit Wolf (hp 35, dmg 4), Corrupted Cultivator (hp 50, dmg 6) — [`ENEMIES`](../data.js). Effective HP/damage **scales up** with player power.

### “Several months” vs “small group of trained mortal soldiers”

| Question | Finding |
|----------|---------|
| Is there a mortal soldier template? | **No** dedicated encounter; beasts and corrupted cultivator stand in. |
| Could a developed QC body beat 3–5 soldiers? | **Plausible** for Body (HP + crush + stamina); **likely** for Qi with techniques + density; **unlikely** for pure Spirit idx 0 without embryo/mass. |
| Squad tactics | **Not modeled** — combat is single-enemy UI; no focus-fire, formation, or morale. |
| Unintended advantage | **Enemy scaling** can make “farm weak enemies” harder as player power rises — not a softlock, but obscures power fantasy tests. |
| Spirit memory erasure | **Not present**; circulation/core stress on player is log-only debuff flavor unless extended elsewhere. |

---

## 5. Progression, seals, breakthrough consequences

| Track | Seal @ idx 0? | Break requirement | Post-success consequences |
|-------|---------------|-------------------|---------------------------|
| Qi | **No** | Late/Peak band | FE realm idx 1, tribulation, QC entry bonuses, foundation pillars |
| Body | **Yes** (Seal the Shell) | Consolidated + skin/flesh ≥ 80% | Vessel idx 1, tribulation (vessel/dantian paths), stat bumps |
| Spirit | UI capstone exists but **break @ 40% prelude skips seal** | 40% prelude OR already consolidated flag | Auto-consolidate **new** idx; latent mass path toward embryo |

### 100% peak / perfection assumptions

| Location | Behavior | Assessment |
|----------|----------|------------|
| `REALM_PROGRESS_TIERS.peakPct` (100%) | Optional peak grind (`PEAK_GRIND_BY_PATH`) | **Optional**, not required for body/spirit break @ settled 80% |
| QC Peak band | Optional band after Late | **Optional** for break; improves FE prep score |
| `isAtRealmPeak()` for qi | Requires `getPeakProgress()` checks @ qi path | Applies when **consolidation def exists** — confusing alongside QC bands |
| `perfect` consolidation tier | Break chance penalty / transcendence hooks | Not forced at idx 0 QC (no seal) |
| Extremities | — | **Not implemented** (correct per constraints) |

### QC FE preparation dead hook

`computeQcFePreparationScore` adds **`sealTierWeight` if `isRealmConsolidated(0)`** ([`qc-fe-foundation.js`](../qc-fe-foundation.js)), but QC **cannot seal** ([`consolidation.js`](../consolidation.js)). Weight is dead unless migrated saves mark realm 0 consolidated.

---

## 6. Design contradictions (report only)

| Topic | Doc A | Doc B / code | Notes |
|-------|-------|--------------|-------|
| Spirit idx 0 break | Capstone “Anchor the Soul” copy (`PATHS.soul.capstone`) | `canSpiritTrackBreakthrough` @ 0 ignores consolidation | UI promises seal; gate is 40% prelude |
| Soul embryo | [`spirit-path-full-design.md`](ideas/spirit-path-full-design.md) — spirit-only embryo target | [`cultivation-tracks.js`](../cultivation-tracks.js) — embryo @ idx 3 **any track** | Policy conflict; cross-track awakens mass/techniques early |
| Body technique costs | Task: martial arts consume **stamina** | Templates still say `costType: "qi"` | Combat runtime uses Stamina pool — template field misleading |
| External Tempering time | Baseline doc: **months** per apply | Code: **weeks** | Pacing mismatch — tune later |
| QC starter hub | [`qi-condensation-depth.md`](ideas/qi-condensation-depth.md) retarget Redwell | Older copy still says “Threshold City” in places | Cosmetic doc drift |

---

## 7. Findings register

Each row: **ID · issue type · priority (P0 critical … P3 nice)**.

### Qi Condensation

| ID | Summary | Implementation | Intended | Type | Gameplay impact | Next action | Pri |
|----|---------|----------------|----------|------|-----------------|-------------|-----|
| F-QC-01 | Band pacing vs age targets | Thresholds 90/220/320 + chamber units; see Stage 3A harness | Late ~40–44y inferior | **Design mismatch / tune** | QC may feel too fast or slow vs mortal life sim | Re-run `audit-cultivation-progression.js` after any unit change; playtest inferior 16→Late | P1 |
| F-QC-02 | `CONSOLIDATION_BY_REALM[0]` vs bands | Dual progress semantics | Single gather axis | **Unresolved UX** | Confusing peak meter if shown @ QC | Hide or relabel consolidation meter @ QC | P2 |
| F-QC-03 | FE prep seal weight | `sealTierWeight` never earned @ QC | N/A | **Dead code** | None today | Remove or gate on post-FE consolidation only | P3 |
| F-QC-04 | External qi manipulation | Techniques + intent | Limited manipulation early | **Match** | — | Document in QC pamphlet pool Issue | P3 |

### External Tempering

| ID | Summary | Implementation | Intended | Type | Gameplay impact | Next action | Pri |
|----|---------|----------------|----------|------|-----------------|-------------|-----|
| F-BY-01 | Free material mix | `freeMixMaterials: true` | Hunt loop required | **Incomplete feature** | Exceptional-resource playtest only | Flip flag when explore drops stable; keep starter doses optional | **P0** (when body economy ships) |
| F-BY-02 | Dual progress paths | Salve loop + legacy 2 wk grinds both advance layers/bonuses | Salve primary | **Design mismatch** | Optimal play = grind stacks + salve | Clarify UI primary loop; nerf or hide legacy @ ET | P1 |
| F-BY-03 | Scar → `foundationCracks` | Drill risk increments cracks | Recoverable harm | **Partial** | Minor debuff unclear to player | Surface cracks in UI + recovery actions | P2 |
| F-BY-04 | Calendar pacing | Week-based actions | Month-based in baseline doc | **Design mismatch** | Faster ET completion | Align doc or retune weeks | P2 |
| F-BY-05 | Poor vs rich body outcome | Code supports both via materials flag | Distinct outcomes | **Match (when flag off)** | — | Playtest poor-resource branch | P1 |

### Sea Opening

| ID | Summary | Implementation | Intended | Type | Gameplay impact | Next action | Pri |
|----|---------|----------------|----------|------|-----------------|-------------|-----|
| F-SP-01 | No idx 0 spirit techniques | Mass-gated school | Basic spiritual attacks | **Incomplete feature** | Spirit path weak in combat early | Add `sea_opening` technique school or lower mass mins for 1–2 basics | **P0** |
| F-SP-02 | Abilities panel | Data-only `SOUL_CHAMBER_ABILITIES` | Combat hooks | **Placeholder** | False promise | Hide until Phase 2 or implement one ability | P1 |
| F-SP-03 | Break without seal | 40% prelude | Anchor sea / stillness fantasy | **Design mismatch** | Fast exit; capstone button misleading | Require settled prelude (100%) or seal for peak tier | P2 |
| F-SP-04 | Auto-consolidate on break | Marks new realm consolidated | Player chooses peak | **Bug? / design** | Skips spirit peak grind | Match vessel/qi consolidate flow | P2 |
| F-SP-05 | Memory / profession erasure | Not in combat code | Ordinary hits must not erase | **Match** | — | Add design guard when adding consciousness debuffs | P3 |
| F-SP-06 | Cross-track embryo | Any track idx 3 awakens embryo | Spirit-only policy (design) | **Contradiction** | Soul techniques on qi/body mains | Policy PR per spirit-path-full-design | P1 |

### Combat (cross-path)

| ID | Summary | Implementation | Intended | Type | Gameplay impact | Next action | Pri |
|----|---------|----------------|----------|------|-----------------|-------------|-----|
| F-CB-01 | No mortal squad encounters | Single-enemy templates | Jianghu soldiers | **Missing content** | Cannot validate brief | Add tier-0 `Mortal Guard` pack or encounter flag | P1 |
| F-CB-02 | Enemy scales with player power | `calcEnemyHp/Dmg` | Cultivator advantage vs mortals | **Unresolved** | Soldiers scale like cultivators if reused template | Separate mortal stat table without player-power term | P1 |
| F-CB-03 | Soul basics = soul-cut stress | Spine defaults | Disrupt consciousness | **Partial** | No mental debuff state | Add lightweight “shaken” status @ idx 0 | P2 |
| F-CB-04 | Body martial stamina | Stamina pool used | Stamina-primary | **Match** | — | Clean template `costType` labels | P3 |

### Progression / extremities

| ID | Summary | Implementation | Intended | Type | Gameplay impact | Next action | Pri |
|----|---------|----------------|----------|------|-----------------|-------------|-----|
| F-PR-01 | Extremities | None | Optional rare achievements | **Not started** | — | Design doc only; do not implement in baseline PRs | — |
| F-PR-02 | 100% peak mandatory | Only 80% settled required for body/spirit break | Peak optional | **Match** | — | — | — |
| F-PR-03 | Hasty break tier | Disabled | Optional risky exit | **Stub** | — | Implement when consolidation refactor lands | P3 |

---

## 8. Follow-up PR shortlist (small, independent)

1. **Sea Opening combat slice** — 2–3 techniques usable at prelude 40%+ without Soul Mass; wire one `SOUL_CHAMBER_ABILITIES` hook; hide the rest. *(Highest value.)*
2. **External Tempering economy flag** — Turn off `freeMixMaterials` behind content check; document poor vs rich in playtest notes; ensure drops exist for `mixCost` IDs.
3. **QC consolidation UI cleanup** — When `isQiCondensationRealm()`, hide seal/peak consolidation meter or bind display exclusively to `qcBand`.
4. **Mortal soldier encounter stub** — `ENEMIES` or `ENCOUNTER_ENEMIES` entry with **fixed** hp/dmg (no `getPlayerOffensivePower` term) for balance testing.
5. **Spirit break consolidate fix** — Stop auto-`markSpiritTrackConsolidated(newIdx)` on break; require seal or 100% prelude for peak tier benefits.
6. **Remove QC FE `sealTierWeight` dead path** — Or document migration-only behavior in comment + skip in score if QC never sealed.
7. **Body chamber UX** — Single primary external loop banner; demote legacy 2 wk grinds to “supplementary” @ idx 0.

---

## 9. Key file index

| Path | Role |
|------|------|
| [`qc-depth.js`](../qc-depth.js) | QC bands, Redwell life, breakthrough readiness |
| [`chamber.js`](../chamber.js) | Gather Qi session |
| [`qc-fe-foundation.js`](../qc-fe-foundation.js) | FE pillar grant on QC cross |
| [`body-chamber.js`](../body-chamber.js) | External Tempering loop, vessel progress |
| [`soul-chamber.js`](../soul-chamber.js) | Sea Opening prelude, spirit break gates |
| [`soul-mass.js`](../soul-mass.js) | Soul Mass, condensation gates, spirit damage helper |
| [`consolidation.js`](../consolidation.js) | Seal/break rules, progress tiers |
| [`cultivation.js`](../cultivation.js) | Breakthrough + tribulation orchestration |
| [`cultivation-tracks.js`](../cultivation-tracks.js) | Three-track state, embryo gate |
| [`combat.js`](../combat.js) | Combat resources, damage, scaling |
| [`combat-spine.js`](../combat-spine.js) | Hit profiles, stress, breaks |
| [`data.js`](../data.js) | `PATHS`, balance tables, enemies, techniques |
| [`passive-cultivation.js`](../passive-cultivation.js) | Gather unit economics |
| [`physique-cultivation.js`](../physique-cultivation.js) | Trainable physiques (parallel body content) |

---

## 10. Audit constraints compliance

- No gameplay or save-format changes in this document.
- No extremity implementation.
- No Body alchemy redesign.
- Spirit/FE mechanics not invented here — gaps logged as Issues/PR targets above.
