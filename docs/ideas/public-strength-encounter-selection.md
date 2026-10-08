# Public strength → who attacks you (integration hub)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Identity / dossier API ([`disguise-and-public-identity.md`](disguise-and-public-identity.md)); situation thread runtime ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)) |
| **Issue** | none yet |
| **Chat / PR** | design mesh 2026-10-08 |
| **Updated** | 2026-10-08 |

**Sisters:** [`enemy-tier-scaling.md`](enemy-tier-scaling.md) (place tiers & Redwell QC pools) · [`jianghu-situation-threads.md`](jianghu-situation-threads.md) (appetite & proxy sends) · [`disguise-and-public-identity.md`](disguise-and-public-identity.md) (known vs true) · [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) (grudge interrupts) · [`world-standing-and-property.md`](world-standing-and-property.md) (visibility / wealth) · [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) (peeling cover)

## Intent

Whether you get attacked — and **by whom** — should follow **what the jianghu thinks you are**, plus **who already has a debt** with you. Cultivation progress only changes random alley rolls when it becomes **public** (or when a fool misreads you). Peak QC in Redwell should feel **left alone**; early QC should see more **early/mid QC** trouble; a hidden FE should still get **QC-tier proxies** until someone updates the dossier.

This doc **meshes** scattered plans and code hooks into one pipeline. It does not duplicate full thread or disguise specs.

---

## What exists today (honest audit)

| Piece | Where | What it does | Feeds “who attacks”? |
|-------|--------|--------------|----------------------|
| **`G.fame`** | `core.js`, combat rewards, events | Renown tier (`getFameLevel`), NPC greet flavor (`npc-converse.js`: “rising name” at 20+) | **No** — not encounter rate or opponent tier |
| **`G.realmIdx` / `getRealm()`** | core, UI, zone “above station” | True cultivation | **No** for random `startCombat()` — only warnings |
| **`G.qcBand.stage`** | `qc-depth.js` | QC early/mid/late/peak progression | **No** for combat — Redwell **lord** flavor only |
| **Redwell lord / Well-Ring** | `qc-depth.js` | Sense of local FE ceiling, sash recognition | **No** combat gating |
| **impression / trust** | `npc-converse.js` | Per-NPC relationship | **Partial** — schemer/grudge **betrayal** setup only |
| **npc-betrayal ambush** | `npc-betrayal.js` | Named NPC strikes when `intent=pending` + **low HP/Qi** | **Named** only; chance not fame-aware |
| **npcKillLog** | combat kill recording | Last ~30 kills | **No** scheduler follow-up in code (threads doc assumes it) |
| **Fight / fight_seek** | `actions.js`, `world-clock.js` | Player seeks fight → `startCombat()` | **Random template** — ignores public strength |
| **Place tier design** | [`enemy-tier-scaling.md`](enemy-tier-scaling.md) | Where + tier pool | **Place only** — “player mirror” marked **later** |
| **Situation threads (design)** | [`jianghu-situation-threads.md`](jianghu-situation-threads.md) | Appetite, `getPlayerKnownRealmBand()`, proxy at **known+1** | **Not implemented** |
| **Disguise / ledger (design)** | [`disguise-and-public-identity.md`](disguise-and-public-identity.md) | Known vs true, signatures | **Not implemented** (`resolvePublicIdentity` missing) |
| **Grudge cultivate interrupt (design)** | [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) | Personal enemies interrupt | Picker **not** wired to thread engine yet |

**Verdict:** You planned the right pieces — **known band**, **appetite**, **place profiles**, **threads** — but **random combat is still blind**. Fame and QC band are **flavor**, not **selection**.

---

## Target: one encounter offer pipeline

Separate **(A) does anyone try?** from **(B) who is it?** from **(C) what tier/stats?**

```text
context (place, activity, depth)
    → resolveEncounterProfile(place)     … enemy-tier-scaling
    → rollEncounterOffer(dossier, threads, place)
           ├─ no offer (respect, law, low rate, player too big for place)
           └─ offer { source, attackerSpec }
    → resolveAttacker(attackerSpec)      … pool tier + qcStage + named NPC
    → buildEnemyFromDef / start NPC combat
```

| Stage | Question | Primary inputs |
|-------|----------|----------------|
| **Offer** | Does combat start at all? | Place `rateMult`, dossier **respect**, active **threads**, activity (cultivate interrupt vs explore) |
| **Attacker** | Anonymous punk vs named vs proxy? | Thread beat > grudge NPC > place pool |
| **Tier** | How strong are they? | Place tier band + **attacker qcStage/realm** — **not** player true power |

Player **true** realm still runs **your** damage/HP in fight; it must **not** inflate enemy stats (tier scaling doc).

---

## Public dossier (single save object — design)

Consolidate “what the world plans around” under e.g. `G.publicDossier` (name TBD):

| Field | Meaning | Initial / default |
|-------|---------|-------------------|
| **`knownRealmBand`** | Integer 0–6 or QC sub-band | Start = true band; drops if deep cover |
| **`knownQcStage`** | `early`/`mid`/`late`/`peak` when band=0 | Default from `G.qcBand.stage` when **public** |
| **`fame`** | Already `G.fame` — jianghu visibility | Keep global |
| **`localRenown`** | Per-zone optional (Redwell tournament, Well-Ring) | `{}` by zoneId |
| **`sectRolePublic`** | outer / inner / … on robe | From sect join |
| **`signatureHeat`** | Ledger aggregate — see disguise doc | `[]` / score |
| **`lastPublicFightAt`** | Months | For “recently humiliated them” threads |

