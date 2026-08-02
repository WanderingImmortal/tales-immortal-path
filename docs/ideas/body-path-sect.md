# Body-path great sect (world NPC cultivators)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner brainstorm — 2026-08-02) |
| **Blocked on** | Body path depth pass (chamber, manuals, tribulation); lineage manual framework for body |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Mad Arhat character pass — owner workshop) |

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
| **Founder myth** | **Rib-Hammer Ancestor** (锻肋祖师) — mortal smith who hammered his own ribs into scripture; **not** the Mad Arhat — see spine section |
| **Public leader** | **Patriarch Bell Luo** (钟络) — Void Refinement; **old fox** — sees every scheme; **chooses** the fist; runs charters; rarely leaves the ridge |
| **Sect spine** | **The Mad Arhat** (疯罗汉) — **Saint** (Saintly Flesh); true name **Da Chi** (大痴) — *working*; soul of the fist |
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
| **Body** | **Saintly Flesh** | **Saint** (shorthand: **Saints**) | 圣 |
| **Soul** | *(TBD)* | Eternal Spirit (draft) | — |

Same **power band** at idx 8 — different **what you finished**. Qi ascends as **immortal** (仙); body **sanctifies flesh** — jianghu shorthand calls them **Saints** (圣), not immortals.

**UI note:** At capstone, “Saint” means **Saintly Flesh body cultivator** — not a generic moral label or qi-path title. Context disambiguates (cf. “Immortal” only attaching to 仙-tier figures).

### Generic — **Saintly Flesh** realm (owner lock)

**Default body-path capstone** — no monastery required.

| Use | Label |
|-----|-------|
| **Realm name** (idx 8 body, parallel to Immortal Ascension) | **Saintly Flesh** (圣体境) — *alt hanzi: 肉身圣境* |
| **Person title** | **Saint** (圣人 / 圣者) — jianghu shorthand: **Saints**; *not* “flesh saint” |
| **State** | Mortal cap stays **Indestructible Vajra** (金刚不灭); breakthrough = vessel **sanctified** |
| **Chronicle** | *“Broke through to Saintly Flesh — the jianghu calls him a Saint, not an immortal.”* |

Works for: Mad Monks, Sunscar warriors, blood conditioners, Dustbone grit, players who never join Vajra Ridge.

**Not generic defaults:** 金身, 罗汉, 金刚尊者 — Buddhist / Vajra Ridge lane.

### Buddhist variation — **Golden Body Arhat** + **Mad Arhat**

**Vajra Ridge / Vessel Canon only** — lineage honorific atop **Saintly Flesh**, not a separate realm index.

| Use | Label |
|-----|-------|
| **Formal epithet** (charter, inner court) | **Golden Body Arhat** (金身罗汉) |
| **Jianghu nickname** (spine) | **The Mad Arhat** (疯罗汉) — Mad Monk of Mad Monks |
| **Doctrine** | Same idx 8 band as **Saintly Flesh** — arhat idiom for monks who finished the vessel |

Breakthrough to **Saintly Flesh**; bell hall writes **Golden Body Arhat**; Heartlands file **Saint** — three strings, one cultivator.

### Code today (`PATHS.body`)

| Layer | Current code | Target (draft) |
|-------|--------------|----------------|
| Mortal ladder | Bronze Skin → … → **Indestructible Vajra** | Keep — top **mortal** body realm |
| Realm title at cap | **Vajra Immortal** in `titles[]` | Rename to **Saint** / **Saintly Flesh** when body ladder ships — *implementation later* |
| Post-Ascension sect epithet | — | Buddhist: Mad Arhat; generic: **Saint** |

Nine-realm alignment: idx 8 body = **Saintly Flesh** realm (not Immortal Ascension in body UI). See [`forging-equipment-tiers.md`](forging-equipment-tiers.md), [`nine-realm-ladder.md`](nine-realm-ladder.md).

### Sect spine — **The Mad Arhat** (疯罗汉) *(owner lean — 2026-08-02)*

**Soul of the fist** for Vajra Ridge. Patriarch Bell Luo runs the mountain so the **Saint** never has to read charter mail.

Link spine pattern: [`celestial-sword-sect.md`](celestial-sword-sect.md) (Sword Immortal + Yun Jian), [`golden-phoenix-sect.md`](golden-phoenix-sect.md) (Phoenix Immortal), [`frostbite-yin-sect.md`](frostbite-yin-sect.md) (Yin Maiden spine).

---

#### Founder vs Mad Arhat — **not the same person**

| Figure | Role | Culture |
|--------|------|---------|
| **Rib-Hammer Ancestor** (锻肋祖师) | **Founder myth** — mortal smith, no immortal patron; hammered ribs into first **Vessel Canon** lines | Ridge was **solemn** ascetics — bells, hardship, “pain is curriculum” |
| **Da Chi → Mad Arhat** | **Not founder** — arrived centuries later; became apex; **never left** | Turned the institution into what jianghu calls **Mad Monks** while charter still says **ascetic** |

