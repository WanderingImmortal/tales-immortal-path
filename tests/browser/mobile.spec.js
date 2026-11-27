const { test, expect } = require('./game-fixture');

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

async function createCharacter(page, { phone = true } = {}) {
    await page.goto(phone ? '/?phone=1' : '/');
    await page.locator('#nameInput').fill('Mei Mobile');
    await page.getByRole('button', { name: 'Begin Cultivation' }).tap();
    await page.locator('#tutorialSkipVeteran').tap();
    await expect(page.locator('#phonePlaytestChrome')).toBeVisible({ visible: phone });
    await page.evaluate(() => window.scrollTo(0, 0));
}

async function openPhoneAction(page, group, button) {
    await page.locator(`[data-phone-sheet="${group}"]`).tap();
    await page.locator(button).tap();
    await expect(page.locator('#phoneGroupSheet')).toBeHidden();
}

async function tapInViewport(page, locator) {
    // A locator tap can scroll away an obstruction. Check the current hit region.
    await expect(locator).toBeInViewport({ ratio: 0.95 });
    const box = await locator.boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
}

async function readProgress(page) {
    return page.evaluate(() => {
        const { ageMonths, chamberGatherCount = 0, stones, sect } = JSON.parse(localStorage.getItem('xianxia_save'));
        return { ageMonths, chamberGatherCount, stones, sectName: sect?.name };
    });
}

test('active seclusion keeps Pause and Emerge available through dismissal attempts', async ({ game: { page } }) => {
    await createCharacter(page);
    const before = await readProgress(page);
    await openPhoneAction(page, 'cultivation', '#btnLongSeclusion');
    const back = page.getByRole('button', { name: 'Back', exact: true });
    await expect(back).toBeVisible();
    const backBox = await back.boundingBox();
    const clockStart = new Date('2026-01-01T00:00:00Z');
    await page.clock.install({ time: clockStart });
    await page.clock.pauseAt(new Date(clockStart.getTime() + 1000));
    await page.locator('[data-seclusion-years="10"]').tap();
    const overlay = page.locator('#timePlaybackOverlay');

    await page.touchscreen.tap(backBox.x + backBox.width / 2, backBox.y + backBox.height / 2);
    await expect(overlay).toBeVisible();
    await expect(back).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(overlay).toBeVisible();
    expect(await page.evaluate(() => closeTopEscapeOverlay())).toBe(false);
    await page.evaluate(() => hideTimePlaybackOverlay());
    await expect(overlay).toBeVisible();

    await page.clock.runFor(520);
    await expect(page.locator('#playbackProgress')).toContainText(/^1 \/ 10 years/);
    await page.locator('#playbackPause').tap();
    await expect(page.locator('#playbackPause')).toHaveText('Resume');
    const pausedAge = await page.evaluate(() => G.ageMonths);
    expect(pausedAge).toBe(before.ageMonths + 12);
    await page.keyboard.press('Escape');
    await page.clock.runFor(1040);
    expect(await page.evaluate(() => G.ageMonths)).toBe(pausedAge);
    await expect(overlay).toBeVisible();

    await page.locator('#playbackPause').tap();
    await page.clock.runFor(520);
    await expect(page.locator('#playbackProgress')).toContainText(/^2 \/ 10 years/);
    await page.locator('#playbackStop').tap();
    await expect(overlay).toBeHidden();
    await expect(page.locator('#highlightReelSub')).toContainText('You emerged early.');
    await page.locator('#highlightReelClose').tap();
    await expect(page.locator('.log-seclusion-done')).toHaveCount(1);
    expect((await readProgress(page)).ageMonths).toBe(pausedAge + 12);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xianxia_save'))
        .questJournal.filter(entry => entry.kind === 'seclusion'))).toMatchObject([
        { title: expect.stringMatching(/^Early emergence/), status: 'complete', months: pausedAge + 12 }
    ]);
    expect(await page.evaluate(() => isTimePlaybackActive())).toBe(false);
});

