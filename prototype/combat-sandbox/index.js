'use strict';

const { createSimulation, cloneParams } = require('./simulation');
const { PRESETS, listPresets, getPreset } = require('./presets');
const { tickOpponentAi } = require('./ai');
const constants = require('./constants');
const geometry = require('./geometry');
const { createRng } = require('./rng');

module.exports = {
    createSimulation,
    cloneParams,
    PRESETS,
    listPresets,
    getPreset,
    tickOpponentAi,
    ...constants,
    geometry,
    createRng
};
