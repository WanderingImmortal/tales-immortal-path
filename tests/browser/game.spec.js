const { test, expect } = require('./game-fixture');

async function createCharacter(page, name) {
    await page.goto('/');
    const form = page.locator('#creation-screen');
    await expect(form.getByRole('heading', { name: 'Begin Your Journey' })).toBeVisible();
    expect(await readSave(page)).toBeNull();
    await form.getByLabel('Your Name').fill(name);
    await form.getByRole('button', { name: 'Begin Cultivation' }).click();

    await expect(form).toBeHidden();
    await expect(page.locator('#game-screen')).toBeVisible();
    await expect(page.getByText(`Welcome, ${name}.`, { exact: false })).toBeVisible();
    // The first lesson is opened by the game after creation.
    await page.getByRole('button', { name: 'I Understand' }).click();
}

async function gatherQi(page) {
    await page.getByRole('button', { name: '🧘 Cultivate', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Three Refinements/ })).toBeVisible();
    await page.getByRole('button', { name: /Dantian Chamber/ }).click();
    const entries = page.getByText(/You draw heaven's breath into your dantian/);
    const before = await entries.count();
    await page.getByRole('button', { name: /🌬️ Gather Qi/ }).click();
    await expect(entries).toHaveCount(before + 1);
    await expect(entries.first()).toBeVisible();
}

async function readSave(page) {
    // Read the production save boundary so fractional months and gather count
    // can be checked exactly. All changes to the save come from player actions.
    return page.evaluate(() => {
        const raw = localStorage.getItem('xianxia_save');
        if (!raw) return null;
        const { name, ageMonths, chamberGatherCount = 0 } = JSON.parse(raw);
        return { name, ageMonths, chamberGatherCount };
    });
}

test('boots the production game and creates a playable character', async ({ game }) => {
    const { page, loaded } = game;
    await createCharacter(page, 'Mei Boot');

    const requiredAssets = await page.locator('script[src], link[rel="stylesheet"]').evaluateAll(
        nodes => nodes.map(node => node.src || node.href).filter(url => new URL(url).origin === location.origin)
    );
    expect(requiredAssets.map(url => new URL(url).pathname)).toEqual(
        expect.arrayContaining(['/main.js', '/style.css'])
    );
    expect(requiredAssets.filter(url => !loaded.has(url)), 'Missing local scripts or styles').toEqual([]);
    await expect(page.locator('#realmDisplay')).toHaveText(/Qi Condensation/);
    await expect(page.getByRole('button', { name: '🧘 Cultivate', exact: true })).toBeEnabled();
    expect(await readSave(page)).toMatchObject({ name: 'Mei Boot', chamberGatherCount: 0 });
});

test('gathers Qi once through the Dantian Chamber', async ({ game: { page } }) => {
    await createCharacter(page, 'Mei Gather');
    const before = await readSave(page);
    await gatherQi(page);

    expect(await readSave(page)).toEqual({
        ...before,
        ageMonths: before.ageMonths + 0.25,
        chamberGatherCount: before.chamberGatherCount + 1
    });
});

test('reload restores the new character and the result of one gather', async ({ game: { page } }) => {
    await createCharacter(page, 'Mei Reload');
    const before = await readSave(page);
    await gatherQi(page);
    const after = await readSave(page);
    expect(after).toEqual({
        ...before,
        ageMonths: before.ageMonths + 0.25,
        chamberGatherCount: before.chamberGatherCount + 1
    });

    await page.reload();
    await expect(page.locator('#creation-screen')).toBeHidden();
    await expect(page.locator('#game-screen')).toBeVisible();
    await expect(page.getByText('Welcome back, Mei Reload.', { exact: false })).toBeVisible();
    expect(await readSave(page)).toEqual(after);
});


test('a second tab cannot write and must reload after the owner closes', async ({ game: { page }, context }) => {
    await createCharacter(page, 'Mei Owner');
    await gatherQi(page);
    const saved = await readSave(page);
    const savedBytes = await page.evaluate(() => localStorage.getItem('xianxia_save'));

    const other = await context.newPage();
    await other.goto('/');
    const reload = other.getByRole('button', { name: 'Reload', exact: true });
    await expect(other.getByRole('status')).toContainText('This save is active in another tab');
    await expect(other.locator('#game-screen')).toBeHidden();
    await expect(other.locator('#creation-screen')).toBeHidden();
    expect(await other.evaluate(() => ({
        clockStopped: _worldClockTimer === null,
        saveAccepted: saveState(),
        advanceAccepted: advanceTime(1, 'Blocked tab')
    }))).toEqual({ clockStopped: true, saveAccepted: false, advanceAccepted: false });
    expect(await other.evaluate(() => localStorage.getItem('xianxia_save'))).toBe(savedBytes);

    await reload.click();
    await expect(other.getByRole('status')).toContainText('This save is active in another tab');
    expect(await readSave(other)).toEqual(saved);

    await page.close();
    await expect(other.getByRole('status')).toContainText('This save is active in another tab');
    expect(await other.evaluate(() => saveState())).toBe(false);
    await reload.click();
    await expect(other.getByText('Welcome back, Mei Owner.', { exact: false })).toBeVisible();
    expect(await readSave(other)).toEqual(saved);
    await gatherQi(other);
    expect(await readSave(other)).toEqual({
        ...saved,
        ageMonths: saved.ageMonths + 0.25,
        chamberGatherCount: saved.chamberGatherCount + 1
    });

    expect(await other.evaluate(() => {
        const clockWasRunning = _worldClockTimer !== null;
        window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
        window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
        return { clockWasRunning, clockStopped: _worldClockTimer === null, saveAccepted: saveState() };
    })).toEqual({ clockWasRunning: true, clockStopped: true, saveAccepted: false });
    await expect(other.getByRole('status')).toContainText('Its unsaved progress cannot safely be committed');
});
