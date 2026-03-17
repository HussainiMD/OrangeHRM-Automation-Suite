import { Page, Locator, Response, expect } from "../tests/base";

export default class ForgotPasswordPage {    
    private page: Page;    

    private constructor(page: Page) { //private as we want to block new operator
        this.page = page;        
    }

    static async create(page: Page): Promise<ForgotPasswordPage> {
        const instance: ForgotPasswordPage = new ForgotPasswordPage(page);
        await instance.navigateToLoginPage();
        return instance
    }

    private async navigateToLoginPage(): Promise<void> {
        const response: Response | null = await this.page.goto('/web/index.php/auth/login');
        if(!response || !response.ok()) 
            throw new Error(`Unable to navigate to login page for accessing forgot password link`);        
    }

    async navigateToResetPasswordPage() {                
        const loginForgotLocator: Locator = this.page.locator('.oxd-form .orangehrm-login-forgot');
        await expect(loginForgotLocator).toBeEnabled();
        await loginForgotLocator.click();           
    }

    async doPasswordResetFor(username: string) {                
        const userNameLocator: Locator = this.page.locator('.oxd-form input[name="username"]');
        await expect(userNameLocator).toBeEnabled();
        await userNameLocator.fill(username);

        const resetBtnLocator: Locator = this.page.locator('.orangehrm-forgot-password-button-container > .orangehrm-forgot-password-button--reset');
        await expect(resetBtnLocator).toBeEnabled();
        await resetBtnLocator.click();
    }

}