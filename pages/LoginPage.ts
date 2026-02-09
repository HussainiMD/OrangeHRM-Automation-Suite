import {test, expect, Browser, chromium, Page, Response, Locator} from "@playwright/test";
import credentials from "../tests/types/credentials";


export default class LoginPage {
    private userNameSelector:string = 'input[name="username"]';
    private passwordSelector:string = 'input[name="password"]';
    private loginBtnSelector:string = '.orangehrm-login-action > button[type="submit"]';
    private page:Page;

    constructor(page:Page) {
        this.page = page;
    }

    async signInWithCredentials({username, password}: credentials) {        
        const userNameInput:Locator = this.page.locator(this.userNameSelector);
        await userNameInput.fill(username);

        const passwordInput:Locator = this.page.locator(this.passwordSelector);
        await passwordInput.fill(password);

        await this.page.waitForTimeout(2000);
        const loginBtn:Locator = this.page.locator(this.loginBtnSelector);
        await loginBtn.click();
        await this.page.waitForTimeout(2000);
    }



}




