# Disguise & public identity

| Field | Value |
|-------|-------|
| **Status** | `designed` (north star — phased) |
| **Blocked on** | Identity resolver; [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md); public **signature ledger**; situation threads |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-09-23 |
| **Updated** | 2026-09-23 (deep cover + signatures) |

**Sisters:** [`jianghu-situation-threads.md`](jianghu-situation-threads.md) · [`world-standing-and-property.md`](world-standing-and-property.md) · [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) · [`weapon-intent-cultivation.md`](weapon-intent-cultivation.md) · [`combat-damage-depth.md`](combat-damage-depth.md)

## Intent

When the MC has **no backing** and **hot debts**, novels lean on **layered disguise** — cheap face paint fools mortal guards; **bone-shifting** fools a cursory spirit sense on the face; only **deep cover** (new gear, no signature arts) survives experts who tie you to **that sword** or **that technique** you showed in public once.

Disguise is **counterplay** to the dossier / threads: debts persist, but the world must **earn** the link between cover and true self.

**Owner north star (2026-09-23):** Deep enough that disguise is a **commitment loop**, not a toggle — signature weapons and publicly displayed arts become liabilities until the player invests in bone arts, concealment, and a full alternate kit.

---

## How hard? (revised)

| Slice | Scope | Difficulty |
|-------|--------|------------|
| **A — Identity API** | `resolvePublicIdentity(context)` replaces raw `G.name` / fame in greets | Moderate |
| **B — Cover profile + ledger** | Active cover + **public signatures** (arts/weapons witnessed) | Moderate–high |
| **C — Layered disguise stack** | Makeup · robe · bone-shift · aura conceal — each answers different **scan channels** | High |
| **D — Sense integration** | Spirit sense reads face/bone/qi per [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) | High |
| **E — Deep cover mode** | UI + rules: locked loadout, banned signature skills in public | Moderate (rules) + content |

**Honest take:** The **ideal is slice C+D+E together** over time. **A+B** is still the right wedge (resolver + ledger data model). Without the ledger, bone-shifting has nothing interesting to protect against.

---

## Identity layers (unchanged core)

| Layer | Role |
|-------|------|
| **True self** | Name, realm, sect, fame, dossier, **signature ledger** |
| **Active cover** | Alias, displayed realm band, outfit, **which disguise layers are active** |
| **Public record** | What jianghu believes about true self — updates on **reveal**, not on successful stealth |
| **Scene belief** | What *this* observer thinks after scans + memory |

---

## Public signature ledger (the long tail)

Anything **witnessed in public** (or recorded: duel board, tournament, story beat) can become a **recognition key** tied to true self — even under cover.

| Signature type | Example | Tied when |
|----------------|---------|-----------|
| **Weapon bond** | Named blade, unique forged piece, intent-linked weapon | Equipped in public fight; shown in market; dossier “arts shown” |
| **Technique tell** | Sect sword form, deviant intent flare, formation signature | Used where witnesses exist |
| **Aura / dao tell** | Edged sword aura greet, rare dao resonance | Already hinted in NPC greet (`npc.js`) — promote to ledger |
| **Face / body** | True appearance | Default known in zones where fame high or portrait posted |
| **Voice / manner** | Parked v2 — optional for named enemies only | |

Ledger entries: `{ sigId, kind, label, firstSeenZone, heat, linkStrength }`.  
**Recognition check** = cover layers vs observer’s channels **plus** match against ledger.

Player fantasy: *“They might not know my face under paint, but if I draw Frostbite Severance they’ll know it’s me.”*

Dossier **legibility**: show **signatures the jianghu knows about you** (your legend’s tells) — not which guard will spot you. Teaches deep cover without spoilering beats.

---

## Disguise stack (layered, not one buff)

Each layer defends **scan channels**. Observer runs one or more channels based on context (gate guard vs elder vs personal enemy).

| Layer | Fiction | Beats channel | Weak vs |
|-------|---------|---------------|---------|
| **Cosmetic** | Makeup, prosthetic, cheap mask | **Mundane sight** | Spirit sense (face/bone), familiar enemy |
| **Dress / role** | Robe, servant, merchant kit | **Social expectation** | Wrong accent/sect seal, registry |
| **Bone-shifting art** | Reshape face, height, bone profile | **Spirit sense (structure)** | Higher sense delta, prolonged scan, combat stress (slip) |
| **Qi concealment / mimic** | Hide or fake realm band, suppress aura | **Sense (cultivation read)** | Probe technique, array appraisal, fight |
| **Transformation talisman** | Strong all-in, short | Multiple | Breaks on damage; expensive |

