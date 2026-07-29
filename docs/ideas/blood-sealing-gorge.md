# Blood Sealing Gorge (封血峡) — Heavenly Demon Cult HQ

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — homeland layout) |
| **Blocked on** | Hidden map / hostile sect join UX; owner lock: gorge on `outer_heartlands` graph vs pocket instance |
| **Issue** | none yet |
| **Chat / PR** | Cult lore pass, 2026-07-29 |
| **Updated** | 2026-07-29 |

Parent: [`heavenly-demon-cult.md`](heavenly-demon-cult.md). Formations: [`formations-and-arrays.md`](formations-and-arrays.md). Peers: [`celestial-sword-sect.md`](celestial-sword-sect.md) (Solitary Sword Mountain), [`void-temple-sect.md`](void-temple-sect.md) (Little Heaven).

## Intent

The gorge is the cult’s **true homeland** — not a dungeon sticker on the Heartlands map. Players who earn P3 should feel **descent**: a **cursed pass**, a **living rogue town**, cult courts stacked **downward** into the **pit** where the founder still feeds. Contrast orthodox peaks (Sword’s lonely massif, Void’s sky observatory): the Demon home is **a wound in the ground** that **never stops drinking**.

**Today:** **Sealed dormancy** — arrays on minimum, population **thinned**, no banners on the road — but **not empty**. Horror is *someone still lives here*.

---

## Why develop this now

| Ready | Still parked |
|-------|----------------|
| Founder, pit, Mo Xuan, Demon Blood Clone, Withdrawal fiction | Full `lineageId` implementation |
| Rogue/refugee **town** at the seal | Playable illegal sect join loop |
| Player hook **P3: gorge not a grave** | Charter map node until hidden-realm UX exists |

**Recommendation:** **Lore + layout now**; **map nodes / raid** when Heartlands hidden content ships.

---

## Cosmology of the place

| Property | Fiction |
|----------|---------|
| **Blood that stays** | Spilled life-qi **pools** in the ravine — post-**Seal** scar + chaos trace; see cult **Scripture origin** |
| **Copper mist** | Array runoff + natural seal; tastes of **pennies**; low-realm cultivators cough blood |
| **Iron rain** | Locals say the gorge **remembers** battles; actually **Blood Seal Grand Array** cycling condensate |
| **Political label** | Heartlands charts: **cursed pass**, **unowned**, **do not camp** — Tian and sects **prefer** the fiction that nothing here matters |

---

## Vertical map (working)

```text
[ Heartlands roads — charter traffic above ]
        |
[ Gorge Mouth — 咒血口 ]          ← false trails, ward stones, Void-scratched seals
        |
[ Outer Slaughter Terrace — 戮台 ] ← Outer Demon drills; “extirpated” propaganda stops here
        |
[ Bloodrift Town — 血峡镇 ]       ← rogue/refugee town (Dao Wars swell); gray market; sealed but lived-in
        |
[ Cauldron Lanes — 鼎巷 ]         ← blood processing, furnaces, Blood Servant pens (horror)
        |
[ Inner Cauldron Hall — 内鼎殿 ]  ← Elder Hong Lian; harvest arrays; inner court
        |
[ Patriarch Seal Court — 魔印庭 ] ← Mo Xuan; Withdrawal ledgers; audience with the living admin
        |
[ Demon Lord Pit — 魔主窟 ]       ← founder; offerings chute; “sleep” = seclusion
        |
[ Array heart — 封血大阵核 ]      ← under-pit; gorge vein; cult’s silent engine
```

**Player-facing node (future):** `blood_sealing_gorge_mouth` or hidden approach from a Heartlands **forbidden** stub — not a friendly hall like `sword_sect_hall`.

---

## Districts

### Gorge Mouth (咒血口)

| | |
|--|--|
| **Vibe** | Wrong quiet — birds avoid; ward stakes **bleed** rust |
| **Function** | **Filter** — kill scouts, misdirect maps; demon envoys recognize **blood knock** codes |
| **Orthodox** | Sword patrols **sometimes** skim the rim; **never** descend without elder quorum. Void Temple **hairline seals** on side caves ([`void-temple-sect.md`](void-temple-sect.md)) — contain, not conquer |
| **Dormant today** | One **rotating** outer squad; most traps **armed** but **untripped** |

### Outer Slaughter Terrace (戮台)

| | |
|--|--|
| **Vibe** | Open rock shelf — wind carries **screams from memory** |
| **Function** | Outer Demon **oaths**, merit duels, **Crimson Harvest** instruction |
| **Rank** | **Outer Demon** default residency before town or missions |
| **Hook** | Caravan survivors’ “demon on the cliff” stories often **this** terrace, not the pit |

### Bloodrift Town (血峡镇)

| | |
|--|--|
| **Origin** | Pre-war **scab camp** at the seal; **Dao Wars** poured refugees, deserters, and **rogue cultivators** until it became a **town** |
| **Vibe** | **Rogues and refugees in equal measure** — taverns, bone dice, “clinics,” no charter law; everyone **pretends** the cult is dead while paying **tribute** in blood-tax or service |
| **Cult relation** | **Not** every resident is sworn — cult **taxes** and **recruits**; town is **camouflage** (commerce masks array intake) |
| **Dormant today** | ~**two-thirds** shutters; night still has **lights** in the lower lanes. Mo Xuan **allows** the town to breathe — empty streets would draw surveys |
| **Named stub** | **Bloodrift Market** (血峡市) — working sign for the main strip |

