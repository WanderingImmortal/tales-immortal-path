# Vessel Rules — design (oath, power, prevalence)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner workshop — 2026-08-02) |
| **Blocked on** | More rule defs; sect-assigned rules |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Permeated stage workshop) |

**Code:** [`vessel-rules.js`](../../vessel-rules.js), `VESSEL_RULES` in [`data.js`](../../data.js). Taxonomy: [`law-taxonomy.md`](law-taxonomy.md) (personal oath under Body Dao purview). Cosmology stub: [`body-dao-design.md`](body-dao-design.md). Sect fiction: [`body-path-sect.md`](body-path-sect.md).

## What they are (locked in code + taxonomy)

**Vessel Rules** are **one sworn physical oath** per cultivator — **self-imposed law of the flesh**, not cosmic Dao, not Weapon/Martial Intent, not charter law.

| Layer | Vessel Rule |
|-------|-------------|
| **Not** | Axis, Great Dao, basin statute, imperial charter |
| **Is** | **Personal oath** — will **bound** to a tempered vessel, **sworn under Body Dao purview** (working title — see below) |
| **Payoff** | Combat + cultivation **behavior change** while oath holds; **rule settles into flesh** over time |

Oath text is flavor; mechanics are **constraints** (Rule of Blood: blood doesn’t mend; Rule of Unnamed: motion rule).

### Terminology — **Rule** vs **Law** (owner lock)

| Term | Use for | Avoid |
|------|---------|-------|
| **Rule** / **Vessel Rule** | Sworn oath on flesh; adherence stages | — |
| **Rule settled into flesh** | Adherence progression | “law settled into flesh” |
| **Law** | **Manifested Dao comprehension** — worn / embodied dao at Dao Manifestation (显法) | Vessel Rules, body chamber UI |
| **Adherence stages** | **Adhered** (first — locked) → Settled → Permeated → Surfaced → **apex** (*name open — not Rooted*) | “Manifest” stage; “Sovereign” stage; **Law** = manifested Dao only |

Writers: [`law-taxonomy.md`](law-taxonomy.md) **embodied dao** = Law. This doc = **Rule** on flesh only.

---

## Necessity — **optional oath, mandatory for interior peak** (owner lean)

| Player goal | Need a Vessel Rule? |
|-------------|-------------------|
| Body tempering, martial arts, Mad Monk fantasy | **No** — chamber layers, Martial Intent, techniques work without |
| Body-path **interior peak** (`hasVesselInteriorPeak`) | **Yes** — swear + **complete** rule progression (100%) |
| **Perfect Cultivation** on vessel focus | **Yes** — requires interior peak among other gates |
| Qi / soul focus | **No** — different interior peak tracks |

**Design intent:** Vessel Rules are **body-path identity depth**, not a hard gate to **start** body cultivation. Like Weapon Intent for qi — you can play without, but **serious** body endgame expects an oath.

**Vajra Ridge fiction:** outer court **discipline** without sworn apex oath; **inner court** swears one rule for life (sect assigns or trial chooses — open).

---

## Rarity — **uncommon in the world, common among committed body cultivators**

| Scope | Prevalence |
|-------|------------|
| **Continent** | **Uncommon** — most cultivators are qi-path; most body temperers never swear |
| **Dedicated body path** (mid realm+) | **Common** — oath is how you **specialize** the vessel |
| **Great sect inner court** (e.g. Vajra Ridge) | **Expected** — Bell Luo’s leash on fight addicts |
| **Rogue brawlers** | **Rare** — punch without philosophy |

**“Rare” socially:** one oath, hard to change — `release` = realm regress + **12-month** cooldown before another swear (`VESSEL_RULE_BALANCE`).

**“Common” institutionally:** Mad Monks **sound** lawless; inner ranks are **oath-bound** — Da Chi’s foxes write rules the fools break.

**In code today:** only **two** rules (`blood`, `unnamed`) — roster will feel **rare** until more ship.

