import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

export const createExternalLabTestingReport = async (
	data: {
		transactionDate: Date;
		despatchDate: Date;
		reportReceivedDate: Date;
		testingType: string;
		materialId: string;
		thirdPartyVendorName: string;
		remarks: string;
		uploadFile: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.externalLabTestingReport.create({
		data: {
			...data,
			createdById: user,
			updatedById: user,
		},
	});
};

export const getAllExternalLabTestingReports = async (
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.externalLabTestingReport.findMany({
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
	});
};

export const getExternalLabTestingReportById = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.externalLabTestingReport.findUnique({ where: { id } });
};

export const updateExternalLabTestingReport = async (
	id: string,
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.externalLabTestingReport.update({
		where: { id },
		data: {
			...data,
			updatedById: user,
		},
	});
};

export const deleteExternalLabTestingReport = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.externalLabTestingReport.update({
		where: { id },
		data: { isActive: false }, // soft delete
	});
};
