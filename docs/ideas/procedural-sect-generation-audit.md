# Procedural lesser sect generation — system audit

| Field | Value |
|-------|-------|
| **Status** | `building` (Phase 1 vertical slice) |
| **Blocked on** | Full zone ecology sim ([`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md)) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent — `cursor/procedural-sect-gen-a1c3` |
| **Updated** | 2026-11-04 |

## Intent

Document how factions, sects, NPCs, and world state work today; ship a **minimal, seeded lesser-sect generator** on `G.world.lesserSects` with a **mobile lab** and automated tests — not full rise/fall politics.

---

## Phase 1 — Findings

### Sects: persistent entities vs static definitions

| Layer | Location | Behavior | Classification |
|-------|----------|----------|----------------|
| **Great / regional powers** | `FACTION_DEFINITIONS` in `data.js` | Static defs; player rep on `G.factions` via `factions.js` | **Authored — do not procedural overwrite** |
| **Player org rivals** | `G.sect.worldSects` in `sect.js` | `generateWorldSect` / `spawnProceduralWorldSects` when player hits **Established** | **Existing — player-centric rivals, not zone population** |
| **World NPCs** | `G.worldNpcs` in `world.js` | `generateWorldNpc`; roles include `disciple`, `sect_elder` | **Existing — not linked to sect records today** |
| **HQ on local map** | `WORLD_LOCATIONS` (`type: 'sect_hq'`) | Hand-placed; tied to `factionNpcId` for great powers | **Existing — authored anchors** |
| **Zone ecology (designed)** | [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) | Proposed `G.world.zoneSects` | **Not implemented in JS** |
| **This PR** | `G.world.lesserSects` in `procedural-lesser-sects.js` | Seeded generator; embedded members + optional `G.worldNpcs` registration | **New — vertical slice** |

**Answer:** Great powers are **static faction definitions** with runtime rep. Procedural content today is **only** player-rival `worldSects`. There is **no** global lesser-sect registry until this PR.

### Procedural sect generation (before this PR)

| Capability | Status |
|------------|--------|
| Named rival sects when player is Established | **Implemented** (`sect.js`) |
| Seeded, reproducible zone population | **Absent** |
| Lesser sects with founder NPC uids + HQ location id | **Absent** |
| Zone realm caps for implausible leaders | **Partial** (rivals use player `realmIdx`; not zone-based) |

### NPC ↔ sect membership

| Capability | Status |
|------------|--------|
| NPCs with sect-flavored roles | **Existing** (`disciple`, `sect_elder` in `NPC_ROLES`) |
| NPC record points at a sect id | **Not in production** — this PR adds `lesserSectId` when registering lab/game NPCs |
| NPC founds/leaves sect during live sim | **Out of scope** |

### NPC identity generation (existing)

- **Names:** `rollWorldNpcName` / `SECT_RECRUIT_NAMES`
- **Realms:** role tables + `getWorldNpcMaxRealm`; demonic talent path separate
- **Age / growth:** `ageMonths`, `tickWorldNpcGrowth` in `world.js`
- **Zone:** set at spawn; wanderers can move zones
- **Relationships:** `npc-converse.js`, betrayal, presence — **not sect-aware**

### Map / territory

- Zones: `ZONES`; local nodes: `WORLD_LOCATIONS` with `parentZone`
- **No** faction territory polygons; influence is narrative + location tags + zone faction mechanics (`ZONE_FACTION_MECHANICS`)

### Resources, diplomacy, world time

| System | File | Notes |
|--------|------|-------|
| Faction rep & actions | `factions.js`, `FACTION_ACTIONS` | Authored factions only |
| Player sect diplomacy | `sect.js` | `worldSects` relationships |
| World clock / schedule | `world-scheduler.js`, `G.worldSchedule`, `G.worldChronicle` | No sect ecology tick |
| NPC ecology | `world.js`, `npc-converse.js` | Growth/wander; not sect-driven |

### Save / load / reincarnation

- Full `G` serialized to `localStorage` (`core.js` / `saveState`)
- Load path runs many `migrate*` hooks; `G.worldNpcs` initialized in `core.js` / `main.js`
- **Reincarnation:** `clearRunStateForReincarnation()` still wipes the run — **cross-life persistent `G.world` is future infra** ([`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md))
- **This PR:** `migrateLesserSectsForExistingSave()` ensures `G.world.lesserSects` exists on load; lab uses separate `localStorage` key

