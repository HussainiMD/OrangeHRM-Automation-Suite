import BasicEmployeeType from "./BasicEmployeeType"

export default interface EmployeeType extends BasicEmployeeType {
    "empNumber": number,//system generated
    "employeeId"?:string,//optional, user provided
    "terminationId"?:string
}