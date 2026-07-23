# Imperial city — Tianjing (design workshop)

| Field | Value |
|-------|-------|
| **Status** | `idea` — owner workshop |
| **Blocked on** | Name lock; emperor/regent lock; phase-1 nodes |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent workshop, 2026-07-23 |
| **Updated** | 2026-07-23 |

## Intent

Design the **Tian Clan capital** — the sleeping dragon's body on the map. Not a tyrant's open fortress; a city everyone **must** pass through for charter law, examinations, and rumor — while the true weight sleeps below.

Parent lore: [`imperial-clan.md`](imperial-clan.md). Map pattern: [`local-world-map-split.md`](local-world-map-split.md).

---

## Working name: **Tianjing** (天京)

*"Heaven Capital"* — on-the-nose on purpose (matches Tian Clan). Older names buried with the pre-Tian dynasty. Sect immortals may use an archaic name in private.

**Player-facing short name:** Tianjing · **Imperial City** · *the Sleeping Dragon* (epithet).

**Recommendation:** keep **Tianjing**. The bluntness is the point — everyone knows who built it. Archaic names belong in Void archives and late-game reveals, not on the signpost.

---

## Role on the continent

| Function | Fiction |
|----------|---------|
| **Charter seat** | Sect homelands are **licensed here** — capitulation, not surrender |
| **Neutral gravity** | Sect envoys, trials, examinations; no sect owns the capital |
| **Sleeping deterrence** | Founder sealed beneath the palace — the dragon sleeps |
| **Surface scheming** | Regent court, blood branches, eunuch cultivators, ministries |
| **Not daily tyranny** | Open city; law is real but enforced through procedure and rumor |

**Celestial Market** (existing node, south of outer Heartlands) = **charter trade ground** — greatest open market, technically under imperial charter but physically outside the palace walls. Tianjing = **law and mandate**; Celestial Market = **commerce**.

**Why both exist:** merchants hate palace gates. Sects want neutral ground to trade without bowing in the throne room. The Tian **allowed** the market south of the walls as a pressure valve — and taxes it.

---

## Map placement (Heartlands local map)

Current layout: four sect HQs ring **outer_heartlands** (center); Celestial Market to the south.

**Proposal:** Tianjing sits **north** of outer_heartlands — inner Heartlands, elevated, between Sword and Lotus peaks visually.

```text
        [Sword Hall]     [Tianjing Gate]     [Lotus Pavilion]
                              |
                        [Charter Hall]
                              |
                    [Palace Approach]  (realm-gated)
                              |
                    [Outer Heartlands] — default wilderness hub
           [Void Steps]                    [Phoenix Court]
                              |
                    [Celestial Market]
```

### Phase 1 nodes (implementable)

| Node id | Name | type | Access |
|---------|------|------|--------|
| `tianjing_outer_gate` | Tianjing Outer Gate | `city` | Open — first imperial contact |
| `tianjing_charter_hall` | Charter Hall of the Mandate | `outpost` | Open — examinations, edicts, imperial rep |
| `tianjing_palace_approach` | Palace Approach | `landmark` | `reqRealm` 1+ or imperial favor — audience fiction |

**Travel:** walking from sect HQs → Tianjing costs **+1 month** vs outer heartlands (distance + formal checkpoints). Outer heartlands remains the cheap hub.

### Phase 2 (later)

| Node | Access |
|------|--------|
| Inner Palace / Regent Audience | High imperial favor |
| Sleeping Seal / Founder Shrine | Late game, dao/void tie-in (`heartlands_root`) |
| **Imperial sub-map** (sect-map style) — ministries, courtyards, forbidden inner ring |

**Recommendation:** phase 1 = **three nodes** on the local map. Enough to feel like a capital without building the sub-map yet. Sub-map deferred until sect-map pattern is reused.

---

## City layers (fiction + player access)

### 1. Outer Tianjing (mortal board)

**Who:** Disciples, merchants, sect envoys, petitioners.

| District (fiction) | Game hook (draft) |
|--------------------|-------------------|
| **Outer Gate** | Entry log line; imperial rep starts here; Dragon Guard inspects five-claw insignia |
| **Examination Grounds** | Charter examination — imperial favor, not FE gate |
| **Charter Hall** | Register sect founding; read edicts; Phoenix-Lotus crisis rumors |
| **Envoy Quarter** | Sect NPCs **never fight here** — charter truce ground |
| **Pilgrim Streets** | Shops lighter than Celestial Market; imperial flavor items |
| **Sleeping Dragon Shrine (street)** | Public shrine — incense, petitions; *not* the real seal |

**Vibe:** Busy, polite, watched. Guards are cultivators but don't swagger. Dragon banners everywhere; five claws on every lintel. You feel small. Nobody shouts. Rumors travel faster than qi.

**Daily life (texture):**
- Petitioners queue with sealed grievances against sect overreach — Charter Hall decides if the case is *heard*.
- Envoy Quarter servants wear sect colors but **no weapons** past the gate line.
- Street vendors sell "dragon-scale" snacks that are just painted pastry — mocking it is a fine.
- Night curfew is soft: cultivators walk freely; mortals are "encouraged" indoors after the third bell.