### Debug / test UI (before this PR)

| UI | Purpose |
|----|---------|
| Playtest panel | Cheats, skips — **no sect spawn list** |
| `/sandbox/combat/` | Combat prototype — **no sect data** |

**This PR adds:** `/sandbox/lesser-sects/` — mobile list/detail, seed, time advance, save/load lab state.

---

## Authored factions — preservation

**In code today (`FACTION_DEFINITIONS`):** Frostpeak Monastery, Sunscar Clan, Dune Riders, Ashen Priests, Celestial Sword, Jade Lotus, Void Temple, Golden Phoenix, Storm Dragon, Tidal Lotus, Emberwild Collective.

**Named in design / owner canon (blocked from procedural names, not all in `FACTION_DEFINITIONS` yet):** Imperial Clan, Yin Maiden Palace/Sect, Mad Monks / Vajra Ridge, Heavenly Demon Cult, Soul Cult / Feng Du, Dustbone Tribunal (code uses **Sandveil Tribunal** for Dustbone zone copy).

Generator rules:

- Blocklist = all `FACTION_DEFINITIONS.name` + explicit lore names above
- HQ pool = locations in zone **excluding** authored `sect_hq` with `factionNpcId`
- Leader `realmIdx` capped per zone (`LESSER_SECT_ZONE_LEADER_REALM_CAP`) — **no Immortal-tier leaders**, no great-sect `stage`

**Dustbone note:** Sandveil / tribal great powers are authored; procedural lesser sects do not replace them. No universal “every great power has an Immortal spine” rule is enforced by this generator.

---

## Phase 2–5 — What this PR implements

| Deliverable | Path |
|-------------|------|
| Seeded generator | `prototype/procedural-lesser-sects/generator.js` |
| Game bridge | `procedural-lesser-sects.js` → `G.world.lesserSects` |
| Mobile lab | `sandbox/lesser-sects/` |
| Tests | `scripts/test-procedural-lesser-sects.js` |
| Bundle | `node scripts/bundle-lesser-sects-lab.js` |

Each lesser sect includes: `id`, `name`, `zone`, `headquartersLocationId`, `focus` / `focusLabel`, `doctrine`, `culture[]`, `size`, `foundedAtMonths`, `founderNpcUid`, `leaderNpcUid`, `memberNpcUids`, embedded `members[]`.

**Deferred:** autonomous founding, wars, recruitment loops, merge/collapse, `zoneSects` ecology tick, main-game UI beyond lab, automatic spawn on new game.

**Integration boundary:** Generator is pure + seeded; `worldSects` and `FACTION_DEFINITIONS` are untouched. Optional `registerLesserSectNpcsOnWorld` copies members into `G.worldNpcs` when explicitly invoked from game code.

---

## Manual playtest procedure

1. Open **`/sandbox/lesser-sects/`** on phone or desktop (or static deploy equivalent).
2. Note default seed **12345** → tap **Generate (replace)** → scroll sect list (2 per zone by default).
3. Tap a sect → verify HQ name, focus, culture lines, member list with realm indices.
4. Change seed → **Generate** again → names and roster should change.
5. Reset seed to **12345** → **Generate** → output should match step 2 (reproducible).
6. Tap **Advance time** (12 months) → member ages increase; sect ids and rosters unchanged.
7. **Save lab state** → reload page → **Load lab state** → same sect count and ids.
8. (Optional) From devtools on main game after scripts are wired: call `applyLesserSectGeneration({ seed: 99, persist: true })` — verify save reload keeps `G.world.lesserSects`.

---

## Automated tests

```bash
node scripts/test-procedural-lesser-sects.js
```

Covers: determinism, seed variation, unique ids/names, validation, realm caps, authored name blocklist, member refs, JSON round-trip, merge idempotence, time-only stability.

---

## Open questions (future PRs)

- Hook `advanceWorldEcology(months)` on reincarnation skip when persistent `G.world` ships
- Bridge procedural sect standing to `G.factions` rep stubs
- Replace player-scaled `generateWorldSect` naming with shared seeded pool
- Chronicle entries when lesser sects rise/fall

## Implementation crumbs

- `sect.js` — `generateWorldSect` (reuse naming ideas, not storage)
- `world.js` — `generateWorldNpc`, growth tick
- `civic-seats.js` — pattern for generated world entities on `G`
- [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) — north-star design
