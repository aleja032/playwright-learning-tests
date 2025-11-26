# 📖 Explicación de Fixtures en Playwright

## ¿Qué son los Fixtures?

Los **fixtures** son una característica poderosa de Playwright que permite:
- **Reutilizar código** sin duplicación
- **Preparar el estado** antes de cada test (setup)
- **Limpiar recursos** después de cada test (teardown)
- **Inyectar dependencias** automáticamente en los tests

## 🔄 Ciclo de Vida de un Fixture

```typescript
myFixture: async ({ page }, use) => {
  // 1. SETUP: Se ejecuta ANTES del test
  console.log('Preparando fixture...');
  const instance = new MyClass(page);
  await instance.initialize();
  
  // 2. USE: El test usa el fixture
  await use(instance);
  
  // 3. TEARDOWN: Se ejecuta DESPUÉS del test
  console.log('Limpiando fixture...');
  await instance.cleanup();
}
```

## 📝 Ejemplo Práctico: Nuestros Fixtures

### 1. Fixture Simple: `loginPage`

```typescript
loginPage: async ({ page }, use) => {
  const loginPage = new LoginPage(page);
  await use(loginPage);
}
```

**¿Qué hace?**
- Crea una instancia de `LoginPage` con el `page` de Playwright
- La inyecta en el test
- No necesita teardown (Playwright limpia `page` automáticamente)

**Uso en test:**
```typescript
test('Mi test', async ({ loginPage }) => {
  await loginPage.goto();  // Ya está listo!
  await loginPage.login('email', 'pass');
});
```

### 2. Fixture Avanzado: `authenticatedPage`

```typescript
authenticatedPage: async ({ page }, use) => {
  // SETUP: Hacer login antes del test
  const { TEST_USERS } = await import('../utils/test-data');
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);
  await loginPage.loggedInAsText.waitFor({ state: 'visible' });
  
  // USE: El test ya tiene sesión iniciada
  await use(loginPage);
  
  // TEARDOWN: (opcional) Hacer logout
  // await loginPage.logout();
}
```

**¿Qué hace?**
- Hace login automáticamente ANTES de cada test
- El test empieza con sesión ya iniciada
- Ahorra tiempo y código repetitivo

**Uso en test:**
```typescript
test('Agregar al carrito', async ({ authenticatedPage, cartPage }) => {
  // Ya estás logueado! No necesitas hacer login
  await cartPage.goto();
  await cartPage.addProduct();
});
```

### 3. Fixture de API: `apiHelper`

```typescript
apiHelper: async ({ request }, use) => {
  const apiHelper = new ApiHelper(request);
  await use(apiHelper);
}
```

**¿Qué hace?**
- Crea una instancia de `ApiHelper` con el contexto de request de Playwright
- Permite hacer llamadas API en los tests

**Uso en test:**
```typescript
test('API test', async ({ apiHelper }) => {
  const response = await apiHelper.login('email', 'pass');
  expect(response.status()).toBe(200);
});
```

## 🎯 Ventajas de Usar Fixtures

### ❌ Sin Fixtures (Código Repetitivo)
```typescript
test('Test 1', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('email', 'pass');
  // ... test logic
});

test('Test 2', async ({ page }) => {
  const loginPage = new LoginPage(page);  // Repetido!
  await loginPage.goto();                  // Repetido!
  await loginPage.login('email', 'pass');  // Repetido!
  // ... test logic
});
```

### ✅ Con Fixtures (DRY - Don't Repeat Yourself)
```typescript
test('Test 1', async ({ authenticatedPage }) => {
  // Ya estás logueado!
  // ... test logic
});

test('Test 2', async ({ authenticatedPage }) => {
  // Ya estás logueado!
  // ... test logic
});
```

## 🔗 Composición de Fixtures

Los fixtures pueden depender de otros fixtures:

```typescript
// Fixture que depende de 'page'
loginPage: async ({ page }, use) => {
  await use(new LoginPage(page));
}

// Fixture que depende de 'loginPage'
authenticatedPage: async ({ loginPage }, use) => {
  await loginPage.goto();
  await loginPage.login('email', 'pass');
  await use(loginPage);
}
```

## 📦 Nuestros Fixtures Disponibles

En `fixtures/test-fixtures.ts` tenemos:

| Fixture | Descripción | Cuándo Usarlo |
|---------|-------------|---------------|
| `loginPage` | Instancia de LoginPage | Tests de login |
| `productsPage` | Instancia de ProductsPage | Tests de productos |
| `cartPage` | Instancia de CartPage | Tests de carrito |
| `checkoutPage` | Instancia de CheckoutPage | Tests de checkout |
| `paymentPage` | Instancia de PaymentPage | Tests de pago |
| `apiHelper` | Helper para llamadas API | Tests de API |
| `authenticatedPage` | Página con sesión iniciada | Tests que requieren login |

## 💡 Mejores Prácticas

1. **Usa fixtures para setup común**: Si varios tests necesitan el mismo setup, crea un fixture
2. **Mantén fixtures simples**: Un fixture debe hacer una cosa bien
3. **Usa `authenticatedPage`**: Para tests que requieren login, evita repetir el login
4. **Combina fixtures**: Puedes usar múltiples fixtures en un test
5. **Limpia recursos**: Si creas datos, límpialos en el teardown

## 🚀 Ejemplo Completo

```typescript
test('Flujo completo de compra', async ({ 
  authenticatedPage,  // Ya logueado
  productsPage,       // Para navegar productos
  cartPage,           // Para manejar carrito
  checkoutPage        // Para checkout
}) => {
  // Setup automático: Ya estás logueado!
  
  await productsPage.goto();
  await productsPage.addProductToCart(0);
  await productsPage.goToCart();
  
  await cartPage.proceedToCheckout();
  await checkoutPage.addComment('Test order');
  await checkoutPage.placeOrder();
  
  // Teardown automático: Playwright limpia todo
});
```

## 🎓 Resumen

- **Fixtures = Inyección de Dependencias**
- **Setup automático** antes del test
- **Teardown automático** después del test
- **Reutilización** sin código duplicado
- **Composición** de fixtures complejos
- **Mantenibilidad** mejorada
