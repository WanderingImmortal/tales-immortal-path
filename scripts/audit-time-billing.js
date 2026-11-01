/**
 * Stage 1 time billing — node audit (no DOM).
 * Run: node scripts/audit-time-billing.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let failed = 0;

function fail(msg) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
}

function ok(msg) {
    console.log(`ok: ${msg}`);
}

const rulesSrc = fs.readFileSync(path.join(root, 'advance-time-rules.js'), 'utf8');
vm.runInThisContext(rulesSrc, { filename: 'advance-time-rules.js' });

// --- Pure rule tests ---
if (resolveBillableAdvanceMonths(6, {}) !== 6) fail('6 months bill regardless of play (base)');
if (resolveBillableAdvanceMonths(6, { free: true }) !== 0) fail('free actions stay instant');
if (resolveBillableAdvanceMonths(0.25, {}) !== 0.25) fail('fractional chamber weeks bill');

ok('resolveBillableAdvanceMonths ignores play/pause');

if (!shouldPauseLivingClockForPlayerAdvance(6, {})) fail('player 6mo should pause calendar');
if (shouldPauseLivingClockForPlayerAdvance(0, {})) fail('instant should not pause calendar');
if (shouldPauseLivingClockForPlayerAdvance(6, { timeSource: 'calendar' })) fail('calendar source should not pause');
if (shouldPauseLivingClockForPlayerAdvance(6, { keepClockPlaying: true })) fail('keepClockPlaying opt-out');

ok('shouldPauseLivingClockForPlayerAdvance');

// --- Simulated advanceTime spine (matches core.js Stage 1) ---
function simulateAdvanceTime(state, months, opts) {
    opts = opts || {};
    months = resolveBillableAdvanceMonths(months, opts);
    if (months <= 0) return { ok: true, billed: 0, paused: false };
    let paused = false;
    if (shouldPauseLivingClockForPlayerAdvance(months, opts)) {
        state.clockPaused = true;
        paused = true;
    }
    const from = state.ageMonths;
    state.ageMonths = from + months;
    state.worldTicks += months;
    state.passiveBatches += months;
    return { ok: true, billed: months, from, to: state.ageMonths, paused };
}

function simulateClockWeek(state) {
    if (state.clockPaused || !state.clockPlay) return { advanced: 0 };
    const week = 0.25;
    state.ageMonths += week;
    state.worldTicks += week;
    state.passiveWeeks += 1;
    return { advanced: week };
}

function simulateProjectWeek(state, project) {
    if (!project) return { done: false };
    const week = 0.25;
    state.ageMonths += week;
    state.worldTicks += week;
    state.passiveWeeks += 1;
    project.elapsed += week;
    const done = project.elapsed >= project.duration;
    return { done, advanced: week };
}

function simulateProjectComplete(state, project) {
    if (!project) return;
    project.onComplete();
}

// Breakthrough: 6 months play on vs off
{
    const playOn = { ageMonths: 100, clockPlay: true, clockPaused: false, worldTicks: 0, passiveBatches: 0, passiveWeeks: 0 };
    const r = simulateAdvanceTime(playOn, 6, {});
    if (r.billed !== 6 || playOn.ageMonths !== 106) fail('breakthrough bills 6mo with play requested');
    if (!playOn.clockPaused) fail('breakthrough pauses living calendar');
    const playOff = { ageMonths: 100, clockPlay: false, clockPaused: true, worldTicks: 0, passiveBatches: 0, passiveWeeks: 0 };
    const r2 = simulateAdvanceTime(playOff, 6, {});
    if (r2.billed !== 6 || playOff.ageMonths !== 106) fail('breakthrough bills 6mo when paused');
    ok('breakthrough 6mo billing play on/off');
}

// Chamber week
{
    const s = { ageMonths: 200, clockPlay: true, clockPaused: false, worldTicks: 0, passiveBatches: 0, passiveWeeks: 0 };
    simulateAdvanceTime(s, 0.25, {});
    if (s.ageMonths !== 200.25) fail('chamber week bills 0.25mo with play on');
    ok('chamber week billing');
}

// Project: duration on calendar only, completion handler does not advanceTime again
{
    const s = { ageMonths: 0, clockPlay: true, clockPaused: false, worldTicks: 0, passiveBatches: 0, passiveWeeks: 0, focusedRuns: 0 };
    const project = { duration: 1, elapsed: 0, onComplete: () => { s.focusedRuns += 1; } };
    let guard = 0;
    while (!simulateProjectWeek(s, project).done && guard++ < 20) { /* */ }
    simulateProjectComplete(s, project);
    if (Math.abs(s.ageMonths - 1) > 1e-9) fail(`project should advance 1mo via calendar, got ${s.ageMonths}`);
    if (s.focusedRuns !== 1) fail('completion runs focused session once');
    const ageAfterComplete = s.ageMonths;
    simulateAdvanceTime(s, 0, {});
    if (s.ageMonths !== ageAfterComplete) fail('completion must not double-bill via advanceTime(0)');
    ok('project calendar ownership without double bill');
}

// No overlap: billed action pauses clock; subsequent clock week should not run until play resumed
{
    const s = { ageMonths: 50, clockPlay: true, clockPaused: false, worldTicks: 0, passiveBatches: 0, passiveWeeks: 0 };
    simulateAdvanceTime(s, 3, {});
    const w = simulateClockWeek(s);
    if (w.advanced !== 0 || s.ageMonths !== 53) fail('clock should not advance while paused after billed action');
    s.clockPaused = false;
    s.clockPlay = true;
    simulateClockWeek(s);
    if (s.ageMonths !== 53.25) fail('clock resumes after user play');
    ok('no clock overlap during billed player advance');
}

// Instant
{
    const s = { ageMonths: 10, clockPlay: true, clockPaused: false, worldTicks: 0, passiveBatches: 0, passiveWeeks: 0 };
    simulateAdvanceTime(s, 0, { free: true });
    if (s.ageMonths !== 10) fail('instant free action');
    ok('instant interactions');
}

// World ticks on billed advance
{
    const s = { ageMonths: 0, clockPlay: false, clockPaused: true, worldTicks: 0, passiveBatches: 0, passiveWeeks: 0 };
    simulateAdvanceTime(s, 12, {});
    if (s.worldTicks !== 12) fail('NPC/world delta follows billed months');
    ok('world progression on action-driven advance');
}

if (failed) {
    console.error(`\n${failed} check(s) failed.`);
    process.exit(1);
}
console.log('\nAll time billing audits passed.');
