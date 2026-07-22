# Sect map UI unification

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | [`local-world-map-split.md`](local-world-map-split.md) (shared map shell) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-18–20 |
| **Updated** | 2026-07-21 |

## Intent

Sect grounds map (`sect-map.js`) already works — illustrated nodes, building detail, courtyard. Players confuse it with the **world** map. Unify **chrome** with World / Local maps: same popup family, tabs, node-click → detail panel pattern.

**Do not rebuild** sect mechanics — rehome UI.

## Design notes

### Tab bar

```text
[ World | Local | Sect ]
```

| Tab | Visible when |
|-----|----------------|
| World | Always |
| Local | Always (preview if wrong region) |
| Sect | `isSectFounded()` — else Sect button still opens founding UI |

Optional: open 🏯 Sect → default to **Sect** tab if founded.

### Shared patterns (from sect-map)

- `%` positioned nodes, tier/locked styling
- Breadcrumb back to map root
- Header stats (sect stage, influence, stores)

### World ↔ sect links

| Feature | Notes |
|---------|-------|
| **Influence banner** | Already on sect header — mirror as pin on world zone blob |
| **Founded-in-zone** | Sect header: *Founded near Bone Crossroads · Dustbone* |
| **Depart grounds** (later) | Courtyard / messenger → open Local map at region default |

### Out of scope (v1)

- Zone-themed sect grounds skins (volcanic mist, etc.)
- Road paths between sect nodes (cosmetic nice-to-have)

### Build order

1. Local + World tabbed popup
2. Move sect grounds render into third tab (same overlay or shared container)
3. Influence pin on world SVG
4. Depart grounds → local (optional)

## Prerequisites

- [x] [`local-world-map-split.md`](local-world-map-split.md) tab shell (steps 1–3 in flight)
- [ ] `renderSectGroundsHtml`, `bindSectGroundsEvents` unchanged internally

## Open questions

- [ ] One `#mapPopup` for all three vs sect keeps separate overlay?
- [ ] Mobile: three tabs crowded — dropdown?

## Implementation crumbs

- `sect-map.js`, `sect.js` — `actionSect`, `renderSectPopup`
- `index.html` — `#mapPopup`, `#sectPopup`
- `locations.js`, `world.js` — map popup
