# Living world geography — audit & PR #197 notes

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Issue** | none yet |
| **Chat / PR** | `cursor/living-world-geography-a1c3` |
| **Updated** | 2026-11-04 |

## Phase 1 — Architecture audit (summary)

| Layer | Implementation | Reuse in this PR |
|-------|----------------|------------------|
| **World map tab** | `world.js` + `locations.js` — was single “Azure Sky” blob with 5 zones | Split into **World** (continents) + **Region** (continent map) tabs |
| **Regions** | `ZONES` in `world.js` — gameplay/travel/explore keys (`dustbone`, …) | Unchanged ids; mapped via `WORLD_GEOGRAPHY.regionContinent` |
| **Local map** | `WORLD_LOCATIONS` + `ZONE_LOCAL_LAYOUT` in `data.js`, `mountLocalMap` | Expanded **Dustbone Desert** nodes + paths |
| **Sect map** | `sect-map.js` / map popup tab | Unchanged |
| **Travel** | `travelToZone` / `travelToLocation` in `world.js` / `locations.js` | Unchanged mechanics |
| **Lesser sects** | PR #196 — `G.world.lesserSects`, generator bundle | **Dustbone** auto-population on first load via `world-population.js` |
| **Save** | Full `G` JSON | `G.world.geography`, `locationMeta`, `generatedLocations` stubs |
| **Reincarnation** | Still clears run | Cross-life world **not** shipped |

### Lore classification (provisional)

| Name in repo | Role in hierarchy |
|--------------|-------------------|
| **Mortal Realm** | World (`WORLD_GEOGRAPHY.worldName`) |
| **Azure Sky Continent** | Continent — frostbite, heartlands, jade, emberwild |
| **Dustbone Continent** | Continent — holds the **Dustbone Desert** region (zone id `dustbone`) |
| **Dustbone Desert** | Region (`ZONES.dustbone`) — starter play space |
| **Threshold City** | Authored location (`bone_crossroads`) — not renamed |

Authored faction HQs and great powers are untouched.

## What shipped in this PR

1. `WORLD_GEOGRAPHY` + map tabs **World → Region → Local → Sect**
2. Ten new Dustbone **WORLD_LOCATIONS** with `resources` / `resourceProfile` / `regionId` (future claims)
3. `world-population.js` — one-time lesser sect seeding for Dustbone (density ∝ HQ slots)
4. Local map detail — lesser sect panel + resource line; nodes with sect HQ flagged
5. Tests: `scripts/test-living-world-geography.js`

## Known limitations

- No procedural **location** generator yet — expansion is authored + sect HQs from PR #196 pool
- No sect diplomacy, wars, or claim gameplay — fields are documentary only
- Other continents not population-expanded (only Dustbone desert region)
- `showZoneGuide` / travel buttons still keyed to zone ids, not new continent ids
- Full NPC “join sect” interaction deferred

## Manual playtest (~10–15 min)

1. New or existing save → open **Map** on phone.
2. **World** tab → tap **Dustbone Continent** → **Region** tab opens with Dustbone Desert blob.
3. **Local** tab → scroll/zoom nodes — count ≥18 places; walk to **Brine-Well Hamlet** (Qi + months).
4. Select a node with 🏯 — confirm **Lesser sect** panel (after first load population).
5. **Save** → reload → same sect names/HQs; no duplicate sect spam in log.
6. **World** breadcrumb on Local header shows Mortal Realm › continent › region.
7. Travel to **Heavenly Heartlands** (existing zone travel) — Region tab shows Azure Sky regions only.

## Automated checks

```bash
node scripts/test-living-world-geography.js
node scripts/test-procedural-lesser-sects.js
bash scripts/pre-pr-check.sh
```

## Changelog (player-facing)

- Map layers: World continents, regional map, local places, sect grounds.
- Dustbone Desert local map: hamlets, marshes, mines, ruins, roads — farther from Redwell.
- Procedural lesser sects appear at real locations in Dustbone (inspect on local map).
