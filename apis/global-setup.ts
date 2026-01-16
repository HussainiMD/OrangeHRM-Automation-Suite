import fs from "fs";
import dotenv from "dotenv";
import * as validationsUtil from "../utils/env-validations.utils";
import { refreshAdminAuthState } from "../utils/auth-manager.utils";
import {APIRequestContext, APIResponse, request} from "@playwright/test";

dotenv.config({path: './autCred.env', debug: true, encoding: 'utf-8', override: true});

async function extractAndSaveContext()  {
    if(!validationsUtil.isCredentialsEnvValid())        
        throw new Error('Unable to read BASE URL, User Name and Password from environment file');
    
    try {
       await refreshAdminAuthState();
    } catch(err) {
        console.log(err);
    }
}


//Playwright expects only ONE default module, hence the work around
export default async () => {
    await extractAndSaveContext();
}
