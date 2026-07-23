# Imperial city — outer hub + inner Tianjing (design workshop)

| Field | Value |
|-------|-------|
| **Status** | `idea` — owner workshop (v2) |
| **Blocked on** | Outer city name lock; noble clan roster |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent workshop, 2026-07-23 |
| **Updated** | 2026-07-23 |

## Intent

Design the **continental capital** — not a single palace on a hill, but a **layered metropolis**: an open imperial hub where every power keeps a footprint, wrapped around **Tianjing** (天京), the Tian Clan's inner home grounds where the sleeping founder lies sealed.

Parent lore: [`imperial-clan.md`](imperial-clan.md). Map pattern: [`local-world-map-split.md`](local-world-map-split.md).

---

## Naming — what 京 means

**京 (jīng)** = capital / royal city / the walled seat of mandate. Not a random syllable — it specifically means *the place where heaven's authority sits*.

So **Tianjing (天京)** is not the whole metropolis. It is the **inner city** — the Tian Clan grounds, palace ring, and underpalace seal. Exactly where 京 belongs.

| Layer | Name (working) | Who lives there |
|-------|----------------|-----------------|
| **Outer imperial city** | **[TBD]** — see options below | Everyone: merchants, sect branches, associations, noble clans, petitioners |
| **Inner city** | **Tianjing** (天京) | Tian blood, court, regents, emperor's household — charter forbids sect ownership |
| **Underpalace** | (unnamed on maps) | Sleeping founder seal |

**Player-facing English:** *the Imperial City* (outer) · *Tianjing* (inner, when you earn the name).

### Outer city name — **locked**

**Longcheng (龙城)** — Dragon City. The continental hub; sleeping dragon epithet lives here in the sprawl, not in the inner 京.

| Layer | Name | Who lives there |
|-------|------|-----------------|
| **Outer imperial city** | **Longcheng** (龙城) | Everyone: merchants, sect branches, associations, noble clans, petitioners |
| **Inner city** | **Tianjing** (天京) | Tian blood, court, regents, emperor's household — charter forbids sect ownership |
| **Underpalace** | (unnamed on maps) | Sleeping founder seal |

**Player-facing English:** *Longcheng* · *the Imperial City* · inner ring = *Tianjing* when you earn the name.

---

## Role on the continent

| Function | Where |
|----------|-------|
| **Greatest hub** | Outer city — trade, gossip, hiring, manuals, pills |
| **Charter seat** | Charter Hall (outer) — sect homelands licensed; edicts read |
| **Sect presence** | **Branches**, not mountains — envoys, ledger offices, blade courts |
| **Associations** | Continental guild HQs (alchemy, formations, beast tamers — future) |
| **Noble clans** | Heavyweights who aren't sects — marriage, veins, imperial favor |
| **Sleeping deterrence** | Tianjing inner + underpalace — founder sealed below |
| **Not daily tyranny** | Open streets; law through procedure; Dragon Guard at inner wall only |

**Celestial Market** — **rolled into the outer city** as its largest market district (south quarter). Same `marketKey: 'heartlands'`, no separate map node. Continent's greatest open bazaar is *inside* Longcheng, not down the road.

---

## Map placement (Heartlands local map)

Four sect HQs still ring **outer_heartlands**. The imperial metropolis sits **north** — elevated between Sword and Lotus peaks.

```text
        [Sword Hall]     [Imperial City Gate]     [Lotus Pavilion]
                              |
                    [Celestial Market Quarter]
                              |
                      [Charter District]
                              |
                    [Tianjing Inner Gate]  (gated)
                              |
                    [Outer Heartlands] — wilderness hub
           [Void Steps]                    [Phoenix Court]
```

### Phase 1 nodes (implementable)

| Node id | Name | type | Access |
|---------|------|------|--------|
| `imperial_city_gate` | Longcheng Gate *(or TBD)* | `city` | Open — hub entry, associations, noble quarter |
| `celestial_market` | Celestial Market Quarter | `market` | Open — **same id** for save compat; now inside city lore |
| `imperial_charter_hall` | Charter Hall of the Mandate | `outpost` | Open — edicts, examinations, imperial rep |
| `tianjing_inner_gate` | Tianjing Inner Gate | `landmark` | High favor or `reqRealm` 2+ — inner city fiction |

**Map change:** `celestial_market` node moves **north** (into city cluster) instead of south of outer heartlands. Path: sect HQs → outer heartlands OR imperial gate; imperial gate ↔ market quarter ↔ charter ↔ tianjing gate.

**Travel:** imperial city costs **+1 month** from sect HQs vs outer heartlands.

