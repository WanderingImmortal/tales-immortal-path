# Redwell first-run gameplay loop (Taiwu feel, not Taiwu sim)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Economy feel playtest; situation threads v1; cultivate interrupts Phase 3 |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat 2026-10-22 |
| **Updated** | 2026-10-22 |

**Sisters:** [`redwell-starter-city.md`](redwell-starter-city.md) · [`dustbone-starter-gameplay.md`](dustbone-starter-gameplay.md) · [`qi-condensation-depth.md`](qi-condensation-depth.md) · [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) · [`jianghu-situation-threads.md`](jianghu-situation-threads.md) · [`explore-field-gathering.md`](explore-field-gathering.md) · [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md)

## Intent

The **first run** should spend a **meaningful slice of lifespan** in Redwell — rent, jobs, bribes/fees, field risk, limited bazaar — without feeling like a tutorial corridor **or** a speedrun to Foundation. Target feel: **Scroll of Taiwu**’s early decades — you stay **weak relative to the pond** for a long time, but **fights, materials, relationships, and small civic wins** compound so the struggle feels **earned**, not empty waiting on a qi bar.

This doc is the **macro loop + pacing philosophy**. Inventory of places/systems stays in [`redwell-starter-city.md`](redwell-starter-city.md).

**Explicit non-goal:** Taiwu-grade NPC social sim (marry/feud/off-screen life for everyone). Steal **rhythm and payoff shape**, not engine scope — see [`dustbone-living-board.md`](dustbone-living-board.md).

---

## Design tension (owner lock)

| Pull | Anti-pattern |
|------|----------------|
| **Lifespan is currency** — starter town should **cost** years (shelter, fees, bad deals) | Infinite free rest + explore stone lottery → no life sim |
| **Realm progress is slow** — inferior root Late QC ~40–44, Peak ~45–50 ([`qi-condensation-depth.md`](qi-condensation-depth.md)) | One lucky break skips QC in a season |
| **Weeks must matter** — job month, rent, shelf restock, seat turnover | AFK cultivate-only with nothing else to do |
| **Leave is pull, not push** — Redwell stays valid; diminishing returns mid FE | Script exile at band X |

---

## What Taiwu gets right (translate, don’t port)

| Taiwu beat | Redwell translation (in scope) | Parked / out of scope |
|------------|--------------------------------|------------------------|
| Long weak phase | QC bands + local FE lord as ceiling; fields have teeth | Full NPC cultivation sim |
| **Multiple progress rails** | Manual pamphlet hunt, alchemy loop, Well-Ring standing, bounty rep, courtyard savings, grudge threads | 200-relationship web for every villager |
| **Material friction** | Finite bazaar, jobs dry up, sell-to-bazaar demand shifts | Perfect market with infinite stock |
| **Social consequence** | Named seats, hall triangle graft, impression/trust + **situation threads** | Random gift spam to befriend everyone |
| **Combat as punctuation** | Field fights, bounties, cultivate interrupts (grudge, exposed bandit) | Mandatory arena ladder every month |
| **“Worth it” without power spike** | Chronicle lines, new technique **choice**, safer home, readable enemies | +50 realm stat cheat every quest |

**Player sentence (success):** *“I’m still small in this town, but I **know** people, I **chose** my manual, my courtyard chest has a project, and the well boss owes me a favor — so yeah, I’ll grind another year.”*

---

## One loop — three clocks

Everything hooks the **living calendar** (week stance + monthly flush). Player orients on **three clocks** at once:

```text
WEEK CLOCK     — what am I doing *this* week? (job / field / cultivate / social beat)
MONTH CLOCK    — rent, wages, bazaar restock, job board refresh, rumor pulse
YEARS CLOCK    — QC band mini-breakthroughs, savings for courtyard, when Redwell feels “small”
```

### Typical QC month (not a quest — a rhythm)

