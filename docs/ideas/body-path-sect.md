# Body-path great sect (world NPC cultivators)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner brainstorm — 2026-08-02) |
| **Blocked on** | Body path depth pass (chamber, manuals, tribulation); lineage manual framework for body |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Saintly Flesh realm — saints vs immortals) |

Parent index: [`sect-faction-identities.md`](sect-faction-identities.md). Body systems: [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md), [`soul-body-refining.md`](soul-body-refining.md). Qi sect peers: Heartlands four identity docs.

## Intent

The world today is full of **qi-path sects** — sword schools, flame calderas, trade lotuses, void archives. **Body cultivators exist as a player path** (realms, chamber, vessel rules, martial arts) but **nobody in the jianghu is visibly “the body sect.”** That gap makes body path feel like a solo hobby instead of a living tradition.

Add **one named great power** (or strong regional sect) whose **primary cultivation line is the vessel** — tempering flesh, bone, marrow — with culture, enemies, and a lineage manual hook when body manuals ship. Not implementation yet; this doc is the parking lot.

## Where things stand today

| Layer | Body path | Qi path (contrast) |
|-------|-----------|-------------------|
| Realms | Bronze Skin → … → Indestructible Vajra (`PATHS.body`) | Full ladder + chamber |
| World factions | None body-primary | Heartlands four + zone stubs |
| Techniques | Martial arts tagged `path: body` | Sword, flame, dao arts |
| Identity | Vessel Rules (Blood, Unnamed) | Weapon Intent, dantian seal |
| Manuals | Deferred in manuals framework | Lineage manuals in progress |

Every `FACTION_DEFINITIONS` entry is qi-leaning, trade, beast, or ascetic — **no “we forge the body” institution.**

## Design principle

A body sect is **not** “the combat faction” on the **qi** line — Celestial Sword and Phoenix own martial prestige there. The body sect’s identity is **the vessel as scripture** — pain as curriculum, oath as law, flesh as the cultivation base. They fight well because they **are** the weapon. **Mad Monks** are fight-happy **body** cultists, not sword-line duelists — different lane, different joke.

## Candidate: **Vajra Ridge Sect** (金刚岭宗) — **owner lean: lock**

Working name — matches end-realm **Indestructible Vajra** without sounding demonic.

**Owner lock (2026-08-02):** Frostbite’s **other Dao Wars survivor** beside Yin Maiden Palace — a **monk sect of body refiners** on the **southern** habitable spine (granite ridge above Frost Gate), not on the crown. Same great-sect weight class as the palace; **different lane** (flesh, escort, bell halls vs yin silence).

### At a glance

| | |
|--|--|
| **Official name** | **Vajra Ridge Sect** (金刚岭宗) — charter, imperial hire, patriarch’s letters |
| **Jianghu nickname** | **Mad Monks** (疯僧 / 疯子和尚) — *owner lean; hanzi TBD* |
| **Vibe** | **Paper ascetics, actual brawlers** — bells and marrow baths at home; on the road, **odd muscle-brained warriors** with battle-tempered bodies who **radiate toward a fight** |
| **Public face** | Silence, bell discipline, “we temper flesh in hardship” |
| **Truth** | **Lively sect** — they like fighting; Dao Wars were a **golden age** they’ll **never admit** on record |
| **Path** | **Body-primary**; qi used as fuel for tempering, not as the cultivation root |
| **Cultivation identity** | **Vessel Canon** (金刚体经) — layer-by-layer refinement (skin → bone → marrow) |
| **Sacred practice** | **Vessel Rules** — sworn physical oaths; outer court learns discipline, inner court swears one rule for life |
| **Homeland** | **Vajra Ridge** (金刚岭) — wind-scoured granite, hanging bell halls, marrow hot springs under the peak |
| **Founder myth** | A mortal smith who **hammered his own ribs into scripture** until heaven could not break him — no immortal patron at founding, which they still boast about |
| **Public leader** | **Patriarch Bell Luo** (钟络) — Void Refinement; **old fox** — sees every scheme; **chooses** the fist; runs charters; rarely leaves the ridge |
| **Sect spine** | **The Mad Arhat** (疯罗汉) — *working epithet* — **Immortal**; **soul of the fist** for the whole mountain; true name **TBD** |
| **Player-facing elder** | **Elder Iron Han** (铁瀚) — Nascent Soul; **wildest** of the old foxes on the trial ground; accepts worthy wanderers |
| **Primary lean** | **Fortification & escort** — ridge arrays, caravan muscle, border garrisons for hire |
| **Also has hands in** | Ore and beast-bone trade, medicinal baths, duel arbitration (“flesh decides”) |
| **What they teach** | Outer: stances, breath-for-stamina, bone conditioning · Inner: marrow arts, vessel rule rites · **Refuse:** sword intent, flame rebirth, void gates |
| **Forbidden apex** | *Stub* — blood-as-oath extremes, unnamed-rule mastery; **not** soul-into-body (that stays separate forbidden practice) |

