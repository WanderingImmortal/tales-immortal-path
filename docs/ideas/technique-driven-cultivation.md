# Technique-driven cultivation & foundation variants

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md); FE qi-path pass |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

## Intent

Cultivation should run **through** an active **cultivation method** — especially at early realms. A poor method should slow Gather-style progress, cap how high you can push a realm, and produce a weaker (or differently shaped) foundation. Better methods unlock higher ceilings and distinct foundation **variants** (quality and type), not just faster numbers.

**Framework:** method families, essence draws, data model, and UI split live in [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md). This doc covers **what methods do to foundations** and per-realm journey shape.

Foundation variants may be **caused by** the method used during Establishment (plus essence milestones), or **required** to attempt certain breakthroughs / foundation types later.

Each major realm should feel like its own journey — not a reused four-layer template with renamed buttons.

## Design notes

### Core loop (sketch)

- Player selects an active **cultivation method** (breathing, circulation, essence resonance, etc.) while in the qi chamber — see framework doc for families.
- That technique modifies:
  - **Gather / circulate speed** (time cost, density gain, fill rate)
  - **Realm gate** — hard or soft cap on progress % or peak requirements until a better method is learned
  - **Foundation outcome** — variant id, pillar skew (Root / Flow / Stability), grade ceiling, special tags (e.g. `sword-aligned`, `volatile`, `meridian-hungry`)

### Foundation variants (sketch)

- Not only Crude → Peerless grade — also **type** or **lineage** (e.g. firm earth foundation, sword-intent foundation, cracked hasty foundation).
- Variants from:
  - Technique used during FE grind + seal
  - Optional player choices at seal (Settled vs Peak, sacrifices)
  - Events, pills, drawbacks (future)
- Some later realms or sect techniques may **require** a specific foundation variant.

### Technique sacrifice — avoid unless lore-required

Owner preference: sacrificing combat techniques for cultivation progress feels like **punishment** unless the fiction establishes why (forbidden art, vow, irreversible inscription). Prefer stones, time, materials, pills, or breathing-method upgrades over burning random techniques.

### Relation to current FE (as of 2026-07-18)

Today FE is mostly technique-agnostic except **Refine Foundation** (sacrifice a spare combat technique for Flow) — likely to be reworked. This idea would make the **primary breathing method** central to the whole stage. See also `qi-foundation-establishment-redesign.md`.

### Non-goals (for now)

- No implementation until FE / golden-core redesign direction is settled.
- Do not force one template across all seven realms — each realm gets its own fantasy and actions.

## Prerequisites

- [ ] Clarify FE player fantasy end-to-end (gather → stabilise → seal → leave realm)
- [ ] [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — method pool + active method (P0+)
- [ ] Data model for foundation `variantId` + method `profile.foundationVariant`
- [ ] UI: active cultivation technique picker in chamber

## Open questions

- One active breathing technique at a time, or swap with cooldown / penalty?
- Can you change technique mid-FE and blend foundations, or lock variant at first seal?
- Do variants affect combat, tribulation, and markets — or only cultivation gates?
- How does this interact with body/soul paths (parallel "method" systems)?

## Implementation crumbs

- `chamber.js` — Gather Qi, Refine Foundation, Condense Core
- `foundation.js` — Root / Flow / Stability pillars, grades, cracks
- `consolidation.js` — Seal Dantian, realm progress meter
- `techniques.js` — technique templates, sacrifice flows
- `data.js` — `PATHS`, `CONSOLIDATION_BY_REALM`, `CULTIVATION_ACTION_GUIDE`
