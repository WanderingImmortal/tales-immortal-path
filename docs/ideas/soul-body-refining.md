# Soul-into-body refining (body path)

| Field | Value |
|-------|-------|
| **Status** | `idea` (stub — owner 2026-07-22) |
| **Blocked on** | Body path physique rewrite; cycle-stain (`addCycleStain`) wired |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-07-22 |
| **Updated** | 2026-07-22 |

## Intent

Forbidden body cultivation: **refining souls into the flesh** — not a physique identity, but a **practice**. Major **cycle stain** (corruption) and likely **sacrilege** ledger entry. Heaven notices at threshold; amplifies at next juncture.

Distinct from **blood devourer** physique: being a blood cultivator is not a crime; **massacres and feeding** are acts that stain. Soul refining is **inherently** cycle tampering.

Related: [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md), [`tribulation-system-rework.md`](tribulation-system-rework.md), physique / body chamber rewrite (TBD).

## Design notes (stub)

### Open questions

- [ ] What does soul-into-body **do** mechanically? (Physique tier skip? Permanent stat? Forbidden regen?)
- [ ] One soul per rite vs batch refining?
- [ ] Stain per soul refined vs per rite completed?
- [ ] Does it block reincarnation for victims (major karmic harm)?
- [ ] Body path project shell (like physique-cultivation / seclusion) — months/years?

### Likely rules (draft)

| Rule | Direction |
|------|-----------|
| Stain | **Large** `addCycleStain` per successful refine |
| Sacrilege | Optional ledger entry on first success |
| Alignment | Rebellious / jianghu evil — separate from stain |
| Physique type | **Not** tied to evil physique tag — tied to **this practice** |

## Prerequisites

- [ ] Body path chamber rewrite
- [ ] `addCycleStain()` + tribulation amplify
- [ ] Soul / NPC victim hooks (or abstract "condemned soul" material for v0)

## Implementation crumbs

- `physique-cultivation.js` — staged project pattern
- `cultivation.js` — evil physique embrace (to be removed/replaced)
- `alignment-sacrilege-corruption.md` — cycle tampering sources