### Personality — **Mad Monks** (owner lean — 2026-08-02)

**The name says ascetic. Everyone says Mad Monks.** Same institution — official registry vs jianghu nickname. Patriarch signs **ascetic** charters; caravan guards **whisper** “the mad ones are on this contract.”

| Layer | Beat |
|-------|------|
| **Temper** | **Fight-forward, not murder-forward** — they don’t hunt sport-kills or slaughter villages; if there’s a fight to be had, there’s **probably a monk nearby** |
| **Dao Wars** | **Thoroughly enjoyed it** — a continent of enemies to walk into; escort contracts were also **excuses to reach a battlefield**; veterans swap bath-house stories; **public minutes** say “we held the corridor in solemn duty” |
| **Body path fit** | Outer ranks: **some genuinely stupid** — all heart, no plan. Leaders: **none of them stupid** — among the **wildest old foxes** on the continent; they **don’t care for schemes** when they can **punch the problem** |
| **Leader lens** | Lotus matriarch **weaves**; Sword Immortal **waits**; Mad Monk patriarch **already saw your trap** and is walking toward your champion because **that’s faster** |
| **Contrast Yin Maiden** | Palace **subtracts** and calculates; ridge **adds heat** wherever two sides are already swinging — [`frostbite-yin-sect.md`](frostbite-yin-sect.md) |
| **Contrast Sword** | Sword Immortal **waits** for the perfect line; Mad Monk **asks** “is that guy armored enough?” |
| **Contrast Phoenix** | Phoenix wants **shock troops for ideology**; ridge monks will **punch alongside** anyone if the fight’s real — still refuse ash-rebirth dogma |

**Vessel Rules as leash:** oaths are how **sharp elders** keep **fight addicts** (and a few genuine dullards) from becoming a demon sect — e.g. never strike first, never kill after surrender, one life per contract. The **madness** is appetite; the **rule** is the chain. **Foxes write the rules; fools break them loudly.**

**Not blood demons:** mass slaughter and soul refining stay **acts** / forbidden lanes — Mad Monks are **oddballs**, not the evil physique embrace track.

## Body path — saint vs immortal (owner lean)

**Not locked in code yet.** Body techniques in the wild are **not** all Buddhist — blood arts, desert grit, war-god roar, generic tempering ([`data.js`](../../data.js) `path: body`). Naming splits **path** (saint vs immortal titles) and **tradition** (Buddhist arhat).

| Lane | Who uses it | Purpose |
|------|-------------|---------|
| **Generic body capstone** | **All body refiners** — player default, blood, desert, rogue manuals | **Saint** title lane — not 仙 immortal |
| **Buddhist lineage epithet** | **Vajra Ridge** — Vessel Canon, Mad Arhat spine | Doctrine flavor atop saint tier |

### Design rule — **saints ≠ immortals** (owner lock — 2026-08-02)

