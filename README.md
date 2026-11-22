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

## Headless world simulation

Run the production world in Node.js 24 without dependencies, a browser, or
a real save slot.

```sh
npm run --silent simulate:world -- --seed 42 --years 10 --checkpoint 24 --output world-run.json
```

- `--seed` takes an unsigned 32-bit integer and defaults to 42.
- Choose `--months` or `--years` in whole units. The default is 12 months.
  A duration of zero captures the starting snapshot.
- `--checkpoint` sets the interval in positive whole months and defaults to 12.
- JSON goes to stdout unless `--output` names a new file. Use npm's
  `--silent` flag for a JSON-only stream. Existing output files are protected.

The `ordinary-start` scenario loads the local scripts in `index.html` order,
uses the production creation handler with its default choices, and uses the
production load path to initialize the saved character and world in the same
VM. Storage is an in-memory map. The VM grants its single document simulated
ownership and omits DOM-only log and status rendering. Real timers are held
rather than executed, including the opening tutorial. The player makes no
active choices and receives only ordinary passive circulation.

The runner requests one month at a time through quiet
`advanceSharedWorldTime()`. The production scheduler subdivides those spans
around due events and other time boundaries. This includes lifespan, passive
cultivation, supply decay, and shared calendar obligations. Calling
`processWorldTime()` directly would omit the shared player accounting.
`advanceTime()` also checks paid-action rules, and seclusion playback adds
its own year settlement and rewards. Neither mode is exercised here.

The calendar ticks NPC growth, travel, ambient activity, ambitions, situations,
resource sources, procurement, formations, faction deadlines, and sect
systems when their production conditions apply. Redwell stock refreshes
through shared calendar obligations. The default character has no sect, lodge
membership, or player-started faction agenda. Inactive paths include Hall
study, sect missions, faction story choices, combat, encounter-driven ambient
promotion, and holdings the player has yet to acquire. A registered tick can
run without changing state. The runner stops at a mandatory decision or the
end of the player's lifespan. It leaves decisions and reincarnation to the
player.

The VM seeds `Math.random()` and fixes the date used by production ID
generation. For the same build, Node runtime, seed, and options, the report is
reproducible except for `executionMs`. Checkpoints observe state without
changing tick cadence. Smaller or larger world-time requests can change the
order or frequency of production rolls, so outputs apply to this monthly mode.

The JSON report includes `schemaVersion`, `configuration`, `initial`,
`checkpoints`, `final`, `diagnostics`, `status`, `interruption`, and
`executionMs`. Snapshots contain calendar and roster counts, recorded NPC
regions, focus-track realm indexes, activities, organizations, stock, scheduled
work, and a SHA-256 digest of the serialized game state. A `null` metric means
the corresponding state is unavailable. Diagnostics include actual scheduler
dispatch order, reported errors and warnings, and the number of deferred
callbacks. A failed step may end with the last inspected snapshot. Expected
interruptions exit successfully with status `interrupted`. Errors or
invariant violations produce status `error` and a nonzero exit code.

`npm run verify` discovers the short harness tests automatically. For changes
to world ticks, rerun the affected seed and compare event order, checkpoint
metrics, and final hashes. Use longer runs locally to investigate changes
beyond the PR smoke coverage.

## Project layout

- `index.html` — main page
- `main.js`, `core.js`, `data.js` — game logic and content
- `style.css` — styling
- Chamber modules: `chamber.js`, `body-chamber.js`, `soul-chamber.js`, etc.
