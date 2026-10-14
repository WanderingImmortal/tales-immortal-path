# Fate & fortune — grounding (what it is / is not)

| Field | Value |
|-------|-------|
| **Status** | `designed` — owner direction 2026-10-14; **read before** Fate branch mechanics |
| **Blocked on** | none (concept lock); spirit Fate implement after this + [`soul-root-dao.md`](soul-root-dao.md) § Fate |
| **Issue** | none yet |
| **Chat / PR** | Spirit Root design · [PR #149](https://github.com/WanderingImmortal/tales-immortal-path/pull/149) |
| **Updated** | 2026-10-14 |

## Intent

Xianxia uses **命**, **气数**, **运势**, **天机**, divination, and “counter-heaven” in **different ways** — sometimes incompatible in the same novel. Before we wire **Spirit Root Fate (命)**, we need one **game definition** so Fate is not “see the future” (too strong, wrong shelf) and not a duplicate of **Karma**, **Time Dao**, or **fate rite theft**.

**Player-facing one-liner (lean):** Fate walkers **read which way luck is leaning** and **tilt the board** — they do **not** receive a spoiler script of tomorrow.

---

## Xianxia — fate shows up in several lanes (genre, not one mechanic)

Authors mix these; our job is to **assign lanes** so systems do not collide.

| Lane (EN) | Hanzi / tropes | What it usually means in fiction | **This game — owner lane** |
|-----------|----------------|----------------------------------|----------------------------|
| **Moral ledger** | 因果 · 业力 · 报应 | Deeds link to payback; delay is normal | **Karma** (Root + qi Karma Dao hints) — [`soul-root-dao.md`](soul-root-dao.md) § Karma; **NHK** for heaven rulebook — [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md) |
| **Personal destiny** | 命 · 命格 · 八字 | Birth chart, lifespan cap, “this life’s trajectory” | **Spiritual roots + watershed pacing** — [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md); **not** editable by Fate Root except **bias rolls**, not rewrite chart |
| **Luck / fortune** | 气数 · 运势 · 福缘 | Rising/falling luck of person, house, dynasty | **Spirit Root Fate** — **fortune streams** on anchors |
| **Omen / divination** | 兆 · 谶 · 卜 · 天机 | Signs, hexagrams, “heaven’s secret hint” | **Omens** everywhere at low power; **Fate Root** reads **tendency**; **full 天机** = high realm / mandate / Seeking pressure read — not idx-4 spoiler |
| **Stealing / patching fate** | 改命 · 偷天换日 · 换命 | Break basin ceiling, swap composition, cheat registry | **Fate rite** chronicle — [`root-rite-formations.md`](root-rite-formations.md) → **`gate_theft` NHK** — **not** Spirit Fate nudge |
| **Time manipulation** | 时光 · 时空 · 回溯 · 静止 | Rewind, freeze, accelerate, jump timeline | **Time / Spacetime Great Dao** (qi Seeking→Manifestation) — **refused** at immortal taboo layer for rewind — [`immortal-powers-adaptation.md`](immortal-powers-adaptation.md) § Time |
| **Prophecy / script** | 预言 · 天命 · “see the ending” | Know who wins, read fixed future | **Refused** as gameplay (ends stories); Seeking gets **pressure omens with false branches** only |
| **Institution collapse** | 气数已尽 · 宗门大运 | Sect “luck dies”; empire rots from auspice | **Fate apex manuals** + situation-thread **biased rolls** — chronicle, not one button |

**Design rule:** one verb family per lane. If a feature **skips time** or **reveals a unique story outcome**, it is **not** Spirit Root Fate.

---

## Spirit Root Fate (命) — game definition

**Fate Root** is **fortune mechanics on anchors**:

- **Anchor** — a person (personal **运**), org, zone, or scheduled **event slot** (exam, marriage, vein season).
- **Fortune stream** — **momentum** (luck rising/falling), **volatility** (how easy to nudge), optional **situationBias** on the next procedural roll.
- **Verbs (crude inherit):** **read tendency** → **nudge** → (supreme) **shear** one band → (statute) **omen seat** in claim.
- **Payoff shape:** NPCs still choose; **dice and schedules** skew — [`jianghu-situation-threads.md`](jianghu-situation-threads.md), [`world-scheduler.js`](../../world-scheduler.js).

Hanzi UI lean: branch **命**; personal layer **运**; institutional **气数**. Avoid promising **天机** in tooltips at mortal tier.

Mechanics detail: [`soul-root-dao.md`](soul-root-dao.md) § Branch focus — Fate.

---

## What Fate **is** (in play)

| Idea | Meaning |
|------|---------|
| **Tendency, not transcript** | “Luck runs cold toward **this anchor**” — like Seer Asha’s line: *not a prophecy, but a tendency* ([`dao-taxonomy.js`](../../dao-taxonomy.js) `performKarmaSeerReading`) |
| **Imminent line (combat)** | **Next committed hostile line** in a fight — telegraph for counter-play, not “you die turn 8” |
| **Roll bias (jianghu)** | Next **situation-thread** or **event** roll shifts — rival **might** fail exam; patron **might** withdraw |
| **Institutional weather** | Sect/clan **气数** — donors, veins, exam seasons **drift**; apex arts **schedule misfortune beats** |
| **Omens as UI** | Chronicle copy, colour on anchor, false branches OK |
| **Bounded tilt** | **Nudge** = proc order, flee mood, small proc — **no skip-turn**, no hard stun at crude tier |
| **Costs & counters** | Merit, luck treasures, mean reversion, True Self (harder personal read), realm depth |

---

## What Fate **is not**

| Not this | Why | Where it lives instead |
|----------|-----|-------------------------|
| **Plot spoiler** — “Quest 7 outcome is betrayal” | Kills authored + procedural story | **Refused**; hints point to **pressure**, not unique script |
| **Omniscient future sight** | One OP skill; no counter | **Refused** at Root; partial reads + wards |
| **Time rewind / freeze / extra timeline** | Deletes clock, tribulation, travel | **Time / Spacetime Dao**; immortal layer **refuses rewind** |
| **“See the ending of the war”** | Same as prophecy | **Refused** even as Taboo — [`immortal-powers-adaptation.md`](immortal-powers-adaptation.md) § Fate, karma, eyes |
| **Rewrite someone’s 命格 / birth chart** | Permanent identity edit | **Memory** apex (life format) + heavy stain; or **fate rite** on **self** at gate |
| **Mind control** — “luck forces them to obey” | Karma/Fate confusion | **Illusion / Memory**; Fate only **biases** choices NPCs already could make |
| **Karma settlement** — damage from evil ledger | Different metaphor | **Karma Retribution** |
| **Stealing heaven’s basin** | Gate crime | **Fate rite** project → **NHK `gate_theft`** |
| **Guaranteed outcome** | No escapable drama | Always **biased roll**, not auto-success; counters exist |

If a proposed Fate art **must** know a **unique future fact** or **undo a month**, stop and re-home it.

---

## Tendency vs prophecy vs Time Dao (the headache table)

| | **Tendency (Fate Root)** | **Prophecy (refused)** | **Time Dao (qi Great Dao)** |
|--|--------------------------|-------------------------|-----------------------------|
| **Question** | *Which way is luck leaning?* | *What exactly will happen?* | *When does causality run?* |
| **Output** | Momentum band, omen, **one** telegraphed combat line, roll **±** | Fixed future event | Delay, accelerate, **rewind (refused)**, stasis (refused in combat) |
| **False branches** | **Yes** — reads can partial-fail | No — would be truth | N/A |
| **Scope** | One anchor / one imminent beat | Whole plot | Timeline |
| **Spirit idx 4** | **Thread Glimpse** (crude) | **No** | **No** — not spirit lane |
| **Seeking @6** | Stronger institutional read via **manuals** | Still **no** war winner | Comprehend **Time** as **law**, not Root inherit |

**Thread Glimpse rename-friendly:** **Fortune Line**, **Omen Read** — emphasise **line of tendency**, not calendar future.

**Dao Seeking overlap (allowed):** “This seat is thinning, this tribulation will not be ordinary” = **pressure omen** ([`immortal-powers-adaptation.md`](immortal-powers-adaptation.md)) — same **family** as Fate reads, weaker and **not** a branch requirement. Qi Seeker with fate-flavoured dao fragments may **share copy**; **mechanical owner** of roll bias on anchors stays **Spirit Fate** + chronicle tools.

**Void prisoner note:** True Spacetime as prisoner Work rejected — full time-rip breaks capture fiction ([`void-prisoner.md`](void-prisoner.md)).

---

## Personal 运 vs institutional 气数

| | **Personal 运** | **Institutional 气数** |
|--|-----------------|-------------------------|
| **Examples** | Duel telegraph, “will this NPC hire me?” mood | Sect exam season, vein yield, clan marriage auspice |
| **Crude Fate** | Glimpse, Nudge | Glimpse shows **omen colour** only |
| **Manuals** | Tighter telegraph, proc bias | Clan Omen Pin, Exam Bias, Sect Fortune Collapse |
| **Feels like** | “He’s about to commit to a reckless line” | “The hall’s luck turned after the scandal” |

Personal luck **does not** grant access to another cultivator’s ** sealed plot flags** — only **momentum + imminent action class** in combat, or **soft converse bias** out of combat.

---

## Overlap with Karma & seers (keep separate)

| System | Reads | Changes |
|--------|-------|---------|
| **Karma Root** | **Edges** between actors (debt, blood, oath); heavenly **NHK** tint | Reinforce / sever edges; **Retribution** |
| **Qi Karma Dao** | Comprehend consequence; **Seer hints** (tendency copy) | No anchor momentum by default |
| **Fate Root** | **Stream on anchor** (momentum) | **Nudge / shear** rolls & telegraphs |

Seer Asha is **Karma Dao UI** today with **tendency** wording — good precedent for Fate tooltips. Fate-primary adds **mechanical bias** Seer hints do not.

---

## Heaven, mandate, and abuse

- **Small personal nudge in duel** — heaven accountant **does not care**.
- **Institutional tilt** — optional light log; spam → heat.
- **Forge mandate omen / fake celestial edict** — **NHK** (`forbidden_art` / `mandate_tamper` lean) — same family as Karma fabricating guilt.

Heaven **acts at gates**; Fate **does not** replace tribulation — it makes **bad seasons** ([`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md)).

---

## Immortal layer (already locked — do not undercut)

From [`immortal-powers-adaptation.md`](immortal-powers-adaptation.md):

- **Rewriting a named fate** — Taboo-class, once, world remembers.
- **Reading who wins the war** — refused.
- **Seeking script-sight** — pressure + **false branches**, not edit.

Spirit Fate apex (**Sect Fortune Collapse**) stays **below** Taboo: **scheduled misfortune pack** on one org anchor, not “delete dynasty from timeline.”

---

## Owner checklist (accept / reject features)

Before adding a Fate art or inherit:

1. Does it require a **unique future fact**? → **Reject** or downgrade to **biased roll**.
2. Does it **move time** or grant **extra actions via freeze**? → **Time Dao** or reject.
3. Does it **settle moral debt** for damage? → **Karma**.
4. Does it **patch your root against heaven**? → **Fate rite** + NHK.
5. Does it only **tilt momentum / telegraph imminent line / bias next thread roll**? → **Fate Root** ✓

---

## Open questions

- [ ] **Hanzi in UI** — show **运** vs **气数** on inspect panel, or one “Fortune” bar with tooltip?
- [ ] **Dao Seeking** fate-flavoured laws — comprehend bonus to **read** only, or also **nudge** (stacking risk)?
- [ ] **Thread Glimpse** final name — keep or rename to drop “thread” (Karma collision)?
- [ ] **False branch rate** on crude Glimpse — fixed % vs realm delta?
- [ ] **Event slots** registry — who owns exam/marriage ids (chronicle vs zone)?

---

## Related docs

- [`soul-root-dao.md`](soul-root-dao.md) — Fate inherit ladder, fortune stream fields
- [`root-rite-formations.md`](root-rite-formations.md) — **not** Spirit Fate
- [`immortal-powers-adaptation.md`](immortal-powers-adaptation.md) — Time & prophecy refusal
- [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md) — Seer / karma reading hints
- [`jianghu-situation-threads.md`](jianghu-situation-threads.md) — roll bias target
