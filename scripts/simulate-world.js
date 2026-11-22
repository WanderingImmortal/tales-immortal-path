const { writeFileSync } = require('node:fs');
const { parseArgs } = require('node:util');
const { simulateWorld } = require('./lib/headless-world');

function runCli(args, { stdout, stderr }, simulate = simulateWorld) {
    try {
        const { values } = parseArgs({ args, options: {
            seed: { type: 'string' },
            months: { type: 'string' },
            years: { type: 'string' },
            checkpoint: { type: 'string' },
            output: { type: 'string' },
            help: { type: 'boolean' }
        } });
        if (values.help) {
            stdout.write('Usage: npm run simulate:world -- [--seed N] [--months N | --years N] [--checkpoint N] [--output FILE]\n');
            return 0;
        }
        if (values.months !== undefined && values.years !== undefined) {
            throw new Error('Use either --months or --years.');
        }
        for (const key of ['seed', 'months', 'years', 'checkpoint']) {
            if (values[key] !== undefined && !/^\d+$/.test(values[key])) {
                throw new Error(`--${key} requires a whole nonnegative number.`);
            }
        }
        const result = simulate({
            seed: Number(values.seed ?? 42),
            months: values.years === undefined ? Number(values.months ?? 12) : Number(values.years) * 12,
            checkpoint: Number(values.checkpoint ?? 12)
        });
        const json = JSON.stringify(result, null, 2) + '\n';
        if (values.output !== undefined) writeFileSync(values.output, json, { flag: 'wx' });
        else stdout.write(json);
        return result.status === 'error' ? 1 : 0;
    } catch (error) {
        stderr.write(`World simulation: ${error.message}\n`);
        return 1;
    }
}
if (require.main === module) process.exitCode = runCli(process.argv.slice(2), process);
module.exports = { runCli };
