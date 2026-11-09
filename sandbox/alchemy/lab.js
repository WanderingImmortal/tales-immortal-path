/**
 * Interactive furnace laboratory UI
 */
(function () {
    if (typeof AlchemyLab === 'undefined') {
        document.body.innerHTML = '<p style="color:red;padding:2rem">AlchemyLab bundle missing. Run: node scripts/bundle-alchemy-lab.js</p>';
        return;
    }

    const {
        EXPERIMENTAL_REAGENTS, REAGENT_IDS,
        createFurnaceState, startFurnace, pauseFurnace, resumeFurnace,
        setFurnaceHeat, introduceToFurnace, stepFurnace, condenseFurnace,
        resetFurnace, snapshotFurnace, formatSimTime, SIM_DT,
        explainExperiment, formatMaterialLedger, compareExperiments,
        describeReagent, summarizeRefinement, formatSpiritBreakdown,
        interpretComparison, formatProcedureChronicle, KNOWLEDGE_STATES,
        MEDICINAL_LABELS, MEDICINAL_PROPERTY_IDS
    } = AlchemyLab;

    function formatMedicinalProduct(product) {
        const med = product?.medicinal;
        if (!med) return 'Medicinal profile: —';
        const parts = MEDICINAL_PROPERTY_IDS
            .filter((id) => (med[id] || 0) > 0.05)
            .map((id) => `${MEDICINAL_LABELS[id]} ${med[id]}`);
        return parts.length ? `Medicinal strengths: ${parts.join(' · ')}` : 'Medicinal profile: negligible';
    }

    const els = {
        flameBar: document.getElementById('flameBar'),
        flameLabel: document.getElementById('flameLabel'),
        furnaceStatus: document.getElementById('furnaceStatus'),
        simTime: document.getElementById('simTime'),
        startBtn: document.getElementById('startBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        resumeBtn: document.getElementById('resumeBtn'),
        condenseBtn: document.getElementById('condenseBtn'),
        resetBtn: document.getElementById('resetBtn'),
        speedSelect: document.getElementById('speedSelect'),
        reagentPick: document.getElementById('reagentPick'),
        addQty: document.getElementById('addQty'),
        addToFurnace: document.getElementById('addToFurnace'),
        inspectReagent: document.getElementById('inspectReagent'),
        inFurnaceList: document.getElementById('inFurnaceList'),
        reagentInfo: document.getElementById('reagentInfo'),
        chronicleLive: document.getElementById('chronicleLive'),
        liveInstability: document.getElementById('liveInstability'),
        livePeak: document.getElementById('livePeak'),
        livePolarity: document.getElementById('livePolarity'),
        liveMedicinal: document.getElementById('liveMedicinal'),
        liveContamination: document.getElementById('liveContamination'),
        livePurity: document.getElementById('livePurity'),
        liveExpelled: document.getElementById('liveExpelled'),
        liveSeparable: document.getElementById('liveSeparable'),
        liveStability: document.getElementById('liveStability'),
        liveNotes: document.getElementById('liveNotes'),
        spiritBreakdown: document.getElementById('spiritBreakdown'),
        summaryOut: document.getElementById('summaryOut'),
        processOut: document.getElementById('processOut'),
        materialOut: document.getElementById('materialOut'),
        explainOut: document.getElementById('explainOut'),
        ledgerBody: document.getElementById('ledgerBody'),
        inspectJson: document.getElementById('inspectJson'),
        chronicleJson: document.getElementById('chronicleJson'),
        historyList: document.getElementById('historyList'),
        compareSelectA: document.getElementById('compareSelectA'),
        compareSelectB: document.getElementById('compareSelectB'),
        compareInterpret: document.getElementById('compareInterpret'),
        compareTable: document.getElementById('compareTable')
    };

    let furnace = createFurnaceState({ seed: 0, heat: 'medium' });
    let animFrame = null;
    let history = [];
    let historyId = 0;
    let comparePick = { a: null, b: null };
    let lastChronicleLen = 0;
    let lastResult = null;

    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function initReagentPick() {
        els.reagentPick.innerHTML = REAGENT_IDS.map(id => {
            const d = EXPERIMENTAL_REAGENTS[id];
            return `<option value="${id}">${d.name}</option>`;
        }).join('');
    }

    function renderReagentInfo(reagentId) {
        const info = describeReagent(reagentId);
        if (!info.properties.length) {
            els.reagentInfo.innerHTML = `<p class="muted">${escapeHtml(info.note || 'No data.')}</p>`;
            return;
        }
        const knowledgeMeta = (KNOWLEDGE_STATES && KNOWLEDGE_STATES.established) || { label: 'Established', hint: '' };
        els.reagentInfo.innerHTML = `
      <div class="reagent-info-head">
        <strong>${escapeHtml(info.name)}</strong>
        <span class="knowledge-pill knowledge-established">${escapeHtml(knowledgeMeta.label)}</span>
      </div>
      <p class="reagent-note">${escapeHtml(info.note || '')}</p>
      <dl class="prop-list">
        ${info.properties.map(p => `
          <div class="prop-row">
            <dt>${escapeHtml(p.label)}</dt>
            <dd><span class="prop-value">${escapeHtml(p.display)}</span>
            <span class="prop-detail">${escapeHtml(p.detail)}</span></dd>
          </div>`).join('')}
      </dl>`;
    }

    function aggregateInFurnace() {
        const map = {};
        furnace.introduced.forEach(r => {
            map[r.reagentId] = (map[r.reagentId] || 0) + r.qty;
        });
        return map;
    }

    function materialForDisplay() {
        const snap = snapshotFurnace(furnace);
        const cons = {
            inputSpirit: furnace.material.inputSpirit,
            conservationDelta: furnace.condensed && lastResult
                ? lastResult.material.conservation.conservationDelta : 0
        };
        return {
            released: { spirit: snap.spirit.released },
            bound: { spirit: snap.spirit.bound },
            degraded: { spirit: snap.spirit.degraded },
            residual: { spirit: snap.spirit.bound + snap.spirit.degraded },
            conservation: cons
        };
    }

    function updateFlameUi() {
        const heat = furnace.heatKey;
        els.flameBar.className = `flame-bar flame-${heat}${furnace.running && !furnace.paused ? ' flame-active' : ''}${!furnace.running ? ' flame-off' : ''}`;
        els.flameLabel.textContent = furnace.running
            ? `${heat} (${furnace.paused ? 'paused' : 'heating'})`
            : 'Off';
        document.querySelectorAll('.flame-buttons button').forEach(btn => {
            btn.classList.toggle('active-heat', btn.dataset.heat === heat);
        });
    }

    function renderLive() {
        const snap = snapshotFurnace(furnace);
        els.simTime.textContent = `Elapsed ${formatSimTime(snap.time)}`;
        els.liveInstability.textContent = snap.instability;
        els.livePeak.textContent = snap.peakInstability;
        els.livePolarity.textContent = snap.polarityImbalance;
        els.liveMedicinal.textContent = snap.spirit.released;
        els.liveContamination.textContent = snap.spirit.contamination ?? 0;
        els.livePurity.textContent = snap.spirit.purity != null ? `${snap.spirit.purity}%` : '—';
        els.liveExpelled.textContent = snap.spirit.expelled ?? 0;
        const removable = snap.spirit.separationRemovable ?? 0;
        els.liveSeparable.textContent = removable > 0.05 ? removable.toFixed(1) : '0 (stuck floor)';
        if (snap.mixtureDormant) {
            els.liveStability.textContent =
                'Mixture dormant — ledger steady; running instability eases toward neutral (peak keeps earlier spikes).';
        } else {
            els.liveStability.textContent =
                `Mixture reactive (drive ×${snap.instabilityReactive ?? 1}) — instability tracks active chemistry.`;
        }

        const status = furnace.condensed
            ? 'Condensed — reset to run again.'
            : furnace.running
                ? (furnace.paused ? 'Paused — chemistry halted.' : 'Refining…')
                : 'Idle — start or preheat, then add materials.';
        els.furnaceStatus.textContent = status;
        els.furnaceStatus.className = furnace.condensed ? 'furnace-status' : 'furnace-status muted';

        const agg = aggregateInFurnace();
        const keys = Object.keys(agg);
        els.inFurnaceList.innerHTML = keys.length
            ? keys.map(id => `<li>${agg[id]}× ${escapeHtml(EXPERIMENTAL_REAGENTS[id]?.name || id)}</li>`).join('')
            : '<li class="muted">Empty</li>';

        formatSpiritBreakdownUi(materialForDisplay());

        const notes = furnace.liveNotes.slice(-4);
        els.liveNotes.textContent = notes.length ? notes.join(' · ') : 'Watch extraction, instability, and degradation.';

        if (furnace.chronicle.length > lastChronicleLen) {
            const newItems = furnace.chronicle.slice(lastChronicleLen);
            newItems.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.timeLabel} — ${entry.message}`;
                els.chronicleLive.appendChild(li);
            });
            lastChronicleLen = furnace.chronicle.length;
        }

        els.inspectJson.textContent = JSON.stringify({
            snapshot: snap,
            material: {
                released: furnace.material.released.spirit,
                bound: Object.values(furnace.material.byReagent).reduce((s, b) => s + b.bound.spirit, 0),
                degraded: furnace.material.degraded.spirit
            },
            procedure: furnace.procedure
        }, null, 2);

        updateFlameUi();
    }

    function formatSpiritBreakdownUi(material) {
        const bd = formatSpiritBreakdown(material);
        if (bd.empty && !furnace.material.inputSpirit) {
            els.spiritBreakdown.innerHTML = '<p class="muted">No spirit in the furnace yet.</p>';
            return;
        }
        const segments = [
            { label: 'Released', value: bd.released, pct: bd.percentages.released, cls: 'seg-released' },
            { label: 'Bound', value: bd.bound, pct: bd.percentages.bound, cls: 'seg-bound' },
            { label: 'Degraded', value: bd.degraded, pct: bd.percentages.degraded, cls: 'seg-degraded' }
        ];
        const bar = segments.map(s =>
            s.pct > 0 ? `<span class="spirit-seg ${s.cls}" style="width:${s.pct}%"></span>` : ''
        ).join('');
        els.spiritBreakdown.innerHTML = `
      <p class="spirit-input">Input spirit <strong>${bd.input}</strong></p>
      <div class="spirit-bar">${bar || '<span class="spirit-seg seg-empty" style="width:100%"></span>'}</div>
      <ul class="spirit-legend">${segments.map(s =>
            `<li><span class="swatch ${s.cls}"></span><strong>${s.label}</strong> ${s.value} (${s.pct}%)</li>`
        ).join('')}</ul>`;
    }

    function renderCondensedResult(result) {
        const summary = summarizeRefinement(result);
        const proc = result.process?.outcome || result.outcome;
        els.summaryOut.innerHTML = `
      <p class="summary-headline">${escapeHtml(summary.headline)}</p>
      <p class="summary-process outcome-${proc}">${escapeHtml(summary.processLine)}</p>
      <ul class="summary-points">
        ${summary.materialLines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}
        ${summary.productLines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}
      </ul>
      <p class="summary-note muted">${escapeHtml(summary.note)}</p>`;

        els.processOut.innerHTML = `
      <p class="outcome-${proc}"><strong>Process:</strong> ${proc}</p>
      <p>Peak instability: ${result.peakInstability} · Grade ${result.product.grade} · Purity ${result.product.purity ?? '—'}%</p>
      <p>Potency ${result.product.potency}, dominant ${result.product.dominantAffinity}, suitability ${result.product.suitability}</p>
      <p><strong>${escapeHtml(result.product.experimentalName || 'Experimental pill')}</strong></p>
      <p class="medicinal-profile">${escapeHtml(formatMedicinalProduct(result.product))}</p>
      <p>Contamination ${result.mixture?.contamination ?? '—'} · Expelled ${result.material?.expelled?.contamination ?? 0}</p>`;

        const m = result.material;
        els.materialOut.innerHTML = m ? `
        <p>Released ${m.released.spirit} · Bound ${m.bound.spirit} · Degraded ${m.degraded.spirit}</p>
        <p>Conservation Δ ${m.conservation?.conservationDelta ?? '—'}</p>` : '';

        const lines = explainExperiment({ ...result, trace: result.trace || [] });
        els.explainOut.innerHTML = `<ul>${lines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`;

        const ledger = formatMaterialLedger(m);
        els.ledgerBody.innerHTML = ledger.rows.map(r =>
            `<tr><td>${escapeHtml(r.label)}</td><td>${r.spirit}</td><td>${escapeHtml(r.note || '')}</td></tr>`
        ).join('');

        if (result.procedure?.chronicle) {
            els.chronicleJson.textContent = formatProcedureChronicle(result.procedure);
        }
    }

    function pumpTicks(n) {
        const count = Math.max(0, Math.round(n));
        for (let i = 0; i < count; i++) {
            if (!furnace.running || furnace.paused || furnace.condensed) return;
            stepFurnace(furnace, SIM_DT);
        }
        renderLive();
    }

    function tickLoop() {
        const speed = parseFloat(els.speedSelect.value) || 1;
        if (furnace._tickAcc == null) furnace._tickAcc = 0;
        furnace._tickAcc += speed;
        const steps = Math.floor(furnace._tickAcc);
        if (steps > 0) {
            furnace._tickAcc -= steps;
            pumpTicks(steps);
        }
        if (!furnace.condensed) {
            animFrame = requestAnimationFrame(tickLoop);
        }
    }

    function ensureLoop() {
        if (animFrame) cancelAnimationFrame(animFrame);
        if (furnace.running && !furnace.paused && !furnace.condensed) {
            animFrame = requestAnimationFrame(tickLoop);
        }
    }

    function doCondense() {
        if (furnace.condensed) return;
        lastResult = condenseFurnace(furnace);
        ensureLoop();
        renderLive();
        renderCondensedResult(lastResult);
        pushHistory(lastResult);
    }

    function buildHistoryInput() {
        return {
            mode: 'furnace',
            seed: furnace.seed,
            duration: Math.round(furnace.time * 10) / 10,
            procedure: {
                ...JSON.parse(JSON.stringify(furnace.procedure)),
                duration: Math.round(furnace.time * 10) / 10,
                chronicle: furnace.chronicle.map(e => ({ ...e })),
                introduced: furnace.introduced.map(r => ({ ...r }))
            },
            reagents: Object.entries(aggregateInFurnace()).map(([reagentId, qty]) => ({ reagentId, qty }))
        };
    }

    function pushHistory(result) {
        historyId += 1;
        const label = `#${historyId} ${formatSimTime(furnace.time)} · ${result.outcome}`;
        history.unshift({
            id: historyId,
            label,
            input: buildHistoryInput(),
            result
        });
        if (history.length > 24) history.pop();
        renderHistory();
    }

    function renderHistory() {
        els.historyList.innerHTML = history.map(h =>
            `<div class="history-item" data-id="${h.id}"><strong>${escapeHtml(h.label)}</strong><br>`
            + `<small>${escapeHtml((h.input.procedure?.chronicle || []).slice(0, 3).map(c => c.timeLabel + ' ' + c.kind).join(' · ') || '—')}</small></div>`
        ).join('') || '<p class="muted">No condensed runs yet.</p>';

        els.historyList.querySelectorAll('.history-item').forEach(el => {
            el.onclick = () => toggleCompare(parseInt(el.dataset.id, 10));
        });
        const opts = history.map(h => `<option value="${h.id}">${escapeHtml(h.label)}</option>`).join('');
        els.compareSelectA.innerHTML = '<option value="">—</option>' + opts;
        els.compareSelectB.innerHTML = '<option value="">—</option>' + opts;
        updateCompare();
    }

    function toggleCompare(id) {
        if (comparePick.a === id) comparePick.a = null;
        else if (comparePick.b === id) comparePick.b = null;
        else if (!comparePick.a) comparePick.a = id;
        else comparePick.b = id;
        renderHistory();
    }

    function updateCompare() {
        const a = history.find(h => h.id === parseInt(els.compareSelectA.value, 10));
        const b = history.find(h => h.id === parseInt(els.compareSelectB.value, 10));
        if (!a || !b) {
            els.compareTable.innerHTML = '';
            els.compareInterpret.innerHTML = '<span class="muted">Pick two runs to compare.</span>';
            return;
        }
        const notes = interpretComparison(a, b);
        els.compareInterpret.innerHTML = `<ul>${notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>`;
        const rows = compareExperiments(a, b);
        els.compareTable.innerHTML = `
      <thead><tr><th>Field</th><th>A</th><th>B</th></tr></thead>
      <tbody>${rows.map(r => `<tr class="${r.different ? 'diff' : ''}"><td>${escapeHtml(r.label)}</td>`
            + `<td>${escapeHtml(String(r.a ?? ''))}</td><td>${escapeHtml(String(r.b ?? ''))}</td></tr>`).join('')}
      </tbody>`;
    }

    function fullReset() {
        if (animFrame) cancelAnimationFrame(animFrame);
        furnace = resetFurnace(furnace);
        furnace._tickAcc = 0;
        lastChronicleLen = 0;
        lastResult = null;
        els.chronicleLive.innerHTML = '';
        els.chronicleJson.textContent = '';
        els.summaryOut.innerHTML = '<p class="muted">Condense to see a plain-language summary.</p>';
        els.processOut.innerHTML = '';
        els.explainOut.innerHTML = '';
        els.materialOut.innerHTML = '';
        els.ledgerBody.innerHTML = '';
        renderLive();
    }

    els.startBtn.onclick = () => {
        startFurnace(furnace);
        ensureLoop();
        renderLive();
    };
    els.pauseBtn.onclick = () => { pauseFurnace(furnace); ensureLoop(); renderLive(); };
    els.resumeBtn.onclick = () => { resumeFurnace(furnace); ensureLoop(); renderLive(); };
    els.condenseBtn.onclick = doCondense;
    els.resetBtn.onclick = () => { if (confirm('Reset furnace and clear live state?')) fullReset(); };

    document.querySelectorAll('.flame-buttons button').forEach(btn => {
        btn.onclick = () => {
            setFurnaceHeat(furnace, btn.dataset.heat);
            renderLive();
        };
    });

    els.addToFurnace.onclick = () => {
        try {
            const id = els.reagentPick.value;
            const qty = parseInt(els.addQty.value, 10);
            introduceToFurnace(furnace, id, qty);
            renderLive();
        } catch (e) {
            alert(e.message);
        }
    };

    els.inspectReagent.onclick = () => renderReagentInfo(els.reagentPick.value);
    els.reagentPick.onchange = () => renderReagentInfo(els.reagentPick.value);
    els.compareSelectA.onchange = els.compareSelectB.onchange = updateCompare;

    initReagentPick();
    renderReagentInfo(els.reagentPick.value);
    renderLive();
})();
