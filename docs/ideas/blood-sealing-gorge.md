# Blood Sealing Gorge (封血峡) — Heavenly Demon Cult HQ

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — homeland layout) |
| **Blocked on** | Hidden map / hostile sect join UX; owner lock: gorge on `outer_heartlands` graph vs pocket instance |
| **Issue** | none yet |
| **Chat / PR** | Cult lore pass, 2026-07-29 |
| **Updated** | 2026-07-29 (gate watch, shadow intake, Slaughter Terrace) |

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

Full pass below — **district 1 of 7** in the vertical map.

---

## Gorge Mouth (咒血口) — look & defenses

### First sight from the Heartlands road

The charter routes that skirt the Heartlands **bend away** a half-day before the gorge. Merchants call it the **Red Skip** — you detour through scrub hills rather than cut straight, even though the straight line looks shorter on paper.

When you finally **see** the mouth, it is not a mountain gate like Solitary Sword. It is a **wound**:

| Element | What you see |
|---------|----------------|
| **The cut** | A **slash** in red-brown bedrock — walls too sheer, too parallel, as if something **pulled** the earth apart and never let it heal |
| **The jaws** | Two opposing cliffs (**Sky-Left**, **Sky-Right** — 左天 / 右天, working) leaning inward; the strip of sky above is a **blade of pale blue**, narrower than it should be |
| **The floor** | A **dry riverbed** that is not dry: dark **varnish** on stone, slick after mist; old blood-qi **never fully dries** here |
| **The color** | Stone is **rust**, **garnet**, **dried liver**; green only as **black moss** in cracks |
| **Sound** | Wind **hums** in the ribcage arch; no birds; distant **drip** from the array heart even when “dormant” |
| **Smell** | **Copper** first, then sweet rot if the wind blows from inside |

Charter survey stones at the rim are **face-chiseled** or **toppled**. Official maps end at a doodle: *curse — do not camp*.

### The ribcage arch (no polite gate)

Orthodox sects build **gates** — the cult built a **throat**.

```text
     Sky-Left cliff          Sky-Right cliff
           \                    /
            \   ward stakes    /
             \  ||||||||||||  /   ← "Ribcage Arch" (骨笼门)
              \      ↓      /
               === gorge ===
```

**Ribcage Arch** (骨笼门): dozens of **iron-dark stakes** driven into the joining rock at the mouth, banded with **black bronze** rings. They read as a **ribcage** from the approach path. Not decorative — each stake is an **array nail** for the outer ward line.

- Stakes **weep** rust-red when charter qi or **hostile** blood arts brush the line *(low realm: nosebleed; GC: meridian sting)*.
- **No banner**, no name tablet — only a **hidden** demon-script groove on the third stake from the left (envoy **blood knock** target).

### What is built vs what is natural

| Natural | Cult-built (Dao Wars peak, maintained low today) |
|---------|--------------------------------------------------|
| Blood-seal geology, copper mist pools | Rim **terrace cuts** — siege platforms turned into **watch shelves** |
| Side caves (some **Void-pinned**) | **False trails** — three paths in, one real; others loop to **kill shelves** or dead ends |
| Wind channeling | **Mist Veil** emitters — **stone bells** hung under lips of cliff; ring **soundlessly** when active |
| | **Offering runnels** — shallow cuts along the bed floor; carry spill **inward** to town arrays |

### Defense layers (outside → in)

Mo Xuan’s mouth doctrine: **discourage, misdirect, identify, kill — in that order.** Full Great Draught traps are **mostly armed but untripped**; dormancy means **minimum bleed**, not an open door.

