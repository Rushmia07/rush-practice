const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CheckoutPage = require('../playwright/pages/checkout');
const CartPage = require('../playwright/pages/cart');

// ============================================================
//  DAY 15 — Other users & full regression
//  Scenarios: TC-57 to TC-60 (see plan / chat for the list)
// ============================================================

test('TC-57 verify problem_user logs in and lands on the inventory page', async ({ page }) => {

   await page.goto("https://www.saucedemo.com/");
   const loginPage=new LoginPage(page);
   await loginPage.problemUserValidLogin();
   await expect(page).toHaveURL(/inventory.html/);




});

test('TC-58 verify performance_glitch_user logs in successfully', async ({ page }) => {

await page.goto("https://www.saucedemo.com/");
const loginPage=new LoginPage(page);
await loginPage.PerformanceUserValidloginToApplication();
await expect(page).toHaveURL(/inventory.html/);



});

test('TC-59 verify problem_user sees identical image sources on all products', async ({ page }) => {
  
    // await page.goto('https://www.saucedemo.com/');

    // const loginPage = new LoginPage(page);
    // await loginPage.problemUserValidloginToApplication();

    // await expect(page).toHaveURL(/inventory.html/);

    // await expect(page.locator('img.inventory_item_img')).toHaveCount(6);
    // const images=await page.locator('img.inventory_item_img').all();
    // const firstSrc=await images[0].getAttribute('src');
    // for(const image of images){
    //     await expect(image).toHaveAttribute('src',firstSrc);
    // }

    await page.goto('https://www.saucedemo.com/');
    const loginpage=new LoginPage(page);
    await loginpage.problemUserValidLogin();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('img.inventory_item_img')).toHaveCount(6);
    

});

test('TC-60 verify the full journey: login, add 2 items, checkout, and finish', async ({ page }) => {





    await page.goto('https://www.saucedemo.com/');
    const loginPage=new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage=new CartPage(page);
    await cartPage.addToCart('sauce-labs-bike-light');
    await cartPage.addToCart('sauce-labs-bolt-t-shirt');
    await expect(cartPage.getCartBadge()).toHaveText('2');
    await cartPage.openCart();
    await cartPage.getCheckout().click();
    const checkoutPage=new CheckoutPage(page);
    await checkoutPage.allinput();
    await expect(page).toHaveURL(/checkout-step-two.html/)
    await checkoutPage.finish()
    await expect(page).toHaveURL(/checkout-complete.html/)
    await expect(page.locator('.complete-header')).toHaveText("Thank you for your order!")


});


test('TC-61 verify error_user cannot remove an item from the cart', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');
  const loginPage=new LoginPage(page);
  await loginPage.errorUserValidloginToApplication();
  const cartPage=new CartPage(page);
  await cartPage.addToCart('sauce-labs-backpack')
  await expect(cartPage.getCartBadge()).toHaveText('1');
  await cartPage.removeFromCart('sauce-labs-backpack')
  await expect(cartPage.getCartBadge()).toHaveText('1')
});

test('TC-62 verify visual_user logs in and lands on the inventory page', async ({ page }) => {

await page.goto('https://www.saucedemo.com/');
const loginpage=new LoginPage(page);
await loginpage.visualUserValidloginToApplication();
await expect(page).toHaveURL(/inventory.html/)


});



test('TC-63 verify the full journey for buying exactly 1 item', async ({ page }) => {
   
    await page.goto('https://www.saucedemo.com/');
    const loginPage=new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage=new CartPage(page);
    await cartPage.addToCart('sauce-labs-bike-light');
    await expect(cartPage.getCartBadge()).toHaveText('1');
    await cartPage.openCart();
    await cartPage.getCheckout().click();
    const checkoutPage=new CheckoutPage(page);
    await checkoutPage.allinput();
    await expect(page).toHaveURL(/checkout-step-two.html/)
    await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $9.99')
    await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $0.80')
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $10.79')
    await checkoutPage.finish()
    await expect(page).toHaveURL(/checkout-complete.html/)
    await expect(page.locator('.complete-header')).toHaveText("Thank you for your order!")
});

test('TC-64 verify the full journey for buying all 6 items', async ({ page }) => {
   
    await page.goto('https://www.saucedemo.com/');
    const loginPage=new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage=new CartPage(page);
    const addButtons = cartPage.getAddToCartButtons();
    await expect(addButtons).toHaveCount(6);
    while (await addButtons.count() > 0) {
        await addButtons.first().click();
    }
    await expect(cartPage.getCartBadge()).toHaveText('6');

    await cartPage.openCart();
    await cartPage.getCheckout().click();
    const checkoutPage=new CheckoutPage(page);
    await checkoutPage.allinput();
    await expect(page).toHaveURL(/checkout-step-two.html/)
    await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $129.94')
    await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $10.40')
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $140.34')
    await checkoutPage.finish()
    await expect(page).toHaveURL(/checkout-complete.html/)
    await expect(page.locator('.complete-header')).toHaveText("Thank you for your order!")
});

test('TC-65 verify a journey that removes an item before completing checkout', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage=new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage=new CartPage(page);
    await cartPage.addToCart('sauce-labs-backpack');
    await cartPage.addToCart('sauce-labs-bike-light')
    await cartPage.removeFromCart('sauce-labs-bike-light')
    await cartPage.openCart();
    await cartPage.getCheckout().click();
    const checkoutPage=new CheckoutPage(page);
    await checkoutPage.allinput();
    await expect(page).toHaveURL(/checkout-step-two.html/)
    await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $29.99')
    await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $2.40')
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $32.39')
    await checkoutPage.finish()
    await expect(page).toHaveURL(/checkout-complete.html/)
    await expect(page.locator('.complete-header')).toHaveText("Thank you for your order!")
});



    // Hint: click remove on the cart page (cartpage.spec.js has this
    //       selector), confirm the badge/cart reflect 1 item, then proceed.


test('TC-66 verify performance_glitch_user can complete a full purchase', async ({ page }) => {
    // TC-58 only checked that this user can LOG IN. This extends it into a
    // full buy journey - confirms the slow-but-working user isn't ALSO
    // broken somewhere further down the flow.



    // Hint: loginPage.PerformanceUserValidloginToApplication(), then the same
    //       add -> checkout -> finish steps as TC-60.
});

test('TC-67 verify the site returns to a clean state after a completed purchase', async ({ page }) => {
    // Finish a purchase, click Back Home, and confirm you're not just back
    // on the products page - the cart badge should be gone AND the cart
    // itself should be empty if you open it, closing the loop back to start.



    // Hint: after toHaveURL(/inventory.html/), check .shopping_cart_badge
    //       has toHaveCount(0), then click the cart icon and check
    //       .cart_item also has toHaveCount(0).
});
