import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_USERS, PAYMENT_DATA, successMessage } from '../../utils/test-data';
import checkoutData from '../../data-driven/checkout-comments.json';

/**
 * Suite de pruebas UI para Checkout
 * Usa fixtures para simplificar setup
 */
test.describe('UI - Checkout Tests', () => {
  test.beforeEach(async ({ authenticatedPage, productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();  
  });

  test('TC12 - Flujo completo de checkout', async ({ page, cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    
    await expect(checkoutPage.deliveryAddress).toBeVisible();
    const addressText = await checkoutPage.getDeliveryAddressText();
    await expect(addressText).toContain(TEST_USERS.billingAddress.street);
    await expect(addressText).toContain(TEST_USERS.billingAddress.country);

    await checkoutPage.addComment(TEST_USERS.billingAddress.commentCheckout);
    await checkoutPage.placeOrder();
    await expect(page).toHaveURL(/.*payment/);
  });

  test('TC13 - Completar pago (sin procesamiento real)', async ({ page, cartPage, checkoutPage, paymentPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.addComment('Test order');
    await checkoutPage.placeOrder();
    
    await paymentPage.fillPaymentDetails(
      PAYMENT_DATA.cardName,
      PAYMENT_DATA.cardNumber,
      PAYMENT_DATA.cvc,
      PAYMENT_DATA.expiryMonth,
      PAYMENT_DATA.expiryYear
    );
    await paymentPage.submitPayment();
    const messageSuccess = await paymentPage.getSuccessMessage();
    expect(messageSuccess?.trim()).toContain(successMessage);

    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    
    expect(currentUrl).toMatch(/payment_done|download/);
  });

  test('TC14 - Validar dirección en checkout', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    
    await expect(checkoutPage.deliveryAddress).toBeVisible();
    await expect(checkoutPage.billingAddress).toBeVisible();
    
    const deliveryText = await checkoutPage.getDeliveryAddressText();
    expect(deliveryText).toBeTruthy();
  });
});

/**
 * Data-Driven: Checkout con diferentes comentarios
 */
test.describe('UI - Checkout Data-Driven Tests', () => {

  for (const testCase of checkoutData) {
    test(`TC-DD-${testCase.testCase}`, async ({ page, authenticatedPage, productsPage, cartPage, checkoutPage }) => {
      await productsPage.goto();
      await productsPage.addProductToCart(0);
      await productsPage.goToCart();
      
      await cartPage.proceedToCheckout();
      await checkoutPage.addComment(testCase.comment);
      await checkoutPage.placeOrder();
      
      await expect(page).toHaveURL(/.*payment/);
    });
  }
});
