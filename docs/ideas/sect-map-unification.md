# Sect map UI unification

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | — (World/Local shell shipped in [#56](https://github.com/WanderingImmortal/tales-immortal-path/pull/56)) |
| **Issue** | none yet |
| **Chat / PR** | [PR #57](https://github.com/WanderingImmortal/tales-immortal-path/pull/57) |
| **Updated** | 2026-07-22 |

## Intent

Sect grounds already work, but lived in a separate popup from the world/local map. Put them in the **same map window** so players see one place for “where am I / where is my sect.”

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
| Sect | Always; if no sect yet, tab opens founding flow (🏯 Sect) |

🏯 Sect button → Sect tab when founded; founding popup when not.

### Shared patterns (from sect-map)

- `%` positioned nodes, tier/locked styling
- Breadcrumb back to map root
- Header stats (sect stage, influence, stores)
- Founded-near line on grounds header

### World ↔ sect links

| Feature | Notes |
|---------|-------|
| **Your influence** | Dashed blue ring on the World map region you hold (Regional+) |
| **Other sects** | Small red pins on regions where jianghu `worldSects` sit (basic “who’s here”) |
| **Founded-in-zone** | Sect header: *Founded near Bone Crossroads · Dustbone* |
| **Depart grounds** (later) | Courtyard / messenger → open Local map at region default |

### Territory grow / shrink (later — not this PR)

Player asked for influence that **expands and retracts** from renown, wars, alliances, neglect, etc. Park as follow-up:

- Multiple regions or a radius, not only one `influenceZone`
- Rival territory polygons / claim strength
- Soft decay when idle; growth from victories / buildings

See phase-2 notes below.

### Out of scope (v1)

- Zone-themed sect grounds skins
- Road paths between sect nodes
- Full territory simulation (grow/shrink)

### Build order

1. ~~Local + World tabbed popup~~ ✅ [#56](https://github.com/WanderingImmortal/tales-immortal-path/pull/56)
2. Move sect grounds into third tab (same `#mapPopup`) — this branch
3. Influence ring + rival pins on world SVG — this branch
4. Depart grounds → local (optional)
5. Territory grow/shrink (phase 2)

## Prerequisites

- [x] [`local-world-map-split.md`](local-world-map-split.md) tab shell
- [x] Reuse `renderSectGroundsHtml` / `bindSectGroundsEvents` (rehome via `renderSectPopup` target)

## Open questions

- [x] One `#mapPopup` for all three vs sect keeps separate overlay? → **one map popup**; founding stays on `#sectPopup`
- [ ] Mobile: three tabs crowded — revisit if playtest complains

## Implementation crumbs

- `sect-map.js`, `sect.js` — `actionSect`, `renderSectPopup`, `foundSect` founded place fields
- `index.html` — `#mapPopup` Sect tab, `#mapSectInfo`
- `locations.js`, `world.js` — map popup + world pins
- `ui.js` — `renderSectPopup` mounts into map when Sect tab open
