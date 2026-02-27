import { hostname } from "node:os";
import pino from "pino";

const logger = pino({
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
        bindings: (bindings) => ({ pid:bindings.pid, hostname: bindings.hostname })
    }
});

export default logger;