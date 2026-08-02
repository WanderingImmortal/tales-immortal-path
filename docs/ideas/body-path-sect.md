# Body-path great sect (world NPC cultivators)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner brainstorm — 2026-08-02) |
| **Blocked on** | Body path depth pass (chamber, manuals, tribulation); lineage manual framework for body |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Da Chi war-patriarch spine — owner workshop) |

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
| Identity | **Martial Intent** (武意) — **fist / unarmed only**; Vessel Rules | Weapon Intent (qi — tools + palm qi) |
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
| **Public leader** | **Patriarch Bell Luo** (钟络) — Void Refinement; Da Chi’s **war chancellor** → charter patriarch; old fox who **aims** the Saint |
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

**Vessel Rules as leash:** oaths are how **sharp elders** keep **fight addicts** from becoming a demon sect — power from **bound flesh under Body Dao purview**, not heaven ([`vessel-rules-design.md`](vessel-rules-design.md), [`body-dao-design.md`](body-dao-design.md)).

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

**Owner lock:** Mad Arhat **did not found** the sect. His **heyday is the Dao Wars era itself** — rising tensions through capitulation — not a post-war cultural afterthought. He **became leader early**, steered the temple toward **incursions for fights**, and **recruited maniacs** until the ridge became Mad Monks. Post-war he ascended **Saint**, stepped back; **Bell Luo** runs the charter; the culture **already** was his.

---

#### Rise — **fast at an ascetic temple** *(owner lean)*

Ascetic temples are **slow** by design — years at bell, marrow grind, Vessel Rule trials. Da Chi was **never slow** where it mattered.

| Mechanism | Beat |
|-----------|------|
| **Trial ground monster** | Won every **Bell Trial** (钟试) — **supreme body talent**; elders called him a fool because he **grinned** while winning, not because he **couldn’t** |
| **Pre-war border skirmishes** | Rising tensions = Bleed wind, refugee sects, Heartlands proxies probing north — temple needed someone at the **gate** who **wanted** to be there |
| **Heir lane** | Already **War Peak Elder** (战首) — patriarch’s fist; Bell Luo (then inner administrator) did paperwork |
| **Crisis acceleration** | When old patriarch **withdrew to marrow seclusion**, Da Chi was **acting patriarch** in all but charter signature — then **patriarch** once the Dao Wars proper began |

**Fast rise answer:** not corrupted asceticism — **war emergency** + **proof at the trial ground** + a grave patriarch who **preferred** the fool at the border over losing the ridge.

---

#### Who he is — **Da Chi** (大痴)

| Field | Value |
|-------|-------|
| **True name** | **Da Chi** (大痴) — “Great Fool”; only Bell Luo and inner vault records use it |
| **Epithet** | **Mad Arhat** (疯罗汉) — jianghu; **Golden Body Arhat** (金身罗汉) on bell-hall wall |
| **Title lane** | **Saint** (圣) — Saintly Flesh; registry does **not** call him immortal (仙) |
| **Realm (war)** | **Indestructible Vajra** peak — top mortal body; **not yet Saint** during most of the war |
| **Realm (now)** | **Saintly Flesh** — broke through **after** capitulation; then **retired** from patriarch duties to bell vault |
| **Age** | ~300 years since Saint breakthrough; looked **unfinished** even as patriarch — flesh that won’t settle |
| **Look** | Bald, barrel-chested, rope belt, **bare feet on granite**; grin before the punch; knuckles like worn river stone |

**Acts the fool — not an idiot.** Da Chi wears **Great Fool** (大痴) like a nickname the jianghu earned honestly: he laughs, he walks forward, he doesn’t perform cleverness. Under that:

| Gift | What it means |
|------|----------------|
| **Supreme body talent** | Among the continent’s **best living refiners** in war and now — marrow pace, tempering intuition, **Vessel Rule** mastery; Vessel Canon reads **easy** in his hands |
| **Stubborn will** | Will stat as doctrine — mind does not **yield** to pain, fear, or social pressure; schemes **bore** him before they fail |
| **Reads the room** | Sees traps, charter hooks, and assassination setups — **ignores** them when punching is faster |
| **Bell Luo’s leash** | Chooses **not** to be clever; Bell chooses **when** clever is mandatory |