---

## Where the power comes from (owner lean)

**Not heaven, not a fragment, not demon bargain.**

Power comes from **the vessel you already built** + **will locked into structure** + **Body Dao recognizing the sworn rule** on flesh ([`body-dao-design.md`](body-dao-design.md)):

```text
Temper flesh (chamber, realms) — already walking Body Dao purview
    → swear oath (binds behavior; witnessed under Body Dao)
    → flesh **reorganizes around the constraint**
    → payoff mechanics (bloodied, flow, soul contest/slip)
```

| Source | Role |
|--------|------|
| **Tempered body** | Prerequisite — swear gates at **vessel realm + layer %** (e.g. idx 2, 50% blood/bones) |
| **Will / oath** | The **binding** — you forbid default behavior (mend blood, freeze in form) |
| **Body Dao purview** | **Jurisdiction** — all body refining falls under Body Dao (working title); oath is **sworn to / under** that path, not to axis or charter |
| **Flesh response** | The **power** — alternate combat physics while oath holds |
| **Progression** | **Rule Adherence** — rule **settles into flesh** over time; Body Dao rewards/punishes; not intent-style meditation |

**Genre line:** the oath **adheres** to the body — power **unlocks from adherence**, not from resonating with a tool and imposing will on qi. Body Dao **witnesses**, **rewards**, and **punishes** the bond. Break gravely → path **recoils** (realm regress).

**Not cosmic Dao wielding:** Body Dao here is **Great Dao path purview** (like Sword Dao for sword cultivators), not axis apex or embodied Manifestation wearing the continent. Vessel Rule power is **personal oath nested under path** — see [`law-taxonomy.md`](law-taxonomy.md).

**Can of worms (parked):** dual-path cultivators, Saint vs Manifestation naming — [`body-dao-design.md`](body-dao-design.md). **Dao importance asymmetry** (alchemy / forging / body vs wield-only daos) — [`law-taxonomy.md`](law-taxonomy.md), not now.

**Contrast — not the same fantasy as Intent:**

| | Weapon / Martial Intent | Vessel Rule |
|--|-------------------------|-------------|
| **Home** | Dantian / trial impacts | **Flesh** — sworn oath |
| **Loop** | Meditate, resonate, **impose will on qi** (or fist) | Swear once; rule **sticks**; flesh **settles** around constraint |
| **Growth** | Explore weapon category; deepen / expand intent | **Live under the law** — chamber, combat, compliance, breach recovery |
| **Feel** | “I am learning what my sword can do” | “The law is **in** my body now” |
| **Power** | Qi (or marrow) **shaped** by comprehension | **Reroute** of flesh defaults Body Dao **holds** |

Rule of Blood is **not** “evil physique” — it’s **oath**: blood serves flesh, not healing.

---

## Restriction ≠ power magnitude (owner lock)

**Harsher restriction does not linearly mean stronger payoff.**

| Wrong model | Right model |
|-------------|-------------|
| “Suffer more → get more” | **Restriction defines the channel** — what flesh **reroutes** into |
| Arbitrary pain oaths | Oath must forbid something flesh **can** reroute (blood flow, motion fixation) |
| Rank rules by cruelty | Rank rules by **fit** to build + **depth of living** the oath |

| Rule (shipped) | Channel opened | Not “more powerful than” |
|----------------|----------------|--------------------------|
| **Rule of Blood** | Bloodied lane — blood doesn’t mend; combat under wound load | Unnamed |
| **Rule of the Unnamed** | Flow / motion — no frozen form; slip and unnamed movement | Blood |

**Magnitude** comes from:

1. **Living under adherence** — fights + chamber while oath holds (not meditation sessions)
2. **Adherence depth** — how fully the rule has **settled into flesh** (see below)
3. **Fulfillment track** — interior-peak gate (`progressionPct` in code today)

So Da Chi’s mastery is **apex adherence** — the rule is **how his flesh runs**, not a habit he checks.

