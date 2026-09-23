# Disguise & public identity

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Central **public identity** read ([`jianghu-situation-threads.md`](jianghu-situation-threads.md) dossier + thread beats); optional [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) for realm peel |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-09-23 |
| **Updated** | 2026-09-23 |

**Sisters:** [`jianghu-situation-threads.md`](jianghu-situation-threads.md) · [`world-standing-and-property.md`](world-standing-and-property.md) · [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) · [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)

## Intent

When the MC has **no backing** and **hot debts**, novels lean on **disguise, alias, and suppressed aura** to walk major cities without every grudge firing on sight. Same game: disguise is a **counterplay** to the dossier / thread system — not immunity, but **buying time** and **choosing where recognition happens**.

**Feel:** prepare vs move on includes *“can I enter Threshold as someone else?”* — success is mundane travel; failure is a spike (recognized, envoy, law).

---

## How hard? (engineering + design)

| Slice | Scope | Difficulty | Notes |
|-------|--------|------------|--------|
| **A — Alias & low profile** | One `getPlayerPublicIdentity()` (or similar) used by NPC greet / converse fame lines | **Moderate** | Fame checks live in `npc.js`, `npc-converse.js` today — many **call sites**, but one **API** if refactored early |
| **B — Cover profile** | Active disguise: display name, robe faction tag, “claimed realm band”, conceal fame tier | **Moderate** | State on `G.activeCover`; beats consult cover before firing **recognition** |
| **C — Items / techniques** | Mask consumable, concealment art, transformation talisman | **Moderate+** | Hooks in inventory + cultivate; tie to [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) |
| **D — Deep sim** | Aura mismatch, voice, gait, spiritual sense peel, known gear, ally NPCs, zone-wide wanted art | **Hard** | Spread across combat, explore, every named NPC — park |

**Honest take:** **A+B is a reasonable milestone** once situation threads exist — disguise without threads is mostly cosmetic. **D is a project**, not a feature.

**Prerequisite that pays twice:** anything that asks “does this NPC know who you are?” should call **one identity resolver**, not raw `G.name` / `G.fame`. That refactor is the main cost; after that, disguise is mostly data + checks.

---

## Design — identity layers

Separate what **exists** from what **this scene believes**.

| Layer | Stored | Used for |
|-------|--------|----------|
| **True self** | Real name, realm, sect, fame, dossier debts | Save, chronicle, post-combat |
| **Active cover** | Alias, optional false sect, displayed realm band, outfit tag | Greetings, market gates, **recognition rolls** |
| **Public record** | Dossier — what jianghu believes about true self | Unchanged by cover until **blown** |
| **Scene context** | Zone tier, witnesses, “registered at inn” | Modifiers to recognition |

Cover does **not** erase threads — it reduces **automatic recognition** and **casual** beat triggers. Blood debts still exist; they just might not find you in the tea house.

---

## Recognition (when cover fails)

Not binary globally — **checks** at choke points:

| Choke point | Check sketch |
|-------------|--------------|
| **Ambient NPC greet** | Cover suppresses fame name; generic “traveling cultivator” |
| **Thread beat (grudge, envoy)** | Roll or threshold: `recognition = f(fame, zone posters, cover quality, witness link, spiritual sense gap)` |
| **Public combat** | Cover **breaks** for that zone / dossier (incident: `identity_revealed`) |
| **Formal registry** | Inn ledger, sect gate, charter — often **requires** truth or high-tier forgery |
| **Personal enemy** | NPC who **met you** before: bonus recognition vs strangers |

**Spiritual sense:** higher realm observer vs weak concealment → peel displayed realm band ([`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md)). Optional v1: skip — only **social** recognition.

**Owner lean:** failure is **interesting**, not instant game over — chase, law, thread heat +1, “blown cover in Tianjing” chronicle line.

---

## Disguise sources (content, not one system)

| Source | Strength | Cost |
|--------|----------|------|
| **Low profile** (no robe, alias only) | Weak — fools bandits, not heirs | Free |
| **Face change item** | Medium — new alias until combat/public feat | Consumable / craft |
| **Concealment technique** | Medium–strong — aura + realm band misread | Cultivation slot, qi upkeep optional |
| **Transformation talisman** | Strong, short | Rare, breaks on hit |
| **Sect uniform (stolen/borrowed)** | Social only — wrong behavior blows it | Standing risk if caught |

Gear **visibility** ([`world-standing-and-property.md`](world-standing-and-property.md)): legendary sword on hip may ignore a cheap mask.

---

## UI & dossier

| UI | Show |
|----|------|
| **Status strip** | “Cover: **Grey Mask** (alias Zhou San)” vs “Traveling as yourself” |
| **Dossier** | True record unchanged; optional subline “Active concealment — public may not link you to debts **yet**” |
| **After blown** | Incident + dossier may gain “seen as {true name} in {zone}” |

Legibility rule holds: player knows **cover is active**; not told **which** NPC will pierce it.

---

## Interaction with threads & appetite

- **Appetite** unchanged — they still want you; **modality** may shift to city-wide poster / spiritual sense hunt if you hide well (shadow + search).
- **Formal challenge** harder to serve if identity unknown — delays beat, doesn’t cancel debt.
- **Grudge interrupt** while disguised: recognition check first; fail → normal interrupt; success → skip or “wrong person” false alarm (rare, costs nothing long-term? or small suspicion flag).

---

## Phased build

| Phase | Deliverable |
|-------|-------------|
| **P0** | `resolvePublicIdentity(context)` + migrate top greet/converse paths |
| **P1** | Active cover state, alias, suppress fame tier in ambient NPC |
| **P2** | Recognition on thread beats + `identity_revealed` incident |
| **P3** | Items/techniques + spiritual sense peel |
| **P4** | Forgery, registry, wanted posters per zone |

---

## Open questions

- [ ] Can player run **multiple aliases** with separate mini-reputations, or one cover at a time?
- [ ] Sect members always recognize robes / seal — yes/no?
- [ ] Disguise in **own** sect territory — absurd or allowed for missions?
- [ ] Reincarnation / name change — carry over dossier?

---

## Implementation crumbs

`npc.js` / `npc-converse.js` (`G.name`, `G.fame` greets), `quests.js` kill log, `story-arcs.js` threads (future), `core.js` `addFame`, alignment/aura greet notes, inventory/consumables, combat reveal hooks.
