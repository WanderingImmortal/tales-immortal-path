# World timeline — handoff checklist

| Field | Value |
|-------|-------|
| **Status** | `idea` — **timeline not built**; events below need **dates / ordering** |
| **Blocked on** | Owner + timeline agent pass |
| **Issue** | none yet |
| **Chat / PR** | Cult/gorge lore agent → timeline agent, 2026-07-29 |
| **Updated** | 2026-07-29 |

## Intent

Establish **when** major setting beats happened relative to each other (Seal → Dao Wars → mandate → **now**). Lore docs were written **story-first**; many lack **year, duration, or “how long ago.”**

**Do not** contradict locked beats without owner pass — use this as an **anchor list**, not gospel dates.

---

## Canonical docs (Heavenly Demon / gorge thread)

| Doc | What it holds |
|-----|----------------|
| [`heavenly-demon-cult.md`](heavenly-demon-cult.md) | Cult history, founder, Mo Xuan, pulpit clone, ranks |
| [`blood-sealing-gorge.md`](blood-sealing-gorge.md) | HQ districts (mouth → pit) |
| [`dao-wars-capital-turn.md`](dao-wars-capital-turn.md) | Tianjing, Half-Step walk, post-war arcs |
| [`imperial-clan.md`](imperial-clan.md) | Tian first Half-Step, Longcheng growth |
| [`void-temple-sect.md`](void-temple-sect.md) | Ancient Watch, prisoner, Archive Oath |

**Branch / PR:** `cursor/heavenly-demon-cult-design-1534` · PR **#92** (docs-only).

---

## Events needing **time / place** (priority)

### Cosmology (pre-history)

- [ ] **Primordial Chaos → Seal** — when heaven’s law “starts” for cultivation
- [ ] **Blood Sealing Gorge** — natural seal **before** Tian names Heartlands; optional “older war” camp legend
- [ ] **Void Watch** binds **prisoner** — **before** Dao Wars great sects; centuries of maintenance

### Heavenly Demon Cult

- [ ] Gorge **scab camp** → **Bloodrift swells** (Dao Wars?)
- [ ] Founder **meteoric rise** (DM) — **during** Dao Wars window
- [ ] **Tianjing** — Demon Blood Clone destroyed; **Great Withdrawal** same era as [`dao-wars-capital-turn.md`](dao-wars-capital-turn.md)
- [ ] Founder **silent Immortal** — **after** war; how long before mandate “extirpation” fiction spreads?
- [ ] **Pulpit clone** tradition — restarted **when** after Tianjing?
- [ ] **Great Draught** vs **Withdrawal** — duration of open harvest vs dormancy
- [ ] **“Now”** — centuries since Tianjing? Sleeping Dragon / Half-Step still alive?

### Mandate & map

- [ ] **Half-Step breakthrough** inside Tianjing cordon → **garden walk** — same day vs days ([`dao-wars-capital-turn.md`](dao-wars-capital-turn.md) Seven Days fork)
- [ ] **Longcheng** outer city — **starts growing after** mandate; Tianjing inner core unchanged name?
- [ ] **Archive Oath** (Void) — **after** capital outcome clear
- [ ] **Lotus** never assaulted Tian — what they did **same years** elsewhere

### Memory / who remembers

- [ ] **QC/GC** “cult dead” — how many **generations** since Withdrawal?
- [ ] **VR envoys** — war survivors vs post-war appointees — **age** band

---

## Suggested timeline **layers** (structure only)

```text
[ Chaos / Seal ] — no mortal calendar?
       ↓
[ Post-Seal kingdoms · gorge camp · Void prison ]
       ↓
[ Dao Wars ] — Tianjing · cult peak · Sword/Phoenix/Sword Ancestor era
       ↓
[ Capital Turn / mandate born ] — extirpation fiction · Longcheng growth
       ↓
[ Present game era ] — dormancy · faded memory
```

---

## Open questions for owner (timeline agent)

- [ ] Mortal **calendar name** (era, reign, sect year)?
- [ ] **Player start** — how many years after mandate?
- [ ] Single **continuum** — no numbered apocalypses ([`cosmology-ancients-taxonomy.md`](cosmology-ancients-taxonomy.md))

## Implementation crumbs

- Chronicle entries should cite **timeline doc** once it exists
- `docs/NOW.md` — add timeline under Focus when `designed`
