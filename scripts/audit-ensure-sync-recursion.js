/**
 * Static + lightweight runtime scan for ensure/sync mutual recursion.
 * Run: node scripts/audit-ensure-sync-recursion.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.js'));

function extractFunctions(src) {
    const re = /function\s+(ensure\w+|sync\w+)\s*\([^)]*\)\s*\{/g;
    const idxs = [];
    let m;
    while ((m = re.exec(src))) idxs.push({ name: m[1], start: m.index });
    const out = {};
    for (let i = 0; i < idxs.length; i++) {
        const end = i + 1 < idxs.length ? idxs[i + 1].start : src.length;
        const body = src.slice(idxs[i].start, end);
        const callRe = /\b((?:ensure|sync)\w+)\s*\(/g;
        const calls = new Set();
        let c;
        while ((c = callRe.exec(body))) {
            if (c[1] !== idxs[i].name) calls.add(c[1]);
        }
        out[idxs[i].name] = [...calls];
    }
    return out;
}

const byFn = {};
const fnFile = {};
for (const f of files) {
    const map = extractFunctions(fs.readFileSync(path.join(root, f), 'utf8'));
    for (const [name, calls] of Object.entries(map)) {
        byFn[name] = calls;
        fnFile[name] = f;
    }
}

const issues = [];
for (const [ens, calls] of Object.entries(byFn)) {
    if (!ens.startsWith('ensure')) continue;
    for (const sync of calls.filter(c => c.startsWith('sync'))) {
        if ((byFn[sync] || []).includes(ens)) {
            issues.push(`${fnFile[ens]}: ${ens}() <-> ${sync}() [${fnFile[sync]}]`);
        }
    }
}

// ensure A -> ensure B -> ensure A
for (const [a, calls] of Object.entries(byFn)) {
    if (!a.startsWith('ensure')) continue;
    for (const b of calls.filter(c => c.startsWith('ensure'))) {
        if ((byFn[b] || []).includes(a) && a < b) {
            issues.push(`${fnFile[a]}: ${a}() <-> ${b}() [${fnFile[b]}]`);
        }
    }
}

console.log('=== Static mutual recursion ===');
if (!issues.length) console.log('OK  none found');
else issues.forEach(i => console.log('FAIL', i));

// Runtime: cultivation tracks (character creation path)
console.log('\n=== Runtime: cultivation tracks ===');
const ctx = {
    G: {},
    PATHS: { qi: { realms: ['a', 'b', 'c', 'd', 'e'] }, body: { realms: ['a', 'b', 'c', 'd', 'e'] }, soul: { realms: ['a', 'b', 'c', 'd', 'e'] } },
    clamp: (n, lo, hi) => Math.max(lo, Math.min(hi, n)),
    getMaxCultivationRealmIdx: () => 6,
    console,
    SOUL_EMBRYO_AWAKEN_MESSAGES: {},
    SOUL_EMBRYO_ORIGIN_PERKS: {},
    addLog: () => {}
};
vm.createContext(ctx);
try {
    vm.runInContext(fs.readFileSync(path.join(root, 'cultivation-tracks.js'), 'utf8'), ctx);
    ctx.ensureCultivationTracksState();
    ctx.setFocusTrack('vessel');
    console.log('OK  ensureCultivationTracksState + setFocusTrack', ctx.G.path, ctx.G.realmIdx);
} catch (e) {
    console.log('FAIL', e.message.split('\n')[0]);
    issues.push('runtime cultivation-tracks');
}

console.log(`\n${issues.length ? issues.length + ' issue(s)' : 'All clear'}`);
process.exit(issues.length ? 1 : 0);
