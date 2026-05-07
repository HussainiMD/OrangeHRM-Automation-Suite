import { Locator, Page } from "../tests/base";

export class NavigationPage {
  private readonly page: Page;
  private readonly pimNavItem: Locator;
  private readonly adminNavItem: Locator;

  constructor(page: Page) {
    this.page = page;    
    /*has fallback option to the primary locator. When app language text is changed, it uses fall back */
    this.pimNavItem = page.locator('a:has-text("PIM")').or(page.locator('a[href*="viewpim" i]'));//ignore case
    this.adminNavItem = page.locator('a:has-text("Admin")').or(page.locator('a[href*="viewAdmin" i]'));//ignore case
  }

  getPimNavItem(): Locator {
    return this.pimNavItem;
  }

  getAdminNavItem(): Locator {
    return this.adminNavItem;
  }

  async navigateToPim(): Promise<void> {
    await this.pimNavItem.click();
  }

  async navigateToAdmin(): Promise<void> {
    await this.adminNavItem.click();
  }

}
