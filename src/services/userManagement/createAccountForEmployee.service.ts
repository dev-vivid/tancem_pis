import prisma, { IPrismaTransactionClient } from "@shared/prisma";

export interface ICreateAccountForEmployeeServiceProps {}

export const createAccountForEmployeeService = async (
	props?: ICreateAccountForEmployeeServiceProps,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return;
};
