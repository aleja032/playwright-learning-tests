import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Suite de pruebas API - Casos Negativos y de Borde
 * Validar robustez del backend
 */
test.describe('API - Negative & Edge Cases', () => {
  test('NEG-TC01 - Login con parámetros vacíos', async ({ apiHelper }) => {
    const response = await apiHelper.login('', '');
    const body = await response.json();
    
    expect(body.responseCode).not.toBe(200);
    expect(body.message).toBeDefined();
  });

  test('NEG-TC02 - Login con email en formato inválido', async ({ apiHelper }) => {
    const response = await apiHelper.login('not-an-email', 'password123');
    const body = await response.json();
    
    expect(body.responseCode).toBe(404);
  });

  test('NEG-TC03 - Crear cuenta con datos incompletos', async ({ apiHelper }) => {
    const response = await apiHelper.createAccount({
      name: '',
      email: 'test@test.com',
      password: '',
    });
    
    const body = await response.json();
    expect(body.responseCode).not.toBe(201);
  });

  test('NEG-TC04 - Crear cuenta con email inválido', async ({ apiHelper }) => {
    const response = await apiHelper.createAccount({
      name: 'Test User',
      email: 'invalid-email-format',
      password: 'test123',
    });
    
    const body = await response.json();
    expect(body.responseCode).toBe(400);
  });

  test('NEG-TC05 - Obtener usuario con email inexistente', async ({ apiHelper }) => {
    const response = await apiHelper.getUserDetailByEmail('nonexistent@fake.com');
    const body = await response.json();
    
    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('not exist');
  });

  test('NEG-TC06 - Eliminar cuenta con credenciales incorrectas', async ({ apiHelper }) => {
    const response = await apiHelper.deleteAccount('fake@test.com', 'wrongpass');
    const body = await response.json();
    
    expect(body.responseCode).toBe(404);
  });

  test('NEG-TC07 - Buscar producto con término vacío', async ({ apiHelper }) => {
    const response = await apiHelper.searchProduct('');
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body.products).toBeDefined();
  });

  test('NEG-TC08 - Validar tiempo de respuesta de API', async ({ apiHelper }) => {
    const startTime = Date.now();
    const response = await apiHelper.getProductsList();
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(5000);
  });

  test('NEG-TC09 - Login con caracteres especiales (SQL injection)', async ({ apiHelper }) => {
    const response = await apiHelper.login('test@test.com', "'; DROP TABLE users; --");
    const body = await response.json();
    
    expect(response.status()).toBeLessThan(500);
    expect(body.responseCode).toBeDefined();
  });

  test('NEG-TC10 - Crear cuenta con password muy corto', async ({ apiHelper }) => {
    const response = await apiHelper.createAccount({
      name: 'Test',
      email: 'test@example.com',
      password: '1',
    });
    
    const body = await response.json();
    
    expect(body.responseCode).toBeDefined();
    expect(body.message).toBeDefined();
  });

  test('NEG-TC11 - Validar estructura de error en respuestas fallidas', async ({ apiHelper }) => {
    const response = await apiHelper.login('wrong@test.com', 'wrong');
    const body = await response.json();
    
    expect(body).toHaveProperty('responseCode');
    expect(body).toHaveProperty('message');
    expect(typeof body.responseCode).toBe('number');
    expect(typeof body.message).toBe('string');
  });

  test('NEG-TC12 - Validar manejo de email con espacios', async ({ apiHelper }) => {
    const response = await apiHelper.login(' test@test.com ', 'password');
    const body = await response.json();
    
    expect(body.responseCode).toBeDefined();
  });
});
