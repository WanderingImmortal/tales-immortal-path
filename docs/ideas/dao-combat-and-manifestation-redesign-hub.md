# Dao combat & manifestation redesign — hub

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm consolidated — v2 direction) |
| **Blocked on** | none for design; implementation blocked on combat spine + nine-realm |
| **Issue** | none yet — split into Issues per agent slice below |
| **Chat / PR** | Cloud agent bc-b9c4ed99 (2026-10-02) |
| **Updated** | 2026-10-02 |

## Intent

Capture **owner direction** from a design thread on Dao Manifestation, dao combat, and target xianxia sim depth. This hub **does not replace** [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md) (v1 locks); it records **v2 deltas** and **combat prerequisites** so specialized agents can build slices without re-deriving chat history.

Goal end-state: players **explore what a dao does** — shape on attacks, manifest kits, optional embodiment — in fights that are **not straight HP trades** (position, domains, tempo, groups).

## Child docs

| Doc | Focus |
|-----|--------|
| [`dao-manifestation-model-v2.md`](dao-manifestation-model-v2.md) | Seeking vs Manifestation vs embodiment; manifest-all; lifespan/tribulation; multi-embodiment |
| [`dao-combat-target-spine.md`](dao-combat-target-spine.md) | Shape + qi fill; sectors; ATB; distance; groups; domains; counterplay; gap list |
| [`sunfire-lesser-dao-reference.md`](sunfire-lesser-dao-reference.md) | Worked **lesser way** example at target fidelity (stress-test for spine) |

## Relationship to existing design

| Existing | Role |
|----------|------|
| [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md) | v1 — library/merge/**one worn** @ realm entry; keep until v2 owner sign-off |
| [`law-taxonomy.md`](law-taxonomy.md) | Axis / Great Dao / embodied stack — writer voice |
| [`combat-damage-depth.md`](combat-damage-depth.md) | Flesh / Structure / Circulation / Core + unified hit pipeline (target) |
| [`domain-system.md`](domain-system.md) | GC-era **qi Domain** claim — **different** from DM **law domain**; cross-link when naming UI |
| [`devouring-law.md`](devouring-law.md) | Example of **law combat procs** (world reactions, not `%` only) |
| [`weapon-intent-cultivation.md`](weapon-intent-cultivation.md) | Intent expression layer under dao shape |
| [`nine-realm-ladder.md`](nine-realm-ladder.md) | idx 6–7; lifespan table may move with v2 embodiment beat |

**Dao acquisition redo** (fragments → pursuits, way vs insight) is **explicitly out of scope** for this cluster — parallel track when owner picks it up.

## v2 headline deltas (vs v1 doc)

1. **Manifestation realm** = permission to **externalize** laws (bounded); **not** “enter realm while already embodying one law.”
2. **Embodiment** = **peak / interior DM** — primary identity on heaven’s board; **~45–50k lifespan cliff** moves here (not realm entry).
3. **Many daos manifestable** — per-dao **comprehension/manifest threshold**; **intensity budget** or equivalent so concurrent overlays do not stack five full domains.
4. **Dao combat** = **shape (shell) + qi fill** — no separate “dao mana”; long fights bounded by **qi / resource** and **holding domains**.
5. **Avoid dao RPS chart** — **interaction tags** (sever, anchor, peel, …) + **fight geometry**, not Fire beats Water.
6. **Multi-embodiment** — not forbidden; **default one primary**; second concurrent embodiment = **legend-tier** cost (sequential peak, pairs, depth split — see child doc).

## Suggested agent / Issue slices (build order)

Implement **combat spine before dao content**; dao riders are thin until spine exists.

| Order | Slice | Delivers | Blocked on |
|-------|--------|----------|------------|
| 1 | **Combat spine v1** | Unified `attackProfile` → resolve; sector stress; status vocabulary | [`combat-damage-depth.md`](combat-damage-depth.md) |
| 2 | **ATB + action costs** | Fill rate, speed, technique windup | Spine |
| 3 | **Range / movement** | Melee / mid / far; advance / withdraw; optional grid cells | ATB |
| 4 | **Domain objects** | Volume on field; tick on time slice; qi drain to hold/contest | Range + multi-entity |
| 5 | **Group combat** | Multiple combatants; line / focus fire | Range |
| 6 | **Dao rider layer** | `applyDaoShape(shapeId, profile)`; manifest techniques | Spine + tags |
| 7 | **Realm / progression** | Manifest thresholds, embodiment tribulation, `G.daoState` v2 | Nine-realm migration |
| 8 | **Content** | Sunfire + 1 non-element dao (Space sever) to validate spine | 6 |

## Second validation dao (brief — do not spec fully here)

**Space (greater or lesser “Fold”)** should be the **second** reference after Sunfire:

- Stresses **geometry** (range links, blink contest) not Flesh DoT.
- Proves domains are not “debuff aura only.”
- If Space feels boring on the same spine, the problem is **movement**, not dao taxonomy.

## Novel conventions (reader expectations)

- Low fight: **dao-infused qi** — element + qualitative harm (meridians, bleed).
- High fight: **rule statements** — defense category fails, escape invalid **locally**.
- **Domain** = local legislation; cost is **focus / qi / foundation**, rarely a separate “law MP.”
- **Auxiliary comprehension** common; **one primary identity** for合道 / politics — multi-path exists but priced.

## Open questions (hub level)

- [ ] Owner sign-off: v2 supersedes v1 **wear @ entry** or coexist as phased migration?
- [ ] ATB vs initiative-round — commit to ATB for domain ticks?
- [ ] Grid cells vs range bands only — how much geometry for v1 sim?
- [ ] Player-facing name collision: GC **Domain** vs DM **law field** — UI terms?
- [ ] Where does **intent apex** vs **dao manifestation** duel weight land? [`intent-apex-self-will.md`](intent-apex-self-will.md)

## Implementation crumbs (when building)

- `combat.js`, `core.js` — today: HP + `combatResource` + `rollTrueDaoCombatEffects` (element procs only)
- `dao-taxonomy.js`, `data.js` `DAO_TAXONOMY` — no `wornLaw`; comprehend stack only
- `docs/ideas/combat-damage-depth.md` — unified pipeline section is the technical north star
