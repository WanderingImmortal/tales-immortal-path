/* global CombatSandbox */
'use strict';

const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const viewport = document.getElementById('viewport');
const logEl = document.getElementById('combatLog');
const statusEl = document.getElementById('statusLine');
const decisionPanel = document.getElementById('decisionPanel');
const decisionText = document.getElementById('decisionText');

let sim = CombatSandbox.createSimulation({ seed: 42, preset: CombatSandbox.getPreset('equal') });
let lastFrame = 0;
let accum = 0;

let viewScale = 1;
let viewPanX = 0;
let viewPanY = 0;
let pinchStartDist = null;
let pinchStartScale = 1;
let lastTapTime = 0;

function dist2d(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function applyCanvasTransform() {
    canvas.style.transform = `translate(${viewPanX}px, ${viewPanY}px) scale(${viewScale})`;
}

function clampView() {
    viewScale = Math.max(0.75, Math.min(2.5, viewScale));
    applyCanvasTransform();
}

function scaleX(x) {
    return (x / CombatSandbox.ARENA.width) * canvas.width;
}
function scaleY(y) {
    return (y / CombatSandbox.ARENA.height) * canvas.height;
}

function clientToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * canvas.width;
    const py = ((clientY - rect.top) / rect.height) * canvas.height;
    return {
        wx: (px / canvas.width) * CombatSandbox.ARENA.width,
        wy: (py / canvas.height) * CombatSandbox.ARENA.height
    };
}

function handleArenaTap(wx, wy) {
    const player = sim.fighterById('player');
    const opponent = sim.fighterById('opponent');
    if (!player || !opponent) return;

    const tapOnOpponent = dist2d(wx, wy, opponent.x, opponent.y)
        <= CombatSandbox.ARENA.bodyRadius * 2.8;

    if (tapOnOpponent) {
        const angle = Math.atan2(opponent.y - player.y, opponent.x - player.x);
        const standOff = 1.15;
        const tx = opponent.x - Math.cos(angle) * standOff;
        const ty = opponent.y - Math.sin(angle) * standOff;
        player.facing = angle;
        sim.queuePlayerMove(tx, ty);
        sim.pushLog('Target: opponent — closing to engagement range.', { tap: 'target' });
    } else {
        sim.queuePlayerMove(wx, wy);
    }
}

function drawArena() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0e0c12';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#2a2430';
    for (let i = 0; i <= CombatSandbox.ARENA.width; i++) {
        ctx.beginPath();
        ctx.moveTo(scaleX(i), 0);
        ctx.lineTo(scaleX(i), H);
        ctx.stroke();
    }
    for (let j = 0; j <= CombatSandbox.ARENA.height; j++) {
        ctx.beginPath();
        ctx.moveTo(0, scaleY(j));
        ctx.lineTo(W, scaleY(j));
        ctx.stroke();
    }

    for (const f of sim.state.fighters) {
        drawFighter(f);
    }
}

function drawFighter(f) {
    const x = scaleX(f.x);
    const y = scaleY(f.y);
    const r = scaleX(CombatSandbox.ARENA.bodyRadius);
    ctx.fillStyle = f.role === 'player' ? '#4ecdc4' : '#e07050';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = f.role === 'player' ? '#a8fff8' : '#ffc0a8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(f.facing) * r * 2.4, y + Math.sin(f.facing) * r * 2.4);
    ctx.stroke();

    const a = f.action;
    if (a.type === 'attack' && (a.phase === 'prep' || a.phase === 'exec')) {
        const atk = CombatSandbox.ATTACKS[a.kind];
        ctx.fillStyle = a.phase === 'prep' ? 'rgba(200,168,64,0.22)' : 'rgba(255,80,80,0.28)';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, scaleX(atk.reach), f.facing - atk.halfAngleRad, f.facing + atk.halfAngleRad);
        ctx.closePath();
        ctx.fill();
    }

    ctx.fillStyle = '#e8e4dc';
    ctx.font = 'bold 13px system-ui,sans-serif';
    ctx.fillText(f.role === 'player' ? 'You' : 'Foe', x - 14, y - r - 6);
    ctx.font = '12px system-ui,sans-serif';
    ctx.fillText(`HP ${f.hp}`, x - 16, y + r + 14);
    if (a.type !== 'idle') {
        ctx.fillText(`${a.type}${a.kind ? ' ' + a.kind : ''} · ${a.phase}`, x - 36, y + r + 28);
    }
}

