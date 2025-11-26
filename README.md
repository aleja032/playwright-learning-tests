# Proyecto de Automatización UI + API - Automation Exercise

## 📋 Descripción

Suite completa de pruebas automatizadas para el sitio [automationexercise.com](https://automationexercise.com/), implementando casos de prueba tanto de interfaz de usuario (UI) como de API, siguiendo las mejores prácticas de QA y arquitectura modular con **fixtures reutilizables** y **data-driven testing**.

## 🏗️ Arquitectura del Proyecto

El proyecto implementa el patrón **Page Object Model (POM)** con **fixtures personalizados** y una estructura modular y escalable:

```
├── pages/                           # Page Objects (UI)
│   ├── BasePage.ts                 # Clase base con métodos comunes reutilizables
│   ├── LoginPage.ts                # Página de Login/Signup
│   ├── ProductsPage.ts             # Página de Productos
│   ├── CartPage.ts                 # Página del Carrito
│   ├── CheckoutPage.ts             # Página de Checkout
│   └── PaymentPage.ts              # Página de Pago
├── fixtures/                        # Fixtures personalizados de Playwright
│   └── test-fixtures.ts            # Fixtures reutilizables (Page Objects + API Helper)
├── utils/                           # Utilidades y helpers
│   ├── api-helper.ts               # Helper centralizado para llamadas API
│   └── test-data.ts                # Generadores de datos de prueba
├── tests/                           # Casos de prueba organizados por tipo
│   ├── ui/                         # Tests de interfaz de usuario
│   │   ├── login.spec.ts           # Tests de Login
│   │   ├── cart.spec.ts            # Tests de Carrito
│   │   └── checkout.spec.ts        # Tests de Checkout
│   ├── api/                        # Tests de API
│   │   ├── login.spec.ts           # Tests API de Login
│   │   ├── products.spec.ts        # Tests API de Productos
│   │   ├── users.spec.ts           # Tests API de Usuarios
│   │   └── negative.spec.ts        # Tests API negativos y de borde
│   └── integration/                # Tests de integración UI+API
│       └── ui-api-validation.spec.ts
├── data-driven/                     # Datos externos para data-driven testing
│   ├── login-invalid-data.json     # Casos inválidos de login UI
│   ├── api-login-invalid.json      # Casos inválidos de login API
│   ├── cart-products.json          # Productos para agregar al carrito
│   └── checkout-comments.json      # Comentarios para checkout
└── playwright.config.ts             # Configuración de Playwright (baseURL, etc.)
```

## ✨ Características Principales

### 1. **Fixtures Reutilizables**
- Todos los Page Objects disponibles como fixtures
- Fixture `authenticatedPage` que proporciona sesión ya iniciada
- Fixture `apiHelper` para todas las llamadas API
- Elimina código duplicado y simplifica los tests

### 2. **Data-Driven Testing**
- Múltiples archivos JSON con casos de prueba
- Tests parametrizados que se ejecutan con diferentes datos
- Fácil adición de nuevos casos sin modificar código

### 3. **Uso de baseURL**
- Configurado en `playwright.config.ts`
- Todas las navegaciones usan rutas relativas
- Fácil cambio de ambiente (dev, staging, prod)

### 4. **Organización por Carpetas**
- Tests UI separados de tests API
- Tests de integración en carpeta dedicada
- Estructura clara y escalable

## 🎯 Casos de Prueba Implementados

### UI Tests

#### 1. Login (TC01-TC08)
- ✅ TC01: Login exitoso con credenciales válidas
- ✅ TC04: Verificar mensajes de error
- ✅ TC05: Logout exitoso
- ✅ TC06: Validar acceso sin sesión

#### 2. Data-Driven Testing (TC-DD)
- ✅ Usuario válido + contraseña inválida
- ✅ Correo con formato inválido
- ✅ Usuario inexistente
- ✅ Ambos campos vacíos

#### 3. Carrito de Compras (TC07-TC11)
- ✅ TC07: Agregar producto y validar modal
- ✅ TC08: Validar nombre, cantidad y precio en carrito
- ✅ TC09: Actualizar cantidad de producto
- ✅ TC10: Eliminar producto del carrito
- ✅ TC11: Validar carrito vacío

#### 4. Checkout (TC12-TC14)
- ✅ TC12: Flujo completo de checkout
- ✅ TC13: Completar pago (sin procesamiento real)
- ✅ TC14: Validar dirección del usuario

### API Tests

#### 1. Login API (API-TC01-TC06)
- ✅ API-TC01: Login exitoso retorna 200
- ✅ API-TC02: Login con password inválido retorna 404
- ✅ API-TC03: Login con email inexistente retorna 404
- ✅ API-TC04: Validar estructura JSON
- ✅ API-TC05: Login sin email
- ✅ API-TC06: Login sin password

#### 2. Productos API (API-TC07-TC12)
- ✅ API-TC07: GET /productsList retorna 200
- ✅ API-TC08: Validar existencia de productos
- ✅ API-TC09: Verificar estructura de producto
- ✅ API-TC10: Validar IDs únicos
- ✅ API-TC11: Validar precios válidos
- ✅ API-TC12: Buscar producto específico

#### 3. Gestión de Usuarios API (API-TC13-TC17)
- ✅ API-TC13: Crear cuenta con email nuevo
- ✅ API-TC14: Intento de creación con email existente
- ✅ API-TC15: Validar campos requeridos
- ✅ API-TC16: Obtener detalles de usuario
- ✅ API-TC17: Eliminar cuenta

#### 4. Integración UI + API (INT-TC01-TC03)
- ✅ INT-TC01: Validar usuario UI vs API
- ✅ INT-TC02: Validar productos UI existen en API
- ✅ INT-TC03: Validar precio UI vs API

#### 5. Casos Negativos y de Borde (NEG-TC01-TC12)
- ✅ NEG-TC01: Parámetros vacíos
- ✅ NEG-TC02: Email formato inválido
- ✅ NEG-TC03: Datos incompletos
- ✅ NEG-TC04: Email inválido en creación
- ✅ NEG-TC05: Usuario inexistente
- ✅ NEG-TC06: Credenciales incorrectas
- ✅ NEG-TC07: Búsqueda con término vacío
- ✅ NEG-TC08: Validar tiempo de respuesta
- ✅ NEG-TC09: Caracteres especiales (SQL injection)
- ✅ NEG-TC10: Password muy corto
- ✅ NEG-TC11: Estructura de errores
- ✅ NEG-TC12: Email con espacios

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd learning-playwright

# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install
```

## ▶️ Ejecución de Pruebas

### Ejecutar todas las pruebas
```bash
npx playwright test
```

### Ejecutar pruebas específicas
```bash
# Solo pruebas UI
npx playwright test tests/ui/

# Solo pruebas API
npx playwright test tests/api/

# Solo pruebas de integración
npx playwright test tests/integration/

# Test específico
npx playwright test tests/ui/login.spec.ts
npx playwright test tests/api/products.spec.ts
```

### Ejecutar con interfaz gráfica
```bash
npx playwright test --ui
```

### Ejecutar en modo debug
```bash
npx playwright test --debug
```

### Ejecutar solo pruebas smoke
```bash
npx playwright test --grep @smoke
```

### Ver reporte HTML
```bash
npx playwright show-report
```

## 📊 Reportes

Los reportes se generan automáticamente después de cada ejecución:
- **HTML Report**: `playwright-report/index.html`
- **Test Results**: `test-results/`

## 🔧 Configuración

### Usuario de Prueba

Para ejecutar las pruebas, necesitas crear un usuario en [automationexercise.com](https://automationexercise.com/):

1. Ir a Signup/Login
2. Crear una cuenta nueva
3. Actualizar las credenciales en los tests:
   - Email: `testqauser@example.com`
   - Password: `Test@123`

O modificar en `utils/test-data.ts`:

```typescript
export const TEST_USERS = {
  valid: {
    email: 'tu-email@example.com',
    password: 'tu-password',
    name: 'Tu Nombre',
  },
};
```

## 🎨 Buenas Prácticas Implementadas

### 1. **Fixtures Personalizados de Playwright**
- Reutilización de Page Objects mediante fixtures
- Fixture `authenticatedPage` evita login repetitivo
- Fixture `apiHelper` centraliza llamadas API
- Reduce código duplicado significativamente

### 2. **Page Object Model (POM)**
- Separación clara entre lógica de prueba y elementos de UI
- Clase `BasePage` con métodos comunes reutilizables
- Herencia para compartir funcionalidad
- Mantenibilidad mejorada

### 3. **Uso de baseURL**
- Configurado en `playwright.config.ts`
- Todas las navegaciones usan rutas relativas
- Fácil cambio entre ambientes
- Código más limpio y portable

### 4. **Data-Driven Testing Completo**
- 4 archivos JSON con diferentes casos de prueba
- Tests parametrizados que iteran sobre datos externos
- Separación de datos y lógica de prueba
- Fácil adición de nuevos casos sin modificar código

### 5. **Organización Modular**
- Tests organizados por tipo (ui/, api/, integration/)
- Helpers centralizados en utils/
- Datos de prueba en data-driven/
- Estructura escalable y mantenible

### 6. **Nomenclatura Clara**
- IDs de test descriptivos (TC01, API-TC01, INT-TC01, NEG-TC01)
- Nombres de métodos autodocumentados
- Comentarios JSDoc en clases y métodos

### 7. **Validaciones Completas**
- Validación de estructura de respuestas API
- Validación de tipos de datos
- Validación de tiempos de respuesta
- Validación cruzada UI vs API

### 8. **Manejo de Errores y Casos Negativos**
- Suite completa de casos negativos
- Validación de mensajes de error
- Pruebas de seguridad básicas (SQL injection)
- Validación de límites y bordes

### 9. **Limpieza de Datos**
- Eliminación automática de cuentas de prueba creadas
- Estado limpio entre tests
- Uso de `beforeEach` y `afterEach` cuando necesario

### 10. **Configuración Optimizada**
- Screenshots y videos solo en fallos
- Traces para debugging
- Configuración multi-browser
- Paralelización habilitada

## 📝 Notas Importantes

1. **Credenciales**: Asegúrate de usar credenciales válidas para los tests de login
2. **Tiempos de espera**: Algunos tests incluyen `waitForTimeout` para animaciones del sitio
3. **Navegadores**: Los tests están configurados para ejecutarse en Chromium, Firefox y WebKit
4. **Paralelización**: Los tests se ejecutan en paralelo por defecto
5. **Reintentos**: En CI, los tests fallidos se reintentan 2 veces

## 🐛 Troubleshooting

### Error: "User not found"
- Verifica que las credenciales en los tests sean correctas
- Crea un usuario nuevo en el sitio si es necesario

### Tests lentos
- Reduce el número de navegadores en `playwright.config.ts`
- Desactiva la paralelización: `fullyParallel: false`

### Timeouts
- Aumenta el timeout global en `playwright.config.ts`
- Verifica tu conexión a internet

