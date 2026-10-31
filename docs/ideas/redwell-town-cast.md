# Redwell town cast — “my people” without Taiwu sim

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Converse + impression/trust stable; job rep hooks; civic seats v1 |
| **Issue** | none yet |
| **Chat / PR** | Owner direction 2026-10-22 |
| **Updated** | 2026-10-22 |

**Sisters:** [`redwell-starter-city.md`](redwell-starter-city.md) · [`redwell-first-run-gameplay-loop.md`](redwell-first-run-gameplay-loop.md) · [`civic-seats-generator.md`](civic-seats-generator.md) · [`jianghu-situation-threads.md`](jianghu-situation-threads.md) · [`work-and-professions.md`](work-and-professions.md) · [`world-cultivation-parity.md`](world-cultivation-parity.md) · [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md)

## Intent

Redwell needs **people you recognize** — not a empty hub of menus. Each run should build a sense of **this is my town and my people**: faces tied to **roles** (well crew, tavern, bazaar, quarry, lodge), **converse** and **trust**, friends who **ask favors** (not quest-board fetch chains), enemies who **remember**, and employers who **offer the right job** when they know your **specialty**.

**Not the goal:** Scroll of Taiwu’s full social sandbox (marry everyone, off-screen feuds for all NPCs). **Goal:** a **small persistent cast** with **deep enough state** that the first decades feel inhabited.

---

## Lifespan pain is not “Redwell tax”

The struggle of the first run is **compound**, not location-themed:

| Factor | How it hurts |
|--------|----------------|
| **Spirit root grade** | Slower gather, worse trib odds — same calendar, less progress per year ([`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md)) |
| **Talent / composition ceiling** | How high the basin allows — psychological clock even in Redwell |
| **Starting poor** | Rent, pills, fees bite harder; more job weeks, fewer cultivate weeks |
| **Short or mortal-lean lifespan** | QC→FE target ages (~40–50 Peak) eat a **large fraction** of the whole life ([`qi-condensation-depth.md`](qi-condensation-depth.md), [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)) |
| **Place (Redwell)** | **Affordable** 4th-tier pond — jobs, fields, lodge — not a extra punishment layer |

**Meta relief:** **creation points / legacy** on later runs ease starting luck (roots, cash, knowledge) — first life stays harsh ([`world-cultivation-parity.md`](world-cultivation-parity.md), `CREATION_*` in `data.js`). Redwell is where that harshness **plays out**, not what defines it.

Town cast makes the years **legible**: you remember *who* you worked for when you were broke, not only that rent ticked.

---

## Two layers of faces

```text
CIVIC SEATS (offices)     — lord, innkeep, bazaar, well boss, warden
TOWN CAST (people)        — workers, regulars, rivals, lodge faces, field crew
```

| Layer | Count (Redwell target) | Persistence | Player hook |
|-------|------------------------|-------------|-------------|
| **Seats** | 5 offices | Succession on age-out; name changes, **role stable** | Fees, jobs board authority, meet/glimpse |
| **Cast** | **~12–20 named** uids | Same people **years** unless death/thread removes them | Converse, favor, specialty jobs, grudges |

Seats are **who runs the system**. Cast is **who you share the well with**.

Overlap is fine (innkeep is a seat **and** a person you banter with). Do not duplicate five seats as the only NPCs in town.

---

## Cast roles (Redwell v1 sketch)

Stable **role slots** — names rolled from Dustbone pack; **role id** persists across rerolls within a save.

| Role slot | Public face | Typical interaction |
|-----------|-------------|---------------------|
| `redwell_tavern_regular` | Common-room fixture | Rumors, introductions, small talk |
| `redwell_quarry_foreman` | Ironscar day-trip | Escort/grit jobs, field tips, attitude if you skip pay |
| `redwell_scrub_gatherer` | Dewcatch | Herb trade, rivalry over patches |
| `redwell_bazaar_clerk` | Under bazaar seat | Buy/sell banter, “sold out again” lines |
| `redwell_well_hand_1` | Job pool | Menial work, gossip about well boss |
| `redwell_well_hand_2` | Job pool | Alternate shift; different personality |
| `redwell_copyist` | Letter work | Favor: copy a sensitive letter |
| `redwell_rival_porter` | Same job tier | Competition, impression fights, thread seed |
| `redwell_lodge_outer_a` | Well-Ring | Duties, hall politics color |
| `redwell_lodge_outer_b` | Well-Ring | Friend or snitch |
| `redwell_healer_mortal` | Balms | Debt favor after bad field trip |
| `redwell_caravan_fixer` | Seasonal | “Caravan in two months” — pamphlet envy |

Add/remove slots in data; **~12–20** is the UX budget (player can name most of them from memory).

**Well-Ring masters / lord triangle** stay **seats + sect doc** — cast is mostly **QC peers and mortals**, not duplicate the FE conspiracy as twelve clones.

---

## Interaction model (no quest board required)

### Always available

- **Converse** — impression / trust (existing ambient patterns)
- **Look** — role + one tick line (civic generator habit)
- **Context actions** — work here, buy, turn in bounty **through** seat systems where appropriate

### Relationship outcomes (data-driven beats)

| Trust band | Example beat (not a named quest) |
|------------|----------------------------------|
| **Warm** | “Can you cover my shift?” → one week job swap or escort micro-scene |
| **Warm** | Lend stones / gift → remembered in chronicle; optional thread if you refuse |
| **Cold / enemy** | Cold shop prices, job denial, grudge thread pick ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)) |
| **Neutral → warm** | Repeat work for their tag (see specialty jobs) |

**Favor beats** are **single-scene or single-week** commitments — mirror `STORY_ARCS` shape but **procedural pack** keyed by role + trust, not a 10-step journal chain.

### Specialty jobs (rep + tags)

When the player accumulates **visible specialty**, the **job pool** (or a cast member’s offer) **prefers** matching work:

| Player signal (examples) | Who notices | Offer |
|------------------------|-------------|--------|
| Alchemy renown / sold brews | Bazaar clerk, lodge outer | Still-tending, reagent run |
| Bounty track record | Warden seat **or** tavern regular tip | Higher-risk posting |
| Escort completions | Quarry foreman | Paid Ironscar guard week |
| Hermit / low visibility | Fewer personal offers — valid path |

Implementation lean: **`G.redwellCast[uid].tags`** on NPC + **`G.playerTags`** or existing rep keys; filter `JOBS` / favor picker — no hidden “class selection” screen.

**Fair employer** ([`work-and-professions.md`](work-and-professions.md)): pay on time → standing++; cast members **reference** that in lines.

---

## “My town” feel — design rules

1. **Names stick** — cast uids stable for the save; chronicle uses names, not “a porter.”
2. **Roles outlive faces** — seat succession ≠ wipe cast; cast death/vacancy is **rare**, logged.
3. **World moves without you** — monthly rumor pulse mentions cast (injured, promoted, feud); not full Taiwu simulation.
4. **Friends aren’t vendors** — warm NPCs ask favors **outside** shop UI.
5. **Enemies aren’t only combat** — denial, rumor, thread escalation.
6. **First run density** — prioritize cast **in Redwell** before spreading kit to other 4th-tier cities.

---

## Scope fence (still not Taiwu)

| In | Out |
|----|-----|
| ~12–20 named cast + 5 seats | Every background NPC married / reproducing |
| Trust + favors + specialty job offers | Full NPC cultivation parity in town |
| Threads from slights/kills | Random gift friendship grind |
| Succession on seats **and** occasional cast replacement | City sim where 200 agents feud off-screen |

---

## Suggested build chunks

1. **`G.redwellCast`** (or `G.settlementCast.redwell`) — role slot → npc uid, personality, tick  
2. **Ensure on spawn** — roll names from Dustbone pack; wire to `npcs` / ambient registry  
3. **Converse entry points** — town map / inn / bazaar “people here” or role buttons  
4. **Favor pack v1** — 3–5 templates (cover shift, escort cousin, hold debt)  
5. **Job filter v1** — 2 specialty tags (e.g. `known_brewer`, `reliable_escort`)  
6. **Chronicle lines** on favor accept/refuse and specialty hire  

**After:** thread picker prefers cast uids with active relationships.

---

## Open questions

- [ ] Single “People” panel vs contextual meet at location?
- [ ] Cast member tied to **one** worksite only, or visit tavern on off-weeks?
- [ ] How many favor beats per year before noise (cap + cooldown)?
- [ ] Share cast generator with other 4th-tier cities later (`settlementCast` generic)?

## Prerequisites

- [x] Civic seats v1 Redwell ([`civic-seats-generator.md`](civic-seats-generator.md))
- [ ] Converse / impression–trust reliable in Redwell hubs
- [ ] Job table keyed by settlement ([`work-and-professions.md`](work-and-professions.md))
