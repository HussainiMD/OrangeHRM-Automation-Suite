import {test as base, TestInfo, BrowserContext} from "@playwright/test";
import pino from "pino";
import baseLogger from "../utils/logger";
import path from "path";
import fs from "fs";
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { EmployeeDetailsType } from "../utils/types/EmployeeDetailsType";

/**This is a base test object which over rides the playwright test
 * It is used to add cross cutting concerns like logging
 * Though implementation is a fixture, it is treated as base test object, hence it is placed under tests folder
 */

interface LoggerType {
    logger: pino.Logger
}

// Automatic fixture runs for every test.
type InternalFixtures = {
  applyAllureAnnotations: void;
};

const createTestLogger = (testInfo: TestInfo) =>
  baseLogger.child({
    worker: testInfo.workerIndex,
    test: testInfo.title,
    retry: testInfo.retry,
    file: testInfo.file,
  });

const TEST_EMPLOYEES_DIR = path.join(process.env.test_employee_dir ?? 'storage');
/**
 * Attaches an employee-creation response interceptor to the given context.
 * Must be called on the ACTUAL context being used by the test — not the default Playwright one.
 */
export const attachEmployeeInterceptor = (context: BrowserContext, testInfo: TestInfo) => {
  const filePath = path.join(TEST_EMPLOYEES_DIR, `employees-worker-${testInfo.workerIndex}.ndjson`);
  const seenEmployeeIDs = new Set<string>();

  context.on('response', (response) => {
    (async () => {
      const url = response.url();
      const method = response.request().method();

      if (!url.includes('pim/employees') || method !== 'POST') return;
      if (!response.ok()) return;

      let body: any;
      try {
        body = await response.json();
      } catch {
        baseLogger.warn(`Add Employee interceptor - Non-JSON response: ${url}`);
        return;
      }

      const empNumber = body?.data?.empNumber;
      const employeeId = body?.data?.employeeId;

      if (!empNumber) {
        baseLogger.warn(
          `Add Employee interceptor - Failed to extract employee ID: ${JSON.stringify({ url, body })}`
        );
        return;
      }

      if (seenEmployeeIDs.has(empNumber)) return;
      seenEmployeeIDs.add(empNumber);

      const record:EmployeeDetailsType = {        
        empNumber,
        employeeId,
        test: testInfo.title,        
        timestamp: Date.now()
      };

      fs.appendFileSync(filePath, JSON.stringify(record) + '\n');
      baseLogger.info(`Add Employee interceptor - captured (backend) employee number: ${empNumber} & employee ID: ${employeeId}`);
    })().catch((err) => {
      baseLogger.warn(err, 'Add Employee interceptor - Unexpected error');
    });
  });
};


const test = base.extend<LoggerType & InternalFixtures>({
    logger: async ({}, use, testInfo: TestInfo) => {        
        await use(createTestLogger(testInfo));        
    },

  // Automatically applies Playwright annotations to Allure.
  applyAllureAnnotations: [
    async ({}, use, testInfo) => {
      for (const annotation of testInfo.annotations) {
        const value = annotation.description?.trim();
        if (!value) continue;

        switch (annotation.type) {
          case 'epic':
            await allure.epic(value);
            break;

          case 'feature':
            await allure.feature(value);
            break;

          case 'story':
            await allure.story(value);
            break;

          case 'suite':
            await allure.suite(value);
            break;

          case 'parentSuite':
            await allure.parentSuite(value);
            break;

          case 'subSuite':
            await allure.subSuite(value);
            break;

          case 'description':
            await allure.description(value);
            break;

          case 'severity': {
            const severityMap: Record<string, Severity> = {
              blocker: Severity.BLOCKER,
              critical: Severity.CRITICAL,
              normal: Severity.NORMAL,
              minor: Severity.MINOR,
              trivial: Severity.TRIVIAL,
            };

            await allure.severity(
              severityMap[value.toLowerCase()] ?? Severity.NORMAL
            );
            break;
          }

          // Playwright tags become annotations with type="tag"
          case 'tag':
            await allure.tags(value.replace(/^@/, ''));
            break;

          /* Any custom annotation becomes a custom Allure label
          Examples:
          { type: 'wcag', description: '2.1.1 Keyboard' }
          { type: 'testCaseId', description: 'TC_LOGIN_024' } */
          default:
            await allure.label(annotation.type, value);
            break;
        }
      }

      await use();
    },
    { auto: true },
  ],
})

/*export everything from playwright test package. On top of that add our extension on test object*/
export * from "@playwright/test"
export {test};