**Design guard:** future rules must pass **“can flesh reroute this?”** — charter suffering fails unless tied to a **flesh default** Body Dao can redirect.

---

## Rule Adherence — own system (owner lean)

**Problem (owner):** swear once → adjust habits → **never think about it again**. Fine for a minor cultivator; **parlor trick** at Golden Body Arhat / Saint scale.

**Also:** adherence should **not** clone Weapon Intent — no “meditate on your rule,” no uses counter dressed as witness, no deepen/expand pick tree copied from dantian. Intent is **qi resonance + imposed will**; vessel rules are **rule adheres to flesh**.

### Core loop — adhesion, not exploration

```text
Swear oath (ritual months)
    → rule **adheres** to tempered flesh (Body Dao witnesses)
    → rule **settles into flesh** — passive + active adherence
    → power **unlocks from** how deeply the rule has permeated the body
    → breach → Body Dao sting / slip / regress
```

| Stage | Player / fiction feel |
|-------|------------------------|
| **Adhered** | Oath **sticks** — constraint live; base reroute (shipped blood / flow) |
| **Settled** | Rule **settled into flesh** — flesh **defaults** to oath, not memory |
| **Permeated** | Rule runs through marrow rhythm — combat expressions thicken |
| **Surfaced** | Rule **visible** outward — opponents feel it (slip, seal, unyielding press) |
| **Apex** *(name open)* | **Da Chi tier** — rule inseparable from flesh at depth; still not invincible |

**Apex stage:** name **after** all stages are defined — see what the ladder **leads to** first ([`vessel-rules-design.md`](vessel-rules-design.md) stage workshop).

**Working hanzi (*open*):** 附律 (Adhered) → 定律 (Settled) → 渗律 → 显律 → apex TBD.

**Not** Rooted for apex — reads like a **first**-stage metaphor. Apex naming parked until Permeated / Surfaced / finisher are designed.

### How adherence grows (distinct from intent `uses`)

| Source | Intent loop | Adherence loop |
|--------|-------------|----------------|
| **Chamber** | Minor / irrelevant | **Temper under oath** — weeks with rule active feed settlement |
| **Combat** | Technique uses → intent uses | **Compliance episodes** — bloodied wins, flow peaks, **rounds under pressure without breach** |
| **Cultivation UI** | Meditate / deepen / expand choices | **No meditate-on-rule** — optional **settling** during recuperate; **anniversary** of swear month |
| **Choices** | Deepen vs expand weapon expression | **Rule-specific milestones** — e.g. Blood: first seal vs hundredth bloodied fight; not generic deepen picks |
| **Failure** | Intent sleeps off-path | **Sting / slip** — Body Dao punishes **breach of sworn rule** |

**Fulfillment % (code today):** `progressionPct` 0→100% for interior peak. **Lean:** tie peak to **Settled** or **Permeated** **plus** fulfillment — not flat grind then autopilot. Post-peak, adherence can still climb toward Surfaced / apex stage for endgame.

### Body Dao enforces — reward and punishment

Power is **not** “I chose restriction therefore bonus.” The rule **adhered**; Body Dao **responds** when flesh honors or violates it:

| Event | Body Dao response | Feel |
|-------|-------------------|------|
| **Compliance** under pressure | Adherence deepens; new expression unlocks | Rule **rewarded** in flesh |
| **Settlement time** | Passive adherence tick (recuperate, oath-season chamber) | Rule **settles into flesh** |
| **Micro-breach** | **Sting** — debuff, adherence loss, 体道反噬 | Rule **noticed** |
| **Sustained breach** | **Slip** — adherence stage regresses | Punishment without full release |
| **Release / grave breach** | Realm regress + cooldown (shipped) | Bond **revoked** |

**Fiction:** cultivator may **not think** about the oath off-duty at **Settled+**. The rule is **already in the flesh** — like bone structure, not a mantra. Da Chi at apex adherence: engagement changes because **Unyielding is inseparable from his flesh**.

