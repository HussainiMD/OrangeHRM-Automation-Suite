import { Locator, Page, Response, expect } from "../tests/base";
import credentials from "../tests/types/credentials";

export default class LoginPage {
    private userNameSelector:string = 'input[name="username"]';
    private passwordSelector:string = 'input[name="password"]';
    private loginBtnSelector:string = '.orangehrm-login-action > button[type="submit"]';
    private topbarHeader:string = '.oxd-topbar-header';
    private page:Page;

    constructor(page:Page) {
        this.page = page;
    }
 
   /*unlike other pages, we are making this optional. Because in many test scenarios, default redirection is to login page*/ 
   async navigateToLoginPage(): Promise<void> {
        const response: Response | null = await this.page.goto('/web/index.php/auth/login');
        if(!response || !response.ok()) 
            throw new Error(`Unable to navigate to login page`);        
    }
    

    async signInWithCredentials({username, password}: credentials) {        
        const userNameInput:Locator = this.page.locator(this.userNameSelector);
        await expect(userNameInput).toBeEnabled();
        await userNameInput.fill(username);

        const passwordInput:Locator = this.page.locator(this.passwordSelector);
        await expect(passwordInput).toBeEnabled();
        await passwordInput.fill(password);

        const loginBtn:Locator = this.page.locator(this.loginBtnSelector);
        await expect(loginBtn).toBeEnabled();
        await loginBtn.click();
        await this.page.waitForLoadState("domcontentloaded");
        
        const topHeaderLocator: Locator = this.page.locator(this.topbarHeader);
        await expect(topHeaderLocator).toBeVisible();        
    }



}