| Path | Capstone **realm** | Typical title | Tier word |
|------|-------------------|---------------|-----------|
| **Qi** (continent default) | **Immortal Ascension** | Immortal (剑仙, 凤凰仙…) | 仙 |
| **Body** | **Saintly Flesh** | **Flesh Saint** | 圣 |
| **Soul** | *(TBD)* | Eternal Spirit (draft) | — |

Same **power band** at idx 8 — different **what you finished**. Qi ascends as **immortal**; body **sanctifies flesh** and earns **saint** titles — not the jianghu’s usual 仙 label.

### Generic — **Saintly Flesh** realm (owner lock)

**Default body-path capstone** — no monastery required.

| Use | Label |
|-----|-------|
| **Realm name** (idx 8 body, parallel to Immortal Ascension) | **Saintly Flesh** (圣体境) — *alt hanzi: 肉身圣境* |
| **Person title** | **Flesh Saint** (肉身圣人) — rumor short: **体圣** |
| **State** | Mortal cap stays **Indestructible Vajra** (金刚不灭); breakthrough = vessel **sanctified** |
| **Chronicle** | *“Broke through to Saintly Flesh — a flesh saint, not an immortal.”* |

Works for: Mad Monks, Sunscar warriors, blood conditioners, Dustbone grit, players who never join Vajra Ridge.

**Not generic defaults:** 金身, 罗汉, 金刚尊者 — Buddhist / Vajra Ridge lane.

### Buddhist variation — **Golden Body Arhat** + **Mad Arhat**

**Vajra Ridge / Vessel Canon only** — lineage honorific atop **Saintly Flesh**, not a separate realm index.

| Use | Label |
|-----|-------|
| **Formal epithet** (charter, inner court) | **Golden Body Arhat** (金身罗汉) |
| **Jianghu nickname** (spine) | **The Mad Arhat** (疯罗汉) — Mad Monk of Mad Monks |
| **Doctrine** | Same idx 8 band as **Saintly Flesh** — arhat idiom for monks who finished the vessel |

Breakthrough to **Saintly Flesh**; bell hall writes **Golden Body Arhat**; Heartlands file **flesh saint** — three strings, one cultivator.

### Code today (`PATHS.body`)

| Layer | Current code | Target (draft) |
|-------|--------------|----------------|
| Mortal ladder | Bronze Skin → … → **Indestructible Vajra** | Keep — top **mortal** body realm |
| Realm title at cap | **Vajra Immortal** in `titles[]` | Rename to **Flesh Saint** / **Saintly Flesh** when body ladder ships — *implementation later* |
| Post-Ascension sect epithet | — | Buddhist: Mad Arhat; generic: **Flesh Saint** |

Nine-realm alignment: idx 8 body = **Saintly Flesh** realm (not Immortal Ascension in body UI). See [`forging-equipment-tiers.md`](forging-equipment-tiers.md), [`nine-realm-ladder.md`](nine-realm-ladder.md).

### Sect spine — **The Mad Arhat** (疯罗汉) *(stub)*

**Soul of the fist** for Vajra Ridge — every outer monk learns from stories of his punches; Patriarch Bell Luo exists so the **flesh saint** doesn’t have to read charter mail.

| | **Sword Immortal** | **Phoenix Immortal** | **Mad Arhat** *(stub)* |
|--|-------------------|---------------------|------------------------|
| **Title lane** | 仙 immortal | 仙 immortal | **圣** saint — **Golden Body Arhat** formally |
| **Epithet** | 剑仙 — line made law | 凤凰仙 — tired guardian | **疯罗汉** — joy in impact |
| **Dao Wars** | Dao Manifestation; **hid** in Seal Array | Knelt; brother ascended later | **Fought everywhere** — best years; elders **lie** in official histories |
| **After peace** | Sleeps in array core | Veto on existential war | **Still wants a fight** — Bell Luo + Vessel Rules keep him on the ridge |
| **Public face** | Forgotten true name | Younger brother patriarch | **Laughing old monk** who asks if your bones are interesting |
| **Power** | Immortal tier | Immortal tier | **Saintly Flesh** tier — **Golden Body Arhat** on the wall; registry says **flesh saint** |

