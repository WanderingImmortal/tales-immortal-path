# Tales of the Immortal Path

A xianxia text adventure — cultivate, explore, fight, and ascend.

## Play locally

Open the game in a current browser with Web Locks support. For local play, run
`node tests/browser/serve.js` and open `http://127.0.0.1:4175`. This serves the
game without a build or dependency install. Opening `index.html` directly works
only where the browser allows Web Locks and storage for local files. Use the
same origin to reopen a save.

## Single-writer saves

The first tab to acquire the browser's exclusive Web Lock may play. The lock
covers the active save and legacy record together. Other tabs show a reload
screen before loading or starting their game. Reloading while the owner is
active stays blocked. Close or navigate away from the owner, then reload the
blocked tab to load the last successful save. A restored history page that
released ownership also requires reload and warns about unsaved progress.
Browser document teardown releases the lock even if a tab crashes. The game
does not take over an open or suspended owner.

Autosaves, migration catch-up, creation, and ordinary saves go through
`saveState()`. The same ownership gate protects the legacy record, carry
receipt cleanup, reincarnation journal and active-slot removal, and reset.
UI settings, playtest options, and playtest feedback use separate storage keys
and do not participate in the gameplay transaction. A failed write preserves
the prior durable record. Save files need no ownership fields or revision.

Use HTTPS or localhost in a browser with Web Locks. If the API is missing or
denied, the game blocks play and writes. BroadcastChannel and storage events
can notify tabs, but cannot make a read followed by a write atomic. The game
uses the browser-held lock instead of an expiring localStorage lease. The
guarantee applies to cooperating game pages sharing the same origin and
browser storage context. Reload or close tabs running a build from before
this safeguard. Browser profiles, storage partitions, and different origins
have separate saves.

## Verification

With Node.js 24 and npm available, run `npm run verify` from the repository root.
The command needs no dependency installation. GitHub Actions runs it on pull
requests. The Bash and PowerShell pre-PR scripts invoke the same Node runner.

The runner preserves the pre-PR audits and runs each `scripts/test-*.js` suite
once, with two exclusions:

- `test-alchemy-lab.js` rebuilds a tracked prototype bundle and can fetch esbuild.
- `test-property-alchemy-audit.js` spawns `test-property-alchemy.js`, which the
  runner already executes directly.

## Browser smoke tests

With Node.js 24, install the locked dependencies and Chromium once, then run
the browser suite:

```sh
npm ci --ignore-scripts
npx playwright install --only-shell chromium
npm run test:browser
```

On Linux, use `npx playwright install --with-deps --only-shell chromium` if
Chromium's system libraries are missing. If the browser download is unavailable,
set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to the absolute path of an installed Chromium.
CI uses Playwright's pinned browser.

Playwright serves the production game on `127.0.0.1:4175` and closes the server
and browser at the end. Each test starts with fresh browser storage. The suite
runs offline after installation, with optional Google Fonts replaced by local
fallback fonts.

The suite verifies the production page and first character, one Gather Qi action
in the Dantian Chamber, persistence after reload, and two-tab ownership and
recovery. The tests read the browser's `xianxia_save` slot to verify exact elapsed months and gather count.
Player interactions drive all game and save changes. Combat, NPC interactions,
other cultivation paths, save migrations, and mobile layouts are outside this
smoke suite.

Failures write a screenshot and `trace.zip` in the test's `test-results/`
directory. Open the trace locally with `npx playwright show-trace path/to/trace.zip`.
GitHub Actions uploads the same files in the `playwright-failures` artifact.

## Project layout

- `index.html` — main page
- `main.js`, `core.js`, `data.js` — game logic and content
- `style.css` — styling
- Chamber modules: `chamber.js`, `body-chamber.js`, `soul-chamber.js`, etc.
