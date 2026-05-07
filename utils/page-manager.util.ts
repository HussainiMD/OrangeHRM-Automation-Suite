import { BrowserContext, Browser} from '../tests/base';

const baseURL:string = process.env.base_url ?? 'https://opensource-demo.orangehrmlive.com';

export async function getFreshcontextPage(browser: Browser) {
    const freshContext: BrowserContext = await browser.newContext({baseURL});
    return freshContext.newPage();
}