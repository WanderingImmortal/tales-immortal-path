# Body path — Martial Intent (武意)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner brainstorm — 2026-08-02) |
| **Blocked on** | Body chamber depth; intent.js path split |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 |

Parent: [`body-path-sect.md`](body-path-sect.md), [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md). Qi analogue: Weapon Intent (`intent.js`, dantian). Body oath lane: [`vessel-rules.js`](../../vessel-rules.js) (Vessel Rules).

## Intent

**Weapon Intent** is the qi-path expression of will through a **weapon category** (cultivated in the **dantian**). Body refining needs a **parallel** — not a copy of sword intent, not “qi fist palm.”

**Parked name:** **Martial Intent** (武意) — will made **impact**; the **limb is the weapon**.

## What exists in code today (gap)

| System | Path | Home | Weapons |
|--------|------|------|---------|
| **Weapon Intent** | Qi (`intent.js`) | Dantian | Sword, Blade, Spear, **Fist**, **Staff** |
| **Vessel Rules** | Body (`vessel-rules.js`) | Vessel | Oaths (Blood, Unnamed) — **not** weapon progression |
| **Technique `intentReq`** | Mixed | Checks `getActiveIntent()` | Body arts e.g. `War God's Roar` require **Fist** intent — **broken** for pure body focus today |

`INTENT_TRACK_BY_PATH` only registers **qi**. Body/soul tracks were **removed** from intent.js; body martial progression was **not** replaced yet.

**Da Chi fiction:** supreme **body** talent = Martial Intent (Fist) at ceiling — “the fist is not technique.”

## Design rule — three combat identities

| Path | Will expression | Cultivation home | Refuse |
|------|-----------------|------------------|--------|
| **Qi** | **Weapon Intent** (剑意 etc.) | Dantian | — |
| **Body** | **Martial Intent** (武意) | Vessel / trial ground | Sword, Blade, Spear intent |
| **Soul** | Soul Mass + soul arts | Spirit | *(TBD)* |

**Vessel Rules** stay **oaths** (leash, combat modifiers) — **not** the same as Martial Intent. You can swear Rule of Blood **and** cultivate Fist Martial Intent.

## Martial Intent weapons — **Fist + Staff** (owner lean)

Monks and body refiners fight with **fists, palms, staves, bells, girded bodies** — not sword lines.

| Martial Intent | Hanzi sketch | Who uses | Technique examples |
|----------------|--------------|----------|-------------------|
| **Fist** | 拳 | Mad Monks, palm-body hybrids, qi **palm** schools | `Crushing Fist`, `War God's Roar`, `Mountain Crash`, `Five Elements Fist` (qi) |
| **Staff** | 棍 | Ridge bell-staff, monk escorts, some qi staff arts | `Staff Shatter`, `Celestial Judgment` (qi staff) |

**Not body Martial Intent (qi lane):** Sword, Blade, Spear — stay **Weapon Intent only** on dantian track.

## **Shareable** Fist / Staff — two tracks, one gate label (owner lean)

**Yes — Fist and Staff should be shareable weapon *labels* across paths**, not duplicate technique names.

| Layer | Qi path | Body path |
|-------|---------|-----------|
| **Track id** | `weaponIntent` (dantian) | `martialIntent` (vessel) — *implementation name TBD* |
| **Cultivation** | Awaken / deepen / expand in **Intent** UI on dantian focus | Same **UI pattern** on **vessel** focus — trial ground, combat uses, Bell Trial |
| **Technique gate** | `intentReq: { weapon: "Fist", minStage: N }` | **Same string** — resolver checks **active path’s** intent record |
| **Cross-path** | Weapon Intent **sleeps** on body focus (mirror today’s dormancy) | Martial Intent **sleeps** on dantian focus |
| **Flavor** | Qi **ornaments** the strike | Flesh **is** the strike |

**Why shareable:** one `TECHNIQUE_POOL` row for `Mountain Crash` — qi brawler with Fist Weapon Intent gets qi-flavored bonus; body cultivator with Fist Martial Intent gets impact bonus. **Different progression, same gate.**

**Not shared:** expand arts / domain names may differ per track (qi Fist = Concussive Rhythm; body Fist = **Iron Press** / **Bone Echo** — TBD).

### Qi vs body — same fist, different engine

| | Qi **Fist** Weapon Intent | Body **Fist** Martial Intent |
|--|---------------------------|------------------------------|
| **Feel** | Palm qi, elemental cycle, breath | Knuckle memory, marrow shock, stamina |
| **Schools** | Five Elements, Phoenix palm, Glacier Heart | Vajra Ridge, desert grit, blood conditioners |
| **Sword sect** | Heavenly Palm outer court — **not** Martial Intent | N/A |

## Vajra Ridge — teaching lane

| Teach | Refuse |
|-------|--------|
| **Fist Martial Intent** — core; Da Chi doctrine | Sword / Blade / Spear intent |
| **Staff Martial Intent** — bell staff, escort pole | Sword intent |
| Outer: stances, breath-for-stamina | Flame rebirth, void gates |
| Inner: marrow + **Martial Intent** deepen | Qi-primary palm as **root** |

**Trial ground:** Bell Trial awakens / stresses Martial Intent — same place Da Chi legend starts.

## Tier structure (mirror Weapon Intent — draft)

Reuse **tier names** or body-flavored variants:

| Tier | Uses (draft) | Body-flavored name option |
|------|--------------|---------------------------|
| Sprout | 0 | **Bruise** |
| Minor Success | 10 | **Ring** (bones ring) |
| Major Success | 30 | **Echo** |
| Perfection | 60 | **Temper** |
| Domain | 100 | **Press Domain** (压境) |

*Or keep shared tier names for UI simplicity — open.*

## Open questions

- [ ] Track label UI: **Martial Intent** vs **Body Intent** vs **Strike Intent**
- [ ] Hanzi lock: **武意** vs **拳意** (fist-only feel)
- [ ] Staff expand arts — body-specific set vs share qi `INTENT_EXPAND_ARTS.Staff` pool
- [ ] Can one cultivator awaken **both** Fist tracks (divided heart rules)?
- [ ] `intent.js` refactor vs `martial-intent.js` sibling module
- [ ] Da Chi: **Fist** only or **Fist + Staff** at legend tier?

## Implementation crumbs (later)

- `INTENT_TRACK_BY_PATH.body` → martial intent metadata
- `getTechniqueIntentMatch` — branch on `G.path` / focus track
- Body chamber project hooks for deepen / expand
- Vajra Ridge manual grants Fist Martial Intent syllabus
