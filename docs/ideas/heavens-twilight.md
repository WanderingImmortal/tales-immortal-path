# Heaven's Twilight (天暮 · working name)

| Field | Value |
|-------|-------|
| **Status** | `idea` — owner spark, not fleshed |
| **Blocked on** | Cosmology pass (where it sits vs mortal map / immortal layer / pocket realms); whether “no Dao” is literal rules or narrative |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent idea park, 2026-10-03 |
| **Updated** | 2026-10-03 |

> **Do not implement yet.** Place / sub-realm sketch only.

## Intent

A **distinct place** (sub-realm, borderland, or sky-edge pocket — TBD) where **Dao does not hold** and **qi may be absent or useless**. Power here favors **body cultivation**, **high martial / weapon intent**, and possibly **soul-path** strength — anything that does not depend on circulating heaven-aligned qi or manifesting a Dao.

It should feel like walking into **twilight at the edge of heaven’s jurisdiction**: not Chaos remaking law, not a sect domain — **absence**. Qi-path elites who built their identity on dantian and manifestation should feel **stripped or muted**; body lords and intent apexes should feel **at home or terrifying**.

Related hooks (when this matures): [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md), [`body-martial-intent.md`](body-martial-intent.md), [`intent-apex-self-will.md`](intent-apex-self-will.md), [`spirit-path-full-design.md`](spirit-path-full-design.md), [`post-immortal-cosmology.md`](post-immortal-cosmology.md), [`void-temple-sect.md`](void-temple-sect.md) (pocket realms), [`domain-system.md`](domain-system.md) (inverse pressure?), [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md).

---

## Owner spark (2026-10-03)

| Thread | Notes |
|--------|--------|
| **Name** | **Heaven's Twilight** (天暮?) — evocative; hanzi / English lock open |
| **Dao** | Place is **devoid of Dao** — manifestations, domain claims, and “law sympathy” may not apply |
| **Qi** | **Maybe** devoid of qi as well — or qi exists but **cannot be gathered / refined** (distinction matters for NPC ecology) |
| **Who rules** | **Body cultivators**; cultivators of **high intent realms**; **maybe soul cultivators** too |
| **Form** | Sub-realm, region, or travel destination — **not decided** |

---

## Design notes (brainstorm — not owner-locked)

### What “no Dao” might mean in sim terms (later)

| Strictness | Game feel |
|------------|-----------|
| **Hard null** | `resolveHit` / manifestation riders off; domains cannot be asserted; tribulation qi absent |
| **Soft null** | Dao arts work at **stub / mundane** tier only; intent and body scale normally |
| **Asymmetric** | **Outgoing** Dao suppressed; **incoming** from outside still hurts (invasion fantasy) |

Pick one when cosmology slot is chosen — don’t code flags until then.

### Who thrives vs who suffers

| Path | Likely feel |
|------|-------------|
| **Qi / Dao** | Weak, desperate, or reliant on **stored** treasures and pre-cast seals |
| **Body** | Native advantage — vessel, force, endurance |
| **Intent (武意 / weapon intent)** | High intent realms as **local aristocracy** — will without heaven’s channel |
| **Soul / spirit** | Owner lean: **maybe** co-rulers — soul strength without dantian qi? Needs spirit-path design alignment |

### Story hooks (optional)

- **Refuge** for body-path exiles when qi orthodoxy wins on the continent.
- **Prison** or **exile strip** — heaven’s twilight as **margin of the mandate** (see [`post-immortal-cosmology.md`](post-immortal-cosmology.md)).
- **Resource** — something grows only where Dao doesn’t (rare body materials, intent fossils, soul ore).
- **Contrast** with Void Temple’s **Little Heaven** — both pockets, opposite vibes (prison paradise vs dao-dead twilight).

---

## Prerequisites

- [ ] Decide **layer**: mortal map region vs post-ascension layer vs singular pocket realm
- [ ] Lock **qi rule**: absent vs present-but-dead vs player-only debuff
- [ ] Lock **Dao rule** (hard vs soft null) and interaction with [`domain-system.md`](domain-system.md)
- [ ] Confirm **soul-path** role if spirit design says soul can operate without ambient qi
- [ ] Entry / exit fantasy (Void Gate–like, natural rift, realm-claim bleed, tribulation overshoot)

---

## Open questions

- **天暮** vs other names — tie to [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md) or separate?
- Is this **one** place or a **class** of twilight margins (like realm-claim edges)?
- Do **mortals** live here, or only cultivators who adapted?
- Are **formation arrays** and **forging** (non-Dao crafts) unaffected — creation path still viable?
- Political shape: body **clans**, intent **warlords**, soul **covens**, or mixed **triarchy**?
- Relation to **Vajra Ridge** and other body great sects — homeland, colony, or myth?

---

## Implementation crumbs (when promoted)

Likely touch: world travel / pocket realm loader, combat modifiers on `G.location` or realm flags, intent/body buff hooks — **not** a parallel damage pipeline ([`client-migration-guardrails`](../../.cursor/rules/client-migration-guardrails.mdc)).