Official history praises the Ancestor’s iron discipline. **Living culture** copies Da Chi’s laugh, his walk toward trouble, and Bell Luo’s leash. Young monks quote the founder in initiation; veterans quote **what the Mad Arhat did at Frost Gate**.

**Owner lock:** Mad Arhat **did not found** the sect — his **long stay** (post–Dao Wars Saint + ~two centuries of “still here”) **warped** a serious ridge monastery into a fight-happy great sect. Without him, Vajra Ridge might still be dour bell monks hired for escorts — **not** legends who wish the war never ended.

---

#### Who he is — **Da Chi** (大痴)

| Field | Value |
|-------|-------|
| **True name** | **Da Chi** (大痴) — “Great Fool”; only Bell Luo and inner vault records use it |
| **Epithet** | **Mad Arhat** (疯罗汉) — jianghu; **Golden Body Arhat** (金身罗汉) on bell-hall wall |
| **Title lane** | **Saint** (圣) — Saintly Flesh; registry does **not** call him immortal (仙) |
| **Realm** | **Saintly Flesh** — broke through **after** Dao Wars capitulation *(lean — see war section)* |
| **Age** | ~300 mortal years since ascension as Saint; looked **sixty** and **unfinished** even before — flesh that won’t settle |
| **Look** | Bald, barrel-chested, rope belt, **bare feet on granite**; grin before the punch; knuckles like worn river stone |

**Nature:** wildest **old fox** on the continent **without** fox patience — reads your trap in one glance, **still** walks toward your champion because impact is **honest**. Not stupid — **chooses** the fist when schemes would work but cost **years**.

**Doctrine (his):** technique is decoration; **tempered flesh expressing will** is the whole Vessel Canon. He is the living proof — no sword intent, no rebirth flame, just **a body that decided it would not break**.

**Pleasure:** a worthy hit — armor that **almost** hurts him, an expert who **almost** dodges, a war that **almost** justifies leaving the springs.

**Where he lives:** marrow hot springs and **bell vault** under the ridge — not sealed like Sword Immortal; **contained** by Vessel Rule oaths Bell Luo renews and by **trial-ground challengers** Bell feeds him so he does not walk south and restart the Gambit with his fists.

**Typical Bell Luo report:** three lines of charter news. Mad Arhat reply: *“Anyone good at the gate?”* or silence (= continue governing).

---

#### How he reshaped sect culture

| Before Da Chi (founder lane) | After Da Chi (Mad Monk lane) |
|------------------------------|------------------------------|
| Silence is virtue | Silence **until** the bell rings for spar |
| Escort = duty | Escort = **ticket to someone’s war** |
| Patriarch = grave elder | Patriarch = **fox who manages fight addicts** |
| Outer court fears shame | Outer court fears **boredom** more than bruises |
| “We temper flesh” | “We temper flesh — **then we test it on something**” |

**Vessel Rules** tightened under Bell Luo **because** Da Chi exists — never strike first, never kill after surrender, one life per contract. **Foxes write the rules; fools break them loudly; the Saint ignores rules that don’t interest him** until Bell Luo makes them interesting.

Every Mad Monk elder is a **fox** or a **fool** or both. Da Chi is the **template** elders secretly measure themselves against: *would the Arhat have walked into that?*

---

#### Dao Wars — sect + Mad Arhat personally

**Institution (public record):** held **Frost Gate corridor** and granite spine; licensed muscle for Lotus caravans, imperial forts, tribulation witness; **no southern land claim** at settlement.

**Mad Arhat (truth):** the war’s **golden age** — he was already **fight-mad inner-court elite** before capitulation, **not yet Saint**.

| Phase | Sect | Da Chi personally |
|-------|------|-------------------|
| **Early war** | Ridge arrays lock the **south road**; escort contracts fund the peak | Volunteers for **every** southbound contract that smells like battle — “witness tribulation” often means **stand near a fight** |
| **Mid war** | Shock squads of tempered adepts — quality flesh, small units | **Walked through flanks** for Lotus pay, Phoenix margins, imperial forts — **never** for Phoenix ideology; always for **the scrap** |
| **Northern spill** | Stops refugee sects **clogging** the spine (institutional buffer) | **Personally** cleared camps that blocked the bell road — palace heard the punching from Maiden Peak |
| **Half-Step** | Patriarch capitulates — **homeland intact** behind bell arrays | Da Chi **not** at Tian demonstration — was at Frost Gate **holding** against a retreating army that would have trampled the road |
| **After peace** | Charter recognition; Mad Monk veterans everywhere | Breakthrough to **Saintly Flesh** — first **Golden Body Arhat** of the modern ridge; **did not calm down** |

**Official minutes:** *“Solemn duty on the northern approaches.”* **Bath-house truth:** Da Chi fought **six** Heartlands skirmishes on escort papers that listed **one**.

**Why the sect survived:** arrays + **a monster** at the gate who **wanted** the war to come to him — armies learned routing through Frost Gate cost **bodies** even when they won.

**Player memory:** *“The bells held the gate. The maidens held the crown. The fool at the gate held **everything else**.”*

---

#### Yin Maiden Palace — neighbors on the spine *(owner lean)*

**Not allies. Not enemies. Complementary thermodynamics.**

