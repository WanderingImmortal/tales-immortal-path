# Phone playtest layout (opt-in)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none (self-contained UI preference) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent — phone playtest sketch (2026-09-23) |
| **Updated** | 2026-09-23 |

## Intent

Play the same game on a phone **without replacing the PC layout you like**. An explicit **Phone playtest layout** toggle switches to a second, playtest-oriented shell: scene and actions first, stats tucked away, log easy to reach. Default remains today’s desktop-first UI (including existing narrow-screen `@media` rules when the toggle is off).

Audience: solo playtest (you), maybe a mate — not store-ready mobile product.

## Design principles

1. **Opt-in only** — PC players never see it unless they turn it on.
2. **Class-scoped CSS** — new rules live under `.layout-phone-playtest` (on `#app` or `body`), appended at end of `style.css`; avoid editing existing desktop breakpoints except where we must override with higher specificity.
3. **Same DOM** — reorder with flex `order`, `position: sticky/fixed`, and collapsible sections; no duplicate buttons or parallel screens.
4. **Persist per browser** — `localStorage` via existing `settings.js` / `wi_ui_settings_v1` (same pattern as `hoverTooltips`).
5. **Ship in slices** — v1 makes the **main loop** tolerable; chambers/combat get pass/fail fixes in follow-ups.

## Toggle UX

| Where | Control |
|-------|---------|
| **Settings panel** (sidebar) | Checkbox: **Phone playtest layout** + one-line hint (“Scene-first mobile shell; PC layout unchanged when off.”) |
| Optional later | Floating **📝** for playtest notes when mode is on (notes panel stays in DOM; FAB opens sheet) |

**On change:** set `document.documentElement` or `#app` class `layout-phone-playtest`, call nothing heavy (no full re-render required unless log dock needs a class).

**PC + toggle on:** Optional but useful — layout can apply at any width so you can resize the window and preview phone shell without a device.

**Auto-enable:** Defer. Manual toggle avoids surprises; optional `?phone=1` query param for one-tap bookmark on phone is a nice v1.1.

## v1 layout (in-game ` #game-screen`)

Today on narrow viewports: `.main-layout` → **one column**, **sidebar entire block first** (stats + all action groups + playtest panel), then scene — long scroll before “being in the world.”

**Phone playtest mode** target order and chrome:

```text
┌─────────────────────────────┐
│ Header (compact)            │
│ [Realm · age · lifespan]    │  ← slim “hero strip” (subset of hero-panel)
├─────────────────────────────┤
│                             │
│   SCENE (zone, cards, text) │  ← primary flex area
│                             │
├─────────────────────────────┤
│ Chronicle log (peek/expand) │  ← docked; not buried under stats
├─────────────────────────────┤
│ Sticky action dock          │  ← 2×N grid, same buttons as today
│ [Cultivate][Explore][…]     │
└─────────────────────────────┘
     [Stats ▲]  [📝 Note]      ← opens drawer / playtest sheet
```

### Sidebar → drawer

- **Collapsed (default in phone mode):** single row or two rows: realm title, lifespan banner, **4–6 vital chips** (Qi, HP, stones, zone chip optional).
- **“Stats & more” drawer:** overlay or bottom sheet containing the rest of `hero-panel` (advanced stats, gear strip, settings, playtest panel, secondary action groups if not all fit in dock).
- **Action dock:** prioritize **Cultivation / Explore / Travel / Inventory** (or whatever `actions-panel-core` already surfaces); overflow “More actions” opens drawer section — reuse existing buttons by moving container in CSS only if possible; if not, duplicate IDs are forbidden → use **flex order** on existing `.sidebar` children:
  - Split is hard because actions live inside sidebar today.

**DOM-friendly approach (preferred):**

- Keep one `.sidebar`, but in phone mode:
  - `.hero-panel` → compress + `max-height` + internal collapse (reuse `btnStatsToggle` pattern).
  - `.actions-panel` → `position: fixed; bottom: 0; left: 0; right: 0; z-index: …` with safe-area padding.
  - `.scene-panel` → `order: -1` or reorder grid so scene is first in tab order visually.
- `.main-layout` in phone mode: `display: flex; flex-direction: column;` with explicit `order` on `.scene-panel` (1), `.sidebar` hero strip only visible… 

