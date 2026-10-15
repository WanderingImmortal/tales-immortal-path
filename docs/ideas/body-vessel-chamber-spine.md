# Body chamber ↔ vessel realm spine (mortal dig 0–3)

| Field | Value |
|-------|-------|
| **Status** | `designed` — **code spine shipped** [PR #154](https://github.com/WanderingImmortal/tales-immortal-path/pull/154); **layer↔realm mapping lean** — owner review |
| **Blocked on** | Owner pass on gate table below; optional tab soft-lock policy |
| **Issue** | none yet |
| **Chat / PR** | Playtest confusion 2026-10-15; spine UX follow-up |
| **Updated** | 2026-10-15 |

## Intent

The **seven chamber tabs** (skin → nerves) are one **mortal dig** for vessel realms **0–3**. The **vessel realm name** (Inner Tempering, Vessel Establishment, …) advances only via **Consolidate → Break Through → trib**, not when a tab hits 100%.

Players may **unlock tabs ahead** (50% chain) and grind optional subs; that must not be mistaken for “already at Nascent Physique.”

## Two different progress concepts (do not merge)

| Concept | What moves it | What it affects |
|---------|----------------|-----------------|
| **Tab layer %** | Any refinement action on that tab (main actions; +progress per click) | Bonuses, next tab unlock at 50%, silhouette |
| **Vessel breakthrough gate** | Only layers listed in `BODY_VESSEL_REALM_SPINE` for **current** `vessel.realmIdx` | Consolidate meter, seal, break |

**Optional subs** (Marrow @50% Bones, Bloodline @50% Blood, Microcosmic Orbit @50% Meridians) add **bonuses / flavor** — **not required** for layer 100% or realm gates. Hitting 100% on a tab only needs enough stacks on **main** actions (each action capped at 3× by default).

## Code gate table today (implementer — tune with owner)

| Vessel idx | Realm name | Layers that must hit **100%** for peak gate | Nerve Sea | Break → |
|------------|------------|---------------------------------------------|-----------|---------|
| 0 | Inner Tempering | **Skin** only | — | Vessel Establishment |
| 1 | Vessel Establishment | **Flesh + Bones** | — | Essence Pearl |
| 2 | Essence Pearl | **Organs + Blood** | — | Nascent Physique |
| 3 | Nascent Physique | **Meridians** | **Once** (Nerves tab capstone) | Physique Transformation (idx 4 stub) |

Source: `BODY_VESSEL_REALM_SPINE` in [`data.js`](../../data.js).

## Design alignment (from [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md))

- **One screen** for idx 0–3; idx 4+ leaves the layer UI (not built).
- **Layer ≠ realm** — seven layers span four milestone names; names change on **breakthrough**, not per tab.
- **Inner Tempering saturation** (soaks, early/mid/late) is **future feel** — not simulated in chamber clicks yet.

## Player flow (correct)

1. Body chamber (sets focus **vessel**).
2. Raise **gate layers** for current idx to 100% (see table).
3. **Consolidate** on map — “Temper the Vessel” (≥80% settled, 100% peak optional).
4. **Break Through** — trib — **realm name** and track strip update.
5. Repeat for next idx.

## Open questions (owner)

- [ ] **Soft-lock tabs** beyond current gate vs allow “dig ahead” with clear UI only (current: ahead allowed).
- [ ] Remap gates to **design bands** (e.g. idx 0 = skin+flesh only, idx 1 = bones+organs) — needs playtest after saturation doc lands.
- [ ] **Auto hint** when gate peak reached — shipped in UX PR; tune copy.
- [ ] **Vessel Rules** swear still at idx 2 in data — move to 5–6 per nine-realm body doc.

## Implementation crumbs

- [`body-chamber.js`](../../body-chamber.js) — `getBodyVesselRealmProgressPct`, `canVesselTrackBreakthrough`, spine hint UI
- [`consolidation.js`](../../consolidation.js) — body path meter uses spine pct
- [`cultivation.js`](../../cultivation.js) — vessel break + trib