function refreshLog() {
    logEl.textContent = sim.state.log.slice(-50).map(l => `[${l.t.toFixed(2)}] ${l.text}`).join('\n');
    logEl.scrollTop = logEl.scrollHeight;
}

function refreshStatus() {
    const s = sim.state;
    let txt = `${s.paused ? 'Paused' : 'Running'} · ${s.time.toFixed(1)}s · speed×${s.speedMult.toFixed(2)}`;
    if (s.winner) txt += s.winner === 'player' ? ' · You win' : ' · Opponent wins';
    statusEl.textContent = txt;
}

function refreshDecisionUI() {
    const pd = sim.state.pendingDecision;
    if (pd && sim.state.paused) {
        decisionPanel.classList.remove('hidden');
        const atk = CombatSandbox.ATTACKS[pd.attackKind];
        const tHit = (pd.hitAt - sim.state.time).toFixed(2);
        decisionText.textContent = `Incoming ${atk.label}. About ${tHit}s to impact — pick a reaction.`;
    } else {
        decisionPanel.classList.add('hidden');
    }
    const btn = document.getElementById('btnPause');
    if (sim.state.winner) btn.textContent = 'Fight over — Reset';
    else btn.textContent = sim.state.paused ? 'Resume' : 'Pause';
}

function syncSlidersFromSim() {
    const p = sim.fighterById('player').params;
    const o = sim.fighterById('opponent').params;
    setSlider('pMove', 'pMoveVal', p.moveSpeed);
    setSlider('pLat', 'pLatVal', p.reactionLatency);
    setSlider('pSkill', 'pSkillVal', p.martialSkill);
    setSlider('pDef', 'pDefVal', p.defensiveStrength);
    setSlider('oMove', 'oMoveVal', o.moveSpeed);
    setSlider('oLat', 'oLatVal', o.reactionLatency);
}

function setSlider(id, labelId, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = String(val);
    const lab = document.getElementById(labelId);
    if (lab) lab.textContent = Number(val).toFixed(2);
}

function bindSlider(id, labelId, apply) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
        const v = parseFloat(el.value);
        const lab = document.getElementById(labelId);
        if (lab) lab.textContent = v.toFixed(2);
        apply(v);
    });
}

function tickLoop(now) {
    if (!lastFrame) lastFrame = now;
    const dt = Math.min(0.1, (now - lastFrame) / 1000);
    lastFrame = now;
    if (!sim.state.paused && !sim.state.winner) {
        accum += dt * sim.state.speedMult;
        while (accum >= sim.FIXED_DT) {
            CombatSandbox.tickOpponentAi(sim);
            sim.stepOneTick();
            accum -= sim.FIXED_DT;
        }
    }
    drawArena();
    refreshLog();
    refreshStatus();
    refreshDecisionUI();
    requestAnimationFrame(tickLoop);
}

function loadPresetId(id) {
    const preset = CombatSandbox.getPreset(id);
    sim = CombatSandbox.createSimulation({
        seed: sim.state.seed,
        playerParams: { ...preset.player },
        opponentParams: { ...preset.opponent },
        autoPauseOnDecision: document.getElementById('autoPause').checked
    });
    sim.setPaused('start');
    syncSlidersFromSim();
    refreshLog();
}

function initPresets() {
    const sel = document.getElementById('presetSelect');
    CombatSandbox.listPresets().forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.label;
        sel.appendChild(opt);
    });
    document.getElementById('loadPreset').addEventListener('click', () => loadPresetId(sel.value));
}

function onPointerUp(clientX, clientY) {
    const now = Date.now();
    if (now - lastTapTime < 350) return;
    lastTapTime = now;
    const { wx, wy } = clientToWorld(clientX, clientY);
    handleArenaTap(wx, wy);
}

