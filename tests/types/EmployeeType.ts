import BasicEmployeeType from "./BasicEmployeeType"

export default interface EmployeeType extends BasicEmployeeType {
    "empNumber": number,
    "employeeId"?:string,
    "terminationId"?:string
}