**Spine sketch:**

- **Nature:** wildest old fox **without** the fox patience — already read your trap, **still** prefers to punch through it because the punch is **fun**.
- **Doctrine:** the fist is not technique — **tempered flesh expressing will**; Vessel Canon’s living proof.
- **Where he lives:** marrow hot springs / bell vault under ridge — not hiding like Sword Immortal; **contained** by oaths + patriarch’s carrots (“new challenger at the trial ground”).
- **Bell Luo reports** once per season; Mad Arhat’s reply is usually one word or a belch.

**Not stupid:** sharpest instinct on the mountain — **chooses** brawl over scheme; same tier as other sect spines.

**Player hook:** rep climb → Iron Han trials → rare **bell vault** audience — “You’re not strong enough to bore me. Come back when you hurt right.”

Link spine pattern: [`celestial-sword-sect.md`](celestial-sword-sect.md) (Sword Immortal + Yun Jian), [`golden-phoenix-sect.md`](golden-phoenix-sect.md) (Phoenix Immortal).

### Placement — **Frostbite south spine** (dual great sect)

Owner direction: outer zones get **great sect–tier peers** with their own stories. Frostbite holds **two survivors** from the Dao Wars — not one northern bloc:

| Band on spine | Institution | Tradition | Notes |
|---------------|-------------|-----------|-------|
| **Frost Gate margin** | Traders, chilly edge | — | Habitable south |
| **Granite ridge** (mid-south) | **Vajra Ridge** | **Body-refining monks** | **Southern** great sect — escorts, bell halls, marrow springs |
| **Last habitable crown** | **Yin Maiden Palace** | Peak Yin, female-only | [`frostbite-yin-sect.md`](frostbite-yin-sect.md) — **northern** peer on spine |
| **Scar margin → apex** | Sunless Scar | — | No sect HQ |

```text
Frost Gate → Vajra Ridge (body monks, south) → Yin Maiden Palace (crown) → Scar margin → Scar apex
```

- Homeland: **lower granite spine** — traders hear **bells** before the ice palace appears in cloud
- **Respected, not courted** — imperial hire for border muscle; Heartlands sects rarely invite them to votes
- **Regional great sect** — Dao Wars **survivor** with homeland intact; not a Heartlands “fifth petal”

### Dao Wars — hold the corridor, sell the fist (owner lean)

Different war posture from Yin Maiden — **visible muscle**, not silence ledger.

| Layer | What they did | Why |
|-------|---------------|-----|
| **Southern buffer** | Held **Frost Gate approaches** and granite spine — stopped armies and refugee sects from **clogging the only sane road north** | Ridge arrays + **flesh that doesn’t break in Bleed wind** |
| **Licensed muscle** | Escort contracts for Lotus caravans, imperial border forts, tribulation witness parties | **Monks for hire** — oaths, not marriage webs; **also** a ticket to someone else’s war |
| **Body-refiner exports** | Sent **small squads** of tempered adepts south when pay justified — shock infantry, array anchors, “walk through the flank” | Quality flesh; monks **volunteered** more than headquarters admits |
| **Secret truth** | Many deployments were **“find an enemy”** missions dressed as escort | **Enjoyed the Dao Wars** — never on charter record |
| **Settlement** | **Vajra Ridge recognized** — homeland behind bell arrays; **no southern land claim** | Same capitulation lane as palace: intact bastion, charter border |

**Contrast Yin Maiden:** palace **quelled north** around the crown and **small yin incursions** south; ridge **held the southern door** and sold **body expertise** outward. Both survived; neither ruled Frostbite as an empire.

**Player memory:** “The bells held the gate. The maidens held the crown. **The mad monks wish the war never ended.**”

### Relationships (sketch)

