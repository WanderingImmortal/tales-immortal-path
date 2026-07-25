# Qi path — Foundation Establishment redesign

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Owner per-realm design; [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md); technique-driven cultivation |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-22 (cross-link: P2 nature stamp hooks today’s Seal; redesign integrates later) |

## Intent

Foundation Establishment should feel like its own journey: gather qi, refine/condense quality, stabilise into a foundation, **seal** it — done. Leaving FE means **Initial Core Formation** — the cultivator forms their nascent golden core, which **triggers** heavenly tribulation. Until tribulation is survived, they occupy a **pseudo-realm** (core formed but not heaven-accepted). Success → officially **Golden Core** realm.

Each realm is **personally designed** by the owner — no forced shared template across realms.

### Naming (owner preference, 2026-07-18)

- Use **Golden Core** for the realm stage in player-facing text where possible — avoids confusion with **Initial Core Formation** (the breakthrough verb/event).
- Game data today: realm string is `Core Formation` but title is `Golden Core Disciple` — rename pass TBD.
- **Condense Core** reserved for late Golden Core maximisation (`golden-core-condense-peak.md`), not FE exit.

## Design notes

### Player fantasy (target)

1. **Gather** — draw qi in (eventually via active breathing/cultivation technique).
2. **Condense / refine** — build density and quality (not necessarily a single button named “condense”).
3. **Stabilise** — lock qi into foundation pillars / variant.
4. **Seal** — complete Foundation Establishment as a stage.
5. **Initial Core Formation** — form the nascent golden core → enter **limbo** (pseudo-realm) → tribulation descends.
6. **Survive tribulation** — heavens accept → officially **Golden Core** realm.

See `tribulation-per-realm-limbo.md` for limbo + per-realm tribulation design space.

“Condense Core” as a name/action **does not belong at FE peak** in the new vision — it reads like late golden-core play (see `golden-core-condense-peak.md`).

### Breakthrough naming (draft)

- FE exit: **Initial Core Formation** (forms nascent core, triggers tribulation) — not “Condense Core”.
- Limbo label (player-facing TBD): *Nascent Core*, *Unconfirmed Golden Core*, *Between Realms*, etc.
- Tribulation success copy: *accepted by the heavens*, official **Golden Core** standing.
- Avoid overloading “condense” at FE; reserve for GC peak (`golden-core-condense-peak.md`).

### Technique sacrifice — deprioritise

Current **Refine Foundation** and Core Formation **seal** both sacrifice techniques. Owner preference: **avoid sacrifice unless lore-required**. Arbitrary technique loss feels like punishment without setup.

Alternatives to explore when designing FE:

- Stones + time + materials only
- Consume **pills** or **manual pages** with clear fiction
- Permanent sacrifice only for named story techniques / forbidden arts
- “Burn” a **breathing method upgrade** rather than a combat technique

### What may change in current build

| Current | Direction |
|---------|-----------|
| `chamberCondenseCore` at `realmIdx === 1` | Move/rename — FE exit is “form initial core” + tribulation, not “condense core” |
| `chamberPerfectFoundation` technique sacrifice | Rework or remove unless lore supports it |
| `CONSOLIDATION_BY_REALM[2].sacrificeTechnique` | Rework when GC seal is designed |
| Seal Dantian at FE | Likely stays — “completing the foundation”; **P2** stamps foundation **nature** + locks cultivation path here on the *current* action — when this redesign lands, call the same stamp helper at the new seal beat ([`technique-driven-cultivation.md`](technique-driven-cultivation.md)) |

### P2 note (2026-07-22)

Foundation **nature** (elemental / affinity / fiend — not quality Crude→Peerless) is designed and should ship against **today’s** Seal/Consolidate. This redesign must **reuse** that stamp+lock, not invent a parallel system. Seal vs Consolidate naming cleanup remains in this doc’s scope.

## Prerequisites

- [ ] Owner FE design pass (actions, names, costs)
- [ ] Align with `technique-driven-cultivation.md` (breathing method as primary grind)
- [ ] Decide FE tribulation trigger vs generic 24-month Break Through

### Meridians — Option A (owner 2026-07-22)

Meridians are **FE foundation wiring**, not QC grind or QC→FE tribulation beats. When this redesign ships, wire circulation fantasy here; drop QC `minMeridians` gates. See scar + trib notes in [`tribulation-system-rework.md`](tribulation-system-rework.md).

## Open questions

- Limbo UX: can you cultivate / travel / fight while heaven’s verdict is pending?
- Does every player form a nascent core of varying quality before tribulation (technique / foundation variant)?
- What replaces technique sacrifice for Flow pillar growth?
- Is sealing FE and attempting Initial Core Formation one continuous rite or two deliberate beats?

## Implementation crumbs

- `chamber.js` — `condenseCore`, `chamberPerfectFoundation`, `CHAMBER_BALANCE`
- `consolidation.js` — Seal Dantian, `CONSOLIDATION_BY_REALM[1]`
- `cultivation.js` — `executeBreakthrough`, tribulation hooks
- `tribulation.js` — post-condense resolution `resolveChamberCondenseAfterTribulation`
