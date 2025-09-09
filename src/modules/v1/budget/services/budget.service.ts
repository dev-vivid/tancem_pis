import { extractDateTime, parseDateOnly } from "@utils/date";
import { getMaterialName } from "common/api";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import getUserData from "@shared/prisma/queries/getUserById";

// Get all budgets
export const getAllBudgets = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const totalRecords = await tx.budget.count({
		where: { isActive: true },
	});

	const budgets = await tx.budget.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		where: { isActive: true },
		select: {
			id: true,
			code: true,
			financialYear: true,
			transactionDate: true,
			materialId: true,
			budgetCode: true,
			budgetValue: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	const data = await Promise.all(
		budgets.map(async (item) => {
			const materialName =
				item.materialId && accessToken
					? await getMaterialName(item.materialId, accessToken)
					: null;

			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;
			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;

			return {
				...item,
				materialName: materialName?.name || null,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdUser: createdUser,
				updatedUser: updatedUser,
			};
		})
	);

	return { totalRecords, data };
};

// Get budget by ID
export const getBudgetById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const budget = await tx.budget.findUnique({
		where: { id, isActive: true },
		select: {
			id: true,
			code: true,
			financialYear: true,
			transactionDate: true,
			materialId: true,
			budgetCode: true,
			budgetValue: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	if (!budget) throw new Error("Budget record not found");

	const materialName =
		budget.materialId && accessToken
			? await getMaterialName(budget.materialId, accessToken)
			: null;

	const createdUser = budget.createdById
		? await getUserData(budget.createdById)
		: null;
	const updatedUser = budget.updatedById
		? await getUserData(budget.updatedById)
		: null;

	const data = {
		...budget,
		materialName: materialName?.name || null,
		transactionDate: extractDateTime(budget.transactionDate, "date"),
		createdAt: extractDateTime(budget.createdAt, "both"),
		updatedAt: extractDateTime(budget.updatedAt, "both"),
		createdUser: createdUser,
		updatedUser: updatedUser,
	};

	return { data };
};

// Create budget
export const createBudget = async (
	budgetData: {
		financialYear: string;
		transactionDate: Date;
		materialId: string;
		budgetCode: string;
		budgetValue: number;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.budget.create({
		data: {
			...budgetData,
			transactionDate: parseDateOnly(budgetData.transactionDate),
			createdById: user,
		},
	});
};

// Update budget
export const updateBudget = async (
	id: string,
	budgetData: Partial<{
		financialYear: string;
		transactionDate: Date;
		materialId: string;
		budgetCode: string;
		budgetValue: number;
	}>,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.budget.update({
		where: { id },
		data: {
			...budgetData,
			transactionDate: budgetData.transactionDate
				? parseDateOnly(budgetData.transactionDate)
				: undefined,
			updatedById: user,
		},
	});
};

// Soft delete budget
export const deleteBudget = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.budget.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
