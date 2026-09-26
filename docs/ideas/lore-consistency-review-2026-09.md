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
- [~] **Why was the Tian founder first to Half-Step** after a long Warring States era of ~50k-year Dao Manifestation lives? `post-immortal-cosmology.md:283` has early Immortals right after the Seal. → owner: **first in living memory**. Cause of the Warring States drought still open.
- [ ] **Cult secrecy** — Blood Sealing Gorge has thousands in Bloodrift, a Deity-tier (now Celestial Avatar) mouth guard, DS overseers for branch cells; Sword patrols the rim; Tian forbid surveys. `imperial-clan.md` never mentions the gorge. *Suggestion:* the cover-up is a **deal** — the Half-Step killed the clone knowing the founder escaped; the mandate needs the extirpation story; the gorge is a pressure valve.

## Doc ↔ doc contradictions

- [ ] **Void Prisoner origin** — `void-temple-sect.md` (Watch + Seeker alone; crime = Pale Name-stripping) vs `void-prisoner.md` (claims source of truth; other DMs helped; motive = true Samsara Completion). *Suggestion:* one crime — name-stripping was the method of completing Samsara.
- [ ] **Cult HQ name** — "Gullet Gorge" (life / FE / GC docs, devouring docs) vs "Blood Sealing Gorge" (homeland doc). Rank ladders don't map (Listener → Maw Elder vs Outer/Core Demon, Pulpit Demon).
- [ ] **Cult founder realm** — DM rise → "silent Immortal" (`world-timeline-handoff.md`) vs "beyond-Immortal" research (`blood-sealing-gorge.md`). `heavenly-demon-cult.md` no longer holds the founder section the handoff points to.
- [ ] **Blood Clone timeline** — destroyed at Tianjing, yet today's Pulpit Demon is "usually a Blood Clone." When did the practice restart?
- [ ] **Great Draught vs Great Withdrawal** — used as if locked; duration/order unset.
- [ ] **Sword Immortal / Yun Jian in Dao War brawls** — "Sword Immortal did not leave the array" during Mad Monk fights (`celestial-sword-sect.md:77`, `body-path-sect.md`), but the array rose after Tianjing and he ascended after the peace; Yun Jian won his trial ~300 years ago.
- [ ] **Northern sect** — Yin Maiden Palace / Moonfract / Frostpeak; "not a guardian" (`frostbite-yin-sect.md`) vs holds the Bleed for the empire (`frostbite-origin.md`).
- [ ] **Silence debts** — why haven't Tian / sects erased the Yin Maidens to bury their war-crime secrets? *Suggestion:* the ledger is a dead-man's switch.
- [ ] **Half-Step definitions** — peak condition on DM (locked) vs "idx 8" (`dao-seeking-and-manifestation.md:143`) vs loose "half-step toward Manifestation" (`forgers-guild.md`).
- [ ] **Void Seeker vs "first"** — ascended to Immortal before the Tian Half-Step; fine under "first in living memory / first public" — make the wording consistent.
- [ ] **Third Dynasty timing** — locked pre–Dao Wars (`dustbone-dynasties-entropy-lore.md`) vs "may be post-war" (`dao-wars-outer-zones.md:52`).
- [ ] **Name collisions** — Hong Lian (洪炼 Forgers grandmaster / 红莲 cult elder); "Silent Moon" (Void adept / Yin matriarch); soul-path "Manifestation" vs Dao Manifestation (being fixed on PR #127).
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

## Other suggestions from the review

- **Silent Week** — yearly Heartlands observance; capital bells stop (echo of the Seven Days)
- **Garden-walk heart demons** — old Phoenix / Sword elders; heart-demon tribulation replays the walk
- **Out-of-time grotto master** — sealed before the mandate; doesn't know the Tian exist
- **Two-DM sect survivors** — disgraced joinable clan (author spine "Survivor" flavour)
- **Dragon's Edict fragment** — forbidden-technique quest; one unredacted copy exists
