const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');

test('TC-flaky verify URL is inventory.html right after login (intentionally flaky)', async ({ page }) => {
    // Playwright's own click() already waits out normal page navigation
    // internally, so on a fast real site there's no gap left for a fixed
    // wait to race against - it never catches anything bad. To actually
    // SEE the problem, we fake a slow network here: every request gets a
    // random 0-200ms delay tacked on before the browser gets its response.
    await page.route('**/*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 200));
        await route.continue();
    });

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Intentionally flaky: 100ms is a GUESS at how long the (now randomly
    // slow) navigation takes. Sometimes the random delay above was under
    // 100ms and we're already on inventory.html - pass. Sometimes it was
    // over 100ms and we're still mid-navigation - fail. page.url() is a raw
    // synchronous read with no auto-retry, so whichever state we land in is
    // exactly what gets checked, no second chances.
    await page.waitForTimeout(100);
    expect(page.url()).toContain('inventory.html');
});
