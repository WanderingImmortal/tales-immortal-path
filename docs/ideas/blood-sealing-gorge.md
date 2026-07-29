# Blood Sealing Gorge (封血峡) — Heavenly Demon Cult HQ

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — homeland layout) |
| **Blocked on** | Hidden map / hostile sect join UX; owner lock: gorge on `outer_heartlands` graph vs pocket instance |
| **Issue** | none yet |
| **Chat / PR** | Cult lore pass, 2026-07-29 |
| **Updated** | 2026-07-29 (Cauldron Lanes map; Great Cauldron at pit) |

Parent: [`heavenly-demon-cult.md`](heavenly-demon-cult.md). Formations: [`formations-and-arrays.md`](formations-and-arrays.md). Peers: [`celestial-sword-sect.md`](celestial-sword-sect.md) (Solitary Sword Mountain), [`void-temple-sect.md`](void-temple-sect.md) (Little Heaven).

## Intent

The gorge is the cult’s **true homeland** — not a dungeon sticker on the Heartlands map. Players who earn P3 should feel **descent**: a **cursed pass**, a **living rogue town**, cult courts stacked **downward** into the **pit** where the founder still feeds. Contrast orthodox peaks (Sword’s lonely massif, Void’s sky observatory): the Demon home is **a wound in the ground** that **never stops drinking**.

**Today:** **Sealed dormancy** — arrays on minimum, population **thinned**, no banners on the road — but **not empty**. Horror is *someone still lives here*.

### Plain language (for readers — not game jargon)

