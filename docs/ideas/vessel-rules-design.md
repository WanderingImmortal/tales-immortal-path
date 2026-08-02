# Vessel Rules — design (oath, power, prevalence)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner workshop — 2026-08-02) |
| **Blocked on** | More rule defs; sect-assigned rules |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Rule Wielding tiers; Body Dao enforcement) |

**Code:** [`vessel-rules.js`](../../vessel-rules.js), `VESSEL_RULES` in [`data.js`](../../data.js). Taxonomy: [`law-taxonomy.md`](law-taxonomy.md) (personal oath under Body Dao purview). Cosmology stub: [`body-dao-design.md`](body-dao-design.md). Sect fiction: [`body-path-sect.md`](body-path-sect.md).

## What they are (locked in code + taxonomy)

**Vessel Rules** are **one sworn physical oath** per cultivator — **self-imposed law of the flesh**, not cosmic Dao, not Weapon/Martial Intent, not charter law.

| Layer | Vessel Rule |
|-------|-------------|
| **Not** | Axis, Great Dao, basin statute, imperial charter |
| **Is** | **Personal oath** — will **bound** to a tempered vessel, **sworn under Body Dao purview** (working title — see below) |
| **Payoff** | Combat + cultivation **behavior change** while oath holds; progression to **interior peak** |

Oath text is flavor; mechanics are **constraints** (Rule of Blood: blood doesn’t mend; Rule of Unnamed: motion law).

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

Power comes from **the vessel you already built** + **will locked into structure** + **Body Dao recognizing the oath** as valid flesh-law within its lane ([`body-dao-design.md`](body-dao-design.md)):

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
| **Progression** | **Rule Wielding tiers** — ongoing compliance under Body Dao; not habit-lock after swear |

**Genre line:** you don’t **gain** an external loan — Body Dao **witnesses**, **rewards**, and **punishes** the bond. Break gravely → path **recoils** (realm regress). At apex tiers the rule is **wielded**, not remembered.

**Not cosmic Dao wielding:** Body Dao here is **Great Dao path purview** (like Sword Dao for sword cultivators), not axis apex or embodied Manifestation wearing the continent. Vessel Rule power is **personal oath nested under path** — see [`law-taxonomy.md`](law-taxonomy.md).

**Can of worms (parked):** dual-path cultivators, Saint vs Manifestation naming — [`body-dao-design.md`](body-dao-design.md). **Dao importance asymmetry** (alchemy / forging / body vs wield-only daos) — [`law-taxonomy.md`](law-taxonomy.md), not now.

**Contrast:**

| System | Power from |
|--------|------------|
| Weapon Intent | Qi + weapon category (dantian) |
| Martial Intent | Bodily enlightenment (fist) |
| Vessel Rule | **Self-binding** on tempered flesh |
| Blood demon **acts** | Stain, forbidden practice — separate |

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

1. **Living the oath** — witness events in real fights + chamber (not theater)
2. **Rule Wielding tier** — Body Dao **recognizes** depth; unlocks expressions (see below)
3. **Fulfillment track** — interior-peak gate (`progressionPct` in code today — may merge with tiers)

So Da Chi’s “supreme Vessel Rule mastery” is **Rule Domain** wielding — the oath is **ambient law**, not a habit he checks.

**Design guard:** future rules must pass **“can flesh reroute this?”** — charter suffering fails unless tied to a **flesh default** Body Dao can redirect.

---

## Rule Wielding — tiers of wielding the oath (owner lean)

**Problem (owner):** swear once → adjust habits → **never think about it again**. Fine for a minor cultivator; **parlor trick** at **Golden Body Arhat** / Saint scale. Da Chi’s No Yield can’t be “I don’t flee because I trained myself.”

**Fix:** parallel **Intent tier ladder** — one sworn rule, **ongoing wielding depth**, Body Dao as **active enforcer** (reward + punishment), not passive habit.

### Three body tracks (identity depth)

| Track | Home | Ongoing? | Player feel |
|-------|------|----------|-------------|
| **Martial Intent** (武意) | Fist enlightenment | Yes — uses / tiers | How the body **strikes** |
| **Rule Wielding** (持律 / 运律 — *hanzi open*) | Sworn Vessel Rule | Yes — witness / tiers | How the body **is bound** |
| **Chamber layers** | Tempering | Yes — layer % | How the body **is built** |

**Vessel Rules ≠ one-time perk.** Swear is **Bond** tier entry — not graduation.

### Wielding tier ladder (draft — mirror `INTENT_TIERS`)

| Tier | Witness threshold *(draft)* | Working name | Power feel |
|------|----------------------------|--------------|------------|
| 0 | 0 (swear) | **Bond** (立律) | Constraint live; base reroute (shipped blood/flow) |
| 1 | 10 | **Hold** (持律) | Body Dao **marks** compliance — small combat expression unlock |
| 2 | 30 | **Press** (压律) | Rule **presses** outward — enemies feel weight while oath channel active |
| 3 | 60 | **Manifest** (显律) | Rule **visible** in physics — slip, blood seal, no-yield press as **law**, not trick |
| 4 | 100 | **Rule Domain** (律境) | **Da Chi tier** — oath is **terrain**; still not invincibility |

**Witness events** (like intent `uses`): bloodied wins, seal uses, flow peaks, **compliance under pressure** (No Yield: rounds fought while losing HP band), chamber weeks under oath, **tier-up choice moments** (deepen / expand expression — mirror intent deepen/expand).

**Fulfillment % (code today):** `progressionPct` 0→100% for `hasVesselInteriorPeak()`. **Lean:** tie interior peak to **Hold** or **Press** tier **plus** fulfillment — not “100% bar then forget.” Post-peak, **wielding continues** toward Manifest / Domain for endgame body fantasy.

