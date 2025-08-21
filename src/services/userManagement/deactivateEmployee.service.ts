// import { getEmployeeByIdService } from "@module/v1/employees/services/getEmployeeById.service";
// import prisma, { IPrismaTransactionClient } from "@shared/prisma";

// export interface IDeactivateEmployeeServiceProps {
// 	employeeId: string;
// }

// export const deactivateEmployeeService = async (
// 	props: IDeactivateEmployeeServiceProps,
// 	tx: IPrismaTransactionClient | typeof prisma = prisma
// ) => {
// 	const employee = await getEmployeeByIdService(
// 		{ employeeId: props.employeeId },
// 		tx
// 	);

// 	// TODO: get the api to deactivate the user from user Management
// 	//? use the employee.appUserId to deactivate the user from user management
// 	return;
// };
