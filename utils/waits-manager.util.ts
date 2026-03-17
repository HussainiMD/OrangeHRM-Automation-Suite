import baseLogger from "./logger";

interface RetryOptions<TResult> {
    delayMs?: number;
    maxTries?: number;
    validate?: (result: TResult) => boolean;
}

class MaxRetriesExceededError extends Error {
    constructor(attempts: number) {
        super(`doRetriedPolling: all ${attempts} attempt(s) failed`);
        this.name = "MaxRetriesExceededError";
    }
}

/**This is a GNERIC utitlity function which is a custom implementation of periodic retries untill max attempts are done
 * This function is a replacement for arbitrary playwright function "waitForTimeout"
 * All retry options are  optional. Including validate function. By defaul it checks that result is not null 
 * Courtesy: done with help of claude code as sometimes typescript syntax becomes clumbsy for me
 */
export async function doRetriedPolling<TArgs extends unknown[], TResult>
    ( 
        execFn: (...args: TArgs) => Promise<TResult> | TResult, //first argument
        fnArgs: TArgs, //second argument
        //thrid argument, an object so sequence does NOT matter which otherwise makes code buggy
        { delayMs = 1000, maxTries = 1, validate = (r: TResult) => r != null }: RetryOptions<TResult> = {} 
    ): Promise<TResult> 
{ //function body starts here...
    for (let attempt = 0; attempt < maxTries; attempt++) {
        try {
            const result = await execFn(...fnArgs);  // <-- args spread here
            if (!validate(result)) throw new Error("Result did not pass validation");
            return result;
        } catch (err) {
            const attemptsLeft = maxTries - attempt - 1;
            baseLogger.warn(
                `doRetriedPolling: attempt ${attempt + 1}/${maxTries} failed. ` +
                `${attemptsLeft > 0 ? `Retrying in ${delayMs}ms...` : "No retries left."} Error: ${err}`
            );
            if (attemptsLeft > 0) await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    throw new MaxRetriesExceededError(maxTries);
}