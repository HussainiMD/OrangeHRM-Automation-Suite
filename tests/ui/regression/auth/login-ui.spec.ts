import {test, expect, Response, Locator} from "../../../base";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_018
 * Verifies if the sensitive information like password is hidden. Not shown as plain text on web page
 * Indirect way of testing. HTML element with type password are automatically masked by browsers
 */
test('Is Password Field getting masked', async ({page}) => {
    const navResponse: Response | null = await page.goto('/web/index.php/auth/login');    
    expect(navResponse?.ok()).toBe(true);

    const passwordLocator: Locator = page.locator('input[name="password"]');    

    await expect(passwordLocator).toHaveAttribute('type', 'password');
})