**APIs (concept — implement with disguise slice A):**

| Function | Returns | Used by |
|----------|---------|---------|
| `getPlayerTrueRealmBand()` | `G.realmIdx` (+ qc stage if 0) | Combat stats, your UI |
| `getPlayerKnownRealmBand(zoneId?)` | dossier + cover + zone gossip | **Offer**, proxy picker, NPC planning |
| `getPlayerKnownQcStage()` | dossier or concealed | Redwell street pool |
| `bumpKnownBand(reason, incident)` | Updates dossier on **witnessed** reveal | Duels, tournament, peel |

Until APIs exist, **stub**: known = true (no concealment game).

---

## Respect & prey (anonymous offers — Redwell v1)

For **human-only urban** random brawls ([`enemy-tier-scaling.md`](enemy-tier-scaling.md)):

### Should a random fight be offered?

```text
offerChance = place.rateMult
            × activityMult
            × respectMult(knownBand, knownQcStage, place)
            × threadMult (≥1 if active vendetta)
```

**`respectMult`** (target feel):

| Player (known) | Redwell urban | Effect |
|----------------|---------------|--------|
| Early/mid QC | Core | ~1.0 — fair game |
| Late QC | Core | ~0.7 — fewer randos |
| Peak QC | Core | ~0.35 — mostly need **provocation** or thread |
| FE+ (known) | Core | ~0 — **no anonymous**; threads/events only |
| Any | Fringe | slightly higher than core |

Optional: **`localRenown.redwell`** (tournament top 3, lord audience) further slashes early/mid picking a fight with you.

### If offer succeeds — **who**?

1. **Active thread** with beat `spawn_hunter` / `grudge_interrupt` → **named or proxy** (threads doc).
2. Else **place pool** `redwell_street_humans`:
   - Weight **qcStage** (40/40/15/5) on **attacker**.
   - **`pickTargetFilter`**: attackers usually **same or lower** social rung unless `thread` or `provoked`:
     - Peak QC player → pool excludes early/mid unless drunk/event flag.
     - Early QC player → rarely spawn **peak** attacker (5% → consider **0%** without thread).

**Misread (later):** under deep cover, dossier says early QC while true FE → pool sends early QC; you stomp; thread may spawn **probe** beat ([`jianghu-situation-threads.md`](jianghu-situation-threads.md) underestimate moment).

---

## Named vs random (channel map)

| Channel | Trigger | Strength selector | Public strength role |
|---------|---------|-------------------|----------------------|
| **Random street** | Explore / travel roll in place | Place tier + qcStage weights | **respectMult** + pool filter |
| **Player Fight button** | `fight_seek` project | Place tier (or “seeking trouble” bump) | Optional: seek **equal** known band opponent |
| **Encounter overlay** | `ZONE_ENCOUNTERS` choice | Scripted `combatKey` | Authored |
| **Betrayal ambush** | Schemer/grudge NPC | NPC’s `realmBand` / stats | **Player weak** (HP/Qi), not fame |
| **Cultivate grudge interrupt** | Calendar + picker | Story/kill log NPC | Thread engine when live |
| **Clan proxy** | Thread beat | **knownBand + 1** | Core threads design |
| **Tournament / duel** | Event | Matched bracket | Updates dossier on public win |

---

## Event sources that update “known strength”

Without these, dossier stays frozen at true band and concealment never matters.

| Event | Update |
|-------|--------|
| Public duel / tournament placement | `knownQcStage`, maybe `knownRealmBand`, `localRenown` |
| Fight in market with witnesses | `signatureHeat`, optional band bump if you **revealed** |
| Spirit sense peel (consent or combat) | Observer’s **planning** band for org — [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md) |
| Sect promotion / robe | `sectRolePublic` |
| Chronicle / rumor beat | Fame, indirect renown |
| Deep cover maintained | Known band **lags** true |

---

## Build order (recommended mesh)

1. **`G.publicDossier` stub** + `getPlayerKnownRealmBand()` = true band (identity slice A wedge).
2. **`rollEncounterOffer()`** before `startCombat()` / explore combat — wire **respectMult** for Redwell only.
3. **Place profiles** + `redwell_street_humans` pool ([`enemy-tier-scaling.md`](enemy-tier-scaling.md)).
4. **Incidents + one thread template** (personal grudge → single hunter spawn) — [`jianghu-situation-threads.md`](jianghu-situation-threads.md).
5. **Grudge interrupt** reads active thread beat instead of ad hoc picker — [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md).
6. **Concealment** alters known band; proxies use known — disguise B/C.

---

## Open questions

1. **Fight button:** always random tier from place, or “seek match at known band”?
2. **Fame alone:** high fame + low band — do randos **challenge** you (fame seekers) or **avoid** (fear wrong target)?
3. **Redwell Well-Ring sash:** mechanical respect bump without changing realm band?
4. **Negative fame / reviled:** more ambushes even if band low?
5. **Single dossier vs per-faction** known band (clan thinks QC, street thinks peak)?

---

## Implementation crumbs (today’s files)

- Offer hook: `startCombat`, explore/travel rolls in `world.js`, `actions.js` `fight_seek`
- Dossier stub: `core.js` or new `public-dossier.js`
- Respect table: data next to `ENEMY_TIER_BALANCE` or Redwell pack
- Threads: `world-scheduler.js`, `G.situationThreads` (TBD), `npcKillLog`
- Betrayal: keep separate — relationship + **weak** gate; optionally add “won’t ambush if known band ≫ npc”
