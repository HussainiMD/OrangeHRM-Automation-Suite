import BasicEmployeeType from "./BasicEmployeeType"

export default interface EmployeeType extends BasicEmployeeType {
    "empNumber": number,//system generated    
    "terminationId"?:string
}