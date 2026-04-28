import fs from "fs";
import dotenv from "dotenv";
import * as validationsUtil from "../utils/env-validations.utils";
import { getTestEmployeeDataFilePath, addTestEmployee, addNewESSUser } from "../utils/users-manager.util";
import { addPersonalLeavesToBaseEmployee } from "../utils/leave-management.util";
import { doCleanUp } from "./global-cleanup";
import BasicEmployeeType from "../tests/types/BasicEmployeeType";
import EmployeeType from "../tests/types/EmployeeType";
import { EmployeeDetailsType } from "../utils/types/EmployeeDetailsType";
import { duplicateUserError } from "../tests/errors/duplicate-user-error";
import baseLogger from "../utils/logger";
import { randomInt } from "crypto";

dotenv.config({path: './autCred.env', debug: true, encoding: 'utf-8', override: true});

/** This is function to add a test employee which will be used to create user(s) across the test cases. 
 * Test Employee has to be present in orange hrm otherwise test cases will fail.
 * Both Employee ID and Employee number sounds similar but ID is user provided and optional. Where as employee number is auto generated.
 * So, to add a USER, employee number is mandatory.
 * We are creating test employee only once through global setup. Then sharing employee number through file system "employee data file path".
 * NOTE: Though we are doing add only once, there are chances that test employee gets deleted by orange hrm team's clean up cron job. We are ignoring that risk for now
 */
async function extractAndSaveTestEmployeeDetails(): Promise<void> {
    const employeeId = `${randomInt(1000, 10000)}`;//random 4 digit
    const newEmployeeData:BasicEmployeeType = {
                        "firstName": "playwright",
                        "middleName": "",
                        "lastName": "employee_007",
                        employeeId                 
    };

    const employeeDetails:EmployeeType = await addTestEmployee(newEmployeeData); 
    
    const employeeNumber = employeeDetails.empNumber;
    
    baseLogger.info(`Generated test employee details :: employee number - ${employeeNumber} & employee ID - ${employeeId}`);
    
    //put it in a file so that multiple worker threads can access data
    const employeeDataFilePath:string = getTestEmployeeDataFilePath();
    const data: EmployeeDetailsType = {employeeNumber, employeeId};
    fs.writeFileSync(employeeDataFilePath, JSON.stringify(data), {encoding:'utf-8'});
}


/*do clean up even when node js process exits unusually*/
function attachCrashHandlers() {
    process.on('exit', async () => {
        // sync-only operations here, or just log. so no point in calling doCleanUP() function
        baseLogger.info('Process exiting - cleanup should have already run');
    });

    process.on('SIGINT', async () => {
        await doCleanUp();
    });

    process.on('SIGTERM', async () => {
        await doCleanUp();
    });
}


/*Playwright expects only ONE default module, hence the work around*/
export default async (): Promise<void> => {
    
    // ensure credentials are provided before starting the actual test suite execution    
    if(!validationsUtil.isCredentialsEnvValid())        
        throw new Error('Unable to read BASE URL, User Name and Password from environment file');

    const isAUTReady: boolean = await validationsUtil.isAUTReadyForTesting();
    if(!isAUTReady)
        throw new Error(`Application Under Test (AUT) is NOT accessible for test suite to continue with global setup`);

    baseLogger.info(`doing the Global Setup now...`);
    attachCrashHandlers();

    await extractAndSaveTestEmployeeDetails();
    
    const userName: string = process.env.ess_user_name ?? '';
    
    try {        
        await addNewESSUser(userName);        
    } catch(err) {
        if(err instanceof duplicateUserError) baseLogger.warn(`User with ${userName} already exists in the backend`);
        await doCleanUp(); //we want to do clean up regardless, so that subsequent test suit execution gets a clean slate
        throw err; //stop test exectuion if set up fails
    } 

    /*We do NOT want to abort test case execution, hence optional stuff goes here in this try block*/
    try {
        await addPersonalLeavesToBaseEmployee(10);
    } catch(err) {
        baseLogger.warn(`Unable to add personal leaves to base employee due to this issue - ${JSON.stringify(err)}. Continuing with global set up as this issue is NOT a blocker for test suite`);
        /*we are not blocking execution as it should NOT be blocked. Hence not throwing error */
    }
        
    baseLogger.info(`finished the Global Setup`);   
}
