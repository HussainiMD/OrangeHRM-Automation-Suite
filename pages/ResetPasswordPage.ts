import { Page, Response, Locator, expect } from "../tests/base";

export default class ResetPasswordPage {
    private page: Page;

    private constructor(page: Page) {
        this.page = page;        
    }

    static async create(page:Page, url: string): Promise<ResetPasswordPage> {
        const instance: ResetPasswordPage = new ResetPasswordPage(page);
        await instance.navigateToPasswordResetPage(url);
        return instance;
    }

    private async navigateToPasswordResetPage(url: string) {
        const response: Response | null = await this.page.goto(url);
        if(!response || !response.ok()) 
            throw new Error(`Unable to navigate to page (${url}) for accessing reset password page`);
    }

    async submitNewPassword(pwd: string) {        
        const newPasswordLocator: Locator = this.page.locator(`.oxd-form input[name='password']`);
        await expect(newPasswordLocator).toBeEnabled();
        await newPasswordLocator.fill(pwd);

        const confirmPasswordLocator: Locator = this.page.locator(`.oxd-form input[name='confirmPassword']`);
        await expect(confirmPasswordLocator).toBeEnabled();
        await confirmPasswordLocator.fill(pwd);

        const saveBtnLocator: Locator = this.page.locator(`.oxd-form .orangehrm-forgot-password-buttons > button[type='submit']`);
        await expect(saveBtnLocator).toBeEnabled();        
        await saveBtnLocator.click()
    }
}