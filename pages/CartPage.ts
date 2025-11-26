import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object para la página del Carrito
 */
export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly productRows: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('#cart_info_table');
    this.productRows = page.locator('.cart_description');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.emptyCartMessage = page.locator('#empty_cart');
  }

  async goto() {
    await this.page.goto('/view_cart');
  }

  async getProductName(index: number = 0): Promise<string> {
    const name = this.productRows.nth(index).locator('h4 a');
    return (await name.textContent()) ?? '';
  }

  async getProductPrice(index: number = 0): Promise<string> {
    const price = this.page.locator('.cart_price p').nth(index);
    return (await price.textContent()) ?? '';
  }

  async getProductQuantity(index: number = 0): Promise<string> {
    const qty = this.page.locator('.cart_quantity button').nth(index);
    return (await qty.textContent()) ?? '';
  }

  async updateQuantity(index: number, quantity: number) {
    const qtyInput = this.page.locator('.cart_quantity button').nth(index);
    await qtyInput.click({ clickCount: 3 });
    await this.page.keyboard.type(quantity.toString());
    await this.page.keyboard.press('Enter');
  }

  async deleteProduct(index: number = 0) {
    await this.page.locator('.cart_delete a').nth(index).click();
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.productRows.count();
    return count === 0;
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}
