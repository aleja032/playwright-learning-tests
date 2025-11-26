import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_USERS } from '../../utils/test-data';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Suite de pruebas API para Login
 * Usa fixture apiHelper y TEST_USERS para reutilización
 */
test.describe('API - Login Tests', () => {
  test('API-TC01 - Login exitoso retorna responseCode 200', async ({ apiHelper }) => {
    const response = await apiHelper.login(TEST_USERS.valid.email, TEST_USERS.valid.password);
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.responseCode).toBe(200);
  });

  test('API-TC02 - Login con password inválido retorna responseCode 404', async ({ apiHelper }) => {
    const response = await apiHelper.login(TEST_USERS.valid.email, TEST_USERS.invalid.password);
    
    const body = await response.json();
    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  test('API-TC03 - Login con email inexistente retorna responseCode 404', async ({ apiHelper }) => {
    const response = await apiHelper.login(TEST_USERS.nonExistent.email, TEST_USERS.nonExistent.password);
    
    const body = await response.json();
    expect(body.responseCode).toBe(404);
  });

  test('API-TC04 - Validar estructura del JSON de respuesta', async ({ apiHelper }) => {
    const response = await apiHelper.login(TEST_USERS.valid.email, TEST_USERS.invalid.password);
    
    const body = await response.json();
    
    expect(body).toHaveProperty('responseCode');
    expect(body).toHaveProperty('message');
    
    expect(typeof body.responseCode).toBe('number');
    expect(typeof body.message).toBe('string');
  });

  test('API-TC05 - Login sin email retorna error', async ({ apiHelper }) => {
    const response = await apiHelper.login('', TEST_USERS.valid.password);
    
    const body = await response.json();
    expect(body.responseCode).not.toBe(200);
  });

  test('API-TC06 - Login sin password retorna error', async ({ apiHelper }) => {
    const response = await apiHelper.login(TEST_USERS.valid.email, '');
    
    const body = await response.json();
    expect(body.responseCode).not.toBe(200);
  });
});

/**
 * Data-Driven: Login API con múltiples casos inválidos
 */
test.describe('API - Login Data-Driven Tests', () => {
  const dataPath = path.join(__dirname, '../../data-driven/api-login-invalid.json');
  const invalidData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  for (const testCase of invalidData) {
    test(`API-DD-${testCase.testCase}`, async ({ apiHelper }) => {
      const response = await apiHelper.login(testCase.email, testCase.password);
      const body = await response.json();
      
      expect(body.responseCode).toBe(testCase.expectedResponseCode);
    });
  }
});
