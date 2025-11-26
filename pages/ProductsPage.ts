import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object para la página de Productos
 */
export class ProductsPage extends BasePage {
  readonly productsList: Locator;
  readonly addToCartButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;
  readonly modalAddedConfirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.productsList = page.locator('.features_items');
    this.addToCartButtons = page.locator('.productinfo a:has-text("Add to cart")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.viewCartLink = page.locator('a:has-text("View Cart")');
    this.modalAddedConfirmation = page.locator('#cartModal');
  }

  async goto() {
    await this.page.goto('/products');
    await this.productsList.waitFor({ state: 'visible' });
  }

  async addProductToCart(index: number = 0) {
    await this.addToCartButtons.nth(index).click();
    await this.modalAddedConfirmation.waitFor({ state: 'visible' });
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.modalAddedConfirmation.waitFor({ state: 'hidden' });
  }

  async goToCart() {
    await this.viewCartLink.click();
  }

  async getProductName(index: number = 0): Promise<string> {
    const product = this.page.locator('.productinfo p').nth(index);
    return (await product.textContent()) ?? '';
  }
}
