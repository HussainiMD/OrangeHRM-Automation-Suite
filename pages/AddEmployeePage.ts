import { Locator, Page } from "../tests/base";

export class AddEmployeePage {
  private readonly page: Page;
  private readonly saveButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly firstNameContainer: Locator;
  private readonly lastNameInput: Locator;
  private readonly lastNameContainer: Locator;
  private readonly midNameInput: Locator;
  private readonly midNameContainer: Locator;
  private readonly employeeIDInput: Locator;
  private readonly employeeIDContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveButton = page.locator('button:has-text("Save")');
    this.firstNameInput = page.locator('input[name="firstName"]').first();
    this.firstNameContainer = page.locator('.oxd-form .oxd-input-group').filter({ has: page.locator('input[name="firstName"]') }).first();
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.lastNameContainer = page.locator('.oxd-form .oxd-input-group').filter({ has: page.locator('input[name="lastName"]') });
    this.midNameInput = page.locator('input[name="middleName"]').first();
    this.midNameContainer = page.locator('.oxd-form .oxd-input-group').filter({ has: page.locator('input[name="middleName"]') }).first();
    this.employeeIDContainer =  page.locator('.oxd-form .orangehrm-employee-form .oxd-input-group').filter({ hasText: 'Employee Id'});
    this.employeeIDInput = this.employeeIDContainer.locator('input.oxd-input');
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

  getMidNameFieldError(): Locator {
    return this.midNameContainer.locator("span.oxd-input-field-error-message").first();
  }

  getEmployeeIdFieldError(): Locator {
    return this.employeeIDContainer.locator("span.oxd-input-field-error-message").first();
  }

  getEmployeeID(): Locator {
    return this.employeeIDInput;
  }

  async clickSaveWithoutFillingForm(): Promise<void> {
    await this.saveButton.click();
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillMidName(name: string): Promise<void> {
    await this.firstNameInput.fill(name);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }
}
