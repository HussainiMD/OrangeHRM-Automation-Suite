import {test as base, BrowserContext, Page} from "../tests/base";

interface ESSUserType {
    essUserAuthContext: BrowserContext,
    essUserAuthPage: Page
}

const test = base.extend<ESSUserType>({
    essUserAuthContext: async ({browser}, use) => {
        browser.newContext()
    },
    essUserAuthPage: async ({essUserAuthContext}, use) => {}
})