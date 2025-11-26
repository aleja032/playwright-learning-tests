import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_USERS } from '../../utils/test-data';

/**
 * Suite de pruebas de Integración UI + API
 * Validación cruzada entre interfaz y backend
 * Usa TEST_USERS para centralizar credenciales
 */
test.describe('Integration - UI + API Cross Validation', () => {
  test('INT-TC01 - Validar usuario logueado en UI contra API', async ({ page, loginPage, apiHelper }) => {
    await loginPage.goto();
    await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);
    
    await expect(loginPage.loggedInAsText).toBeVisible();
    const uiUsername = await loginPage.getLoggedInUsername();
    
    const apiResponse = await apiHelper.getUserDetailByEmail(TEST_USERS.valid.email);
    const apiBody = await apiResponse.json();
    
    expect(apiResponse.status()).toBe(200);
    expect(apiBody.user.name).toBe(uiUsername);
  });

  test('INT-TC02 - Validar productos en UI existen en API', async ({ page, apiHelper }) => {
    const apiResponse = await apiHelper.getProductsList();
    const apiBody = await apiResponse.json();
    const apiProducts = apiBody.products;
    
    await page.goto('/products');
    await page.waitForSelector('.features_items');
    
    const firstProductUI = await page.locator('.productinfo p').first().textContent();
    
    const productExistsInAPI = apiProducts.some((p: any) => 
      firstProductUI?.includes(p.name) || p.name.includes(firstProductUI || '')
    );
    
    expect(productExistsInAPI).toBeTruthy();
  });

  test('INT-TC03 - Validar precio de producto UI vs API', async ({ page, apiHelper }) => {
    const apiResponse = await apiHelper.getProductsList();
    const apiBody = await apiResponse.json();
    const firstProductAPI = apiBody.products[0];
    
    await page.goto(`/product_details/${firstProductAPI.id}`);
    
    const priceUI = await page.locator('.product-information span span').textContent();
    
    expect(priceUI).toContain(firstProductAPI.price.replace('Rs. ', ''));
  });
});
