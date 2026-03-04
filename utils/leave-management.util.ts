import {request, APIRequestContext, APIResponse} from "../tests/base";
import baseLogger from "./logger";
import { getValidAuthJSONPath } from "./auth-manager.utils";
import { getEmployeeDataFilePath } from "./users-manager.util";
import fs from "fs";

const baseURL: string = process.env.base_url ?? 'https://opensource-demo.orangehrmlive.com';

/**utility function to get JSON data payload
 * @returns JSON object
 */
function getLeaveEntitlementData(employeeNumber: number, leaveCount: number) {
    const datenow = new Date();
    const fromDate: string = `${datenow.getFullYear()}-${datenow.getMonth()+1}-${datenow.getDate()}`;
    const toDate: string = `${datenow.getFullYear()+1}-${datenow.getMonth()+1}-${datenow.getDate()}`;

    baseLogger.info(`from date:${fromDate} & to date:${toDate}`);

    return {
        "empNumber": employeeNumber, 
        "leaveTypeId": 4, //US-Personal
        fromDate, 
        toDate, 
        "entitlement": leaveCount //total number of leaves
    }
}


/**function to add leaves to an employee identified with employee number (not employee id which is provided by user)
 * @returns void
 */
async function addPersonalLeavesToEmployee(employeeNumber: number, leaveCount: number): Promise<void> {    
    const adminAuthJSONLocation: string = await getValidAuthJSONPath();
    const data = getLeaveEntitlementData(employeeNumber, leaveCount);
    
    const requestContext:APIRequestContext = await request.newContext({baseURL, storageState: adminAuthJSONLocation});
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
    const employeeDataFilePath: string = getEmployeeDataFilePath();
    const employeeData: string = fs.readFileSync(employeeDataFilePath, {encoding: 'utf-8'});
    const employeeDetails: JSON = JSON.parse(employeeData);
    
    const employeeNumber: number = employeeDetails?.employeeNumber;

    addPersonalLeavesToEmployee(employeeNumber, leaveCount);
}


export {addPersonalLeavesToEmployee, addPersonalLeavesToBaseEmployee} 