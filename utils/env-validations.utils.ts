
/**Implictly process is supposed to have the environment variables already available
 * @returns a boolean value of the function result
*/
export function isCredentialsEnvValid() : boolean {
    const fields : Array<any> = [process.env.base_url, process.env.userid, process.env.password];

    for(let idx=0; idx < fields.length; idx++) {
        if(!fields[idx] || typeof fields[idx] != 'string' || fields[idx].length == 0) return false;        
    }

    return true;
}