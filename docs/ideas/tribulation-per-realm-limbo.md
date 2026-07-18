# Tribulation — per-realm identity & limbo states

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Realm naming pass; FE → Golden Core breakthrough design |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

## Intent

Tribulations should feel like **heaven testing whether you belong in the next realm** — not a generic combat minigame with higher numbers each time. Each major breakthrough may deserve a **distinct trial identity** (theme, choices, failure mode). Scaling severity alone might be enough for v1, but design space is reserved for realm-unique tribulations later.

## Design notes

### World rule (draft)

Breaking through is not instant promotion. The cultivator enters a **limbo / pseudo-state** — the dao is formed locally but **not yet recognised by heaven**. Tribulation is the audit. Survive → accepted → official realm standing. Fail → core shatters, foundation cracks, or regression (TBD per realm).

**First instance — Initial Core Formation (FE → Golden Core):**

1. Foundation sealed; cultivator attempts **Initial Core Formation** (forms the nascent golden core).
2. Core exists but heaven has not ratified yet — **limbo is thin**: tribulation should hit **immediately** on entering this state (no extended pseudo-realm gameplay for the player).
3. Heavenly tribulation descends **because** the core formed (cause → effect).
4. Success → heavens accept → officially **Golden Core** realm.
5. Hard fail → nascent core shatters (regression / cracks — per FE design).
6. Rare marginal outcome → **Broken Core** (survived but damaged core, no advance path) — see `broken-core-cultivators.md`; primarily NPC flavour.

### Per-realm tribulation identity (future)

| Realm transition | Trial theme (sketch) | Notes |
|------------------|----------------------|-------|
| FE → Golden Core | Lightning + heart common; core integrity tested | Limbo state; first full tribulation |
| Golden Core → Nascent Soul | Soul emergence; inner self vs outer dao | `miniTribulation` already on NS seal in data — align or merge |
| Nascent Soul → Void Refinement | Void / identity dissolution | |
| … | Dao Heart, Karmic, Heavenly Punishment stubs in `TRIBULATION_TYPES` | |

**v1 option:** keep `getTribulationSeverity()` scaling + `pickTribulationType()` weights, but **flavor, omen text, and choice pools** keyed by `targetRealm` or `transitionId`.

**v2 option:** hard-assign tribulation type (or multi-phase sequence) per transition — no random lightning vs heart at major gates.

### Current build (gap)

- Tribulation type is mostly random (lightning vs heart_demon) with path/realmIdx tweaks.
- Three types are “Coming soon” (`dao_heart`, `karmic`, `heavenly_punishment`).
- No `limbo` / pseudo-realm state between breakthrough attempt and tribulation success.
- `resolveChamberCondenseAfterTribulation` advances realm on trib pass — close to limbo model but naming and fiction don’t match.

## Prerequisites

- [ ] Realm display names (`Golden Core` vs `Core Formation`) — see `qi-foundation-establishment-redesign.md`
- [ ] Owner defines limbo state UX (stats panel, log copy, can you cultivate while in limbo?)
- [ ] FE Initial Core Formation action design

## Open questions

- Is limbo only at FE→GC, or every major realm transition (still immediate trib each time)?
- Does scaling-only tribulation feel fair for replay, or do major gates need scripted trials?
- Body/soul paths: same limbo + heaven acceptance, or different auditors?
- Player Broken Core: ever allowed, or NPC-only? (`broken-core-cultivators.md`)

## Implementation crumbs

- `tribulation.js` — `startTribulation`, `pickTribulationType`, `getTribulationSeverity`, `TRIBULATION_TYPES`
- `chamber.js` — `chamberCondensePending`, `resolveChamberCondenseAfterTribulation`
- `G.realmIdx` — may need `G.realmPending` / `G.cultivationLimbo` flag
- `data.js` — `PATHS.qi.realms`, `TRIBULATION_PATH_FLAVOR`
