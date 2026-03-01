"use strict";
import {APIRequestContext, APIResponse, request} from "@playwright/test";
import fs from "fs";
import path from "path";
import UserType from "../tests/types/UserType";
import BasicEmployeeType from "../tests/types/BasicEmployeeType";
import EmployeeType from "../tests/types/EmployeeType";
import {getValidAuthJSONPath} from "../utils/auth-manager.utils";
import { duplicateUserError } from "../tests/errors/duplicate-user-error";
import baseLogger from "./logger";

const baseURL: string = process.env.base_url ?? 'https://opensource-demo.orangehrmlive.com';
const employeeDataFilePath: string = path.join('storage', 'test-employee-global.json');

interface AddEmployeeResponseDataType {
    "data": EmployeeType
}

interface SearchUserResponseMetaDataType {
    meta: {
        total: number
    }
}


/**utility function to share path so that exact path configuration remains here with the owner file
 * @returns string representing the path
*/
const getEmployeeDataFilePath = ():string => employeeDataFilePath;


/**Here we will be adding a test employee 
 * @returns a record of employee
*/
async function addTestEmployee(data:BasicEmployeeType): Promise<EmployeeType> {
    const adminAuthJSONLocation: string = await getValidAuthJSONPath();

    //using admin credentials for operation
    const requestContext:APIRequestContext = await request.newContext({baseURL, storageState: adminAuthJSONLocation});
    try {
        const addEmployeeResponse:APIResponse = await requestContext.post('/web/index.php/api/v2/pim/employees', {
                headers: { 'Content-Type': 'application/json'},
                data
            });
        
        baseLogger.info(`add test employee request status ${addEmployeeResponse.status()}`);

        if(!addEmployeeResponse.ok()) 
            throw new Error(`add test employee API returned response with status ${addEmployeeResponse.status()}`);

        const newEmployeeRecord:AddEmployeeResponseDataType = await addEmployeeResponse.json();         
        return newEmployeeRecord.data;        
    } catch(err) {
        baseLogger.warn('Unable to add test employee data to orange hrm');
        baseLogger.warn(err);
        throw err;
    }
}


/**This function helps to delete an employee by empNumber 
 * @returns nothing/void. Throws exception if operation fails
*/
async function deleteTestEmployee(empId:number): Promise<void> {
    const adminAuthJSONLocation: string = await getValidAuthJSONPath();
    
    //using admin credentials for operation
    const apiRequestContext: APIRequestContext = await request.newContext({baseURL, storageState: adminAuthJSONLocation});
    const apiResponse: APIResponse = await apiRequestContext.delete('/web/index.php/api/v2/pim/employees', {
            headers: { 'Content-Type': 'application/json'},
            data: {
                ids: [empId]
            }
        });

    baseLogger.info(`delete employee (id:${empId}) API call resulted in response code ${apiResponse.status()}`);

    if(!apiResponse.ok())
        throw new Error(`Delete Employee for IDs "${empId}" has failed - status code: ${apiResponse.status()}. Here are the error details ${await apiResponse.text()}`);
}


/**This function helps to create a non admin (ESS) user 
 * @returns a record of user
*/
async function addNewESSUser(name: string) : Promise<UserType> {    
    const adminAuthJSONLocation: string = await getValidAuthJSONPath();

    //using admin credentials for operation
    const apiRequestContext:APIRequestContext = await request.newContext({baseURL, storageState: adminAuthJSONLocation});
    try {        
        const exists = await doesUserExists(name);
        baseLogger.info(`does "${name}" user exists? ${exists}`);
        if(exists) throw new duplicateUserError(`${name} user already exists. Each user name has to be unique. Please try with a different name`);

        //extract employee number from file system, which is expected to be present before this code starts executes
        let testEmployeeNumber:number;

        try {
            const testEmployeeDataStr: string = fs.readFileSync(employeeDataFilePath, {encoding: 'utf-8'});
            const testEmployeeData:JSON = JSON.parse(testEmployeeDataStr);
            testEmployeeNumber = testEmployeeData?.employeeNumber;
            baseLogger.info(`using employee number ${testEmployeeNumber} for adding new user`);
        }
        catch(err) {
            throw new Error(`Something went wrong while trying to extract employee data from the file system - ${err}`);
        }    

        const addUserResp:APIResponse = await apiRequestContext.post(`/web/index.php/api/v2/admin/users`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "username": name,
                "password": process.env.ess_user_password,
                "status": true,
                "userRoleId": 2,
                "empNumber": testEmployeeNumber
            }
        });

        baseLogger.info(`add user request API response status is ${addUserResp.status()}`);
        if(!addUserResp.ok()) throw new Error(`Add user request has failed :: ${await addUserResp.text()}`);
        
        return {
            name,
            "password": "tester123"
        }
    } finally {
        await apiRequestContext.dispose(); //no need to wait as it happens async
    }
}


/**A function to check if the user exists in the backend
 * @returns a boolean result
*/
async function doesUserExists(name: string): Promise<boolean> {     
    const adminAuthJSONLocation: string = await getValidAuthJSONPath();

    //using admin credentials for operation
    const apiRequestContext:APIRequestContext = await request.newContext({baseURL, storageState: adminAuthJSONLocation});  
    try {
        const apiResponse:APIResponse = await apiRequestContext.get(`/web/index.php/api/v2/admin/users?limit=50&offset=0&username=${name}&sortField=u.userName&sortOrder=ASC`);
                
        if(!apiResponse.ok()) return false;

        const searchResult: SearchUserResponseMetaDataType = await apiResponse.json();       
        const totalMatchCount:number = searchResult.meta.total;

        const areMatchesFound: boolean = totalMatchCount > 0;
        return areMatchesFound;

    } catch(err) {
        baseLogger.warn(err);
        return false;
    }

    return false;

}

export {getEmployeeDataFilePath, addTestEmployee, deleteTestEmployee, addNewESSUser} 