# Lore consistency review (2026-09)

| Field | Value |
|-------|-------|
| **Status** | `idea` — checklist; work through one item at a time |
| **Blocked on** | Owner calls per item |
| **Issue** | none yet |
| **Chat / PR** | Owner + cloud agent read-only lore review, 2026-09-26 |
| **Updated** | 2026-09-26 |

## Intent

Findings from a full read of `docs/ideas/` plus in-game text. Tick items off as the owner decides them; move settled lore into the owning doc and link it here.

---

## Big plot holes

- [x] **Why do the Tian still rule** when sects gain Immortals? → owner answer in [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md) §1 (long gap; Tian + noble houses centralised; restrained top, powerful middle)
- [x] **Why was the Tian founder first to Half-Step** after a long Warring States era of ~50k-year Dao Manifestation lives? `post-immortal-cosmology.md:283` has early Immortals right after the Seal. → owner: **first in living memory**; wealth + talent requirements in a fragmented world; Da Chi found an unknown door; soul stigma blocked godhood. See [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md) §1. Founder **later ascended** (restrained Immortal). Spin-off: [`hollow-throne-sect.md`](hollow-throne-sect.md).
- [x] **Cult secrecy** → owner: founder knows the Demon lives; public line says gone; **managed threat** — cult never leaves its lands, throne won't pick the fight, everyone else rests easy. Recorded in [`imperial-clan.md`](imperial-clan.md). Outside work: never public; destroyed cells look like bandits / random cults; exposing the cult is an ultimate sin inside it (owner). Original finding: Blood Sealing Gorge has thousands in Bloodrift, a Deity-tier (now Celestial Avatar) mouth guard, DS overseers for branch cells; Sword patrols the rim; Tian forbid surveys. `imperial-clan.md` never mentions the gorge. *Suggestion:* the cover-up is a **deal** — the Half-Step killed the clone knowing the founder escaped; the mandate needs the extirpation story; the gorge is a pressure valve.

## Doc ↔ doc contradictions

- [x] **Void Prisoner origin** → owner merge 2026-09-26: name-stripping **is** the method of true Samsara; souls backed up because he was caught mid-Work; DM individuals captured, Watch + Seeker alone hold the lock. Updated `void-prisoner.md`, `void-temple-sect.md`, cosmology + spine wording. Original finding: `void-temple-sect.md` (Watch + Seeker alone; crime = Pale Name-stripping) vs `void-prisoner.md` (claims source of truth; other DMs helped; motive = true Samsara Completion). *Suggestion:* one crime — name-stripping was the method of completing Samsara.
- [x] **Cult HQ name** → **Blood Sealing Gorge** (owner); "Gullet Gorge" references renamed (art names like Gullet Palm kept). Rank-ladder mapping still open. Original finding: "Gullet Gorge" (life / FE / GC docs, devouring docs) vs "Blood Sealing Gorge" (homeland doc). Rank ladders don't map (Listener → Maw Elder vs Outer/Core Demon, Pulpit Demon).
- [x] **Cult founder realm** → **Immortal** (owner); "beyond-Immortal research" stays vague until an upper world exists. Original finding: DM rise → "silent Immortal" (`world-timeline-handoff.md`) vs "beyond-Immortal" research (`blood-sealing-gorge.md`). `heavenly-demon-cult.md` no longer holds the founder section the handoff points to.
- [x] **Blood Clone timeline** → clones never ended; he always keeps them made or ready (owner). Original finding: destroyed at Tianjing, yet today's Pulpit Demon is "usually a Blood Clone." When did the practice restart?
- [ ] **Great Draught vs Great Withdrawal** — used as if locked; duration/order unset.
- [x] **Sword Immortal / Yun Jian in Dao War brawls** → line now says Sword Ancestor + "patriarch of the day", young Yun Jian remembers. Yun Jian ~3,200–3,500, patriarch ~2,000 years; **Dao Wars ended ~3,000 years ago** (working); Da Chi Saint ~midway through the peace (owner). Original finding: "Sword Immortal did not leave the array" during Mad Monk fights (`celestial-sword-sect.md:77`, `body-path-sect.md`), but the array rose after Tianjing and he ascended after the peace; Yun Jian won his trial ~300 years ago.
- [x] **Northern sect** → **Yin Maiden Palace** (owner); the Bleed needs no guarding — they exploit proximity/affinity and guard their cultivation resource. `frostbite-origin.md` updated. Original finding: Yin Maiden Palace / Moonfract / Frostpeak; "not a guardian" (`frostbite-yin-sect.md`) vs holds the Bleed for the empire (`frostbite-origin.md`).
- [x] **Silence debts** → owner: politics — Maidens hold evidence and aren't publicly reviled; suggestions (coordination problem, charter status, oaths under heaven) in `frostbite-yin-sect.md`. Original finding: why haven't Tian / sects erased the Yin Maidens to bury their war-crime secrets? *Suggestion:* the ledger is a dead-man's switch.
- [x] **Half-Step definitions** — peak condition on DM (locked) vs "idx 8" (`dao-seeking-and-manifestation.md:143`) vs loose "half-step toward Manifestation" (`forgers-guild.md`). → owner: threshold state = **second peak** that partly uses the next realm's abilities; **Half-Step Immortal** / **Demi-Saint** / **Pseudo God**. Recorded in [`nine-realm-ladder.md`](nine-realm-ladder.md); both stray usages fixed.
- [ ] **Void Seeker vs "first"** — ascended to Immortal before the Tian Half-Step; fine under "first in living memory / first public" — make the wording consistent.
- [x] **Third Dynasty timing** — locked pre–Dao Wars (`dustbone-dynasties-entropy-lore.md`) vs "may be post-war" (`dao-wars-outer-zones.md:52`). → owner: **before** the wars, inside the open-ended Warring States era (no stretching of the ~3,000-year peace). Wartime echo: one power tried to garrison Dustbone and the **collective region rebuffed it** long before any cascade — a cascade collapses a society, not just an army. Recorded in both docs; the "collapsed during" row is fixed too.
- [x] **Name collisions** — Hong Lian (洪炼 Forgers grandmaster / 红莲 cult elder); "Silent Moon" (Void adept / Yin matriarch). → owner: cult elder is now **Xue Lian** (血莲) in `blood-sealing-gorge.md`; Void adept is now **Adept Still Abyss** in `void-temple-sect.md`; **Silent Moon Matriarch** keeps the name; the procedural-ecology example no longer uses it. Code follow-ups are listed below. Soul-path "Manifestation" vs Dao Manifestation is still being fixed on PR #127.
- [ ] **Stale meta-notes** — author spine says ~50k DM "not in ladder yet" (it is); `world-timeline-handoff.md` points to a founder section that no longer exists.

