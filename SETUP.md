# Guía de Configuración y Ejecución

## 📝 Configuración Inicial

### 1. Crear Usuario de Prueba

Antes de ejecutar los tests, necesitas crear un usuario en el sitio:

1. Ir a https://automationexercise.com/login
2. En la sección "New User Signup!", ingresar:
   - Name: `Test QA User`
   - Email: `testqauser@example.com`
3. Completar el formulario de registro con:
   - Password: `Test@123`
   - Completar los demás campos requeridos
4. Crear la cuenta

### 2. Actualizar Credenciales (Opcional)

Si prefieres usar tus propias credenciales, actualiza los siguientes archivos:

**utils/test-data.ts:**
```typescript
export const TEST_USERS = {
  valid: {
    email: 'tu-email@example.com',
    password: 'tu-password',
    name: 'Tu Nombre',
  },
};
```

**fixtures/test-fixtures.ts:**
```typescript
authenticatedPage: async ({ page }, use) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('tu-email@example.com', 'tu-password');
  // ...
}
```

**Archivos de data-driven:**
- `data-driven/login-invalid-data.json`
- `data-driven/api-login-invalid.json`

## 🚀 Comandos de Ejecución

### Ejecutar Todos los Tests
```bash
npx playwright test
```

### Ejecutar por Categoría
```bash
# Tests UI
npx playwright test tests/ui/

# Tests API
npx playwright test tests/api/

# Tests de Integración
npx playwright test tests/integration/
```

### Ejecutar Tests Específicos
```bash
# Login UI
npx playwright test tests/ui/login.spec.ts

# Login API
npx playwright test tests/api/login.spec.ts

# Carrito
npx playwright test tests/ui/cart.spec.ts

# Checkout
npx playwright test tests/ui/checkout.spec.ts

# Productos API
npx playwright test tests/api/products.spec.ts

# Usuarios API
npx playwright test tests/api/users.spec.ts

# Casos Negativos
npx playwright test tests/api/negative.spec.ts

# Integración UI+API
npx playwright test tests/integration/ui-api-validation.spec.ts
```

### Ejecutar Solo Tests Smoke
```bash
npx playwright test --grep @smoke
```

### Ejecutar en un Solo Navegador
```bash
# Solo Chromium
npx playwright test --project=chromium

# Solo Firefox
npx playwright test --project=firefox

# Solo WebKit
npx playwright test --project=webkit
```

### Modo Debug
```bash
# Debug de un test específico
npx playwright test tests/ui/login.spec.ts --debug

# Debug con UI Mode
npx playwright test --ui
```

### Ver Reportes
```bash
# Generar y abrir reporte HTML
npx playwright show-report
```

## 📊 Estructura de Data-Driven

### Agregar Nuevos Casos de Login Inválido (UI)

Editar `data-driven/login-invalid-data.json`:
```json
{
  "case": "Descripción del caso",
  "email": "email@test.com",
  "password": "password",
  "expectedMessage": "Mensaje esperado"
}
```

### Agregar Nuevos Casos de Login API

Editar `data-driven/api-login-invalid.json`:
```json
{
  "testCase": "Descripción",
  "email": "email@test.com",
  "password": "password",
  "expectedResponseCode": 404
}
```

### Agregar Productos para Tests de Carrito

Editar `data-driven/cart-products.json`:
```json
{
  "testCase": "Descripción",
  "productIndex": 0,
  "expectedQuantity": "1"
}
```

### Agregar Comentarios para Checkout

Editar `data-driven/checkout-comments.json`:
```json
{
  "testCase": "Descripción",
  "comment": "Texto del comentario"
}
```

## 🔧 Configuración Avanzada

### Cambiar baseURL

Editar `playwright.config.ts`:
```typescript
use: {
  baseURL: 'https://tu-ambiente.com',
  // ...
}
```

### Ajustar Timeouts

Editar `playwright.config.ts`:
```typescript
export default defineConfig({
  timeout: 30000, // Timeout por test
  expect: {
    timeout: 5000, // Timeout para expects
  },
  // ...
});
```

### Configurar Reintentos

Editar `playwright.config.ts`:
```typescript
export default defineConfig({
  retries: 2, // Número de reintentos en caso de fallo
  // ...
});
```

## 🐛 Troubleshooting

### Error: "Your email or password is incorrect!"
- Verifica que el usuario existe en el sitio
- Verifica que las credenciales sean correctas
- Crea un nuevo usuario si es necesario

### Tests Lentos
- Ejecuta solo en Chromium: `--project=chromium`
- Desactiva paralelización en `playwright.config.ts`: `fullyParallel: false`
- Reduce workers: `workers: 1`

### Timeouts
- Aumenta timeout global en `playwright.config.ts`
- Verifica tu conexión a internet
- Algunos tests incluyen `waitForTimeout` para animaciones del sitio

### Error: "User created" pero luego falla
- El test de creación de usuario genera emails únicos con timestamp
- Si falla la limpieza, puede quedar basura en el sitio
- Usa emails diferentes o elimina manualmente

## 📈 Métricas de Cobertura

El proyecto cubre:
- ✅ 6 casos de prueba UI de Login (incluyendo data-driven)
- ✅ 5 casos de prueba UI de Carrito (incluyendo data-driven)
- ✅ 3 casos de prueba UI de Checkout (incluyendo data-driven)
- ✅ 6 casos de prueba API de Login (incluyendo data-driven)
- ✅ 6 casos de prueba API de Productos
- ✅ 5 casos de prueba API de Usuarios
- ✅ 12 casos de prueba API Negativos
- ✅ 3 casos de prueba de Integración UI+API

**Total: 46+ casos de prueba automatizados**

## 🎯 Próximos Pasos

1. Ejecutar todos los tests: `npx playwright test`
2. Ver el reporte: `npx playwright show-report`
3. Revisar screenshots/videos de fallos en `test-results/`
4. Agregar más casos data-driven según necesidad
5. Extender fixtures para nuevas funcionalidades
