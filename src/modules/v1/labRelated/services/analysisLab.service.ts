import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import * as api from "../../../../common/api";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";

// export const createAnalysisLab = async (data: any, user: string) => {
// 	const analysisExists = await prisma.analysis.findUnique({
// 		where: { id: data.analysisId },
// 	});

// 	if (!analysisExists) {
// 		throw new Error("Provided analysisId does not exist in Analysis table");
// 	}

// 	return await prisma.analysisLab.create({
// 		data: {
// 			transactionDate: new Date(data.transactionDate),
// 			materialId: data.materialId,
// 			// analysisId: data.analysisId,
// 			createdById: user,
// 		},
// 	});
// };

// ✅ Get all with pagination

export const createAnalysisLab = async (
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// return await prisma.$transaction(async (tx) => {
	const lab = await tx.analysisLab.create({
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			materialId: data.materialId,
			createdById: user,
		},
	});

	if (data.analysisId && data.analysisId.length > 0) {
		await tx.labAnalysisTypes.createMany({
			data: data.analysisId.map((analysisId: string) => ({
				AnalysisLabId: lab.id,
				analysisId,
				createdById: user,
			})),
		});
	}

	// // 3️⃣ Return lab with analyses
	// return tx.analysisLab.findUnique({
	// 	where: { id: lab.id },
	// 	include: {
	// 		analyses: {
	// 			include: { MaterialAnalysis: true },
	// 		},
	// 	},
	// });
	// });
};

export const updateAnalysisLab = async (
	id: string,
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const lab = await tx.analysisLab.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			materialId: data.materialId,
			updatedById: user,
		},
	});

	const existing = await tx.labAnalysisTypes.findMany({
		where: { AnalysisLabId: id },
		select: { analysisId: true },
	});

	const existingIds = existing.map((e) => e.analysisId);
	const newIds: string[] = data.analysisId || [];

	const toAdd = newIds.filter((x) => !existingIds.includes(x));
	const toRemove = existingIds.filter((x) => !newIds.includes(x));

	if (toRemove.length > 0) {
		await tx.labAnalysisTypes.updateMany({
			where: {
				AnalysisLabId: id,
				analysisId: { in: toRemove },
			},
			data: {
				isActive: false,
				updatedById: user,
				updatedAt: new Date(),
			},
		});
	}

	if (toAdd.length > 0) {
		await tx.labAnalysisTypes.createMany({
			data: toAdd.map((analysisId: string) => ({
				AnalysisLabId: id,
				analysisId,
				createdById: user,
			})),
		});
	}
};

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

	const totalRecords = await tx.analysisLab.count({
		where: { isActive: true },
	});

	const labs = await tx.analysisLab.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			transactionDate: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			_count: {
				select: {
					LabAnalysisTypes: {
						where: { isActive: true }, // ✅ count only active ones
					},
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
				transactionDate: extractDateTime(item.transactionDate, "date"),
				materialId: item.materialId,
				materialName: materialName?.productDescription ?? null,
				analysisTypeCount: item._count.LabAnalysisTypes,
				createdAt: item.createdAt
					.toISOString()
					.replace("T", " ")
					.substring(0, 19),
				createdById: item.createdById,
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
			LabAnalysisTypes: {
				where: { isActive: true },
				include: {
					MaterialAnalysis: {
						select: {
							id: true,
							type: true,
							description: true,
						},
					},
				},
			},
		},
	});

	if (!item) throw new Error("Analysis Lab not found.");

	const materialName = item.materialId
		? await api.getMaterialName(item.materialId, accessToken)
		: null;

	return {
		id: item.id,
		transactionDate: extractDateTime(item.transactionDate, "date"),
		materialId: item.materialId,
		materialName: materialName?.productDescription || null,
		analysis: item.LabAnalysisTypes.map((a) => ({
			id: a.MaterialAnalysis.id,
			type: a.MaterialAnalysis.type,
			name: a.MaterialAnalysis.description,
		})),
		createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
		createdById: item.createdById,
	};
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

	await tx.analysisLab.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});

	await tx.labAnalysisTypes.updateMany({
		where: {
			AnalysisLabId: id, // foreign key
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
