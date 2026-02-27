import {test as base, BrowserContext, Page, Response, APIRequestContext, request, APIResponse } from "@playwright/test";
import fs from "fs";

const authJsonPath:string = `./storage/admin-auth-${process.pid}.json`;
let isAuthLockMonitorStarted:boolean = false;


/** Logic below can be better understood if we look at context:
 *  For a given worker thread, we should have ONLY one AUTH token. Even expired token management should not voilate this rule   
 *  To avoid race condition/duplicate execution of refreshing token, we are using isAuthLockMonitorStarted flag
 * @returns void/notihing
 */

async function refreshAdminAuthState():Promise<void> {     
    if(!isAuthLockMonitorStarted) isAuthLockMonitorStarted = true;
    console.log(`PID: ${process.pid} - Starting the process for a new Auth token`);
    
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
                username: process.env.userid ?? '',
                password: process.env.password ?? ''
            }
        })
        if(!validateAPIResponse.ok())         
            throw new Error('Validate API call failed. Cannot get an active authenticated context');
        const authResponseText: string = await validateAPIResponse.text();
        if((/[:]error/).test(authResponseText))         
            throw new Error('unable to do auth validation');
        await apiReqContext.storageState({path: authJsonPath});        
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
        const apiRequestContext:APIRequestContext = await request.newContext({
            baseURL: process.env.base_URL,
            storageState: authJsonPath
        });

        /** This API call will fail if made from expired/non authenticated context. 
         * We are fetching only 1 record (limit=1) for FASTER execution 
         * Below logic is a PRO-ACTIVE step instead of REACTIVE with interception of response. It helps avoiding failure of tests.
         */
        const apiResponse:APIResponse = await apiRequestContext.get('/web/index.php/api/v2/admin/users?limit=1');

        const apiRespStatus:number = apiResponse.status();        
        console.log(`PID: ${process.pid} - Got response code ${apiRespStatus} while accessing URL-${apiResponse.url()}`);
        
        apiRequestContext.dispose(); // no need to do "await" as we trust it to happen. This helps increase script execution time
        return apiRespStatus;
}



/**
 * This will verify if the existing auth context is still active & valid.
 * If not, then it will refresh the auth before returning the auth json location
 * @returns a string with value of path referring the pre authenticated json
 */
export async function getValidAuthJSONPath(): Promise<string> {   
    let isAuthNeeded: boolean = true;

    if(fs.existsSync(authJsonPath)) { 
        const apiRespStatus = await getExistingAuthValidationCode();
        if(apiRespStatus == 200) isAuthNeeded = false;
        else console.log('Doing Re-Auth as current authentication (context) expired');
    }

    if(isAuthNeeded) {        
        try {
            await refreshAdminAuthState();                
        } catch(err) {
            console.log(err);
            throw err;
        } 
    } else console.log('No need of Auth as current authentication is valid');

    return authJsonPath;
}