### 2. Middle Court (Foundation+ / favor)

**Who:** Peak FE+, sworn officers, sect elders on business.

| District | Hook |
|----------|------|
| **Ministry of Veins** | Continental qi vein policy; formation permits |
| **Ministry of Rites** | Tribulation witnesses; heaven-accounting paperwork fiction |
| **Ministry of War (ceremonial)** | Blade offices — Celestial Sword posts here when edicts need honor |
| **Regent's Antechamber** | Audience quests; blood-branch plot hooks |
| **Lotus Ledger Annex** | Jade Lotus charter accountants under imperial audit |

**Vibe:** Quiet power. Marble, seal-script, echo. You need a reason to be here. Guards know your face after the second visit.

### 3. Inner Palace (high rep / GC+)

**Who:** Regent council, emperor's household, Tian blood cultivators.

- Succession plots, edicts that move sect rep
- Imperial lineage manual fragments (layered manual policy)
- No open combat — violation = continental crime
- Blood branches compete for regency seals

**Vibe:** Gold and jade. Silence enforced by formations. You are always being measured.

### 4. Underpalace — Sleeping Seal (endgame)

**Who:** Almost nobody.

- Founder Half-Step burial / seal array
- Tie to `heartlands_root` ancient clue, `celestial_observatory`
- Stirring the seal = calamity arc Chekhov's gun

**Public myth:** shrine to the sleeping dragon.  
**Truth:** the founder is *there*, not metaphorically.

---

## Court structure (recommendation)

### Emperor vs Regent — **proposed lock**

| Role | Fiction |
|------|---------|
| **Emperor** | Young figurehead — **Emperor Tianxu** (天煦), age ~14 in mortal years, QC cultivator. Rarely seen. Public told he "meditates with the dragon below." |
| **Regent Council** | Three seats — **actual rule**. Blood branches, chancellors, eunuch cultivators scheme for seats. |
| **Founder** | Sealed underpalace — not a role, a **threat**. |

**Why this works:**
- Succession is live — emperor ages, regents don't want to yield.
- Phoenix revanchism can target **five claws** without needing to kill a god-tier NPC on-screen.
- Player audiences are with **chancellors and regents**, not a child — avoids silly power fantasy early.
- Late game: emperor's coming-of-age ceremony = continental event hook.

**Open:** owner confirms or swaps emperor for "empty throne + regent only."

### Regent Council (starter cast)

| Seat | Working name | Lean |
|------|--------------|------|
| **Chancellor of Charter** | **Wei An** (魏安) | Bureaucratic gatekeeper — player's first imperial contact |
| **Regent of the Eastern Seal** | **Tian Lian** (天濂) | Blood branch — hardliner, hates sect autonomy |
| **Regent of the Western Seal** | **Tian Mo** (天默) | Blood branch — pragmatist, trades favors with Lotus |

Eunuch cultivator order (**Inner Service**) holds the palace keys — not on the council but can veto audiences.

---

## Charter law (how the city *works*)

Not morality — **procedure**. The Tian won by making chaos expensive.

| Rule | Fiction | Game hook |
|------|---------|-----------|
| **No sect war in the capital** | Envoy Quarter truce | No combat nodes in Tianjing phase 1 |
| **Licensed homelands** | Sect arrays legal because registered | Founding a player sect → charter registration quest (later) |
| **Edict precedence** | Imperial edict > sect custom in neutral ground | Phoenix Gambit needs charter ruling to "absorb" Lotus |
| **Five claws** | Only Tian may display | Usurpation = existential crime; Phoenix flirtation with four→five claw banners |
| **Contained rivalry** | Sects may feud **outside** charter seats | Heartlands wilderness still dangerous |
| **Examination** | Periodic census of cultivators | Imperial favor + rumor unlock |

**Phoenix Gambit in Tianjing:** Act 2 should surface **charter petitions** at the Hall — Phoenix lawyers vs Lotus accountants. Player choices affect which edict draft circulates. Absorption = **charter coup**, not mountain deletion.

---

## Imperial faction (draft)

| Field | Value |
|-------|-------|
| id | `tian_clan` |
| zone | `heartlands` |
| name | Tian Clan (Imperial Mandate) |
| emoji | 🐉 |
| type | `imperial` |
| desc | The sleeping dragon — charter law, buried founder, scheming regents |

**Rep:** **separate fifth track** — `imperialFavor` (lean locked). Sect rep = standing with Sword/Lotus/etc.; imperial favor = charter compliance, examinations, audiences.

| imperialFavor | Unlocks (draft) |
|---------------|-----------------|
| 0–5 | Outer Gate flavor; warnings about five claws |
| 6–12 | Charter Hall petitions; read edicts |
| 13–20 | Middle Court access fiction; examination rewards |
| 21+ | Palace Approach audiences; edict side quests |

High imperial favor ≠ automatic sect hate. Selling out a sect is a **choice**, not a rep coupling.

---

## NPCs (starter cast)