| Power | Relationship | Why |
|-------|--------------|-----|
| **Celestial Sword** | Respectful rivalry | Both love a straight fight — “your line vs our fist”; Sword **noble**, Mad Monks **gleeful** |
| **Jade Lotus** | Practical ties | Lotus hires ridge escorts; monks **tolerate** paperwork because it points toward trouble |
| **Void Temple** | Mutual disdain | Books vs bell halls — “read less, punch more” |
| **Golden Phoenix** | Uneasy kin | **Best war buddies**, worst peace neighbors — Phoenix wants ideology; monks want **a good scrap**; refuse ash renewal |
| **Yin Maiden Palace** | Neighbors on spine — **oil and ice** | Moon stillness vs fight-heat; hire each other for tribulation / Bleed-margin work; palace thinks they’re **loud**; ridge thinks palace is **all subtraction** |
| **Sunscar Clan** | Distant kin | Desert warriors respect pain; different religion |
| **Imperial court** | Licensed muscle | Border forts, tribulation guards — not dynasty marriage |

### Player hooks

- **Body-path player:** natural home — **Mad Monk** rep; lineage manual, martial set, vessel-rule mentorship, ridge trials, “find a fight” contracts
- **Qi-path player:** friction — outer conditioning allowed, inner court closed; or a long “prove your flesh” side arc
- **Found your own sect:** Vajra Ridge as template or rival once player sect systems deepen

### What they are *not*

- Not **blood demon sect** — fight-happy ≠ slaughter-happy; Vessel Rules + charter leash
- Not **beast tamers** — Emberwild owns primal communion; Ridge uses beast **bones** as material, not partners
- Not a **dojo in a city** — that's the FE school track; Ridge is a mountain institution

## Alternatives (parked names)

| Name | Pros | Cons |
|------|------|------|
| **Iron Scripture Hall** (铁经殿) | Clear “body as text” | Sounds smaller than great sect |
| **Myriad Tempering Peak** (万淬峰) | Evokes grind | Generic |
| **Bronze Bell Monastery** (铜钟寺) | Strong sound/ritual hook | “Monastery” overlaps Frostpeak |
| **War God's Remnant** (战神遗脉) | Matches mid-realm name | Too warlord, not ascetic |

## Prerequisites (before code)

- [ ] Owner picks **name, zone, and tier** (regional great vs Heartlands peer)
- [ ] Body path **manual / chamber** slice — at least one teachable lineage stub
- [ ] Identity doc v1 stable enough for `FACTION_DEFINITIONS` + one elder NPC
- [ ] Relationship pass with Heartlands four (one paragraph each in peer docs)

## Open questions

- [x] Zone: **Frostbite** — **southern** spine peer to Yin Maiden (owner 2026-08-02)
- [x] Tier: **great sect Dao Wars survivor** — monk body refiners (owner 2026-08-02)
- [x] Personality: **Mad Monks** nickname; ascetic official name; fight-forward not murder-forward (owner 2026-08-02)
- [ ] Nickname hanzi lock: 疯僧 vs 疯子和尚 vs 狂僧
- [x] Generic capstone: **Saintly Flesh** realm (圣体境); person title **Flesh Saint** — saints ≠ immortals (owner 2026-08-02)
- [x] Buddhist lineage epithet: **Golden Body Arhat** (金身罗汉); spine nickname **Mad Arhat** (疯罗汉)
- [ ] Hanzi lock: **圣体境** vs **肉身圣境** for realm name
- [ ] Spine true name (疯罗汉 is epithet only)
- [ ] Do they accept **mixed-path disciples** (qi outer, body inner) or body-only?
- [ ] Vessel Rule: sect assigns your rule, or you choose after trial?
- [ ] Market unlock: which martial techniques are Ridge-exclusive at launch?

## Implementation crumbs (later)

- `data.js` — `FACTION_DEFINITIONS`, `FACTION_NPCS`, `WORLD_LOCATIONS` HQ
- `docs/ideas/sect-faction-identities.md` — index row + fill template
- `cultivation-methods.js` — body `lineageId` when body manuals exist
- `sect-faction-identities.md` open question: “Are Heartlands sects qi-only?” → **mostly yes; Ridge is the exception elsewhere**
