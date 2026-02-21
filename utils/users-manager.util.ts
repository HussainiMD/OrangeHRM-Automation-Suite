"use strict";
import {APIRequest, APIRequestContext, APIResponse, request, TestInfo} from "@playwright/test";
import fs from "fs";
import path from "path";
import UserType from "../tests/types/UserType";

const employeeDataFilePath: string = path.join('storage', '.test-employee-global.json');

/** This is function to add a test employee which will be used to create user(s) across the test cases. 
 * Test Employee has to be present in orange hrm otherwise test cases will fail.
 * Both Employee ID and Employee number sounds similar but ID is user provided and optional. Where as employee number is auto generated.
 * So, to add a USER, employee number is mandatory.
 * We are creating test employee only once through global setup. Then sharing employee number through file system "employee data file path".
 * NOTE: Though we are doing add only once, there are chances that test employee gets deleted by orange hrm team's clean up cron job. We are ignoring that risk for now
 */
async function addTestEmployee(): Promise<void> {
    const requestContext:APIRequestContext = await request.newContext({storageState: './storage/admin-auth.json'});
    try {
        const addEmployeeResponse:APIResponse = await requestContext.post('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees', {
                headers: { 'Content-Type': 'application/json'},
                data: {
                        "firstName": "playwright_",
                        "middleName": "",
                        "lastName": "employee_007"                
                }
            });
        
        console.log(`add test employee request status ${addEmployeeResponse.status()}`);
        if(!addEmployeeResponse.ok()) throw new Error(`add test employee API returned response with status ${addEmployeeResponse.status()}`);

        const newEmployeeRecord:object = await addEmployeeResponse.json();
        const employeeNumber = newEmployeeRecord?.data?.empNumber;
        console.log(`employeeNumber generated for test employee is ${employeeNumber}`);

        //put it in a file so that multiple worker threads can access data
        fs.writeFileSync(employeeDataFilePath, JSON.stringify({employeeNumber}), {encoding:'utf-8'});
        
    } catch(err) {
        console.warn('Unable to add test employee data to orange hrm');
        console.warn(err);
        throw err;
    }
}


async function addNewESSUser(name: string, testInfo:TestInfo) : Promise<UserType> {    
    const apiRequestContext:APIRequestContext = await request.newContext({storageState: './storage/admin-auth.json'});
    try {        
        const exists = await doesUserExists(name, apiRequestContext);
        console.log(`exists? ${exists}`);
        if(exists) throw new Error(`${name} user already exists. Each user name has to be unique. Please try with a different name`);

        //extract employee number from file system, which is expected to be present before this code starts executes
        let testEmployeeNumber:number;

        try {
            const testEmployeeDataStr: string = fs.readFileSync(employeeDataFilePath, {encoding: 'utf-8'});
            const testEmployeeData:JSON = JSON.parse(testEmployeeDataStr);
            testEmployeeNumber = testEmployeeData?.employeeNumber;
            console.log(`using employee number ${testEmployeeNumber}`);
        }
        catch(err) {
            throw new Error(`Something went wrong while trying to extra employee data from the file system - ${err}`);
        }    

        const addUserResp:APIResponse = await apiRequestContext.post(`/web/index.php/api/v2/admin/users`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "username": name,
                "password": "tester123",
                "status": true,
                "userRoleId": 2,
                "empNumber": testEmployeeNumber
            }
        });
        console.log(`add user request status ${addUserResp.status()}`);
        console.log(await addUserResp.text());
        return {
            name,
            "password": "tester123"
        }
    } finally {
        apiRequestContext.dispose(); //no need to wait as it happens async
    }
}


/**A function to check if the user exists */
async function doesUserExists(name: string, requestContext:APIRequestContext): Promise<boolean> {       
    try {
        const apiResponse:APIResponse = await requestContext.get(`/web/index.php/api/v2/admin/users?limit=50&offset=0&username=${name}&sortField=u.userName&sortOrder=ASC`);
                
        if(!apiResponse.ok()) return false;

        const searchResult: Object = await apiResponse.json();
        
        if(!searchResult.hasOwnProperty('meta')) return false;
        const metaData: Object = searchResult['meta'];
        if(!metaData.hasOwnProperty('total') ) return false;
        const totalMatchCount:number = parseInt(metaData['total']);

        const areMatchesFound: boolean = totalMatchCount > 0;
        return areMatchesFound;

    } catch(err) {
        console.log(err);
        return false;
    }

    return false;

}

export {addTestEmployee, addNewESSUser} 