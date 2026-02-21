"use strict";
import {APIRequest, APIRequestContext, APIResponse, request, TestInfo} from "@playwright/test";
import fs from "fs";
import path from "path";
import UserType from "../tests/types/UserType";
import BasicEmployeeType from "../tests/types/BasicEmployeeType";
import EmployeeType from "../tests/types/EmployeeType";

const employeeDataFilePath: string = path.join('storage', '.test-employee-global.json');

//utility function to share path so that exact path configuration remains here with the owner file
const getEmployeeDataFilePath = ():string => employeeDataFilePath;

interface addEmployeeResponseDataType {
    "data": EmployeeType
}

/**Here we will be adding a test employee */
async function addTestEmployee(data:BasicEmployeeType): Promise<EmployeeType> {
    const requestContext:APIRequestContext = await request.newContext({storageState: './storage/admin-auth.json'});
    try {
        const addEmployeeResponse:APIResponse = await requestContext.post('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees', {
                headers: { 'Content-Type': 'application/json'},
                data
            });
        
        console.log(`add test employee request status ${addEmployeeResponse.status()}`);
        if(!addEmployeeResponse.ok()) throw new Error(`add test employee API returned response with status ${addEmployeeResponse.status()}`);

        const newEmployeeRecord:addEmployeeResponseDataType = await addEmployeeResponse.json();         
        return newEmployeeRecord.data;        
    } catch(err) {
        console.warn('Unable to add test employee data to orange hrm');
        console.warn(err);
        throw err;
    }
}

/**This function helps to create a non admin (ESS) user */
async function addNewESSUser(name: string, testInfo:TestInfo) : Promise<UserType> {    
    const apiRequestContext:APIRequestContext = await request.newContext({storageState: './storage/admin-auth.json'});
    try {        
        const exists = await doesUserExists(name, apiRequestContext);
        console.log(`does "${name}" user exists? ${exists}`);
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

        console.log(`add user request API response status is ${addUserResp.status()}`);
        
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

export {getEmployeeDataFilePath, addTestEmployee, addNewESSUser} 