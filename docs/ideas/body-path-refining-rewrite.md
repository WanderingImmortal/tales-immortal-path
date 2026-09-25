# Body path — refining rewrite (ACS lean)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner lean locked 2026-08-05; full design still open) |
| **Blocked on** | Anatomy Phase 1–2 can proceed; full rewrite design after that |
| **Issue** | none yet |
| **Chat / PR** | Body chamber triage 2026-08-05 |
| **Updated** | 2026-09-25 |

## Intent

Body cultivation should feel like **refining a living vessel** — layer by layer, organ by organ, with visible quality changes — closer in spirit to *Amazing Cultivation Simulator* body work than to qi’s “fill bar → break into a new realm.”

**Owner lean (2026-08-05):** body path does **not** need qi-style realm breakthroughs. It needs **milestone equivalents** — named checkpoints that line up with qi/soul realm *indices* so relative power, travel danger, trib gates, and UI comparisons stay easy to track. The *work* is refining; the *milestones* are the power ruler, not the fantasy of “ascending a new realm” the way qi does.

Related visuals: [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md) (Phase 1–2 anatomy can ship first). Forbidden practice stub: [`soul-body-refining.md`](soul-body-refining.md).

## Design notes

### What exists today

| Piece | Today |
|-------|--------|
| **Body realms** | Named ladder on `PATHS.body`: Bronze Skin → Iron Bones → Jade Marrow → … |
| **Body chamber** | Layers with 0–100% progress; actions bump layer %; sub-unlocks |
| **Bone tier (Phase 3a proposal)** | Not built — visual ladder proposal only |

### Mesh direction (owner lean)

**Refining = the loop. Milestones = the power ruler.**

- Player refines layers / parts (ACS feel).
- Thresholds award **milestones** mapped to the same index as qi’s QC / FE / GC / …
- Milestone names can keep Bronze Skin / Iron Bones / etc. as **labels** without a qi-copy breakthrough ritual.
- Tribulation / heaven notice: TBD.

**Phase 1–2 anatomy does not wait on this.**

### Chamber scope (lean 2026-09-25)

The live chamber is seven layers on one figure: skin, flesh, bones, organs, blood, meridians, nerves. Each layer is a few repeats for a small percent. The next layer opens at 50% of the previous. Nerves is one capstone click. Realm progress treats “your realm index” as “which layer you are on,” and there are only seven layers.

That chamber is the **mortal dig**, the work of realms 0–3 (Inner Tempering through Nascent Physique). It stays **one screen**. The realm name changes when the dig crosses a threshold. A layer is not a realm. Skin is not Inner Tempering by itself. The physique being born is the moment this chamber is finished.

Later realms do not add layers. They change the work done to the body you already refined:

| Idx | Realm | Work |
|-----|--------|------|
| 0–3 | Inner Tempering → Nascent Physique | The current chamber, one continuous refinement. Milestones rename you. Heaven does not need a tribulation at every layer. |
| 4 | Physique Transformation | Change the finished mortal body. Same figure, new kind of flesh. Not new organs. |
| 5 | Hollow Refinement | Open an empty place inside that body and refine power there. Early on you are not past a transformed physique until the hollow fills. |
| 6 | Origin Seeking | One source in the flesh. A sworn rule becomes that source. No oath means a slower dig, and no interior peak. Not a dao library. |
| 7 | Origin Manifestation | That source becomes the flesh people meet. |
| 8 | Saintly Flesh | Sanctify. The end. |

The “three clicks, +1%” gimmick is a depth problem **inside** the mortal dig. Solve it there later (quality, materials, the figure actually changing). Do not solve it by inventing layers for the saint path.

Names and the oath split: [`nine-realm-ladder.md`](nine-realm-ladder.md).

## Prerequisites

- [x] Owner lean: milestones for power parity, not qi-style realm breakthroughs
- [ ] Anatomy Phase 1–2 ([`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md))
- [ ] Map refine thresholds → milestone indices
- [ ] Full design pass → `designed` before Issues

## Open questions

- Does every milestone need a tribulation, or only watershed steps?
- ACS-style “temper organ X with material Y” recipes?
- Realm names: **rename** (owner 2026-09-25). Live material ladder does not match qi grandeur. Proposal, not locked: [`nine-realm-ladder.md`](nine-realm-ladder.md) — Inner Tempering through Saintly Flesh.

## Implementation crumbs

`data.js` `PATHS.body`, `body-chamber.js`, [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md) Phase 3.
