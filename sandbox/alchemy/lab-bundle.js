var AlchemyLab = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // prototype/property-alchemy/reagents.js
  var require_reagents = __commonJS({
    "prototype/property-alchemy/reagents.js"(exports, module) {
      var EXPERIMENTAL_REAGENTS = {
        exp_dawn_dew: {
          id: "exp_dawn_dew",
          name: "Dawn Dew",
          spirit: 8,
          yin: 4,
          yang: 2,
          volatility: 3,
          stability: 14,
          impurity: 2,
          affinities: { qi: 6, heat: 0, marrow: 0, purify: 4, toxicity: 0 },
          note: "Gentle carrier; stabilises volatile mixes at low heat."
        },
        exp_dust_root: {
          id: "exp_dust_root",
          name: "Dust Root",
          spirit: 18,
          yin: 8,
          yang: 3,
          volatility: 5,
          stability: 10,
          impurity: 6,
          affinities: { qi: 12, heat: 0, marrow: 2, purify: 2, toxicity: 0 },
          note: "Earthy binder; modest qi with some impurity."
        },
        exp_foundation_root: {
          id: "exp_foundation_root",
          name: "Foundation Root",
          spirit: 28,
          yin: 6,
          yang: 6,
          volatility: 4,
          stability: 22,
          impurity: 3,
          affinities: { qi: 18, heat: 0, marrow: 4, purify: 6, toxicity: 0 },
          note: "Strong stabiliser and qi affinity."
        },
        exp_saltbrush: {
          id: "exp_saltbrush",
          name: "Saltbrush Tip",
          spirit: 6,
          yin: 5,
          yang: 4,
          volatility: 2,
          stability: 16,
          impurity: 1,
          affinities: { qi: 2, heat: 0, marrow: 0, purify: 20, toxicity: 0 },
          note: "Purifies and dampens polarity clashes."
        },
        exp_marrow_thistle: {
          id: "exp_marrow_thistle",
          name: "Marrow Thistle",
          spirit: 22,
          yin: 10,
          yang: 2,
          volatility: 6,
          stability: 8,
          impurity: 5,
          affinities: { qi: 8, heat: 0, marrow: 22, purify: 2, toxicity: 0 },
          note: "Marrow-forward; yin-leaning."
        },
        exp_sun_stone: {
          id: "exp_sun_stone",
          name: "Sun Stone",
          spirit: 30,
          yin: 0,
          yang: 26,
          volatility: 24,
          stability: 2,
          impurity: 4,
          affinities: { qi: 4, heat: 28, marrow: 0, purify: 0, toxicity: 2 },
          note: "High yang catalyst; dangerous at fierce heat."
        },
        exp_blood_crystal: {
          id: "exp_blood_crystal",
          name: "Blood Crystal",
          spirit: 24,
          yin: 2,
          yang: 20,
          volatility: 18,
          stability: 3,
          impurity: 8,
          affinities: { qi: 2, heat: 16, marrow: 6, purify: 0, toxicity: 4 },
          note: "Volatile yang; pairs poorly without purifiers."
        },
        exp_soul_mist: {
          id: "exp_soul_mist",
          name: "Soul Mist",
          spirit: 26,
          yin: 22,
          yang: 1,
          volatility: 16,
          stability: 4,
          impurity: 3,
          affinities: { qi: 10, heat: 0, marrow: 4, purify: 2, toxicity: 6 },
          note: "Dense yin; clashes with strong yang under heat."
        },
        exp_ironscar_grit: {
          id: "exp_ironscar_grit",
          name: "Ironscar Grit",
          spirit: 10,
          yin: 4,
          yang: 8,
          volatility: 4,
          stability: 6,
          impurity: 28,
          affinities: { qi: 2, heat: 4, marrow: 8, purify: 0, toxicity: 6 },
          note: "Mineral weight and impurity; needs gentle refining."
        },
        exp_glowcap: {
          id: "exp_glowcap",
          name: "Glowcap",
          spirit: 16,
          yin: 14,
          yang: 2,
          volatility: 8,
          stability: 7,
          impurity: 4,
          affinities: { qi: 14, heat: 0, marrow: 6, purify: 4, toxicity: 0 },
          note: "Soft yin qi and marrow support."
        }
      };
      var REAGENT_IDS = Object.keys(EXPERIMENTAL_REAGENTS);
      module.exports = {
        EXPERIMENTAL_REAGENTS,
        REAGENT_IDS
      };
    }
  });

  // prototype/property-alchemy/thermal.js
  var require_thermal = __commonJS({
    "prototype/property-alchemy/thermal.js"(exports, module) {
      var { EXPERIMENTAL_REAGENTS } = require_reagents();
      function deriveThermalProfile(def) {
        const mineralWeight = def.impurity / 32 + def.spirit / 90;
        const delicate = (def.affinities.purify + def.affinities.qi * 0.6 + def.affinities.marrow * 0.3) / 35;
        const catalytic = def.volatility / 28;
        const structural = def.stability / 40;
        const activationThreshold = clamp(
          0.22 + mineralWeight * 0.42 - catalytic * 0.12 - delicate * 0.14 + structural * 0.04,
          0.18,
          0.88
        );
        const toleranceMax = clamp(
          0.5 + catalytic * 0.22 - delicate * 0.32 + structural * 0.08 + mineralWeight * 0.28,
          0.42,
          0.99
        );
        const extractionWidth = clamp(0.1 + structural * 5e-3 + def.spirit / 500, 0.08, 0.22);
        return {
          activationThreshold: round3(activationThreshold),
          toleranceMax: round3(toleranceMax),
          extractionWidth: round3(extractionWidth)
        };
      }
      function clamp(n, lo, hi) {
        return Math.max(lo, Math.min(hi, n));
      }
      function round3(n) {
        return Math.round(n * 1e3) / 1e3;
      }
      function smoothstep(edge0, edge1, x) {
        if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
        const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
      }
      function thermalFractions(heat, profile) {
        const { activationThreshold, toleranceMax, extractionWidth: w } = profile;
        const activation = smoothstep(activationThreshold, activationThreshold + w, heat);
        const overheat = smoothstep(toleranceMax - w, toleranceMax + 0.04, heat);
        const remainBound = clamp(1 - activation, 0, 1);
        const releaseEfficiency = activation * (1 - overheat);
        const degradeFraction = activation * overheat;
        return {
          releaseEfficiency: clamp(releaseEfficiency, 0, 1),
          degradeFraction: clamp(degradeFraction, 0, 1),
          remainBound,
          grossRelease: clamp(activation, 0, 1)
        };
      }
      function emptyMaterialSlice() {
        return {
          spirit: 0,
          yin: 0,
          yang: 0,
          volatility: 0,
          stability: 0,
          impurity: 0,
          affinities: emptyAff()
        };
      }
      function emptyAff() {
        return { qi: 0, heat: 0, marrow: 0, purify: 0, toxicity: 0 };
      }
      function addAff(a, b) {
        return {
          qi: a.qi + b.qi,
          heat: a.heat + b.heat,
          marrow: a.marrow + b.marrow,
          purify: a.purify + b.purify,
          toxicity: a.toxicity + b.toxicity
        };
      }
      function scaleAff(aff, s) {
        return {
          qi: aff.qi * s,
          heat: aff.heat * s,
          marrow: aff.marrow * s,
          purify: aff.purify * s,
          toxicity: aff.toxicity * s
        };
      }
      function scaleMaterialSlice(slice, scale) {
        if (scale <= 0) return emptyMaterialSlice();
        return {
          spirit: slice.spirit * scale,
          yin: slice.yin * scale,
          yang: slice.yang * scale,
          volatility: slice.volatility * scale,
          stability: slice.stability * scale,
          impurity: slice.impurity * scale,
          affinities: scaleAff(slice.affinities, scale)
        };
      }
      function mergeSlice(into, part) {
        into.spirit += part.spirit;
        into.yin += part.yin;
        into.yang += part.yang;
        into.volatility += part.volatility;
        into.stability += part.stability;
        into.impurity += part.impurity;
        into.affinities = addAff(into.affinities, part.affinities);
      }
      function loadToMaterialSlice(load, def) {
        return {
          spirit: load.spirit,
          yin: load.yin,
          yang: load.yang,
          volatility: load.volatility,
          stability: load.stability,
          impurity: load.impurity,
          affinities: { ...load.affinities }
        };
      }
      function applyThermalPass(boundSlice, profile, heat, reagentId, trace, emitTrace) {
        if (boundSlice.spirit <= 1e-9) {
          return { released: emptyMaterialSlice(), degraded: emptyMaterialSlice() };
        }
        const frac = thermalFractions(heat, profile);
        const totalBefore = boundSlice.spirit;
        const released = scaleMaterialSlice(boundSlice, frac.releaseEfficiency);
        const degraded = scaleMaterialSlice(boundSlice, frac.degradeFraction);
        degraded.affinities.qi *= 0.2;
        degraded.affinities.marrow *= 0.2;
        degraded.affinities.purify *= 0.15;
        degraded.affinities.toxicity += degraded.spirit * 0.08;
        const boundRemainder = scaleMaterialSlice(boundSlice, frac.remainBound);
        const accounted = scaleMaterialSlice(boundSlice, frac.releaseEfficiency + frac.degradeFraction + frac.remainBound);
        Object.assign(boundSlice, boundRemainder);
        if (trace && emitTrace && (frac.releaseEfficiency > 0.05 || frac.degradeFraction > 0.05)) {
          if (frac.releaseEfficiency > 0.05) {
            emitTrace(trace, "thermal_activation", heat >= profile.activationThreshold ? `Heat reached activation for ${reagentId}; bound essence released into the reactive mixture.` : `Partial activation of ${reagentId} at this heat \u2014 much remains bound.`, {
              reagentId,
              heat: round3(heat),
              activationThreshold: profile.activationThreshold,
              releaseEfficiency: round3(frac.releaseEfficiency),
              spiritReleased: round3(released.spirit)
            });
          }
          if (frac.degradeFraction > 0.05) {
            emitTrace(trace, "thermal_degradation", `Heat exceeded ${reagentId}'s tolerance; volatile medicinal components broke down.`, {
              reagentId,
              heat: round3(heat),
              toleranceMax: profile.toleranceMax,
              degradeFraction: round3(frac.degradeFraction),
              spiritDegraded: round3(degraded.spirit)
            });
          }
          if (boundSlice.spirit > totalBefore * 0.15 && frac.releaseEfficiency < 0.5) {
            emitTrace(trace, "bound_remainder", `Substantial ${reagentId} properties remain unextracted at this heat.`, {
              reagentId,
              boundSpirit: round3(boundSlice.spirit)
            });
          }
        }
        return { released, degraded, accountedSpirit: accounted.spirit + degraded.spirit + released.spirit };
      }
      function createMaterialLedger() {
        return {
          released: emptyMaterialSlice(),
          bound: emptyMaterialSlice(),
          degraded: emptyMaterialSlice(),
          residual: emptyMaterialSlice(),
          inputSpirit: 0,
          byReagent: {}
        };
      }
      function ensureReagentBucket(ledger, reagentId) {
        if (!ledger.byReagent[reagentId]) {
          ledger.byReagent[reagentId] = { bound: emptyMaterialSlice(), released: emptyMaterialSlice(), degraded: emptyMaterialSlice() };
        }
        return ledger.byReagent[reagentId];
      }
      function registerInputLoad(ledger, load) {
        ledger.inputSpirit += load.spirit;
        const bucket = ensureReagentBucket(ledger, load.reagentId);
        const slice = loadToMaterialSlice(load, EXPERIMENTAL_REAGENTS[load.reagentId]);
        mergeSlice(bucket.bound, slice);
      }
      function recordThermalResult(ledger, reagentId, released, degraded) {
        const bucket = ensureReagentBucket(ledger, reagentId);
        mergeSlice(bucket.released, released);
        mergeSlice(ledger.released, released);
        mergeSlice(bucket.degraded, degraded);
        mergeSlice(ledger.degraded, degraded);
      }
      function finalizeMaterialLedger(ledger) {
        ledger.bound = emptyMaterialSlice();
        ledger.degraded = emptyMaterialSlice();
        Object.values(ledger.byReagent).forEach((bucket) => {
          mergeSlice(ledger.bound, bucket.bound);
          mergeSlice(ledger.degraded, bucket.degraded);
        });
        mergeSlice(ledger.residual, ledger.bound);
        mergeSlice(ledger.residual, ledger.degraded);
        const accounted = ledger.released.spirit + ledger.bound.spirit + ledger.degraded.spirit;
        return {
          inputSpirit: round3(ledger.inputSpirit),
          accountedSpirit: round3(accounted),
          conservationDelta: round3(ledger.inputSpirit - accounted)
        };
      }
      module.exports = {
        deriveThermalProfile,
        thermalFractions,
        createMaterialLedger,
        registerInputLoad,
        applyThermalPass,
        recordThermalResult,
        finalizeMaterialLedger,
        emptyMaterialSlice,
        mergeSlice,
        scaleMaterialSlice,
        loadToMaterialSlice,
        ensureReagentBucket
      };
    }
  });

  // prototype/property-alchemy/simulate.js
  var require_simulate = __commonJS({
    "prototype/property-alchemy/simulate.js"(exports, module) {
      var { EXPERIMENTAL_REAGENTS } = require_reagents();
      var {
        deriveThermalProfile,
        createMaterialLedger,
        registerInputLoad,
        applyThermalPass,
        recordThermalResult,
        finalizeMaterialLedger,
        mergeSlice
      } = require_thermal();
      var HEAT_VALUES = {
        gentle: 0.35,
        medium: 0.65,
        fierce: 0.95
      };
      var OUTCOME = {
        REFINED: "refined",
        UNSTABLE_SALVAGE: "unstable_salvage",
        FAILED: "failed",
        RUPTURE: "rupture"
      };
      function scaleAffinities(aff, scale) {
        return {
          qi: aff.qi * scale,
          heat: aff.heat * scale,
          marrow: aff.marrow * scale,
          purify: aff.purify * scale,
          toxicity: aff.toxicity * scale
        };
      }
      function loadFromReagent(reagentId, qty) {
        const def = EXPERIMENTAL_REAGENTS[reagentId];
        if (!def) throw new Error(`Unknown reagent: ${reagentId}`);
        if (qty <= 0) throw new Error(`Quantity must be positive: ${reagentId}`);
        return {
          reagentId,
          qty,
          spirit: def.spirit * qty,
          yin: def.yin * qty,
          yang: def.yang * qty,
          volatility: def.volatility * qty,
          stability: def.stability * qty,
          impurity: def.impurity * qty,
          affinities: scaleAffinities(def.affinities, qty),
          dominant: def.yin > def.yang * 1.2 ? "yin" : def.yang > def.yin * 1.2 ? "yang" : "neutral"
        };
      }
      function partitionByIntroduction(loads, order) {
        if (order === "simultaneous") return [loads];
        const phaseA = [];
        const phaseB = [];
        const pickFirst = order === "yin_first" ? "yin" : "yang";
        loads.forEach((load) => {
          if (load.dominant === pickFirst) phaseA.push(load);
          else phaseB.push(load);
        });
        if (!phaseA.length || !phaseB.length) return [loads];
        return [phaseA, phaseB];
      }
      function resolveHeatStageValues(input, phaseIndex) {
        if (input.heatStages?.length) {
          return input.heatStages.map((key2) => HEAT_VALUES[key2] ?? HEAT_VALUES.medium);
        }
        const key = input.heat || "medium";
        return [HEAT_VALUES[key] ?? HEAT_VALUES.medium];
      }
      function sliceToReactiveCauldron(slice) {
        return {
          spirit: slice.spirit,
          yin: slice.yin,
          yang: slice.yang,
          volatility: slice.volatility,
          stability: slice.stability,
          impurity: slice.impurity,
          affinities: { ...slice.affinities },
          totalUnits: 0,
          instability: 0
        };
      }
      function polarityImbalance(yin, yang) {
        const total = yin + yang;
        if (total <= 0) return 0;
        return Math.abs(yin - yang) / total;
      }
      function seededNoise(seed, salt) {
        const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
        return x - Math.floor(x);
      }
      function emitTrace(trace, kind, message, data) {
        if (!trace) return;
        trace.push({ kind, message, ...data ? { data } : {} });
      }
      function stripTraceFromResult(result) {
        if (!result || !result.trace) return result;
        const { trace, ...rest } = result;
        return rest;
      }
      function simulateRefinement(input) {
        const order = input.introductionOrder || "simultaneous";
        const seed = input.seed ?? 0;
        const trace = input.trace ? [] : null;
        const heatKey = input.heat || "medium";
        const loads = (input.reagents || []).map((r) => loadFromReagent(r.reagentId, r.qty));
        if (!loads.length) throw new Error("At least one reagent required");
        emitTrace(trace, "refinement_start", "Refinement started (thermal extraction + reactive chemistry).", {
          heat: heatKey,
          heatStages: input.heatStages || null,
          introductionOrder: order,
          seed,
          reagentCount: loads.length
        });
        const phases = partitionByIntroduction(loads, order);
        emitTrace(trace, "phases_partitioned", phases.length === 1 ? "All reagents introduced in one phase (simultaneous or single-pole mix)." : `Split into ${phases.length} introduction phases (${order}).`, {
          phaseCount: phases.length,
          order
        });
        const material = createMaterialLedger();
        loads.forEach((load) => registerInputLoad(material, load));
        const phaseLog = [];
        let peakInstability = 0;
        let runningInstability = 0;
        let lastHeat = HEAT_VALUES[heatKey] ?? HEAT_VALUES.medium;
        phases.forEach((phaseLoads, phaseIndex) => {
          emitTrace(trace, "phase_begin", `Phase ${phaseIndex} \u2014 adding ${phaseLoads.length} reagent load(s).`, {
            phase: phaseIndex
          });
          phaseLoads.forEach((load) => {
            emitTrace(trace, "reagent_introduced", `Added ${load.qty}\xD7 ${load.reagentId} (properties initially bound).`, {
              reagentId: load.reagentId,
              qty: load.qty,
              spirit: round1(load.spirit)
            });
          });
          const stageHeats = resolveHeatStageValues(input, phaseIndex);
          stageHeats.forEach((heat2, stageIdx) => {
            lastHeat = heat2;
            emitTrace(trace, "heat_stage", `Thermal pass at heat ${round3(heat2)}.`, {
              phase: phaseIndex,
              stage: stageIdx,
              heat: round3(heat2)
            });
            phaseLoads.forEach((load) => {
              const def = EXPERIMENTAL_REAGENTS[load.reagentId];
              const profile = deriveThermalProfile(def);
              const bucket = material.byReagent[load.reagentId];
              const { released, degraded } = applyThermalPass(
                bucket.bound,
                profile,
                heat2,
                load.reagentId,
                trace,
                emitTrace
              );
              recordThermalResult(material, load.reagentId, released, degraded);
            });
          });
          const reactive = sliceToReactiveCauldron(material.released);
          reactive.totalUnits = loads.reduce((s, l) => s + l.qty, 0);
          const phaseVolatility = phaseLoads.reduce((s, l) => s + l.volatility, 0);
          const phaseSpirit = phaseLoads.reduce((s, l) => s + l.spirit, 0);
          const phaseYin = phaseLoads.reduce((s, l) => s + l.yin, 0);
          const phaseYang = phaseLoads.reduce((s, l) => s + l.yang, 0);
          const beforeYin = reactive.yin - phaseYin * 0.35;
          const beforeYang = reactive.yang - phaseYang * 0.35;
          const clash = polarityImbalance(reactive.yin, reactive.yang);
          const newCharge = polarityImbalance(phaseYin, phaseYang);
          const introductionShock = phaseIndex > 0 ? newCharge * 0.55 : 0;
          const heat = lastHeat;
          const thermalDrive = phaseVolatility / Math.max(1, phaseLoads.length) * heat * heat;
          const polarityStrain = clash * (reactive.spirit * 4e-3 + 1) * heat;
          const shockStrain = introductionShock * heat * (reactive.spirit * 6e-3 + 1);
          const purifyDamp = reactive.affinities.purify * 6e-3 * (1.1 - heat * 0.35);
          const stabilityDamp = reactive.stability * 0.045;
          const stepStrain = polarityStrain + shockStrain + thermalDrive * 0.38;
          const stepDamp = stabilityDamp + purifyDamp;
          const stepNet = stepStrain - stepDamp;
          runningInstability += stepNet;
          peakInstability = Math.max(peakInstability, runningInstability);
          const instabilityAfter = runningInstability;
          if (stepNet > 0.5) {
            emitTrace(trace, "destabilisation", "Reactive essence strained the mixture.", {
              stepStrain: round3(stepStrain),
              stepDamp: round3(stepDamp),
              thermalDrive: round3(thermalDrive)
            });
          }
          if (introductionShock > 0.1) {
            emitTrace(trace, "introduction_shock", "Later-phase reagents clashed with cauldron polarity.", {
              introductionShock: round3(introductionShock)
            });
          }
          emitTrace(trace, "instability_update", "Peak instability updated from reactive mixture.", {
            peakInstability: round3(peakInstability),
            instabilityAfter: round3(instabilityAfter)
          });
          phaseLog.push({
            phase: phaseIndex,
            polarityImbalance: round3(clash),
            introductionShock: round3(introductionShock),
            thermalDrive: round3(thermalDrive),
            stepStrain: round3(stepStrain),
            stepDamp: round3(stepDamp),
            instabilityAfter: round3(instabilityAfter)
          });
        });
        const conservation = finalizeMaterialLedger(material);
        emitTrace(trace, "material_conservation", "Material ledger closed \u2014 spirit accounted across released, bound, degraded.", {
          ...conservation
        });
        let impurity = material.released.impurity;
        const impurityBeforeScrub = impurity;
        const purifyWork = material.released.affinities.purify * lastHeat * (lastHeat < 0.55 ? 0.14 : 0.05);
        impurity = Math.max(0, impurity - purifyWork);
        if (purifyWork > 0) {
          emitTrace(trace, "purify_scrub", lastHeat < 0.55 ? "Gentle condensation let purifying affinity strip impurities from released essence." : "Purifying affinity removed some impurities (reduced efficiency at this heat).", {
            removed: round3(impurityBeforeScrub - impurity)
          });
        }
        const impurityNoise = 1 + (seededNoise(seed, 1) - 0.5) * 0.06;
        impurity *= impurityNoise;
        const releasedSpirit = Math.max(1e-3, material.released.spirit);
        const impurityRatio = impurity / releasedSpirit;
        const spiritPotency = releasedSpirit * Math.max(0.2, 1 - impurityRatio * 0.65);
        const aff = material.released.affinities;
        const totalAff = aff.qi + aff.heat + aff.marrow + aff.purify;
        const scale = totalAff > 0 ? spiritPotency / totalAff : 0;
        const productEffects = {
          qi: round1(aff.qi * scale * 0.1),
          heat: round1(aff.heat * scale * 0.1),
          marrow: round1(aff.marrow * scale * 0.1),
          purify: round1(aff.purify * scale * 0.08),
          toxicity: round1(aff.toxicity * scale * 0.12 + Math.max(0, peakInstability) * 0.4)
        };
        const stabilityMargin = material.released.stability * 0.08 + aff.purify * 0.05 - peakInstability;
        let processOutcome = OUTCOME.REFINED;
        if (peakInstability > 16) processOutcome = OUTCOME.RUPTURE;
        else if (peakInstability > 8.5) processOutcome = OUTCOME.FAILED;
        else if (peakInstability > 4.2) processOutcome = OUTCOME.UNSTABLE_SALVAGE;
        emitTrace(trace, "outcome_threshold", "Process outcome from peak instability on reactive essence.", {
          peakInstability: round3(peakInstability),
          processOutcome,
          thresholds: { unstable: 4.2, failed: 8.5, rupture: 16 }
        });
        const condenseFactor = processOutcome === OUTCOME.REFINED ? 1 : processOutcome === OUTCOME.UNSTABLE_SALVAGE ? 0.55 + Math.max(0, stabilityMargin) * 0.04 : 0.15;
        if (processOutcome === OUTCOME.RUPTURE || processOutcome === OUTCOME.FAILED) {
          productEffects.qi *= 0.15;
          productEffects.heat *= 0.2;
          productEffects.marrow *= 0.15;
          productEffects.toxicity += 2 + peakInstability * 0.3;
          emitTrace(trace, "condensation_failed", "Pill condensation failed; released essence largely lost from final dose.", {
            toxicity: round1(productEffects.toxicity)
          });
        } else if (processOutcome === OUTCOME.UNSTABLE_SALVAGE) {
          productEffects.qi *= condenseFactor;
          productEffects.heat *= condenseFactor;
          productEffects.marrow *= condenseFactor;
          productEffects.toxicity += 0.8;
          emitTrace(trace, "unstable_salvage", "Cracked pill \u2014 partial condensed dose from released essence.", {
            condenseFactor: round3(condenseFactor)
          });
        }
        emitTrace(trace, "product_finalized", "Condensed product computed from released (not bound) essence.", {
          dominantAffinity: dominantKey(productEffects),
          effects: productEffects,
          impurityRatio: round3(impurityRatio)
        });
        const dominantAffinity = dominantKey(productEffects);
        const potency = Math.max(productEffects.qi, productEffects.heat, productEffects.marrow);
        const productSuitability = impurityRatio > 0.45 ? "impure" : productEffects.toxicity > 4 ? "hazardous" : potency >= 2 ? "medicinal" : "weak";
        const diagnostics = buildDiagnostics({
          peakInstability,
          stabilityMargin,
          impurityRatio,
          heat: lastHeat,
          order,
          phaseLog,
          cauldron: material.released
        });
        const materialOutcome = {
          released: summarizeSlice(material.released),
          bound: summarizeSlice(material.bound),
          degraded: summarizeSlice(material.degraded),
          residual: summarizeSlice(material.residual),
          conservation
        };
        const result = {
          input: {
            reagents: input.reagents,
            heat: heatKey,
            heatStages: input.heatStages || null,
            introductionOrder: order,
            seed
          },
          process: {
            outcome: processOutcome,
            peakInstability: round3(peakInstability),
            stabilityMargin: round3(stabilityMargin),
            success: processOutcome === OUTCOME.REFINED || processOutcome === OUTCOME.UNSTABLE_SALVAGE
          },
          material: materialOutcome,
          mixture: {
            spirit: round1(releasedSpirit),
            yin: round1(material.released.yin),
            yang: round1(material.released.yang),
            impurity: round1(impurity),
            impurityRatio: round3(impurityRatio),
            polarityImbalance: round3(polarityImbalance(material.released.yin, material.released.yang))
          },
          phaseLog,
          peakInstability: round3(peakInstability),
          stabilityMargin: round3(stabilityMargin),
          product: {
            effects: productEffects,
            dominantAffinity,
            potency: round1(potency),
            grade: gradeFromMargin(stabilityMargin, impurityRatio),
            suitability: productSuitability
          },
          outcome: processOutcome,
          success: processOutcome === OUTCOME.REFINED || processOutcome === OUTCOME.UNSTABLE_SALVAGE,
          diagnostics,
          observations: diagnostics.playerObservations
        };
        if (trace) result.trace = trace;
        return result;
      }
      function summarizeSlice(slice) {
        return {
          spirit: round1(slice.spirit),
          impurity: round1(slice.impurity),
          affinities: {
            qi: round1(slice.affinities.qi),
            heat: round1(slice.affinities.heat),
            marrow: round1(slice.affinities.marrow),
            purify: round1(slice.affinities.purify),
            toxicity: round1(slice.affinities.toxicity)
          }
        };
      }
      function dominantKey(productEffects) {
        const entries = Object.entries(productEffects).filter(([k]) => k !== "toxicity");
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0]?.[0] || "none";
      }
      function gradeFromMargin(margin, impurityRatio) {
        if (margin > 4 && impurityRatio < 0.15) return "high";
        if (margin > 1 && impurityRatio < 0.35) return "mid";
        return "low";
      }
      function round1(n) {
        return Math.round(n * 10) / 10;
      }
      function round3(n) {
        return Math.round(n * 1e3) / 1e3;
      }
      function buildDiagnostics(ctx) {
        const suggestions = [];
        if (ctx.peakInstability > 5) {
          if (ctx.cauldron.affinities.purify < 8) {
            suggestions.push("Add a purifying or stabilising reagent before catalysts.");
          }
          if (ctx.heat > 0.7) {
            suggestions.push("Reduce heat \u2014 thermal drive is amplifying volatility.");
          }
          if (polarityImbalance(ctx.cauldron.yin, ctx.cauldron.yang) > 0.35) {
            suggestions.push("Balance yin and yang introduction order or add neutral binder.");
          }
        }
        if (ctx.impurityRatio > 0.25) {
          suggestions.push("Use gentle heat so purifying affinities can strip impurities.");
        }
        const playerObservations = [];
        if (ctx.phaseLog.some((p) => p.introductionShock > 0.25)) {
          playerObservations.push("Sharp polarity spike when later reagents entered the cauldron.");
        }
        if (ctx.phaseLog.some((p) => p.thermalDrive > 8)) {
          playerObservations.push("Cauldron trembled from thermal pressure \u2014 volatility dominates.");
        }
        if (ctx.cauldron.affinities.purify > 10 && ctx.heat < 0.55) {
          playerObservations.push("Purifying notes cleared as the mixture simmered.");
        }
        if (ctx.peakInstability > 11) {
          playerObservations.push("Mixture lost coherence \u2014 structure collapsed before forming a pill.");
        } else if (ctx.peakInstability > 5.5) {
          playerObservations.push("Pill formed but cracks web the surface \u2014 unstable salvage.");
        }
        return {
          polarityImbalance: round3(polarityImbalance(ctx.cauldron.yin, ctx.cauldron.yang)),
          peakInstability: round3(ctx.peakInstability),
          stabilityMargin: round3(ctx.stabilityMargin),
          impurityRatio: round3(ctx.impurityRatio),
          suggestedAdjustments: suggestions,
          playerObservations
        };
      }
      function similarEffectProfile(a, b, affinity, potencyBand = 4) {
        if (!a.success || !b.success) return false;
        if (a.product.dominantAffinity !== affinity || b.product.dominantAffinity !== affinity) return false;
        return Math.abs(a.product.potency - b.product.potency) <= potencyBand;
      }
      module.exports = {
        HEAT_VALUES,
        OUTCOME,
        simulateRefinement,
        similarEffectProfile,
        loadFromReagent,
        polarityImbalance,
        stripTraceFromResult,
        emitTrace,
        resolveHeatStageValues
      };
    }
  });

  // prototype/property-alchemy/journal.js
  var require_journal = __commonJS({
    "prototype/property-alchemy/journal.js"(exports, module) {
      var { EXPERIMENTAL_REAGENTS } = require_reagents();
      function createAlchemyJournal() {
        return {
          version: 1,
          entries: [],
          savedFormulas: [],
          /** @type {Record<string, { observedProperties: string[], confidence: number }>} */
          discovered: {}
        };
      }
      function recordExperiment(journal, input, result, meta = {}) {
        const entry = {
          id: `exp_${journal.entries.length + 1}`,
          at: (/* @__PURE__ */ new Date()).toISOString(),
          label: meta.label || null,
          notes: meta.notes || "",
          reagents: input.reagents.map((r) => ({ ...r })),
          conditions: {
            heat: input.heat,
            heatStages: input.heatStages || null,
            introductionOrder: input.introductionOrder || "simultaneous",
            seed: input.seed ?? 0
          },
          reactions: {
            phaseLog: result.phaseLog,
            peakInstability: result.peakInstability,
            observations: result.observations
          },
          process: result.process || { outcome: result.outcome },
          material: result.material || null,
          product: {
            effects: result.product.effects,
            dominantAffinity: result.product.dominantAffinity,
            potency: result.product.potency,
            grade: result.product.grade,
            suitability: result.product.suitability || null
          },
          outcome: result.outcome,
          success: result.success,
          diagnostics: result.diagnostics
        };
        journal.entries.push(entry);
        input.reagents.forEach(({ reagentId }) => {
          mergeDiscovery(journal, reagentId, result);
        });
        return entry;
      }
      function mergeDiscovery(journal, reagentId, result) {
        const def = EXPERIMENTAL_REAGENTS[reagentId];
        if (!def) return;
        if (!journal.discovered[reagentId]) {
          journal.discovered[reagentId] = { observedProperties: [], confidence: 0 };
        }
        const slot = journal.discovered[reagentId];
        const hints = inferReagentHints(reagentId, result);
        hints.forEach((h) => {
          if (!slot.observedProperties.includes(h)) slot.observedProperties.push(h);
        });
        slot.confidence = Math.min(1, slot.confidence + (result.success ? 0.12 : 0.08));
      }
      function inferReagentHints(reagentId, result) {
        const def = EXPERIMENTAL_REAGENTS[reagentId];
        const hints = [];
        if (def.volatility >= 15) hints.push("high_volatility");
        if (def.stability >= 14) hints.push("stabilising");
        if (def.affinities.purify >= 15) hints.push("purifying");
        if (def.yin > def.yang * 1.5) hints.push("yin_leaning");
        if (def.yang > def.yin * 1.5) hints.push("yang_leaning");
        if (def.impurity >= 20) hints.push("heavy_impurity");
        if (result.diagnostics.suggestedAdjustments.some((s) => s.includes("heat"))) {
          hints.push("heat_sensitive_in_mix");
        }
        return hints;
      }
      function saveFormulaFromEntry(journal, entryId, name, notes = "") {
        const entry = journal.entries.find((e) => e.id === entryId);
        if (!entry) throw new Error(`Unknown journal entry: ${entryId}`);
        const formula = {
          id: `formula_${journal.savedFormulas.length + 1}`,
          name,
          notes,
          sourceEntryId: entryId,
          reagents: entry.reagents.map((r) => ({ ...r })),
          conditions: { ...entry.conditions },
          expectedDominant: entry.product.dominantAffinity,
          recordedPotency: entry.product.potency,
          recordedOutcome: entry.outcome
        };
        journal.savedFormulas.push(formula);
        return formula;
      }
      function verifyFormulaReproducible(journal, formulaId, simulateRefinement) {
        const formula = journal.savedFormulas.find((f) => f.id === formulaId);
        if (!formula) throw new Error(`Unknown formula: ${formulaId}`);
        const replay = simulateRefinement({
          reagents: formula.reagents,
          heat: formula.conditions.heat,
          introductionOrder: formula.conditions.introductionOrder,
          seed: formula.conditions.seed
        });
        return {
          matchesOutcome: replay.outcome === formula.recordedOutcome,
          matchesDominant: replay.product.dominantAffinity === formula.expectedDominant,
          replay
        };
      }
      module.exports = {
        createAlchemyJournal,
        recordExperiment,
        saveFormulaFromEntry,
        verifyFormulaReproducible,
        inferReagentHints
      };
    }
  });

  // prototype/property-alchemy/thermal-harness.js
  var require_thermal_harness = __commonJS({
    "prototype/property-alchemy/thermal-harness.js"(exports, module) {
      var { simulateRefinement, OUTCOME } = require_simulate();
      function runThermalDemonstrations() {
        const demos = [];
        const delicateGentle = simulateRefinement({
          reagents: [{ reagentId: "exp_dawn_dew", qty: 2 }],
          heat: "gentle"
        });
        const delicateFierce = simulateRefinement({
          reagents: [{ reagentId: "exp_dawn_dew", qty: 2 }],
          heat: "fierce"
        });
        demos.push({
          id: "A_delicate_material",
          pass: delicateGentle.product.effects.qi > delicateFierce.product.effects.qi * 2 && delicateGentle.material.released.spirit > delicateFierce.material.released.spirit,
          results: [delicateGentle, delicateFierce]
        });
        const stubbornGentle = simulateRefinement({
          reagents: [{ reagentId: "exp_ironscar_grit", qty: 2 }],
          heat: "gentle"
        });
        const stubbornMedium = simulateRefinement({
          reagents: [{ reagentId: "exp_ironscar_grit", qty: 2 }],
          heat: "medium"
        });
        demos.push({
          id: "B_stubborn_material",
          pass: stubbornMedium.material.released.spirit > stubbornGentle.material.released.spirit + 1 && stubbornMedium.material.released.affinities.marrow >= stubbornGentle.material.released.affinities.marrow,
          results: [stubbornGentle, stubbornMedium]
        });
        const conflictGentle = simulateRefinement({
          reagents: [
            { reagentId: "exp_ironscar_grit", qty: 2 },
            { reagentId: "exp_dawn_dew", qty: 2 }
          ],
          heat: "gentle"
        });
        const conflictFierce = simulateRefinement({
          reagents: [
            { reagentId: "exp_ironscar_grit", qty: 2 },
            { reagentId: "exp_dawn_dew", qty: 2 }
          ],
          heat: "fierce"
        });
        demos.push({
          id: "C_conflicting_requirements",
          pass: conflictGentle.material.bound.spirit > conflictFierce.material.bound.spirit && conflictGentle.product.effects.qi > conflictFierce.product.effects.qi,
          results: [conflictGentle, conflictFierce]
        });
        const orderA = simulateRefinement({
          reagents: [
            { reagentId: "exp_sun_stone", qty: 1 },
            { reagentId: "exp_soul_mist", qty: 1 }
          ],
          heat: "medium",
          introductionOrder: "simultaneous"
        });
        const orderB = simulateRefinement({
          reagents: [
            { reagentId: "exp_sun_stone", qty: 1 },
            { reagentId: "exp_soul_mist", qty: 1 }
          ],
          heat: "medium",
          introductionOrder: "yang_first"
        });
        demos.push({
          id: "D_process_matters",
          pass: orderA.process.outcome !== orderB.process.outcome || Math.abs(orderA.peakInstability - orderB.peakInstability) > 0.5 || orderA.product.potency !== orderB.product.potency,
          results: [orderA, orderB]
        });
        const usefulFail = simulateRefinement({
          reagents: [
            { reagentId: "exp_sun_stone", qty: 1 },
            { reagentId: "exp_blood_crystal", qty: 2 },
            { reagentId: "exp_soul_mist", qty: 2 }
          ],
          heat: "fierce",
          introductionOrder: "yang_first"
        });
        demos.push({
          id: "E_useful_failure",
          pass: (usefulFail.process.outcome === OUTCOME.FAILED || usefulFail.process.outcome === OUTCOME.RUPTURE) && usefulFail.material.residual.spirit > 20 && (usefulFail.material.degraded.affinities.toxicity > 5 || usefulFail.material.bound.affinities.marrow > 0),
          results: [usefulFail]
        });
        return { demos, allPass: demos.every((d) => d.pass) };
      }
      module.exports = { runThermalDemonstrations };
    }
  });

  // prototype/property-alchemy/harness.js
  var require_harness = __commonJS({
    "prototype/property-alchemy/harness.js"(exports, module) {
      var { simulateRefinement, similarEffectProfile, OUTCOME } = require_simulate();
      var { createAlchemyJournal, recordExperiment, saveFormulaFromEntry } = require_journal();
      var { runThermalDemonstrations } = require_thermal_harness();
      function runDemonstrationHarness() {
        const runs = [];
        const thermal = runThermalDemonstrations();
        thermal.demos.forEach((d) => {
          runs.push({
            id: d.id,
            description: `Thermal demo ${d.id}`,
            results: d.results,
            pass: d.pass
          });
        });
        const qiPathA = simulateRefinement({
          reagents: [
            { reagentId: "exp_foundation_root", qty: 1 },
            { reagentId: "exp_dawn_dew", qty: 2 }
          ],
          heat: "gentle",
          introductionOrder: "simultaneous"
        });
        const qiPathB = simulateRefinement({
          reagents: [
            { reagentId: "exp_dust_root", qty: 2 },
            { reagentId: "exp_saltbrush", qty: 1 },
            { reagentId: "exp_dawn_dew", qty: 1 }
          ],
          heat: "gentle",
          introductionOrder: "simultaneous"
        });
        runs.push({
          id: "similar_qi_paths",
          description: "Different mixes yield qi-forward released essence at gentle heat.",
          results: [qiPathA, qiPathB],
          pass: qiPathA.product.dominantAffinity === "qi" && qiPathB.material.released.affinities.qi >= 2 && qiPathA.process.outcome === OUTCOME.REFINED
        });
        const sunSoulBase = [
          { reagentId: "exp_sun_stone", qty: 1 },
          { reagentId: "exp_soul_mist", qty: 1 }
        ];
        const sunSoulGentle = simulateRefinement({
          reagents: sunSoulBase,
          heat: "gentle",
          introductionOrder: "yang_first"
        });
        const sunSoulFierce = simulateRefinement({
          reagents: sunSoulBase,
          heat: "fierce",
          introductionOrder: "yang_first"
        });
        runs.push({
          id: "heat_changes_fate",
          description: "Sun Stone + Soul Mist: gentle vs fierce (process + material).",
          results: [sunSoulGentle, sunSoulFierce],
          pass: rankOutcome(sunSoulGentle.process.outcome) > rankOutcome(sunSoulFierce.process.outcome) && sunSoulGentle.product.potency >= sunSoulFierce.product.potency
        });
        const volatileNoSalt = simulateRefinement({
          reagents: [
            { reagentId: "exp_sun_stone", qty: 1 },
            { reagentId: "exp_blood_crystal", qty: 1 },
            { reagentId: "exp_soul_mist", qty: 1 }
          ],
          heat: "fierce",
          introductionOrder: "yang_first"
        });
        const volatileWithSalt = simulateRefinement({
          reagents: [
            { reagentId: "exp_saltbrush", qty: 2 },
            { reagentId: "exp_sun_stone", qty: 1 },
            { reagentId: "exp_blood_crystal", qty: 1 },
            { reagentId: "exp_soul_mist", qty: 1 }
          ],
          heat: "fierce",
          introductionOrder: "yin_first"
        });
        runs.push({
          id: "stabiliser_rescue",
          description: "Saltbrush + yin-first lowers peak instability on fierce volatile mix.",
          results: [volatileNoSalt, volatileWithSalt],
          pass: volatileWithSalt.peakInstability < volatileNoSalt.peakInstability
        });
        const failAttempt = simulateRefinement({
          reagents: [
            { reagentId: "exp_sun_stone", qty: 1 },
            { reagentId: "exp_blood_crystal", qty: 2 },
            { reagentId: "exp_soul_mist", qty: 2 }
          ],
          heat: "fierce",
          introductionOrder: "yang_first"
        });
        const learnAttempt = simulateRefinement({
          reagents: [
            { reagentId: "exp_saltbrush", qty: 2 },
            { reagentId: "exp_dawn_dew", qty: 1 },
            { reagentId: "exp_sun_stone", qty: 1 },
            { reagentId: "exp_blood_crystal", qty: 1 },
            { reagentId: "exp_soul_mist", qty: 1 }
          ],
          heat: "gentle",
          introductionOrder: "yin_first"
        });
        runs.push({
          id: "failure_informs_retry",
          description: "Fierce rupture vs gentle controlled retry; residual preserved on failure.",
          results: [failAttempt, learnAttempt],
          pass: rankOutcome(failAttempt.process.outcome) < rankOutcome(learnAttempt.process.outcome) && failAttempt.material.residual.spirit > 10 && learnAttempt.process.outcome === OUTCOME.REFINED
        });
        const journal = createAlchemyJournal();
        runs.forEach((r) => {
          r.results.forEach((res, idx) => {
            recordExperiment(journal, res.input, res, { label: `${r.id}_${idx}` });
          });
        });
        if (journal.entries.length >= 2) {
          saveFormulaFromEntry(journal, journal.entries[journal.entries.length - 1].id, "Thermal retry formula");
        }
        return { runs, journal, allPass: runs.every((r) => r.pass) };
      }
      function rankOutcome(outcome) {
        const order = {
          [OUTCOME.RUPTURE]: 0,
          [OUTCOME.FAILED]: 1,
          [OUTCOME.UNSTABLE_SALVAGE]: 2,
          [OUTCOME.REFINED]: 3
        };
        return order[outcome] ?? 0;
      }
      module.exports = {
        runDemonstrationHarness,
        rankOutcome,
        runThermalDemonstrations
      };
    }
  });

  // prototype/property-alchemy/stress-audit.js
  var require_stress_audit = __commonJS({
    "prototype/property-alchemy/stress-audit.js"(exports, module) {
      var { REAGENT_IDS } = require_reagents();
      var { simulateRefinement, stripTraceFromResult, OUTCOME } = require_simulate();
      var HEATS = ["gentle", "medium", "fierce"];
      var ORDERS = ["simultaneous", "yin_first", "yang_first"];
      var QTY_OPTIONS = [1, 2];
      function mulberry32(seed) {
        let a = seed >>> 0;
        return () => {
          a |= 0;
          a = a + 1831565813 | 0;
          let t = Math.imul(a ^ a >>> 15, 1 | a);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }
      function combinations(ids, k) {
        const out = [];
        function walk(start, combo) {
          if (combo.length === k) {
            out.push([...combo]);
            return;
          }
          for (let i = start; i < ids.length; i++) {
            combo.push(ids[i]);
            walk(i + 1, combo);
            combo.pop();
          }
        }
        walk(0, []);
        return out;
      }
      function qtyVariants(reagentIds) {
        const variants = [];
        const n = reagentIds.length;
        const total = QTY_OPTIONS.length ** n;
        for (let mask = 0; mask < total; mask++) {
          let x = mask;
          const reagents = reagentIds.map((id) => {
            const q = QTY_OPTIONS[x % QTY_OPTIONS.length];
            x = Math.floor(x / QTY_OPTIONS.length);
            return { reagentId: id, qty: q };
          });
          variants.push(reagents);
        }
        return variants;
      }
      function buildExperimentPlan(opts = {}) {
        const singles = [];
        REAGENT_IDS.forEach((id) => {
          [1, 2, 3, 4].forEach((qty) => {
            HEATS.forEach((heat) => {
              ORDERS.forEach((introductionOrder) => {
                singles.push({
                  reagents: [{ reagentId: id, qty }],
                  heat,
                  introductionOrder,
                  seed: 0,
                  bucket: "single"
                });
              });
            });
          });
        });
        const pairs = [];
        combinations(REAGENT_IDS, 2).forEach((pair) => {
          qtyVariants(pair).forEach((reagents) => {
            HEATS.forEach((heat) => {
              ORDERS.forEach((introductionOrder) => {
                pairs.push({
                  reagents,
                  heat,
                  introductionOrder,
                  seed: 0,
                  bucket: "pair"
                });
              });
            });
          });
        });
        const triples = [];
        combinations(REAGENT_IDS, 3).forEach((triple) => {
          qtyVariants(triple).forEach((reagents) => {
            HEATS.forEach((heat) => {
              ORDERS.forEach((introductionOrder) => {
                triples.push({
                  reagents,
                  heat,
                  introductionOrder,
                  seed: 0,
                  bucket: "triple"
                });
              });
            });
          });
        });
        const rng = mulberry32(opts.quadSeed ?? 90210);
        const quads = [];
        const quadTarget = opts.quadSamples ?? 1200;
        for (let i = 0; i < quadTarget; i++) {
          const pick = /* @__PURE__ */ new Set();
          while (pick.size < 4) {
            pick.add(REAGENT_IDS[Math.floor(rng() * REAGENT_IDS.length)]);
          }
          const ids = [...pick];
          const reagents = ids.map((id) => ({
            reagentId: id,
            qty: QTY_OPTIONS[Math.floor(rng() * QTY_OPTIONS.length)]
          }));
          quads.push({
            reagents,
            heat: HEATS[Math.floor(rng() * HEATS.length)],
            introductionOrder: ORDERS[Math.floor(rng() * ORDERS.length)],
            seed: 0,
            bucket: "quad_sample"
          });
        }
        return [...singles, ...pairs, ...triples, ...quads];
      }
      function runExperiments(plan) {
        const results = [];
        plan.forEach((input, index) => {
          const { bucket, ...simInput } = input;
          let result;
          try {
            result = simulateRefinement(simInput);
          } catch (err) {
            results.push({ index, bucket, input: simInput, error: err.message });
            return;
          }
          results.push({
            index,
            bucket,
            input: simInput,
            outcome: result.outcome,
            success: result.success,
            dominant: result.product.dominantAffinity,
            potency: result.product.potency,
            toxicity: result.product.effects.toxicity,
            peakInstability: result.peakInstability,
            impurityRatio: result.mixture.impurityRatio,
            grade: result.product.grade,
            effects: result.product.effects
          });
        });
        return results;
      }
      function summarizeResults(results) {
        const ok = results.filter((r) => !r.error);
        const dist = { refined: 0, unstable_salvage: 0, failed: 0, rupture: 0, error: 0 };
        ok.forEach((r) => {
          dist[r.outcome] = (dist[r.outcome] || 0) + 1;
        });
        dist.error = results.length - ok.length;
        const dominant = {};
        ok.forEach((r) => {
          dominant[r.dominant] = (dominant[r.dominant] || 0) + 1;
        });
        const heatOutcome = {};
        HEATS.forEach((h) => {
          heatOutcome[h] = { refined: 0, unstable_salvage: 0, failed: 0, rupture: 0, n: 0 };
        });
        ok.forEach((r) => {
          const h = r.input.heat;
          if (!heatOutcome[h]) return;
          heatOutcome[h][r.outcome] += 1;
          heatOutcome[h].n += 1;
        });
        const orderChanged = analyzeOrderSensitivity();
        const reagentContribution = scoreReagentPresence(ok);
        const comparableProducts = findComparableProductClusters(ok);
        const exploits = probeDominantStrategies();
        return {
          totalExperiments: results.length,
          successfulParses: ok.length,
          outcomeDistribution: dist,
          dominantAffinityDistribution: dominant,
          heatOutcome,
          orderSensitivity: orderChanged,
          reagentContribution,
          comparableProductClusters: comparableProducts,
          exploitProbes: exploits
        };
      }
      function analyzeOrderSensitivity() {
        const bases = [
          [{ reagentId: "exp_sun_stone", qty: 1 }, { reagentId: "exp_soul_mist", qty: 1 }],
          [{ reagentId: "exp_blood_crystal", qty: 1 }, { reagentId: "exp_soul_mist", qty: 1 }],
          [{ reagentId: "exp_foundation_root", qty: 1 }, { reagentId: "exp_marrow_thistle", qty: 1 }],
          [{ reagentId: "exp_ironscar_grit", qty: 2 }, { reagentId: "exp_sun_stone", qty: 1 }],
          [{ reagentId: "exp_saltbrush", qty: 1 }, { reagentId: "exp_sun_stone", qty: 1 }, { reagentId: "exp_blood_crystal", qty: 1 }]
        ];
        let sets = 0;
        let outcomeDiffers = 0;
        let peakSpreadSum = 0;
        ORDERS.forEach(() => {
        });
        bases.forEach((reagents) => {
          HEATS.forEach((heat) => {
            const runs = ORDERS.map((order) => simulateRefinement({ reagents, heat, introductionOrder: order, seed: 0 }));
            sets += 1;
            const outcomes = new Set(runs.map((r) => r.outcome));
            if (outcomes.size > 1) outcomeDiffers += 1;
            const peaks = runs.map((r) => r.peakInstability);
            peakSpreadSum += Math.max(...peaks) - Math.min(...peaks);
          });
        });
        return {
          probeSets: sets,
          setsWithDifferentOutcome: outcomeDiffers,
          avgPeakSpread: round3(peakSpreadSum / Math.max(1, sets))
        };
      }
      function scoreReagentPresence(okResults) {
        const stats = {};
        REAGENT_IDS.forEach((id) => {
          stats[id] = {
            present: 0,
            refined: 0,
            highPotency: 0,
            toxicFailures: 0
          };
        });
        okResults.forEach((r) => {
          const ids = r.input.reagents.map((x) => x.reagentId);
          ids.forEach((id) => {
            if (!stats[id]) return;
            stats[id].present += 1;
            if (r.outcome === OUTCOME.REFINED) stats[id].refined += 1;
            if (r.potency >= 3 && r.outcome === OUTCOME.REFINED) stats[id].highPotency += 1;
            if ((r.outcome === OUTCOME.FAILED || r.outcome === OUTCOME.RUPTURE) && r.toxicity >= 5) {
              stats[id].toxicFailures += 1;
            }
          });
        });
        const ranked = Object.entries(stats).map(([id, s]) => ({
          id,
          refinedRate: s.present ? s.refined / s.present : 0,
          highPotencyRate: s.present ? s.highPotency / s.present : 0,
          present: s.present,
          toxicFailureRate: s.present ? s.toxicFailures / s.present : 0
        })).sort((a, b) => b.highPotencyRate - a.highPotencyRate);
        return {
          byHighPotencyRefined: ranked,
          rarelyUseful: ranked.filter((r) => r.highPotencyRate < 0.02 && r.present > 100).map((r) => r.id)
        };
      }
      function findComparableProductClusters(okResults) {
        const refined = okResults.filter((r) => r.outcome === OUTCOME.REFINED);
        const byDominant = {};
        refined.forEach((r) => {
          const key = r.dominant;
          if (!byDominant[key]) byDominant[key] = [];
          byDominant[key].push(r.potency);
        });
        const clusters = Object.entries(byDominant).map(([dominant, potencies]) => ({
          dominant,
          count: potencies.length,
          potencyMin: Math.min(...potencies),
          potencyMax: Math.max(...potencies),
          potencySpread: round3(Math.max(...potencies) - Math.min(...potencies))
        }));
        return clusters.sort((a, b) => b.count - a.count);
      }
      function probeDominantStrategies() {
        const probes = [];
        const heatCompare = [];
        const heatMixes = [
          [{ reagentId: "exp_sun_stone", qty: 1 }, { reagentId: "exp_blood_crystal", qty: 1 }],
          [{ reagentId: "exp_foundation_root", qty: 1 }, { reagentId: "exp_dawn_dew", qty: 2 }],
          [{ reagentId: "exp_ironscar_grit", qty: 2 }, { reagentId: "exp_glowcap", qty: 1 }]
        ];
        heatMixes.forEach((reagents) => {
          const gentle = simulateRefinement({ reagents, heat: "gentle", seed: 0 });
          const fierce = simulateRefinement({ reagents, heat: "fierce", seed: 0 });
          heatCompare.push({
            reagents,
            gentle: pickSummary(gentle),
            fierce: pickSummary(fierce)
          });
        });
        const gentleWins = heatCompare.filter(
          (row) => rank(row.gentle.outcome) > rank(row.fierce.outcome) || row.gentle.outcome === row.fierce.outcome && row.gentle.toxicity < row.fierce.toxicity
        ).length;
        probes.push({
          id: "heat_gentle_vs_fierce",
          description: "Same mix under gentle vs fierce heat.",
          gentleStrictlyBetterCount: gentleWins,
          sampleSize: heatCompare.length,
          samples: heatCompare
        });
        const volatile = [{ reagentId: "exp_sun_stone", qty: 1 }, { reagentId: "exp_blood_crystal", qty: 1 }];
        const withSalt = [
          { reagentId: "exp_saltbrush", qty: 1 },
          { reagentId: "exp_saltbrush", qty: 2 },
          { reagentId: "exp_saltbrush", qty: 3 }
        ].map((extra, i) => simulateRefinement({
          reagents: [{ ...extra }, ...volatile.map((r) => ({ ...r }))],
          heat: "medium",
          introductionOrder: "yin_first",
          seed: 0
        }));
        probes.push({
          id: "saltbrush_stack",
          description: "Increasing Saltbrush with volatile yang pair (medium, yin-first).",
          runs: withSalt.map(pickSummary)
        });
        const gritSun = simulateRefinement({
          reagents: [
            { reagentId: "exp_saltbrush", qty: 2 },
            { reagentId: "exp_dawn_dew", qty: 2 },
            { reagentId: "exp_ironscar_grit", qty: 3 }
          ],
          heat: "gentle",
          introductionOrder: "yin_first",
          seed: 0
        });
        const gritSunMedium = simulateRefinement({
          reagents: gritSun.input.reagents,
          heat: "medium",
          introductionOrder: gritSun.input.introductionOrder,
          seed: gritSun.input.seed
        });
        probes.push({
          id: "purify_grit_bundle",
          description: "Heavy grit with purifiers at gentle vs medium.",
          gentle: pickSummary(gritSun),
          medium: pickSummary(gritSunMedium)
        });
        const stack = [1, 2, 3, 4, 5].map((qty) => pickSummary(simulateRefinement({
          reagents: [{ reagentId: "exp_sun_stone", qty }],
          heat: "medium",
          seed: 0
        })));
        probes.push({
          id: "sun_stone_qty_stack",
          description: "Single-reagent Sun Stone quantity 1\u20135 at medium heat.",
          runs: stack
        });
        const purifyCandidates = combinations(REAGENT_IDS, 2).slice(0, 30).map((pair) => {
          const reagents = [{ reagentId: pair[0], qty: 2 }, { reagentId: pair[1], qty: 2 }];
          const r = simulateRefinement({ reagents, heat: "gentle", introductionOrder: "yin_first", seed: 0 });
          return { reagents, dominant: r.product.dominantAffinity, outcome: r.outcome };
        });
        const purifyDominant = purifyCandidates.filter((r) => r.dominant === "purify").length;
        probes.push({
          id: "purify_dominant_pairs",
          description: "First 30 pair combos (qty 2 each) at gentle yin-first \u2014 purify-dominant count.",
          purifyDominantCount: purifyDominant,
          sampleSize: purifyCandidates.length
        });
        return probes;
      }
      function pickSummary(result) {
        return {
          outcome: result.outcome,
          dominant: result.product.dominantAffinity,
          potency: result.product.potency,
          toxicity: result.product.effects.toxicity,
          peakInstability: result.peakInstability,
          impurityRatio: result.mixture.impurityRatio
        };
      }
      function rank(outcome) {
        const order = { rupture: 0, failed: 1, unstable_salvage: 2, refined: 3 };
        return order[outcome] ?? 0;
      }
      function round3(n) {
        return Math.round(n * 1e3) / 1e3;
      }
      function runFullStressAudit() {
        const plan = buildExperimentPlan();
        const results = runExperiments(plan);
        const summary = summarizeResults(results);
        return { planSize: plan.length, results, summary };
      }
      module.exports = {
        buildExperimentPlan,
        runExperiments,
        summarizeResults,
        runFullStressAudit,
        analyzeOrderSensitivity,
        probeDominantStrategies
      };
    }
  });

  // prototype/property-alchemy/index.js
  var require_index = __commonJS({
    "prototype/property-alchemy/index.js"(exports, module) {
      var reagents = require_reagents();
      var simulate = require_simulate();
      var journal = require_journal();
      var harness = require_harness();
      var stressAudit = require_stress_audit();
      var thermal = require_thermal();
      var thermalHarness = require_thermal_harness();
      module.exports = {
        ...reagents,
        ...simulate,
        ...journal,
        ...harness,
        ...stressAudit,
        ...thermal,
        ...thermalHarness
      };
    }
  });

  // prototype/property-alchemy/lab-explain.js
  var require_lab_explain = __commonJS({
    "prototype/property-alchemy/lab-explain.js"(exports, module) {
      function explainExperiment(result) {
        const lines = [];
        const proc = result.process?.outcome || result.outcome;
        lines.push(`Process: ${proc} (peak instability ${result.peakInstability}).`);
        if (result.material) {
          const m = result.material;
          lines.push(
            `Material \u2014 released spirit ${m.released?.spirit ?? 0}, still bound ${m.bound?.spirit ?? 0}, degraded ${m.degraded?.spirit ?? 0}.`
          );
          if (m.conservation && Math.abs(m.conservation.conservationDelta) > 0.05) {
            lines.push(`\u26A0 Conservation delta ${m.conservation.conservationDelta} (investigate).`);
          }
        }
        lines.push(
          `Product suitability: ${result.product?.suitability ?? "n/a"}; dominant affinity ${result.product?.dominantAffinity}; potency ${result.product?.potency}.`
        );
        if (result.trace?.length) {
          result.trace.forEach((ev) => {
            if ([
              "thermal_activation",
              "thermal_degradation",
              "bound_remainder",
              "introduction_shock",
              "destabilisation",
              "condensation_failed",
              "purify_scrub",
              "heat_stage"
            ].includes(ev.kind)) {
              lines.push(`\u2022 ${ev.message}`);
            }
          });
        } else if (result.diagnostics?.suggestedAdjustments?.length) {
          result.diagnostics.suggestedAdjustments.forEach((s) => lines.push(`\u2022 Suggestion: ${s}`));
        }
        if (result.observations?.length) {
          result.observations.forEach((o) => lines.push(`\u2022 Observed: ${o}`));
        }
        return lines;
      }
      function formatMaterialLedger(material) {
        if (!material) return { rows: [] };
        const rows = [
          { label: "Released (reactive)", spirit: material.released?.spirit ?? 0, note: "Available for chemistry / condensation" },
          { label: "Still bound", spirit: material.bound?.spirit ?? 0, note: "Unextracted \u2014 may respond to later heat" },
          { label: "Degraded", spirit: material.degraded?.spirit ?? 0, note: "Overburn / broken affinities" },
          { label: "Residual (bound+degraded)", spirit: material.residual?.spirit ?? 0, note: "Salvage hook" }
        ];
        if (material.conservation) {
          rows.unshift({
            label: "Input (registered)",
            spirit: material.conservation.inputSpirit,
            note: "Sum of reagent spirit in this run"
          });
        }
        return { rows, conservation: material.conservation };
      }
      function compareExperiments(a, b) {
        const fields = [
          ["Heat", (x) => x.input.heatStages?.join(" \u2192 ") || x.input.heat],
          ["Introduction order", (x) => x.input.introductionOrder || "simultaneous"],
          ["Process outcome", (x) => x.result.process?.outcome || x.result.outcome],
          ["Peak instability", (x) => x.result.peakInstability],
          ["Released spirit", (x) => x.result.material?.released?.spirit],
          ["Bound spirit", (x) => x.result.material?.bound?.spirit],
          ["Degraded spirit", (x) => x.result.material?.degraded?.spirit],
          ["Potency", (x) => x.result.product?.potency],
          ["Dominant affinity", (x) => x.result.product?.dominantAffinity],
          ["Suitability", (x) => x.result.product?.suitability]
        ];
        return fields.map(([label, fn]) => ({
          label,
          a: fn(a),
          b: fn(b),
          different: String(fn(a)) !== String(fn(b))
        }));
      }
      var LAB_PRESETS = {
        grit_activation: {
          name: "Ironscar Grit \u2014 gentle (bound-heavy)",
          input: { reagents: [{ reagentId: "exp_ironscar_grit", qty: 2 }], heat: "gentle", introductionOrder: "simultaneous" }
        },
        grit_medium: {
          name: "Ironscar Grit \u2014 medium (extract)",
          input: { reagents: [{ reagentId: "exp_ironscar_grit", qty: 2 }], heat: "medium", introductionOrder: "simultaneous" }
        },
        dew_gentle: {
          name: "Dawn Dew \u2014 gentle",
          input: { reagents: [{ reagentId: "exp_dawn_dew", qty: 2 }], heat: "gentle", introductionOrder: "simultaneous" }
        },
        dew_fierce: {
          name: "Dawn Dew \u2014 fierce (degradation)",
          input: { reagents: [{ reagentId: "exp_dawn_dew", qty: 2 }], heat: "fierce", introductionOrder: "simultaneous" }
        },
        conflict_mix: {
          name: "Conflicting \u2014 grit + dew simultaneous fierce",
          input: {
            reagents: [{ reagentId: "exp_ironscar_grit", qty: 2 }, { reagentId: "exp_dawn_dew", qty: 2 }],
            heat: "fierce",
            introductionOrder: "simultaneous"
          }
        },
        sequential_heat: {
          name: "Sequential \u2014 grit yang-first: fierce then gentle",
          input: {
            reagents: [{ reagentId: "exp_ironscar_grit", qty: 2 }, { reagentId: "exp_dawn_dew", qty: 2 }],
            heatStages: ["fierce", "gentle"],
            introductionOrder: "yang_first"
          }
        },
        useful_failure: {
          name: "Useful failure \u2014 volatile fierce yang-first",
          input: {
            reagents: [
              { reagentId: "exp_sun_stone", qty: 1 },
              { reagentId: "exp_blood_crystal", qty: 2 },
              { reagentId: "exp_soul_mist", qty: 2 }
            ],
            heat: "fierce",
            introductionOrder: "yang_first"
          }
        }
      };
      module.exports = {
        explainExperiment,
        formatMaterialLedger,
        compareExperiments,
        LAB_PRESETS
      };
    }
  });

  // prototype/property-alchemy/lab-entry.js
  var require_lab_entry = __commonJS({
    "prototype/property-alchemy/lab-entry.js"(exports, module) {
      module.exports = {
        ...require_index(),
        ...require_lab_explain()
      };
    }
  });
  return require_lab_entry();
})();
