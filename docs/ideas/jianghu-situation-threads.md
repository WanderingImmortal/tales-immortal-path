# Jianghu situation threads (grievances → consequences)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Grudge cultivate interrupt v1 ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)); face/public honor parked |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-09-23 |
| **Updated** | 2026-09-23 |

**Hub:** [`dustbone-living-board.md`](dustbone-living-board.md) · [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**Sisters:** [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) (personal interrupts) · [`world-events-layered-battlefield.md`](world-events-layered-battlefield.md) (civic scale) · [`world-standing-and-property.md`](world-standing-and-property.md) (visibility) · [`chronicle-and-projects.md`](chronicle-and-projects.md) (diary) · [`civic-seats-generator.md`](civic-seats-generator.md) (same “engine + packs” pattern)

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

## Escalation packs (what you author)

Author **packs**, not 500 quests. Each pack: trigger conditions + stage list + personality/org modifiers.

### Example pack — `clan_blood_debt`

**Trigger (sketch):**

- Incident `kill` or `humiliation_public` where `target` has `tie: clan_heir` or seat holder with `fateSeed: wrong_enemy`
- Or kill logged + target carries `clanId` in NPC data

**Stages (sketch):**

1. **Word spreads** — rumor beat; optional visibility bump ([`world-standing-and-property.md`](world-standing-and-property.md))
2. **Envoy** — letter_choice: compensation · formal duel · refuse
3. **Pressure** — standing hit in clan territories; market refusal thin hook
4. **Hunters** — scheduled `spawn_hunter` in adjacent zones (realm-banded)
5. **Apex** — optional authored beat if player ignored N stages (named elder — hand-placed or seat-linked)

**Personality modifiers:**

| Synergy | Effect |
|---------|--------|
| `grudge_keeper` | Slower decay, +heat on insult incidents |
| `schemer` | Extra `betrayal` beat instead of open fight |
| `proud_*` | Prefers `letter_choice` duel over ambush |

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

---

## Phased build (when implementing)

| Phase | Deliverable |
|-------|-------------|
| **P0** | Incident recorder API; `personal_grudge` thread; hook grudge interrupt picker to active threads |
| **P1** | Scheduler beats + rumor + chronicle; thread caps + resolve paths |
| **P2** | Kill-log kin + `clan_blood_debt` pack; NPC/seat `clanId` on holders |
| **P3** | Face/public location rules; challenge board vs alley knife |
| **P4** | Cross-thread arbitration (two clans both hunting — pick or merge) |

---

## Open questions

- [ ] Thread vs existing `STORY_ARCS`: can an arc **spawn** a thread on fail/betray path only, or always?
- [ ] Player-initiated feuds (`declare_grudge` analog for NPCs)?
- [ ] De-escalation economy: blood money amounts by city tier?
- [ ] Permadeath of thread NPC — thread transfers to org or ends?
- [ ] Wei-style **opportunity** world quests vs **consequence** threads — same UI or separate tab?

---

## Implementation crumbs

`world-scheduler.js`, `story-arcs.js` (`worldEventQuests` mirror pattern), `quests.js` (`npcKillLog`, `addNpcQuest`), `npc-converse.js`, `npc-betrayal.js`, `factions.js` / sect grudge, `data.js` `WORLD_EVENT_TEMPLATES`, civic seats holder shape in [`civic-seats-generator.md`](civic-seats-generator.md).
