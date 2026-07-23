# Imperial clan — continental heart (design workshop)

| Field | Value |
|-------|-------|
| **Status** | `idea` — **design first** (before Heartlands sect identities) |
| **Blocked on** | Owner pass on throne fiction, capital, relationship to four sects |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent workshop, 2026-07-23 |
| **Updated** | 2026-07-23 |

## Intent

The **Imperial Clan** is the gravity well of the Azure Sky Continent — the Heartlands four sects, markets, and player ambition all orbit it. Design this **before** sect lineage manuals or detailed sect identities, so every great sect answers: *what is our relationship to the throne?*

**Not the same as:** post-mortal **Heavenly Court** ([`post-immortal-cosmology.md`](post-immortal-cosmology.md)) — that's cosmic bookkeeping, not a villain emperor on a throne.

Related: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md), [`sect-faction-identities.md`](sect-faction-identities.md).

---

## What exists in code today

| Piece | Status |
|-------|--------|
| `FACTION_DEFINITIONS` imperial entry | **Missing** — no imperial faction |
| Heartlands capital / palace on local map | **Missing** — only `outer_heartlands`, four sect HQs, Celestial Market |
| Imperial NPCs, rep, quests | **Missing** |
| Design mentions | Sect pyramid doc: imperial has wider apex, stricter heaven accounting; guild doc: alchemy HQ leans imperial city |

The four sects exist as **peers in a cold war** with no throne in the middle — that's the gap.

---

## Why design imperial first

1. **Sets the food chain** — GC in Heartlands is "talented junior" because *someone* sits above the sects.
2. **Explains the cold war** — Sword/Lotus/Void vs Phoenix only makes sense relative to imperial mandate, succession, or fear of absorption.
3. **Anchors sect identity** — each great sect is partly defined by how it bows, bargains, or rebels.
4. **Unlocks map** — imperial capital as a Heartlands node (inner vs outer heartlands).
5. **Lineage manuals later** — throne may license, forbid, or monopolize certain cultivation lines.

---

## Core questions (owner workshop)

### 1. What is the Imperial Clan *now*?

- **Dynasty name?** (working title: Azure Mandate / Vermillion Throne / etc.)
- **Mandate fiction** — heaven-appointed? Won by war? Inherited from a buried age?
- **Public face** — who does the player meet first? (Chancellor, young emperor, regent, empress dowager?)
- **Hidden face** — immortal ancestor in seclusion? Half-Step at the gate? Puppet court?

### 2. Power vs the four sects

| Model | Fiction | Game feel |
|-------|---------|-----------|
| **Balancer** | Throne plays sects against each other | Player navigates rep + imperial favor |
| **Declining** | Clan fading; sects encroach | Phoenix plot makes sense |
| **Iron fist** | Imperial law is real; sects are licensed | Permits, tribunals, banned manuals |
| **Sacred shell** | Clan is ritual head; sects hold real power | Imperial rep is prestige, not strength |

Pick a lean or blend — drives everything else.

### 3. Cultivation identity

- **Imperial lineage manual?** (e.g. *Mandate of Heaven Breathing* — dragon/earth/metal lean?)
- **Policy:** does the throne **teach** cultivators, or only **license** sect arts?
- **Layers:** imperial line is probably **unique + layered** (policy from manuals framework) — but what element/nature?
- **Heaven's accounting tie-in** — imperial cultivators accrue scrutiny faster? ([`tribulation-system-rework.md`](tribulation-system-rework.md))

### 4. Geography

- **Capital name + node** on Heartlands local map (inner heartlands — not yet built)
- **Celestial Market** — imperial-owned neutral ground, or sect concession?
- **Forbidden sites** — `celestial_observatory`, `heartlands_root` clue — imperial-linked?

### 5. Player relationship

- Can player earn **imperial favor** (separate from sect rep)?
- Imperial **examination** / root test at capital?
- Founding a sect — register with the throne?
- Reincarnation — imperial bloodline origin?

---

## Working sketch (placeholder — replace in workshop)

> The **Vermillion Throne** (name TBD) claims the **Mandate of Azure Sky** — not because the Emperor is the strongest cultivator, but because the clan holds the **continental seal array** that stabilizes spiritual veins under the Heartlands. The four great sects are **chartered powers**: licensed to teach, forbidden to conquer each other openly without imperial verdict.
>
> **Golden Phoenix** tests that charter — expansion is framed as "reunification." **Jade Lotus** owns the ledgers the court trusts. **Celestial Sword** is the court's blade when law must look honorable. **Void Temple** guards what the throne cannot burn.
>
> The player meets the court through **outer heartlands** first; the **inner palace** is a later realm-gated reveal.

*Delete or rewrite — this is scaffolding for discussion.*

---

## Suggested design order

1. **This doc** — mandate, power model, cultivation lean, capital name
2. Update [`sect-faction-identities.md`](sect-faction-identities.md) — four sects **in relation to** imperial sketch
3. Map node + faction stub in `data.js` (implementation later)
4. Sect lineage manuals

---

## Open questions

- [ ] One immortal on the throne vs ancestor vault vs neither?
- [ ] Imperial faction in rep system — fifth Heartlands rep track, or overlay on all?
- [ ] Does imperial city host **alchemy guild** HQ ([`creation-path-guilds.md`](creation-path-guilds.md))?
- [ ] Tribal Dustbone — does imperial reach extend to Sandveil Tribunal?

## Prerequisites

- [ ] Owner workshop on sections above

## Implementation crumbs (later)

- `data.js` — `FACTION_DEFINITIONS.imperial_*`, `WORLD_LOCATIONS` capital node
- `factions.js` / `factions-expand.js` — imperial rep, edicts
- `docs/ideas/sect-faction-identities.md` — sect rows reference imperial relationship
