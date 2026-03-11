import { Page, Locator } from "../tests/base";

export default class ForgotPasswordPage {    
    private page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async navigateToResetPasswordPage() {        
        const loginForgotLocator: Locator = this.page.locator('.oxd-form .orangehrm-login-forgot');
        await loginForgotLocator.click();        
    }

    async doPasswordResetFor(username: string) {        
        const userNameLocator: Locator = this.page.locator('.oxd-form input[name="username"]');
        await userNameLocator.fill(username);
        const resetBtnLocator: Locator = this.page.locator('.orangehrm-forgot-password-button-container > .orangehrm-forgot-password-button--reset');
        await resetBtnLocator.click();
    }

}