import { Locator, Page } from "@playwright/test";

export default class UserMenu {
    private loggedInPage:Page;
    private dropDownLocatorString: string = '#app header span[class*="userdropdown"]';

    constructor(page:Page) {
        this.loggedInPage = page;
    }

    async logOut() {
        const userDropDown:Locator = this.loggedInPage.locator(this.dropDownLocatorString);
        await userDropDown.click();    

        const logoutBtn:Locator = this.loggedInPage.getByRole('menuitem').filter({hasText: 'Logout'});
        await logoutBtn.click();
    }
}