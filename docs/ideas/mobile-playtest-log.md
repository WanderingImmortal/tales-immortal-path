# Mobile playtest log

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | none — capture only; implement via Issues when ready |
| **Updated** | 2026-09-25 (session 7) |

Informal notes while playing on mobile. **Do not treat as spec** until triaged into Issues or design docs.

## 2026-09-24

- ~~**Qi Condensation — Condense Core visible?**~~ **Retracted (2026-09-24)** — misread realm; was on Foundation, not QC. Re-check on fresh QC run after hard reset.
- **Cultivator card reads like QC → Core Formation** — Subline under name is **path** (`PATHS.qi.name` = “Qi Cultivation”), not current realm (`scenePath` in `ui.js`). With **Foundation: Firm** + settle progress, player is on **Foundation Establishment → Core Formation**, which matches Next Breakthrough. **UX:** show realm (e.g. “Foundation Establishment”) on Cultivator card, path/trait elsewhere.
- **Early manuals hard to compare (“all Common”)** — Player can’t tell what’s *good for them* except guessing element match. Redwell/QC pool is mostly **common** grade ([`qc-technique-pamphlet-pool.md`](qc-technique-pamphlet-pool.md)); shelf shows grade + blurb + “Seals: …” (`renderMethodShelfHtml` in `cultivation-methods.js`) but not root fit, gather × vs current path, or guided intro. **Onboarding gap:** mechanic introduction shouldn’t rely on rarity color or element vibes alone. Brainstorm later: bazaar clerk hint, “matches your roots” chip, side-by-side path preview before Walk, or 1–2 clearly differentiated starter choices (not 10 same-tier commons). See [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md).
- **Bazaar restock timer (UX)** — **Logic shipped** in `ensureRedwellMarketState` (`qc-depth.js`): staples/pills refresh each **calendar month** (`G.ageMonths`); cultivation + combat manual slots **redraw each season** (every **3 months**). Merchant hint is only static text: “QC manuals redraw seasonally” (`renderMerchantPopup` in `ui.js`). **No countdown** — player can’t see “next restock in X mo”. Design called for caravan timing in [`redwell-starter-city.md`](redwell-starter-city.md) open questions. **Add:** e.g. “Staples restock: next month · Scrolls: 2 mo (Season N)” in bazaar hint or header.
- **Combat loadout pin not taught** — Comprehending a martial manual (`comprehendManual` in `techniques.js`) adds to known arts but does **not** auto-pin to `G.combatTechLoadout` (`toggleCombatTechLoadout` in `combat.js`). In fight, only **pinned** arts show under Techs; hint exists if loadout empty but easy to miss after first comprehend (“I learned it — where is it?”). Same flow on PC (pin 📍 in Techs **outside** combat). **Onboarding ideas:** one-time tip on first comprehend; auto-pin if loadout has room; or post-comprehend log line pointing to Techs → pin.
- **Root / Flow pillars not discoverable** — Foundation is three hidden stats (`G.cultivationBase`: Root, Flow, Stability in `foundation.js`); sidebar shows **grade only** (Crude/Firm…). `STAT_GUIDE.foundation` explains grade effects but **not** what Root vs Flow vs Stability mean or how to grow each. Chamber `?` / `CULTIVATION_ACTION_GUIDE` mentions “+Root” / “Flow pillar” per action — easy to miss on mobile; **hover tooltips default off** (`settings.js`). Log lines show `+🌱 Root` / `+☯️ Flow` without a glossary. **Naming clash:** creation **spiritual root** (talent) vs foundation **Root pillar** both say “root.” **Need:** stat guide entries or foundation panel breakdown; first pillar grant explainer; maybe rename one in UI (“Bedrock” / “Meridian flow”?).
