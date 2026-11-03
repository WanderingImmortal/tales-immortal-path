'use strict';

/** Mulberry32 — deterministic seeded PRNG. */
function createRng(seed) {
    let s = seed >>> 0;
    return {
        next() {
            s += 0x6D2B79F5;
            let t = s;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        },
        chance(p) {
            return this.next() < p;
        }
    };
}

module.exports = { createRng };
