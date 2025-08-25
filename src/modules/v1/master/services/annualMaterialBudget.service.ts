import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { Status } from "@prisma/client";

export const createAnnualMaterialBudget = async (
	annualMaterialBudgetData: {
		financialYear: string,
		month: number,
		year: number,
		materialId: string,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { financialYear, month, year, materialId } = annualMaterialBudgetData;

	const create = await tx.annualMaterialBudget.create({
		data: {
			financialYear,
			month,
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
		status: Status,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { financialYear, month, year, materialId, status } = updateAnnualMaterialBudgetData;

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
			createdAt: true,
			createdById: true,
			updatedAt: true,
			status: true,
			isActive: true
		},
	});

	const data = result.map(item => ({
		...item,
		createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
		updatedAt: item.updatedAt.toISOString().replace("T", " ").substring(0, 19)
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
		createdAt: result.createdAt.toISOString().replace("T", " ").substring(0, 19),
		updatedAt: result.updatedAt.toISOString().replace("T", " ").substring(0, 19)
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
