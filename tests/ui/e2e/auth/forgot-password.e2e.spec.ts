import {test} from "../../../base";
import { configureEmailWithSMTP, resetEmailConfiguration, addTestEmailToTestEmployee } from "../../../../utils/email-manager.util";
import ForgotPasswordPage from "../../../../pages/ForgotPasswordPage";

test.beforeAll(async _ =>{
    await configureEmailWithSMTP();
    await addTestEmailToTestEmployee();
});


test('End to End test case of password reset/recovery using forgot password feature', async ({page, logger}) => {
    logger.info('E2E test started');
    await page.goto('/web/index.php/auth/login');

    const forgotPasswordPage: ForgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.navigateToResetPasswordPage();
    await forgotPasswordPage.doPasswordResetFor(process.env?.ess_user_name ?? 'whosaini')
    await page.pause();
});


test.afterAll(resetEmailConfiguration);