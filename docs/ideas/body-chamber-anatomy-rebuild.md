# Body chamber — silhouette rebuild & anatomy pass

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | none (Phase 1 is the prerequisite for Phases 2–3) |
| **Issue** | none yet |
| **Chat / PR** | Skeleton redesign — [PR #80](https://github.com/WanderingImmortal/tales-immortal-path/pull/80) (`cursor/anatomical-skeleton-overlay`) |
| **Updated** | 2026-07-27 |

## Intent

The Body Cultivation Chamber should read as **one coherent cultivator body** seen in x-ray, not five unrelated diagrams stacked on the same picture. Every layer (skin, flesh, bones, organs, blood, meridians, nerves) should share one figure, one centre line and one set of anatomical landmarks — and then the whole thing should transform as you refine, the way body cultivation is supposed to: mortal bone → jade → gold → immortal.

Phase 1 rebuilds the silhouette so the layers have somewhere accurate to live. Phase 2 re-fits the four broken layers. Phase 3 adds the xianxia identity on top.

---

## Where things stand

**Bones (shipped, PR #80).** 111 paths, anatomically placed, fitted to the current silhouette and mirrored about x = 104. Skull, 22 vertebrae + sacrum + coccyx, 12 rib pairs + sternum + costal margin, shoulder girdle, paired forearm/lower-leg bones, hands, pelvis, feet, and marrow at the real red-marrow sites. This layer is the reference for everything else.

**Everything else is misplaced.** Flesh, organs, blood, nerves and the meridian stars were authored for a wider, arms-out figure and are largely drawn outside the body, where the silhouette mask throws them away. Numbers in Phase 2.

---

## Measured facts (do not re-derive these)

Current silhouette: `index.html` → `<path id="body-silhouette-path">`, viewBox `0 0 206.326 206.326`.

**Centre line is x = 104.01**, constant from crown to sole (sampled every 8 units). Bones use 104.0. **Every other layer uses 103** — that one-unit drift is a real bug, not a rounding artefact.

Silhouette cross-sections (x spans at a given y; multiple spans = arm gap open):

| y | spans | meaning |
|---|-------|---------|
| 8 | 94.6–113.4 | cranium |
| 16 | 93.0–115.0 | head widest |
| 24 | 97.2–110.9 | neck |
| 40 | 78.6–129.4 | shoulders / acromion |
| 48–64 | 77.0–131.0 | **arms merged into torso — no gap** |
| 66 | 76.7–87.0 · 121.4–131.5 | arm gap finally opens |
| 76 | 74.0–87.7 · 123.3–134.0 | elbow level |
| 88 | 71.0–81.6 · 87.8–120.4 · 126.4–137.1 | forearm / waist |
| 96 | 70.0–78.0 · 85.4–122.7 · 130.7–138.2 | wrist approach (forearm only 8 wide) |
| 104 | 65.2–75.3 · 83.5–124.5 · 132.8–143.2 | hand / hips widest |
| 118 | crotch notch at 104.8 | **0.8 right of true centre** |
| 128 | 85.4–105.0 · 105.0–122.6 | thighs (touching) |
| 152 | 88.6–99.7 · 108.5–119.6 | knee |
| 164 | 86.8–99.3 · 108.8–121.3 | calf widest |
| 192 | 93.2–100.6 · 107.6–114.8 | ankle (only 7.4 wide) |
| 200 | 91.8–105 · 105.8–116.7 | foot |
| 205 | — | sole |

Skeletal landmarks currently in use (keep these; the rest of the body should agree with them):

| Landmark | y | Landmark | y |
|---|---|---|---|
| Skull vault top | 3 | Xiphoid / sternum tip | 67.6 |
| Chin | 23 | Costal margin low point | 76 |
| C2 → C7 | 24.6 → 33 | L1 → L5 | 77.2 → 90.8 |
| Sternal notch / clavicle | 38.4 | Iliac crest | 90.4 |
| Glenohumeral joint | 43.6 | Hip joint (femoral head) | 105.4 |
| T1 → T12 | 37.2 → 73.5 | Pubic symphysis | 111 |
| Ribcage widest (half-width 14.8) | 53–61 | Knee joint | 150.6 |
| Elbow | 75.5 | Ankle | 190 |
| Wrist | 101 | Sole | 205 |

---

## Phase 1 — rebuild the silhouette (do this first)

### Hard constraint: keep the coordinate system

Do **not** change the viewBox, the overall height, the centre line, or any vertical landmark above. Only the limb outlines change. This keeps the shipped skeleton valid apart from the arm/hand bones, instead of forcing a full re-fit of work that is already correct.

- viewBox stays `0 0 206.326 206.326`
- centre stays **x = 104.0**
- crown ≈ y 1, sole ≈ y 205

### What actually changes

1. **Cut the figure into parts.** Today it is one continuous clip-art outline, and the hover regions are faked by masking it with hand-drawn black rectangles and curves (`body-mask-head`, `body-mask-ribs`, `body-mask-arm-l`, …). Replace with one path per part:

   `sil-head`, `sil-neck`, `sil-torso`, `sil-upper-arm-l/r`, `sil-forearm-l/r`, `sil-hand-l/r`, `sil-thigh-l/r`, `sil-shin-l/r`, `sil-foot-l/r`

   Rendered together they read as one body (overlap at the joints; same fill, no internal strokes). Each region mask then becomes "use this part path as the white shape" — no more black-rectangle subtraction, and hover/click regions become exact.

2. **Open the arms.** Currently the arms hug the body and only separate at y = 66; the armpit gap should start at about y = 50. Angle each arm outward roughly 8–12° from vertical so there is clear background between arm and torso for the whole length.

3. **Widen the limbs** so five layers of detail can live inside them. Minimum widths:

   | Part | Now | Target |
   |------|-----|--------|
   | Upper arm | ~11 | ≥ 13 |
   | Forearm | 8 | ≥ 11 |
   | Hand | ~10 | ≥ 13 wide, ~20 long |
   | Ankle | 7.4 | ≥ 9 |
   | Foot | ~13 | ≥ 14 |

   Thigh, calf and torso are already fine.

4. **Fix the crotch notch.** The split between the legs sits at 104.3–105.2; move it to 104.0 so a mirrored pelvis reads centred.

5. **Keep the look.** Trace and re-cut the existing figure — do not draw a new one freehand. Same flat fill, same proportions, same stylised feel. A player should not notice a new character, only that the arms hang slightly freer.

### Landmark table in code

Add a single exported constant that every layer reads instead of eyeballing coordinates:

```js
const BODY_LANDMARKS = {
    centreX: 104,
    crown: 1, chin: 23, neckBase: 34,
    shoulder: 43.6, elbow: 75.5, wrist: 101, fingertip: 119,
    sternalNotch: 38.4, xiphoid: 67.6, costalMargin: 76,
    navel: 82, dantian: 97, iliacCrest: 90.4, hip: 105.4, pubis: 111,
    knee: 150.6, ankle: 190, sole: 205
};
```

### Verification script (build this, keep it)

`scripts/audit-body-overlay-fit.js` — a permanent audit, not a scratch file. It should:

1. Parse `#body-silhouette-path` (or the new part paths) from `index.html` into a polygon by flattening M/L/C/Q/Z, both absolute and relative.
2. Extract `BODY_BONE_DEFS`, `BODY_MUSCLE_DEFS`, `BODY_ORGAN_DEFS`, `BODY_BLOOD_DEFS`, `BODY_NERVE_DEFS`, `BODY_MERIDIAN_STAR_POINTS` from `body-chamber.js` by slicing between the const declarations and `eval`-ing the slice.
3. Sample points along every path, ray-cast for inside/outside and compute distance to the nearest polygon edge — signed clearance.
4. **Fail** if any part's clearance is less than its stroke half-width **+ 1.2** (the glow halo margin; drop shadows are 4–11 px and the group is hard-masked, so anything closer gets sliced flat).
5. Print worst offender per part with its coordinate, so the fix is obvious.

Wire it into `scripts/pre-pr-check.sh` / `.ps1`.

---

## Phase 2 — re-fit the layers (after Phase 1, never before)

Numbers below are clearance in silhouette units; negative = drawn outside the body and discarded by the mask.

**Flesh / muscles** — worst layer by far. Deltoid −19.1, bicep −17.1, elbow tendon −15.3, shoulder tendon −15.0, forearm −15.0, wrist tendon −14.8, achilles tendon −11.1, calf −8.4, trap −4.1, obliques −2.7, glute −2.2, quads −1.5. The arm muscles are drawn roughly an arm's length from the arm. Rebuild against the new limb outlines: pec, delt, biceps/triceps, forearm mass, trap, lats, obliques, rectus, glute, quad, hamstring, calf, plus tendons at shoulder/elbow/wrist/knee/achilles.

**Organs** — spleen −1.6, liver −1.5, kidney +0.1. Re-seat inside the **new ribcage**, not just inside the silhouette: heart behind the sternum and slightly left, lungs inside ribs 2–8, liver under the right costal margin, spleen under the left, kidneys behind at L1–L2, and add a stomach/intestine mass if the tab needs more body.

**Blood** — arm vessels −8.9, carotids −6.0, lineage −4.2, battle −2.6, leg −2.3, veins −1.2, essence −1.1. Route arteries along the new limb axes; they should visibly follow the bones.

**Nerves** — palm nerves −25.1 (drawn in empty space beside the legs), neck −8.3, leg −7.6, arm −6.9, and the spinal cord line runs down to y 195, well past the sacrum. Cord should stop at L1–L2 (~y 80) with a cauda equina fan, then peripheral nerves down the limbs.

**Meridian stars** — gallbladder at (148, 38) and small intestine at (62, 52) sit **completely outside the body**, and `#bodySilMeridianStars` / `#bodySilMeridianChannels` have **no mask**, so they are visibly floating next to the figure. Re-place all twelve on the real body and add the silhouette mask (or leave unmasked deliberately once they are inside).

**Centre line** — move every layer from 103 to `BODY_LANDMARKS.centreX`.

**Bone touch-ups** (small, can ride along): fingertips are 0.18 outside the hand; tarsals have 0.08 clearance where 0.44 is needed; fibula 0.52, carpals 0.55, metacarpals 1.10, tibial plateau 1.11, skull sides 1.27, toes 1.36, metatarsals 1.64, elbow 1.71, ulna 1.80, tibia 1.95, radius 2.30 — all inside the glow-clip threshold of ~2.0. Nudge inward, and add a `--bone-glow` scale so fine bones near the edge glow less.

---

## Phase 3 — the xianxia layer

### 3a. Bone quality ladder

Refinement should visibly transmute the skeleton, not just brighten it. Drive a `--bone-tier-color` from bones-layer progress (optionally gated by realm as well):

| Progress | Tier | Look |
|---|---|---|
| 0–20% | Mortal bone | dull grey-brown, no bloom |
| 20–45% | Tempered / iron bone | ivory, faint glow |
| 45–70% | Jade bone (玉骨) | pale green translucence |
| 70–90% | Gold-veined bone | ivory with gold veining along the shafts |
| 90–100% | Immortal bone (金身) | radiant white-gold, strong bloom |

Cheapest implementation: JS sets one custom property on `#bodySilBones`; existing colour-mix rules follow it.

### 3b. Marrow cleansing (易筋洗髓)

Marrow is already a 50% sub-unlock. Make it a two-stage arc instead of a static red fill: **red mortal marrow** on unlock → **golden marrow** when the marrow action maxes, with a pulse that climbs the spine into the skull (the niwan palace). Animate along `bone-marrow-spine` with a gradient or dash offset.

### 3c. Cultivator landmarks on real bone

The spine is now an actual vertebra stack, so the Governing Vessel checkpoints can be anchored properly:

- **Weilu** (尾闾) at the coccyx — (104, 111)
- **Jiaji** (夹脊) at T7 — (104, 57)
- **Yuzhen** (玉枕) at the occiput — (104, 18)

Draw as small rings on the spine; light them as the meridian layer progresses. They are exactly the passes the existing `microcosmic` orbit runs through, so the bones and meridians tabs start reinforcing each other.

Add the **lower dantian** at (104, 97) — three cun below the navel, between the ilia — as a shared landmark visible in the body chamber and referenced by the qi chamber, so both screens agree where it is.

### 3d. Later, if wanted

Bone patterns (骨纹) — faint etched runes on femur/humerus/skull above ~85% refinement. Fracture states — hairline cracks tied to tribulation marks that heal as you re-refine.

---

## Prerequisites / order

- [ ] Phase 1 silhouette rebuild + landmark table + fit audit script
- [ ] Phase 2 layer re-fits (flesh → organs → blood → nerves → meridians, any order after Phase 1)
- [ ] Phase 3a/3b (independent of Phase 2; only needs bones, which are shipped)
- [ ] Phase 3c after meridians are re-fitted

## Open questions

- Is the opened-arm pose acceptable visually, or should the figure keep its current tight stance and we accept cramped limb layers?
- Is the silhouette reused anywhere outside the body chamber (soul chamber? creation screen?) — check before re-cutting.
- Should bone tier be driven by bones-layer progress alone, or gated by cultivation realm as well?

## Implementation crumbs

- `index.html` — silhouette path, all `body-mask-*` defs, `.body-sil-region` groups, overlay `<g>` elements (note `#bodySilMeridianStars` / `#bodySilMeridianChannels` have no mask)
- `body-chamber.js` — `BODY_SILHOUETTE_REGIONS`, `BODY_MUSCLE_DEFS`, `BODY_BONE_*`, `BODY_ORGAN_DEFS`, `BODY_BLOOD_DEFS`, `BODY_NERVE_DEFS`, `BODY_MERIDIAN_STAR_POINTS`, and the `render*Overlay` functions. Bump the matching `*_LAYOUT_VERSION` whenever a defs list changes or the built group will not rebuild.
- `style.css` ~9280–9700 — overlay rules per layer.
- **Pitfall already hit once:** `.body-sil-overlay path:not(.body-sil-muscle):not(.body-sil-tendon):not(.body-sil-nerve-line):not(.body-sil-bone)` sets `fill: var(--body-layer-color)` and beats both the per-layer rules and the `fill="none"` attribute set in JS. Any new overlay kind that must stay unfilled has to be excluded there too.
- **Mirroring:** `mirrorBoneD()` in `body-chamber.js` reflects an absolute-coordinate path about the centre line. Reuse it for muscles/vessels/nerves so the two halves cannot drift apart — author the viewer-left side only.
- Cheap verification: run the audit script and read the numbers. Only take screenshots at the very end, and screenshot the `.body-silhouette-svg` element from a small standalone preview page — loading the full game page into a browser tool dumps an enormous accessibility snapshot.
