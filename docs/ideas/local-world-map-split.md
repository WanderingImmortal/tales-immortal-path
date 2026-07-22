# Local map & world map split

| Field | Value |
|-------|-------|
| **Status** | `building` (steps 1–2) |
| **Blocked on** | None for UI; pairs with [`realm-claims.md`](realm-claims.md) for travel scaling |
| **Issue** | none yet |
| **Chat / PR** | `cursor/local-world-map-split` |
| **Updated** | 2026-07-22 |

## Intent

Split **continent travel** from **in-region place travel** into two clear map layers. Today cities and sect halls exist as scrollable cards under the continent SVG — easy to miss; Walk buttons only work in your current region. Players should **see** places as clickable nodes on a local map, not hunt text below the world blob.

**World map** = where on the Azure Sky Continent am I?  
**Local map** = where in this region am I? (cities, markets, sect HQs, wilderness hubs)

See also: [`world-scale-and-travel.md`](world-scale-and-travel.md), [`sect-map-unification.md`](sect-map-unification.md).

## Design notes

### Three maps, one family

| Map | Scope | Opens when |
|-----|--------|------------|
| **World** | 5 zones | 🗺️ Map — always |
| **Local** | Places in current region | Auto after zone travel, or “Open local map” from World |
| **Sect** | Player grounds (buildings) | 🏯 Sect after founding |

Same visual language as `sect-map.js`: illustrated bg, clickable nodes at `% x/y`, detail panel below, “you are here” pulse.

### World map (simplified)

- Keep 5 clickable zone blobs, realm locks, zone travel button.
- **Remove** scrollable place cards from world popup (move to Local tab).
- Per zone:
  - **You are here** → **Open local map** (switches tab)
  - **Elsewhere** → **Preview region** (read-only local map, no Walk)

Intro copy: *Click a region to travel. Walk between places on the local map.*

### Local map UI

**Header:**
```text
📍 Dustbone Desert — Local Map          [← World]
Current: 🏜️ Bone Crossroads
```

**Interaction:**
1. Click node → detail panel (description, tags, faction, market indicator)
2. Not here → **Walk here · 2mo · Qi** (realm claims may reduce — see realm-claims)
3. Here → **You are here** + shortcuts (Market, Factions, Look around hint)

**Preview mode** (browsing another region from World):
- Nodes visible, lore readable
- No Walk buttons
- Banner: *Travel to Dustbone first to walk here.*

**On zone arrival:** auto-switch to Local tab (recommended) or log + button.

### Data shape (implementation)

```javascript
// Per zone — presentation only; WORLD_LOCATIONS stays source of truth
const ZONE_LOCAL_LAYOUT = {
  dustbone: {
    theme: 'desert',
    nodes: {
      bone_crossroads:  { x: 50, y: 55, layer: 2 },
      miraj_waystation: { x: 22, y: 48, layer: 1 },
      sunscar_camp:     { x: 78, y: 35, layer: 1 },
      ashen_shrine:     { x: 62, y: 78, layer: 1 }
    },
    paths: [ /* optional cosmetic roads */ ]
  }
  // frostbite, heartlands, jade, emberwild — see layouts below
};
```

### Node styling by `WORLD_LOCATIONS.type`

| Type | Visual |
|------|--------|
| `city` | Larger node |
| `market` | 🏪 badge |
| `sect_hq` | Faction emoji when known |
| `outpost` | Small roadside |
| `wilderness` | Faded wide node |

`minRealm` locks → grey node + tooltip (like sect `tier-locked`).

### Draft layouts per zone

**Dustbone** — crossroads hub:
```text
        [Sunscar] ☀️
            \
[Miraj] 🐪 — [Bone Crossroads] 🏜️
            /
        [Ashen Shrine] 🔥
```

**Frostbite** — vertical:
```text
    [Frostpeak Monastery] 🏔️
            |
    [Frost Gate] 🏘️
```

**Heartlands** — lotus around fields:
```text
     [Sword] ⚔️     [Lotus] 🪷
          \            /
       [Outer Heartlands] 🌾
          /    |     \
    [Void] 🌌 [Market] 🏪 [Phoenix] 🔥
```

**Jade** — coast:
```text
    [Tidal Shrine] 🪷
            |
    [Tide Harbor] ⚓ — [Storm Dock] 🐉
```

**Emberwild** — village vs jungle:
```text
    [Ashvein Village] 🛖 — [Beast Circle] 🌿
```

### Hidden sub-zones on local map

| `entrances[id]` status | Local map |
|------------------------|-----------|
| `hidden` | Not shown |
| `revealed` | Edge node 🗝️ “Entrance found” |
| `unsealed` | Solid node ✨; enter via ancients flow |

Wire to `ancients.js` entrance status.

### Build order (suggested)

1. ~~Tabbed map popup — World tab = today minus place cards; Local = nodes for **current zone only**~~ ✅
2. ~~Dustbone + Emberwild (prove pattern)~~ ✅
3. Heartlands, Jade, Frostbite
4. Hidden sub-zone pins
5. Sect tab unification (separate doc)

**Shipped in steps 1–2:** `#mapPopup` World | Local tabs; place cards removed from World; `ZONE_LOCAL_LAYOUT` for Dustbone + Emberwild; clickable nodes + detail Walk; Preview region (no Walk); auto-switch to Local after zone travel. Other zones fall back to place cards on Local until step 3.

## Prerequisites

- [x] Tab UI in `#mapPopup` (`index.html`, `world.js`, `locations.js`)
- [x] `ZONE_LOCAL_LAYOUT` in `data.js` (Dustbone + Emberwild)
- [ ] Remaining zone layouts (Heartlands, Jade, Frostbite)
- [ ] Realm travel scaling optional — [`realm-claims.md`](realm-claims.md)

## Open questions

- [ ] Single 🗺️ button vs separate 📍 Local action?
- [ ] Road lines cosmetic only, or future adjacent = cheaper walk?
- [ ] Heartlands 6 nodes — scroll/zoom on mobile?

## Implementation crumbs

- `locations.js` — `renderZoneLocationsHtml`, `travelToLocation`, `renderContinentMapSvg`
- `world.js` — `actionMap`, `renderMapPopup`, `showZoneGuide`, `travelToZone`
- `sect-map.js` — node click pattern to reuse
- `data.js` — `WORLD_LOCATIONS`, `ZONE_MAP_LAYOUT`
- `ancients.js` — `renderMapSubZoneBadges`, entrance status
- `index.html` — `#mapPopup`, `#continentMap`, `#zoneInfo`
