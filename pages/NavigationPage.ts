import { Locator, Page } from "../tests/base";

export class NavigationPage {
  private readonly page: Page;
  private readonly pimNavItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pimNavItem = page.locator("text=PIM");
  }

  getPimNavItem(): Locator {
    return this.pimNavItem;
  }

  async navigateToPim(): Promise<void> {
    await this.pimNavItem.click();
  }
}
