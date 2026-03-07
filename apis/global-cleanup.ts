import {getEmployeeDataFilePath, deleteTestEmployee} from "../utils/users-manager.util";
import { EmployeeDetailsType } from "../utils/types/EmployeeDetailsType";
import fs from "fs";
import path from "path";
import baseLogger from "../utils/logger";

let isCleanUpDone: boolean = false; //clean up must be idempondent

async function cleanUPTestEmployee(): Promise<void> {
    const employeeDataFilePath:string = getEmployeeDataFilePath();
    const employeeDetails:string = fs.readFileSync(employeeDataFilePath, {encoding: 'utf-8'});
    const employee:EmployeeDetailsType = JSON.parse(employeeDetails);

    await deleteTestEmployee(employee?.employeeNumber);    
}

/**Delete the folder recursively and forcefully
 * Then add/make directory/folder
 */
function deleteAllFilesFromFolder(folderPath: string) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    fs.mkdirSync(folderPath, { recursive: true });
}

export async function doCleanUp() {
    if(isCleanUpDone) return;

    baseLogger.info('Doing GLOBAL CLEAN UP now');
    await cleanUPTestEmployee();

    const storageFolderPath:string = path.join(process.cwd(), 'storage');//cwd() returnts current working directory of process
    
    baseLogger.info(`Going to reset the contents of folder - ${storageFolderPath}`);
    deleteAllFilesFromFolder(storageFolderPath);  
    isCleanUpDone = true;  
}

/**globalTearDown needs this default function */
export default async (): Promise<void> => {
    await doCleanUp();
}