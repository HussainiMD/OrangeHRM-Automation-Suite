import fs from "fs";
import { APIRequestContext, APIResponse, request } from "../tests/base";
import baseLogger from "./logger";

const adminAuthJsonPath: string = `./storage/admin-auth-${process.pid}.json`;
let isAuthLockMonitorStarted: boolean = false;
let globalAPIRequestContext: APIRequestContext;

/** Logic below can be better understood if we look at context:
 *  For a given worker thread, we should have ONLY one AUTH token. Even expired token management should not voilate this rule   
 *  To avoid race condition/duplicate execution of refreshing token, we are using isAuthLockMonitorStarted flag
 * @returns void/notihing
 */

async function refreshAdminAuthState(): Promise<void> {     
    if(isAuthLockMonitorStarted) return;
    
    isAuthLockMonitorStarted = true;
    baseLogger.info(`PID: ${process.pid} - Starting the process for a new Auth token`);
    
    const apiReqContext: APIRequestContext = await request.newContext({
         baseURL: process.env.base_url        
    });

    try {
        const loginPageAPIResponse: APIResponse = await apiReqContext.get('/web/index.php/auth/login');
        if(!loginPageAPIResponse.ok())         
            throw new Error('Not able to access the LOGIN page of AUT');
        
        const responseHTML:string = await loginPageAPIResponse.text();
        const csrfTokenMatches:RegExpMatchArray | null= responseHTML.match(/[:]token="&quot;(.+)&quot;"/i);
        if(!csrfTokenMatches || csrfTokenMatches.length < 2)         
            throw new Error('Unable to proceed with request as CSRF TOKEN is NOT found in response HTML text');    
        
        const csrfToken: string = csrfTokenMatches[1];
        const validateAPIResponse : APIResponse = await apiReqContext.post('/web/index.php/auth/validate', {
            form: {
                _token: csrfToken,//needs CSRF token for API
                username: process.env.admin_user_name ?? '',
                password: process.env.admin_password ?? ''
            }
        })
        if(!validateAPIResponse.ok())         
            throw new Error('Validate API call failed. Cannot get an active authenticated context');
        const authResponseText: string = await validateAPIResponse.text();
        if((/[:]error/).test(authResponseText))         
            throw new Error('unable to do auth validation');
        await apiReqContext.storageState({path: adminAuthJsonPath});        
    }  finally {        
        isAuthLockMonitorStarted = false;
        await apiReqContext.dispose();        
    }
}


/**
 * a function to verify existing auth to be valid by a sample api
 * @returns status code of api response
 */

async function getExistingAuthValidationCode(): Promise<number> {
        /** This API call will fail if made from expired/non authenticated context. 
         * We are fetching only 1 record (limit=1) for FASTER execution 
         * Below logic is a PRO-ACTIVE step instead of REACTIVE with interception of response. It helps avoiding failure of tests.
         */
        try {
            const apiResponse:APIResponse = await globalAPIRequestContext.get('/web/index.php/api/v2/admin/users?limit=1');

            const apiRespStatus:number = apiResponse.status();        
            baseLogger.info(`PID: ${process.pid} - Got response code ${apiRespStatus} while accessing URL-${apiResponse.url()}`);
                    
            return apiRespStatus;
        } catch(err) {
            baseLogger.warn(err);
            return 409;
        }
}


/*add or update the local-global context */
async function addUpdateContext() {
    baseLogger.info(`Refreshing local globalAPIRequestContext reference`);
    globalAPIRequestContext = await request.newContext({
            baseURL: process.env.base_URL,
            storageState: adminAuthJsonPath
    });
}

/*clean up*/
export async function disposeAdminContext() {
    if(globalAPIRequestContext) {
        baseLogger.info(`Going to dispose of the Admin User Context`);
        await globalAPIRequestContext.dispose();
    }
}



/**
 * This will verify if the existing auth context is still active & valid.
 * If not, then it will refresh the auth before returning the context
 * @returns a valid APIRequestContext
 */
export async function getValidAdminRequestContext(): Promise<APIRequestContext> {   
    let isAuthNeeded: boolean = true;

    if(fs.existsSync(adminAuthJsonPath)) { 
        baseLogger.info(`found admin auth json path: ${adminAuthJsonPath}`);
        if(!globalAPIRequestContext) await addUpdateContext();
        const apiRespStatus = await getExistingAuthValidationCode();
        if(apiRespStatus == 200) isAuthNeeded = false;
        else baseLogger.info('Doing Re-Auth as current authentication (context) expired');
    }

    if(isAuthNeeded) {        
        try {
            /*dispose & create a fresh context */ 
            await disposeAdminContext();
            await refreshAdminAuthState();               
            await addUpdateContext();           
        } catch(err) {
            baseLogger.warn(err);
            throw err;
        } 
    } else baseLogger.info('No need of Auth as current authentication is valid');

    return globalAPIRequestContext;
}

