import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { Status } from "@prisma/client";
import { extractDateTime } from "../../../../shared/utils/date/index";
import { getMaterialName } from "common/api";
import getUserData from "@shared/prisma/queries/getUserById";

export const createMaterialAnalysis = async (
	materialAnalysisData: {
		materialId: string;
		analysisId: string[]; // accept string[]
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { materialId, analysisId } = materialAnalysisData;

	if (!analysisId || analysisId.length === 0) {
		throw new Error("At least one analysis is required");
	}

	// Validate all analyses exist
	for (const id of analysisId) {
		const exists = await tx.analysis.findUnique({ where: { id } });
		if (!exists) throw new Error(`Analysis not found: ${id}`);
	}

	return await tx.materialAnalysis.createMany({
		data: analysisId.map((id) => ({
			materialId,
			analysisId: id,
			createdById: user,
		})),
	});
};

export const updateMaterialAnalysis = async (
	id: string,
	updateData: { materialId: string; analysisId: string; status: Status },
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { materialId, analysisId, status } = updateData;

	if (!user) throw new Error("User is not Authorized");

	return await tx.materialAnalysis.update({
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
	materialId: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const whereClause: any = {
		isActive: true,
		...(status ? { status: status as Status } : {}),
		...(materialId ? { materialId } : {}),
	};
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
			isActive: true,
			MaterialAnalysis: {
				select: {
					description: true,
					type: true,
				},
			},
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
				uuid: item.id,
				code: item.code,
				materialId: item.materialId,
				materialName: materialName?.name || null,
				analysisId: item.analysisId,
				analysisDetails: {
					description: item.MaterialAnalysis?.description || null,
					type: item.MaterialAnalysis?.type || null,
				},
				createdAt: extractDateTime(item.createdAt, "both"),
				createdBy: item.createdById,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedBy: item.updatedById,
				createdUser: createdUser?.userName,
				updatedUser: updatedUser?.userName,
				isActive: item.isActive,
				status: item.status,
			};
		})
	);

	return data;
};

export const getByID = async (
	id: string,
	accessToken: string,
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
			updatedById: true,
			status: true,
			isActive: true,
			MaterialAnalysis: {
				select: {
					description: true,
					type: true,
				},
			},
		},
	});

	if (!result) {
		throw new Error("materialType not found");
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
	const { MaterialAnalysis, ...rest } = result;

	const data = {
		...rest,
		materialName: materialName?.name || null,
		createdAt: extractDateTime(result.createdAt, "both"),
		updatedAt: extractDateTime(result.updatedAt, "both"),
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
		analysisDetails: {
			description: result.MaterialAnalysis?.description || null,
			type: result.MaterialAnalysis?.type || null,
		},
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