**Not stupid. Not careless about survival.** He simply **does not care** to act intelligent when **walking toward the problem and fighting it** solves the week. Foxes (Bell Luo) exist because the sect still needs signatures.

**Doctrine (his):** technique is decoration; **Martial Intent** (武意) at ceiling — enlightenment of the fist through impact, not qi palm. [`body-martial-intent.md`](body-martial-intent.md).

**Pleasure:** a worthy hit — armor that **almost** hurts him, a line that **almost** cuts, a war that **almost** justifies leaving the springs.

**Where he lives (now):** marrow hot springs / **bell vault** — stepped back when Bell Luo became **charter patriarch**; Da Chi remains **spine**, not administrator. Bell Luo renews Vessel Rule oaths and feeds trial-ground challengers so he does not restart the Gambit with his fists.

**Typical Bell Luo report:** three lines of charter news. Mad Arhat reply: *“Anyone good at the gate?”* or silence (= continue governing).

**Apex sworn rule (owner lean — 2026-08-02):** **Rule of No Yield** family — will does not **accept defeat** (no surrender / voluntary retreat while flesh can answer). **Not** “always wins”: he **has** lost; oath binds **yielding**, not outcome. Frost Gate: Bell capitulates the **sect**; Da Chi **holds the line** until charter stops the war **around** him. Alternate: **Rule of the Unnamed** (motion). See [`vessel-rules-design.md`](vessel-rules-design.md).

---

#### How he reshaped sect culture — **during the war, not after**

Culture shift = **Da Chi’s leadership + recruitment** over a **long warring era**, not post-peace nostalgia.

| Era | Ridge culture |
|-----|---------------|
| **Pre-tension** (founder lane) | Solemn ascetics — bells, hardship, Rib-Hammer Ancestor stories |
| **Rising tensions** | Da Chi at gate; trial ground **selects for pain tolerance**; first **war monks** (战僧) |
| **Da Chi as patriarch** | **Incursion policy** — escort papers become **fight tickets**; intake favors **maniacs** who grin at the Bell Trial |
| **Long war** | Whole generations of **war monks**; outer court = brawlers; inner court = foxes who **aim** the brawlers |
| **Post–Saint** | Mad Monk identity **locked**; Bell Luo codifies Vessel Rules as **leash** on what Da Chi built |

| Before Da Chi | Under Da Chi (locked in by war’s end) |
|---------------|----------------------------------------|
| Silence is virtue | Silence **until** the bell rings for spar |
| Escort = duty | Escort = **ticket to someone’s war** |
| Patriarch = grave elder | Patriarch = **fox** (Bell Luo) who **aims** fight addicts |
| “We temper flesh” | “Temper flesh — **then test it on something**” |

**Recruitment (owner lean):** Bell Trial + **Border Month** — candidates who **flinch** wash out; candidates who **smile** when hit advance. Not everyone stupid; all **fight-forward**.

**War monk** (战僧) — temple term for incursion disciples; jianghu hears **Mad Monks** (疯僧).

---

#### Dao Wars — Da Chi as **war patriarch** *(owner lean)*

**Why the temple “joined”:** Da Chi **was leader** and **redirected** the institution toward fights **for his own interest** — while still doing real buffer work at Frost Gate. Official history blends both; bath-house says he **used** the temple as a **legion taxi**.

**Public record:** held **Frost Gate corridor**; licensed muscle; **no southern land claim** at settlement.

**Truth:** incursions, intrusion brawls, and a patriarch who **could not sit still** as tensions rose.

| Phase | Institution | Da Chi |
|-------|-------------|--------|
| **Rising tensions** | Still **solemn** on paper; first escort contracts | **War Peak Elder** → **acting patriarch** at the gate; volunteers for **every** skirmish |
| **Da Chi patriarch** | Policy shift — **incursion-first**; recruit fight maniacs | **Personally** sets “training” as **nearby wars** |
| **Intrusion doctrine** | **Flank-breaking monks** (拆偏战僧) — squads led into **other sects’ battles** | Beat **both sides** back **lightly** — confused, **enraged**, not ruined; **then leave** |
| **Long war** | Ridge = **regional nuisance** + **useful muscle**; Frost Gate still held | **Legion** jokes — hundreds of war monks **intruding** on “near enough” fights |
| **Half-Step** | **Bell Luo** (then chancellor) **capitulates** — Da Chi at Frost Gate, **not** charter table | Holds retreating army off the road while Bell signs |
| **After peace** | Mad Monk culture **already** set; veterans everywhere | **Saintly Flesh** breakthrough → **bell vault**; Bell Luo **patriarch** |

