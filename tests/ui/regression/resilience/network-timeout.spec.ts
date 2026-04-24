import {test, expect, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";

const username: string = process.env.ess_user_name??'';
const password: string = process.env.ess_user_password??'';

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_073
 * Verifies if app recovers from temporary network blips. App is expected to work normally without kicking out user
 */
test('network request is aborted cross-browser', async ({ page, logger }) => {

    // page.route() is supported on all browsers. 'failed' is the most portable
    await page.route('**/viewMyDetails', async route => {
        await new Promise(res => setTimeout(res, 5000)); // simulate latency
        await route.abort('failed');
        await page.unroute('**/viewMyDetails');//only for first time we want to simulate latency
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.signInWithCredentials({ username, password });

    const myInfoBtnLocator: Locator = page
        .locator('.oxd-sidepanel a.oxd-main-menu-item')
        .filter({ hasText: 'My Info' });

    await expect(myInfoBtnLocator, 'MyInfo button is not enabled').toBeEnabled();
    await myInfoBtnLocator.focus();

    const start: number = performance.now();

    /* Start listening BEFORE the click so the event is not missed.
     Promise.all races both: the click triggers the navigation → route intercepts
     it → aborts → requestfailed fires. This sequence works on all engines.
     waits for requestfailed event for 15 seconds. It will NOT look for all requestfailed events but with matching (returning true) predicated (function)*/
    const [failedRequest] = await Promise.all([
        page.waitForEvent('requestfailed', {
            predicate: req => req.url().includes('viewMyDetails'),
            timeout: 15_000,//underscore is modern js way to increase readability
        }),
        myInfoBtnLocator.click({ button: 'left' }),
    ]);

    const duration: number = performance.now() - start;
    logger.info(`Throttled page navigation response duration: ${duration} ms or ${(duration/1000).toFixed(2)} secs`);

    // failedRequest.failure() is non-null on all engines when a request is aborted.
    expect(
        failedRequest.failure()?.errorText,
        'Expected the viewMyDetails request to fail with a network error'
    ).toBeTruthy();

    // Route is unrouted inside the handler, so a reload fetches normally.
    await page.reload();

    // basic hi-level layout nav element verification to keep test agonostic to browser
    const layoutNav: Locator = page.locator('#app .oxd-layout-navigation');
    await expect(layoutNav).toHaveCount(1);

    await page.close();
});