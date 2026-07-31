# World events — layered battlefield (beast waves · conscription)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Mid city stub; combat squad scenes; [`jianghu-organization-types.md`](jianghu-organization-types.md) org tiers |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-07-31 · [`cursor/qc-density-org-stubs-ae81`](../../) |
| **Updated** | 2026-07-31 |

**Sister:** [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) (personal interrupts) · [`chronicle-and-projects.md`](chronicle-and-projects.md) (Jianghu diary tab) · [`dustbone-living-board.md`](dustbone-living-board.md) (clock pulses)

## Intent

**Grand-scale** world events where the player is **not** the protagonist of the war — a QC visitor to the mid city during a beast wave gets **conscripted**, fights in their **lane**, and must **survive**. GC beasts meet GC defenders / arrays off the player board. Calendar density through memorable chapters, not weekly noise.

## Design notes

### Event scale ladder

| Scale | Example | QC role | Frequency |
|-------|---------|---------|-----------|
| **Local** | Scrub wight surge near Redwell | Optional defender; economic hit | Seasonal |
| **Regional** | Mid-city beast wave | **Conscripted soldier** — survive squad lane | Rare |
| **Basin** | Threshold array strain | Evacuate, courier, witness | Very rare |
| **Legendary** | NS spine moves | Chronicle prose only | Story |

This doc focuses **regional** and up — local pulses can share the same template at lower tier.

### Layered battlefield (owner lock 2026-07-31)

```text
STRATEGIC (off-screen / summarized)
  GC beast  ↔  GC defender / city array
  NS general ↔ enemy commander

OPERATIONAL (heard, not played)
  FE captains reposition; "eastern wall buckling"

TACTICAL (player plays)
  QC squad vs beastlings / cultists / enemy soldiers
  Win = survive + complete assignment (hold line, evacuate, deliver seal)
```

**Player never kills the apex threat** at QC. Diary: *"Elder Sandveil descended when the array cracked. You were pulling wounded from the scrub line."*

### Conscription rules

| Rule | Why |
|------|-----|
| Player chose to be in city (or couldn't flee in time) | Agency |
| Refusal costs standing / desertion flag | Not hard game over |
| Assignment matches **realm band** | QC vs QC threats only |
| Stumble into GC lane = fast death | Correct power fantasy |
| Outcome resolves **with or without** player | World isn't player-centric |
| Aftermath changes board | Prices, wounded seats, recruiting surge |

Org **deployment tier** ([`jianghu-organization-types.md`](jianghu-organization-types.md)) sets how many NPC squads exist — conscription pulls from Tier II mid-city garrison + contracted tribals + impressed cultivators.

### Example set piece — mid-city beast wave

**Setup:** Player visits unnamed **3rd-tier** Dustbone mid city ([`city-tiers.md`](city-tiers.md) — civic apex ~ GC). Beast tide from wilds.

**Beats:**

1. Rumor tick → alarm → gates close
2. Conscription notice by realm — QC to scrub line, FE to captain, GC to wall
3. 3–5 tactical encounters (squad combat)
4. Strategic summary interstitial (array flares, elder descends)
5. Resolution: city holds / partial loss / player deserted
6. Aftermath month: medicine shortage, sect recruiting, chronicle entry

**Loot:** ration pills, damaged gear, rep — **not** beast core.

### Relation to cultivate interrupts

| | **Cultivate interrupt** | **World event** |
|--|-------------------------|-----------------|
| Scale | Personal | Civic / regional |
| Trigger | Stance on + grudge/homeless | Calendar + location |
| Feel | Someone found *you* | The basin is burning |

Both answer AFK cultivate; different fiction.

### Positive pulses (not only calamity)

Same machinery: **caravan season**, tournament month, registry amnesty — opportunity pulses. Beast wave is the dramatic template.

## Prerequisites

- [ ] Mid city name + location node
- [ ] Squad combat scene (multi-encounter chain)
- [ ] Chronicle Jianghu feed entry format
- [ ] Org tier on participating factions

## Open questions

- [ ] Player desertion — perma flag or recoverable?
- [ ] Can lesser sect hall exempt disciples (pay fine)?
- [ ] Sim army losses vs scripted outcomes only?

## Implementation crumbs

`world-clock.js` seasonal pulses, `chronicle` Jianghu tab, combat chain in `actions.js`, `G.worldEvents` state, [`settlement-lore.md`](settlement-lore.md) mid city.