### Cauldron Lanes (鼎巷)

| | |
|--|--|
| **Vibe** | Heat, slag, **sweet** rot; channels cut in rock for spill |
| **Function** | Mobile cauldron repair, essence **bottling**, Blood Servant **processing** *(NPC horror — owner call on player exposure)* |
| **Rank** | **Core Demon** work gangs; **Elder of the Cauldron** oversight |

### Inner Cauldron Hall (内鼎殿)

| | |
|--|--|
| **Vibe** | Cathedral of **industry** — arrays hum like distant breathing |
| **Function** | **Blood Seal Grand Array** control; gorge **vein** metering; Great Draught-era scripts **archived** |
| **NPC** | **Hong Lian** (红莲) — player quest giver at friendly rep / infiltrate beat |

### Patriarch Seal Court (魔印庭)

| | |
|--|--|
| **Vibe** | Clean **for a demon** — stone, few banners, **silence enforced** |
| **Function** | Mo Xuan’s **admin**; Great Withdrawal **seals**; branch **sleeper** signals in and out |
| **Access** | **Heavenly Demon Envoy**+; outsiders **die** or **serve** |

### Demon Lord Pit (魔主窟)

| | |
|--|--|
| **Vibe** | Vertical shaft — **offerings** lowered; air **thick**; juniors **never** descend |
| **Function** | **Founder** in seclusion; slow **devour** of failed merit + tribute; **beyond-Immortal** research |
| **Myth** | Outer court told **“next Heavenly Demon”** will **rise from the pit** — **ruse** |
| **Hook** | P4: omen spike if he **stirs**; Half-Step suspicion **not** relevant until someone **wakes** him |

### Array heart (封血大阵核)

| | |
|--|--|
| **Location** | Beneath pit — **not** tourist |
| **Function** | Converts **spill** (battle runoff piped from history, local kills, ritual) into **sect vein qi** |
| **Risk** | Sabotage = **gorge goes feral** — blood-mist **storms** into Heartlands |

---

## Arrays & wards

| Array | Role |
|-------|------|
| **Blood Seal Grand Array** (封血大阵) | Gorge **engine** — gather, seal, condense; Sever + Gather hybrid ([`formations-and-arrays.md`](formations-and-arrays.md)) |
| **Mist Veil** (working) | Hides thermal / qi signature from charter surveys |
| **Slaughter Recall** (working) | Tags **Blood Rain** corpses in the radius for lane pickup |
| **Void hairline seals** | Side entrances **pinned** — cult **steals** void-walk **copies**, cannot break Temple locks on prison tier |

---

## Who is here now (dormant HQ)

| Population | Scale *(fiction)* | Notes |
|------------|-------------------|-------|
| **Blood Servants** | Hundreds *(down from thousands)* | Mortal thralls; town **visible** misery |
| **Outer / Core Demon** | Low hundreds | Mostly gorge-bound; few **envoys** outside |
| **Inner court** | Dozens | Hong Lian’s cauldron priests; pit **attendants** only by rotation |
| **Bloodrift civilians** | Thousands *(thinned)* | Many **don’t** know pit truth; know **not to ask** |
| **Patriarch + pit** | 1 + 1 | Mo Xuan **admin**; founder **feeds** |

**Activity level:** **Shadow** — enough harvest to **feed arrays + pit**; not **Great Draught**. Caravan hits are **outside** the mouth more often than **town raids**.

---

## Approach beats (player / chronicle)

| Stage | Beat |
|-------|------|
| **Rumor** | Nursery rhyme **place names** match gorge districts |
| **Scout** | Mouth wards; Void seal scratch; **dead** charter map |
| **Town** | Blood-tax, clinic front, **“cult is dead”** joke |
| **Infiltrate** | Cauldron Lanes horror; earn or fake **merit** |
| **Court** | Mo Xuan — bargain, join, or **marked** |
| **Pit** | *(Crisis only)* founder voice; continent **omen** |

---

## Open questions

- [ ] **Graph:** subzone of `outer_heartlands` vs **pocket** enter-from-mouth only?
- [ ] **Bloodrift Town** — playable hub for illegal join, or **story-only** until rep/faction UX?
- [ ] **Hanzi lock** for districts beyond working names?
- [ ] First **explore** stub: mouth only vs town in MVP?
- [ ] Tian court **knows** town exists but **ignores** — explicit in [`imperial-clan.md`](imperial-clan.md)?

## Implementation crumbs

- Future: `WORLD_LOCATIONS` / `HIDDEN_SUBZONES` — `blood_sealing_gorge_mouth`, `bloodrift_town`, `inner_cauldron_hall`
- Tie **P3** cult hook in [`heavenly-demon-cult.md`](heavenly-demon-cult.md) to this doc
- `caravan_demon` — approach **mouth** or **terrace**, not town center (by default)
