const { spawnSync } = require('node:child_process');
const { readdirSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const audits = [
    'audit-ensure-sync-recursion.js',
    'audit-storage-recursion.js',
    'audit-time-billing.js',
    'audit-world-sim.js',
    'audit-cultivation-progression.js',
    'audit-qi-density-recovery.js',
    'audit-qi-purity-foundation.js',
    'audit-qi-purity-technique.js',
    'audit-body-overlay-fit.js'
];

const excludedTests = new Set([
    // Rebuilds a tracked prototype bundle and can fetch esbuild.
    'test-alchemy-lab.js',
    // Spawns test-property-alchemy.js, which verification already runs directly.
    'test-property-alchemy-audit.js'
]);

const tests = readdirSync(__dirname)
    .filter(file => /^test-.*\.js$/.test(file) && !excludedTests.has(file))
    .sort();
const checks = [...audits, ...tests];

for (const [index, file] of checks.entries()) {
    const script = `scripts/${file}`;
    console.log(`\n[${index + 1}/${checks.length}] ${script}`);
    const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit' });

    if (result.status !== 0) {
        const reason = result.error?.message
            ?? (result.signal ? `signal ${result.signal}` : `exit code ${result.status}`);
        console.error(`Verification failed: ${script} (${reason})`);
        process.exitCode = result.status || 1;
        break;
    }
}

if (!process.exitCode) {
    console.log(`\nVerification passed: ${checks.length} scripts (${audits.length} audits, ${tests.length} test suites).`);
}
