# QC sect join ladder (lesser halls · great branches · root exams)

| Field | Value |
|-------|-------|
| **Status** | `designed` (Well-Ring v1 slice drafted) |
| **Blocked on** | Owner confirm slice → implement Well-Ring |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-07-31 · Well-Ring sketch 2026-08-06 · `cursor/redwell-corrupt-hall-design` |
| **Updated** | 2026-08-06 |

**Hub:** [`dustbone-starter-gameplay.md`](dustbone-starter-gameplay.md) · [`jianghu-organization-types.md`](jianghu-organization-types.md) · [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md)

## Intent

QC density through **institutional life** — not founding a sect at realm 0. Most players **join a lesser local hall** with low standards. Ambitious players **try a great sect branch** and fail root exams unless gifted. Either path gives missions, rivals, obligations, and manuals the bazaar won't stock — without pretending Redwell is Longcheng.

## Design notes

### Three rungs (QC era)

| Rung | Where | Bar | Payoff |
|------|-------|-----|--------|
| **Lesser sect / hall** | Redwell fringe, mid city outskirts | Low — sponsor or basic trial | Missions, one rival, crude manual, ranking day |
| **Great sect branch** | Threshold, later Heartlands visit | **Root grade floor** + combat/trial | Lineage QC chapter if accepted; humiliation if not |
| **Tribal contract** | Sunscar / Miraj / Ashen | Oath, not outer court | Specialty goods, escort rep — not disciple ladder |
| **None** | — | — | Hermit, porter, merc — valid |

Founding **your own** sect stays late-game ([`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md)).

### Root exam (great branch)

Pull from [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md):

| Check | Effect |
|-------|--------|
| **Grade** (inferior / common / …) | Pass floor for outer registration |
| **Composition** | Element match to sect line (optional hard fail / scribe offer) |
| **Basin tier** | Oracle line — “heaven may permit GC”; not always hard reject at QC |

**Outcomes:** accept outer · scribe/porter offer · retry in N years · “settle for lesser hall down the road.”

Heartlands join fantasy (rep + trial) parked in great sect docs — this file is **QC-era Dustbone-first**.

### Lesser sect — what “enough” means for density

Per hall (design 2–3 in [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md)):

- Entry trial (beatable at Early QC)
- **3–5 mission types** — escort, gather, cull, deliver, internal feud
- **One named rival** outer disciple (remembers wins/losses)
- **One annual pulse** — outer ranking / small tournament
- **One manual** not on Redwell bazaar pool
- **Obligations** — miss muster → standing hit / expulsion

Does **not** replace field → brew → cultivate loop; **sits on top**.

### Missions vs jobs vs bounties

| Source | Pay | Fiction |
|--------|-----|---------|
| Redwell jobs | Stones, steady | Mortal labor |
| Bounty board | Low, combat | Personal grudges |
| Sect mission | Stones + rep + manual access | Institutional duty |
| Tribunal contract | Goods, political rep | Tribal economics — not disciple |

### Progression out of QC

- Lesser sect → FE break → stay, promote, or apply to branch again
- Great branch accept at Late QC → leave Redwell chapter with lineage breath
- Failed branch + inferior root → **accurate tragedy** — lodge life, pills, field runs

## Prerequisites

- [x] [`jianghu-organization-types.md`](jianghu-organization-types.md) locked
- [x] Well-Ring Lodge identity + v1 slice ([`dustbone-lesser-sects.md`](dustbone-lesser-sects.md))
- [x] Redwell field + alchemy loop playable
- [ ] Owner confirm v1 slice → build
- [ ] Root grade on character sheet — only needed for **great branch** exams (not Well-Ring)

## Open questions

- [ ] Multiple simultaneous memberships (guild + hall) allowed?
- [ ] Sect housing vs Redwell Inn / FE courtyard
- [ ] Transfer up from lesser to great branch — rep gate or re-exam only?

## Implementation crumbs

`sect.js` (today: found-only), `story-arcs.js` missions, `spiritual-roots-taxonomy-v2` talent fields, `action-gates.js`, future `G.membership`.
