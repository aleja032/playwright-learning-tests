import { test, expect } from '../../fixtures/test-fixtures';
import cartData from '../../data-driven/cart-products.json';

/**
 * Suite de pruebas UI para Carrito de Compras
 * Usa fixture authenticatedPage para evitar login repetitivo 
 */
test.describe('UI - Cart Tests', () => {
  test.beforeEach(async ({ productsPage }) => {
    // Ya estamos autenticados gracias al fixture
    await productsPage.goto();
  });

  test('TC07 - Agregar producto al carrito y validar modal', async ({ authenticatedPage, page, productsPage }) => {
    await productsPage.addProductToCart(0);
    
    await expect(productsPage.modalAddedConfirmation).toBeVisible();
    await expect(page.locator('text=Your product has been added to cart')).toBeVisible();
  });

  test('TC08 - Validar producto en carrito (nombre, cantidad, precio)', async ({ productsPage, cartPage }) => {
    const productName = await productsPage.getProductName(0);
    
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    
    const cartProductName = await cartPage.getProductName(0);
    expect(cartProductName).toContain(productName.substring(0, 10));
    
    const quantity = await cartPage.getProductQuantity(0);
    expect(quantity).toBe('1');
    
    const price = await cartPage.getProductPrice(0);
    expect(price).toMatch(/Rs\.\s*\d+/);
  });
  
  test('TC07 - Actualizar producto al carrito del carrito', async ({ authenticatedPage, page, productsPage, cartPage }) => {
    const productName = await productsPage.getProductName(0);
    await productsPage.addProductToCart(0);

    await expect(productsPage.modalAddedConfirmation).toBeVisible();
    await expect(page.locator('text=Your product has been added to cart')).toBeVisible();
    await productsPage.goToCart();
    
    const cartProductName = await cartPage.getProductName(0);
    expect(cartProductName).toContain(productName.substring(0, 10));

    const quantity = await cartPage.getProductQuantity(0);
    expect(quantity).toBe('2');
  });
  
  // test('TC09 - Validar cantidad inicial de producto', async ({ productsPage, cartPage }) => {
  //   await productsPage.addProductToCart(0);
  //   await productsPage.goToCart();
    
  //   const initialQty = await cartPage.getProductQuantity(0);
  //   expect(initialQty).toBe('1');
  // });

  test('TC10 - Eliminar producto del carrito', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    
    await cartPage.deleteProduct(0);
    
    await cartPage.page.waitForTimeout(1000);
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });

  test('TC11 - Validar carrito vacío después de eliminar todos los productos', async ({ productsPage, cartPage }) => {
    // Agregar dos productos
    await productsPage.addProductToCart(0);
    await productsPage.continueShopping();
    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    
    // Eliminar todos
    const count = await cartPage.productRows.count();
    for (let i = 0; i < count; i++) {
      await cartPage.deleteProduct(0);
      await cartPage.page.waitForTimeout(500);
    }
    
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });
});


/**
 * Data-Driven: Agregar múltiples productos al carrito
 */
test.describe('UI - Cart Data-Driven Tests', () => {

  for (const testCase of cartData) {
    test(`TC-DD-${testCase.testCase}`, async ({ productsPage, cartPage }) => {
      await productsPage.goto();
      await productsPage.addProductToCart(testCase.productIndex);
      await productsPage.goToCart();
      
      const quantity = await cartPage.getProductQuantity(0);
      expect(quantity).toBe(testCase.expectedQuantity);
      
    });
  }
});
