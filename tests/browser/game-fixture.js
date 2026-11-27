const { test: base, expect } = require('@playwright/test');

const test = base.extend({
    game: async ({ page, context, baseURL }, use) => {
        const origin = new URL(baseURL).origin;
        const isLocal = url => new URL(url).origin === origin;
        const errors = [];
        const loaded = new Set();

        const watchPage = activePage => {
            activePage.on('pageerror', error => errors.push(error.stack || error.message));
            activePage.on('console', message => {
                if (message.type() === 'error') errors.push(message.text());
            });
            activePage.on('requestfailed', request => {
                if (isLocal(request.url())) {
                    errors.push(`${request.url()}: ${request.failure()?.errorText}`);
                }
            });
            activePage.on('response', response => {
                if (!isLocal(response.url())) return;
                if (response.ok()) loaded.add(response.url());
                else errors.push(`${response.url()}: HTTP ${response.status()}`);
            });
        };
        watchPage(page);
        context.on('page', watchPage);

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
        expect(errors, 'Browser errors or failed local game requests').toEqual([]);
    }
});

module.exports = { test, expect };