### Phase 2 (later)

- **Imperial sub-map** — outer districts (Envoy Row, Association Hill, Noble Ward, Market Quarter)
- **Tianjing sub-map** — inner ministries, regent courts, palace approach
- Underpalace / Sleeping Seal — endgame

---

## City layers (fiction + player access)

### 1. Outer imperial city — Longcheng *(name TBD)*

**Who:** Everyone. This is the continent's throat.

| District | Fiction | Game hook |
|----------|---------|-----------|
| **Longcheng Gate** | Entry checkpoints; Dragon Guard inspects five-claw insignia on *imports*, not pilgrims | Imperial favor intro |
| **Celestial Market Quarter** | Greatest open market — manuals, pills, rumors; sect stalls side by side | `marketKey: 'heartlands'` |
| **Envoy Row** | Sect **branch offices** — Sword legal bureau, Lotus ledgers, Void reading room, Phoenix embassy | Charter truce — no combat |
| **Association Hill** | Continental guild HQs (formations, alchemy, beast — stubs) | Future creation-path tie-ins |
| **Noble Ward** | Great clans — not sects, not Tian blood, still dangerous | New rep hooks (see below) |
| **Charter District** | Charter Hall, Examination Grounds, petition courts | Edicts, Phoenix-Lotus petitions |
| **Pilgrim Streets** | Inns, tea houses, rumor | Lighter imperial flavor gear |

**Vibe:** **Loud.** Unlike sect peaks (vertical, martial, insular), the outer city is **horizontal chaos contained by law** — the one place you can buy a Phoenix pamphlet across from a Lotus accountant and a noble's bodyguard.

**Noble clans (starter sketch — owner fills):**

| Clan | Lean | Notes |
|------|------|-------|
| **House of Wei** (魏氏) | Bureaucratic | Chancellor Wei An's blood — veins, not swords |
| **House of Qin** (秦氏) | Martial | Duels for honor; hires Sword rejects |
| **House of Pei** (裴氏) | Inner Service ties | Eunuch cultivator connections |
| **House of Shen** (沈氏) | Examination / roots | Proctor Shen Kui's clan — census monopoly |

Clans are **heavyweights**: patriarch at **Nascent Soul** (public elder band), maybe one hidden VR ancestor — private arrays, but no sect homeland charter. They win by **imperial favor + marriage + commerce**, not absorbing mountains.

### 2. Inner Tianjing (天京) — Tian Clan home grounds

**Who:** Tian blood, emperor's household, regents, Inner Service. Sect envoys **summoned**, never resident.

| District | Hook |
|----------|------|
| **Inner Gate** | Pei Yin (Inner Service) — favor / realm check |
| **Ministry ring** | Veins, Rites, War (ceremonial) |
| **Regent courts** | Blood-branch plotting |
| **Palace mount** | Emperor audiences (rare, high favor) |
| **Street shrine** | Public sleeping-dragon cult — *not* the real seal |

**Vibe:** Quiet after Longcheng's noise. Gold, jade, formation shimmer. You need a reason. The city **outside** the inner wall is for the world; **Tianjing** is for the mandate.

### 3. Underpalace — Sleeping Seal (endgame)

- Founder Half-Step burial / seal array
- Tie to `heartlands_root`, `celestial_observatory`
- Stirring the seal = continental calamity Chekhov's gun

---

## Court structure — **owner lock (v2)**

Sect power bands: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) — **public elders** ≈ Nascent Soul; **patriarch / public apex** ≈ Void Refinement; **ancestor vault** above that (Dao Seeking+, hidden).

| Role | Fiction |
|------|---------|
| **Emperor** | **Tian Xu** (天煦) — *middle-aged in appearance*, young by immortal standards (~200 mortal years, looks 40). **Void Refinement peak** — same public tier as a great sect patriarch (idx `4` today; idx `5` after nine-realm ladder ships). Composes edicts, holds audiences; not a child puppet, not the founder. Ancient Tian ancestors and the buried founder sit above him — same pyramid as the sects. |
| **Regent Council** | Still schemes — emperor is capable, so regents compete for **influence**, not regency. Hardliners want him to break sects; pragmatists want balance. |
| **Founder** | Sealed under Tianjing — ultimate deterrence |

**Why this works:**
- Emperor can be a **real NPC** at sect-leader power without breaking the board
- "Young" for immortals = still has centuries ahead — succession not urgent, but blood branches still plot
- Player late-game audiences matter — you're talking to someone who could flatten a Core Formation fool
- Regent council shifts from "rule in his name" to "counselors who want their branch on the throne when he ascends further"

