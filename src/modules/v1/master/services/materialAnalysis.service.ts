import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { Status } from "@prisma/client";
import { extractDateTime } from "../../../../shared/utils/date/index";
import { getMaterialName } from "common/api";


export const createMaterialAnalysis = async (
	materialAnalysisData: {
		materialId: string;
		analysisId: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { materialId, analysisId } = materialAnalysisData;

	const create = await tx.materialAnalysis.create({
		data: {
			materialId,
			analysisId,
			createdById: user,
		},
	});
};

export const updateMaterialAnalysis = async (
	id: string,
	updateMaterialTypeData: {
		materialId: string;
		analysisId: string;
		status: Status;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { materialId, analysisId, status } = updateMaterialTypeData;

	if (!user) {
		throw new Error("User is not Authorized");
	}

	await tx.materialAnalysis.update({
		where: { id },
		data: {
			materialId,
			analysisId,
			status,
			updatedById: user,
		},
	});
};

export const getAllMaterialAnalysis = async (
	accessToken: string,
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
	const result = await tx.materialAnalysis.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			code: true,
			materialId: true,
			analysisId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true
		},
	});

		const data = await Promise.all(
		result.map(async (item) => {
			const materialName = item.materialId && accessToken ? await getMaterialName(item.materialId, accessToken): null;

			return {
				uuid: item.id,
				code: item.code,
				materialId: item.materialId,
				// materialName: materialName,
				analysisId: item.analysisId, 
				createdAt: extractDateTime(item.createdAt, "both"),
				createdBy: item.createdById,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedBy: item.updatedById,
				isActive: item.isActive,
				status: item.status
			};
		})
	);

	return data;
};

export const getByID = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const result = await tx.materialAnalysis.findUnique({
		where: { id },
		select: {
			id: true,
			materialId: true,
			analysisId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			status: true,
			isActive: true
		},
	});

	if (!result) {
		throw new Error("materialType not found");
	}

	const data = {
		...result,
		createdAt: extractDateTime(result.createdAt, "both"),
		updatedAt: extractDateTime(result.updatedAt, "both"),
	};

	return {
		data,
	};
};

export const deleteMaterialAnalysis = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting.");
	}

	await tx.materialAnalysis.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