### Intrusion brawls — signature Da Chi move *(owner lean)*

Not assassination (Maidens). Not ideology (Phoenix). **Third-party chaos.**

```text
Sect A vs Sect B — valley, vein, grudge
    → Vajra war monks **intrude**
    → Push both lines back **hard enough to sting**, not enough to collapse
    → Withdraw before anyone agrees who “won”
    → A and B **both** furious, **light** casualties, **no** clear ledger entry
```

| Design beat | Why it works |
|-------------|--------------|
| **Low losses** | Vessel Rules + Da Chi **likes** repeat customers — dead sects don’t brawl twice |
| **Confusion** | Charter courts **hate** this — “who violated border?” “who hired monks?” |
| **Da Chi joy** | **Two** sides to hit; **no** paperwork if Bell Luo can’t find him |
| **Contrast Yin Maiden** | Palace **small yin circles**, silence ledger, **surgical** — ridge **loud**, **intrusive**, **absurd** |

**Heartlands memory:** *“The mad monks didn’t pick a side — they picked **everyone**.”*

**Northern memory:** *“The bells held the gate. The maidens held the crown. The fool **intruded** on wars he wasn’t invited to.”*

**Why settlement still worked:** arrays intact; Da Chi **useful** at Gate; Bell Luo **negotiable**; intrusion victims mostly **mid sects** without charter pull — great powers **embarrassed**, not **broken**.

### Heartlands lines — **no taboo, plenty of friction** *(owner lean)*

Da Chi and Bell Luo **never** made **overt charter taboo** moves against the Heartlands **four great sects** — no massacres on Lotus land, no Void archive raids, no Phoenix caldera strikes, no Sword Sepulcher desecration. Bell’s fox work **kept** the ridge **hireable**, not **eradicable**.

**What Da Chi did instead:** fight **near** great powers, **intrude** on their **proxies and expansion lanes**, and **spar** where honor allowed — annoying, memorable, **not** casus belli.

| Great sect | Da Chi / Mad Monks during Dao Wars |
|------------|-----------------------------------|
| **Celestial Sword** | **Fought quite a bit** — border duels, escort disagreements, intrusion brawls that **stung Sword lines**; Da Chi **loves** a straight fight; Sword elders **respect** the fist, **loathe** the chaos. **No** Sepulcher taboo — see [`celestial-sword-sect.md`](celestial-sword-sect.md) |
| **Golden Phoenix** | **Annoyed expansion** — Phoenix pushing north/east for flame jurisdiction; Mad Monk **intrusions** broke Phoenix **momentum** (both sides pushed back, Phoenix couldn’t **claim** a clean win); **ideology refused**, scraps **accepted**. Phoenix pamphlets call them **charter vermin** |
| **Jade Lotus** | **Hired** often — Lotus paperwork **points** at trouble; monks tolerate it; intrusion brawls sometimes **helped** Lotus clients **by accident** |
| **Void Temple** | Mutual disdain — Da Chi doesn’t raid seals; Void doesn’t lecture **successfully** |

**Sword vs fist (parked beats):**

- Da Chi and **Sword peak elders** traded **border months** — not charter duels, **honor spars** that escalated when neither would yield ground.
- Intrusion squads **stung Sword-affiliated** columns more than once — Sword Immortal **did not** leave the array for a fool; **Yun Jian** aged faster from the reports.
- Post-peace: **respectful rivalry** — “your line vs our fist”; Sword **noble**, Da Chi **gleeful**.

**Phoenix vs mad monks:**

- Phoenix **expansion** needed **clean victories** — Da Chi’s doctrine produces **muddy** battles and **enraged neutrals**.
- **Realm Reforge** (界炉) fantasies hate third parties who **won’t stay dead** and **won’t pick a side**.
- Phoenix Immortal’s younger brother **knew** the monks weren’t worth immortal war — **exhausting**, not existential.

