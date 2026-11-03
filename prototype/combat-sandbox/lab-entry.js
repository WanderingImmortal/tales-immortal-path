'use strict';

const sandbox = require('./index');

if (typeof window !== 'undefined') {
    window.CombatSandbox = sandbox;
}

module.exports = sandbox;