```text
Frost Gate ── Vajra Ridge (yang heat, noise, fists) ── Yin Maiden Palace (yin stillness, subtraction)
```

| Layer | Dynamic |
|-------|---------|
| **Geography** | Only **sane road north** — ridge **south**, palace **crown**; must coexist or both lose trade and ward lines |
| **Doctrine** | Palace **subtracts** exposure; ridge **adds** impact — opposite cultivation weather |
| **Social** | Palace thinks monks are **loud, undignified, bad for yin**; ridge thinks palace is **all subtraction, no joy** |
| **Spine vs spine** | **Silent Moon Matriarch** (stub) finds Da Chi **exhausting** — yang noise on her slope; Da Chi finds her **no fun** — won’t fight him fairly, won’t host a good brawl |
| **Romance** | **None** — female-only inner court; professional only |

**Dao Wars cooperation (rare, tactical):**

| Contract | Who hired whom | Why |
|----------|----------------|-----|
| **Northern quell** | Palace **implicitly** benefited | Ridge **punched** sect camps palace didn’t want to touch — **yang noise** without yin experts spending silence debts |
| **One southbound retreat** *(parked beat)* | Ridge hired palace **concealment** | Da Chi’s squad came back **too visible** from a Heartlands fight — Maidens hid the retreat; ridge owes **one silence** (paid in marrow baths + bell ore — **not** marriage) |
| **Bleed-margin witness** | Joint caravans | Flesh endures edge wind; yin adepts **observe** tribulation — **back-to-back**, not mixed doctrine |

**Charter peace today:**

- **Mutual recognition** on spine — neither claims the other’s peak.
- **Case-by-case contracts** — escort, witness, concealment; no standing alliance.
- Palace envoys **never** dine in bell hall (too loud); ridge escorts **never** enter inner palace courts (yang policy).

**One line each:**

- Maiden envoy: *“Keep your fool below the crown line.”*
- Bell Luo: *“Keep your silence off our gate road.”*

**Player hook:** high rep on **both** factions reveals the **single unpaid silence** (or paid bath-house debt) between them — charter awkwardness if exposed.

---

#### Leadership table

| Role | Name | Realm | Notes |
|------|------|-------|-------|
| **Sect spine** | **Mad Arhat** / Da Chi (大痴) | **Saint** (Saintly Flesh) | Golden Body Arhat formally; contained in bell vault |
| **Patriarch** | **Bell Luo** (钟络) | VR peak | Fox administrator; **manages** the Saint |
| **Trial elder** | **Iron Han** (铁瀚) | NS | Player gate; wildest fox below Da Chi |
| **Founder (myth)** | **Rib-Hammer Ancestor** | Mortal legend | Not the Mad Arhat |

**Succession:** patriarch names heir from trial ground — **Da Chi does not inherit**; he **endures**. When he finally breaks (death, walk south, charter crisis), the Mad Monk culture **outlives** him — that’s Bell Luo’s real job.

---

#### Player beats

| Rep / beat | Who | Hook |
|------------|-----|------|
| **Outer gate** | Elder Iron Han | Spar, trial, “prove your flesh” |
| **High rep** | Patriarch Bell Luo | Charter witness, escort contract, **manage** Da Chi problem |
| **Rare apex** | Mad Arhat audience | *“You’re not strong enough to bore me. Come back when you hurt right.”* |
| **Dual rep** | Maiden + Ridge | Expose or settle the **one silence** between peaks |

**Parked greet (Mad Arhat):** *“Your bones are loud. Good. Hit me once — if I feel it, I’ll remember your name.”*


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
| **Yin Maiden Palace** | Neighbors — **oil and ice** | See [`body-path-sect.md`](body-path-sect.md) (Mad Arhat ↔ Maiden spine); one parked **silence debt**; joint Bleed witness |
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
- [x] Generic capstone: **Saintly Flesh** realm (圣体境); person shorthand **Saint** / **Saints** — not “flesh saint” (owner 2026-08-02)
- [x] Buddhist lineage epithet: **Golden Body Arhat** (金身罗汉); spine nickname **Mad Arhat** (疯罗汉)
- [x] Mad Arhat **not founder** — Rib-Hammer Ancestor myth; Da Chi reshaped culture (owner 2026-08-02)
- [x] Spine true name — **Da Chi** (大痴) working; epithet **Mad Arhat** (疯罗汉)
- [ ] Hanzi lock: **圣体境** vs **肉身圣境** for realm name
- [ ] Do they accept **mixed-path disciples** (qi outer, body inner) or body-only?
- [ ] Vessel Rule: sect assigns your rule, or you choose after trial?
- [ ] Market unlock: which martial techniques are Ridge-exclusive at launch?

## Implementation crumbs (later)

- `data.js` — `FACTION_DEFINITIONS`, `FACTION_NPCS`, `WORLD_LOCATIONS` HQ
- `docs/ideas/sect-faction-identities.md` — index row + fill template
- `cultivation-methods.js` — body `lineageId` when body manuals exist
- `sect-faction-identities.md` open question: “Are Heartlands sects qi-only?” → **mostly yes; Ridge is the exception elsewhere**
