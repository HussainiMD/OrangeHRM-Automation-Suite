import {getTestEmployeeDataFilePath, deleteTestEmployee} from "../utils/users-manager.util";
import { disposeAdminContext } from "../utils/auth-manager.utils";
import fs from "fs";
import path from "path";
import baseLogger from "../utils/logger";

let isCleanUpDone: boolean = false; //clean up must be idempondent

/*delete the test employee from AUT; which we created for testing purpose*/
async function cleanUPTestEmployee(): Promise<void> {
    const employeeDataFilePath:string = getTestEmployeeDataFilePath();
    if(fs.existsSync(employeeDataFilePath)) 
        await deleteTestEmployee();        
}

/**Delete the folder recursively and forcefully
 * Then add/make directory/folder
 */
function deleteAllFilesFromFolder(folderPath: string) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    fs.mkdirSync(folderPath, { recursive: true });
}


/*Actual function which executes the clean up process */
export async function doCleanUp() {
    if(isCleanUpDone) return;
    isCleanUpDone = true;  //block other multiple (duplicate) executions on the same worker

    baseLogger.info('Doing GLOBAL CLEAN UP now');
    await cleanUPTestEmployee();
    await disposeAdminContext();

    const storageFolderPath:string = path.join(process.cwd(), 'storage');//cwd() returnts current working directory of process
    
    baseLogger.info(`Going to reset the contents of folder - ${storageFolderPath}`);
    deleteAllFilesFromFolder(storageFolderPath);      
}

/**globalTearDown needs this default function */
export default async (): Promise<void> => {
    await doCleanUp();
}