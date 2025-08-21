// import prisma, { IPrismaTransactionClient } from "@shared/prisma";
// import { AppError } from "@utils/errorHandler/appError";

// type AppModules =
// 	| "Regularization"
// 	| "Employee"
// 	| "Leave"
// 	| "Complaint"
// 	| "Attendance"
// 	| "Payroll"
// 	| "System"
// 	| "Asset"
// 	| "Onboarding"
// 	| "PayFixation"
// 	| "EmployeeMedical"
// 	| "EmployeeMedicalOperation"
// 	| "Separation"
// 	| "EmployeePassport";

// export interface ICreateAuditLogProps {
// 	// type?: "user" | "system";
// 	module?: AppModules;
// 	action: string;
// 	description: string;
// 	entityName?: string;
// 	recordId?: string;
// 	employeeId?: string;
// 	additionalData?: string;
// 	changedBy?: string;
// }

// /**
//  * Creates an audit log entry in the database.
//  *
//  * @param props - The properties required to create an audit log entry.
//  * @param props.changedBy - The ID of the user who made the change. If provided,
//  *                          the function will verify the existence of the user.
//  * @param props.[otherProps] - Additional properties for the audit log entry.
//  * @param tx - The Prisma transaction client to use for database operations.
//  *             Defaults to the global `prisma` instance if not provided.
//  *
//  * @throws {AppError} If the `changedBy` property is provided but the corresponding
//  *                    staff member is not found in the database.
//  *
//  * @returns A promise that resolves to the created audit log entry.
//  */
// export const createAuditLog = async (
// 	props: ICreateAuditLogProps,
// 	tx: IPrismaTransactionClient | typeof prisma = prisma
// ) => {
// 	if (props.changedBy) {
// 		const staff = await tx.employee.findUnique({
// 			where: {
// 				id: props.changedBy,
// 			},
// 			select: {
// 				id: true,
// 			},
// 		});

// 		if (!staff) {
// 			throw new AppError("STAFF_NOT_FOUND", 404, "Staff not found");
// 		}
// 	}

// 	const auditLog = await tx.auditLog.create({
// 		data: { ...props, type: props.changedBy ? "user" : "system" },
// 	});
// 	return auditLog;
// };
