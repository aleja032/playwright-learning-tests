import { Page } from '@playwright/test';

/**
 * Clase base para todos los Page Objects
 * Contiene métodos comunes reutilizables
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navegar a una ruta usando baseURL configurado
   */
  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  /**
   * Esperar a que la página cargue completamente
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Esperar a que un elemento sea visible
   */
  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Obtener el texto de un elemento
   */
  async getElementText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) ?? '';
  }

  /**
   * Hacer clic en un elemento
   */
  async clickElement(selector: string) {
    await this.page.click(selector);
  }

  /**
   * Llenar un campo de texto
   */
  async fillField(selector: string, value: string) {
    await this.page.fill(selector, value);
  }
}