| Phase | Player action | Payoff (worth-it) |
|-------|---------------|-------------------|
| **Anchor** | Pay rent or accept homeless penalty; glance bounty + job board | Shelter = safer cultivate ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)) |
| **Fund** | 1–2 job weeks OR one field run + sell | Stones without explore lottery ([`commerce-and-markets.md`](commerce-and-markets.md)) |
| **Spend** | Bazaar: balm after rough field, qi pill when broke, **pamphlet slot** if redraw hit | Build identity via **manual choice**, not only stats |
| **Risk** | Ironscar / Dewcatch / (later) Bonehollow — fight + mats | Alchemy project advances ([`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md)) |
| **Grow** | Cultivate weeks; tolerate interrupts | Band progress + **personal** drama beats |
| **Social** | Tavern rumor; Well-Ring duty; meet seat holder | Threads, fees, future favors ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)) |

**Anti-boredom rule:** no week should be **only** “toggle cultivate.” Even a broke week should offer **one** of: cheap job, low bounty, scrub herb trip, rumor that reframes a seat, pamphlet envy (caravan soon).

**Anti-rush rule:** **gather qi** is necessary but **not sufficient** for satisfaction — parallel rails must advance every ~2–4 in-game months or the sim feels like a bar filler.

---

## Parallel tracks (weak character, strong *run* identity)

While **effective qi power** stays modest, the **run** should accumulate:

| Track | Early QC | Mid–Late QC | Early FE |
|-------|----------|-------------|----------|
| **Technique** | First pamphlet from pool — wrong pick hurts feel, reroll via caravan | Second manual or formation piece; build plan | Courtyard chest + longer projects |
| **Alchemy** | Learn 2–3 recipes; tribe/guild fame gates specialty pills | Reliable qi pill supply **without** bazaar lottery | Brew for lodge or sell |
| **Civic / org** | Hermit path valid; outers’ chores for Well-Ring | Inner-ish trust or **found own lodge** fantasy seed | Courtyard buy (~1–2 wage years) |
| **Jianghu** | Impression on road NPCs; first bounty | Kill log / slight → thread beat ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)) | Escort tax, lord skim **fiction** — pay or push back |
| **Knowledge** | Qi-feel reads (“heavier than you”) | Which field is worth the day; when to flee | Threshold visit — feel small |

**Realm band jumps** stay **automatic mini-breakthroughs** on the years clock — no extra button — so the player doesn’t spam Break Through; the **life** loop fills weeks.

---

## Fights — often, not always lethal

Taiwu early fights are **scary** but **learnable**. Redwell v1 cadence:

| Source | Frequency target | Feel |
|--------|------------------|------|
| **Field explore** | Player-initiated; 1–3 fights per trip typical | Material run with risk tax |
| **Bounties** | 1–2 meaningful turn-ins per QC **year** if player chases board | Under job pay — **choice**, not mandatory |
| **Cultivate interrupt** | Low rate per cultivate month; higher if homeless / grudge active | World remembers you |
| **Seat / hall friction** | Soft — escort tax, job denial, rumor — combat optional | Graft triangle, not boss rush |

**Not:** forced monthly arena or realm-gated “main story” duel that skips bands.

---

## Relationships — lite graph, heavy consequences

Without Taiwu social sim, relationships are **few faces, deep hooks**:

- **Seats** age and turn over — innkeep remembers rent trouble; warden remembers bounty style ([`civic-seats-generator.md`](civic-seats-generator.md)).
- **Well-Ring** — join ladder, dirty partners; loyalty vs hermit is a **run identity** ([`dustbone-lesser-sects.md`](dustbone-lesser-sects.md)).
- **Threads** — one good grudge chain beats ten fetch quests ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)).
- **Tavern rumor** — points at seats, caravans, rare lord fate — not a relationship meter for every NPC.

---

## First-run acts (pacing story, not scripted campaign)

| Act | Approx age band | Redwell role | “Worth it” moment |
|-----|-----------------|--------------|-------------------|
| **I — Arrival** | 16–22 | Learn rent, one job, first field, first pamphlet | Survived first month; picked a technique |
| **II — Habit** | 22–32 | Alchemy loop closes; Well-Ring or proud hermit; bounties | Home cadence; first thread or rival |
| **III — Basin** | 32–42 | Late QC approach; savings; Bonehollow optional | Break Through **available** — player **chooses** when life is stable |
| **IV — Seal or stay** | 42–50+ Peak optional | FE trib; courtyard; lord still beats you in a straight fight | Foundation = **life milestone**, not zone unlock only |
| **V — Small pond** | Early–mid FE | Politics thicken; growth slows — pull toward mid city | Optional take-town fantasy; patient stack valid |

Acts are **feel targets** for content density — not gates.

---

## Sinks that burn lifespan (starter town tax)

Bundle small cuts so **money = concentrated order** ([`world-standing-and-property.md`](world-standing-and-property.md)) without death-spiral:

- Inn rent (monthly)
- Healing after fields
- Qi pills when cultivate stalls
- **Soft fees** — escort tax, well “donation,” bazaar buy premium when rep low
- Job dry-up forcing pivot weeks
- Courtyard **savings goal** (~80–150 mid stones draft) as multi-year project

Player should sometimes feel **one bad month** — Taiwu struggle — but recover via job + scrub run, not reload.

---

## Implementation priorities (feel > breadth)

When playtest says “boring” or “too fast,” tune in this order:

1. **Monthly pulse** — rent + restock + job refresh must be **felt** (UI + chronicle).
2. **Parallel track visibility** — diary/chronicle shows pamphlet project, alchemy, thread stage — not only qi %.
3. **Field triangle** — one more reason per site (Ironscar vs Dewcatch vs Bonehollow).
4. **Interrupt rate** — grudge/bandit often enough to matter, not every cultivate week.
5. **Pamphlet pool redraw** — envy and build diversity ([`qc-technique-pamphlet-pool.md`](qc-technique-pamphlet-pool.md)).
6. **Situation threads v1** — one escalation pack end-to-end.

Do **not** fix boredom by speeding QC bands or inflating explore stones.

---

## Open questions

- [ ] Target **in-game months** from spawn to first Late QC mini-breakthrough at inferior root (playtest).
- [ ] Minimum **distinct “worth it” beats** per 12 in-game months (design QA metric).
- [ ] Well-Ring duty table vs pure job board — ratio for act II.
- [ ] How much **sell-to-bazaar** price swing before it feels punitive vs lively?

## Prerequisites

- [x] Redwell inventory + QC pacing docs
- [ ] Economy feel playtest ([`redwell-starter-city.md`](redwell-starter-city.md))
- [ ] Cultivate interrupts Phase 3
- [ ] Situation threads — one pack shipped
