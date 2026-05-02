import { Locator, Page } from "../tests/base";

export class AddEmployeePage {
  private readonly page: Page;
  private readonly errorMsgSpan = "span.oxd-input-field-error-message";
  private readonly saveButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly firstNameContainer: Locator;
  private readonly lastNameInput: Locator;
  private readonly lastNameContainer: Locator;
  private readonly midNameInput: Locator;
  private readonly midNameContainer: Locator;
  private readonly employeeIDInput: Locator;
  private readonly employeeIDContainer: Locator;
  private readonly profilePhotoContainer: Locator;
  private readonly createLoginContainer: Locator;
  private readonly createLoginSwitchContainer: Locator;
  private readonly userNameContainer: Locator;
  private readonly userNameInput: Locator;
  private readonly passwordContainer: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly loginStatusContainer: Locator;  

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
    this.profilePhotoContainer = page.locator('.oxd-form .orangehrm-employee-image');
    this.createLoginContainer =  page.locator('.oxd-form > .orangehrm-employee-container');
    this.createLoginSwitchContainer = this.createLoginContainer.locator('.orangehrm-employee-form > .oxd-form-row').filter({hasText: /Create\s*Login/i});
    this.userNameContainer = this.createLoginContainer.locator('.oxd-input-group').filter({hasText: /Username/i});
    this.userNameInput = this.userNameContainer.locator('input.oxd-input');
    this.passwordContainer = this.createLoginContainer.locator('.oxd-input-group').filter({hasText: /Password/i});
    this.passwordInput = this.passwordContainer.first().locator('input[type="password"].oxd-input');
    this.confirmPasswordInput = this.passwordContainer.last().locator('input[type="password"].oxd-input');
    this.loginStatusContainer = this.createLoginContainer.locator('.oxd-input-group').filter({hasText: /Status/i});    
  }

  getSaveButton(): Locator {
    return this.saveButton;
  }

  getFormElement(): Locator {
    return this.page.locator('form');
  }

  getFirstNameFieldError(): Locator {
    return this.firstNameContainer.locator(this.errorMsgSpan).first();
  }

  getLastNameFieldError(): Locator {
    return this.lastNameContainer.locator(this.errorMsgSpan).first();
  }

  getMidNameFieldError(): Locator {
    return this.midNameContainer.locator(this.errorMsgSpan).first();
  }

  getEmployeeIdFieldError(): Locator {
    return this.employeeIDContainer.locator(this.errorMsgSpan).first();
  }

  getProfilePhotoLoadError(): Locator {
    return this.profilePhotoContainer.locator(this.errorMsgSpan);
  }

  getUsernameFieldError(): Locator {
    return this.userNameContainer.locator(this.errorMsgSpan);
  }

  getPasswordFieldError(): Locator {
    return this.passwordContainer.locator(this.errorMsgSpan);
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

  async fillUserName(name: string): Promise<void> {
    await this.userNameInput.fill(name);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  async fillConfirmPassword(value: string): Promise<void> {
    await this.confirmPasswordInput.fill(value);
  }

  async attachProfilePhoto(pathToFile: string): Promise<void> {       
        await this.page.getByRole('button', { name: 'Choose File' }).setInputFiles(pathToFile);
  }

  async clickCreateLoginDetails() {    
    const createLoginCheckbox = this.createLoginSwitchContainer.locator('.oxd-switch-wrapper');
    await createLoginCheckbox.click();
  }

  getLabelInCreateLoginForm(text: string): Locator {
    const regEx = new RegExp(text, 'i');//case insenstive matches
    return this.createLoginContainer.locator('.oxd-form-row .oxd-label').filter({hasText: regEx});
  }

  getLoginStatusInput(option: string): Locator {
    const regEx = new RegExp(option, 'i');//case insensitive matches
    return this.loginStatusContainer.locator('.oxd-radio-wrapper').filter({hasText: regEx}).locator('input[type="radio"]');;
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }
}