### Rule of Unyielding (不屈律) — stage catalog *(owner workshop)*

**Names:** **Rule of Unyielding** (primary); **No Yield** (shorthand). Da Chi’s apex rule.

**Oath flavor:** *“Defeat may come. Yield will not.”*

| Stage | Player (mechanics lean) | Da Chi (fiction) |
|-------|-------------------------|------------------|
| **Adhered** | See **below** — first stage after swear | Young war monk: reputation, not aura |
| **Settled** | Rule **settled into flesh** — flesh **defaults** to oath; passive combat support | See **Settled** section below |
| **Permeated** | Rule **permeates** marrow rhythm — first **outward** friction on foes / exchanges | See **Permeated** section below |
| **Surfaced** | Knocked down → must **rise** before fight “ends” for you | Opponents learn: put him **down**, not **out** |
| **Apex** *(name TBD)* | Battlefield rejects your **defeat-state** until flesh fails | Frost Gate; Golden Arhat scale — still not invincible |

#### Adhered — what it does (player + Da Chi)

**First stage immediately after swear completes.** Not a parlor trick at Da Chi’s **current** tier — he is at **apex adherence** (name TBD). At **Adhered**, the rule is **binding only** — modest payoff, heavy identity.

**Restriction (both):**

- **No voluntary yield** while **capable of answering**:
  - Block **Flee**, **Surrender**, **Concede**, voluntary combat exit
  - **Capable** = not incapacitated; HP above KO threshold; stamina can pay at least one **basic** attack or defend
  - **External halt** still works — Bell Luo’s order, tribulation end, environmental force-out, charter extraction
- Attempting yield → **Body Dao sting** (short debuff, adherence progress loss, combat log)

**Reward at Adhered (player — not zero-sum):**

| Payoff | Why |
|--------|-----|
| **Answer impulse** | After taking hit damage, next **basic** within 1–2 turns: small damage or stamina rebate — flesh **answers** before mind negotiates |
| **Morale lock** | Fear / morale “fight ends early” effects **ignored** — you don’t lose by **accepting** loss |
| **Compliance feed** | Each round **under pressure** (e.g. HP below 65% or outmatched tier) without breach → adherence + fulfillment ticks |
| **No aura tier** | No press, no DR, no domain — **restriction + answer twitch + grind lane** |

**Player who picks Unyielding at Adhered:**

- Signs up to **finish** fights — bad for skirmish / flee / retry play
- Strong for Mad Monk, intrusion, **bloodied** synergies, “stay in the loss” builds
- Early game feels **hard** — you **chose** the leash; payoff grows as rule **settles into flesh**
- Interior peak path opens via fulfillment + later stages — Adhered alone is **not** endgame power

**Da Chi at Adhered (historical — war monk era):**

- Jianghu learns: **he does not walk away** from a fight he could still throw a punch in
- You don’t “win” by him giving up — you must **put him down**
- Intrusion squads **stay** until both sides are stinging; he leaves **bored**, not **beaten**
- No battlefield physics yet — **behavior + reputation**; Bell Luo already calculating charter cleanup
- **Not** invincible — he **has** been knocked out; he just **doesn’t yield** first

**Contrast later stages:** Settled adds **flesh defaults** under stress; Permeated adds **enemy** stall; Surfaced adds **rise** obligation; apex adds **defeat-state** rejection. **Adhered** is **the oath bite** — Settled is **the rule living in the flesh without you managing it**.

#### Settled — what it does (second stage)

**After Adhered.** The rule is no longer only a **choice you enforce** — flesh **defaults** to it under stress. Player feel shifts from “I can’t flee” to “my body **doesn’t know how to quit**.” Still not aura-tier; still not Da Chi’s Golden Arhat scale.

**How you reach Settled (lean):**

