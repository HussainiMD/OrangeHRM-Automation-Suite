import pino from "pino";
import { TestInfo } from "@playwright/test";
import { worker } from "node:cluster";

pino.destination()

const baseLogger = pino(
    {
        level: 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
            level: (label) => ({ level: label.toUpperCase() }),
            bindings: (bindings) => ({ pid:bindings.pid, hostname: bindings.hostname })
        }
    },
    pino.transport({ //this is to logging on console and do some pretty printing
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss'
        }
    })
    /*and to enable file based logging on CI machine, we will use this option*
    pino.destination(`logs/run-${Date.now()}.log`)
    */
);

function createTestLogger(testinfo: TestInfo) {
    return baseLogger.child({
        worker: testinfo.workerIndex,
        test: testinfo.title,
        retry: testinfo.retry,
        file: testinfo.file
    })

}

export {baseLogger, createTestLogger};