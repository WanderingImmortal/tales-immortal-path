# Celestial Avatar (法相) — qi idx 4 realm and system

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner direction locked 2026-09-26; bands, numbers, clash math open) |
| **Blocked on** | Nine-realm ladder in code; [`domain-system.md`](domain-system.md) (GC domain — the avatar is its next scale step); [`city-tiers.md`](city-tiers.md) civic tiers |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-09-26 (`cursor/spirit-path-stats-design-docs-39a3`) |
| **Updated** | 2026-09-26 |

Ladder context: [`nine-realm-ladder.md`](nine-realm-ladder.md) § Idx 4 (genre survey, why the dharma image is what's left). Claims row: [`realm-claims.md`](realm-claims.md) idx 4. Peers: GC **Domain** ([`domain-system.md`](domain-system.md)), NS **Sovereignty**, VR **Passage**.

---

## Intent

**Celestial Avatar** is the qi-path realm after Nascent Soul and the system that comes with it. The refined nascent soul (元婴, the qi infant) **matures, merges back into the cultivator, and is turned outward**: the cultivator's presence stands up as a **giant visible image over a region** — the genre's 法相 (dharma image / avatar).

Owner: idx 4 is **where an individual starts to hold regional power**. The avatar is what that looks like. Until now it has not existed in lore or code; this doc makes it a system, not a title.

One line: *Golden Core pressed on a room. Nascent Soul pressed on a city. The Celestial Avatar stands over the region, and the region knows it.*

**Lane check:** qi projects an avatar · body **becomes** the transformed physique (Physique Transformation) · spirit **leaves** the shell (Soul Transformation). Three different idx-4 "outward steps", one per lane.

---

## Design notes

### What it is (and is not)

| Is | Is not |
|----|--------|
| **You**, at region scale — the matured nascent soul given a form the world can see | A summon, pet, or separate creature |
| Coloured by **root + Weapon Intent + foundation nature + core grade** (sword cultivator's avatar carries a sword; flame root burns) — same rule as GC domain: untagged power, tagged presentation | An elemental stat block (`fire_avatar`) |
| **Patriarch-tier**: peak inner elders / 1st-tier city lords are this realm ([`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)). Seeing one raised is an **event** the living board remembers | Something every mid-realm NPC has |
| Heaven-visible — raising it is noticed | Free |

### The realm journey — raising the avatar (bands)

Same Early → Mid → Late → (Peak) band shape as QC. Breakthrough **into** the realm = the **fuse** (infant merges; tribulation beat). The **avatar itself is raised across the realm.**

| Band | Avatar | Can press | Combat |
|------|--------|-----------|--------|
| **Early — Faint** | Silhouette; no features | 4th-tier towns (Redwell), outposts | Stance costs high, gain small |
| **Mid — Clear** | Features; root / intent visible | 3rd-tier zone capitals | Full stance |
| **Late — Towering** | Fills the sky over a settlement; region-scale jurisdiction | Contest 2nd-tier; peer to 1st-tier lord's face | Suppresses lower-realm arts |
| **Peak — Radiant** *(optional)* | Light; ready to be hollowed by void | Contest 1st-tier | Ready for VR breakthrough; slightly harder trib |

Band names are working labels — avoid *Manifest* (显法) and *Sovereign* (NS claim).

### How it is trained (three inputs — this realm is not sit-and-cultivate only)

| Input | Grows | Notes |
|-------|-------|-------|
| **Qi cultivation** (existing gather / chamber loop) | Avatar **mass** | Same dantian loop as every qi realm |
| **Invocation** — every time it is raised (press, fight, quell) | Avatar **clarity** (diminishing per band) | The avatar learns its own shape by being used. **Regional power grows by acting in the region.** |
| **Deeds** — won clash, quelled disaster, held a claim through a season | Band **milestones** | Insight-event gates, mirroring body milestones and spirit gates |
| **Echo** from GC core grade + NS consolidation tier | Starting clarity **cap** | Hasty core → avatar cracks under load (extends the hasty / settled / peak tier scale) |

Optional material lane later: sky-tier herbs, claimed spirit veins ([`cultivation-sites-and-claims.md`](cultivation-sites-and-claims.md)) as **anchors**.

### What it does (uses)

**1. Press (civic) — the headline.** Raise the avatar over a settlement.

- Your **avatar weight** vs the settlement's **civic tier** ([`city-tiers.md`](city-tiers.md)) and its seated power ([`civic-seats-generator.md`](civic-seats-generator.md)).
- Weight ≥ tier → **deference**: seats treat with you, terms improve, tolls waived, recruitment opens, rivals stand down. Non-combat wins, per [`domain-system.md`](domain-system.md).
- Weight < tier → **clash** with the seated power's avatar / array (below).
- Cost: qi; a **heaven's-notice** tick (tribulation ledger); repeatedly pressing mortals → alignment / reputation ([`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md)).
- Living board / chronicle: *"A celestial avatar stood over Redwell for an hour. The lord did not come out."*

**2. Combat stance — Raise Avatar.** Qi-path secondary verb at idx 4+ (qi currently has *Defend*; body *Fortify*; spirit *Intimidate*).

- Costs Breath per turn while raised; drops when Breath runs low.
- Lower-realm enemies **fold** before blades cross (domain rule scaled up); equal realm → clash.
- Techniques cast through the avatar are **amplified** and carry its colour; enemy techniques two+ realms below are **dampened** (lighter than DM's "muffle").
- Under the guards model ([`stats-to-meters-rework.md`](stats-to-meters-rework.md)): the avatar is an **outer barrier layer** while raised — hits test it first; if it cracks, the stance drops.

**3. Jurisdiction / claim.** GC domain = "my ground" in a city; avatar = **my region**. Claim a zone: sites and veins yield, travel friction in-zone drops, rivals need a clash to enter. Reuses [`realm-claims.md`](realm-claims.md) jurisdiction job.

**4. Reputation surface.** NPC rumour, sect histories, patriarch audiences: *"the one whose avatar carries a sword."* Feeds [`dustbone-living-board.md`](dustbone-living-board.md) and chronicle without bespoke scripting.

### Clash (avatar vs avatar / seat / array)

Extends domain clash 1:1 — **contest, don't merge**.

1. Weight contest: band, clarity, core grade echo, cracked penalty, home ground.
2. Winner: opponent avatar **shattered for the scene**; their techniques penalised; civic outcome swings.
3. Stalemate: both dampened; settlement stays neutral.
4. Loser: avatar shattered; **band regress risk** if outmatched by two bands; heaven's notice.

Formations are pre-laid **fake avatars** (great sect gates, imperial heart) — Threshold City and Longcheng suppress without a fair clash, per city-tiers zone context.

### Costs and risks (the price slot)

- Every raise is **heaven-visible** → tribulation severity ledger; patriarchs move rarely for this reason ([`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) "heaven's debt").
- Overuse → dantian **strain** (Breath cap down until rest).
- Clash loss → shatter; two-band loss → regress.
- Hasty core / rushed NS → avatar **cracks** under Towering load.

### What happens to it after this realm

The avatar does **not** go away; each later realm changes what it is.

| Realm | The avatar becomes |
|-------|--------------------|
| **5 Void Refinement** | **Hollowed.** Void qi is refined *inside* the avatar's region. Blink / void skip ([`realm-claims.md`](realm-claims.md) Passage) = the avatar folding space it already stands over. **Remote presence**: appear over a distant settlement you have anchored. Owner rule holds: VR breakthrough ≈ avatar Peak until void qi is cultivated inside. |
| **6 Dao Seeking** | **A lens.** The avatar's shape was a crude shadow of a Law; seeking begins by reading your own avatar. Laws found **colour** it (library grows; avatar gains facets). Mandate at breakthrough = the region *recognises* the avatar. |
| **7 Dao Manifestation** | **The worn law.** The one active law is worn **by the avatar** — a sword avatar that *is* Sword Law. "Muffle weak techniques" at region scale is the avatar doing it. Swapping the worn law re-forms the avatar (cost). |
| **8 Immortal Ascension** | **Coincides with the self.** Avatar and cultivator are one thing; it is how mortals perceive an immortal. When the immortal leaves the mortal map, the avatar is the **echo** left behind (shrine / legend). Detail with [`immortal-world-layer.md`](immortal-world-layer.md). |

---

## Prerequisites

- [ ] Nine-realm ladder in code (idx shift) — [`nine-realm-ladder.md`](nine-realm-ladder.md)
- [ ] GC domain weight formula exists ([`domain-system.md`](domain-system.md)) — avatar weight extends it
- [ ] Civic tier + seat weight readable per settlement ([`city-tiers.md`](city-tiers.md), [`civic-seats-generator.md`](civic-seats-generator.md))
- [ ] Guards model for the combat barrier layer ([`stats-to-meters-rework.md`](stats-to-meters-rework.md))
- [ ] NPC patriarch / 1st-tier lord avatars (enemy side) so clashes exist

## Open questions

- Band names: Faint / Clear / Towering / Radiant are working labels — owner pass.
- Does invocation growth apply to **pressing mortals**, or only to clashes and deeds (to avoid "bully villages to level")?
- Clash math: one weight number (domain formula extended) or band-vs-band table?
- Hanzi for the realm: 法相境? (化神 dropped — lane rule.)
- Is the avatar visible to **players below idx 4** only as text/rumour, or as a UI element on the town screen?
- Dual cultivators: does a body-track Physique Transformation change the avatar's form?

## Implementation crumbs

- `data.js` — `PATHS.qi.realms[4]` (after ladder shift), `COMBAT_PATH_CONFIG.qi.secondaryAction` (`defend` → gated `raise_avatar` at idx 4+), enemy defs for idx 4+ NPCs
- `combat.js` — stance state like `fortifyActive` / `voidStepActive`; barrier layer in `applyDamageToPlayer`
- `realm-claims.md` idx 4 row — claim renamed **Avatar**
- Civic: `civic-seats-generator` weight compare; living board rumour hook
- `tribulation.js` — heaven's-notice ledger tick on raise
- Domain: `domain-system.md` weight stub → shared `getPresenceWeight(realmIdx, band, grade, …)`
