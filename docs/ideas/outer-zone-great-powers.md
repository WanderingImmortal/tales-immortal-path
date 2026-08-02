# Outer-zone great powers (regional sects & near-peers)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner direction — 2026-08-02) |
| **Blocked on** | Owner pass per zone; Heartlands four identity docs stable |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 |

**Hub for:** “Heartlands is the densest concentration of power, not the only place with heavy hitters.” Each outer sphere gets **its own histories** — one or more **great sect–tier** institutions (or deliberate dual powers), not just faction stubs.

Related: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md), [`imperial-clan.md`](imperial-clan.md), [`sect-faction-identities.md`](sect-faction-identities.md), [`body-path-sect.md`](body-path-sect.md), [`frostbite-yin-sect.md`](frostbite-yin-sect.md).

## Design principle

| Layer | Heartlands | Outer zones |
|-------|------------|-------------|
| **Density** | Four qi great sects + imperial orbit — charter cold war, envoys, Gambit | **One flagship story per zone** (sometimes two co-peers), each with founder myth and bargain |
| **Tier** | Full great sect pyramid (NS elders, VR patriarch, vault assets) | **Same weight class possible** — different *lane* (isolation, sea charter, tribal truce, jungle containment) |
| **Player feel** | Politics never stops | “This whole region has a spine” — not a rep grind with no names |

**Not:** “outer zones are weak.” **Yes:** “outer zones are **less crowded** with mutually entangled apex politics.”

## Target map (owner building)

| Zone | Flagship(s) today | Direction |
|------|-------------------|-----------|
| **Frostbite** | Yin Maiden Palace + **Vajra Ridge** (body monks, south) — [`frostbite-yin-sect.md`](frostbite-yin-sect.md) · [`body-path-sect.md`](body-path-sect.md) | **Dual Dao Wars survivors** on one spine |
| **Dustbone** | Sandveil Tribunal (three tribes) | Great power **TBD** — tribes may stay local law; optional dynasty-remnant or bone-scripture sect later |
| **Jade** | Storm Dragon + Tidal Lotus | Already **two co-peers** — deepen to full great-sect docs (sea charter, drowned crown lore) |
| **Emberwild** | Emberwild Collective (loose coalition) | Promote Collective **or** add second peak great sect (volcanic) — owner pass |
| **Heartlands** | Sword · Lotus · Void · Phoenix | Densest cluster — unchanged |

## Frostbite — south ridge + north crown (locked direction)

**Two great sects survived the Dao Wars** on the same gradient spine — different peaks, different lanes:

```text
Frost Gate (chilly margin)
    └── Vajra Ridge — body-refining monks (SOUTH great sect; bells, escorts)
    └── Yin Maiden Palace — peak Yin (CROWN; last habitable peak)
    └── Scar margin — delves only
    └── Sunless Scar apex — uninhabitable (Mirror, Frozen Abyss)
```

Yin palace is **not on the Scar** — pursues **peak Yin arts**; Bleed is crucible, not job. Ridge is **not** a city dojo — **monk institution** whose scripture is the vessel. See [`frostbite-yin-sect.md`](frostbite-yin-sect.md) · [`body-path-sect.md`](body-path-sect.md).

## Great-sect checklist (any outer flagship)

Use when a stub gets promoted to “near-peer” fiction:

- [ ] Homeland name + why the mountain/array matters
- [ ] Cultivation identity (path, dao, element lean)
- [ ] Founder myth + Dao Wars / charter outcome (one row in imperial table)
- [ ] Public patriarch tier + one player-facing elder
- [ ] What they teach / refuse
- [ ] Primary economic/political lean (not their only identity)
- [ ] Relationship to Heartlands four (respect, hire, ignore, feud)
- [ ] Player hook — join lane, rivalry, or “prove yourself at the gate”

## Open questions

- [ ] Dustbone great sect: **new institution** vs elevating Sunscar / Ashen into something larger?
- [ ] Jade: two great sects forever, or one merged “tide empire” with internal rivalry?
- [ ] Emberwild: Collective as great sect **or** beast coalition + separate tempering peak?
- [ ] Do outer great sects each get a **sleeping immortal** for deterrence parity, or fewer vault assets than Heartlands?

## Implementation crumbs (later)

- `data.js` — `FACTION_DEFINITIONS`, `WORLD_LOCATIONS`, `ZONE_POWER` stubs
- `docs/ideas/imperial-clan.md` — charter table rows per promoted power
- `sect-faction-identities.md` — identity template fills per zone
