import {getEmployeeDataFilePath, deleteTestEmployee} from "../utils/users-manager.util";
import EmployeeType from "../tests/types/EmployeeType";
import fs from "fs";
import path from "path";
import baseLogger from "../utils/logger";

async function cleanUPTestEmployee(): Promise<void> {
    const employeeDataFilePath:string = getEmployeeDataFilePath();
    const employeeDetails:string = fs.readFileSync(employeeDataFilePath, {encoding: 'utf-8'});
    const employee:object = JSON.parse(employeeDetails);

    await deleteTestEmployee(employee?.employeeNumber);    
}

/**Delete the folder recursively and forcefully
 * Then add/make directory/folder
 */
function deleteAllFilesFromFolder(folderPath: string) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    fs.mkdirSync(folderPath, { recursive: true });
}


export default async (): Promise<void> => {
    baseLogger.info('Doing GLOBAL CLEAN UP now');
    await cleanUPTestEmployee();

    const storageFolderPath:string = path.join(process.cwd(), 'storage');//cwd() returnts current working directory of process
    
    baseLogger.info(`Going to reset the contents of folder - ${storageFolderPath}`);
    deleteAllFilesFromFolder(storageFolderPath);    
}