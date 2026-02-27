import {getEmployeeDataFilePath, deleteTestEmployee} from "../utils/users-manager.util";
import EmployeeType from "../tests/types/EmployeeType";
import fs from "fs";
import path from "path";
import { baseLogger } from "../utils/logger";

async function cleanUPTestEmployee(): Promise<void> {
    const employeeDataFilePath:string = getEmployeeDataFilePath();
    const employeeDetails:string = fs.readFileSync(employeeDataFilePath, {encoding: 'utf-8'});
    const employee:object = JSON.parse(employeeDetails);

    const empNumberList:Array<number> = [];
    empNumberList.push(employee?.employeeNumber);

    await deleteTestEmployee(empNumberList);    
}

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
    // deleteAllFilesFromFolder('C:\Projects_Work_Space\SDET\Automation_Testing\PlayWright\ProjectOrangeHRM\Automation\storage');
}