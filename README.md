# Tales of the Immortal Path

A xianxia text adventure — cultivate, explore, fight, and ascend.

## Play locally

Open `index.html` in a web browser (Chrome, Firefox, or Edge). No build step required.

## Verification

With Node.js 24 and npm available, run `npm run verify` from the repository root.
The command needs no dependency installation. GitHub Actions runs it on pull
requests. The Bash and PowerShell pre-PR scripts invoke the same Node runner.

The runner preserves the pre-PR audits and runs each `scripts/test-*.js` suite
once, with two exclusions:

- `test-alchemy-lab.js` rebuilds a tracked prototype bundle and can fetch esbuild.
- `test-property-alchemy-audit.js` spawns `test-property-alchemy.js`, which the
  runner already executes directly.

## Project layout

- `index.html` — main page
- `main.js`, `core.js`, `data.js` — game logic and content
- `style.css` — styling
- Chamber modules: `chamber.js`, `body-chamber.js`, `soul-chamber.js`, etc.
