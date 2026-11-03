'use strict';

function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

function dist(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.hypot(dx, dy);
}

function normalizeAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
}

function angleDiff(from, to) {
    return Math.abs(normalizeAngle(to - from));
}

/** Point (px,py) within sector from (ox,oy) facing `facing`, reach, halfAngle. */
function pointInSector(px, py, ox, oy, facing, reach, halfAngleRad) {
    const dx = px - ox;
    const dy = py - oy;
    const d = Math.hypot(dx, dy);
    if (d > reach + 0.01) return { inside: false, distance: d, angleDelta: Math.PI };
    const ang = Math.atan2(dy, dx);
    const delta = angleDiff(facing, ang);
    if (delta > halfAngleRad + 0.08) return { inside: false, distance: d, angleDelta: delta };
    return { inside: true, distance: d, angleDelta: delta };
}

function moveToward(x, y, tx, ty, maxStep) {
    const dx = tx - x;
    const dy = ty - y;
    const d = Math.hypot(dx, dy);
    if (d <= maxStep || d < 1e-6) return { x: tx, y: ty, arrived: d <= maxStep };
    return { x: x + (dx / d) * maxStep, y: y + (dy / d) * maxStep, arrived: false };
}

function clampToArena(x, y, width, height, radius) {
    return {
        x: clamp(x, radius, width - radius),
        y: clamp(y, radius, height - radius)
    };
}

module.exports = {
    clamp,
    dist,
    normalizeAngle,
    angleDiff,
    pointInSector,
    moveToward,
    clampToArena
};
