import { Locator, Page } from "../tests/base";

export class PimEmployeeListPage {
  private readonly page: Page;
  private readonly addEmployeeButton: Locator;
  private readonly employeeListButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEmployeeButton = page.locator("text=Add Employee");
    this.employeeListButton = page.locator("text=Employee List");
  }

  getAddEmployeeButton(): Locator {
    return this.addEmployeeButton;
  }

  getEmployeeListButton(): Locator {
    return this.employeeListButton;
  }

  async navigateToAddEmployee(): Promise<void> {
    await this.addEmployeeButton.click();
  }
}
