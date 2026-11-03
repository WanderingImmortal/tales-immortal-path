/** @typedef {'quick'|'heavy'|'thrust'} AttackKind */
/** @typedef {'evade'|'block'|'parry'|'counter'} ReactionKind */

/** Fixed simulation timestep (seconds). */
const FIXED_DT = 0.05;

const ARENA = {
    width: 18,
    height: 18,
    bodyRadius: 0.45
};

/** Attack templates — sandbox-only tuning knobs. */
const ATTACKS = {
    quick: {
        id: 'quick',
        label: 'Quick Strike',
        prep: 0.22,
        exec: 0.10,
        recovery: 0.32,
        reach: 1.35,
        halfAngleRad: (55 * Math.PI) / 180,
        baseDamage: 9,
        interruptibility: 0.55,
        telegraphRange: 8
    },
    heavy: {
        id: 'heavy',
        label: 'Heavy Strike',
        prep: 0.52,
        exec: 0.16,
        recovery: 0.62,
        reach: 1.55,
        halfAngleRad: (65 * Math.PI) / 180,
        baseDamage: 19,
        interruptibility: 0.35,
        telegraphRange: 8
    },
    thrust: {
        id: 'thrust',
        label: 'Thrust',
        prep: 0.34,
        exec: 0.12,
        recovery: 0.42,
        reach: 2.35,
        halfAngleRad: (18 * Math.PI) / 180,
        baseDamage: 13,
        interruptibility: 0.45,
        telegraphRange: 9
    }
};

const REACTIONS = {
    evade: {
        id: 'evade',
        label: 'Evade',
        decisionToStart: 0.04,
        moveDuration: 0.22,
        moveSpeedMult: 1.65,
        recovery: 0.18,
        iFrameStart: 0.06
    },
    block: {
        id: 'block',
        label: 'Block',
        decisionToStart: 0.05,
        activeDuration: 0.28,
        recovery: 0.12,
        damageMult: 0.35,
        staggerThreshold: 14
    },
    parry: {
        id: 'parry',
        label: 'Parry',
        decisionToStart: 0.07,
        activeDuration: 0.16,
        recovery: 0.20,
        riposteWindow: 0.35
    },
    counter: {
        id: 'counter',
        label: 'Counterattack',
        decisionToStart: 0.08,
        prep: 0.14,
        exec: 0.10,
        recovery: 0.38,
        reach: 1.25,
        halfAngleRad: (40 * Math.PI) / 180,
        baseDamage: 11,
        interruptPower: 1.2
    }
};

const DEFAULT_PARAMS = {
    moveSpeed: 4.2,
    reactionLatency: 0.14,
    martialSkill: 0.55,
    defensiveStrength: 0.55,
    attackPower: 1.0,
    perception: 0.6
};

const CANCEL_PREP_RECOVERY = 0.18;

module.exports = {
    FIXED_DT,
    ARENA,
    ATTACKS,
    REACTIONS,
    DEFAULT_PARAMS,
    CANCEL_PREP_RECOVERY
};
