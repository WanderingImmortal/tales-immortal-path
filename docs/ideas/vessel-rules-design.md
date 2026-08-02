# Vessel Rules — design (oath, power, prevalence)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner workshop — 2026-08-02) |
| **Blocked on** | More rule defs; sect-assigned rules |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Body Dao purview pass) |

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
| **Progression** | **Living** the oath in fights + chamber → 100% → interior peak |

**Genre line:** you don’t **gain** an external force — you **forbid** the flesh its default and **channel** what remains **inside Body Dao’s lane**. Break the oath → flesh **recoils** (realm regress) — proof the power was **the bond**, not a loan.

**Not cosmic Dao wielding:** Body Dao here is **Great Dao path purview** (like Sword Dao for sword cultivators), not axis apex or embodied Manifestation wearing the continent. Vessel Rule power is **personal oath nested under path** — see [`law-taxonomy.md`](law-taxonomy.md).

**Can of worms (parked):** dual-path cultivators, Saint vs Manifestation naming, whether every punch without an oath still “counts” as Body Dao — [`body-dao-design.md`](body-dao-design.md).

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

1. **Living the oath** — real fights, chamber weeks, not theater
2. **Rule progression** — 0→100% on that rule’s track
3. **Body Dao acceptance** — flesh and path **hold** the bond (break = regress)

So Da Chi’s “supreme Vessel Rule mastery” is **living an extreme channel deeply**, not picking the **meanest** text Bell Luo could write.

**Design guard:** future rules must pass **“can flesh reroute this?”** — charter suffering (never eat meat, never speak) fails unless tied to a **flesh default** Body Dao can redirect.

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

**Owner lean (current):** **No Yield** family for Da Chi apex — stubborn will as **oath**, not personality garnish. Unnamed remains strong **alternate** (technique vs will).

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
- [ ] Body Dao hanzi + whether oath ritual **names** the path aloud ([`body-dao-design.md`](body-dao-design.md))
- [ ] Can NPC Saints bear **multiple** historical oaths (fiction) while player stays one?
- [ ] Interior peak without rule for **legendary physique** exception?
- [ ] Rule progression **required** for realm breakthrough or only perfect-cultivation lane?

## Implementation crumbs (later)

- Expand `VESSEL_RULES` roster + Vajra Ridge manual unlocks
- NPC veterans: “sworn Blood” / “broke Unnamed once” tags
- Chronicle: oath sworn / broken / completed
