# Player organization paths (hall → sect → join → inherit)

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner review — core decisions locked) |
| **Blocked on** | [`personal-residence.md`](personal-residence.md) per-city dwelling; [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) for minor-sect join |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning, 2026-08-01 |
| **Updated** | 2026-08-01 |

## Intent

Player progression through cultivation organizations should match xianxia — not only **found a sect at GC and drag it around the map**. Parallel paths:

1. **Hall** (Peak FE) — city politics, rent/buy space, local disciples
2. **Sect** (GC+) — anchored mountain/compound, build over time
3. **Join** — great or minor sect; rise through ranks; skip founder investment
4. **Inherit** (rare) — talisman deed, ancient claim, story arc

Hard line A from [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) applies to the **world**; player can walk any path below.

## What exists today (gaps)

| Piece | Today | Gap |
|-------|-------|-----|
| Founding gate | `minRealm: 2` (GC), fame + stones | No hall phase; no join path |
| Location | `foundedZone` = where you stood; `influenceZone` at Regional | **HQ follows player metaphorically** — no fixed mountain |
| Personal anchor | `G.dwelling` rent/buy Redwell | Separate from sect — good |
| Great powers | `FACTION_DEFINITIONS` rep, quests | Player is always independent founder |
| Buildings | Sect grounds tab | Assumes you already have a sect |

## Path overview

```text
                    ┌── Join great sect (authored) ──────────────┐
                    │                                            │
Peak FE ──► Hall? ──┼── Join minor sect (procedural, later)     ├──► Inner court / elder / leave
                    │                                            │
                    └── Skip hall ───────────────────────────────┘
                              │
                         Golden Core
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         Found sect      Inherit claim    Stay joined
         (pick site)     (story arc)      (promotion track)
```

---

## Path 1 — Hall (Peak FE)

**Who:** Player wants local influence without a mountain yet.

**Mechanics (reuse mortal-life-sim):**

- Found **hall** at Peak FE + fame/stones (lighter than sect founding)
- **Anchored to `settlementId`** — Redwell courtyard lease, not a wandering flag
- Rent → buy hall space (extend [`personal-residence.md`](personal-residence.md) or `G.hall.lease`)
- **City politics:** standing with city lord, branch pressure, charter fees ([`city-tiers.md`](city-tiers.md))
- Recruit **local disciples** (small cap); teach basics; local renown
- Tab: **Hall** or early **Sect** tab in "hall mode" — TBD UI

**Ascension flow (owner — H3 with phases):**

1. **GC + hall** → option to ascend (not forced; can stay hall-only run)
2. **Pick site** (S4 hybrid) → begin **construction** at mountain (months + resources; sect not fully live)
3. **Migrate** when core buildings ready — HQ moves to `headquartersNodeId`
4. **Hall choice** — keep as **branch** (city office) or **close** (sell lease, disciples follow / scatter)

Branch is **opt-in after migration**, not default. Light management: steward or wages, local income trickle, charter upkeep — neglect → decline events. Not free upside; not punishing if player opts out.

---

**Pushback / fit:** Don't build a second city sim. Hall politics = **standing + events** (branch undercut, warden shakedown, charter renewal) — same vitals fake as background sects.

---

## Path 2 — Sect (GC+)

**Who:** Player wants institutional power on cultivation ground.

**Founding (changed from today):**

- Gate at **GC** (or ascend from hall)
- Pay **major** founding cost — fund mountain compound, arrays, initial halls
- **Pick HQ site once** — see Site selection (open — **next owner question**)

**HQ must not follow the player.** Pattern:

| Field | Meaning |
|-------|---------|
| `headquartersNodeId` | Fixed local-map node (mountain, valley, ruin) |
| `foundedZone` | Zone containing HQ |
| `influenceZone` | Political reach (can expand later; HQ stays) |

Player **travels to sect** (Depart grounds / messenger / map). Cultivation at HQ uses sect buildings; on road = travel kit + personal dwelling only.

