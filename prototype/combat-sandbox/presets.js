'use strict';

const { DEFAULT_PARAMS } = require('./constants');

const PRESETS = {
    equal: {
        id: 'equal',
        label: 'Equal Opponents',
        player: { ...DEFAULT_PARAMS },
        opponent: { ...DEFAULT_PARAMS }
    },
    faster_opponent: {
        id: 'faster_opponent',
        label: 'Faster Opponent',
        player: { ...DEFAULT_PARAMS },
        opponent: {
            ...DEFAULT_PARAMS,
            moveSpeed: 6.2,
            reactionLatency: 0.09,
            martialSkill: 0.52
        }
    },
    skilled_veteran: {
        id: 'skilled_veteran',
        label: 'Skilled Veteran',
        player: {
            ...DEFAULT_PARAMS,
            moveSpeed: 3.6,
            reactionLatency: 0.10,
            martialSkill: 0.82,
            defensiveStrength: 0.75,
            perception: 0.78
        },
        opponent: {
            ...DEFAULT_PARAMS,
            moveSpeed: 4.8,
            martialSkill: 0.48
        }
    },
    overwhelming_speed: {
        id: 'overwhelming_speed',
        label: 'Overwhelming Speed',
        player: { ...DEFAULT_PARAMS },
        opponent: {
            ...DEFAULT_PARAMS,
            moveSpeed: 9.5,
            reactionLatency: 0.05,
            martialSkill: 0.5,
            attackPower: 1.05
        }
    }
};

function listPresets() {
    return Object.values(PRESETS).map(p => ({ id: p.id, label: p.label }));
}

function getPreset(id) {
    return PRESETS[id] || PRESETS.equal;
}

module.exports = { PRESETS, listPresets, getPreset };
