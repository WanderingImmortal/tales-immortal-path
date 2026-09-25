# Spirit / Soul path — full third path (spirit sea → born soul → deification)

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner direction locked 2026-09-25; names + numbers still open) |
| **Blocked on** | [`stats-to-meters-rework.md`](stats-to-meters-rework.md) (stat facade, per-track foundation, guards, fifth system) — build order below |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-09-25 (`cursor/spirit-path-stats-design-docs-39a3`) |
| **Updated** | 2026-09-25 |

**Code today:** [`cultivation-tracks.js`](../../cultivation-tracks.js) (three tracks, soul embryo gate), [`soul-chamber.js`](../../soul-chamber.js) (palace layers), [`soul-mass.js`](../../soul-mass.js) (Soul Mass, mitigation, condensation school), `PATHS.soul` + `SOUL_*` tables in [`data.js`](../../data.js).

Related: [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) (sense = early spirit content), [`soul-body-refining.md`](soul-body-refining.md) (forbidden branch), [`void-temple-sect.md`](void-temple-sect.md) (candidate home sect), [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) (milestone lean to mirror), [`combat-damage-depth.md`](combat-damage-depth.md) (Spirit as fifth system).

---

## Intent

Spirit is a **full third path** a player can walk from creation and wield **comparable power** to qi and body — the xianxia soul cultivator, not a stat-bonus side chamber. Everyone has a spirit; those who cultivate it walk this road.

**Fantasy sentence (owner lean):** Qi gathers the world into a core. Body tempers the flesh into a weapon. **Spirit makes the self the weapon** — you fight with perception, will, and presence, and your soul is both your sword and your only shield.

**End goal (owner):** **deification** — the soul path's equivalent of saints / immortals is **becoming a god**: the self itself ascends, not a core or a vessel.

---

## Why it has been hard (diagnosis, keep)

A walkable path in this game fills ~8 slots. Body was a fight because it was built anatomy-and-percentages-first and the fantasy / identity came later. Spirit is in that same state.

| Slot | Qi | Body | Spirit today |
|------|----|------|--------------|
| One-sentence fantasy | gather and store | temper a living vessel | none |
| Core meter | qi / foundation | vessel milestones | three competing meters |
| Chamber loop | gather → bands → seal | temper parts (ACS) | body chamber clone |
| Ladder + breakthrough feel | full | milestones lean | two real gates; 3→6 chain free |
| Combat resource + verb | Breath, shield | Stamina, endure | Focus, Intimidate (exists, unloved) |
| Technique school | many | martial arts | `soul_condensation` (exists, decent) |
| Identity system | Weapon Intent | Martial Intent + Vessel Rules | none |
| World presence | every sect | Vajra Ridge (designed) | none |
| A price | tribulation lightning | pain, oath breach | none |

Fix = fill empty slots top-down. **Not** "add more layers."

### What exists and is a keeper

- **Soul birth at tier 4 on any track** (`SOUL_EMBRYO_REALM_IDX = 3`) — everyone gets a soul; spirit-neglect penalty via conversion rate (55% / 75% / 100%).
- **Soul Mass** as one number gating `soul_condensation` techniques, soul mitigation, intimidation pressure.
- **`soul_condensation` technique school** — spirit damage bypasses physique, bonus vs weak interiors, Soul Search reads NPCs. This *is* the combat identity; surface it.
- **Focus** resource + Intimidate verb.
- Palace layer *names* (Soul Core, Mind Lake, Will Forge, Dao Mirror, Outer Soul, Void Touch, Soul Dominion) — better written than the realm names.

### Known problems (to fix in this design)

