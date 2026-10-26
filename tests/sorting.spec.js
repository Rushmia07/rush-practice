const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CartPage = require('../playwright/pages/cart');


test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

});


test('TC-33 verify the default sort is Name (A to Z)', async ({ page }) => {
    // No selectOption() needed - 'az' is what the page already shows on login.
    const cartPage=new CartPage(page);
    await expect(cartPage.getProductNames().first()).toHaveText('Sauce Labs Backpack');
});


test('TC-34 verify Name (Z to A) reverses the name order', async ({ page }) => {
     const cartPage=new CartPage(page);
     await cartPage.selectSort('za')
    await expect(cartPage.getProductNames().first())
        .toHaveText('Test.allTheThings() T-Shirt (Red)');
});


test('TC-35 verify Price (low to high) puts the cheapest item first', async ({ page }) => {
    const cartPage=new CartPage(page);
    await cartPage.selectSort("lohi")
    await expect(cartPage.getProductPrices().first()).toHaveText('$7.99');
});


test('TC-36 verify Price (high to low) puts the most expensive item first', async ({ page }) => {
    const cartPage=new CartPage(page);
    await cartPage.selectSort("hilo")
    await expect(cartPage.getProductPrices().first()).toHaveText('$49.99');
});
