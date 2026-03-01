import {test as base, TestInfo} from "@playwright/test";
import pino from "pino";
import baseLogger from "../utils/logger";

/**This is a base test object which over rides the playwright test
 * It is used to add cross cutting concerns like logging
 * Though implementation is a fixture, it is treated as base test object, hence it is placed under tests folder
 */

interface LoggerType {
    logger: pino.Logger
}

const createTestLogger = (testInfo: TestInfo) =>
  baseLogger.child({
    worker: testInfo.workerIndex,
    test: testInfo.title,
    retry: testInfo.retry,
    file: testInfo.file,
  });

const test = base.extend<LoggerType>({
    logger: async ({}, use, testInfo: TestInfo) => {        
        await use(createTestLogger(testInfo));        
    }
})

/*export everything from playwright test package. On top of that add our extension on test object*/
export * from "@playwright/test"
export {test};