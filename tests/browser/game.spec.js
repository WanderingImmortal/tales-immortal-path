const { test: base, expect } = require('@playwright/test');

const test = base.extend({
    game: async ({ page, context, baseURL }, use) => {
        const origin = new URL(baseURL).origin;
        const isLocal = url => new URL(url).origin === origin;
        const errors = [];
        const loaded = new Set();

        page.on('pageerror', error => errors.push(error.stack || error.message));
        page.on('requestfailed', request => {
            if (isLocal(request.url())) {
                errors.push(`${request.url()}: ${request.failure()?.errorText}`);
            }
        });
        page.on('response', response => {
            if (!isLocal(response.url())) return;
            if (response.ok()) loaded.add(response.url());
            else errors.push(`${response.url()}: HTTP ${response.status()}`);
        });

        // Keep the real game offline. Google Fonts is optional presentation.
        await context.route('**/*', route => {
            const url = new URL(route.request().url());
            if (isLocal(url.href)) return route.continue();
            if (url.hostname === 'fonts.googleapis.com') {
                return route.fulfill({ contentType: 'text/css', body: '' });
            }
            return route.abort();
        });

        await use({ page, loaded });
        expect(errors, 'Uncaught page errors or failed local game requests').toEqual([]);
    }
});

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
    await page.getByRole('button', { name: /🌬️ Gather Qi/ }).click();
    await expect(page.getByText(/You draw heaven's breath into your dantian/)).toBeVisible();
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
