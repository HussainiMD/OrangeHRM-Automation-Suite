
import { APIRequestContext, request, APIResponse } from "@playwright/test";
import * as fs from "fs";
import path from "path";

const lockFilePath: string = path.join('storage', '.auth-manager-global.lock');
const errorMsgFilePath: string = path.join('storage', '.auth-manager-global.error');

const resolvers: Array<Function> = [];
const rejectors: Array<Function> = [];

let isAuthLockMonitorStarted:boolean = false;

/** Logic below can be better understood if we look at context:
 *  For a given machine, we should have ONLY one AUTH token. Even expired token management should not voilate this rule
 *  As playwright by default uses parellel execution which means tests can run in isolation due to workers
 *  We need to communicate across worker process about state of token refreshment process through File System (locks)
 *  Here is the detailed process
 *  1. whoever is asking to refresh token, we are promising them (let them wait and we will notify status - success/error)
 *  2. A lock file is created as soon as refresh token is started and subsequently removed
 *  3. In case of error, an error file is created. Otherwise by default it is assumed refresh of token is successful
 *  4. Above 2 steps are for inter worker communication but within a worker there can be multiple tests waiting for refresh token status
 *  5. To communicate across tests within worker, we are using a central monitor which will keep checking lock file
 *  6. Once lock file is released, monitor will verify status of token refreshment process and then then notify tests about error or success
 */
export async function refreshAdminAuthState() {    
    /*call only if lock file does not exist. Avoid RACE conditions*/
    if(!fs.existsSync(lockFilePath))         
        doRefreshAdminAuthState();
    
    /*Only ONCE per worker, lock monitor should be running */
    if(!isAuthLockMonitorStarted) {
        startAuthLockMonitor();
        isAuthLockMonitorStarted = true;
    }
    
    /*whoever calls for refresh auth will get a promise */
    return new Promise((resolve, reject) => {
            resolvers.push(resolve);
            rejectors.push(reject);
    })    
}

async function doRefreshAdminAuthState() { 
    /*Cleaning last execution status if any */
    if(fs.existsSync(errorMsgFilePath))
        fs.unlinkSync(errorMsgFilePath);
    
    console.log('Creating the Lock File by Process ID-' + process.pid.toString());
    fs.writeFileSync(lockFilePath, `shared lock file used by playwright authentication manager - PID:${process.pid.toString()}`, {flag: 'wx'});   
    console.log('Starting the process to Refresh for a new Auth token');

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
    } catch(err: any) {

        console.log(err);
        fs.writeFileSync(errorMsgFilePath, `To signal playwright workers that authentication attempt has failed. PID-${process.pid.toString()}`, {flag: 'wx+'});   //wx+ means that we want file to be available exclusively for read and write. Fail operation if file exists     

    } finally {        
        
        apiReqContext.dispose();

        if(fs.existsSync(lockFilePath)) {
            console.log('Removing the Lock File by Process ID - ' + process.pid.toString());
            fs.unlinkSync(lockFilePath);     //unlink is a safer way to delete file (means delete only when no process reads)
        } else console.log('Lock file is expected to EXIST but NOT found by Process ID - ' + process.pid.toString());   

    }
}


/*This is a monitor used at a WORKER level. Only ONE monitor should run */
function startAuthLockMonitor() {
   const timerId = setInterval(()=> {
        if(!fs.existsSync(lockFilePath)) {
            if(fs.existsSync(errorMsgFilePath)) notifyError('something failed, please check logs for details');
            else notifySuccess();
            isAuthLockMonitorStarted = false;
            console.log(`clearing timer ${timerId}`);
            clearInterval(timerId);
        } else console.log(`Process (${process.pid.toString()}) still waiting for lock to be released`);
    }, 1000)
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