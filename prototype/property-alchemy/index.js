const reagents = require('./reagents');
const simulate = require('./simulate');
const journal = require('./journal');
const harness = require('./harness');
const stressAudit = require('./stress-audit');
const thermal = require('./thermal');
const thermalHarness = require('./thermal-harness');

module.exports = {
    ...reagents,
    ...simulate,
    ...journal,
    ...harness,
    ...stressAudit,
    ...thermal,
    ...thermalHarness
};
