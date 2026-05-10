# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/pim/add-employee-validation.spec.ts >> PIM Module - Add Employee Form Validation >> TC_PIM_USER_ADD_006 - Add New User Form Validation - Verify auto populated Employee ID field is editable
- Location: tests/ui/regression/pim/add-employee-validation.spec.ts:155:3

# Error details

```
Error: Not able to access the LOGIN page of AUT
```

# Test source

```ts
  1   | import fs from "fs";
  2   | import { APIRequestContext, APIResponse, request } from "../tests/base";
  3   | import baseLogger from "./logger";
  4   | 
  5   | const baseURL:string = process.env.base_url ?? 'https://opensource-demo.orangehrmlive.com';
  6   | const adminAuthJsonPath: string = `./storage/admin-auth-${process.pid}.json`;
  7   | let isAuthLockMonitorStarted: boolean = false;
  8   | let globalAPIRequestContext: APIRequestContext;
  9   | 
  10  | /** Logic below can be better understood if we look at context:
  11  |  *  For a given worker thread, we should have ONLY one AUTH token. Even expired token management should not voilate this rule   
  12  |  *  To avoid race condition/duplicate execution of refreshing token, we are using isAuthLockMonitorStarted flag
  13  |  * @returns void/notihing
  14  |  */
  15  | 
  16  | async function refreshAdminAuthState(): Promise<void> {     
  17  |     if(isAuthLockMonitorStarted) return;
  18  |     
  19  |     isAuthLockMonitorStarted = true;
  20  |     baseLogger.info(`PID: ${process.pid} - Starting the process for a new Auth token`);
  21  |     
  22  |     const apiReqContext: APIRequestContext = await request.newContext({
  23  |          baseURL,
  24  |          timeout: parseInt(process.env.api_timeout ?? '30000')      
  25  |     });
  26  | 
  27  |     try {
  28  |         const loginPageAPIResponse: APIResponse = await apiReqContext.get('/web/index.php/auth/login');
  29  |         if(!loginPageAPIResponse.ok())         
> 30  |             throw new Error('Not able to access the LOGIN page of AUT');
      |                   ^ Error: Not able to access the LOGIN page of AUT
  31  |         
  32  |         const responseHTML:string = await loginPageAPIResponse.text();
  33  |         const csrfTokenMatches:RegExpMatchArray | null= responseHTML.match(/[:]token="&quot;(.+)&quot;"/i);
  34  |         if(!csrfTokenMatches || csrfTokenMatches.length < 2)         
  35  |             throw new Error('Unable to proceed with request as CSRF TOKEN is NOT found in response HTML text');    
  36  |         
  37  |         const csrfToken: string = csrfTokenMatches[1];
  38  |         const validateAPIResponse : APIResponse = await apiReqContext.post('/web/index.php/auth/validate', {
  39  |             form: {
  40  |                 _token: csrfToken,//needs CSRF token for API
  41  |                 username: process.env.admin_user_name ?? '',
  42  |                 password: process.env.admin_password ?? ''
  43  |             }
  44  |         })
  45  |         if(!validateAPIResponse.ok())         
  46  |             throw new Error('Validate API call failed. Cannot get an active authenticated context');
  47  |         const authResponseText: string = await validateAPIResponse.text();
  48  |         if((/[:]error/).test(authResponseText))         
  49  |             throw new Error('unable to do auth validation');
  50  |         await apiReqContext.storageState({path: adminAuthJsonPath});        
  51  |     }  finally {        
  52  |         isAuthLockMonitorStarted = false;
  53  |         await apiReqContext.dispose();        
  54  |     }
  55  | }
  56  | 
  57  | 
  58  | /**
  59  |  * a function to verify existing auth to be valid by a sample api
  60  |  * @returns status code of api response
  61  |  */
  62  | 
  63  | async function getExistingAuthValidationCode(): Promise<number> {
  64  |         /** This API call will fail if made from expired/non authenticated context. 
  65  |          * We are fetching only 1 record (limit=1) for FASTER execution 
  66  |          * Below logic is a PRO-ACTIVE step instead of REACTIVE with interception of response. It helps avoiding failure of tests.
  67  |          */
  68  |         try {
  69  |             const apiResponse:APIResponse = await globalAPIRequestContext.get('/web/index.php/api/v2/admin/users?limit=1');
  70  | 
  71  |             const apiRespStatus:number = apiResponse.status();        
  72  |             baseLogger.info(`PID: ${process.pid} - Got response code ${apiRespStatus} while accessing URL-${apiResponse.url()}`);
  73  |                     
  74  |             return apiRespStatus;
  75  |         } catch(err) {
  76  |             baseLogger.warn(err);
  77  |             return 409;
  78  |         }
  79  | }
  80  | 
  81  | 
  82  | /*add or update the local-global context */
  83  | async function addUpdateContext() {
  84  |     baseLogger.info(`Refreshing local globalAPIRequestContext reference`);
  85  |     globalAPIRequestContext = await request.newContext({
  86  |             baseURL,
  87  |             storageState: adminAuthJsonPath,
  88  |             timeout: parseInt(process.env.api_timeout ?? '30000')
  89  |     });
  90  | }
  91  | 
  92  | /*clean up*/
  93  | export async function disposeAdminContext() {
  94  |     if(globalAPIRequestContext) {
  95  |         baseLogger.info(`Going to dispose of the Admin User Context`);
  96  |         await globalAPIRequestContext.dispose();
  97  |     }
  98  | }
  99  | 
  100 | 
  101 | 
  102 | /**
  103 |  * This will verify if the existing auth context is still active & valid.
  104 |  * If not, then it will refresh the auth before returning the context
  105 |  * @returns a valid APIRequestContext
  106 |  */
  107 | export async function getValidAdminRequestContext(): Promise<APIRequestContext> {   
  108 |     let isAuthNeeded: boolean = true;
  109 | 
  110 |     if(fs.existsSync(adminAuthJsonPath)) { 
  111 |         baseLogger.info(`found admin auth json path: ${adminAuthJsonPath}`);
  112 |         if(!globalAPIRequestContext) await addUpdateContext();
  113 |         const apiRespStatus = await getExistingAuthValidationCode();
  114 |         if(apiRespStatus == 200) isAuthNeeded = false;
  115 |         else baseLogger.info('Doing Re-Auth as current authentication (context) expired');
  116 |     }
  117 | 
  118 |     if(isAuthNeeded) {        
  119 |         try {
  120 |             /*dispose & create a fresh context */ 
  121 |             await disposeAdminContext();
  122 |             await refreshAdminAuthState();               
  123 |             await addUpdateContext();           
  124 |         } catch(err) {
  125 |             baseLogger.warn(err);
  126 |             throw err;
  127 |         } 
  128 |     } else baseLogger.info('No need of Auth as current authentication is valid');
  129 | 
  130 |     return globalAPIRequestContext;
```