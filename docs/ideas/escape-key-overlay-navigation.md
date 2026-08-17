# Escape key overlay navigation

| Field | Value |
|-------|-------|
| **Status** | `building` (layer 1 shipped) |
| **Blocked on** | none |
| **Issue** | none yet |
| **Chat / PR** | Playtest 2026-08-17 · `cursor/playtest-breakthrough-escape-6077` |
| **Updated** | 2026-08-17 |

## Intent

Players expect **Escape** to back out of menus and full-screen panels. Layer 1 closes the top overlay; later layers refine behavior inside overlays that use sub-tabs.

## Design notes

### Layer 1 — close top overlay (shipped)

- Global `keydown` listener (same input guard as Space → world clock).
- Walk a fixed close order: small choice popups → chambers → hub → journal-scale panels.
- Use existing `close*` helpers where they reset `G.inQiChamber` etc.; otherwise remove `.active`.
- **Blocked on Escape:** combat, tribulation, transcendence perk choice, active tutorial spotlight popup, creation screen.
- Action-help `?` popover closes first if open.

Implementation: `overlay-keyboard.js` · `initOverlayKeyboardEscape()` from `main.js`.

### Layer 2 — reset sub-tab before close (parked)

When an overlay has internal tabs, first Escape resets to the default tab instead of closing:

| Overlay | Default tab |
|---------|-------------|
| Map | World |
| Quest journal | My path |
| Factions | Here |
| Forge chamber | Standard recipes |
| Body chamber | Current layer or first unlocked |
| Soul chamber | Awakened / prelude rules |

Second Escape (or Escape on default tab) closes the overlay (layer 1).

### Layer 3 — polish (parked)

- Optional “Esc to close” hint on overlay chrome for first visit.
- Ensure Escape mirrors every visible Return / Close button (audit when adding new overlays).

## Prerequisites

- [x] Layer 1 close order + block list
- [ ] Layer 2 tab-reset map per overlay
- [ ] Layer 3 UX hints

## Open questions

- Should `tutorialLogPopup` close on Escape (layer 1 includes it) while `tutorialPopup` stays blocked?
- Seclusion picker / sect succession — close vs forced choice?

## Implementation crumbs

- `overlay-keyboard.js` — `ESCAPE_OVERLAY_CLOSE_ORDER`, `ESCAPE_BLOCK_OVERLAY_IDS`
- `world-clock.js` — Space pause uses same input-target guard pattern
- Tab state: `mapPopupUi.tab` (`world.js`), journal/factions tab buttons in `index.html`, forge/body/soul chamber tab renderers
