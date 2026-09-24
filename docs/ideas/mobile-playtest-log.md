# Mobile playtest log

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | none — capture only; implement via Issues when ready |
| **Updated** | 2026-09-24 (session 4) |

Informal notes while playing on mobile. **Do not treat as spec** until triaged into Issues or design docs.

## 2026-09-24

- ~~**Qi Condensation — Condense Core visible?**~~ **Retracted (2026-09-24)** — misread realm; was on Foundation, not QC. Re-check on fresh QC run after hard reset.
- **Cultivator card reads like QC → Core Formation** — Subline under name is **path** (`PATHS.qi.name` = “Qi Cultivation”), not current realm (`scenePath` in `ui.js`). With **Foundation: Firm** + settle progress, player is on **Foundation Establishment → Core Formation**, which matches Next Breakthrough. **UX:** show realm (e.g. “Foundation Establishment”) on Cultivator card, path/trait elsewhere.
- **Early manuals hard to compare (“all Common”)** — Player can’t tell what’s *good for them* except guessing element match. Redwell/QC pool is mostly **common** grade ([`qc-technique-pamphlet-pool.md`](qc-technique-pamphlet-pool.md)); shelf shows grade + blurb + “Seals: …” (`renderMethodShelfHtml` in `cultivation-methods.js`) but not root fit, gather × vs current path, or guided intro. **Onboarding gap:** mechanic introduction shouldn’t rely on rarity color or element vibes alone. Brainstorm later: bazaar clerk hint, “matches your roots” chip, side-by-side path preview before Walk, or 1–2 clearly differentiated starter choices (not 10 same-tier commons). See [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md).
