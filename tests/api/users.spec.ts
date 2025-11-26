import { test, expect } from '../../fixtures/test-fixtures';
import { generateUserData } from '../../utils/test-data';

/**
 * Suite de pruebas API para Gestión de Usuarios
 * Usa fixture apiHelper y funciones de generación de datos
 */
test.describe('API - User Management Tests', () => {
  test('API-TC13 - Crear cuenta con email nuevo', async ({ apiHelper }) => {
    const userData = generateUserData();
    
    const response = await apiHelper.createAccount(userData);
    const body = await response.json();
    
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(201);
    expect(body.message).toContain('User created');
    
    // Limpiar
    await apiHelper.deleteAccount(userData.email, userData.password);
  });

  test('API-TC14 - Intento de creación con email existente debe fallar', async ({ apiHelper }) => {
    const userData = generateUserData();
    
    await apiHelper.createAccount(userData);
    
    const response = await apiHelper.createAccount(userData);
    const body = await response.json();
    
    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('Email already exists');
    
    await apiHelper.deleteAccount(userData.email, userData.password);
  });

  test('API-TC15 - Validar campos requeridos para crear cuenta', async ({ apiHelper }) => {
    const incompleteData = {
      name: 'Test',
      email: '',
      password: 'test123',
    };
    
    const response = await apiHelper.createAccount(incompleteData);
    const body = await response.json();
    
    expect(body.responseCode).not.toBe(201);
  });

  test('API-TC16 - Obtener detalles de usuario por email', async ({ apiHelper }) => {
    const userData = generateUserData();
    
    await apiHelper.createAccount(userData);
    
    const response = await apiHelper.getUserDetailByEmail(userData.email);
    const body = await response.json();
    
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(userData.email);
    
    await apiHelper.deleteAccount(userData.email, userData.password);
  });

  test('API-TC17 - Eliminar cuenta existente', async ({ apiHelper }) => {
    const userData = generateUserData();
    
    await apiHelper.createAccount(userData);
    
    const response = await apiHelper.deleteAccount(userData.email, userData.password);
    const body = await response.json();
    
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.message).toContain('Account deleted');
  });
});
