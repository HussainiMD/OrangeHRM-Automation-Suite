import { APIRequestContext, request, APIResponse } from "@playwright/test";
import * as fs from "fs";
import path from "path";

const resolvers: Array<Function> = [];
const rejectors: Array<Function> = [];
let isRefreshInProgress:boolean = false;

/**This Auth manager is to keep a central role around auth token management
 * It works per worker (NodeJS process)
 * There could be multiple tests running in parallel failing due to auth & asking to refresh Auth
 * We want all of them to be waiting on a promise, which will be eventually be resolved or rejected based on refresh process result
 * To control, refresh process method is called only once for all the parallel tests, we are using a boolean control flag (isRefreshInProgress)
 */

export async function refreshAdminAuthState() {    

    /*If refreshing of auth token is not started, start it and it has to run only once at any point of time */
    if(!isRefreshInProgress) doRefreshAdminAuthState();
    
    /*whoever calls for refresh auth will get a promise */
    return new Promise((resolve, reject) => {
            resolvers.push(resolve);
            rejectors.push(reject);
    })    
}


async function doRefreshAdminAuthState() { 
    console.log('Starting the process to Refresh for a new Auth token');
    isRefreshInProgress = true;

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

        await apiReqContext.storageState({path: './storage/admin-auth.json'});        
        notifySuccess();
    } catch(err: any) {
        console.log(err);
        notifyError('Something went wrong while refreshing Auth token. Please inspect logs for details');
    } finally {       
        apiReqContext.dispose();        
        isRefreshInProgress = false;
    }
}


function notifySuccess() {
    resolvers.forEach(resolver => resolver());
    resetArrays();    
}

function notifyError(msg: string) {
    rejectors.forEach(rejector => rejector(msg));
    resetArrays();
}

function resetArrays() {
    resolvers.length = 0;    
    rejectors.length = 0;
}