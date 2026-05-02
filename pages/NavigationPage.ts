import { Locator, Page } from "../tests/base";

export class NavigationPage {
  private readonly page: Page;
  private readonly pimNavItem: Locator;

  constructor(page: Page) {
    this.page = page;    
    /*has fallback option to the primary locator. When app language text is changed, it uses fall back */
    this.pimNavItem = page
      .locator('a:has-text("PIM")')
      .or(page.locator('a[href*="viewpim" i]'));//ignore case
  }

  getPimNavItem(): Locator {
    return this.pimNavItem;
  }

  async navigateToPim(): Promise<void> {
    await this.pimNavItem.click();
  }
}