**Build over time:** existing sect buildings loop — unchanged in spirit, but construction happens **at HQ**, not wherever you stand.

**Skip hall allowed:** GC founder who never ran a hall picks site and pays premium (no local renown buffer, no city student pipeline).

### Site selection (S4 hybrid — owner locked)

| Tier | On map at GC? | Quality | How you get it |
|------|---------------|---------|----------------|
| **A — Contested** | Yes | Best veins | Defeat holder, negotiate, or inherit |
| **B — Open** | Yes | Decent | Claim now; procedural sect may take if you wait |
| **C — Hidden** | After discovery | Good (B–A) | Clue chain + survey **project** |
| **D — Legendary** | Story only | Exceptional | Arc / unseal / inherit |

**No search-button spam.** Clues (rumor, explore, rep) unlock survey eligibility → one **project** (months + cost) → maybe reveal **C** on map, or dead end.

**Clue source (owner): C3 mix, mortal-first flavor**

- **Procedural vague rumors** — inn gossip, porter, fisherman: *"north spring tastes wrong"*, *"birds won't cross that ridge"* — not vein tier, not coordinates. Sources **below GC** who don't know value (mortals, QC/FE locals). GC peers already claimed what they recognized.
- **Authored anchors** — best hidden **C** and all **D** sites tied to quests, faction rep, unseal arcs — not pub RNG.
- **GC doesn't "talk down"** — passive **overhear** while resting, trading, Look Around; optional bribe/info broker. **Domain/Perception** ([`realm-claims.md`](realm-claims.md)) feels "off" qi in-region — rumor gives *where to look*, sense says *worth surveying*.
- **Vague → survey → maybe reveal** — rumor alone never puts **C** on map; unlocks survey eligibility only. Dead ends common.

**Sense gate (owner):**

| Site type | Rumor | Spiritual sense | Survey |
|-----------|-------|-----------------|--------|
| **B — Open** (normal) | Optional | Not required | Claim on map |
| **C — Hidden** (good normal) | Unlocks region | Optional — better odds | Project |
| **C+ / unique** | Vague gossip only | **Required** | Then project |
| **D — Legendary** | Authored arc | Required + story keys | Arc only |

**`siteKind` on nodes:** `vein` | `spring` | `ore` | **`unique`** — unique = special mechanics later (not just +% vein). Sense gate reserved so uniques can't be pub-rumored into existence.

**Opportunity cost:** while surveying, **B** sites get claimed; **A** fights stay valid. Three strategies, not one optimal grind.

---

## Path 3 — Join (great or minor)

**Who:** Player skips founder grind — genre classic (outer disciple → inner → elder).

**Great sect (ship first):**

- Use `FACTION_DEFINITIONS` + existing rep/quests
- New: `G.affiliation = { kind: 'member', factionId, rank, joinedAtMonths }`
- **Disable** player hall/sect founding while member (or require leave ceremony)
- **No hall while joined** (owner) — clean cut; running your own teaching institution competes with oath. Personal **residence** OK ([`personal-residence.md`](personal-residence.md)). Rare sect-specific exceptions possible later as authored policy flavor — default **most sects forbid**.
- **Join requirements:** **T3 deferred** — per-sect gates (talent, root type, etc.) defined in identity docs when join path ships; not one global realm floor.
- Progression: outer → inner → core → elder (per sect identity docs)
- **Lineage manuals**, sect missions, politics — leverage crafted content

**Minor / procedural sect (later):**

- Requires zone ecology registry
- Same affiliation struct; shallower tree; easier leave; less reward ceiling

**Pushback:** Join path is **not** "further off" — it's one of three equal pillars. Can ship **great-sect join** before procedural minors exist. Many players will want Celestial Sword more than founding Iron Reed #47.

**Leave / expulsion:** must exist before join ships — heretic, failure, voluntary leave with grudge.

---

## Path 4 — Inherit / claim (rare)

**Who:** Xianxia luck — talisman deed, ancestor's seal, extinct sect remnant.

