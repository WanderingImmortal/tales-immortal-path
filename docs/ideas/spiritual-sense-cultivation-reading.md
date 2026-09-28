# Spiritual sense & reading cultivation

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Owner world rules; **unlock answered** by [`spirit-path-full-design.md`](spirit-path-full-design.md) — Sense is the spirit path's day-one facet |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-09-28 (day-one spirit sense; face/bone disguise) |

## Intent

Cultivators should not automatically know another party's **true realm**, **core quality**, or **broken** state. Detection is a skill / sense layer with limits, misreads, and social consequences — especially for telling **proper Golden Core** from **Broken Core**.

## Design notes

### What might be readable (TBD)

- Apparent realm band (rough: foundation / core / nascent)
- Core **integrity** (whole vs fractured vs false nascent)
- Foundation variant / dao alignment (faint signature)
- Concealment art, treasures, or higher realm masking lower readings
- **Face / bone structure** vs cosmetic disguise — see [`disguise-and-public-identity.md`](disguise-and-public-identity.md) (bone-shifting vs makeup)

### Detection channels (sketch — pick mix later)

| Channel | Fiction | Game feel |
|---------|---------|-----------|
| **Spiritual sense** | Extend perception; compare soul/core pressure | Stronger sense vs weaker target → clearer read; reverse = vague or backlash |
| **Combat exchange** | First clash reveals qi rhythm; interior techniques probe dantian | Already hinted (`combat.js` probe line); post-fight insight |
| **Social tells** | Sect registry, reputation, scars, how elders address you | NPCs "know" via gossip not magic |
| **Appraisal items / formations** | Assessment arrays at markets, sect intake | Scripted truth for hubs |
| **Voluntary display** | Release aura on purpose | PvP intimidation or proof for deals |

### Broken Core specifically

- **Self-report unreliable** — broken cultivators may claim Golden Core; some pass casual glance.
- **Strong sense on weaker target** might detect: unstable rotation, hairline fractures, "hollow" resonance, heaven's seal missing or wrong pattern.
- **Equal or stronger target** may conceal or mislead unless using dedicated probe.
- **World knowledge** — rumours, sect records of failed breakthroughs; not every broken core is hidden.

### Spiritual sense (draft rules — owner decides)

- **Unlock (owner 2026-09-28):** day one on the spirit path. Sense is that path's first facet ([`spirit-path-full-design.md`](spirit-path-full-design.md)). Exact divine abilities (神通), including thousand-li sense, stay unchosen sketches. Until one is locked, range and clarity stay inside the comparative limits here.
- **Sense delta**: `readerEffective - targetEffective` → tier of detail (none / band / precise / flaw revealed). Stronger reader, clearer read. Weaker reader, vague or backlash.
- Failure modes: backlash, false reading, offence taken (scanning without consent).
- Does not replace story — some NPCs remain unreadable (treasure, higher realm, dao anomaly).

## Prerequisites

- [x] When in progression spiritual sense unlocks — day one on the spirit path (owner 2026-09-28). Later strengthening by realm or technique is still open.
- [ ] Broken Core stat flags (`broken-core-cultivators.md`)
- [ ] UI for sense results (tooltip vs log vs dedicated inspect action)

## Open questions

- Can players hide Broken Core with concealment, or is it always detectable to strong enough sense?
- Do sects legally require assessment on entry (forced read)?
- Sense in combat only, or overworld action on NPCs?
- Body/soul paths: read vessel / soul mass instead of core?

## Implementation crumbs

- `combat.js` — interior probe flavor
- `npc-converse.js` — `probe` stance (social, not cultivation sense yet)
- Future: inspect action, `getSenseReadDetail(reader, target)`
- `broken-core-cultivators.md`, `tribulation-per-realm-limbo.md`
