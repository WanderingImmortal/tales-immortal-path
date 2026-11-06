# Institutional formation needs & paid maintenance

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none (#212–213 shipped) |
| **Issue** | none yet |
| **Chat / PR** | PR #214 · `cursor/lodge-formation-work-orders` |
| **Updated** | 2026-11-06 |

## Intent

The Well-Ring Lodge independently notices when its courtyard Spirit Gathering formation wears, decides whether it can fund ordinary inscription maintenance from real treasury and storehouse stock, and can pay a qualified present member to do the work. No infinite resources, no invented NPC formation mastery, no general employment AI.

## Design notes

### Work order

Single persistent record on `G.wellRing.lodge.formationWork` for install `wr_courtyard_spirit_gathering`:

| status | meaning |
|--------|---------|
| `none` | integrity ≥ sharp band (70) — no need |
| `funded` | worn but ≥ fading (35); treasury + herbs cover chalk+wage |
| `deferred_insufficient` | need exists; short stones or herbs |
| `unserviceable` | scattered or integrity &lt; 35 — ordinary maintain impossible |

Threshold: open need when integrity **&lt; 70** (FORMATION_F1A sharp band). Idempotent across ticks — one object, no job spam, does not reset integrity.

### Endowment (documented, finite)

`WELL_RING_FORMATION_SERVICE`:

- treasury baseline **48** spirit stones (`lodge.treasuryStones`)
- chalk **4** + wage **8** per job (from treasury)
- **1** storehouse herb per job (`storehouse.herbStock`, existing ledger)
- No auto-replenish from this feature

### Paid player job

`performWellRingPaidFormationMaintain` → shared `maintainWorldFormationInscription(..., { fundingSource: 'institution' })`.

Eligibility: Redwell present · member · deciphered spirit_gathering · funded work order · install still ordinarily maintainable.

Self-funded maintain remains a separate UI action and never pays wages.

### NPC independence

`hasWellRingQualifiedFormationPractitioner()` is **false** — Liang/Wei have no formation-pattern knowledge. Lodge may sit with a funded need and `notes: awaiting_qualified_hand` / `external_expertise_needed`. Acceptable sim outcome.

### World time

Tick `wellRingFormationService` priority **39** (after `worldFormations` at 38). Pausing time does not invent decisions; skips re-evaluate in place without duplicating orders or payments.

## Prerequisites

- [x] #212 persistent world installation
- [x] #213 inscription maintain path

## Open questions

- When (if ever) a cast NPC gains real formation familiarity for NPC-performed maintain.
- Whether deferred jobs should surface a soft UI ask for donations (out of scope for #214).

## Implementation crumbs

- `well-ring-lodge.js` — treasury, work order, evaluate, paid perform
- `world-formations.js` — `fundingSource: 'institution'`, UI paid vs self-funded
- `qc-depth.js` — paid button handler
- `scripts/test-lodge-formation-work-orders.js`
