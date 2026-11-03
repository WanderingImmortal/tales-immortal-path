'use strict';

const { ATTACKS } = require('./constants');

/**
 * Simple opponent AI — same rules as player; no instant reactions.
 * @param {ReturnType<import('./simulation').createSimulation>} sim
 */
function tickOpponentAi(sim, opts = {}) {
    const state = sim.state;
    const ai = state.fighters.find(f => f.role === 'opponent');
    const player = state.fighters.find(f => f.role === 'player');
    if (!ai || !player || state.winner) return;

    if (state.paused && state.pauseReason === 'reaction_decision') return;

    if (!ai._ai) {
        ai._ai = {
            nextThink: state.time + 0.2,
            mood: 'neutral'
        };
    }
    const brain = ai._ai;
    if (state.time < brain.nextThink) return;
    brain.nextThink = state.time + 0.35 + sim.rng.next() * 0.25;

    if (sim.rng.chance(0.12)) {
        brain.mood = sim.rng.chance(0.5) ? 'aggressive' : 'cautious';
    }

    const dist = Math.hypot(player.x - ai.x, player.y - ai.y);

    if (state.pendingDecision && state.pendingDecision.defenderId === ai.id) {
        const pd = state.pendingDecision;
        const timeToHit = pd.hitAt - (state.time + ai.params.reactionLatency);
        const kind = timeToHit < 0.12 ? 'block' : sim.rng.chance(0.35 + ai.params.martialSkill * 0.2) ? 'evade' : 'block';
        sim.startReaction(ai, kind, { reactReadyAt: Math.max(state.time, pd.reactReadyAt) });
        return;
    }

    if (sim.isBusy(ai)) {
        if (sim.canCancelAttack(ai) && brain.mood === 'cautious' && dist > 3 && sim.rng.chance(0.08)) {
            ai.action = { type: 'idle', phase: 'recovery', startedAt: state.time, until: state.time + 0.18 };
            sim.pushLog('Opponent cancels telegraphed attack (cautious).', { fighter: ai.id });
        }
        return;
    }

    if (player.action.type === 'attack' && player.action.phase === 'prep' && dist < 2.2 && sim.rng.chance(0.15 + ai.params.martialSkill * 0.2)) {
        sim.startReaction(ai, 'counter', { reactReadyAt: state.time + ai.params.reactionLatency });
        return;
    }

    if (dist > 2.0) {
        sim.startMove(ai, player.x, player.y);
        return;
    }

    const roll = sim.rng.next();
    let kind = 'quick';
    if (roll > 0.55) kind = 'heavy';
    else if (roll > 0.78) kind = 'thrust';
    if (brain.mood === 'aggressive' && roll > 0.4) kind = 'heavy';
    if (brain.mood === 'cautious' && roll < 0.5) kind = 'quick';
    sim.startAttack(ai, kind);
}

module.exports = { tickOpponentAi };
