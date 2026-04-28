import { Locator, Page } from "../tests/base";

export class AddEmployeePage {
  private readonly page: Page;
  private readonly saveButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly firstNameContainer: Locator;
  private readonly lastNameInput: Locator;
  private readonly lastNameContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveButton = page.locator('button:has-text("Save")');
    this.firstNameInput = page.locator('input[name="firstName"]').first();
    this.firstNameContainer = page.locator('.oxd-form .oxd-input-group').filter({ has: page.locator('input[name="firstName"]') }).first();
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.lastNameContainer = page.locator('.oxd-form .oxd-input-group').filter({ has: page.locator('input[name="lastName"]') });
  }

  getSaveButton(): Locator {
    return this.saveButton;
  }

  getFormElement(): Locator {
    return this.page.locator('form');
  }

  getFirstNameFieldError(): Locator {
    return this.firstNameContainer.locator("span.oxd-input-field-error-message").first();
  }

  getLastNameFieldError(): Locator {
    return this.lastNameContainer.locator("span.oxd-input-field-error-message").first();
  }

  async clickSaveWithoutFillingForm(): Promise<void> {
    await this.saveButton.click();
  }
}
