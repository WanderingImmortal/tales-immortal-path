# Public strength → who attacks you (integration hub)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Identity / dossier API ([`disguise-and-public-identity.md`](disguise-and-public-identity.md)); situation thread runtime ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)) |
| **Issue** | none yet |
| **Chat / PR** | design mesh 2026-10-08 |
| **Updated** | 2026-10-09 (fame facets, cover in combat, Well-Ring sash) |

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
| **Fight / fight_seek** | `actions.js`, `world-clock.js` | Player seeks fight → `startCombat()` | **Random template** — ignores public strength; **replacing** with bounty board (other agent) — not spec’d here |
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
| **`fame`** | Scalar `G.fame` today — UI tier only | Migrate toward **facets** (below) |
| **`fameFacets`** | What you’re known **for** — drives challenge *why* and open vs shadow | `[]` or map by facet id |
| **`localRenown`** | Per-zone optional (Redwell tournament, Well-Ring board rank) | `{}` by zoneId |
| **`affiliationTags`** | Visible institutions (e.g. `well_ring_outer`) | From join state / robe |
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

## Fame is not one number (facets)

Scalar **`G.fame`** stays useful for UI bands (`getFameLevel`) and coarse gates (recruits, market). **Encounter logic** should read **`fameFacets`** — each entry is “the jianghu repeats this story about you.”

### Facet shape (concept)

| Field | Purpose |
|-------|---------|
| `id` | e.g. `duelist`, `demon_slayer`, `pill_guild_friend`, `public_humiliator`, `thief`, `well_ring_board`, `sect_enemy`, `mercy`, … |
| `heat` | 0–100 — how loud this story is **right now** |
| `zoneSpread` | `local` · `zone` · `continent` |
| `sinceMonths` | Decay / stale rumors |
| `linkedOrgId` / `linkedNpcUid` | Optional — ties to **grudge threads** |

**API:** `addFameFacet(id, delta, { zoneId, incidentId, public: true })` — combat wins, tournament, thread beats, jobs. Scalar fame can remain `sum(facets)` or separate “visibility” — owner call later.

### How facets change **offers** (not just rate)

Same high visibility, different behavior:

