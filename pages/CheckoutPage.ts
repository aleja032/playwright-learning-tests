import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object para la página de Checkout
 */
export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a:has-text("Place Order")');
  }

  async getDeliveryAddressText(): Promise<string> {
    return (await this.deliveryAddress.textContent()) ?? '';
  }

  async addComment(comment: string) {
    await this.commentTextarea.fill(comment);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