**Player hook:** high Sword rep + Ridge rep unlocks **veteran spar stories** — same fight, two scripts (Sword honor vs Mad Monk bath-house).

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
| **Northern quell** | Palace **implicitly** benefited | Ridge **punched** northern camps; Da Chi’s **intrusion squads** sometimes drifted **too north** — Maiden Peak heard brawls that weren’t “invited” |
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
| **Sect spine** | **Mad Arhat** / Da Chi (大痴) | **Saint** (Saintly Flesh) | War **patriarch** during Dao Wars; now bell vault |
| **Patriarch** | **Bell Luo** (钟络) | VR peak | Da Chi’s **war chancellor** → charter patriarch after Saint breakthrough |
| **Trial elder** | **Iron Han** (铁瀚) | NS | War-monk generation; player gate |
| **Founder (myth)** | **Rib-Hammer Ancestor** | Mortal legend | Not Da Chi |

**Succession:** Da Chi **did** hold patriarch title in war — then **gave** charter face to Bell Luo when he broke through Saint and **would not** sit at tables. Da Chi **endures** as spine; Bell **governs**.

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

### Dao Wars — hold the corridor, **intrude on the war** (owner lean)

Da Chi **was patriarch** for most of the war — institution joined because **he led it toward fights**. Buffer duty at Frost Gate was **real**; **intrusion brawls** were **policy**.

| Layer | What they did | Why |
|-------|---------------|-----|
| **Southern buffer** | Held **Frost Gate** — spine arrays, Bleed wind | **Necessary** — trade road north |
| **Incursion policy** | Escort contracts + **volunteer** southbound squads | Da Chi’s **fight tickets** |
| **Intrusion brawls** | **Flank-breaking war monks** into **nearby sect wars** — sting both sides, withdraw | Da Chi’s **favorite training**; charter nightmare |
| **Recruitment** | Bell Trial selects **fight maniacs**; generations of **战僧** | Culture **locked** before peace |
| **Settlement** | Bell Luo capitulates; ridge recognized; **no land claim** | Da Chi at Gate; **not** at Half-Step audience |

**Contrast Yin Maiden:** palace **surgical** small incursions + silence ledger; ridge **loud intrusion** + confused enemies.

**Player memory:** *“They didn’t pick a side. They picked **everyone**. The bells held the gate anyway.”*

### Relationships (sketch)

| Power | Relationship | Why |
|-------|--------------|-----|
| **Celestial Sword** | **Fought often** — border spars + intrusion stings; respect + loathing; **no** Sepulcher taboo | Da Chi **wanted** their line; Sword wanted **clean** war |
| **Jade Lotus** | Practical ties | Lotus hires ridge; paperwork points toward trouble |
| **Void Temple** | Mutual disdain | Books vs bell halls |
| **Golden Phoenix** | **Expansion nuisance** | Intrusion brawls **broke Phoenix momentum** north; ideology refused, scraps taken |
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
- [x] Da Chi **war patriarch** — rise in rising tensions; intrusion doctrine; culture shift **during** war (owner 2026-08-02)
- [x] Bell Luo — war chancellor → patriarch after Da Chi’s Saint breakthrough
- [x] Spine true name — **Da Chi** (大痴) working; epithet **Mad Arhat** (疯罗汉)
- [ ] Hanzi lock: **圣体境** vs **肉身圣境** for realm name
- [x] Da Chi — **supreme body talent**, stubborn will; fool **act**, not idiot; no great-sect taboo (owner 2026-08-02)
- [ ] Named **Sword border month** or Phoenix **intrusion** incident for chronicle hook
- [ ] Vessel Rule: sect assigns your rule, or you choose after trial?
- [ ] Lock Da Chi apex rule: **No Yield** lean vs Unnamed / Answering Blow
- [ ] Market unlock: which martial techniques are Ridge-exclusive at launch?

## Implementation crumbs (later)

- `data.js` — `FACTION_DEFINITIONS`, `FACTION_NPCS`, `WORLD_LOCATIONS` HQ
- `docs/ideas/sect-faction-identities.md` — index row + fill template
- `cultivation-methods.js` — body `lineageId` when body manuals exist
- `sect-faction-identities.md` open question: “Are Heartlands sects qi-only?” → **mostly yes; Ridge is the exception elsewhere**
