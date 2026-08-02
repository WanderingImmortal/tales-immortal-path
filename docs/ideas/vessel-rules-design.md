# Vessel Rules — design (oath, power, prevalence)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner workshop — 2026-08-02) |
| **Blocked on** | More rule defs; sect-assigned rules |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 |

**Code:** [`vessel-rules.js`](../../vessel-rules.js), `VESSEL_RULES` in [`data.js`](../../data.js). Taxonomy: [`law-taxonomy.md`](law-taxonomy.md) (personal oath). Sect fiction: [`body-path-sect.md`](body-path-sect.md).

## What they are (locked in code + taxonomy)

**Vessel Rules** are **one sworn physical oath** per cultivator — **self-imposed law of the flesh**, not cosmic Dao, not Weapon/Martial Intent, not charter law.

| Layer | Vessel Rule |
|-------|-------------|
| **Not** | Axis, Great Dao, basin statute, imperial charter |
| **Is** | **Personal oath** — will **bound** to a tempered vessel |
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

Power comes from **the vessel you already built** + **will locked into structure**:

```text
Temper flesh (chamber, realms)
    → swear oath (binds behavior)
    → flesh **reorganizes around the constraint**
    → payoff mechanics (bloodied, flow, soul contest/slip)
```

| Source | Role |
|--------|------|
| **Tempered body** | Prerequisite — swear gates at **vessel realm + layer %** (e.g. idx 2, 50% blood/bones) |
| **Will / oath** | The **binding** — you forbid default behavior (mend blood, freeze in form) |
| **Flesh response** | The **power** — alternate combat physics while oath holds |
| **Progression** | Living the oath in fights + chamber → 100% → interior peak |

**Genre line:** you don’t **gain** an external force — you **forbid** the flesh its default and **channel** what remains. Break the oath → flesh **recoils** (realm regress) — proof the power was **the bond**, not a loan.

**Contrast:**

| System | Power from |
|--------|------------|
| Weapon Intent | Qi + weapon category (dantian) |
| Martial Intent | Bodily enlightenment (fist) |
| Vessel Rule | **Self-binding** on tempered flesh |
| Blood demon **acts** | Stain, forbidden practice — separate |

Rule of Blood is **not** “evil physique” — it’s **oath**: blood serves flesh, not healing.

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
- [ ] Can NPC Saints bear **multiple** historical oaths (fiction) while player stays one?
- [ ] Interior peak without rule for **legendary physique** exception?
- [ ] Rule progression **required** for realm breakthrough or only perfect-cultivation lane?

## Implementation crumbs (later)

- Expand `VESSEL_RULES` roster + Vajra Ridge manual unlocks
- NPC veterans: “sworn Blood” / “broke Unnamed once” tags
- Chronicle: oath sworn / broken / completed
