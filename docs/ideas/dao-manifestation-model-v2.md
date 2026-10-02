# Dao Manifestation model v2 (manifest all · embody late)

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner brainstorm — supersedes parts of v1 when signed off) |
| **Blocked on** | Owner sign-off vs [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md); nine-realm indices |
| **Issue** | none yet |
| **Chat / PR** | [`dao-combat-and-manifestation-redesign-hub.md`](dao-combat-and-manifestation-redesign-hub.md) |
| **Updated** | 2026-10-02 |

## Intent

Separate **comprehension**, **manifestation (externalize)**, and **embodiment (identity)** so Dao Manifestation is not “you picked one law at realm entry.” Players should **use every law they truly understand** in combat (within caps), while **embodiment** remains a late, high-impact identity beat — not a single equipment slot that hides the rest of the library.

**Acquisition** (how pursuits open, fragment rename, way vs insight) is **parked** — this doc assumes `comprehended[]` + depth meters exist eventually.

## Three layers

| Layer | Realm band | Job | Heaven / board |
|-------|------------|-----|----------------|
| **Comprehension** | Dao Seeking+ | Read, stack knowledge, techniques, passives | Law-sense; tribulation lean preview |
| **Manifestation** | Dao Manifestation | **Externalize** law in bounded form (shape on attacks, law arts, holds) | Local procs; small rule patches |
| **Embodiment** | Peak DM / interior | **Primary law** wears your name; domain legislation; Half-Step hooks | Ledger identity; long lifespan band |

```text
Seeking     → laws live inside; board weight @ entry (10k mandate — see nine-realm ladder)
Manifestation → laws may leave the body in controlled doses (ALL that pass threshold)
Peak DM     → ONE (or rare dual) embodied primary + domain-class effects
```

## When Seeking becomes Manifestation

**Breakthrough (Peak Seeking tribulation):** permission to **touch outward** — parallel to VR opening void basin. Not embodiment.

| Gift @ Manifestation entry | Notes |
|----------------------------|--------|
| Moderate power bump | Not VR-peak carryover |
| **Manifest permission** | Unlocks per-dao thresholds + manifest verbs |
| Lifespan | **Modest** bump (playtest band e.g. 15k–25k ceiling) — **not** 45–50k |
| Board weight | Cosmic actor; still not “which law are you” |

**Embodiment tribulation** (later): primary law, **~45–50k** cliff, tribulation character locked to that law.

## Per-dao manifest threshold

Each dao id has:

- **Comprehended** — library effects, technique `daoReq` minimum.
- **Manifestable** — threshold crossed (depth/coherence — tie to acquisition redo later).
- **Manifest depth** — mastery with externalized use (Wielded → Refined → Imposed naming ok).

No dao-specific “charges”; **qi / combat resource** pays for expression.

## Concurrent manifestation cap

**Problem:** five full domains at once breaks readability and counters.

**Leans (pick one or combine in playtest):**

| Mechanism | Feel |
|-----------|------|
| **Intensity budget** | Each active overlay costs budget; greaters cost more |
| **One major + N minor** | One law at full manifest hold; others infusion-only |
| **Stance / mode** | Swap active major between fights cheaply; in-fight swap costs tempo |

Embodiment adds **persistent domain** (or domain-tier hold), not a second unrelated ruleset.

## Embodiment: one primary, multi optional

**Default jianghu:** one **primary** embodied law — aura, NPC dao tell, Half-Step, immortal edict preview.

**Multi-embodiment** — allowed in fiction; price so it stays legendary:

| Model | Summary |
|-------|---------|
| **Sequential peak** | Embody A → peak depth → sublimate/scar → embody B; two laps, one active identity |
| **Primary + facet** | Second law = embedded facet (full manifest, partial tell) |
| **Paired only** | Yin/Yang, Space/Time, Debt/Grace — one dual tribulation |
| **Concurrent dual** | Depth cap split; tribulation tests both; incompatibility table |

See hub doc for combat readability constraints.

## Tribulation classes

| Class | When | Example |
|-------|------|---------|
| **Realm watershed** | Seeking→Manifestation, Manifestation→Immortal | Outward touch; final audit |
| **Law echo** | First manifest of a dao | Short themed test; scar on fail |
| **Embodiment** | Primary identity | Heavy; lifespan; ledger |

Not every manifest threshold needs a full realm tribulation.

## Lifespan (v2 lean)

| Beat | Lifespan role |
|------|----------------|
| Enter Seeking | Floor **10k** (unchanged) |
| Seeking interior | Extensions from law depth; stay **below** embodiment band if never embody |
| Enter Manifestation | **Moderate** bump (playtest) |
| **Embodiment** | **~45–50k** |
| Manifest many, never embody | Long patriarch, not 50k legend tier |

## Lesser vs Greater (unchanged philosophy)

- **Lesser way** — valid **endgame identity** (e.g. Sunfire); can embody without greater.
- **Greater** — breadth; harder; higher ceiling through toolkit size.
- **Fundamental merge** — vertical trade-up; reconcile with multi-embodiment (partitions vs reunified).

## Open questions

- [ ] Exact Manifestation-entry lifespan band
- [ ] Manifest cap formula vs realm depth
- [ ] Can fundamentals be embodied or only manifest-hold?
- [ ] Half-Step requires embodied primary or best manifest depth?
- [ ] v1 `wornLaw` swappable — retire or map to primary embodiment?

## Implementation crumbs

- `cultivation.js` — realm idx; tribulation gates
- `G.daoState` — `manifestDepth`, `embodiedPrimary`, thresholds (names TBD)
- [`realm-claims.md`](realm-claims.md) — split idx 7 **Law (manifest)** vs peak **Law (embody)**