### Court cast (updated)

| Role | Name | Job |
|------|------|-----|
| **Emperor** | Tian Xu (天煦) | VR peak; visible at high favor — patriarch-tier |
| **Chancellor of Charter** | Wei An (魏安) | Bureaucracy; Wei clan; first contact |
| **Regent (hardline)** | Tian Lian (天濂) | Blood branch — break sect autonomy |
| **Regent (pragmatist)** | Tian Mo (天默) | Blood branch — Lotus-adjacent trade |
| **Examination Proctor** | Shen Kui (沈魁) | Shen clan; census / examination |
| **Dragon Guard captain** | Han Ce (韩策) | Inner gate; five-claw law |
| **Inner Service** | Pei Yin (裴音) | Tianjing gatekeeper |
| **Founder shrine keeper** | Old Gu (顾翁) | Street shrine; riddles |

---

## Charter law (unchanged core)

| Rule | Fiction |
|------|---------|
| **No sect war in the capital** | Envoy Row truce |
| **Licensed homelands** | Sect arrays registered at Charter Hall |
| **Edict precedence** | Imperial edict > sect custom in neutral ground |
| **Five claws** | Tian only — inner Tianjing and imperial regalia |
| **Contained rivalry** | Feud outside charter seats |

**Phoenix Gambit:** petitions filed in **Charter District** — outer city, visible to everyone. Absorption = charter coup.

---

## Imperial faction (draft)

| Field | Value |
|-------|-------|
| id | `tian_clan` |
| zone | `heartlands` |
| name | Tian Clan (Imperial Mandate) |
| emoji | 🐉 |
| type | `imperial` |

**Rep:** separate **`imperialFavor`** track. Noble clans may get their own mini-rep later (`wei_clan`, etc.) — defer until roster locked.

---

## Relationship to four sects (outer city = branches)

| Sect | In the imperial city they… |
|------|----------------------------|
| **Celestial Sword** | **Blade Bureau** on Envoy Row — honor enforcement |
| **Jade Lotus** | **Ledger House** — charter accounts, market rights |
| **Void Temple** | **Reading Room** — sealed pre-Dao Wars fragments |
| **Golden Phoenix** | **Embassy** — pamphlets, four-claw "mistakes" |

Homeland mountains stay on the map. The city gets **offices**, not second HQs.

---

## Visual / map theme

- **Outer Longcheng:** wide avenues, mixed architecture (sect styles clash), market sprawl, noise
- **Inner Tianjing:** uniform imperial dragon aesthetic, five claws, qi-vein gardens, silence
- **Contrast:** sect peaks = wild vertical; outer city = horizontal hub; inner Tianjing = depth

```text
[Longcheng Outer Wall]
   ├─ Celestial Market Quarter (south — busiest)
   ├─ Envoy Row + Association Hill
   ├─ Noble Ward
   ├─ Charter District
   └─ [Tianjing Inner Wall — formation gate]
        └─ Tianjing (palace mount, ministries)
             └─ Underpalace (sealed)
```

---

## Player journey (phase 1)

1. **Longcheng Gate** — hub intro; imperial favor; Han Ce warns on five claws.
2. **Celestial Market Quarter** — existing heartlands market, new lore framing.
3. **Charter Hall** — edicts, Phoenix-Lotus rumor board, examination.
4. **Tianjing Inner Gate** — gated; Pei Yin; tease inner content.

Combat stays outside the city charter zone (wilderness, sect mountains).

---

## Open questions (owner)

- [x] **Outer city name:** Longcheng (龙城) — locked
- [x] **Inner = Tianjing** — locked
- [ ] **Noble clans:** Wei / Qin / Pei / Shen — keep, cut, or replace?
- [x] **Emperor Tian Xu** — VR peak, middle-aged — locked (matches sect patriarch tier per pyramid doc)
- [x] **Celestial Market** — district inside Longcheng, same node id — locked
- [ ] **Phase 1 nodes:** gate + market + charter + tianjing gate — enough?

## Prerequisites

- [x] [`imperial-clan.md`](imperial-clan.md) core lore
- [ ] Outer city name
- [ ] Noble clan pass (light)
- [ ] Then: `data.js` map relayout + faction stub

## Implementation crumbs (later)

- `data.js` — relocate `celestial_market` north; add `imperial_city_gate`, `imperial_charter_hall`, `tianjing_inner_gate`
- `FACTION_DEFINITIONS.tian_clan`, noble clan stubs
- `factions.js` — `imperialFavor`
- Phase 2: outer + inner sub-maps