## In-game text behind the docs (code)

- [ ] `world.js:42` "Nine great sects ring the Heartlands" → four + Tian
- [ ] `world.js:16` Frostbite "immortal's tribulation froze the land" → superseded origin
- [ ] `data.js` Frostpeak Monastery "wardens of the Wastes" / Warden Yun → Yin Maiden pivot; no Vajra Ridge faction
- [ ] `data.js:4669` Celestial Sword "Blade-first", Elder Blade Feng, Blade Covenant → sword-only, blade taboo
- [ ] `factions-expand.js` Phoenix Gambit "sect broken" → charter coup, Lotus survives
- [ ] `world.js` "The Guild controls the tide-roads" / Storm Dragon "controls the sea routes" → keystone, not a navy
- [ ] `data.js:8` 7-realm qi ladder, short lifespans (`data.js:3732`), `DAO_SEEKING_REALM_IDX = 5` → nine-realm
- [ ] `data.js:9` FE title "Earthbound Immortal" → spends 仙 early
- [ ] `data.js` `crimson_harvest_breath` common grade / stability malus → cult apex canon says refined
- [ ] `ACTION_MONTHS.localTravel = 2` vs Redwell "day trips"
- [ ] Heartlands "Spirit Coin" loot vs single `G.stones` wallet
- [ ] `data.js:4870` `faction_void_adept` name "Adept Silent Moon" → **Adept Still Abyss** (owner 2026-09-26)
- [ ] `data.js:5359` `SECT_RIVAL_PREFIXES` — drop "Silent Moon" (reserved for the Yin matriarch)

## Other suggestions from the review

- **Silent Week** — yearly Heartlands observance; capital bells stop (echo of the Seven Days)
- **Garden-walk heart demons** — old Phoenix / Sword elders; heart-demon tribulation replays the walk
- **Out-of-time grotto master** — sealed before the mandate; doesn't know the Tian exist
- **Two-DM sect survivors** — disgraced joinable clan (author spine "Survivor" flavour)
- **Dragon's Edict fragment** — forbidden-technique quest; one unredacted copy exists
