# Intent apex — Self-Will path (parallel to Dao Manifestation)

| Field | Value |
|-------|-------|
| **Status** | `designed` (late-game brainstorm — owner 2026-08-01) |
| **Blocked on** | Nine-realm ladder stable; dao taxonomy; intent cultivation redo |
| **Issue** | none yet |
| **Parent** | [`weapon-intent-cultivation.md`](weapon-intent-cultivation.md) · [`intent-track-template.md`](intent-track-template.md) · [`nine-realm-ladder.md`](nine-realm-ladder.md) |
| **Updated** | 2026-08-01 |

## Intent

**Five intent realms are not one-per-cultivation-realm.** Bands **stretch** — early intent ripens fast; later intent may take **two cultivation realms** to break through. At the peak, **Intent Domain** (5th realm) is sharpened until it behaves like a **personal law** — not heaven’s Dao, but **Self-Will** (我意 / 己道): *reality in my reach agrees with my imposed will.*

**Who walks this path:** cultivators who **cannot or will not** wear a heaven-recognized law at Dao Manifestation — wrong affinity, rejected by fragments, orthodox dao closed, or deliberate choice to bet everything on the blade-line / maw / circle they already carry.

**Not too much** if treated as a **parallel endgame axis** to Dao Manifestation — same *weight class*, different *shape*. Sword Immortal wore **First Sword Law** at Dao Manifestation ([`celestial-sword-sect.md`](celestial-sword-sect.md)). This doc is for the **other** legend: Void Refining, no Phase dao, intent so absolute they can **wound or slay** a Manifestation peer anyway.

> **Planning only.** QC–GC intent stays the near-term build. Apex Self-Will is parked until Dao Seeking band exists in code.

---

## Three endgame axes (keep separate)

| Axis | Question | Typical peak | Wears “law”? |
|------|----------|--------------|-------------|
| **Cultivation realm** | How strong is the vessel? | Immortal Ascension | — |
| **Dao** | What does **heaven’s pattern** agree you may impose? | Dao Manifestation | **Yes** — local legislation |
| **Intent** | How absolute is **your** imposed will? | Intent Domain → **Self-Will apex** | **No** — personal, not universal |

