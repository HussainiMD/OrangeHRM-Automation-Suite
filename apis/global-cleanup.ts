import {getTestEmployeeDataFilePath, deleteTestEmployee, getTestEmployeeNumber} from "../utils/users-manager.util";
import { disposeAdminContext } from "../utils/auth-manager.utils";
import fs from "fs";
import path from "path";
import baseLogger from "../utils/logger";

let isCleanUpDone: boolean = false; //clean up must be idempondent

/*delete the test employee from AUT; which we created for testing purpose*/
async function cleanUPTestEmployees(): Promise<void> {
    /*clean up global test employee Id*/
    const employeeDataFilePath:string = getTestEmployeeDataFilePath();
    if(fs.existsSync(employeeDataFilePath)) {
        const empId: number = getTestEmployeeNumber();        
        //keeping it isolated as we want this to happen mandatory. Rest of the test ID clean up is lesser priority
        await deleteTestEmployee([empId]);      
    }
    else baseLogger.warn('Did NOT find the global test employee during clean up'); 

    /*clean up test employees created by test case executions*/
    const TEST_EMPLOYEES_DIR = path.join(process.env.test_employee_dir ?? 'storage');
    if (!fs.existsSync(TEST_EMPLOYEES_DIR)) {
        baseLogger.warn('Did NOT find test employee directory during clean up');
        return;
    }

    const files = fs.readdirSync(TEST_EMPLOYEES_DIR).filter(f => f.endsWith('.ndjson'));
    if (files.length === 0) {
        baseLogger.warn('Did NOT find test employee files during clean up');
        return;
    }        

    const allIds = new Array<number>();

    for (const file of files) {
        const fullPath = path.join(TEST_EMPLOYEES_DIR, file);
        const lines = fs.readFileSync(fullPath, 'utf-8').split('\n');

        for (const line of lines) {
            if (!line || line.trim().length == 0) continue;

            try {
                const record = JSON.parse(line);
                if (record?.empNumber) allIds.push(record.empNumber);                
            } catch {
                baseLogger.warn('During clean up; skipping malformed line in '+ JSON.stringify(file));
            }
        }
    }    

    await deleteTestEmployee(allIds);       
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
    await cleanUPTestEmployees();
    await disposeAdminContext();

    const storageFolderPath:string = path.join(process.cwd(), 'storage');//cwd() returnts current working directory of process
    
    baseLogger.info(`Going to reset the contents of folder - ${storageFolderPath}`);
    deleteAllFilesFromFolder(storageFolderPath);      
}

/**globalTearDown needs this default function */
export default async (): Promise<void> => {
    await doCleanUp();
}