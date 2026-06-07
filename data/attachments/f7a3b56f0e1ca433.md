# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/admin/update-employee-validation.spec.ts >> TC_ADM_USER_STATUS_005 | Admin | User Management | Re-enabled user can log in successfully
- Location: tests/ui/regression/admin/update-employee-validation.spec.ts:145:1

# Error details

```
Error: Add user request has failed :: {"error":{"status":"422","message":"Invalid Parameter","data":{"invalidParamKeys":["empNumber"]}}}
```

# Test source

```ts
  56  |  * @returns number (employee number)
  57  |  */
  58  | const getTestEmployeeNumber = () => getTestEmployeeDetails().empNumber;
  59  | 
  60  | 
  61  | /**utility function which is to return employee ID (optional, user provided). 
  62  |  * @returns string
  63  |  */
  64  | const getTestEmployeeId = () => getTestEmployeeDetails().employeeId;
  65  | 
  66  | 
  67  | /**Here we will be adding a test employee 
  68  |  * @returns a record of employee
  69  | */
  70  | async function addTestEmployee(data:BasicEmployeeType): Promise<EmployeeType> {   
  71  |     //using admin credentials for operation
  72  |     const requestContext:APIRequestContext = await getValidAdminRequestContext();
  73  |     try {
  74  |         const addEmployeeResponse:APIResponse = await requestContext.post('/web/index.php/api/v2/pim/employees', {
  75  |                 headers: { 'Content-Type': 'application/json'},
  76  |                 data
  77  |             });
  78  |         
  79  |         baseLogger.info(`add test employee request status ${addEmployeeResponse.status()}`);
  80  | 
  81  |         if(!addEmployeeResponse.ok()) 
  82  |             throw new Error(`add test employee API returned response with status ${addEmployeeResponse.status()}`);
  83  | 
  84  |         const newEmployeeRecord:AddEmployeeResponseDataType = await addEmployeeResponse.json();                
  85  |         return newEmployeeRecord.data;        
  86  |     } catch(err) {
  87  |         baseLogger.warn('Unable to add test employee data to orange hrm');
  88  |         baseLogger.warn(err);
  89  |         throw err;
  90  |     }
  91  | }
  92  | 
  93  | 
  94  | /**This function helps to delete an employee by empNumber
  95  |  * If employee is deleted then all related users (login ids) will also be deleted.
  96  |  * This test suite uses this simple logic for clean up. All users are linked to SINGLE test employee.
  97  |  * @returns nothing/void. Throws exception if operation fails
  98  | */
  99  | async function deleteTestEmployee(empIds: Array<number>): Promise<void> {    
  100 |     if(!empIds || empIds.length ==0) {
  101 |         baseLogger.warn(`Got call for delete test employee with invalid IDs list - ${JSON.stringify(empIds)}`);
  102 |         return;
  103 |     }
  104 | 
  105 |     //using admin credentials for operation
  106 |     const apiRequestContext: APIRequestContext = await getValidAdminRequestContext();
  107 |     const apiResponse: APIResponse = await apiRequestContext.delete('/web/index.php/api/v2/pim/employees', {
  108 |             headers: { 'Content-Type': 'application/json'},
  109 |             data: {
  110 |                 ids: empIds
  111 |             }
  112 |         });
  113 | 
  114 |     baseLogger.info(`deleted employee(s) [ids:${empIds}] API call resulted in response code ${apiResponse.status()}`);
  115 | 
  116 |     if(!apiResponse.ok())
  117 |         throw new Error(`Delete Employees for IDs "${empIds}" has failed - status code: ${apiResponse.status()}. Here are the error details ${await apiResponse.text()}`);
  118 | }
  119 | 
  120 | 
  121 | /**This function helps to create a non admin (ESS) user
  122 |  * Whole test suite uses single test employee. But multiple user profiles linked to single test user. This is IMPORTANT to remember 
  123 |  * @returns a record of user
  124 | */
  125 | async function addNewESSUser(name: string, isEnabled:boolean = true) : Promise<UserType> {    
  126 |     //using admin credentials for operation
  127 |     const apiRequestContext:APIRequestContext = await getValidAdminRequestContext();
  128 |          
  129 |     const exists = await doesUserExists(name);
  130 |     baseLogger.info(`does "${name}" user exists? ${exists}`);
  131 |     if(exists) {
  132 |         const msg: string = `${name} user already exists. Each user name has to be unique. Please try with a different name`;
  133 |         baseLogger.warn(msg);
  134 |         throw new duplicateUserError(msg);
  135 |     }
  136 | 
  137 |     //extract employee number from file system, which is expected to be present before this code starts executes
  138 |     const testEmployeeNumber:number = getTestEmployeeNumber()
  139 |     baseLogger.info(`using employee number ${testEmployeeNumber} for adding new user`);  
  140 |     const password: string = process.env.ess_user_password ?? 'tester123';
  141 | 
  142 |     const addUserResp:APIResponse = await apiRequestContext.post(`/web/index.php/api/v2/admin/users`, {
  143 |         headers: {
  144 |             'Content-Type': 'application/json'
  145 |         },
  146 |         data: {
  147 |             "username": name,
  148 |             password,
  149 |             "status": isEnabled,
  150 |             "userRoleId": 2,
  151 |             "empNumber": testEmployeeNumber
  152 |         }
  153 |     });
  154 | 
  155 |     baseLogger.info(`add user request API response status is ${addUserResp.status()}`);
> 156 |     if(!addUserResp.ok()) throw new Error(`Add user request has failed :: ${await addUserResp.text()}`);
      |                                 ^ Error: Add user request has failed :: {"error":{"status":"422","message":"Invalid Parameter","data":{"invalidParamKeys":["empNumber"]}}}
  157 |     
  158 |     return {
  159 |         name,
  160 |         password
  161 |     } 
  162 | }
  163 | 
  164 | 
  165 | /**A function to check if the user exists in the backend
  166 |  * @returns a boolean result
  167 | */
  168 | async function doesUserExists(name: string): Promise<boolean> {     
  169 |     //using admin credentials for operation
  170 |     const apiRequestContext:APIRequestContext = await getValidAdminRequestContext();  
  171 |     try {
  172 |         const apiResponse:APIResponse = await apiRequestContext.get(`/web/index.php/api/v2/admin/users?limit=50&offset=0&username=${name}&sortField=u.userName&sortOrder=ASC`);
  173 |                 
  174 |         if(!apiResponse.ok()) return false;
  175 | 
  176 |         const searchResult: SearchUserResponseMetaDataType = await apiResponse.json();       
  177 |         const totalMatchCount:number = searchResult.meta.total;
  178 | 
  179 |         const areMatchesFound: boolean = totalMatchCount > 0;
  180 |         return areMatchesFound;
  181 | 
  182 |     } catch(err) {
  183 |         baseLogger.warn(err);
  184 |         return false;
  185 |     }    
  186 | 
  187 | }
  188 | 
  189 | 
  190 | function getESSUserCredentials(): credentials {
  191 |     const username: string = process.env.ess_user_name ?? "";
  192 |     const password: string = process.env.ess_user_password ?? "";
  193 | 
  194 |     return { username, password};
  195 | }
  196 | 
  197 | 
  198 | export {getTestEmployeeDataFilePath, getTestEmployeeNumber, getTestEmployeeId, getESSUserCredentials, addTestEmployee, deleteTestEmployee, addNewESSUser} 
```