viewport.addEventListener('pointerup', ev => {
    if (ev.pointerType === 'touch') return;
    if (ev.button !== 0) return;
    if (pinchStartDist != null) return;
    onPointerUp(ev.clientX, ev.clientY);
});

viewport.addEventListener('touchstart', ev => {
    if (ev.touches.length === 2) {
        pinchStartDist = dist2d(
            ev.touches[0].clientX, ev.touches[0].clientY,
            ev.touches[1].clientX, ev.touches[1].clientY
        );
        pinchStartScale = viewScale;
    }
}, { passive: true });

viewport.addEventListener('touchmove', ev => {
    if (ev.touches.length === 2 && pinchStartDist) {
        ev.preventDefault();
        const d = dist2d(
            ev.touches[0].clientX, ev.touches[0].clientY,
            ev.touches[1].clientX, ev.touches[1].clientY
        );
        viewScale = pinchStartScale * (d / pinchStartDist);
        clampView();
    }
}, { passive: false });

viewport.addEventListener('touchend', ev => {
    if (ev.touches.length < 2) pinchStartDist = null;
    if (ev.changedTouches.length === 1 && ev.touches.length === 0) {
        const t = ev.changedTouches[0];
        onPointerUp(t.clientX, t.clientY);
    }
}, { passive: true });

document.getElementById('zoomIn').addEventListener('click', () => {
    viewScale *= 1.15;
    clampView();
});
document.getElementById('zoomOut').addEventListener('click', () => {
    viewScale /= 1.15;
    clampView();
});
document.getElementById('zoomReset').addEventListener('click', () => {
    viewScale = 1;
    viewPanX = 0;
    viewPanY = 0;
    clampView();
});

document.getElementById('btnPause').addEventListener('click', () => {
    if (sim.state.winner) {
        document.getElementById('btnReset').click();
        return;
    }
    if (sim.state.paused) sim.setRunning();
    else sim.setPaused('manual');
});

document.getElementById('btnReset').addEventListener('click', () => {
    const p = sim.fighterById('player').params;
    const o = sim.fighterById('opponent').params;
    sim = CombatSandbox.createSimulation({
        seed: sim.state.seed + 1,
        playerParams: { ...p },
        opponentParams: { ...o },
        autoPauseOnDecision: document.getElementById('autoPause').checked
    });
    sim.setPaused('start');
    refreshLog();
});

document.getElementById('speedRange').addEventListener('input', ev => {
    sim.state.speedMult = parseFloat(ev.target.value);
    document.getElementById('speedVal').textContent = ev.target.value;
});

document.getElementById('autoPause').addEventListener('change', ev => {
    sim.state.autoPauseOnDecision = ev.target.checked;
});

document.querySelectorAll('[data-attack]').forEach(btn => {
    btn.addEventListener('click', () => {
        sim.queuePlayerAttack(btn.getAttribute('data-attack'));
    });
});

document.querySelectorAll('[data-react]').forEach(btn => {
    btn.addEventListener('click', () => {
        sim.queuePlayerReaction(btn.getAttribute('data-react'));
    });
});

document.getElementById('btnCancel').addEventListener('click', () => sim.cancelPlayerAttack());

bindSlider('pMove', 'pMoveVal', v => { sim.fighterById('player').params.moveSpeed = v; });
bindSlider('pLat', 'pLatVal', v => { sim.fighterById('player').params.reactionLatency = v; });
bindSlider('pSkill', 'pSkillVal', v => { sim.fighterById('player').params.martialSkill = v; });
bindSlider('pDef', 'pDefVal', v => { sim.fighterById('player').params.defensiveStrength = v; });
bindSlider('oMove', 'oMoveVal', v => { sim.fighterById('opponent').params.moveSpeed = v; });
bindSlider('oLat', 'oLatVal', v => { sim.fighterById('opponent').params.reactionLatency = v; });

initPresets();
syncSlidersFromSim();
sim.setPaused('start');
sim.state.autoPauseOnDecision = true;
refreshLog();
clampView();
requestAnimationFrame(tickLoop);
