# Tribulation — per-gate backlog

| Field | Value |
|-------|-------|
| **Status** | `idea` (QC→FE only `building` via v2) |
| **Blocked on** | Owner design pass per watershed gate — **do not script blind** |
| **Issue** | none yet |
| **Chat / PR** | Design chat 2026-07-22; v1 [#62](https://github.com/WanderingImmortal/tales-immortal-path/pull/62); v2 QC→FE [#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63) |
| **Updated** | 2026-07-22 |

## Intent

One tribulation script per **major watershed**, not one generic deck with realm-index scaling. Each gate needs a **heaven's question** (one sentence), **2–3 trial choices**, and a **realm-specific scar pool** before it ships.

**Rule:** If you cannot write the heaven's question yet, the gate's **cultivation journey** is not designed enough — park trib work and build that first.

Engine + philosophy: [`tribulation-system-rework.md`](tribulation-system-rework.md). Limbo notes: [`tribulation-per-realm-limbo.md`](tribulation-per-realm-limbo.md).

---

## Gate backlog

| Transition | Heaven's question (draft / TBD) | Trib status | Journey blocked on |
|------------|------------------------------|-------------|-------------------|
| **QC → FE** | Can gathered qi settle into bedrock the ledger recognizes as Foundation? | **`building`** — v2 script (bedrock / compress / thunder) | Playtest [#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63) |
| **FE → GC** | Does this nascent core belong in the ledger? | `idea` — generic pool only | [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md), nascent core + thin limbo |
| **GC → NS** | TBD — soul birth / identity at watershed | `idea` | [`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md) |
| **NS → Void** | TBD — dissolution of self at void's edge | `idea` | Nine-realm / void ladder depth |
| **Void → Dao** | TBD — law vs self | `idea` | Owner cosmology pass |
| **Dao → Immortal** | TBD — final audit / transcendence or erasure | `idea` | Post-immortal cosmology parked |

**Fate rite tribulation** (repeatable theft) — separate mode; needs chronicle project. See [`root-rite-formations.md`](root-rite-formations.md). Not a breakthrough gate.

---

## Per-gate template (fill before coding)

```text
transitionId:
heavenQuestion:   # one sentence
pathDefaults:     # qi → lightning, soul → heart_demon, body → TBD
trialChoices:     # 2–3 named beats (concrete fail scars, no scar-risk %)
scarPool:         # realmAtBreakthrough + optional transitionIds
limbo:            # thin moment? broken survivor edge case?
prereqDocs:       # which journey idea must land first
```

---

## QC → FE (reference — shipped direction)

| Choice | Beat | Fail outcome |
|--------|------|--------------|
| Stand on bedrock | Consolidation tier from prior realm | Foundation crack + Unstable Foundation if rushed |
| Compress dantian | Qi density | Qi Backlash scar |
| Meet thunder openly | Risky, always available | Scorched Flesh scar |

No meridians in QC→FE trib fiction (meridian Option A = FE wiring later).

---

## What stays generic until designed

- All gates except `qc_to_fe` still use `getOmenChoices` / `getTrialChoices` / scar-risk meter.
- That is **intentional parking**, not tech debt to "finish tribulation" in one pass.

---

## Suggested build order (when returning)

1. Playtest / merge QC→FE v2 ([#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63))
2. FE journey + meridian Option A — feeds FE→GC question
3. FE→GC trib script (limbo, nascent core, realm-2 scar pool)
4. GC journey depth — then GC→NS trib
5. Fate-rite trib mode — after chronicle fate-rite project

---

## Open questions (owner)

- [ ] FE→GC: player-facing limbo label (*Nascent Core* vs *Unconfirmed Golden Core*)?
- [ ] GC→NS: lightning + soul-pressure, or pure heart demon for soul path only?
- [ ] Broken Core — player branch ever, or NPC tragedy only? ([`broken-core-cultivators.md`](broken-core-cultivators.md))
- [ ] Transcendence perk popup — kill and fold into consolidation tier? (discussed, not shipped)

## Implementation crumbs

- `data.js` — `TRIBULATION_SCRIPTS`, `TRIBULATION_TRANSITIONS`, `TRIBULATION_SCARS`
- `tribulation.js` — `getTribulationPhaseChoices`, `usesScriptedTribulation`, scripted fail scars
- `cultivation.js` — `resolveBreakthroughTransitionId`, trib trigger after dantian breakthrough
- `chamber.js` — FE→GC condense + limbo hook (generic trib today)
