# Mobile playtest log

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | none — capture only; implement via Issues when ready |
| **Updated** | 2026-09-24 (session 2) |

Informal notes while playing on mobile. **Do not treat as spec** until triaged into Issues or design docs.

## 2026-09-24

- **Qi Condensation — Condense Core visible?** Probably should **not** show Condense Core during QC (realm-appropriate actions only; Condense Core is a later chamber beat — see `chamber.js` / `CHAMBER_BALANCE.condenseCore`).
- **Cultivator card reads like QC → Core Formation** — Subline under name is **path** (`PATHS.qi.name` = “Qi Cultivation”), not current realm (`scenePath` in `ui.js`). With **Foundation: Firm** + settle progress, player is on **Foundation Establishment → Core Formation**, which matches Next Breakthrough. **UX:** show realm (e.g. “Foundation Establishment”) on Cultivator card, path/trait elsewhere.
