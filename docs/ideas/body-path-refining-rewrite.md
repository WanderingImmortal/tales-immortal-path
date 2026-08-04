# Body path — refining rewrite (ACS lean)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner lean locked 2026-08-05; full design still open) |
| **Blocked on** | Anatomy Phase 1–2 can proceed; full rewrite design after that |
| **Issue** | none yet |
| **Chat / PR** | Body chamber triage 2026-08-05 |
| **Updated** | 2026-08-05 |

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

## Prerequisites

- [x] Owner lean: milestones for power parity, not qi-style realm breakthroughs
- [ ] Anatomy Phase 1–2 ([`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md))
- [ ] Map refine thresholds → milestone indices
- [ ] Full design pass → `designed` before Issues

## Open questions

- Does every milestone need a tribulation, or only watershed steps?
- ACS-style “temper organ X with material Y” recipes?
- Keep current body realm *names* as milestone labels, or rename?

## Implementation crumbs

`data.js` `PATHS.body`, `body-chamber.js`, [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md) Phase 3.