| Gate | Lean |
|------|------|
| **Compliance** | N fights or **M rounds under pressure** without breach since swear (e.g. 8 fights or 40 pressure rounds — tune later) |
| **Chamber** | Weeks tempering **with oath active** (body chamber actions under rule) |
| **Fulfillment** | `progressionPct` ~40–50% — settlement and fulfillment **overlap** but aren’t identical |
| **Milestone fight** | Survive at least one fight you **lost** (incapacitated or ended externally) **without** attempting yield — Body Dao marks settlement |

**Slip back:** sustained breach from Settled → regress to **Adhered** (not full release). Sting at Settled still hurts adherence progress toward Permeated.

---

**Generic — all rules at Settled**

| Shift from Adhered | What changes |
|--------------------|----------------|
| **Passive default** | Rule runs in background — recuperate / travel don’t feel like “oath off” (flavor); combat **defaults** to compliance |
| **Sting softened** | Near-breach (UI hover on flee) warns before full sting — flesh **almost** slipped, Body Dao caught it |
| **Settlement ticks** | Recuperate + oath-month chamber weeks feed **Settled → Permeated** faster than Adhered grind |
| **Interior peak lean** | **Settled** is minimum adherence stage to **begin** counting toward interior peak (with fulfillment %) — Adhered alone is not enough for “rule settled into flesh” gate |

---

**Rule of Unyielding at Settled (player)**

Keeps **all Adhered** restrictions and payoffs. Adds:

| Payoff | Mechanic lean | Feel |
|--------|---------------|------|
| **Hold the line** | While **losing band** (HP ≤ 65% *or* stamina ≤ 40%): **~8–12% damage reduction** | Flesh **doesn’t collapse** when outmatched — you **stay** in the loss |
| **Stamina under pressure** | In losing band: stamina cost of **basics** −1 (min 1) *or* +small regen per round | Don’t **gas out** from panic while refusing to yield |
| **Answer impulse upgraded** | After taking hit damage: answer applies to **first basic or technique** once per fight (not only basic); slightly larger rebate | Flesh **answers harder** without you planning it |
| **Still not** | Enemy stall, must-rise, defeat-state rejection, DR outside losing band | No press — you’re **stubborn**, not **dominant** yet |

**Player fantasy at Settled:** fights you were **losing** become winnable through **attrition** — Mad Monk holding a corridor, bloodied builds stabilizing, intrusion squads that **don’t scatter**. Bad matchups hurt less; you’re still beatable if focused down.

**Da Chi at Settled (fiction — mid war career, pre-patriarch apex):**

- Holds skirmish lines **longer than charter math expects** — not because he’s stronger, because his flesh **doesn’t break** when outmatched
- War monks under him copy **behavior** (“don’t run when it still hurts”) — culture seed before full Mad Monk doctrine
- Bell Luo’s early notes: ridge casualties **lower** — monks get **put down**, not **routed**
- Jianghu: “hit him all you want — he **stays**” — still **no** battlefield aura; peers think it’s **stubborn marrow**, not law
- **Has** been knocked out — settlement isn’t invincibility; it’s **no rout**

---

**Other rules at Settled (sketch — for comparison)**

| Rule | Settled expression |
|------|-------------------|
| **Rule of Blood** | Bloodied state **stabilizes** — shipped bloodied DR becomes reliable; seal **backlash** chance reduced; wound load doesn’t spiral stamina |
| **Rule of the Unnamed** | Flow stacks **linger** 1 turn when you stop attacking; stagnation threshold +1 attempt before penalty |

---

#### Permeated — what it does (third stage)

**After Settled.** The rule **permeates marrow rhythm** — it runs through how you fight every round, not only when you’re losing. **First stage where the oath pushes outward:** opponents and exchanges start to **feel** friction. Still not aura-tier; still not a crazy power bump — the jump from Settled is **noticeable**, not **dominant**.

**How you reach Permeated (lean):**

