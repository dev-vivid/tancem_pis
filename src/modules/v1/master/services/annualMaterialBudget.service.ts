import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { Status } from "@prisma/client";
import { extractDateTime } from "../../../../shared/utils/date/index";
import getUserData from "@shared/prisma/queries/getUserById";
import { getMaterialName } from "common/api";

export const createAnnualMaterialBudget = async (
	annualMaterialBudgetData: {
		financialYear: string;
		month: number;
		year: number;
		materials: {
			materialId: string;
			value: number;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { financialYear, month, year, materials } = annualMaterialBudgetData;

	if (!materials || materials.length === 0) {
		throw new Error("At least one materialId + value is required");
	}

	const created = await tx.annualMaterialBudget.createMany({
		data: materials.map((m) => ({
			financialYear,
			month,
			year,
			materialId: m.materialId,
			value: m.value,
			createdById: user,
		})),
	});

	return created;
};

export const updateAnnualMaterialBudget = async (
	id: string,
	updateAnnualMaterialBudgetData: {
		financialYear?: string;
		month?: number;
		year?: number;
		status?: Status;
		materialId?: string;
		value?: number;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!user) {
		throw new Error("User is not Authorized");
	}

	const { financialYear, month, year, status, materialId, value } =
		updateAnnualMaterialBudgetData;

	const updated = await tx.annualMaterialBudget.update({
		where: { id },
		data: {
			...(financialYear && { financialYear }),
			...(month && { month }),
			...(year && { year }),
			...(status && { status }),
			...(materialId && { materialId }),
			...(value !== undefined && { value }),
			updatedById: user,
		},
	});
};

export const getAllAnnualMaterialBudget = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const whereClause: any = {
		isActive: true,
		...(status ? { status: status as Status } : {}),
	};

	const totalRecords = await tx.annualMaterialBudget.count({
		where: whereClause,
	});

	const result = await tx.annualMaterialBudget.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			code: true,
			financialYear: true,
			month: true,
			year: true,
			materialId: true,
			value: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	const data = await Promise.all(
		result.map(async (item) => {
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
				id: item.id,
				code: item.code,
				financialYear: item.financialYear,
				month: item.month,
				year: item.year,
				value: item.value,
				materialId: item.materialId,
				materialName: materialName ? materialName.name : null,
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdById: item.createdById,
				updatedById: item.updatedById,
				createdUser: createdUser?.userName,
				updatedUser: updatedUser?.userName,
				isActive: item.isActive,
				status: item.status,
			};
		})
	);

	return { totalRecords, data };
};

export const getAnnualMaterialBudgetByID = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const totalRecords = await tx.annualMaterialBudget.count({
		where: {
			isActive: true,
		},
	});

	const result = await tx.annualMaterialBudget.findUnique({
		where: { id },
		select: {
			id: true,
			code: true,
			financialYear: true,
			month: true,
			year: true,
			materialId: true,
			value: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	if (!result) {
		throw new Error("AnnualMaterialBudget not found");
	}

	const materialName =
		result.materialId && accessToken
			? await getMaterialName(result.materialId, accessToken)
			: null;
	const createdUser = result.createdById
		? await getUserData(result.createdById)
		: null;

	const updatedUser = result.updatedById
		? await getUserData(result.updatedById)
		: null;

	const data = {
		id: result.id,
		code: result.code,
		financialYear: result.financialYear,
		month: result.month,
		year: result.year,
		value: result.value,
		materialId: result.materialId,
		materialName: materialName ? materialName.name : null,
		createdAt: extractDateTime(result.createdAt, "both"),
		updatedAt: extractDateTime(result.updatedAt, "both"),
		createdBy: result.createdById,
		updatedBy: result.updatedById,
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
	};

	return { totalRecords, data };
};

export const deleteAnnualMaterialBudget = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting.");
	}

	await tx.annualMaterialBudget.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
