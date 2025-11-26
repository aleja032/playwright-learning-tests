import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Suite de pruebas API para Productos
 * Usa fixture apiHelper
 */
test.describe('API - Products Tests', () => {
  test('API-TC07 - GET /productsList retorna 200', async ({ apiHelper }) => {
    const response = await apiHelper.getProductsList();
    
    expect(response.status()).toBe(200);
  });

  test('API-TC08 - Validar que existen productos en el array', async ({ apiHelper }) => {
    const response = await apiHelper.getProductsList();
    const body = await response.json();
    
    expect(body.responseCode).toBe(200);
    expect(body.products).toBeDefined();
    expect(Array.isArray(body.products)).toBeTruthy();
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('API-TC09 - Verificar estructura de un producto', async ({ apiHelper }) => {
    const response = await apiHelper.getProductsList();
    const body = await response.json();
    
    const firstProduct = body.products[0];
    
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
    
    expect(typeof firstProduct.id).toBe('number');
    expect(typeof firstProduct.name).toBe('string');
    expect(typeof firstProduct.price).toBe('string');
  });

  test('API-TC10 - Validar que los IDs no sean duplicados', async ({ apiHelper }) => {
    const response = await apiHelper.getProductsList();
    const body = await response.json();
    
    const ids = body.products.map((product: any) => product.id);
    const uniqueIds = new Set(ids);
    
    expect(ids.length).toBe(uniqueIds.size);
  });

  test('API-TC11 - Validar que todos los productos tienen precio válido', async ({ apiHelper }) => {
    const response = await apiHelper.getProductsList();
    const body = await response.json();
    
    body.products.forEach((product: any) => {
      expect(product.price).toBeTruthy();
      expect(product.price).toMatch(/Rs\.\s*\d+/);
    });
  });

  test('API-TC12 - Buscar producto específico', async ({ apiHelper }) => {
    const response = await apiHelper.searchProduct('tshirt');
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body.responseCode).toBe(200);
    expect(body.products).toBeDefined();
  });
});
