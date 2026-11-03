/* global CombatSandbox */
'use strict';

const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const logEl = document.getElementById('combatLog');
const statusEl = document.getElementById('statusLine');
const decisionPanel = document.getElementById('decisionPanel');
const decisionText = document.getElementById('decisionText');

let sim = CombatSandbox.createSimulation({ seed: 42, preset: CombatSandbox.getPreset('equal') });
let raf = null;
let lastFrame = 0;
let accum = 0;

function scaleX(x) {
    return (x / CombatSandbox.ARENA.width) * canvas.width;
}
function scaleY(y) {
    return (y / CombatSandbox.ARENA.height) * canvas.height;
}

function drawArena() {
    const W = canvas.width;
    const H = canvas.height;
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
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.strokeStyle = f.role === 'player' ? '#a8fff8' : '#ffc0a8';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(f.facing) * r * 2.2, y + Math.sin(f.facing) * r * 2.2);
    ctx.stroke();

    const a = f.action;
    if (a.type === 'attack' && (a.phase === 'prep' || a.phase === 'exec')) {
        const atk = CombatSandbox.ATTACKS[a.kind];
        ctx.fillStyle = a.phase === 'prep' ? 'rgba(200,168,64,0.15)' : 'rgba(255,80,80,0.22)';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, scaleX(atk.reach), f.facing - atk.halfAngleRad, f.facing + atk.halfAngleRad);
        ctx.closePath();
        ctx.fill();
    }

    ctx.fillStyle = '#e8e4dc';
    ctx.font = '11px monospace';
    const label = `${f.role} ${a.type}${a.kind ? ':' + a.kind : ''} ${a.phase}`;
    ctx.fillText(label, x - 40, y - r - 4);
    ctx.fillText(`HP ${f.hp}`, x - 18, y + r + 12);
}

function refreshLog() {
    logEl.textContent = sim.state.log.slice(-40).map(l => `[${l.t.toFixed(2)}] ${l.text}`).join('\n');
    logEl.scrollTop = logEl.scrollHeight;
}

function refreshStatus() {
    const s = sim.state;
    let txt = `t=${s.time.toFixed(2)}s · ${s.paused ? 'PAUSED (' + (s.pauseReason || '') + ')' : 'running'} · speed×${s.speedMult}`;
    if (s.winner) txt += ` · WINNER: ${s.winner}`;
    statusEl.textContent = txt;
}

function refreshDecisionUI() {
    const pd = sim.state.pendingDecision;
    if (pd && sim.state.paused) {
        decisionPanel.classList.remove('hidden');
        const atk = CombatSandbox.ATTACKS[pd.attackKind];
        decisionText.textContent = `Incoming ${atk.label}. React ready after latency (~${pd.reactReadyAt.toFixed(2)}s). Hit ~${pd.hitAt.toFixed(2)}s.`;
    } else {
        decisionPanel.classList.add('hidden');
    }
    document.getElementById('btnPause').textContent = sim.state.paused ? 'Resume' : 'Pause';
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
    el.value = String(val);
    document.getElementById(labelId).textContent = Number(val).toFixed(2);
}

function bindSlider(id, labelId, apply) {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
        const v = parseFloat(el.value);
        document.getElementById(labelId).textContent = v.toFixed(2);
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
    raf = requestAnimationFrame(tickLoop);
}

function loadPresetId(id) {
    const preset = CombatSandbox.getPreset(id);
    sim = CombatSandbox.createSimulation({
        seed: sim.state.seed,
        playerParams: { ...preset.player },
        opponentParams: { ...preset.opponent },
        autoPauseOnDecision: document.getElementById('autoPause').checked
    });
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

canvas.addEventListener('click', ev => {
    const rect = canvas.getBoundingClientRect();
    const px = ((ev.clientX - rect.left) / rect.width) * canvas.width;
    const py = ((ev.clientY - rect.top) / rect.height) * canvas.height;
    const wx = (px / canvas.width) * CombatSandbox.ARENA.width;
    const wy = (py / canvas.height) * CombatSandbox.ARENA.height;
    sim.queuePlayerMove(wx, wy);
});

document.getElementById('btnPause').addEventListener('click', () => {
    if (sim.state.paused) sim.setRunning();
    else sim.setPaused('manual');
});

document.getElementById('btnStep').addEventListener('click', () => {
    CombatSandbox.tickOpponentAi(sim);
    sim.stepOneTick();
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
});

document.getElementById('speedRange').addEventListener('input', ev => {
    sim.state.speedMult = parseFloat(ev.target.value);
    document.getElementById('speedVal').textContent = ev.target.value;
});

document.getElementById('autoPause').addEventListener('change', ev => {
    sim.state.autoPauseOnDecision = ev.target.checked;
});

document.querySelectorAll('[data-attack]').forEach(btn => {
    btn.addEventListener('click', () => sim.queuePlayerAttack(btn.getAttribute('data-attack')));
});

document.querySelectorAll('[data-react]').forEach(btn => {
    btn.addEventListener('click', () => sim.queuePlayerReaction(btn.getAttribute('data-react')));
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
refreshLog();
raf = requestAnimationFrame(tickLoop);
