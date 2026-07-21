# Domain — realm claim & physical qi pressure

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner review) |
| **Blocked on** | [`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md); [`realm-claims.md`](realm-claims.md) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent brainstorm, 2026-07-21 |
| **Updated** | 2026-07-21 |

## Intent

**Domain** is the Golden Core (idx 2) **realm claim**: the cultivator's golden core resonance **physically** pressing on space — not a metaphor for reputation. Weak cultivators feel weight; techniques drag; formations carve counter-fields. Politics happens because everyone *felt* it.

## Design notes

### Three jobs (aligns `realm-claims.md`)

| Job | Effect |
|-----|--------|
| **Pressure** | Intimidate, dampen weak techniques, NPC deferral |
| **Jurisdiction** | Sect/forbidden access; "my ground" |
| **Friction** | Light Body — local travel discount (in-zone) |

### Not elemental

Domain is **untagged qi**, like the core. Root + intent + foundation may **color presentation** (sword cultivator's domain feels sharp) — not `fire_domain` stats.

### Growth with GC substages

| Substage | Domain |
|----------|--------|
| **Nascent Core** | Thin — exists but fragile; loses most clashes vs late GC |
| **Expanding Core** | Grows — radius/weight rise with core mass; **local politics** tip your way |
| **Purifying Core** | Denser — cleaner pressure, not necessarily wider |
| **Post-consolidate** | Profile locked for NS attempt |

**Domain weight** (stub formula): `f(GC stage, core grade, consolidate tier, foundation echo, cracked penalty)`.

### Local politics (Expanding Core)

Not grand strategy — **one zone/city/sphere**: deference, recruitment, veins, rival schools, guild terms, event branches ("press domain"). High weight unlocks **non-combat wins**; combat wins get cheaper (they fold before blades cross).

**Zone context:** GC domain is tyrant-grade in Dustbone/Jade; paper-thin at great sect gates; imperial heart suppresses without a fair "clash."

### Intent vs realm Domain

Two different "domain" concepts in codebase today:

| | **Realm Domain** (GC claim) | **Intent domain arts** (`pierce_domain`, etc.) |
|--|----------------------------|--------------------------------------------------|
| Layer | Space ruled by core pressure | Technique mastery perks |
| Relation | The room | How you fight in the room |

Intent **modifies** expression; does not stack a second full field. Intent harmonize bonuses: small — must not break equal-field late-wins rule.

### Domain clash

Two cultivators: domains **contest**, don't merge.

1. Weight contest (grade, stage, will, cracked penalty)
2. Winner — home-ground bonuses, opponent techniques penalized
3. Stalemate — both dampened
4. Loser — domain **shattered for this fight**

Fiction-first logs; not a separate minigame v1. Formations = pre-laid "fake domain."

### Broken / cracked

- **Cracked core** — domain leaks; weaker pressure
- **Broken core** — see broken-core doc; advancement capped
- Temporary shatter from clash ≠ broken core

### NS+ overwrite

Nascent Soul **Sovereignty** overwrites GC domain while present — scale step change, not linear +10%.

## Prerequisites

- [ ] `realm-claims.md` breakthrough fanfare + travel mults
- [ ] Core quality model from GC journey doc
- [ ] One NPC pressure reaction (smallest shippable slice)

## Open questions

- [ ] Surface domain weight to player or keep hidden?
- [ ] Active abilities: Release Domain, Suppress, Expel — v1 or v2?
- [ ] Domain clash UI in combat

## Implementation crumbs

- `realm-claims.md`, `world-scale-and-travel.md` — Light Body mults
- `intent.js` — do not conflate intent arts with realm Domain
- `ambient-npcs.js`, faction rep — deference hooks
- `formations-and-arrays.md` — arrays vs domain

## Links

- [`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md)
- [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)
- [`world-scale-and-travel.md`](world-scale-and-travel.md)
