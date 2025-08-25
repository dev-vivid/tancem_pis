import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { Status } from "@prisma/client";
import { extractDateTime } from "../../../../shared/utils/date/index";


export const createAnnualMaterialBudget = async (
	annualMaterialBudgetData: {
		financialYear: string,
		month: number,
		year: number,
		materialId: string,
		value: number,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { financialYear, month, year, materialId, value } = annualMaterialBudgetData;

	const create = await tx.annualMaterialBudget.create({
		data: {
			financialYear,
			month,
			value,
			year,
			materialId,
			createdById: user,
		}
	});

	// return create;
};

export const updateAnnualMaterialBudget = async (
	id: string,
	updateAnnualMaterialBudgetData: {
		financialYear: string,
		month: number,
		year: number,
		materialId: string,
		value: number;
		status: Status,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { financialYear, month, year, materialId, value, status } = updateAnnualMaterialBudgetData;

	if (!user) {
		throw new Error("User is not Authorized");
	}

	await tx.annualMaterialBudget.update({
		where: { id },
		data: {
			financialYear,
			month,
			year,
			materialId,
			status,
			value,
			updatedById: user,
		}
	});
};

export const getAllAnnualMaterialBudget = async (
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const whereClause: any = {
		isActive: true,
		...(status ? {status: status as Status} : {})
	}

	const result = await tx.annualMaterialBudget.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			financialYear: true,
			month: true,
			year: true,
			materialId: true,
			value: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			status: true,
			isActive: true
		},
	});

	const data = result.map(item => ({
		...item,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both")
	}));

	return data;
};

export const getAnnualMaterialBudgetByID = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const result = await tx.annualMaterialBudget.findUnique({
		where: { id },
		select: {
			id: true,
			financialYear: true,
			month: true,
			year: true,
			materialId: true,
			value: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			status: true,
			isActive: true
		}
	});

	if (!result) { throw new Error("AnnualMaterialBudget not found"); }

	const data = {
		...result,
		createdAt: extractDateTime(result.createdAt, "both"),
		updatedAt: extractDateTime(result.updatedAt, "both")
	};

	return { data };
};

export const deleteAnnualMaterialBudget = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) { throw new Error("ID is required for deleting."); }

	await tx.annualMaterialBudget.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
