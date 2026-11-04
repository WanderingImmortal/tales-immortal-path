# Sect foundations, power & growth — audit (PR #198)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Issue** | none yet |
| **Chat / PR** | `cursor/sect-foundations-a1c3` |
| **Updated** | 2026-11-04 |

## Phase 1 — Existing systems (conflicts & reuse)

| Source | What it defines | Use in PR #198 |
|--------|-----------------|----------------|
| [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) | School (FE) vs sect (GC+); elders vs patriarch | **Org kind** `school` vs `lesser_sect`; maturity ≠ leader realm |
| [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) | Hall / branch / sect kinds, city tiers | Constraints reference hall-scale vs mountain sect |
| [`city-tiers.md`](city-tiers.md) | Tier 1–4 civic power floors | HQ `cityTier` → `facilityTier` |
| `SECT_STAGES` (`data.js`) | **Player** sect progression | **Not** copied to NPC orgs — avoids contradiction |
| `G.sect.worldSects` (`sect.js`) | Player rival stubs (power/renown) | Unchanged |
| `G.world.lesserSects` (PR #196) | Procedural org records + members | Extended with `organization` profile |
| `FACTION_DEFINITIONS` | Authored great powers | Untouched |
| Techniques / manuals | Player progression | Inheritances are **stubs** (`grantsBreakthrough: false`) |

**Gap before PR #198:** Lesser sects had members and focus but **one implicit “power”** (leader realm + member count in UI). No institution vs capability split, no growth constraints, no public vs hidden standing.

## Model implemented (`org-foundations.js`)

Each lesser sect gains `organization` (version 1):

| Pillar | Fields | Notes |
|--------|--------|-------|
| **Actual capability** | `capability.apexRealmIdx`, `combatBand`, `byRealm`, `elderDepth` | From **members now** |
| **Institutional foundation** | `foundation.institutionalMaturity`, `ageMonths`, `facilityTier`, `stabilityScore`, `rumorShield` | From age, roster depth, HQ — **not** leader realm alone |
| **Growth constraints** | `growthConstraints[]` with `blocksAscension` | Talent pool, school scale, regional vein cap, resources |
| **Political standing (public)** | `standing.publicRenown`, `perceivedThreatBand` vs `actualThreatBand`, `rumorNote` | Imperfect knowledge hook; no global omniscient rating |
| **Inheritances** | `inheritances.public` / `.internal` | Knowledge **assets**; internal may exceed current apex; no auto-breakthrough |

Helpers: `deriveOrganizationAfterMemberLoss`, `applyExceptionalGrowthRelief`, `getPublicOrganizationBrief`, `renderPublicOrganizationHtml`.

**Not simulated this PR:** autonomous tick growth, intelligence network, theft/espionage, sect wars.

## HQ map UI (Android)

- `mountLocalMap` calls `ensureWorldPopulation()` + `migrateOrganizationProfilesForExistingSave()` so sects exist before detail render.
- `selectLocalMapLocation` scrolls **`localMapDetail`** into view (mobile).
- Detail uses **public** org panel only — no internal inheritances or true combat bands exposed.

## Save migration

- `migrateOrganizationProfilesForExistingSave()` on load (after world population).
- Re-enrich when `organization.version` < current.

## Manual playtest (~10 min)

1. Load save → **Map → Local** (Dustbone).
2. Tap a node with 🏯 — detail panel scrolls up; see org name, **institutional maturity**, leader, public manuals, whispered limits.
3. Confirm **no** “vault fragment” or internal ceiling text.
4. Tap another HQ — different org profiles.
5. Save/reload — same org maturity and constraints.
6. Desktop: same flow with mouse.

## Automated tests

```bash
node scripts/test-org-foundations.js
node scripts/test-procedural-lesser-sects.js
bash scripts/pre-pr-check.sh
```

## Deferred

- Full intelligence/rumor propagation between factions
- Rank-gated manual teaching gameplay
- Autonomous consolidation/expansion/ascension ticks
- Player-visible org diplomacy beyond public renown line