| Facet (hot) | Typical challenger | Modality lean | Tie-in |
|-------------|-------------------|---------------|--------|
| **`duelist` / tournament** | Fame-seekers, outer disciples | **Open** — letter, public challenge, board post | Bounty board (future) |
| **`demon_slayer` / beast_hunter`** | Beast hunters, jealous rivals | Open in field; less in city core | Place kind weights |
| **`public_humiliator`** (you shamed someone) | Victim’s house | **Shadow** first — thread [`jianghu-situation-threads.md`](jianghu-situation-threads.md) | Incident → thread, not random |
| **`thief` / `robber`** | Victims, law, schemers | Ambush, trap | Face irrelevant |
| **`well_ring_champion`** | Rival outers, outsiders testing the sash | Open **inside** lodge; muted **outside** (backing) | Well-Ring § below |
| **`villainy` / `corruption`** | Righteous, bounty hunters | Mixed — “justice” open, profit shadow | Alignment / seats |
| **`mercy` / `spared_heir`** | Spared NPC’s family | Gratitude **or** grudge thread | `spare` incident |

**Rule:** `rollEncounterOffer` checks **threads + facets** before anonymous street pool. Hot **`public_humiliator`** toward org X → **no random punk**; org thread picks **modality** (open duel vs poison) per appetite in threads doc.

**Open vs shadow:** challenger runs appetite + **facet fit** — proud duelist wants open if you’re famed for prowess; schemer house uses shadow if beating you openly would look ugly ([`jianghu-situation-threads.md`](jianghu-situation-threads.md) fight appetite).

---

## Hiding power — combat must not auto-blow cover

**Gap today:** once combat starts, nothing stops full techniques / true damage band → logically **every fight reveals** you. That kills disguise fantasy.

### Design: **display commitment** per fight

At combat open (or in loadout before):

| Mode | Fiction | Rules |
|------|---------|--------|
| **Full reveal** | No pretense | Normal techniques, true band readable after first exchange |
| **Restrained** | “QC outer playing along” | Cap damage band to **≤ known band**; grey **signature** arts; generic or masked weapon |
| **Mortal façade** | Non-cultivator / weak cover | Basic strikes only; fleeing is valid win |

**Restrained win:** enemy defeated or fled without **slip** → no `knownRealmBand` bump; optional **witness** roll for “something felt off.”

**Slip conditions (examples):**

- Used banned signature technique (hard reveal → ledger + incident).
- Damage single hit **> cover band ceiling** (panic flare).
- Enemy **survives** and escapes (partial rumor — “stronger than they looked”).
- **Deep probe** mid-fight (rare beat — elder watching).

**Flee:** [`combat-spine.js`](../../combat-spine.js) flee already costs fame in places — under cover, fleeing can **preserve** band at cost of facet `coward` locally (small heat) vs full reveal.

**UI:** deep cover checklist ([`disguise-and-public-identity.md`](disguise-and-public-identity.md)) + combat banner “Fighting restrained — signatures disabled.”

**Aftermath:** `resolveCombatRecognition({ witnesses, mode, slip })` → updates **signatures**, **known band**, **facets** (`duelist` if public spectacular win), spawns **incidents** for threads.

---

## Well-Ring sash (Redwell backing — not realm)

The sash is **institutional identity**, not cultivation tier. Master Liang is **early FE**; outers are **QC**. The lord nods at the **sash**, not your dantian.

### What exists in code (v1)

- `G.wellRing.member`, `merit`, board rank vs rival **Wei Shun**, missions, tournament flag — [`qc-depth.js`](../../qc-depth.js).
- Lord / glimpse lines: sash → brief recognition; outsider → ignored.
- Outsider **job** lean: non-members lose fat escort legs to lodge.

### Encounter / respect design (to wire)

| Effect | Mechanism | Notes |
|--------|-----------|--------|
| **Local random brawl ↓** | `respectMult` × ~0.65 for `affiliationTags: well_ring_outer` in Redwell **urban_core** | “That’s Liang’s disciple” — not fear of your realm |
| **Fringe / field** | Weaker sash bonus | Beasts don’t care; human bandits **partial** hesitation |
| **Wrong challenger type** | Outsiders / drunk **foreign** QC may **increase** test fights (sash as target) | Optional `outsider_test` facet |
| **Named rival** | **Wei Shun** / board — **thread or tournament**, not `pickEnemyTemplate` | Lodge politics |
| **Backing read** | [`jianghu-situation-threads.md`](jianghu-situation-threads.md) `effectiveBacking`: Tier-I hall × **outer** role | Beating you **openly** may trigger **master inquiry** beat at **merit ≥ 3** — not instant apex fight |
| **Low merit outer** | Disposable — **less** protection; more “discipline from seniors” beats | merit 0–1 |
| **High merit** | Locals avoid starting trouble; lord “quiet road” thanks | ties to `maybeRedwellCityLordGlimpse` |
| **Deep cover** | **Remove / hide sash** → lose lodge protection; gain anonymity | Trade: missions locked, lord treats as outsider |
| **Dirty missions** | `wr_sealed_pouch` etc. → **`shady` facet heat** locally | More **shadow** trouble, not more random QC brawls |

**Does not change `knownRealmBand`.** Can still show as **`affiliationTags`** on dossier even when band is concealed — unless player hides sash (deep cover).

**Future:** inner sash / early FE peer → different role weight; player-founded lodge duplicates pattern at lower apex.

Detail lodge fiction: [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md).

---

## Player-initiated combat (Fight → bounty board)

**Parked here.** Current **Fight / fight_seek** random opponent is a stub. Replacement **bounty / challenge board** is sketched in another agent — that flow should:

- Post **open** challenges using **facets** (duelist fame helps).
- Pull **thread** responses (house answers your post).
- Respect **place** tier bands for wilderness bounties.

Do not spec the board UI in this doc; encounter **offer pipeline** stays the same for **world-initiated** fights.

---

## Build order (recommended mesh)

1. **`G.publicDossier` stub** + `getPlayerKnownRealmBand()` = true band (identity slice A wedge).
2. **`rollEncounterOffer()`** before `startCombat()` / explore combat — wire **respectMult** for Redwell only.
3. **Place profiles** + `redwell_street_humans` pool ([`enemy-tier-scaling.md`](enemy-tier-scaling.md)).
4. **Incidents + one thread template** (personal grudge → single hunter spawn) — [`jianghu-situation-threads.md`](jianghu-situation-threads.md).
5. **Grudge interrupt** reads active thread beat instead of ad hoc picker — [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md).
6. **Restrained combat mode** + `resolveCombatRecognition` — disguise combat slice.
7. **Fame facets** + `addFameFacet` on incidents; threads consume facet ids.
8. **Well-Ring** `affiliationTags` on respect table (Redwell).
9. **Concealment** alters known band; proxies use known — disguise B/C.

---

## Open questions

1. Scalar **`G.fame`** = sum of facets, or separate “visibility” stat?
2. **Per-faction known band** (clan thinks QC, Well-Ring knows your merit, street thinks peak)?
3. **Sash hidden:** can you still take lodge missions incognito?
4. **Restrained fight:** auto-enable under deep cover, or always player toggle?
5. **Coward facet** from fleeing under cover — worth it vs reveal?

---

## Implementation crumbs (today’s files)

- Offer hook: `startCombat`, explore/travel rolls in `world.js`, `actions.js` `fight_seek`
- Dossier stub: `core.js` or new `public-dossier.js`
- Respect table: data next to `ENEMY_TIER_BALANCE` or Redwell pack
- Threads: `world-scheduler.js`, `G.situationThreads` (TBD), `npcKillLog`
- Betrayal: keep separate — relationship + **weak** gate; optionally add “won’t ambush if known band ≫ npc”
