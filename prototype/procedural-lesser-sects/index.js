'use strict';

const catalog = require('./catalog');
const generator = require('./generator');
const { createRng } = require('./rng');

module.exports = {
    ...generator,
    createRng,
    TEST_CATALOG: catalog.TEST_CATALOG,
    LESSER_SECT_BLOCKED_NAMES: catalog.LESSER_SECT_BLOCKED_NAMES,
    LESSER_SECT_ZONE_LEADER_REALM_CAP: catalog.LESSER_SECT_ZONE_LEADER_REALM_CAP
};