**Not a default path.** Story arcs only:

- Ancient site unseal → deed item → claim `headquartersNodeId` of ruin
- Procedural extinct sect → "last patriarch's token" event
- Reincarnation reclaim (stretch) — [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md)

**Grants:** pre-built ruin tier buildings, enemy grudges, incomplete arrays — **inherit problems**, not free win.

**Pushback:** Gate behind chronicle/ancients/subzone content. Don't let random drops skip GC founding costs entirely — compress or discount, not bypass. **Owner:** inherit = later phase; compelling that claims bring **enemies and broken arrays**, not a free HQ.

---

## GC without full sect (hermit fortify)

**Owner:** At GC, claiming territory without founding a sect should be viable — personal residence + fortify (arrays, guards). Overlaps [`personal-residence.md`](personal-residence.md) / [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md). Not a sect: no disciple institution, no jianghu sect politics — **domain + home**.

**Fortify → sect (owner):**

| Choice | What happens |
|--------|----------------|
| **Convert** (default) | Same `headquartersNodeId` — fortify becomes sect HQ; residence layers into sect grounds. Obvious path; sect residence covers personal anchor. |
| **Keep + found elsewhere** | Allowed — hermit cave stays private; second site needed for sect (S4 pick again). Niche: secret retreat vs public mountain gate. No heavy penalty — just two sites to manage. |

**No forced reason to avoid convert.** If player fortifies then founds at same node, it's one click/narrative step, not a rebuild from scratch.

## Management depth (later)

Hall: light management (lease, a few disciples, city standing). Sect: deeper (buildings, diplomacy, territory). Ship management layers after anchor + join paths — not day one.

---

## Storage sketch

```javascript
// Mutually exclusive top-level kind
G.organization = {
  kind: 'none' | 'hall' | 'sect' | 'member',

  // hall
  hall: { settlementId, lease, localRenown, disciples, ... },

  // sect (existing G.sect evolved)
  sect: { headquartersNodeId, foundedZone, influenceZone, buildings, ... },

  // join
  affiliation: { factionId, rank, sectName?, obligations }
}
```

Migration: current `G.sect` → `kind: 'sect'` with retroactive `headquartersNodeId` from `foundedZone` default node.

---

## Pushback summary (owner ideas)

| Idea | Verdict |
|------|---------|
| Hall at FE + city politics | **Yes** — reuse dwelling + standing; event-driven |
| GC sect with build-out | **Yes** — fix anchor first |
| HQ follows player | **No** — break this; fixed `headquartersNodeId` |
| Join great sect | **Yes, high priority** — equal path; use authored factions |
| Join minor procedural | **Later** — needs ecology |
| Inherit / talisman | **Yes, rare arcs** — not baseline founding |
| Player skips hall at GC | **Allow** — optional path, higher cost / less local buffer |

---

## Prerequisites

- [x] Hard line A — hall vs sect vs branch (world)
- [x] **Site selection** — S4 hybrid + clue/project discovery
- [ ] Per-settlement `G.dwelling` / hall lease
- [ ] `G.affiliation` + leave/join flow for one great sect (pilot)
- [ ] Map: HQ pin fixed; travel-to-sect UX

## Open questions

- [x] Sense gate — required for **unique / high-tier** grounds; optional bonus for normal hidden **C**
- [x] Hall + sect coexistence — after migration; hall → optional branch or closed
- [x] Join timing — **T3 deferred** (per-sect talent/root reqs in identity docs)
- [x] Join and hall simultaneously? → **No** (locked)
- [ ] Does inherited sect count as `kind: 'sect'` at half-built state? (defer — inherit phase)
- [x] Fortify → sect — **convert default** at same site; optional second site if keep private retreat

## Links

- [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)
- [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md)
- [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md)
- [`personal-residence.md`](personal-residence.md)
- [`cultivation-sites-and-claims.md`](cultivation-sites-and-claims.md) — site types, tiers, benefits
- [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)