**Pragmatic v1 cut:** Use CSS grid on `.main-layout` under phone class:

| Area | Source | Phone mode behavior |
|------|--------|---------------------|
| Scene | `main.scene-panel` | `order: 1`, `flex: 1 1 auto`, min-height ~45dvh |
| Stats | `.hero-panel` | `order: 2` → collapse to **summary** via new modifier class toggled by existing “More stats” or auto-collapsed in phone mode |
| Actions | `.actions-panel` | `order: 3`, fixed bottom dock |
| Playtest | `.playtest-panel` | Inside drawer or second tab in drawer |

If fixed bottom actions clip content, add `padding-bottom` on `.game-screen` equal to dock height.

### Log panel

- Today: absolute bottom-right; on narrow `@media` goes full width but still **below** sidebar in scroll order.
- Phone mode: `position: fixed` above action dock; default height ~120px; expand upward (existing `.expanded` toggle).

### Creation screen

- Same class on `#app`: hide side art (already at 900px), single column — **add** sticky **Begin** footer and tighter section spacing under phone class only.

## What stays unchanged

- Wide viewport with toggle **off** → identical to current game.
- Toggle **off** on phone → current condensed column (no regression).
- All overlay popups/chambers/combat: **unchanged in v1** except shared bottom-sheet rules where they already exist; file issues as you hit blockers on device.

## Settings / code hooks

| Piece | Likely touch |
|-------|----------------|
| `settings.js` | `phonePlaytestLayout: false` default; apply class on init + change |
| `index.html` | One checkbox in `#settingsPanel` |
| `style.css` | New section `/* Phone playtest layout (opt-in) */` ~200–400 lines for v1 |
| `main.js` / `initUiSettings` | Wire toggle (already centralized in settings.js) |

No change to save format, `G`, or action handlers.

## Phases

### v1 — Main loop (first Issue)

- [ ] Setting + `layout-phone-playtest` class
- [ ] Scene-first column order + bottom action dock + log above dock
- [ ] Hero summary collapsed by default in phone mode
- [ ] `padding-bottom` / `safe-area-inset` for notched phones
- [ ] Manual test: creation → explore → one combat → open inventory popup

### v1.1 — Playtest friction

- [ ] Floating playtest note button (opens existing panel in sheet)
- [ ] Optional `?phone=1` enables layout once, then respects saved setting

### v2 — Hot paths

- [ ] Creation screen sticky CTA
- [ ] Combat overlay: taller log, bigger tap targets under phone class only
- [ ] One cultivation chamber smoke-tested (Qi hub entry)

### Non-goals

- Play Store / APK / Netlify vs GitHub Pages
- Replacing default `@media` stack when toggle is off
- Full chamber redesign or cloud saves

## Owner sketch (2026-09-23, informal)

Hub-and-spoke phone shell (not gospel):

```text
┌──────────────────────────────────────┐
│ Name · realm · age          [clock]  │  top-left identity · top-right world-clock speeds
│              (visual)                 │  upper-middle — character / scene focal (eye candy)
│         [ 🧘 Cultivate ]             │  opens existing Three Refinements hub → Qi / Body / Soul
│                                      │
│            (scene / zone)            │  main story space
│                                      │
│  [Cultivation][World][Arts][Sect]…   │  sidebar *groups* as buttons → sheet with that group’s actions
└──────────────────────────────────────┘
```

- Important things **grouped**; groups are **buttons**; tap group → pick action inside (matches current `action-group-label` buckets).
- PC sidebar stays untouched when toggle off.

## Open questions

- **Action dock scope:** Show all unlocked actions in dock, or top 6 + “More” scrolling the old panel?
- **Drawer vs full-screen stats:** Bottom sheet (matches existing popup pattern at 768px) vs slide-over from right?
- **Enable on PC preview:** Default toggle applies at all widths, or only `@media (max-width: 900px)` unless `?preview=1`?

**Recommendation:** Toggle applies at **all widths** when on (simplest); you preview by narrowing the window. Phone-only gating can come later if desktop accidentally gets toggled.

## Safety

- Recursion audits unchanged unless new init hooks call `ensure*` chains (avoid).
- Prefer class toggles over `innerHTML` layout rewrites.