| Role | Name | Job |
|------|------|-----|
| **Emperor** (figurehead) | Tianxu | Off-screen; mentioned in edicts |
| **Chancellor of Charter** | Wei An | Bureaucratic gatekeeper; examination |
| **Regent (hardline)** | Tian Lian | Wants sects broken to regency |
| **Regent (pragmatist)** | Tian Mo | Lotus-adjacent favors |
| **Examination Proctor** | **Shen Kui** (沈魁) | Root reading fiction; favor rewards |
| **Dragon Guard captain** | **Han Ce** (韩策) | Outer gate; confiscates illegal dragon banners |
| **Founder shrine keeper** | **Old Gu** (顾翁) | Street shrine; riddles; late-game |
| **Inner Service eunuch** | **Pei Yin** (裴音) | Palace Approach gatekeeper |

Sect envoys **visit** Envoy Quarter — don't duplicate faction NPCs permanently in the capital. Rotating cameos: Sword legal officer, Lotus ledger clerk, Void archivist, Phoenix pamphleteer.

---

## Relationship to four sects

| Sect | In Tianjing they… |
|------|-------------------|
| **Celestial Sword** | **Ministry of War (ceremonial)** — enforce edicts when war must look honorable |
| **Jade Lotus** | **Ledger Annex** — charter accounts under imperial audit; richest concession |
| **Void Temple** | **Archive reading rights** — pre-Dao Wars records sealed in Middle Court |
| **Golden Phoenix** | **Embassy under suspicion** — revanchist pamphlets; four-claw "errors" in banners |

None **own** districts. All **need** the capital. Tianjing is where they pretend to be civil.

---

## Visual / map theme

- **Theme key:** `heartlands_imperial` or extend `heartlands` with gold/jade palette north
- **Motifs:** dragon banners (five claws), seal-script gates, qi veins visible as garden channels
- **Contrast:** sect peaks wild and martial; Tianjing ordered and deep
- **Scale:** Outer Gate feels **wider** than any sect hall — horizontal power, not vertical mountain
- **Sound:** bells, not drums. Water features everywhere — dragon sleeps near water/vein confluence

### Architecture sketch

```text
[Outer Wall — spirit stone, five-claw reliefs]
   └─ Gate Towers (Dragon Guard)
        └─ Avenue of the Mandate (straight, no curves — "heaven's line")
             ├─ Envoy Quarter (left)
             ├─ Charter Hall (center, largest roof)
             ├─ Examination Grounds (right)
             └─ Pilgrim Streets (ring)
                  └─ Inner Wall (Middle Court — formation shimmer)
                       └─ Palace Mount (Inner Palace — cloud-wreathed)
                            └─ Underpalace (not on any map)
```

---

## Ceremonies & calendar (flavor)

| Event | When | Hook |
|-------|------|------|
| **Mandate Bell** | Seasonal | Edicts read aloud; rep shifts if you attend |
| **Dragon Sleep Vigil** | Annual | Street shrine festival; founder myth retold |
| **Charter Renewal** | Multi-decade | Sect envoys renew licenses — background tension |
| **Emperor's Name Day** | Yearly | Figurehead parade; regents visible |

---

## Player journey (phase 1 fiction)

1. **First visit** — Outer Gate: Han Ce explains five claws; imperial favor track introduced.
2. **Charter Hall** — read Phoenix-Lotus rumor board; optional petition observer (no war yet).
3. **Examination Grounds** — Shen Kui offers charter census; small favor reward.
4. **Palace Approach** (gated) — Pei Yin turns you away until FE or favor 10+; tease inner content.

No combat. No market (send players to Celestial Market for gear). Tianjing is **politics, law, dread**.

---

## Open questions (owner)

- [ ] **Lock name:** Tianjing — **recommend yes**
- [ ] **Emperor vs Regent:** young Tianxu + Regent Council — **recommend yes**
- [ ] **Phase 1 scope:** three nodes — **recommend yes**
- [ ] **Celestial Market** — keep separate — **recommend yes**
- [ ] **Imperial sub-map** — defer to phase 2 — **recommend yes**
- [ ] **Examination** — imperial favor + flavor; not FE gate — **recommend yes**
- [ ] **Travel cost** — +1 month from sect HQs vs outer heartlands — **recommend yes**
- [ ] **Regent names** — Wei An / Tian Lian / Tian Mo — keep or replace?
- [ ] **Phoenix Gambit** — add charter petition beat at Hall in lore pass?

## Prerequisites

- [x] [`imperial-clan.md`](imperial-clan.md) lore locked (core)
- [ ] Owner confirms recommendations above
- [ ] Then: phase-1 `data.js` nodes + `tian_clan` faction stub

## Implementation crumbs (later)

- `data.js` — `WORLD_LOCATIONS`, `ZONE_LOCAL_LAYOUT.heartlands` nodes + paths north of outer_heartlands
- `FACTION_DEFINITIONS.tian_clan`, `FACTION_NPCS` (Wei An, Han Ce minimum)
- `factions.js` — `imperialFavor` track
- Phoenix arc — charter petition stage at `tianjing_charter_hall` (separate PR)
- Optional: `imperial-city.js` sub-map (phase 2)
