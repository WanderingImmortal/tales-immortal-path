# Formation inscription upkeep

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | Structural repair / commissions later |
| **Issue** | none yet |
| **Chat / PR** | `cursor/formation-inscription-upkeep` · PR #213 |
| **Updated** | 2026-11-06 |

**Hub:** [`persistent-world-formations.md`](persistent-world-formations.md) · [`formations-and-arrays.md`](formations-and-arrays.md)

## Intent

First playable formation-service verb: **inscription maintenance** on an institutional install (Well-Ring court Spirit Gathering). Spend time + materials to restore ordinary wear — not structural rebuild, not employment.

## Conceptual split

| Kind | This PR | Later |
|------|---------|-------|
| Routine upkeep (fuel/clean) | deferred (ambient needs no fuel) | attendants |
| **Inscription maintenance** | **shipped** | — |
| Structural repair | blocked when integrity &lt; fading band (35) or scattered | expert rebuild |

## Rules (Well-Ring)

| Check | Rule |
|-------|------|
| Presence | At `install.locationId` (Redwell) |
| Permission | `getWorldFormationServicePermission` → current Well-Ring **member** |
| Knowledge | `isFormationDeciphered(formationId)` — diagram familiarity, **not** master rank |
| Cost | 1 mo · 4💎 · 1× Spirit Herb (mirrors F1a personal maintain) |
| Restore | +35 integrity, capped at 100 |
| Floor | integrity ≥ 35 (fading band); below → structural repair required |
| Identity | Mutate `G.worldFormations.byId` record only — never replace / copy |

## UI

Lodge popup: meditation-court section with perception, condition label, Maintain button. Inspect exposes no raw integrity counters.

## Implementation crumbs

- [`world-formations.js`](../../world-formations.js) — inspect / maintain / permission
- [`qc-depth.js`](../../qc-depth.js) — lodge UI wire
- Tests: `scripts/test-formation-inscription-upkeep.js`
