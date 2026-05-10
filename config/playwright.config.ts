import { defineConfig, devices } from '@playwright/test';

const actionTimeout: number = parseInt(process.env.test_expect_timeout ?? '60000') * 1.5;
const navigationTimeout: number = parseInt(process.env.test_expect_timeout ?? '60000') * 1.5;
const timeout: number = parseInt(process.env.test_global_timeout ?? '90000') * 1.4;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: parseInt(process.env.test_global_timeout ?? '30000'),
  expect: {
    timeout: parseInt(process.env.test_expect_timeout ?? '30000') 
  },
  /*specify the tests location folder */
  testDir: '../tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry settings */
  retries: process.env.CI ? 2 : 1,
  /* parallel tests. */
  workers: process.env.CI ? 1 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['dot'], ['html', { open: 'never' }], ["allure-playwright",  { 
    resultsDir: "allure-results",
    detail: true,           // includes before/after hooks in the report
    suiteTitle: false,      // uses test title instead of file path as suite name
    environmentInfo: {      // shows up on the Allure overview page
        framework: "Playwright",
        node_version: process.version,
        os: process.platform,
    } 
  },]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch' ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'//crucial for UI test debugging when failures happen. !!! SUPER IMPORTANT !!!
  },
  globalSetup: '../apis/global-setup',
  globalTeardown: '../apis/global-cleanup',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'staging-chrome',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'staging-firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'staging-webkit',
      use: { ...devices['Desktop Safari'] ,
        // WebKit-specific overrides
        actionTimeout,    // per-action timeout (click, fill, etc.)
        navigationTimeout, // page.goto(), waitForURL(), etc        
      },
       // Test-level timeout — overrides the global `timeout` above
      timeout
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