1. **No fantasy** — palace actions are body-chamber pattern (2 weeks, +2%, max 3×).
2. **Three meters** — layer %, Soul Mass, `apexProgressPct` all rise on the same clicks.
3. **Two ladders that don't line up** — realm names vs layer names reuse words at different rungs; "Manifestation" collides with Dao Manifestation (显法); "Nascent Soul" is both qi realm 4 and a soul maturity label.
4. **Dead pre-birth** — latent cap 9, ~14 clicks of content, then nothing until tier 4.
5. **Abilities panel** (15 listed, none built) is a promise on screen.
6. **Breakthrough hole** — success marks the *new* realm consolidated, so 3→4→5→6 chain with only the dice roll.
7. **No world presence** — no spirit sect, one market manual.

---

## Design notes

### Vocabulary (lock first)

| Term | Means | Stage |
|------|-------|-------|
| **Spirit** | The faculty you cultivate all game — perception, will, sense | always |
| **Spirit sea** (识海 / sea of consciousness) | Pool of consciousness; the spirit path's **dantian equivalent**; grows in capacity, sharpens in range | pre-birth |
| **Soul** | The thing born at tier 4 when the spirit sea condenses | post-birth |
| **Soul Mass** | The spirit sea's number after birth (same meter, renamed at birth) | post-birth |
| **Divine ability** (神通) | Signature power the soul is born with | birth+ |

Rename the maturity label so it stops colliding with the qi realm "Nascent Soul."

### One meter, all game

**Spirit sea capacity → Soul Mass.** One number. Latent cap of 9 goes away; the sea grows for real pre-birth. Birth conversion rate stays as the quality gate (neglect spirit → hollow soul). Drop layer % and `apexProgressPct` as separate meters.

### Chamber loop — facets, not layers

Three **facets** workable in any order from realm 0 (replaces seven sequential layers × two % actions):

| Facet | Payoff | Where it lands |
|-------|--------|----------------|
| **Sense** | Range and clarity — read cultivators' realm / intent, spot hidden things exploring, see through NPC lies | Out of combat. Unblocks [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md): "when does sense unlock" = day one on the spirit path |
| **Will** | Pressure and endurance — intimidation strength, fear / illusion resistance, how much Focus you can spend before straining | Combat |
| **Clarity** | Dao comprehension, heart-demon resistance; decides which divine ability the soul is born with | Progression; helps *everyone's* heart-demon tribulations |

**Inputs are not herbs.** Meditation time, scripture reading, incense, dream / insight events, contemplating formations; later soul-nourishing materials from spirit beasts. Distinct economy from marrow herbs / demon cores.

### Combat — Focus gets teeth (the price slot)

- Overspending Focus → **strain**: soul mitigation drops until rest.
- Extreme → **soul wound**: heals over months, not turns.
- Frail body (low HP) is genre-correct; soul shield is the only guard.
- Fair trade for damage that ignores flesh.

**Parity comes from a third damage nature + control lane**, not from matching damage numbers — see guards / fifth system in [`stats-to-meters-rework.md`](stats-to-meters-rework.md). Soul is the counter to body; weak to fast physical.

### Identity system — divine abilities (神通)

Soul-path analogue to Martial Intent / Vessel Rules. At soul birth the soul takes a **shape** from the facet you invested most in and grants **one signature ability**, deepening with realm:

| Dominant facet | Divine ability (sketch) |
|----------------|------------------------|
| Clarity | Illusory realm |
| Will | Suppressing gaze — stronger enemies fight weaker |
| Sense | Thousand-li sense — exploration and social play inverted |

One ability, chosen by play, not menu. Gives the birth moment a payoff beyond "manuals unlocked."

### Ladder gates (closes the chain hole)

| Step | Gate |
|------|------|
| 0 → 1 | First true sense reading |
| 1 → 2 | Spirit sea capacity threshold |
| 2 → 3 (birth) | Sea at cap **and** survive a heart-demon trial (tribulation already runs `heart_demon`) |
| 3+ | Soul Mass tiers + divine ability milestones |

Mirrors body's "milestones as power ruler" lean: gates are **insight events**, not click counts.

### Realm names — PROPOSED (nine, not locked)

