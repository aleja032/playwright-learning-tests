import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object para la página de Login/Signup
 */
export class LoginPage extends BasePage {
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMsg: Locator;
  readonly logoutLink: Locator;
  readonly loggedInAsText: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('.login-form');
    this.emailInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.errorMsg = page.locator('.login-form p');
    this.logoutLink = page.getByRole('link', { name: /logout/i });
    this.loggedInAsText = page.locator('a:has-text("Logged in as")');
  }

  async goto() {
    await this.page.goto('/login');
    await this.form.waitFor({ state: 'visible' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string> {
    await this.errorMsg.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.errorMsg.textContent()) ?? '';
  }

  // async hasErrorMessage(): Promise<boolean> {
  //   try {
  //     await this.errorMsg.waitFor({ state: 'visible', timeout: 3000 });
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  // async isOnLoginPage(): Promise<boolean> {
  //   return await this.form.isVisible();
  // }

  async getLoggedInUsername(): Promise<string> {
    await this.loggedInAsText.waitFor({ state: 'visible' });
    const text = await this.loggedInAsText.textContent();
    console.log("texto in get loggedInAsText", text)
    return text?.replace('Logged in as ', '').trim() ?? '';
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.loggedInAsText.isVisible();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
