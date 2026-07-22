# Golden Core — peak condense (maximisation path)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Owner-led Core Formation realm design; FE redesign settled first |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

## Intent

**Condense Core** (as a name and fantasy) belongs at the **peak of Core Formation / Golden Core**, not at Foundation Establishment exit.

At GC peak, optional **condensing** lets cultivators who seek to maximise their path continue growing — compressing/refining the golden core before Nascent Soul (or equivalent). Opens lore around why condense, what it unlocks, and what happens if you skip it.

## Design notes

### Why move it from FE

- At FE, players are forming their **first** core — “condense” implies refining something already formed.
- FE exit fits better as **Form Core** / ignition → tribulation → enter Golden Core realm.
- “Condense” is a **mastery** verb for those already sitting in Core Formation.

### Sketch (not final — owner designs GC)

- Available at **Peak Core Formation** (after seal or equivalent capstone).
- **Optional** — skip and break through to Nascent Soul on a “good enough” core.
- **Condense** — time + cost + risk; improves core quality tier, unlocks techniques, tribulation modifier, or foundation echo into soul birth.
- Failure: damaged core, regression, or soul-path complications (TBD).

### Lore threads to resolve later

- Is condense required to reach certain Nascent Soul qualities?
- Does a condensed core change tribulation type (e.g. Dao Heart vs Lightning)?
- Can you condense multiple times within GC, or once at peak only?
- Relationship to pills (“Core Formation nearly impossible without pills” in `data.js`).

## Prerequisites

- [ ] FE exit renamed/reworked ([`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md), [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md))
- [ ] Owner Core Formation journey design
- [ ] Nascent Soul entry fantasy defined (soul birth vs core shatter)

## Open questions

- Condense as mandatory for “perfect” GC seal vs optional min-max branch?
- Visual: core stages in qi chamber UI after FE?
- Body/soul analogues at their GC-equivalent peaks?

## Implementation crumbs

- Today `CHAMBER_BALANCE.condenseCore` targets `targetRealmIdx: 1` — would move to realm idx 2+ logic
- `chamber.js` — `chamberCondenseCore`, `applyChamberCoreFormationAdvance`, tribulation callback
- `G.chamberCoreCondensed` visual flag