Current `PATHS.soul.realms`: Awakened Spirit → Manifestation → Spirit Confluence → Soul Integration → Transcendence → Dao Heart → Eternal Spirit. Layer ids: awakened / clarity / purity / dao_heart / manifestation / void / transcendent. Both go.

**Proposal (2026-09-25)** — full table with per-rung reasoning lives in [`nine-realm-ladder.md`](nine-realm-ladder.md) § Spirit path names:

Sea Opening → Sea Stilling → **Soul Seed** → **Soul Birth** (idx 3, shared birth gate) → Soul Transformation → Selfless Refinement → Divinity Seeking → Divine Soul → **Soul Deification** (title: Godhood).

Rule: each name is the work or the change, same as body. Sea *size* is the meter, not a realm. Avoids Manifestation / Nascent Soul / True Soul / Void Soul.

### World presence

- **Void Temple** as natural home sect — souls backing up in the cycle is already soul-cultivator territory ([`void-temple-sect.md`](void-temple-sect.md)).
- Enemies: ghost cultivators, soul-devourers (no flesh guard, deep soul guard).
- Soul manuals; Nascent Soul elders who Soul Search a lying player.
- **Forbidden branch:** [`soul-body-refining.md`](soul-body-refining.md) — body seizing, soul devouring; stain rules already drafted.

### Deification (end goal — sketch)

Owner: soul path apex = **god**, parallel to qi immortal / body saint. Self ascends. Ties to [`post-immortal-cosmology.md`](post-immortal-cosmology.md) and [`upper-ladder-design-hub.md`](upper-ladder-design-hub.md); detail later.

---

## Build order (vertical slice first — do not build seven layers)

**Slice:** pick spirit at creation → reach realm 2 with one meter, three facets, a working sense reading, two soul techniques, Focus strain. If it feels like a real path at QC/FE power, fill rungs; if not, learned cheaply.

1. Vocabulary + fantasy sentence (this doc)
2. One meter; kill the other two
3. Facets replace layers; decide inputs
4. Focus strain as the price
5. Sense as early payoff
6. Divine ability at birth
7. Ladder gates
8. Void Temple home; forbidden branch last

**Prerequisite from the stats doc:** stat facade + per-track foundation + guards **before** step 2, so nothing new reads legacy Will/Spirit.

## Prerequisites

- [ ] [`stats-to-meters-rework.md`](stats-to-meters-rework.md) steps 1–3 (facade, per-track foundation, guards)
- [ ] Realm names locked (next session)
- [ ] Facet inputs / economy sketch
- [ ] Divine ability list (3 to start)

## Open questions

- Realm names for one ladder (see above)
- Which facet inputs exist at QC-tier world (Redwell / Dustbone)?
- Does everyone's heart-demon tribulation read Clarity, or only spirit-path players'?
- Deification: does the soul path *skip* the immortal layer or run parallel to it?
- Dual / tri cultivators: divine ability from dominant facet still, or from dominant *track*?

## Implementation crumbs

- `cultivation-tracks.js` — `SOUL_EMBRYO_REALM_IDX`, `tryAwakenSoulEmbryo`, conversion rates (keep)
- `soul-mass.js` — `grantSoulMass`, `getLatentMassCap` (cap → remove), `getSoulCondensationPowerMult` (keep)
- `soul-chamber.js` — `SOUL_CHAMBER_LAYER_ORDER` → facets; `canSpiritTrackBreakthrough` (gates); `renderSoulChamberAbilities` (cut)
- `cultivation.js:377` — `markSpiritTrackConsolidated(newIdx)` marks the *new* realm → chain hole
- `tribulation.js` — `heart_demon` type already exists
- `data.js` — `PATHS.soul`, `SOUL_CHAMBER_*`, `SOUL_MASS_BALANCE`, `SOUL_CONDENSATION_*`, `COMBAT_PATH_CONFIG.soul` (Focus)
