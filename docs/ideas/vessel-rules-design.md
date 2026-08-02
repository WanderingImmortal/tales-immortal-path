# Vessel Rules — design (oath, power, prevalence)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner workshop — 2026-08-02) |
| **Blocked on** | More rule defs; sect-assigned rules |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Rule Adherence — own system, not Intent clone) |

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
| **Adherence stages** | Adhered → Settled → Permeated → Surfaced → Rooted | “Manifest” stage (realm 7 confusion), “Sovereign” stage (Nascent Soul Sovereignty) |

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
| **Rooted** | **Da Chi tier** — rule **rooted in flesh** at depth; still not invincible |

**Working hanzi (*open*):** 附律 → 定律 → 渗律 → 显律 → 根律 — UI English above.

**Not** Bond / Hold / Press / Rule Domain — Intent-domain vocabulary. **Not** “Manifest” adherence stage — **Law** / Dao Manifestation owns that word.

### How adherence grows (distinct from intent `uses`)

| Source | Intent loop | Adherence loop |
|--------|-------------|----------------|
| **Chamber** | Minor / irrelevant | **Temper under oath** — weeks with rule active feed settlement |
| **Combat** | Technique uses → intent uses | **Compliance episodes** — bloodied wins, flow peaks, **rounds under pressure without breach** |
| **Cultivation UI** | Meditate / deepen / expand choices | **No meditate-on-rule** — optional **settling** during recuperate; **anniversary** of swear month |
| **Choices** | Deepen vs expand weapon expression | **Rule-specific milestones** — e.g. Blood: first seal vs hundredth bloodied fight; not generic deepen picks |
| **Failure** | Intent sleeps off-path | **Sting / slip** — Body Dao punishes **breach of sworn rule** |

**Fulfillment % (code today):** `progressionPct` 0→100% for interior peak. **Lean:** tie peak to **Settled** or **Permeated** **plus** fulfillment — not flat grind then autopilot. Post-peak, adherence can still climb toward Surfaced / Rooted for endgame.

### Body Dao enforces — reward and punishment

Power is **not** “I chose restriction therefore bonus.” The rule **adhered**; Body Dao **responds** when flesh honors or violates it:

| Event | Body Dao response | Feel |
|-------|-------------------|------|
| **Compliance** under pressure | Adherence deepens; new expression unlocks | Rule **rewarded** in flesh |
| **Settlement time** | Passive adherence tick (recuperate, oath-season chamber) | Rule **settles into flesh** |
| **Micro-breach** | **Sting** — debuff, adherence loss, 体道反噬 | Rule **noticed** |
| **Sustained breach** | **Slip** — adherence stage regresses | Punishment without full release |
| **Release / grave breach** | Realm regress + cooldown (shipped) | Bond **revoked** |

**Fiction:** cultivator may **not think** about the oath off-duty. The rule is **already in the flesh** — like bone structure, not a mantra. Da Chi at **Rooted**: engagement changes because **Unyielding is rooted in his flesh**; not because he meditates on qi each morning.

### Rule of Unyielding (不屈律) — stage catalog *(owner workshop)*

**Names:** **Rule of Unyielding** (primary); **No Yield** (shorthand). Da Chi’s apex rule.

**Oath flavor:** *“Defeat may come. Yield will not.”*

| Stage | Player (mechanics lean) | Da Chi (fiction) |
|-------|-------------------------|------------------|
| **Adhered** | See **below** — first stage after swear | Young war monk: reputation, not aura |
| **Settled** | DR while “losing” HP band; morale/fear can’t end fight early | Holds lines longer than peers expect |
| **Permeated** | **Unyielding press** — enemy “winning” exchanges **stall** | Intrusion brawls: neither side finishes cleanly |
| **Surfaced** | Knocked down → must **rise** before fight “ends” for you | Opponents learn: put him **down**, not **out** |
| **Rooted** | Battlefield rejects your **defeat-state** until flesh fails | Frost Gate; Golden Arhat scale — still not invincible |

#### Adhered — what it does (player + Da Chi)

**First stage immediately after swear completes.** Not a parlor trick at Da Chi’s **current** tier — he is **Rooted**. At **Adhered**, the rule is **binding only** — modest payoff, heavy identity.

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

**Contrast later stages:** Settled adds **flesh** holding the line; Permeated adds **enemy** stall; Surfaced adds **rise** obligation; Rooted adds **defeat-state** rejection. Adhered is **the oath bite** — everything else is **rule settling deeper into flesh**.

### Player feel — own UI lane

- **Not** an Intent panel reskin — separate **Vessel Rule / Adherence** readout in Body Chamber
- Show: rule name, **adherence stage**, fulfillment %, last sting/slip — not “uses: 47”
- Combat: compliance pulses, breach warnings — not intent-tier kill bonuses
- Chronicle: “Rule settled into flesh”; “Body Dao sting — nearly fled”
- Da Chi NPC: `adherence: rooted`, rule `unyielding` — not intent vocabulary

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
| **Rule of Unyielding** *(不屈律 — owner lean)* | Will does not **accept defeat** — no surrender, voluntary retreat while capable of answering | Da Chi apex; **Rooted** adherence now; **Adhered** was young-war reputation |
| **Rule of the Unbroken Step** | Foot does not **retreat** from a declared engagement; advance or hold | Fight-forward Mad Monk; intrusion brawls **push** lines |
| **Rule of the Answering Blow** | Never strike first; every hit taken must be **answered** at full force | Ethics lane — pairs with Unyielding |
| **Rule of the Unnamed** | Motion rule — no frozen technique; fist is not named form | Martial Intent doctrine; supreme **flow** — different channel than Unyielding |
| **Rule of One Exchange** | One exchange, then reset | Brawl aesthetic; less “undefeated will” |
| **Rule of Impact** | No mid-fight mend; must close | Survival channel |

**Owner lean:** **Rule of Unyielding** at **Rooted** adherence for Da Chi today. **Adhered** Unyielding is **not** his current scale — parlor trick at Golden Arhat.

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
- [ ] **Adherence** stage names + thresholds; merge vs separate `progressionPct`
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
- NPC veterans: adherence stage tags (“Settled Blood”, “Rooted Unyielding”)
- Chronicle: sworn / settled / sting / slip / rooted / broken
- `VESSEL_RULES.unyielding` — Rule of Unyielding; `RULE_OF_UNYIELDING_BALANCE` for Adhered payoffs