| Layer | Name *(working)* | What it does | Dormant today |
|-------|------------------|--------------|---------------|
| **1 — Story** | **Red Skip** | Caravan lore, plague tales, “extirpated cult” — mortals **choose** the long road | Always on |
| **2 — Map** | **False trails** | Two decoy mouths on adjacent ridges; charcoal marks **fake** safe paths | Maintained |
| **3 — Mist** | **Mist Veil** (雾障) | Dulls **spirit sense** and charter **survey formations** at distance; gorge reads as **fever haze** | **Low** — enough to fool GC scouts, not NS elders on purpose |
| **4 — Ward line** | **Blood Vow Stakes** (血誓桩) | Ribcage Arch + stake field 30 paces inside; reacts to **unmarked** cultivators and **orthodox seal** signatures | **Armed** |
| **5 — Knock** | **Blood knock** (血叩) | Envoys tap **third stake** in pattern; opens **safe corridor** through stake field for one hour | Active |
| **6 — Eyes** | **Slaughter Terrace** sight lines | Rim **watch shelves** overlook the bed; terrace signals gate wardens — **crossfire** only if intrusion **persists** | **Unmanned shelves** most days; arrays **watch** |
| **7 — Array** | **Guest Welcome** (迎客阵) *(ironic)* | Pressure drop in bed — knees buckle, **meridian cramp**; calibrated to **slow**, not kill, so trespassers can be **harvested** | **Half power** — kills only if you **run** |
| **8 — Kill** | **Rain recall tags** | **Blood Rain** residue in cracks; trespasser bleeds → tags call **Slaughter Recall** inward | **Armed**, rare trips |
| **9 — Void pins** | **Hairline seals** | Side caves along the rim — Void Temple script **prevents** pocket-cutting **into** the gorge from outside ([`void-temple-sect.md`](void-temple-sect.md)); cult **cannot** remove; uses other entries | Permanent |
| **10 — Political** | **Nobody’s land** | Tian / charter **do not garrison** — admitting the gorge matters **reopens** Tianjing lies | Always on |

**What the mouth does *not* do (on purpose):** no **massive** lightning array at the lip — that **advertises** immortal attention. Withdrawal tuned the mouth to **swallow scouts**, not **challenge** sect coalitions. **No crowd at the gate** — disciples **stay inside**; the gorge is not a recruiting fair.

### Gate watch — secrecy first (值守)

| | |
|--|--|
| **Headcount** | **One** warden on duty; **never more than two** on rotation (**DT rotation** — inner shorthand for **mouth watch tour**, 咒口值守) |
| **Rank** | **Core Demon** — trusted, literate in knock codes; **not** envoys (those live outside) |
| **Job** | Maintain **Blood knock**, **Mist Veil** low band, stake field; **log** array drip; **relay** to terrace if something crosses the bed |
| **Visibility** | From outside the Mist Veil, the mouth looks **empty** — wardens stand **in shadow** of the ribcage, **no** armor flash, **no** challenge shouts |
| **Doctrine** | Mo Xuan: *“A guard who is seen is a guard who failed.”* |

Arrays do most of the killing; humans **confirm** and **silence**.

### Disciples in, blood from outside

The gorge **does not** replenish by welcoming walk-ins at the mouth. **Secrecy** means:

| Pipeline | Source | How |
|----------|--------|-----|
| **Shadow harvest** | **Children** — kidnapping in the dark; **orphans** with no register; **war refugees** separated from caravans; **bandits** taken alive | Branch cells + Bloodrift **clinic fronts** (`Dr. Wen` tier) — deliver inward, **not** through the public mouth |
| **Inside the gorge** | Sworn disciples **live downstream** — terrace, town, lanes — **rarely** leave; envoys are the **only** regular exit |
| **Bloodrift Town** | Civilians and rogues — **tax**, **cover**, occasional **press-gang**; **not** the main disciple pool |
| **Blood Servants** | Failed recruits, mortals — **fuel**; same shadow pipelines |

New arrivals with talent are **tallied on the Slaughter Terrace** before they see the town strip. Most mortals never pass that tally.

---

| Faction | Behavior at the mouth |
|---------|------------------------|
| **Celestial Sword** | Rim patrol **once a season** — disciples throw a stone in, listen, leave. **Descent** needs elder quorum; last full probe was **Dao Wars** |
| **Void Temple** | Maintain **hairline seals** on flank caves; **no** claim on the throat. Archivists have a **redacted** gorge sketch |
| **Jade Lotus** | Smugglers know **blood knock** variants exist; **deny** in register |
| **Tian mandate** | Milestone law **forbids** surveying the cut; bounty posters **don’t** list directions |

### Player / chronicle beats at the mouth

| Beat | Detail |
|------|--------|
| **Approach** | Wrong quiet; **dead** map; Mist Veil **fever** |
| **Stake field** | Nosebleed; choice — **turn back**, **sneak**, or **find** knock lore |
| **False trail** | Loop, ambush shelf, or **caravan_demon** tier fight **before** town |
| **Safe entry** | Blood knock from envoy quest, captured code, or Hong Lian’s **invitation thread** |
| **Tell** | Third stake groove **warm** if pit is **feeding** heavily that week |

### Open (mouth only)

