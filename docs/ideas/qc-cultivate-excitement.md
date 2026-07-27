# QC cultivate on the living clock

| Field | Value |
|-------|-------|
| **Status** | `designed` (Phase 3 — blocked on Phase 2 merge/playtest) |
| **Blocked on** | Living clock Phase 2 ([PR #86](https://github.com/WanderingImmortal/tales-immortal-path/pull/86)) playtest feel |
| **Issue** | none yet |
| **Chat / PR** | design chat · sister [`world-clock-continuous.md`](world-clock-continuous.md) |
| **Updated** | 2026-07-27 |

## Intent

Make gathering qi on the living calendar feel like continuous practice — not shutter clicks, not weird “posture menus.” Pills either hit now or buff cultivate for a while. Interrupts are **world intrusion** (grudge, bandit, assassin), not meditation flavor text.

## Design notes (owner locks 2026-07-27)

### No postures

Skip Steady/Force/Aided stance modes. Cultivate stays a **simple toggle** (Phase 2). Variety comes from **pills/buffs** and **world interrupts**, not posture pickers.

### Pills

| Kind | Feel |
|------|------|
| **Instant** | One-time bump now |
| **Timed gather buff** | Boosts **gather speed only while Cultivate stance is on**; duration from **pill recipe** (not a global 3/6/12 lock) |

**Parked idea:** rarer pill that keeps gathering **in the background** while you work/travel (auto-cultivate). Spec later — not Phase 3 must.

Still **not** one-pill leave-QC.

### Interrupts (need a reason)

Clock **hard-pauses**, short scene, choices, then resume or combat.

| Seed | Now? | Notes |
|------|------|--------|
| **Grudge visit** | **Yes (v1)** | Hostile / wronged NPCs, kill log, story `fate: enemy`, converse grudges — enough hooks to pick “someone with a reason” |
| **Bandit on home** | **Yes (thin)** | Bandit risk when cultivating **without a residence at your current place** (treated as exposed / “homeless” for this check). Dwelling exists; **no hireable guards yet**. Job bandit fiction already on Threshold runs |
| **Assassination** | **No** | Assassins guild / hire-blade layer not built — park until imperial/gray bounty or equivalent |

### Grudge interrupt — what “who shows up?” means

While you cultivate, the world may pause and someone with a **reason** finds you. The open question was only: **where do we pull that someone from in v1?**

| Source | What it is today | Good for grudge visit? |
|--------|------------------|------------------------|
| **World / ambient NPC hostility** | Impression/trust, converse coldness, betrayal ambush hooks | Yes — “that person you slighted on the road” |
| **Kill log** | `G.npcKillLog` — people (or ties) you’ve killed | Yes — revenge / kin / ally of the dead |
| **Story `fate: enemy`** | Scripted enemies (e.g. betrayed merchant) | Yes — strongest “named” grudges |
| **Sect rivals** | Hostile world sects, declare_grudge, raids | Possible, but **sect disciple face/public honor** isn’t modeled — a disciple attacking you in the open is a bigger fiction than “bandit kicks your door” |

**Default for Phase 3 v1:** pull from **story enemies + kill log + hostile world NPCs** first. Skip “sect disciple ambushes you while you meditate in town” until face / public-vs-private rules exist.

**Owner lock (2026-07-27):** grudge interrupts use **personal enemies only** (story foes, kill-log revenge, hostile road NPCs). Sect-rival face attacks stay parked.

### Face / public honor (owner note — not built)

Owner lean: a **sect disciple** might weigh **face** before attacking in public — is it dishonourable to be *seen* doing that? Private courtyard / wilderness = different calculus than Threshold street.

**No face/honor system yet.** Do **not** invent one inside cultivate interrupts. Park:

- Public vs private location mattering for *who will risk attacking*
- Sect reputation / face cost for open violence
- “Challenge board / duel summons” as the honourable path vs alley knife

Until then, grudge interrupts should feel like **personal** enemies (road NPCs, story foes, revenge for kills) — not sect politics with fake face math.

## Prerequisites

- [x] Living clock Phase 1–2 spine (stances, week ticks)
- [ ] Phase 2 merged + playtest yield feel
- [ ] Tag/tune pills: instant vs timed gather buff (duration on recipe)
- [ ] Interrupt pack: grudge (NPC/kill/story) + bandit when not at local residence (assassin parked)

## Open questions

- Whether kill-log revenge can spawn a *new* named NPC (“brother of the dead”) vs only existing foes — decide at implement
- Face / public-vs-private attack rules — parked with residence + sect diplomacy later

## Implementation crumbs

`world-clock.js` stance ticks, `actions.js` `runCultivateSession`, pill apply in `data.js` / alchemy, dwelling hooks, `npcKillLog`, story `fate: enemy`, `npc-betrayal.js` / impression–trust, ambient NPC hostility
