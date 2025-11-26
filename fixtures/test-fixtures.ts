import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ApiHelper } from '../utils/api-helper';

/**
 * Fixtures personalizados para reutilización en todos los tests
 * Proporciona instancias pre-configuradas de Page Objects y API Helper
 */
type TestFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  apiHelper: ApiHelper;
  authenticatedPage: LoginPage; // Fixture que ya tiene sesión iniciada
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page);
    await use(paymentPage);
  },

  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  // Fixture que proporciona una página ya autenticada
  authenticatedPage: async ({ page }, use) => {
    // Importar dinámicamente para evitar dependencias circulares
    const { TEST_USERS } = await import('../utils/test-data');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);
    await loginPage.loggedInAsText.waitFor({ state: 'visible' });
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