**Example (owner scenario):**

- Gate guard: **mundane sight** only → cheap makeup **passes**.
- Junior cultivator with cursory **face scan**: reads bone under makeup → **fails** unless **bone-shifting** active.
- Rival who saw your **public duel**: **ledger match** if you use signature art or draw signature weapon → **fails** regardless of face — unless **deep cover** (different weapon, generic kit).

Channels compose: `effectiveAnonymity = min(layer coverage per channel) − ledger match bonus`.

---

## Spiritual sense & face (tie-in)

Extend [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md):

| Scan depth | Reveals | Typical observer |
|------------|---------|------------------|
| **Glance / aura** | Realm band (rough), dao tint | QC guard with basic technique |
| **Face / bone pass** | Skull structure vs cosmetic | Cultivator gate, yamen scanner |
| **Deep probe** | Core integrity, concealed realm | Elder, array, combat exchange |

**Bone-shifting** sets `boneProfileId` on cover — must be **maintained** (qi upkeep / meditate anchor optional). Stronger reader with `senseDelta > threshold` may see **seams** (fiction: “something wrong with the jaw”).

Cosmetic alone: **no** effect on bone channel — exactly the guard vs sense split you want.

---

## Deep cover (player commitment)

**Deep cover** is a deliberate mode — not automatic when wearing a mask.

| Rule | Purpose |
|------|---------|
| **Loadout lock** | No signature weapon; generic or bought trash gear |
| **Technique ban list** | Signature arts greyed in public scenes (or warn + auto-reveal if used) |
| **Intent / aura suppression** | Extra upkeep or secondary concealment art |
| **Behavior** | Optional: don’t use player name in dialogue choices |

**Shallow cover:** alias + makeup — fine for low fame, mortal guards, shopping.  
**Deep cover:** required for high-tier cities with sense gates + hot ledger.

Failure to commit: you pass the face scan then **one signature stroke** in an alley fight updates ledger and blows cover city-wide.

Rewards patient players; punishes “mask on, same god sword”.

---

## Recognition choke points (updated)

| Choke point | Channels used |
|-------------|---------------|
| Mortal guard | Sight |
| Cultivator checkpoint | Sight + face/bone scan |
| Thread beat (hunter) | Ledger + prior meeting + scan |
| Public combat | **Auto-add/update signatures**; cover break incident |
| Appraisal array | Deep probe — bone shift may not enough without realm mimic |
| Personal enemy | All of the above + memory bonus |

---

## UI & dossier

| UI | Content |
|----|---------|
| **Cover panel** | Active layers (cosmetic · bone · qi) + upkeep warnings |
| **Signatures** | “The jianghu knows you by: {weapon}, {technique}, …” |
| **Deep cover toggle** | Checklist: generic weapon equipped? signatures disabled? |
| **Dossier** | True record; cover noted as “unlinked **if** no reveal incidents” |

---

## Interaction with threads

- Threads still **active**; modality may shift to **ledger-led hunt** (“find the one who uses that art”).
- Righteous orgs: public arrest bad; **witness signature** + shadow capture good.
- Blown cover does not reset debts — adds **link** incident (cover alias ↔ true name in zone).

---

## Phased build (toward north star)

| Phase | Deliverable |
|-------|-------------|
| **P0** | Identity resolver; incident type `identity_revealed` |
| **P1** | Signature ledger from public combat + dossier display |
| **P2** | Cover stack (cosmetic + bone art hook); channel table v1 |
| **P3** | Sense reads per channel at gates / select NPCs |
| **P4** | Deep cover mode + technique/weapon bans |
| **P5** | Forgery papers, zone portraits, array appraisal hubs |

Early play can ship **P0–P1** without bone arts; design **data model** for layers day one so nothing is reworked.

---

## Open questions

- [ ] Bone-shifting: dedicated manual vs physique branch vs alchemy body pill?
- [ ] Signature **decay** — old art forgotten after N years / low heat?
- [ ] Forged copy of famous weapon — mislead ledger or partial match?
- [ ] NPCs with **Soul Search** / memory technique — bypass bone layer?
- [ ] Multiplayer of signatures — disciple uses master’s sect art (false positive)?

---

## Implementation crumbs

`npc.js` / `npc-converse.js` (fame, aura tells), combat technique resolution, equipment display, `quests.js` incidents, future `resolveRecognition(observer, context)`, intent/weapon docs, spiritual sense helper.
