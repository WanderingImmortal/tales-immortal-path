# NPC personality consistency (PR #203)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none |
| **Issue** | none yet |
| **Chat / PR** | `cursor/npc-personality-consistency` |
| **Updated** | 2026-11-05 |

**Sisters:** [`npc-agency-foundations-ties.md`](npc-agency-foundations-ties.md) · personality audit (chat)

## Intent

One effective personality set for gameplay and foundation consumers. Master Liang uses `careful`+`loyal`; pragmatism stays in values/convictions. No personality redesign, no agency chooser.

## Precedence

| Actor | Effective personalities |
|-------|-------------------------|
| Persistent world NPC | Live `npc.personalities` |
| Story NPC | `NPCS[id].personalities` |
| Empty new authored world NPC | Catalogue defaults, then stored on the NPC |

Authored `NPC_CHARACTER_FOUNDATIONS[].personalities` are **defaults / docs only**, not a competing live store.

`getNpcCharacterFoundation()` always reports `personalities` from `getEffectiveNpcPersonalities()`.

Values, ambitions, convictions, attachments remain independent.

## Character-model layers

| Layer | Meaning | Must not mean |
|-------|---------|----------------|
| Personality | Stable interaction style / coarse tendencies | Automatic decisions |
| Values | What they care about | Instant action |
| Ambitions | What they seek | Always pursue now |
| Convictions | Principles that bias choices | Hard locks forever |
| Attachments | Personal stakes (lodge, kin, place) | Org membership alone |
| Social ties | Relationships between actors | Symmetric feelings |

Examples: `loyal` ≠ unconditional obedience; `careful` ≠ refuse every risk.

## Master Liang migration

Target: `careful`, `loyal`.

Migrates **only** exact legacy defaults (order-insensitive):

- `cunning` + `wise` (#201)
- `cunning` + `loyal` (#202)

Empty → fill target. Unrecognised arrays **preserved**. Idempotent. Does not touch age, realm, zone, merit, impression/trust, Wei Shun, or lodge membership.

## Procedural foundations

Build after final generation-time personality assignment (ambient sorrowful inject happens before promote → foundation). Existing blobs: sync `foundation.personalities` mirror to live; **do not** regenerate values/ambitions/convictions every ensure/tick.
