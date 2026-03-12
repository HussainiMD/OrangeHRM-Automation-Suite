import { APIRequestContext, APIResponse, Page} from "../tests/base";
import baseLogger from "./logger";
import { getValidAdminRequestContext } from "./auth-manager.utils";
import { getTestEmployeeNumber } from "./users-manager.util";

interface LeaveBalanceResponseType {
    data : {
        balance: {
            entitled: number,
            used: number,
            scheduled: number,
            pending: number,
            taken: number,
            balance: number
        }
    }
}


/**utitlity function to get leavetype id by using leave type name
 * @returns id (a number)
 */
function getLeaveTypeId(byName: string): number {
    if(!byName || typeof byName !== 'string' || byName.trim().length == 0) return -1;

    byName = byName.trim();

    switch(byName) {
        case 'US - Vacation': return 1
        case 'US - Personal': return 4
        case 'US - Maternity': return 5
        default: return -1
    }
}

/**utility function to get JSON data payload
 * @returns JSON object
 */
function getAddLeaveEntitlementJSON(employeeNumber: number, leaveCount: number) {
    const datenow = new Date();
    const fromDate: string = `${datenow.getFullYear()}-${datenow.getMonth()+1}-${datenow.getDate()}`;// +1 for month because in JS, month starts with 0
    const toDate: string = `${datenow.getFullYear()+1}-${datenow.getMonth()+1}-${datenow.getDate()}`;//one year from now
    const leaveTypeId: number = getLeaveTypeId('US - Personal'); //only US personal category being used for testing

    return {
        "empNumber": employeeNumber, 
        leaveTypeId , 
        fromDate, 
        toDate, 
        "entitlement": leaveCount //total number of leaves
    }
}


/**function to add leaves to an employee identified with employee number (not employee id which is provided by user)
 * @returns void
 */
async function addPersonalLeavesToEmployee(employeeNumber: number, leaveCount: number): Promise<void> {        
    const data = getAddLeaveEntitlementJSON(employeeNumber, leaveCount);
    baseLogger.info(`adding personal leaves data to employee #${employeeNumber} :: JSON - ${JSON.stringify(data)}`);

    const requestContext:APIRequestContext = await getValidAdminRequestContext();
    const apiResponse: APIResponse = 
        await requestContext.post('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements', {
            headers: {
                'Content-Type': 'application/json'
            },
            data
        });
    
    if(!apiResponse.ok()) {
        const msg: string = `Encountered an error while adding ${leaveCount} leaves to employee (${employeeNumber}) :: api status code - ${apiResponse.status()} & error details - ${await apiResponse.text()} `;
        baseLogger.warn(msg);
        throw new Error(msg);
    }

    baseLogger.info(`Added ${leaveCount} leaves to the emploee (${employeeNumber}) :: API Response status - ${apiResponse.statusText()}`);
}


/**To the base user for testing purpose, this function is used to add leaves
 * @returns void
 */
async function addPersonalLeavesToBaseEmployee(leaveCount: number): Promise<void> {        
    const employeeNumber: number = getTestEmployeeNumber();
    await addPersonalLeavesToEmployee(employeeNumber, leaveCount);
}


/**This is a function which return the balance leaves of a user.
 * For now, we are using only 'US - Personal' category leaves for testing
 * Unlike other functions, this API can be called by using USER context (instead of ADMIN context)
 * Due to this we are expecting test case functions to provide current page object.
 * Using page object, we will get APIRequestContext to make API calls of get/post..etc
 * @returns number (representing balance count of leaves)
 */
async function getCurrentLeavesBalanceCount(page: Page): Promise<number> {
   const getBalanceAPIResponse: APIResponse = await page.request.get('web/index.php/api/v2/leave/leave-balance/leave-type/4');
   if(!getBalanceAPIResponse.ok()) throw new Error(`Unable to get leave balance from API. Response code - ${getBalanceAPIResponse.status()} and text - ${await getBalanceAPIResponse.text()}`);

   const leaveBalance : LeaveBalanceResponseType = await getBalanceAPIResponse.json();

   return leaveBalance.data.balance.balance; 
}


export {addPersonalLeavesToEmployee, addPersonalLeavesToBaseEmployee, getCurrentLeavesBalanceCount} 