- [ ] **Sky-Left / Sky-Right** — keep cliff names or replace with owner hanzi?
- [ ] **Guest Welcome** — permanent rename or in-world ironic only?
- [ ] Sword **seasonal patrol** NPC hook at rim?

---

### Outer Slaughter Terrace (戮台)

Full pass — **district 2 of 7**; first major cult platform **inside** the mouth, **above** Bloodrift Town on the gorge wall.

---

## Outer Slaughter Terrace (戮台) — look & role

### What you see walking in

Past the stake field, the gorge **widens** into a **half-bowl** carved from the living rock — a natural shelf **widened** in the Dao Wars into an amphitheater that **faces inward**, not toward the charter world.

| Element | Detail |
|---------|--------|
| **Shape** | **Crescent terrace** — ~three hundred paces across; back wall is **cliff**; front lip drops to the **town roofs** below |
| **Floor** | Pale **scar** stone, cut with **vein channels** — dried rust in the grooves; after rain they **run** toward town arrays |
| **Seating** | Not benches — **ledge tiers** for spectators; most are **empty** in dormancy |
| **Center** | **Tally stone** (点册石) — flat altar for **first count** of shadow-caught recruits; oath blood **pooled** here in the war |
| **Rim** | **Watch shelves** — narrow ledges on the cliff **above** the terrace; linked to mouth **sight lines**; usually **unmanned** |
| **Sound** | Wind still **hums**; drills are **whisper-scale** now — no thousand-voice oaths |
| **Smell** | Old iron; on drill days, **sweat and copper** |

From the Heartlands road, **silhouettes** on the rim at dusk fed the legend **“demon on the cliff”** — usually **one** warden on shelf drill, not the founder.

### What happens here (dormant era)

| Function | Then (Great Draught) | Now |
|----------|----------------------|-----|
| **Oaths** | Mass **Outer Demon** swearing | **Small** cohorts only; words **muted** |
| **Instruction** | **Crimson Harvest** breath, formation tags | Core curriculum moved **deeper**; terrace = **intro + discipline** |
| **Merit** | Duels **spilled** openly | Duels **rare**; losers become **Blood Servant** stock or **pit offering** |
| **Intake** | War prisoners **processed** | **Shadow pipeline** deliveries — orphans, bandits, stolen children — **first tally** before town |
| **Signal** | Horn and banner | **Lamp codes** to mouth wardens; **no** horns |

**Secrecy rule:** nothing on the terrace **advertises** the cult to the sky — no banners facing the rim, no daylight **mass** formations visible from outside the Mist Veil.

### Defenses tied to the terrace

| Piece | Role |
|-------|------|
| **Watch shelves** | Cover the **mouth bed** and terrace lip; one archer slot **covers** false-trail return paths |
| **Vein channels** | Terrace spill feeds **town** meters — sabotage here **starves** arrays |
| **Guest Welcome** anchor | Array **node** under tally stone — half-power **pressure** field extends up from mouth |
| **Slaughter Recall** | Old **Blood Rain** tags in channels — armed |

### Stories outsiders tell

Caravan survivors who **never** entered describe a **figure on the cliff** and **screaming** — often **memory + mist**, sometimes a **real** intake night when a refugee batch **resisted** tally.

### Player / chronicle beats

| Beat | Detail |
|------|--------|
| **See terrace first** | Wider gorge; **emptiness** feels watched |
| **Intake horror** | Bound prisoners at tally stone — moral choice beat |
| **Knock escort** | Envoy brings player here for **oath** or **execution** |
| **Sneak path** | Town **ladder alleys** bypass terrace — harder, not impossible |

### Open (terrace only)

- [ ] **Tally stone** — public hanzi on stone or unmarked?
- [ ] Named **terrace warden** NPC for intake scenes?

---

### Bloodrift Town (血峡镇)

| | |
|--|--|
| **Origin** | Pre-war **scab camp** at the seal; **Dao Wars** poured refugees, deserters, and **rogue cultivators** until it became a **town** |
| **Vibe** | **Rogues and refugees in equal measure** — taverns, bone dice, “clinics,” no charter law; everyone **pretends** the cult is dead while paying **tribute** in blood-tax or service |
| **Cult relation** | **Not** every resident is sworn — cult **taxes** and **press-gangs**; town is **camouflage**. **Disciple replenishment** is **shadow** (kidnapping, orphans, refugees, bandits) — see **Gate watch** above |
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