| Gate | Lean |
|------|------|
| **Compliance** | At **Settled**, accumulate more pressure rounds / fights without breach (e.g. +30 pressure rounds or +6 clean fights beyond Settled gates) |
| **Chamber** | Continued tempering under oath; marrow-layer weeks start counting **double** toward adherence |
| **Fulfillment** | `progressionPct` ~70–80% |
| **Milestone fight** | **Long fight under pressure** — e.g. 8+ rounds in losing band in one engagement, win or lose, no yield attempt — rule **permeates** the rhythm of that grind |

**Slip back:** sustained breach from Permeated → regress to **Settled**. Harder to lose Permeated than Adhered, but slip still real.

**Interior peak lean:** **Permeated + ~100% fulfillment** can satisfy interior peak gate (alternative: Settled + 100% if owner wants earlier peak — open). Permeated = rule truly **through** the vessel, not just settled on it.

---

**Generic — all rules at Permeated**

| Shift from Settled | What changes |
|--------------------|--------------|
| **Marrow rhythm** | Rule colors **every exchange** — basics / chamber-tempered body stats subtly align with rule channel while oath holds |
| **Outward friction** | First tier where **foes or physics** notice — not self-only like Adhered/Settled |
| **Compliance weight** | Pressure-round compliance counts **double** toward Surfaced |
| **Fight length** | Build starts **extending** fights — attrition identity sharpens (by design) |

---

**Rule of Unyielding at Permeated (player)**

Keeps **all Adhered + Settled**. Adds:

| Payoff | Mechanic lean | Feel |
|--------|---------------|------|
| **Unyielding press** | When an enemy lands a **momentum hit** (heavy damage threshold, crit, or technique tagged as finisher) while you’re in **losing band**: enemy’s **follow-up tempo stalls** — no bonus chain turn, next hostile action **−15% damage** or **1-turn delay** on their combo | They **can’t close** on you cleanly — fight **drags** |
| **Contest on close** | Once per fight: when a hit would drop you **below** losing band from above it, trigger **soul contest** (lean on shipped contest %) — on success, hit **stalls** (damage still lands but momentum dies) | “Almost had him” becomes **almost** |
| **Enemy morale drag** | Foes with morale/momentum systems lose extra morale when a **stalled** exchange triggers | Intrusion fantasy — **frustration**, not fear |
| **Still not** | Must-rise after knockdown; defeat-state rejection; DR when winning; you **always win** | You’re **hard to finish**, not **hard to hit** |

**Power bump vs Settled:** Settled = **you** hold. Permeated = **they** can’t **cash in** — modest, but changes duel rhythm. Bad for burst-matchup **into** you; good for **third-party** brawls and wars of attrition.

**Player fantasy at Permeated:** intrusion squads, corridor holds, “we stunned both sides and left.” Duels against finishers (Phoenix palms, sword lines) **stall** instead of ending in three exchanges.

**Da Chi at Permeated (fiction — intrusion doctrine forming):**

- **Intrusion brawls** become signature — squads enter others’ battles, sting **both** lines, **withdraw before anyone wins cleanly**
- Charter complaints: ridge “**doesn’t finish fights**” — Bell Luo manages paper; Da Chi manages **training**
- Jianghu shifts from “he stays” to “he **ruins** fights” — neither side gets ledger clarity
- War monk recruitment **accelerates** — fight maniacs, not solemn ascetics
- Da Chi **personally** leads flank-breaking squads — Permeated press on a **patriarch-scale** body is why intrusions work without massacres
- Still **no** Golden Arhat aura — peers call it **madness**, not law; still knocked out in bad matchups

---

**Other rules at Permeated (sketch — for comparison)**

| Rule | Permeated expression |
|------|---------------------|
| **Rule of Blood** | Bloodied **damage bonus** more consistent; **seal** arms faster when bloodied; foes contest/slow on seal backlash |
| **Rule of the Unnamed** | Flow builds **+1 stack** on slip or peak flow turn; stagnation **clears** on flow win; enemies **slip** minor damage when you’re at flow cap |