**Devouring cult** already splits Intent vs Law ([`devouring-law.md`](devouring-law.md) PR #95). Self-Will is the **intent-only** peak when Law never lands.

**Canon / techniques** = taught. **Intent** = your will. **Dao Law** = world agrees. Self-Will = *the world doesn’t agree — but you’re so consistent it stops mattering in your circle.*

---

## Intent realms × cultivation (non-parallel draft)

Five intent realms (idx 0–4). **Typical** cultivation bands — prodigy bypass still possible.

| Intent idx | Weapon names (orthodox) | Typical cultivation span | Calendar feel |
|------------|-------------------------|--------------------------|---------------|
| **0** | Sprout / Stirring | **FE** | Awaken + first ripening |
| **1** | Minor Success / Taking | **GC** | Duel identity forms |
| **2** | Major Success / Feast | **NS → Deity Transformation** | *Spans 2 realms* — intent outlasts one breakthrough |
| **3** | Perfection / Surfeit | **Void Refinement → Dao Seeking** | *Spans 2* — dao opens or doesn’t; intent keeps sharpening |
| **4** | Intent Domain / Maw Domain | **Late Dao Seeking → Void apex** (dao-blocked) **or** peer challenge tier vs **Dao Manifestation** | Apex Self-Will — decades in one band |

**Owner lock:** highest intent **competes with Dao Manifestation Peak** in direct clash — not auto-win, not auto-lose. Sword Immortal at Manifestation **with law** still tops intent-only apex in *legislation* and *scale*; intent-only apex wins in *narrow duels*, ambushes, and killing blows where will outruns law setup.

---

## Self-Will vs Dao Law

| | **Dao Manifestation** | **Self-Will apex** (intent-only) |
|--|----------------------|----------------------------------|
| **Source** | Comprehended dao; heaven’s categories | Imposed will refined past Domain |
| **Scope** | Local **law** — fire is fire here, debt binds, etc. | Local **self** — *my* edge, *my* line, *my* maw |
| **Breadth** | Wide — arrays, sect formations, domain legislation | **Narrow** — extreme in one track’s expression |
| **Counter** | Counter-law, array, fundamental dao | Arrays that **don’t care about your line**; Manifestation **legislation**; bait outside your circle |
| **Cost** | Dao fragment hunt, alignment, tribulation | **No dao multipath**; may fail Dao Seeking content; inward obsession risks (heart demon, divided will if second intent) |
| **Fiction** | *“He wears the First Sword.”* | *“He wears no law — only a line so old it cuts heaven’s borrowed qi.”* |

**Not a new dao id in taxonomy v1** — Self-Will is **intent track state** (`selfWillApex: true` or realm 4 peak substage), not `DAO_TAXONOMY.self_law`. Optional later: NPCs mythologize it as 己道.

---

## Void Refining, dao-blind — player fantasy

> *Fragments turned to ash in your dantian. The heavens offered nothing. So you offered nothing back — only the sword-will you imposed at Foundation, sharpened through Void until the line became the only law you obey.*

**Gameplay sketch (parked):**

| Beat | Detail |
|------|--------|
| **Dao Seeking fail / abandon** | Player or build cannot stabilize Phase dao — fork offered: keep seeking (slow) or **temper intent** (Self-Will bet) |
| **Intent realm 3–4** | Saturation stretches; comprehension beats are **duel / witness / seclusion**, not fragments |
| **Challenge Manifestation** | Elite NPC or tribulation-style fight — intent pressure vs law wear; winnable with expand arts + expression depth |
| **Union impossible** | No intent+law union arts without law — peak power is **intent techniques + apex expression**, not Mandate Bite-tier legislation |

Devouring parallel: cultist with Devouring Intent apex but **never** Devouring Law — starving emperor who eats anyway; weaker legislation, monstrous duelist.

---

## Combat read (when damage system lands)

| Self-Will apex | Dao Manifestation peer |
|----------------|----------------------|
| Intent expression **maxed** — cross-wield nearly native | Law riders **rewrite local rules** |
| Wins **opening**, **duel**, **assassin** beats | Wins **siege**, **formation**, **zone control** |
| [`combat-damage-depth.md`](combat-damage-depth.md) stress + domain pressure from **will** | Stress + **law debuffs** |

Intent Domain art ≠ GC realm Domain ([`domain-system.md`](domain-system.md)) — rename clarity in UI long-term.

---

## What we do **not** need (scope guard)

| Skip for v1 | Why |
|-------------|-----|
| Full Self-Will before GC intent ships | Park apex |
| Ten intent realms | Five is enough |
| Self-Will as strict equal to Manifestation in **all** content | Narrow peak; story-specific wins |
| Every weapon gets unique apex cosmology doc | Template + one paragraph per track |

---

## Template hook

Update [`intent-track-template.md`](intent-track-template.md) realm table **Typical cultivation** column to use **spans** (e.g. `NS–DT`) not single idx.

Per-track apex line (one sentence in each intent doc):

- **Sword:** *The line is the only law within my reach.*
- **Devouring:** *The maw needs no heaven’s receipt.*
- **Staff Circle:** *The circle is mine; what enters is judged.*

---

## Open questions

- Formal name: **Self-Will** · **Ego Dao** (flavor only) · **Absolute Intent** · 我意圆满
- Can Manifestation cultivator **also** have intent apex, or mutually exclusive peak investment?
- Tribulation for intent realm 4 breakthrough — heaven strikes **will**, not dao?
- Sacrilege / alignment: is Self-Will apex “defying heaven’s categories”?

## Prerequisites

- [ ] Intent cultivation + template on main design branch
- [ ] Dao Seeking / Manifestation band designed in progression
- [ ] NPC myth: one Void intent-apex legend (not necessarily playable v1)
