/**
 * Dev laboratory UI — uses global AlchemyLab from lab-bundle.js
 */
(function () {
    if (typeof AlchemyLab === 'undefined') {
        document.body.innerHTML = '<p style="color:red;padding:2rem">AlchemyLab bundle missing. Run: node scripts/bundle-alchemy-lab.js</p>';
        return;
    }

    const {
        EXPERIMENTAL_REAGENTS, REAGENT_IDS, simulateRefinement, explainExperiment,
        formatMaterialLedger, compareExperiments, LAB_PRESETS,
        describeReagent, summarizeRefinement, formatSpiritBreakdown, interpretComparison,
        KNOWLEDGE_STATES
    } = AlchemyLab;

    const els = {
        reagentList: document.getElementById('reagentList'),
        addReagent: document.getElementById('addReagent'),
        reagentPick: document.getElementById('reagentPick'),
        inspectReagent: document.getElementById('inspectReagent'),
        reagentInfo: document.getElementById('reagentInfo'),
        introOrder: document.getElementById('introOrder'),
        heatMode: document.getElementById('heatMode'),
        singleHeat: document.getElementById('singleHeat'),
        singleHeatRow: document.getElementById('singleHeatRow'),
        stageList: document.getElementById('stageList'),
        addStage: document.getElementById('addStage'),
        runBtn: document.getElementById('runBtn'),
        resetBtn: document.getElementById('resetBtn'),
        repeatBtn: document.getElementById('repeatBtn'),
        presetSelect: document.getElementById('presetSelect'),
        loadPreset: document.getElementById('loadPreset'),
        summaryOut: document.getElementById('summaryOut'),
        processOut: document.getElementById('processOut'),
        spiritBreakdown: document.getElementById('spiritBreakdown'),
        materialOut: document.getElementById('materialOut'),
        explainOut: document.getElementById('explainOut'),
        ledgerBody: document.getElementById('ledgerBody'),
        traceJson: document.getElementById('traceJson'),
        historyList: document.getElementById('historyList'),
        compareSelectA: document.getElementById('compareSelectA'),
        compareSelectB: document.getElementById('compareSelectB'),
        compareInterpret: document.getElementById('compareInterpret'),
        compareTable: document.getElementById('compareTable')
    };

    let heatStages = [];
    let lastInput = null;
    /** @type {{ id: number, label: string, input: object, result: object }[]} */
    let history = [];
    let historyId = 0;
    let comparePick = { a: null, b: null };

    function initReagentPick() {
        els.reagentPick.innerHTML = REAGENT_IDS.map(id => {
            const d = EXPERIMENTAL_REAGENTS[id];
            return `<option value="${id}">${d.name} (${id})</option>`;
        }).join('');
    }

    function readReagents() {
        const rows = els.reagentList.querySelectorAll('.ingredient-row');
        const reagents = [];
        rows.forEach(row => {
            const id = row.querySelector('.reagent-id').value;
            const qty = parseInt(row.querySelector('.reagent-qty').value, 10);
            if (id && qty > 0) reagents.push({ reagentId: id, qty });
        });
        return reagents;
    }

    function renderReagentInfo(reagentId) {
        const info = describeReagent(reagentId);
        if (!info.properties.length) {
            els.reagentInfo.innerHTML = `<p class="muted">${escapeHtml(info.note || 'No data.')}</p>`;
            return;
        }
        const knowledgeMeta = (KNOWLEDGE_STATES && KNOWLEDGE_STATES.established) || {
            label: 'Established',
            hint: 'Full definition access in the development laboratory.'
        };
        els.reagentInfo.innerHTML = `
      <div class="reagent-info-head">
        <strong>${escapeHtml(info.name)}</strong>
        <span class="knowledge-pill knowledge-established" title="${escapeHtml(knowledgeMeta.hint)}">${escapeHtml(knowledgeMeta.label)} (dev lab)</span>
      </div>
      <p class="reagent-note">${escapeHtml(info.note || '')}</p>
      <p class="knowledge-scaffold muted">Future live play may show Unknown / Reported / Observed / Established per property. This lab exposes established values for testing.</p>
      <dl class="prop-list">
        ${info.properties.map(p => `
          <div class="prop-row" data-knowledge="${escapeHtml(p.knowledgeState)}">
            <dt>
              ${escapeHtml(p.label)}
              <span class="knowledge-tag">${escapeHtml((KNOWLEDGE_STATES?.[p.knowledgeState] || {}).label || p.knowledgeState)}</span>
            </dt>
            <dd>
              <span class="prop-value">${escapeHtml(p.display)}</span>
              <span class="prop-detail">${escapeHtml(p.detail)}</span>
            </dd>
          </div>`).join('')}
      </dl>`;
    }

    function addReagentRow(reagentId = 'exp_dawn_dew', qty = 1) {
        const div = document.createElement('div');
        div.className = 'ingredient-row';
        div.innerHTML = `
      <select class="reagent-id">${REAGENT_IDS.map(id =>
        `<option value="${id}" ${id === reagentId ? 'selected' : ''}>${EXPERIMENTAL_REAGENTS[id].name}</option>`
    ).join('')}</select>
      <input class="reagent-qty" type="number" min="1" max="99" value="${qty}" />
      <button type="button" class="remove-reagent" title="Remove">×</button>`;
        const select = div.querySelector('.reagent-id');
        select.onchange = () => renderReagentInfo(select.value);
        div.querySelector('.remove-reagent').onclick = () => div.remove();
        els.reagentList.appendChild(div);
        renderReagentInfo(reagentId);
    }

    function renderStages() {
        els.stageList.innerHTML = heatStages.map((h, i) =>
            `<span class="chip">${i + 1}. ${h} <button type="button" data-i="${i}">×</button></span>`
        ).join('');
        els.stageList.querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                heatStages.splice(parseInt(btn.dataset.i, 10), 1);
                renderStages();
            };
        });
    }

    function buildInput() {
        const reagents = readReagents();
        if (!reagents.length) throw new Error('Add at least one reagent.');
        const introductionOrder = els.introOrder.value;
        const input = { reagents, introductionOrder, seed: 0, trace: true };
        if (els.heatMode.value === 'stages') {
            if (!heatStages.length) throw new Error('Add at least one heat stage.');
            input.heatStages = [...heatStages];
            input.heat = heatStages[heatStages.length - 1];
        } else {
            input.heat = els.singleHeat.value;
        }
        return input;
    }

    function runExperiment(input) {
        const plain = { ...input, trace: false };
        const traced = simulateRefinement(input);
        const check = simulateRefinement(plain);
        if (JSON.stringify(AlchemyLab.stripTraceFromResult(traced)) !== JSON.stringify(check)) {
            console.warn('Trace parity mismatch');
        }
        return traced;
    }

    function renderSpiritBreakdown(material) {
        const bd = formatSpiritBreakdown(material);
        if (bd.empty) {
            els.spiritBreakdown.innerHTML = '<p class="muted">No spirit registered for this run.</p>';
            return;
        }
        const segments = [
            { key: 'released', label: 'Released', value: bd.released, pct: bd.percentages.released, cls: 'seg-released' },
            { key: 'bound', label: 'Bound', value: bd.bound, pct: bd.percentages.bound, cls: 'seg-bound' },
            { key: 'degraded', label: 'Degraded', value: bd.degraded, pct: bd.percentages.degraded, cls: 'seg-degraded' }
        ];
        const bar = segments.map(s =>
            s.pct > 0
                ? `<span class="spirit-seg ${s.cls}" style="width:${s.pct}%" title="${s.label}: ${s.value}"></span>`
                : ''
        ).join('');
        els.spiritBreakdown.innerHTML = `
      <p class="spirit-input">Input spirit <strong>${bd.input}</strong></p>
      <div class="spirit-bar" role="img" aria-label="Spirit distribution bar">${bar || '<span class="spirit-seg seg-empty" style="width:100%"></span>'}</div>
      <ul class="spirit-legend">
        ${segments.map(s =>
            `<li><span class="swatch ${s.cls}"></span><strong>${s.label}</strong> ${s.value} <span class="muted">(${s.pct}%)</span></li>`
        ).join('')}
      </ul>`;
    }

    function renderResult(input, result) {
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
      <p class="outcome-${proc}"><strong>Process:</strong> ${proc} · success flag ${result.process?.success ? 'yes' : 'no'}</p>
      <p>Peak instability: ${result.peakInstability} · Stability margin: ${result.stabilityMargin}</p>
      <p>Product: potency ${result.product.potency}, dominant ${result.product.dominantAffinity}, `
      + `suitability <em>${result.product.suitability}</em>, grade ${result.product.grade}</p>`;

        renderSpiritBreakdown(result.material);

        const m = result.material;
        if (m) {
            els.materialOut.innerHTML = `
        <p><strong>Released</strong> spirit ${m.released.spirit} · qi ${m.released.affinities.qi} · heat ${m.released.affinities.heat}</p>
        <p><strong>Bound</strong> spirit ${m.bound.spirit} · <strong>Degraded</strong> spirit ${m.degraded.spirit}</p>
        <p><strong>Residual</strong> spirit ${m.residual.spirit} · conservation Δ ${m.conservation?.conservationDelta ?? 'n/a'}</p>`;
        }

        const lines = explainExperiment(result);
        els.explainOut.innerHTML = `<ul>${lines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`;

        const ledger = formatMaterialLedger(m);
        els.ledgerBody.innerHTML = ledger.rows.map(r =>
            `<tr><td>${escapeHtml(r.label)}</td><td>${r.spirit}</td><td>${escapeHtml(r.note || '')}</td></tr>`
        ).join('');

        els.traceJson.textContent = JSON.stringify(result.trace || [], null, 2);
    }

    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function pushHistory(input, result) {
        historyId += 1;
        const label = `#${historyId} ${input.heatStages?.join('→') || input.heat} · ${result.process?.outcome || result.outcome}`;
        history.unshift({ id: historyId, label, input: stripInput(input), result });
        if (history.length > 24) history.pop();
        renderHistory();
    }

    function stripInput(input) {
        return {
            reagents: input.reagents.map(r => ({ ...r })),
            heat: input.heat,
            heatStages: input.heatStages ? [...input.heatStages] : null,
            introductionOrder: input.introductionOrder,
            seed: input.seed ?? 0
        };
    }

    function renderHistory() {
        els.historyList.innerHTML = history.map(h =>
            `<div class="history-item" data-id="${h.id}"><strong>${escapeHtml(h.label)}</strong><br>`
            + `<small>${h.input.reagents.map(r => r.qty + '×' + r.reagentId).join(', ')}</small></div>`
        ).join('') || '<p class="muted">No runs yet.</p>';

        els.historyList.querySelectorAll('.history-item').forEach(el => {
            el.onclick = () => toggleCompareSelect(parseInt(el.dataset.id, 10));
        });

        const opts = history.map(h => `<option value="${h.id}">${escapeHtml(h.label)}</option>`).join('');
        els.compareSelectA.innerHTML = '<option value="">—</option>' + opts;
        els.compareSelectB.innerHTML = '<option value="">—</option>' + opts;
        if (comparePick.a) els.compareSelectA.value = String(comparePick.a);
        if (comparePick.b) els.compareSelectB.value = String(comparePick.b);
        updateCompareTable();
    }

    function toggleCompareSelect(id) {
        if (comparePick.a === id) comparePick.a = null;
        else if (comparePick.b === id) comparePick.b = null;
        else if (!comparePick.a) comparePick.a = id;
        else comparePick.b = id;
        renderHistory();
    }

    function updateCompareTable() {
        const a = history.find(h => h.id === parseInt(els.compareSelectA.value, 10));
        const b = history.find(h => h.id === parseInt(els.compareSelectB.value, 10));
        if (!a || !b) {
            els.compareTable.innerHTML = '';
            els.compareInterpret.innerHTML = '<span class="muted">Pick two history entries to interpret differences.</span>';
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

    function applyInput(input) {
        els.reagentList.innerHTML = '';
        input.reagents.forEach(r => addReagentRow(r.reagentId, r.qty));
        els.introOrder.value = input.introductionOrder || 'simultaneous';
        if (input.heatStages?.length) {
            els.heatMode.value = 'stages';
            heatStages = [...input.heatStages];
            els.singleHeatRow.style.display = 'none';
        } else {
            els.heatMode.value = 'single';
            els.singleHeat.value = input.heat || 'medium';
            heatStages = [];
            els.singleHeatRow.style.display = '';
        }
        renderStages();
        syncHeatModeUi();
    }

    function syncHeatModeUi() {
        const stages = els.heatMode.value === 'stages';
        els.singleHeatRow.style.display = stages ? 'none' : '';
        document.getElementById('stagesPanel').style.display = stages ? '' : 'none';
    }

    function loadPreset(key) {
        const p = LAB_PRESETS[key];
        if (!p) return;
        applyInput(p.input);
    }

    els.addReagent.onclick = () => addReagentRow(els.reagentPick.value, 1);
    els.inspectReagent.onclick = () => renderReagentInfo(els.reagentPick.value);
    els.reagentPick.onchange = () => renderReagentInfo(els.reagentPick.value);
    els.heatMode.onchange = syncHeatModeUi;
    els.addStage.onclick = () => {
        const h = document.getElementById('stagePick').value;
        heatStages.push(h);
        renderStages();
    };
    els.runBtn.onclick = () => {
        try {
            const input = buildInput();
            lastInput = stripInput(input);
            input.trace = true;
            const result = runExperiment(input);
            renderResult(input, result);
            pushHistory(input, result);
        } catch (e) {
            alert(e.message);
        }
    };
    els.resetBtn.onclick = () => {
        els.reagentList.innerHTML = '';
        addReagentRow();
        heatStages = [];
        renderStages();
        lastInput = null;
    };
    els.repeatBtn.onclick = () => {
        if (!lastInput) return alert('No previous run.');
        const input = { ...lastInput, trace: true };
        applyInput(lastInput);
        const result = runExperiment(input);
        renderResult(input, result);
        pushHistory(input, result);
    };
    els.loadPreset.onclick = () => loadPreset(els.presetSelect.value);
    els.compareSelectA.onchange = els.compareSelectB.onchange = updateCompareTable;

    els.presetSelect.innerHTML = Object.entries(LAB_PRESETS).map(([k, p]) =>
        `<option value="${k}">${escapeHtml(p.name)}</option>`
    ).join('');

    initReagentPick();
    addReagentRow();
    syncHeatModeUi();
})();
