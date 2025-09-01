import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import * as api from "../../../../common/api";

export const createAnalysisLab = async (data: any, user: string) => {
	const analysisExists = await prisma.analysis.findUnique({
		where: { id: data.analysisId },
	});

	if (!analysisExists) {
		throw new Error("Provided analysisId does not exist in Analysis table");
	}

	return await prisma.analysisLab.create({
		data: {
			transactionDate: new Date(data.transactionDate),
			materialId: data.materialId,
			analysisId: data.analysisId,
			createdById: user,
		},
	});
};

// ✅ Get all with pagination
export const getAllAnalysisLab = async (
	accessToken: string,
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.analysisLab.count();

	const labs = await tx.analysisLab.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			transactionDate: true,
			materialId: true,
			analysisId: true,
			createdAt: true,
			createdById: true,
			MaterialAnalysis: {
				select: {
					description: true,
				},
			},
		},
	});

	const data = await Promise.all(
		labs.map(async (item) => {
			const materialName = item.materialId
				? await api.getMaterialName(item.materialId, accessToken)
				: null;

			return {
				id: item.id,
				transactionDate: item.transactionDate,
				materialId: item.materialId,
				materialName: materialName.productDescription,
				analysisId: item.analysisId,
				createdAt: item.createdAt
					.toISOString()
					.replace("T", " ")
					.substring(0, 19),
				createdById: item.createdById,
				analysisName: item.MaterialAnalysis?.description || null,
			};
		})
	);

	return {
		totalRecords,
		data,
	};
};

export const getAnalysisLabById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.analysisLab.findUnique({
		where: { id },
		include: {
			MaterialAnalysis: {
				select: { description: true },
			},
		},
	});

	if (!item) throw new Error("Analysis Lab not found.");

	const materialName = item.materialId
		? await api.getMaterialName(item.materialId, accessToken)
		: null;

	return {
		id: item.id,
		transactionDate: item.transactionDate,
		materialId: item.materialId,
		materialName: materialName.productDescription,
		analysisId: item.analysisId,
		analysisName: item.MaterialAnalysis?.description || null,
		createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
		createdById: item.createdById,
	};
};

// ✅ Update
export const updateAnalysisLab = async (
	id: string,
	data: {
		transactionDate: Date;
		materialId: string;
		analysisId: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.analysisLab.update({
		where: { id },
		data: {
			transactionDate: data.transactionDate,
			materialId: data.materialId,
			analysisId: data.analysisId,
			updatedById: user,
		},
	});
};

// ✅ Delete
export const deleteAnalysisLab = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting analysis.");
	}
	await tx.analysis.update({
		where: {
			id: id,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