| Term in these docs | What it means in normal words |
|--------------------|-------------------------------|
| **Blood Sealing Gorge** | The cult’s home canyon — spilled blood doesn’t fade here. |
| **Bloodrift** / **Bloodrift Town** | The **town inside the gorge** (血峡镇) — “blood” + “gorge crack.” Not a game system name. |
| **Blood knock** (血叩) | A **secret knock pattern** on a marked stake, sometimes with a drop of blood — tells the wards “let this person pass.” Like a password, not a huge spell formation. |
| **Tally / tally stone** | **Roll call** — new captives are **counted and registered** on a flat stone altar before they’re sent deeper. |
| **Guard ledges** *(was “watch shelves”)* | **Narrow rock balconies** on the cliff where a guard can watch the entrance from above. |
| **Press-gang** | **Grab people by force** for the cult (as opposed to willing recruits). |
| **Mist Veil** | An array that makes the gorge **hard to scout from far away** (haze, confused senses). |
| **DT guard** | **Deity Transformation** cultivator — a very high realm ([`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)); only the most trusted rotate to the mouth. |
| **Blood tax** | What the town pays the cult to be left alone — coin, blood essence, names of strangers, or **one body** when the collectors ask. |
| **Great Cauldron** | The **real** vessel (镇教鼎) in a vault **beside the Demon Lord Pit**; a **large statue** in Cauldron Lanes faces it — oath and rumor, not the mass rites themselves. |
| **Cauldron Lanes** | The **industrial district** below town — channels, pill foundry, drill yards, Great Cauldron **approach**; name is legacy, not “a lane of personal pots.” |

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
[ Cauldron Lanes — 鼎巷 ]         ← sect industrial belt; **Great Cauldron statue**; uniforms
        |
[ Inner Cauldron Hall — 内鼎殿 ]  ← array controls; Hong Lian’s seat
        |
[ Great Cauldron Vault — 镇教鼎窟 ] ← **real** 镇教鼎; offerings; opens toward pit
        |
[ Patriarch Seal Court — 魔印庭 ] ← Mo Xuan
        |
[ Demon Lord Pit — 魔主窟 ]       ← founder (cauldron **beside** pit lip)
        |
[ Array heart — 封血大阵核 ]      ← under-pit; gorge vein
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
- **No banner**, no name tablet — only a **hidden** groove on the third stake from the left (target for **blood knock** — the pass-code knock).

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
| **5 — Knock** | **Blood knock** (血叩) | Secret **knock pattern** (often + drop of blood) on the third stake; wards open a **safe path** through the stakes for about an hour | Active |
| **6 — Eyes** | **Terrace guard ledges** | **Narrow overlooks** on the cliff watch the entrance path; terrace can signal the gate wardens | **Usually empty**; arrays still watch |
| **7 — Array** | **Guest Welcome** (迎客阵) *(ironic)* | Pressure drop in bed — knees buckle, **meridian cramp**; calibrated to **slow**, not kill, so trespassers can be **harvested** | **Half power** — kills only if you **run** |
| **8 — Kill** | **Rain recall tags** | **Blood Rain** residue in cracks; trespasser bleeds → tags call **Slaughter Recall** inward | **Armed**, rare trips |
| **9 — Void pins** | **Hairline seals** | Side caves along the rim — Void Temple script **prevents** pocket-cutting **into** the gorge from outside ([`void-temple-sect.md`](void-temple-sect.md)); cult **cannot** remove; uses other entries | Permanent |
| **10 — Political** | **Nobody’s land** | Tian / charter **do not garrison** — admitting the gorge matters **reopens** Tianjing lies | Always on |

**What the mouth does *not* do (on purpose):** no **massive** lightning array at the lip — that **advertises** immortal attention. Withdrawal tuned the mouth to **swallow scouts**, not **challenge** sect coalitions. **No crowd at the gate** — disciples **stay inside**; the gorge is not a recruiting fair.

### Gate watch — secrecy first (咒口值守)

| | |
|--|--|
| **Headcount** | **One** guard on duty; **never more than two** on rotation |
| **Rank** | **Deity Transformation** (DT) — peak inner-court level; only elders trusted with knock codes and array keys |
| **Job** | Keep **blood knock** working, **Mist Veil** on low, stake field healthy; note anything that crosses the dry riverbed; **signal** the terrace if needed |
| **Visibility** | From outside, the mouth looks **empty** — guards stay in the ribcage shadow, no armor flash, no shouting |
| **Doctrine** | Mo Xuan: *“A guard who is seen is a guard who failed.”* |

Arrays do most of the killing; humans **confirm** and **silence**.

### Disciples in, blood from outside

The gorge **does not** replenish by welcoming walk-ins at the mouth. **Secrecy** means:

| Pipeline | Source | How |
|----------|--------|-----|
| **Shadow harvest** | **Children** — kidnapping in the dark; **orphans** with no register; **war refugees** separated from caravans; **bandits** taken alive | Branch cells + Bloodrift **clinic fronts** (`Dr. Wen` tier) — deliver inward, **not** through the public mouth |
| **Inside the gorge** | Sworn disciples **live downstream** — terrace, town, lanes — **rarely** leave; envoys are the **only** regular exit |
| **Bloodrift Town** | Civilians and rogues — **blood tax**, **cover**, sometimes people **grabbed by force**; **not** the main source of new disciples |
| **Blood Servants** | Failed recruits, mortals — **fuel**; same shadow pipelines |

New recruits from the shadow pipelines are **rolled on the tally stone** (head count + name scratch) on the Slaughter Terrace before they see the town market.

### Orthodox contact

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
| **Center** | **Tally stone** (点册石) — flat altar where captives are **counted and recorded** the first time; war-era oath blood dried in the cracks |
| **Rim** | **Guard ledges** — narrow balconies on the cliff **above** the terrace; see the mouth path; usually **empty** in dormancy |
| **Sound** | Wind still **hums**; drills are **whisper-scale** now — no thousand-voice oaths |
| **Smell** | Old iron; on drill days, **sweat and copper** |

From the Heartlands road, a **figure on the cliff** at dusk fed the legend **“demon on the cliff”** — often a **DT guard** on drill, not the founder.

### What happens here (dormant era)

| Function | Then (Great Draught) | Now |
|----------|----------------------|-----|
| **Oaths** | Mass **Outer Demon** swearing | **Small** cohorts only; words **muted** |
| **Instruction** | **Crimson Harvest** breath, formation tags | Core curriculum moved **deeper**; terrace = **intro + discipline** |
| **Merit** | Duels **spilled** openly | Duels **rare**; losers become **Blood Servant** stock or **pit offering** |
| **Intake** | War prisoners **processed** | Shadow deliveries — orphans, bandits, stolen children — **roll call on tally stone** before town |
| **Signal** | Horn and banner | **Lamp codes** to mouth wardens; **no** horns |

**Secrecy rule:** nothing on the terrace **advertises** the cult to the sky — no banners facing the rim, no daylight **mass** formations visible from outside the Mist Veil.

### Defenses tied to the terrace

| Piece | Role |
|-------|------|
| **Watch ledges** | Overlook the mouth path and terrace lip |
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

---

### Bloodrift Town (血峡镇)

Full pass — **district 3 of 7**; the **living town** in the gorge, **below** the Slaughter Terrace on the canyon floor.

---

## Bloodrift Town (血峡镇) — look & daily life

### What it is (one sentence)

**Bloodrift** is a **refugee-and-rogue town** that grew inside the cult’s canyon during the Dao Wars — part market, part hideout, part **camouflage** so the gorge looks like “just a cursed slum,” not an active demon headquarters.

### What the **outside world** thinks vs truth

| Outside belief | Truth |
|----------------|--------|
| “There’s a **camp** in **Blood Sealing Gorge** — refugees and bandits.” | **Partly true** — that’s **Bloodrift**. |
| “The **Heavenly Demon Cult** was **wiped out** at Tianjing.” | **Public lie** — founder lives; sect **dormant**, not dead. |
| “Bloodrift **might** have cult **remnants** or copycats.” | **Understatement** — town is **attached** to the HQ, not a random village **near** it. |
| “It’s **ragtag** — no match for a great sect.” | **Deliberate look.** **Uniformed Core Demons+** and array infantry live **below** the market; town is the **hood** over the fist. |

**Name on maps:** Charter atlases mark **封血峡** (cursed gorge) at most. **血峡镇** is **smuggler/refugee** word-of-mouth — not Longcheng registry. Knowing the name **Bloodrift** does **not** mean knowing “demon capital.”

---

The terrace lip overlooks **roofs** — flat stone, plank, patched cloth. Smoke rises from **cook fires**, not forges (those are deeper, in Cauldron Lanes). The gorge **narrows again** below the town; the main strip runs along the **dry riverbed** where the floor is still dark and slick.

| First impression | Detail |
|------------------|--------|
| **Light** | Dim even at noon — cliffs cut off the sun; **lanterns** at all hours in the lower lanes |
| **Sound** | Haggling, dice, a **two-string** somewhere; babies cry behind shutters; no temple bells |
| **Smell** | Fried oil, **cheap incense** to hide copper, unwashed wool, sometimes **iron** from the channels underfoot |
| **Mood** | **Busy enough to feel normal**, quiet enough to feel **watched** — because it is |

Charter law **does not run here**. Nobody wears Sword or Lotus colors openly unless they’re **hiding**.

### Layout (simple map in words)

```text
[ Slaughter Terrace — above on cliff ]
              |
    ┌─────────┴─────────┐
    |  UPPER SHEDS       |  ← newer refugee hovels, goat pens
    └─────────┬─────────┘
              |
    ═══ BLOODRIFT MARKET (血峡市) ═══  ← main strip along the riverbed
         |    |    |
    tavern  dice  clinic row
              |
    ┌─────────┴─────────┐
    |  LOWER LANES       |  ← ladders, back doors, delivery paths to Cauldron Lanes
    └─────────┬─────────┘
              |
         (deeper gorge → Cauldron Lanes)
```

- **Bloodrift Market** — the name people use for the **main street** (not a separate city).
- **Ladder alleys** — steep side paths; locals use them to **avoid the terrace**; shadow deliveries often **come in here at night**, not through the market.

### Who lives here

| Group | Who they are | What outsiders should know |
|-------|----------------|------------------------------|
| **Refugees** | Dao Wars families, famine runs, people with **no register** anywhere | Many **believe** the cult was **wiped out at Tianjing**; they stay because nowhere else will have them |
| **Rogues** | Deserters, smugglers, failed disciples, petty cultivators | Here for **no questions**; pay **blood tax** and don’t preach righteousness |
| **Town civilians** | Merchants, cooks, bone-setters, **not** sworn to the cult | Still pay tax; still **look away** when a wagon goes to the lower lanes |
| **Cult — visible** | A few **Outer Demons** in plain clothes, **collectors**, clinic “doctors” | **No demon banners** on the strip; **no uniforms** here by rule |
| **Cult — hidden** | **Core Demon+** in **black-and-crimson** dress **deeper** in the gorge; envoys **plain-clothes** outside | Town is **not** where inner court **drills** — see **Cauldron Lanes** |

**Your locked fiction:** **Rogues and refugees in equal measure** — the town should feel like **both** a sanctuary and a trap.

### Blood tax (what it actually means)

Not a formal charter tariff — a **protection racket** dressed as tradition.

| Payment | When |
|---------|------|
| **Coin or goods** | Monthly **collector** round on the market strip |
| **Blood essence** | Small vials from **willing** sellers (desperate cultivators) or **fines** |
| **Information** | Names of **strangers**, caravan timings, orphan beds empty |
| **People** | Rare but feared — “the list” — someone **taken** to the lower lanes; town calls it **taken by fever** |

Mo Xuan keeps tax **low in dormancy** — enough to feed arrays and the pit, not enough to **empty** the town. A **dead market** draws Heartlands curiosity.

### Clinic row (shadow pipeline **inside** the gorge)

Storefronts say **healing**, **herbs**, **mercy for widows**. Some are real; some are **intake**:

| Fiction | Plain meaning |
|---------|----------------|
| **Cold beds** | Room for “patients” who **never leave** the chart |
| **Night wagons** | Bundles rolled to **lower lanes** — linked to branch **kidnapping** on the outside ([`heavenly-demon-cult.md`](heavenly-demon-cult.md) — Longcheng **“Dr. Wen”** is the **outside** face of the same machine) |
| **No questions** | Refugee children **accepted** without papers — cult’s **favorite** stock for the tally stone |

New disciples are **not** mostly recruited by shouting in the market. They arrive **bound**, **sick**, or **promised** — then the terrace **roll call** happens **above** before most townsfolk admit what they saw.

### Day vs night (dormant era)

| | **Day** | **Night** |
|--|---------|-----------|
| **Market** | ~**one-third** stalls open; hagglers, water sellers, dice under awnings | **Lower lanes** brighter than the strip — **back-door** trade |
| **Shuttered** | ~**two-thirds** closed — war surplus, abandoned upper sheds | Some **reopen** for **private** business |
| **Cult** | Collectors in **twos**; clinics **quiet** | Deliveries; occasional **scream** swallowed by rock — locals **don’t** investigate |
| **Feel** | “Poor town in a bad canyon” | “Something still **eats** here” |

### Stories the town tells itself

- The **Heavenly Demon died** at Tianjing — **toast** to that at the tavern.
- The **copper mist** is a **curse**, not an array.
- The terrace **screams** are **wind** — except on intake nights, when everyone **locks** doors.

### Defenses (town layer)

The town is **not** a fortress wall — it’s **camouflage** and **eyes**.

| Piece | Role |
|-------|------|
| **Looks harmless** | Refugee slum **explains** smoke and population to distant scouts |
| **Lantern codes** | Roof patterns tell collectors **all clear** vs **stranger** vs **orthodox** |
| **Ladder alleys** | Hard to chase; locals **vanish** |
| **No banners** | Charter flyover **sees** poverty, not a sect HQ |
| **Mist Veil** (above) | Still dulls **long-range** sight — town sits in the **shadow** of it |

### Player / chronicle beats

| Beat | What happens |
|------|----------------|
| **Walk the market** | Joke about dead cult; **nervous** glance when you mention Tianjing |
| **Blood tax** | Witness collection — pay, hide, or intervene |
| **Clinic** | Mercy offer that’s **too** easy — moral fork |
| **Night lower lane** | See wagon or **bound** figures — terrace lights **flicker** above |
| **Local ally** | Rogue who **hates** the cult but **hates** the charter more |
| **Infiltrate deeper** | Earn trust, steal a **knock** code, or get **sold** on the list |

### Working names (stubs — rename anytime)

| Stub | Role |
|------|------|
| **Half-Copper Tavern** (半铜馆) | Rumors, cheap wine, “Demon’s dead” toasts |
| **Bone Dice Hall** (骨骰坊) | Rogues, debt, collector meets |
| **Mercy Alley clinics** (慈巷) | Clinic row — intake fiction |
| **Lower Lane stairs** | Bypass terrace; sneak or chase scene |

### Open (town only)

- [ ] **Blood tax** — ever **refused** successfully (one story arc)?
- [ ] Named **collector** NPC — feared face of the cult in town?
- [ ] Playable **hub** here vs **one-shot** investigate scene?

---

---

### Cauldron Lanes (鼎巷)

Full pass — **district 4 of 7**; first place the cult looks like a **real sect** after Bloodrift’s mask.

---

## Cauldron Lanes (鼎巷) — map & daily life

### What it is (one sentence)

The **industrial and military floor** of the gorge — channels, pill foundry, drill grounds, and a **monument to the Great Cauldron** — sitting **above** the **real** cauldron chamber that feeds the **pit** and array heart.

### Where the **real** Great Cauldron is (owner lock)

| | |
|--|--|
| **Location** | **Great Cauldron Vault** (镇教鼎窟) — **one level below** the inner end of the lanes, **against the pit wall**, **beside** the Demon Lord Pit offering chutes |
| **Not** | The statue in the lanes — that is **public face**; mass conversion happens at the **vault** |
| **Flow** | Tribute blood, war spill, failed merit → **vault cauldron** → **vein** + **pit** (founder’s feed) |
| **Who attends** | Hong Lian’s priests, pit attendants, Mo Xuan on rare rites — **not** market crowds |

### Entering from Bloodrift (first impression)

You leave the **lower ladders** — town noise **cuts off**. The gorge **opens** into a **work floor**: wider than the market, ceiling still cliff. **Black-and-crimson** uniforms. **Steam** from the foundry. **Boots** in step on the drill yard. No one jokes that the Demon is dead.

| Sense | Detail |
|-------|--------|
| **Sight** | **Channels** cut in stone, knee-deep runnels with dark flow; **banners** here (first in gorge) — crimson on black, **cauldron** emblem |
| **Sound** | Foundry hammers, **called numbers** on the drill field, low **hum** from deeper — array + real cauldron |
| **Smell** | Hot metal, **copper**, rendered fat — stronger than town |
| **Rule** | Town **plain clothes** end at the **Lane Gate** — beyond is **sect territory** |

### District map (working)

```text
        [ from Bloodrift lower ladders ]
                    |
            ┌───────┴───────┐
            |  LANE GATE    |  ← checkpoint; register; turn in blood tax crates
            └───────┬───────┘
                    |
    ┌───────────────┼───────────────┐
    |               |               |
 CHANNEL      MONUMENT          DRILL YARD
 PROMENADE    PLAZA             (东校场)
 (血渠廊)      (鼎神像广场)        |
    |          Great Cauldron     |
    |          STATUE only         |
    |               |               |
    └───────┬───────┴───────┬───────┘
            |               |
      PILL FOUNDRY     FIELD-RIG YARD
      ROW (丹坊街)      (旧鼎场) — war vats under tarps
            |               |
      BARRACKS ROW     SERVANT LIFT
      (内魔舍)          (血役井) — down only; horror beat
            |               |
            └───────┬───────┘
                    |
            DESCENT ROAD (行道)
                    |
         [ Inner Cauldron Hall ]
                    |
         [ Great Cauldron Vault ]  ← REAL 镇教鼎 · pit-adjacent
                    |
         [ Patriarch Court → Pit ]
```

### Sub-areas (what each is for)

#### Lane Gate (巷门)

- **Checkpoint** from town — **Core Demon** guards in uniform; **ledger** of who enters (envoys exempt with seal).
- **Deliveries** from shadow pipelines **logged** here before tally or foundry.
- Townsfolk **without** business **turn back** — or get **listed**.

#### Channel Promenade (血渠廊)

- Main **walk** along the **big** rock trenches — blood-qi and rendered runoff flow **toward** the vault / array.
- **Maintenance** crews in robes — scrape, patch, **test** flow (dormant: slow trickle, still never dry).
- **No personal cauldrons** — the **gorge channels** do the bulk work.

#### Monument Plaza — Great Cauldron **statue** (鼎神像广场)

- **Centerpiece of the lanes** — **not** the working vessel.
- **Statue:** bronze-black **cauldron** on a demonic **pedestal** (or **Heavenly Demon** cradling an **empty bowl** — owner pick); bowl **stained** dark; **faces down-gorge** toward vault + pit.
- **Use:** oaths for **Outer → Core** promotion; sermons; **fear** — “the real one drinks below.”
- **Offerings** here are **symbolic** (incense, small blood cups); **mass** offerings go to the **vault**.

#### Drill Yard (东校场)

- **Formation drill** — spears, palm arrays, **harvest** tag practice on dummies.
- **Dormant:** one cohort **most days**; war scale was **thousands**.
- Where players **believe** the cult could **face a charter column**.

#### Pill Foundry Row (丹坊街)

- **Small furnaces** — alchemists make **blood pills** for **issue**.
- **Issue window** — disciples collect **ration** by merit rank; **not** everyone owns a furnace.
- **Heat, smoke**, glass vials; **no** mass slaughter here — **refinement**.

#### Field-Rig Yard (旧鼎场)

- **Dao Wars** mobile harvest **vats** — **disassembled**, tarped, **rusted** pride.
- **Repair** when a branch wakes; otherwise **museum of the Great Draught**.

#### Barracks Row (内魔舍)

- **Core Demon** quarters — **uniforms** on hooks; **discipline** returns.
- **Outer Demons** **below** this rank usually **billet** nearer terrace/town unless promoted.

#### Servant Lift (血役井) *(optional horror)*

- **Freight lift / inclined chute** for **Blood Servant** labor and **waste** — **not** tourist.
- Connects to **lower** processing; most **player** stories **hear** it, don’t need a minigame.

#### Descent Road (行道)

- **Guarded** ramp to **Inner Cauldron Hall** → **Great Cauldron Vault** → patriarch → pit.
- **Hong Lian** or envoys **escort** only for the worthy / the doomed.

### Who you meet here

| Who | Role |
|-----|------|
| **Hong Lian** (红莲) | **Elder of the Cauldron** — splits time: **foundry + channels** in lanes, **array desk** in Inner Hall, **vault rites** at pit |
| **Foundry alchemists** | Pills, stabilizers |
| **Drill instructors** | Core Demon+ veterans |
| **Lane scribes** | Merit, issue ledgers |
| **Pit attendants** | Pass between vault and **chute** — **never** chat with juniors |

### Dormant today

| | |
|--|--|
| **Activity** | **Low** but **orderly** — one drill cohort, **trickle** in channels, foundry **half** fires |
| **Statue** | **Always** tended — oil on bronze, **fresh** stain in bowl (cult **wants** symbol alive) |
| **Vault** | **Closed** except tribute cycle + pit feed — **hum** felt on Descent Road |

### Player / chronicle beats

| Beat | Detail |
|------|--------|
| **Mask drops** | First **uniforms** and banners after Bloodrift |
| **Oath** | Hands on statue bowl — join or **fake** join |
| **Issue window** | Blood pill ration — merit check |
| **Descent** | Escorted toward **real** cauldron — hear **pit** before see it |
| **Wrong turn** | Servant lift — **rescue** or **moral** beat |

### Open (lanes only)

- [ ] Statue: **cauldron alone** vs **Demon cradling bowl**?
- [ ] Named drill instructor or foundry master NPC?
- [ ] Can player **see** vault cauldron without pit arc?

---

### Inner Cauldron Hall (内鼎殿)

| | |
|--|--|
| **Vibe** | Quiet **control room** after the lanes’ noise — stone desks, array **charts**, bronze **needles** in maps of the gorge |
| **Function** | **Blood Seal Grand Array** metering; **Descent Road** lock; scripts from Great Draught **archived** |
| **NPC** | **Hong Lian** (红莲) — primary desk; player quest giver at rep / infiltrate |
| **Not here** | The **physical** Great Cauldron — that is **vault** beside pit ([`blood-sealing-gorge.md`](blood-sealing-gorge.md) district map) |

### Patriarch Seal Court (魔印庭)

| | |
|--|--|
| **Vibe** | Clean **for a demon** — stone, few banners, **silence enforced** |
| **Function** | Mo Xuan’s **admin**; Great Withdrawal **seals**; branch **sleeper** signals in and out |
| **Access** | **Heavenly Demon Envoy**+; outsiders **die** or **serve** |

### Demon Lord Pit (魔主窟)

| | |
|--|--|
| **Vibe** | Vertical shaft beside the **Great Cauldron Vault** — air **thick**; bronze **glow** from cauldron bleed |
| **Layout** | **Vault lip** and **pit chute** share a chamber — offerings **hit cauldron first**, then **what the founder needs** descends |
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
| **Town** | Bloodrift Market — blood tax, clinic row, **“cult is dead”** joke |
| **Night lane** | Lower ladders — delivery, **list**, terrace light above |
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
