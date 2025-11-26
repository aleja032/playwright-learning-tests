import { test, expect } from '../../fixtures/test-fixtures';
import { PAYMENT_DATA } from '../../utils/test-data';
import * as path from 'path';
import * as fs from 'fs';

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
    expect(addressText.length).toBeGreaterThan(0);
    
    const comment = 'Por favor, entregar en la mañana';
    await checkoutPage.addComment(comment);
    
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
  const dataPath = path.join(__dirname, '../../data-driven/checkout-comments.json');
  const commentsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  for (const testCase of commentsData) {
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
