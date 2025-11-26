import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_USERS } from '../../utils/test-data';
import invalidData from '../../data-driven/login-invalid-data.json';

/**
 * Suite de pruebas UI para Login
 * Implementa data-driven testing con fixtures reutilizables
 * Usa TEST_USERS de utils/test-data.ts para centralizar credenciales
 */
test.describe('UI - Login Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC01 - Login exitoso con credenciales válidas @smoke', async ({ loginPage }) => {
    await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);
    await expect(loginPage.loggedInAsText).toBeVisible();
    const username = await loginPage.getLoggedInUsername();
    expect(username).toBe(TEST_USERS.valid.name);
  });

  test('TC02 - Verificar mensaje de error aparece correctamente', async ({ loginPage }) => {
    await loginPage.login(TEST_USERS.invalid.email, TEST_USERS.invalid.password);
    await expect(loginPage.errorMsg).toBeVisible();
    const errorText = await loginPage.getErrorText();
    expect(errorText.length).toBeGreaterThan(10); 
  });

  test('TC03 - Logout exitoso', async ({ page, loginPage }) => {
    await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);
    await expect(loginPage.loggedInAsText).toBeVisible();
    
    await loginPage.logout();
    
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.form).toBeVisible();
  });

  test('TC04 - Intentar acceder sin sesión', async ({ page, loginPage }) => {
    await page.goto('/');
    
    const isLoggedIn = await loginPage.loggedInAsText.isVisible().catch(() => false);
    if (isLoggedIn) {
      await loginPage.logout();
    }
    
    await page.goto('/');
    const logoutVisible = await loginPage.logoutLink.isVisible().catch(() => false);
    
    expect(logoutVisible).toBeFalsy();
  });
});

/**
 * Data-Driven Testing: Login negativo con múltiples combinaciones
 */
test.describe('UI - Login Data-Driven Tests', () => {
  for (const testCase of invalidData) {
    test(`${testCase.case}`, async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(testCase.email, testCase.password);

      if (testCase.expectedMessage) {
        const actualMessage = await loginPage.getErrorText();
        expect(actualMessage.trim()).toContain(testCase.expectedMessage);

      }else {
        const urlBefore = page.url();
        await loginPage.loginButton.click();

        await page.waitForTimeout(500);
        const urlAfter = page.url();
        expect(urlAfter).toBe(urlBefore);
      }
    });
  }
});