**Contrast later stages:** Surfaced = rule **visible** (knockdown / rise); apex = **defeat-state** rejection. Permeated = **exchange friction** — the fight **won’t end on their terms**.

---

- **Not** an Intent panel reskin — separate **Vessel Rule / Adherence** readout in Body Chamber
- Show: rule name, **adherence stage**, fulfillment %, last sting/slip — not “uses: 47”
- Combat: compliance pulses, breach warnings — not intent-tier kill bonuses
- Chronicle: “Rule settled into flesh”; “Body Dao sting — nearly fled”
- Da Chi NPC: `adherence: apex` (name TBD), rule `unyielding` — not intent vocabulary

### Three body tracks (still separate)

| Track | Loop | Feel |
|-------|------|------|
| **Martial Intent** (武意) | Impact enlightenment | How the fist **learns** |
| **Rule Adherence** | Rule sticks; **settles into flesh** | How the body **is rule-bound** |
| **Chamber layers** | Layer tempering | How the body **is built** |

All under Body Dao purview; **three different growth verbs** — strike, adhere, temper.

---

Two layers — don’t collapse them.

| Kind | Who sets | Examples | Power |
|------|----------|----------|-------|
| **Charter / leash** | Bell Luo, sect trial | Never strike first; one life per contract; escort-only in Heartlands | **Social + charter** — break = expelled, not realm regress |
| **Apex sworn rule** | Disciple (or sect assigns one of **catalog**) | Rule of Blood, Rule of Unnamed, future combat rules | **Vessel Rule** — break/release = realm regress + cooldown |

Mad Monk fiction: outer court hears **leash**; inner court **must** swear one **apex** rule for interior peak. Bell Luo’s fox work is **aiming** brawlers with leash; Da Chi’s legend is **apex** rule lived at Saint scale.

---

## Da Chi — apex rule candidates (owner workshop)

Da Chi needs **one** apex sworn rule for fiction consistency (player may pick differently).

### Owner direction — “never considers himself defeated” (not “always wins”)

Da Chi is **not invincible** — he has **lost** fights, been knocked down, been outclassed. A literal **Rule of Victory** / “I must always win” **fails** fiction and mechanics (outcome oaths aren’t flesh-reroute channels).

**What works:** oath on **will state**, not **scoreboard**.

| Outcome oath (reject) | Will-state oath (lean) |
|-----------------------|------------------------|
| “I always win” | “I do not **yield** the fight” |
| Invincibility | **No concede, no voluntary retreat** while flesh can still answer |
| Deny he was ever beaten | Deny he **accepts** defeat as **his** end state mid-engagement |
| Capitulation never happened | **Bell Luo** capitulates the **sect**; Da Chi **holds the gate** — charter ends the war **around** him, not **inside** his fist |

**Genre line:** the Mad Arhat loses on the ledger like anyone — then grins and asks who’s at the gate. Defeat is **what happened**; yielding is **what he forbids**.

**Frost Gate fiction fit:** Half-Step Bell signs; Da Chi **does not walk away** from the line — he **stays** until flesh or charter **externally** stops the engagement. Saint breakthrough **after** capitulation = oath held through institutional loss without **personal** yield.

### Candidate rules (apex catalog)

| Rule idea | Oath shape | Fit to Da Chi |
|-----------|------------|---------------|
| **Rule of Unyielding** *(不屈律 — owner lean)* | Will does not **accept defeat** | Da Chi apex (name TBD); **Permeated** = intrusion doctrine era |
| **Rule of the Unbroken Step** | Foot does not **retreat** from a declared engagement; advance or hold | Fight-forward Mad Monk; intrusion brawls **push** lines |
| **Rule of the Answering Blow** | Never strike first; every hit taken must be **answered** at full force | Ethics lane — pairs with Unyielding |
| **Rule of the Unnamed** | Motion rule — no frozen technique; fist is not named form | Martial Intent doctrine; supreme **flow** — different channel than Unyielding |
| **Rule of One Exchange** | One exchange, then reset | Brawl aesthetic; less “undefeated will” |
| **Rule of Impact** | No mid-fight mend; must close | Survival channel |