for (const phone of [true, false]) {
    test(`Three Refinements scrolls and opens Dantian at 320 px in ${phone ? 'phone mode' : 'the default layout'}`, async ({ game: { page } }) => {
        await page.setViewportSize({ width: 320, height: 568 });
        await createCharacter(page, { phone });
        const cultivate = page.locator(phone ? '#phoneCultivateCta' : '#btnCultivate');
        await cultivate.tap();
        const shell = page.locator('.cultivation-hub-shell');
        await expect(shell.getByRole('heading', { name: /Three Refinements/ })).toBeInViewport({ ratio: 1 });
        const description = await page.locator('#cultivationHubSoul .cultivation-hub-desc').boundingBox();
        const card = await page.locator('#cultivationHubSoul').boundingBox();
        expect(description.width).toBeGreaterThan(card.width / 2);

        const pageScroll = await page.evaluate(() => window.scrollY);
        const cancel = page.locator('#cultivationHubClose');
        await cancel.scrollIntoViewIfNeeded();
        expect(await shell.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
        expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
        await tapInViewport(page, cancel);
        await expect(shell).toBeHidden();

        await cultivate.tap();
        await tapInViewport(page, page.locator('#cultivationHubQi'));
        await expect(page.locator('#qiChamberOverlay')).toBeVisible();
        const before = await readProgress(page);
        await page.locator('#chamberGatherQi').tap();
        expect(await readProgress(page)).toMatchObject({
            ageMonths: before.ageMonths + 0.25,
            chamberGatherCount: before.chamberGatherCount + 1
        });
    });
}

async function tapMapTab(page, name, panel) {
    const tab = page.getByRole('tab', { name });
    await tapInViewport(page, tab);
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(panel)).toBeVisible();
}

test('map tabs accept direct taps while map content exceeds the portrait viewport', async ({ game: { page } }) => {
    await createCharacter(page);
    await openPhoneAction(page, 'world', '#btnMap');
    await expect(page.locator('.map-tabs').getByRole('tab', { name: /World/ })).toHaveAttribute('aria-selected', 'true');
    await tapMapTab(page, /Region/, '#mapContinentPanel');
    await tapMapTab(page, /Local/, '#mapLocalPanel');
    await tapMapTab(page, /World/, '#mapWorldPanel');
});

test('founding a sect and reopening a closed map show usable Sect grounds', async ({ game: { page } }) => {
    await createCharacter(page);
    // Set up the founding prerequisites through the game's QA controls.
    const more = page.getByRole('button', { name: 'More', exact: true });
    await more.tap();
    await page.locator('#playtestToggle').tap();
    await page.locator('#playtestDevToggle').tap();
    await page.locator('[data-playtest-opt="freeActionGates"]').tap();
    await page.locator('#playtestGrantRealm').tap();
    await expect(page.locator('#phoneGroupSheet')).toBeHidden();
    await openPhoneAction(page, 'more', '#playtestGrantRealm');
    await openPhoneAction(page, 'more', '#playtestGrant500');
    await openPhoneAction(page, 'sect', '#btnSect');

    await page.locator('#sectFoundNameInput').fill('Cloud Gate Sect');
    const before = await readProgress(page);
    const requirements = await page.evaluate(() => ({ stones: SECT_FOUNDING.stones, months: SECT_FOUNDING.months }));
    await page.locator('#btnFoundSect').tap();
    const grounds = page.locator('#mapSectInfo');
    const courtyard = grounds.locator('button[data-sect-view="courtyard"]');
    await expect(page.locator('#mapTabSect')).toHaveAttribute('aria-selected', 'true');
    await expect(courtyard).toBeVisible();
    expect(await readProgress(page)).toMatchObject({
        sectName: 'Cloud Gate Sect',
        ageMonths: before.ageMonths + requirements.months,
        stones: before.stones - requirements.stones
    });

    await page.locator('#mapClose').tap();
    await page.reload();
    await openPhoneAction(page, 'sect', '#btnSect');
    await expect(page.locator('#mapTabSect')).toHaveAttribute('aria-selected', 'true');
    await expect(courtyard).toBeVisible();

    await tapMapTab(page, /World/, '#mapWorldPanel');
    await tapMapTab(page, /Sect/, '#mapSectPanel');
    await courtyard.tap();
    await expect(grounds).toContainText('The heart of Cloud Gate Sect');
});

test('Cultivate is touch-operable at first paint in short landscape with either log height', async ({ game: { page } }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await createCharacter(page);
    const cultivate = page.locator('#phoneCultivateCta');
    await tapInViewport(page, cultivate);
    await expect(page.locator('#cultivationHubOverlay')).toBeVisible();
    await page.getByRole('button', { name: 'Back', exact: true }).tap();
    await expect(page.locator('#cultivationHubOverlay')).toBeHidden();

    await tapInViewport(page, page.getByRole('button', { name: 'World', exact: true }));
    await expect(page.locator('#phoneGroupSheet')).toBeVisible();
    await page.locator('#phoneGroupSheetClose').tap();
    await tapInViewport(page, page.locator('#btnLogExpand'));
    await expect(page.locator('#logPanel')).toHaveClass(/expanded/);
    await page.evaluate(() => window.scrollTo(0, 0));
    await tapInViewport(page, cultivate);
    await expect(page.locator('#cultivationHubOverlay')).toBeVisible();
    await page.locator('#cultivationHubQi').tap();
    await expect(page.locator('#qiChamberOverlay')).toBeVisible();
});
