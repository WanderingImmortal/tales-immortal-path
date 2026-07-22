# Chronicle, projects & time playback

| Field | Value |
|-------|-------|
| **Status** | `building` (diary reader v0) |
| **Blocked on** | Realm/lifespan table parked; world tick sim optional for v1 |
| **Issue** | none yet |
| **Chat / PR** | [PR #58](https://github.com/WanderingImmortal/tales-immortal-path/pull/58) |
| **Updated** | 2026-07-22 |

## Intent

**One diary** — the player’s life told as a **story**, not a spreadsheet.

**Projects** are how long stretches of time (years → millennia) get **spent**, not skipped. Cultivation at high realms should feel like closing the door and living through calendar time — but at a speed the player can follow.

**Time playback:** while a project runs, **age ticks forward** on screen. **Events only appear when something happens** (quiet years have no log lines). When the player **stops**, the ticker collapses into a **highlight reel** — empty years vanish; what remains is what mattered. Those beats feed the narrativized diary.

> **Long cultivation isn’t skipping time — it’s running a project that writes your story as it goes.**

Related: [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md) (calendar scale), [`nine-realm-ladder.md`](nine-realm-ladder.md) (realm bands), [`formations-and-arrays.md`](formations-and-arrays.md) (array projects), [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) (seclusion / method identity), [`immortal-world-layer.md`](immortal-world-layer.md) (Works at cosmic scale).

---

## Design notes

### One diary (reader)

Today the game scatters history across several logs (`worldChronicle`, sect chronicle, quest journal, sealed-site log). **Target:** one **Diary** screen the player opens often, with tabs or filters — not one giant code merge on day one.

| View | What it shows |
|------|----------------|
| **My path** | Breakthroughs, seclusion, projects, personal beats |
| **Sect** | Sect history (if founded) — founded, wars, succession, disciples |
| **Jianghu** | World events — factions, calamities, things that happened while you were gone |

**Era chapters** for long lives — auto headers so millennia stay readable:

```text
── Ages 84–150 · Foundation years ──
── Ages 312–480 · Golden Core ──
── Ages 1200–1480 · In seclusion beneath the peak ──
```

Insert when realm changes or a long gap passes.

**Voice:** narrativized. Short factual **title** optional; **body** reads like story prose.

*Example list entry:*  
**Year 318 — The eastern pin**  
*Lightning found the array’s weak line; you did not let the pattern scatter.*

---

### Time playback (watch mode)

The core UX for long projects. Not one popup that says “+400 years OK.”

#### While running

```text
Age 312 → 313 → 314 → … → 331 → 332 …
```

- **Age/year counter keeps ticking** — player feels time pass.
- **Event lines only when something happens** — no “Year 47: nothing.”
- Controls: **Pause** · **Speed (1× / 3× / 10×)** · **Skip to next event** (optional) · **Stop / Emerge**

```text
Year 318: A storm cracks the eastern pin — you reinforce the array.
Year 331: The pillar’s heart brightens for the first time.
```

#### When stopped

- Live ticker **collapses**.
- Player sees a **highlight reel** — only years where something happened.
- Quiet years **vanish from the summary** (they were felt while watching, not stored as noise).

```text
═══ 20 years in seclusion (Age 312–332) ═══

· Year 318 — Storm on the eastern pin; you held the line.
· Year 331 — The pillar’s heart kindled.

[ Continue ]  [ Save to diary ]
```

**Stop early** is valid: partial progress + partial chronicle + line like *“You left the grotto unfinished at age 380.”*

#### Speed & scale

| Project length | Default feel |
|----------------|--------------|
| 10–30 years | Fast tick or near-instant + one diary beat |
| 50–200 years | Watch mode, moderate speed |
| 500+ years | Slower default or **skip-to-next-event**; batch centuries between choices |

**Rule (owner):** quiet years never written to diary — only the span (“twenty years”, “Age 312–332”) and the events.

---

### Projects (long activities)

Generic **shell**; each **type** plugs in different events, phases, and whether watch mode is default.

**One active project at a time** — matches physique cultivation and sect construction today.

#### Project shell (concept)

| Field | Purpose |
|-------|---------|
| `type` | seclusion, consolidation, array_lay, array_refine, alchemy_long, manual_study, sect_work, dao_pursuit, … |
| `phases` | Multi-stage; some types need **choices between** watch segments |
| `state` | active · paused · complete · failed · abandoned |
| `startedAtMonths` / `endedAtMonths` | Diary timestamps |
| `choices` | Record what player picked per phase |
| `output` | Items, grades, flags — filled on complete or early stop |

#### Playback vs summary by type

| Type | Watch mode? | Notes |
|------|-------------|-------|
| **Seclusion / cultivation** | Yes — default | Years tick; sparse events |
| **Consolidation** (peak realm) | Yes | Ties to watershed “cement before breakthrough” |
| **Array lay / refine** | Watch **between** choices | Stage → pick focus → watch → next stage |
| **Long alchemy** | Watch or phased | Furnace years, tribulation of pill |
| **Manual study / decipher** | Mixed | Shorter spans may skip watch |
| **Sect work** | Optional replay | May be summary-only |
| **Quick actions** (months) | No | Instant + one diary line |

**Project happenings depend on the project** — same shell, different event pools and phase counts.

#### End receipt

After complete or stop, a **receipt** before returning to play:

- Years invested (span)
- What you gained (stats, items, array grade, insight)
- Highlight reel (same lines that go to diary)
- Optional: *what you missed* (opportunity cost — later, when world sim is richer)

#### Existing hook

[`physique-cultivation.js`](../../physique-cultivation.js) — staged project with progress % and one active at a time. **Week-scale** today; long projects use the same idea at **year/century scale** + watch playback.

---

### Where events come from (v0 → v1)

**v0 (no world tick design required):** event **templates** per project type and realm band. Scripted lines keyed to project phase, choice, and RNG.

**v1:** same tick + diary pipeline, but lines driven by **real world state** (factions shifted, NPC died, zone scar). See [`world-scale-and-travel.md`](world-scale-and-travel.md) — world tick parked until chronicle + one project type ship.

Honest v0 line is fine: *“Centuries pass; Dustbone traders still speak your name, though none have seen you.”*

---

### Chronicle entry shape (target — merge writers later)

One schema so all tabs sort by time:

| Field | Example |
|-------|---------|
| `months` | Player age when logged |
| `scope` | self · sect · world · site |
| `category` | breakthrough · cultivation · project · sect · world · faction · npc · discovery |
| `title` | Short headline |
| `body` | Narrative prose (optional) |
| `emoji` | Display |
| `tags` | Filter hooks — realm, zone, disciple id, project type |

**Today:** `appendWorldChronicle`, `appendSectChronicle`, quest journal, ancients log — **merge the reader first**, unify storage when convenient.

---

### Lifespan & caps (parked — link only)

Exponential xianxia caps (FE ~150, GC 300–500, NS 1000–1500, …) and **soft/hard cap via subrealm peaks** are **not designed in this doc**. See watershed + nine-realm ideas. Projects and chronicle work **without** final cap numbers.

---

## Build order (suggested)

```text
1. Diary reader (one screen) ← in progress (this branch)
   Pull from existing logs; narrativized display + era chapters.

2. Tick playback (minimal)
   Age ticks; 0–2 event lines from templates; pause / speed / stop;
   on stop → highlight reel (quiet years filtered out).

3. One simple project — seclusion (~10–80 years)
   Start → watch → stop or finish → diary chapter.

4. Project shell + second type (e.g. array or consolidation)
   Phases + choices between watch segments + receipt.

5. Merge more writers into diary (sect, world, quests).
   Unify storage when convenient (reader already merges views).

6. World-driven events during ticks (faction/NPC sim) — replaces template pool gradually.

7. Lifespan table + soft/hard subrealm caps — after realm redesign.
```

**Chronicle reader before projects.** **Simple seclusion before cosmic arrays.**

### Shipped in diary reader v0

- 📖 Open Diary popup tabs: **My path · Sect · Jianghu · Sealed Sites**
- Pulls quest/arcs, `G.sect.chronicle`, `G.worldChronicle` + faction chronicle (no storage merge yet)
- Era chapter headers by age band (40-year spans)
- Time playback / seclusion projects **not** in this slice

## Prerequisites

- [x] Diary UI shell (`index.html` / journal popup pattern)
- [x] Reader helper (`chronicle-diary.js`) wrapping existing append sources
- [ ] Tick playback UI component (age display + event list + controls)
- [ ] `processWorldTime` or equivalent for advancing months in chunks during playback
- [ ] One project type data + event template pool
- [ ] (Later) Lifespan / nine-realm indices finalized
- [ ] (Later) World tick content for v1 event sources
- [ ] `appendChronicle` unified writer (optional — reader works without it)

## Open questions

- [ ] Diary: always openable, or also push a “new chapter” notice after long projects?
- [ ] Max highlight reel length before auto-summarize into one paragraph?
- [ ] Can player re-watch a completed project’s highlight reel from diary?
- [ ] Interrupt events during playback (crisis pulls you out) — v1 or v2?
- [ ] Sect tab: show sect age alongside player age?
- [ ] True reincarnation / legacy: carry diary excerpts into next life?

## Implementation crumbs

- `world-scheduler.js` — `processWorldTime`, `appendWorldChronicle`, chronicle batching
- `sect-expand.js` — `appendSectChronicle`
- `story-arcs.js` — `questJournal`
- `physique-cultivation.js` — staged project pattern (short-scale prototype)
- `actions.js` — secluded meditation (months today; long seclusion project later)
- `ui.js` — quest journal popup (reader pattern to extend)
- `data.js` — consolidation guide text (`ACTION_UNLOCKS` / cultivation guide)