**Owner lean:** **Rule of Unyielding** at **apex adherence** (name TBD) for Da Chi today. **Settled** was “holds the line” war era; **Adhered** is not his scale.

**Separate from leash:** Answering Blow may stay **Bell Luo charter**; Da Chi apex is **Unyielding**.

**Hanzi:** **不屈律** (*locked lean*) · 不认败 · 不退志 as flavor variants

---

## Payoff structure (shipped sketch)

| Phase | Player feel |
|-------|-------------|
| **Swear** | 6 months ritual; pick **one** rule forever (until release) |
| **Live** | Combat triggers progression (bloodied wins, flow, chamber actions) |
| **Complete** | 100% — “oath fulfilled in flesh”; unlocks interior peak |
| **Break** | Voluntary release — **punishing**; not a casual respec |

Rules are **build-defining** — Blood vs Unnamed = different combat rhythm — not a small perk.

---

## Vajra Ridge — institution vs rogue

| Court | Vessel Rules |
|-------|--------------|
| **Outer** | Stances, breath, Bell Trial — **no** apex oath required to hire out |
| **Inner** | **Must** swear — Bell Luo assigns or trial offers choice; oath is **leash** (never strike first, etc.) |
| **Da Chi** | Supreme **mastery** of oath-as-tool — ignores boring rules until Bell makes them interesting |

Sect **catalog** of allowed oaths (Blood, Unnamed, future “never strike first” charter-style rules) vs forbidden (unnamed-rule extremes, soul-into-body).

---

## Open questions

- [ ] Sect **assigns** rule vs disciple **chooses** after trial
- [ ] More rules: **pacifist** leash rules vs **combat** rules (Mad Monk charter)
- [ ] Lock Da Chi apex rule: **Unyielding** vs Unnamed / Answering Blow / Impact
- [ ] Lock **apex** name after Permeated / Surfaced / finisher are defined — not before
- [ ] Permeated thresholds vs Settled — tune pressure rounds / fulfillment %
- [ ] Interior peak at **Permeated + 100%** vs Settled + 100% — owner pick
- [ ] **Adherence** stage thresholds; merge vs separate `progressionPct`
- [ ] Body Dao **sting / slip** tuning — micro-breach vs release
- [ ] Per-rule **milestone** unlocks (not generic deepen/expand clone)
- [ ] Body Dao hanzi + whether oath ritual **names** the path aloud ([`body-dao-design.md`](body-dao-design.md))
- [ ] Can NPC Saints bear **multiple** historical oaths (fiction) while player stays one?
- [ ] Interior peak without rule for **legendary physique** exception?
- [ ] Rule progression **required** for realm breakthrough or only perfect-cultivation lane?

## Implementation crumbs (later)

- Expand `VESSEL_RULES` roster + Vajra Ridge manual unlocks
- **`RULE_ADHERENCE_STAGES`** in `data.js` — **not** `INTENT_TIERS` clone; `adherenceStage` + `adherenceProgress` on `G.vesselRule`
- `deepenAdherence()` from compliance / chamber-under-oath — **no** meditate-on-rule action
- `applyBodyDaoSting()` / `applyAdherenceSlip()` in `vessel-rules.js`
- Body Chamber UI lane — adherence readout separate from Martial Intent panel
- NPC veterans: adherence stage tags (“Settled Blood”, “Imprinted Unyielding” — apex name open)
- Chronicle: sworn / settled / sting / slip / apex-tier / broken
- `VESSEL_RULES.unyielding` — Rule of Unyielding; `RULE_OF_UNYIELDING_BALANCE` for Adhered payoffs
