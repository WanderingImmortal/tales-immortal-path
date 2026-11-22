const { defineConfig } = require('@playwright/test');

const origin = 'http://127.0.0.1:4175';

module.exports = defineConfig({
    testDir: './tests/browser',
    reporter: 'list',
    use: {
        browserName: 'chromium',
        launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
        baseURL: origin,
        viewport: { width: 1440, height: 1000 },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    },
    webServer: {
        command: 'node tests/browser/serve.js',
        url: origin
    }
});
