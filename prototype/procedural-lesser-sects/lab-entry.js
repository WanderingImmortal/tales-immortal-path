'use strict';

const api = require('./index');

if (typeof window !== 'undefined') {
    window.LesserSectGen = api;
}

module.exports = api;