### Body Dao enforces — reward and punishment

Power is **not** “I chose restriction therefore bonus.” Body Dao **witnesses** and **responds**:

| Event | Body Dao response | Player feel |
|-------|-------------------|-------------|
| **Compliance** under pressure | Witness +; tier progress; unlock expression | Path **rewards** living the law |
| **Deepen / expand choice** | Permanent expression on this rule (mirror intent deepen) | Active cultivation, not autopilot |
| **Micro-breach** (attempt flee / concede under No Yield) | **Sting** — temp debuff, witness loss, combat log “体道反噬” flavor | Law **noticed** |
| **Sustained breach** | **Slip** — lose witness tier progress or drop one tier | Punishment without full release |
| **Voluntary release / grave breach** | Realm regress + 12mo cooldown (shipped) | Path **revokes** bond |

**Fiction:** cultivator may **not think** about the oath in daily life (Da Chi asks who’s at the gate). In **engagement**, Body Dao **enforces** — opponent feels **Press** at 30, **Domain** at 100. Habit is **outcome of** wielding, not **source of** power.

### No Yield at apex (Da Chi)

| Tier | No Yield expression |
|------|---------------------|
| Bond | Cannot voluntarily yield while capable — shipped flee/surrender block |
| Hold | Flesh **holds** line — damage reduction while “losing” on HP |
| Press | **Unyielding press** — enemies’ “winning” exchanges **stall** (soul contest lane) |
| Manifest | Knocked down **must rise** — rule re-asserts before fight can “end” in his mind |
| Rule Domain | Battlefield **rejects his defeat-state** until flesh **actually** fails — he still **can** be incapacitated; Domain ≠ always win |

Saint breakthrough **after** Frost Gate = wielding jumped — institutional loss **around** him, **Domain** still held on the line until charter halted engagement **externally**.

### Player anti-autopilot

- UI: rule name + **wielding tier** beside Martial Intent (not hidden after swear)
- Combat: witness ticks, sting/slip logs, tier-up **choice** prompts
- Chronicle: “Press tier under Rule of Blood”; “Body Dao sting — nearly fled”
- Da Chi NPC tag: `ruleWielding: domain` on No Yield — not `rule: noYield` alone

---

## Leash rules vs apex sworn rules (Vajra Ridge)

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
| **Rule of No Yield** *(owner lean — 2026-08-02)* | Will does not **accept defeat** — no surrender, no voluntary retreat while capable of answering | “Never considers himself defeated”; **has** been beaten; not invincible |
| **Rule of the Unbroken Step** | Foot does not **retreat** from a declared engagement; advance or hold | Fight-forward Mad Monk; intrusion brawls **push** lines |
| **Rule of the Answering Blow** | Never strike first; every hit taken must be **answered** at full force | Ethics lane — “you started it”; pairs with No Yield (answer until flesh stops) |
| **Rule of the Unnamed** | Motion law — no frozen technique; fist is not named form | Martial Intent doctrine; supreme **flow** — different channel than No Yield |
| **Rule of One Exchange** | One exchange, then reset | Brawl aesthetic; less “undefeated will” |
| **Rule of Impact** | No mid-fight mend; must close | Survival channel |

**Owner lean (current):** **No Yield** family for Da Chi apex — at **Rule Domain** wielding, not Bond-tier habit. Unnamed remains strong **alternate** (technique vs will).

**Scale check:** Bond-tier No Yield = parlor trick at Golden Arhat. **Rule Domain** No Yield = oath as **landscape** — still not invincible.

**Mechanics sketch (later):** while oath holds and HP/stamina allow — block **surrender / flee / concede** actions; payoff in **“losing” fights** (bloodied, outmatched) — flesh **reroutes** refusal-to-yield into combat physics, not guaranteed win. Fight ends when **incapacitated** or **external halt** (sect order, environmental), not when mind accepts loss.

**Separate from leash:** Answering Blow or “never strike first” may stay **Bell Luo charter**; Da Chi’s apex is **No Yield** — ignores boring leash until Bell makes it interesting.

**Hanzi candidates (*not locked*):** 不屈律 · 不认败 · 不退志

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
- [ ] Lock Da Chi apex rule: **No Yield** lean vs Unnamed / Answering Blow / Impact
- [ ] **Rule Wielding** tier names + witness thresholds; merge vs separate `progressionPct`
- [ ] Body Dao **sting / slip** tuning — micro-breach vs release
- [ ] Deepen / expand choice tree per rule (mirror `INTENT_EXPAND_ARTS`)
- [ ] Body Dao hanzi + whether oath ritual **names** the path aloud ([`body-dao-design.md`](body-dao-design.md))
- [ ] Can NPC Saints bear **multiple** historical oaths (fiction) while player stays one?
- [ ] Interior peak without rule for **legendary physique** exception?
- [ ] Rule progression **required** for realm breakthrough or only perfect-cultivation lane?

## Implementation crumbs (later)

- Expand `VESSEL_RULES` roster + Vajra Ridge manual unlocks
- **`RULE_WIELDING_TIERS`** in `data.js` — parallel `INTENT_TIERS`; `witnessUses` on `G.vesselRule`
- `grantRuleWitness()` / `applyBodyDaoSting()` / `applyRuleSlip()` in `vessel-rules.js`
- Tier-up choice UI — mirror intent deepen/expand prompts
- NPC veterans: wielding tier tags (“Press Blood”, “Domain No Yield”)
- Chronicle: oath sworn / sting / tier-up / broken / completed
