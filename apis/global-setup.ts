import fs from "fs";
import dotenv from "dotenv";
import * as validationsUtil from "../utils/env-validations.utils";
import { getEmployeeDataFilePath, addTestEmployee } from "../utils/users-manager.util";
import {APIRequestContext, APIResponse, request} from "@playwright/test";
import BasicEmployeeType from "../tests/types/BasicEmployeeType";
import EmployeeType from "../tests/types/EmployeeType";
import baseLogger from "../utils/logger";

dotenv.config({path: './autCred.env', debug: true, encoding: 'utf-8', override: true});

/** This is function to add a test employee which will be used to create user(s) across the test cases. 
 * Test Employee has to be present in orange hrm otherwise test cases will fail.
 * Both Employee ID and Employee number sounds similar but ID is user provided and optional. Where as employee number is auto generated.
 * So, to add a USER, employee number is mandatory.
 * We are creating test employee only once through global setup. Then sharing employee number through file system "employee data file path".
 * NOTE: Though we are doing add only once, there are chances that test employee gets deleted by orange hrm team's clean up cron job. We are ignoring that risk for now
 */
async function extractAndSaveEmployeeDetails(): Promise<void> {
    const newEmployeeData:BasicEmployeeType = {
                        "firstName": "playwright",
                        "middleName": "",
                        "lastName": "employee_007"                
    };

    const employeeDetails:EmployeeType = await addTestEmployee(newEmployeeData); 
    
    const employeeNumber = employeeDetails.empNumber;
    baseLogger.info(`employeeNumber generated for test employee is ${employeeNumber}`);
    
    //put it in a file so that multiple worker threads can access data
    const employeeDataFilePath:string = getEmployeeDataFilePath();
    fs.writeFileSync(employeeDataFilePath, JSON.stringify({employeeNumber}), {encoding:'utf-8'});
}


//Playwright expects only ONE default module, hence the work around
export default async (): Promise<void> => {
    // ensure credentials are provided before starting the actual test suite execution    
    if(!validationsUtil.isCredentialsEnvValid())        
        throw new Error('Unable to read BASE URL, User Name and Password from environment file');

    await extractAndSaveEmployeeDetails();
}
