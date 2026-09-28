# Spiritual sense & reading cultivation

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Owner world rules; possibly Nascent Soul+ when sense is common in fiction |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

## Intent

Cultivators should not automatically know another party's **true realm**, **core quality**, or **broken** state. Detection is a skill / sense layer with limits, misreads, and social consequences — especially for telling **proper Golden Core** from **Broken Core**.

## Design notes

### What might be readable (TBD)

- Apparent realm band (rough: foundation / core / soul tier)
- Core **integrity** (whole vs fractured vs false nascent)
- Foundation variant / dao alignment (faint signature)
- Concealment art, treasures, or higher realm masking lower readings

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

- Unlocked or strengthened at a realm (e.g. Nascent Soul) or via technique.
- **Sense delta**: `readerEffective - targetEffective` → tier of detail (none / band / precise / flaw revealed).
- Failure modes: backlash, false reading, offence taken (scanning without consent).
- Does not replace story — some NPCs remain unreadable (treasure, higher realm, dao anomaly).

## Prerequisites

- [ ] When in progression spiritual sense unlocks
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
