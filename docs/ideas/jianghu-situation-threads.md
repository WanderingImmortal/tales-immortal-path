# Jianghu situation threads (grievances → consequences)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Grudge cultivate interrupt v1 ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)); backing/sect power read for NPCs (partial hooks: fame, sect renown, grudge tiers) |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-09-23 |
| **Updated** | 2026-09-23 (face + fight appetite) |

**Hub:** [`dustbone-living-board.md`](dustbone-living-board.md) · [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**Sisters:** [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) (personal interrupts) · [`world-events-layered-battlefield.md`](world-events-layered-battlefield.md) (civic scale) · [`world-standing-and-property.md`](world-standing-and-property.md) (visibility) · [`chronicle-and-projects.md`](chronicle-and-projects.md) (diary) · [`civic-seats-generator.md`](civic-seats-generator.md) (same “engine + packs” pattern) · [`disguise-and-public-identity.md`](disguise-and-public-identity.md) (counterplay)

## Intent

Players find their own path in a **non-linear** jianghu. We should not hand-write every “quest.” Instead, record **what happened** (slights, kills, betrayals, public humiliation) and let **personality + ties + standing** turn those facts into **situation threads** — optional chains like *fight a noble’s son → family hears → hunters, bounties, or a formal challenge*.

This is **not** a replacement for authored story arcs (`STORY_ARCS`). It is the **procedural glue** between personal NPC drama, faction standing, and calendar events.

**Player feel:** consequences you earned, readable in the diary, escapable or negotiable if you play smart — not an infinite quest log of fetch quests.

---

## What exists today (scattered but real)

| Layer | Role today | Gap for threads |
|-------|------------|-----------------|
| **World NPC converse** | `impression` / `trust`, personality synergies (`grudge_keeper`, `schemer`), decay | Per-NPC mood, not a **propagating debt** |
| **npc-betrayal.js** | Ambush / intel hooks from gap + synergy | Reactive combat, no multi-beat **chain** |
| **npcKillLog** | Last ~30 kills (uid, zone, reason) | No kin/clan/patron links; no scheduled follow-ups |
| **STORY_ARCS + shiftNpcRelationship** | Authored arcs, `fate: enemy`, journal | Right **shape** for chains; wrong **scale** (each arc hand-built) |
| **worldEventQuests + WORLD_EVENT_TEMPLATES** | Timed template quests (Wei rumors) | Quest-shaped UI; weak **cause** (not tied to player deeds) |
| **world-scheduler.js** | `scheduleWorldEvent(type, at, payload)` + handlers | **Correct spine** for delayed beats — underused for personal drama |
| **Sect diplomacy** | `declare_grudge`, grudge raids, rep tiers | Org-level, not “this NPC’s uncle” |
| **Design (parked)** | Grudge cultivate interrupt pulls story + kill log + hostile NPCs | Needs a **picker** and **persistent thread** model |

**Verdict:** You have **inputs** (relationship stats, kills, personalities, scheduler, quest log mirror) and **outputs** (combat, log lines, faction shifts). What’s missing is a **middle layer**: normalized **incidents**, **threads**, and **escalation packs** — plus rules for **who cares** (ties).

---

## Design — one engine, three layers

Think **civic seats generator**, but for drama: one runtime, data-driven packs.

```text
INCIDENT (immutable fact)
    ↓ rules + personality + ties
THREAD (active situation — stages, cooldowns, caps)
    ↓ each stage
BEAT (handler: interrupt · rumor · combat · letter · standing delta · chronicle line)
    ↓ optional mirror
QUEST LOG ROW (UI convenience — not the source of truth)
```

### 1. Incidents (ledger)

Append-only records — small, save-safe.

| Field | Purpose |
|-------|---------|
| `id` | Stable key |
| `type` | `slight` · `insult` · `robbery` · `kill` · `humiliation_public` · `betrayal` · `spare` · … |
| `atMonths` | When |
| `zoneId` | Where (matters for face — parked) |
| `actor` | Usually `player` |
| `target` | NPC uid and/or org id |
| `severity` | 1–5 (or derived from type + context) |
| `witnesses` | Optional uids / “public” flag |
| `payload` | Combat id, choice id, stolen item ref, etc. |

**Sources:** combat kill (`recordWorldNpcKill`), converse stances, story arc resolutions, future public duel outcomes.

Do **not** re-derive drama from impression alone each tick — impression is **local temperature**; incidents are **debts**.

### 2. Threads (active situations)

A thread is “the noble clan hunt” or “Merchant Su’s grudge” — one **narrative unit** with stages.

| Field | Purpose |
|-------|---------|
| `threadId` | Unique |
| `templateId` | Which pack (e.g. `clan_blood_debt`, `personal_grudge`) |
| `status` | `active` · `dormant` · `resolved` · `expired` |
| `stage` | Index into pack |
| `participants` | Player + NPC uids + optional `orgId` |
| `rootIncidentId` | What started it |
| `nextBeatAt` | Scheduler hook |
| `flags` | Player choices (`paid_blood_price`, `fled_region`, `killed_envoy`) |
| `heat` | Optional intensity 0–100 (escalation / de-escalation) |

**Caps:** max active **personal** threads (e.g. 3–5); org-level threads separate cap — avoids quest spam.

**Resolution:** pay off, kill apex, flee zone, serve sentence, ally-of-enemy peace, time + decay (personality-dependent), story arc override.

### 3. Beats (handlers)

Reuse **world-scheduler** pattern: beat type → function.

| Beat type | Example |
|-----------|---------|
| `rumor_tick` | Inn line: “House X seeks a cultivator who…” |
| `grudge_interrupt` | Cultivate / travel pause — someone with reason |
| `spawn_hunter` | Ambient NPC or named proxy in zone |
| `faction_standing_delta` | Clan rep, city law attention |
| `letter_choice` | Pay · duel · deny · flee |
| `chronicle_entry` | Jianghu tab line |
| `mirror_quest_log` | Optional `npcQuests` row for journal UI |

**Quest log is a view.** Thread state lives in `G.situationThreads` (name TBD). Same as today: `worldEventQuests` mirrors into `npcQuests` — keep that pattern.

---

## Fight appetite & face (how NPCs choose *whether* and *how* to hit back)

Xianxia feuds are not “everyone always rushes you.” Actors weigh **can we win?**, **what do we lose if we lose?**, and **how ugly would it look if we win?** That belongs in the **thread engine** (when picking the next beat), not in hand-written quest text.

### Two decisions per escalation step

| Decision | Question | Drives |
|----------|----------|--------|
| **Appetite** | Do we engage at all, wait, or drop it? | Delay beat · de-escalate · ignore (with personality exceptions) |
| **Modality** | Open · formal · or shadow? | Beat type: duel letter, public challenge, ambush, bounty, poison, law trap, clan petition |

Both run **after** an incident exists; they do not replace personal grudges (`grudge_keeper` may fight anyway when appetite says “no”).

### Signals the world already has (or will)

**Player — displayed strength & record**

| Signal | Source (today / near) | Notes |
|--------|------------------------|-------|
| **Realm band** | `G.realmIdx` | Coarse; main “can you crush my son?” read |
| **Fame / renown** | `G.fame`, sect renown tiers | Jianghu **visibility**, not only power |
| **Recent deeds** | Incidents ledger, kill log | “You humiliated us *last week*” vs ancient slight |
| **Sect face tag** | Player sect rank, hall vs mountain | Disciple vs elder proxy changes who may strike |
| **Backing** | Sect id + org tier ([`jianghu-organization-types.md`](jianghu-organization-types.md)), allies, imperial charter touch | “His master is a GC elder” |
| **Gear / aura display** | Stretch — luxury gear → [`world-standing-and-property.md`](world-standing-and-property.md) visibility | Optional appetite modifier, not required v1 |

**Counterparty — who is judging**

| Actor | Reads |
|-------|--------|
| **Individual NPC** | Own realm vs player, impression/trust, personality (`proud_*` overestimates self; `schemer` prefers shadow) |
| **Clan / house org** | House apex band (seat tier table), `lean`, heir flag, **public reputation tier** |
| **Sect** | Sect diplomacy rep, alignment branding, grudge rules |

Use a simple **power index** per side for v1: realm band + optional org apex band + small fame/renown bump — not a full combat sim. Goal: *plausible hesitation*, not perfect prediction.

### Appetite score (sketch)

Conceptual formula — tune in data, not prose:

```text
grievanceHeat
  + personalityAggression
  - powerGapPenalty        (they are much weaker than player + backing)
  - apexRisk               (player’s patron org tier >> ours)
  + heirOrBloodDebt        (non-negotiable for some packs)
```

| Band | Typical behavior |
|------|------------------|
| **Low appetite** | Rumor only, cold shoulder, report to patron, wait for player to leave tier-4 pond |
| **Medium** | Formal letter, compensation demand, challenge board in **their** venue |
| **High** | Hunters, ambush, sect proxy fight |
| **Obsessed** | `grudge_keeper` / blood debt — ignores gap (may still pick **shadow** if face demands) |

**Examples:**

- QC nobody slaps a **named GC heir** in a 3rd-tier city → house appetite **high**, modality likely **formal** (duel summons) or **legal** (yamen) — not a back-alley thug unless `lean: graft`.
- QC nobody with **no sect** kills a bandit chief’s son → chief appetite **high**, modality **open** (they think they win).
- Player backed by **feared** sect renown + high realm → weaker clan appetite **low** unless incident severity 5 or heir killed — then they **escalate sideways** (see face).

### Face calculus (public vs shadow)

**Face** here means: *reputation cost to the aggressor if the response is seen*. It picks **modality**, not whether the grudge exists.

| Input | Effect |
|-------|--------|
| **`witnesses` / `humiliation_public` on incident** | Counterparty **must** respond or lose face; method still varies |
| **Location tier** | Threshold / capital / tournament month → more **public** optics |
| **Org brand** | `righteous_charter` · `imperial_clan` · `merchant_guild` · `martial_house` · `hidden_evil` (data tags on org/clan packs) |
| **Relative status** | High-status clan vs unknown cultivator: winning a **street brawl** can look **petty or bullying** |
| **Player fame** | Famous victimizer → public defeat of player **gains** face; failed public attack **hurts** |

**Modality rules (owner lean):**

| Profile | Prefers when face-sensitive |
|---------|----------------------------|
| **Righteous / charter sect / imperial kin** | Petition law, **duel under witness**, “righteous punishment” framing; **avoid** alley knife in market |
| **Same, but schemer seat holder** | Public apology demand + **private** assassin / poison / bounty — [`npc-betrayal.js`](../../npc-betrayal.js) beats |
| **Martial house / bandit kin** | Open challenge, hunt in wilds — public brawl OK if honor narrative fits |
| **Merchant / clerk lean** | Economic squeeze, deed contest, hire blades — minimal public violence |

So: a **great righteous sect** whose disciple you wronged might **not** send ten disciples to jump you at the inn. They send **one envoy**, a **formal challenge**, or a **bounty through gray guild** — fiction matches “we are righteous” without giving the player a free pass.

### Backing asymmetry (sect vs lone cultivator)

When **player backing ≥ counterparty apex**:

- Appetite may drop to **wait** or **legal/economic** pressure only.
- Face logic flips: *they* cannot afford to lose in public either — stalemate, poison, or targeting **weak ties** (disciple, caravan, residence) per [`world-standing-and-property.md`](world-standing-and-property.md).

When **counterparty ≫ player**:

- Appetite high but modality may be **contemptuous** (send a steward, not the patriarch) unless you killed an heir.

Store on thread: `lastAppetite`, `preferredModality`, `publicFacePressure` (0–100) so beats stay consistent across months.

### New beat types (face-aware)

| Beat | When |
|------|------|
| `formal_challenge` | Public venue; honourable path; timer to accept/flee/forfeit face |
| `law_petition` | City seat / charter — arrest, fine, ban from market |
| `shadow_bounty` | No giver name; hunter thread; righteous org **deniability** |
| `economic_squeeze` | Refuse service, price spike, license revoke |
| `proxy_duel` | Send champion disciple — org saves apex face |
| `forbear` | Chronicle: “House X watches silently” — dormant thread, heat decays unless provoked again |

### v1 vs later

| v1 (personal grudge) | Later (clan / sect threads) |
|----------------------|-----------------------------|
| Individual appetite from realm + impression + personality | Org tags + backing index |
| Wilderness vs settlement flag only | Full face tiers + challenge board UI |
| Open ambush vs converse coldness | Shadow bounty, proxy duel, law petition |

[`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) v1 stays **personal enemies**; when sect-face threads land, interrupts must respect **modality** (no righteous sect alley ambush in capital without a flag).

---

## Escalation packs (what you author)

Author **packs**, not 500 quests. Each pack: trigger conditions + stage list + personality/org modifiers.

### Example pack — `clan_blood_debt`

**Trigger (sketch):**

- Incident `kill` or `humiliation_public` where `target` has `tie: clan_heir` or seat holder with `fateSeed: wrong_enemy`
- Or kill logged + target carries `clanId` in NPC data

**Stages (sketch):** each stage runs **appetite + modality** pick before firing.

1. **Word spreads** — rumor beat; optional visibility bump ([`world-standing-and-property.md`](world-standing-and-property.md))
2. **Envoy** — `letter_choice` or `formal_challenge` if face high; `shadow_bounty` if org brand righteous + player strong
3. **Pressure** — `economic_squeeze` or standing hit; skip open raid if `publicFacePressure` high
4. **Hunters** — `spawn_hunter` (wilds) or `proxy_duel` (send champion) — not both unless heat maxed
5. **Apex** — optional authored beat if player ignored N stages; apex only if appetite still high **and** modality allows public apex (or story override)

**Personality modifiers:**

| Synergy | Effect |
|---------|--------|
| `grudge_keeper` | Slower decay, +heat on insult incidents; may force high appetite when others would forbear |
| `schemer` | Shadow modality bias; `betrayal` beat instead of open fight |
| `proud_*` | Overestimates power → higher open-fight appetite; still prefers witnessed duel over ambush |

**Relationship modifiers:**

- High trust with a **different** clan member might unlock “appeal to patriarch” branch
- Negative trust with victim → skip envoy, jump to hunters

### Example pack — `personal_grudge` (v1)

Smaller scope — maps directly to cultivate interrupt design:

- Trigger: impression/trust threshold, `dueledPlayer`, story `fate: enemy`, kill-log link
- Stages: single interrupt → optional repeat if heat high
- Good **first implementation** of thread + beat without full clan sim

### Example pack — `kill_log_kin` (stretch)

- Trigger: kill where victim had `kinUid` or procedural “brother” spawn rule ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) open question)
- Stages: rumor → grudge_interrupt → resolve or chain into `clan_blood_debt` if kin is connected

---

## Who cares? (ties — minimal graph)

Full NPC social sim is **out** ([`dustbone-living-board.md`](dustbone-living-board.md)). Enough links to propagate:

| Tie | On |
|-----|-----|
| `clanId` / `houseId` | NPC or civic seat holder |
| `patronOrgId` | Sect, merc guild, yamen |
| `kinUid` | Optional explicit relative |
| `seatRole` | `city_lord`, etc. — institutional response |
| `storyId` | Authored NPCs |

**Rule:** when an incident fires, walk **target’s ties** (1 hop default, 2 hops for `severity >= 4`). Each matching org/clan checks org **temperament** (martial vs legalistic) to pick pack variant.

Civic seats: killing the “son of the lord” is different if the lord seat is `lean: martial` vs `clerk` — same engine, culture/tier tables like civic generator.

---

## Scale ladder (don’t mix fiction)

| Scale | System | Example |
|-------|--------|---------|
| **Personal** | Situation threads | Grudge, kin revenge, betrayed merchant |
| **Org** | Factions + scheduler | Grudge sect raid, phoenix war advance |
| **Civic** | World events doc | Beast wave conscription |
| **Authored** | STORY_ARCS | Liang Chen, caravan, legacy chain |

Personal threads **may** escalate into org standing (clan puts bounty) but should not instantly become “world war.”

---

## UI / narrative

- **Chronicle Jianghu tab** ([`chronicle-and-projects.md`](chronicle-and-projects.md)): prose lines from beats — primary “what’s happening”
- **Quest journal**: optional mirror for players who want a checklist — title from template + participant names
- **No objective spam:** stages can be hidden until rumor fires (“something is coming”) — fits non-linear play

### Jianghu dossier (player-facing “what the world thinks”)

A dedicated **Diary tab** (or sub-panel): **Your name in the jianghu** — slightly meta, but matches cultivator introspection / “know thyself on the path.” Not a combat spoiler screen; a **legibility layer** so chaos stays readable when threads multiply.

**Split two ledgers in UI copy:**

| Ledger | Player sees | Source |
|--------|-------------|--------|
| **Public record** | What others plausibly believe | Witnessed incidents, rumors fired, public duels, sect announcements |
| **Your memory** | What *you* did (fuller) | Same incident log, including private acts — may note “not yet spread” |

Immersion line: *“The jianghu is wrong sometimes. What spreads is what kills you.”*

#### Sections (sketch)

| Section | Content | Precision |
|---------|---------|-----------|
| **Displayed strength** | Realm band **as known** (not true realm if hidden) | Bands: “Rumored QC” · “Seen at FE early” · “Confirmed GC” — from public fights / breakthrough witness / boasts |
| **Arts shown** | Named techniques or tags seen in public combat | Signature ledger — drives recognition under disguise ([`disguise-and-public-identity.md`](disguise-and-public-identity.md)) |
| **Face / name** | Alias, fame tier, “face known in X zones” | Tied to fame + visibility ([`world-standing-and-property.md`](world-standing-and-property.md)) |
| **Backing (known)** | Sect robe, hall, patron — **only if displayed** | “Disciple of …” vs “Unaffiliated (rumors say …)” if uncertain |
| **Enemies & debts** | Persons · clans · sects · law | Filters + sort by heat; see below |
| **Allies & credit** | Mirror for positive standing | Stops dossier feeling like pure punishment |

#### Enemy list — how much to tell?

**Owner lean: retrospective yes, predictive no.**

| Show | Hide |
|------|------|
| **That** House X or NPC Y bears a grievance (once rumor or envoy fired) | **When** the next beat fires |
| **Category** of grudge in fiction voice: “blood debt,” “public humiliation,” “broken contract” | Exact beat type (`shadow_bounty` vs `formal_challenge`) |
| **Hint** tied to *past* public facts: “After the bazaar incident…” | “Prepare for ambush in Dustbone” |
| **Heat band** (watching · grievance · vendetta) | Numeric stage index / scheduler |

Private/shadow threads: list as **“Unknown party”** or **“Whispers, no name”** until a rumor beat names them — righteous sect shadow play stays deniable in-fiction.

**Why not full transparency?**

- Full “you did X → they will Y” turns the game into a **retribution checklist** and pushes optimal pacifist play — bad for rogue cultivator fantasy.
- Zero feedback makes threads feel like **random jumps** — bad for learning and for “I pissed off everyone” manageability.

**Middle path:** dossier is a **mirror of incidents + surfaced threads**, not the thread AI’s plan. Player can prepare **generally** (leave clan lands, don’t cultivate exposed, buy guards) without dodging every scheduled beat.

**Owner lock (2026-09-23):** Legibility replaces a “main quest.” The player should know **they have enemies** and roughly **why / how hot**, but not **when** or **how** retaliation arrives. That forces a real choice: *how much do I prepare vs can I move on to the next thing?* — cultivation, travel, opportunity, seclusion — without the UI prescribing a single correct path. No main quest arrow; **direction**, not **solution**.

Optional **accessibility / tone** toggle (settings):

| Mode | Feel |
|------|------|
| **Jianghu voice** (default) | Rumor prose, bands, vague heat |
| **Blunt** | Same facts, shorter labels — still no beat timers |

Do **not** gate difficulty on the toggle; only wording density.

#### Filters (when the list explodes)

- Type: **Persons** · **Clans/houses** · **Sects** · **Law/charter** · **Unknown**
- State: **Active** · **Dormant** · **Settled**
- Zone: where grudge is loudest
- Sort: heat · recent · alphabetical

Cap **pinned** entries (3) for “main feud” without hiding the long tail.

#### Relation to other UI

| Surface | Role |
|---------|------|
| **My path** chronicle | Story of your life |
| **Jianghu dossier** | Structured **status** — skimmable |
| **Quest journal mirror** | Optional objectives for players who want tasks |
| **Rumor inn lines** | First hint before dossier row appears |

Dossier rows **unlock** when the world would plausibly know — not at incident write for secret kills.

#### Phasing

| Phase | Dossier |
|-------|---------|
| P0–P1 | Manual-ish: fame, sect tag, story `fate: enemy`, kill-log names after rumor |
| P2+ | Thread-driven rows, heat bands, org/person filters |
| P3 | Known vs true realm, arts shown, backing uncertainty |

---

## Phased build (when implementing)

| Phase | Deliverable |
|-------|-------------|
| **P0** | Incident recorder API; `personal_grudge` thread; hook grudge interrupt picker to active threads |
| **P1** | Scheduler beats + rumor + chronicle; thread caps + resolve paths |
| **P2** | Kill-log kin + `clan_blood_debt` pack; NPC/seat `clanId` on holders |
| **P3** | Appetite + modality picker; org face tags; challenge board vs shadow beats |
| **P4** | Cross-thread arbitration (two clans both hunting — pick or merge) |

---

## Open questions

- [ ] Thread vs existing `STORY_ARCS`: can an arc **spawn** a thread on fail/betray path only, or always?
- [ ] Player-initiated feuds (`declare_grudge` analog for NPCs)?
- [ ] De-escalation economy: blood money amounts by city tier?
- [ ] Permadeath of thread NPC — thread transfers to org or ends?
- [ ] Wei-style **opportunity** world quests vs **consequence** threads — same UI or separate tab?
- [ ] Org **brand tags** — one enum per great sect / clan pack, or derive from alignment + charter fiction?
- [ ] Player **forfeit face** — skip duel → thread heat vs permanent standing hit?
- [ ] Assassins guild as universal shadow sink vs per-org hired blades only?
- [ ] Dossier **Blunt** toggle — default off; copy-only or also show heat numbers?
- [ ] “Your memory” private incidents — always visible to player or locked behind Soul Search / high insight perk?

---

## Implementation crumbs

`world-scheduler.js`, `story-arcs.js` (`worldEventQuests` mirror pattern), `quests.js` (`npcKillLog`, `addNpcQuest`), `npc-converse.js`, `npc-betrayal.js`, `factions.js` / sect grudge, `data.js` `WORLD_EVENT_TEMPLATES`, civic seats holder shape in [`civic-seats-generator.md`](civic-seats-generator.md).
