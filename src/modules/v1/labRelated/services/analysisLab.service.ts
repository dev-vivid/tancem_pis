import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import * as api from "../../../../common/api";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import getUserData from "@shared/prisma/queries/getUserById";

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
			wfRequestId: "",
			createdById: user,
		},
	});

	if (data.analysisValues && data.analysisValues.length > 0) {
		await tx.labAnalysisTypes.createMany({
			data: data.analysisValues.map(
				(a: { analysisId: string; value?: number }) => ({
					AnalysisLabId: lab.id,
					analysisId: a.analysisId,
					value: a.value ?? null,
					createdById: user,
				})
			),
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
	const existing = await tx.analysisLab.findUnique({
		where: { id, isActive: true },
		include: { LabAnalysisTypes: true },
	});

	if (!existing) {
		throw new Error("Analysis Lab not found");
	}

	// Get existing active analysisIds
	const existingIds = existing.LabAnalysisTypes.map((a) => a.analysisId);

	// Get analysisIds from request
	const incoming = data.analysisValues ?? [];
	const incomingIds = incoming.map((a: any) => a.analysisId);

	for (const id of existingIds) {
		if (!incomingIds.includes(id)) {
			await tx.labAnalysisTypes.updateMany({
				where: { AnalysisLabId: existing.id, analysisId: id },
				data: { isActive: false, updatedById: user },
			});
		}
	}

	for (const a of incoming) {
		const found = existing.LabAnalysisTypes.find(
			(e) => e.analysisId === a.analysisId && e.isActive
		);

		if (found) {
			// Update value if exists
			await tx.labAnalysisTypes.update({
				where: { id: found.id },
				data: {
					value: a.value ?? null,
					updatedById: user,
				},
			});
		} else {
			// Insert new
			await tx.labAnalysisTypes.create({
				data: {
					AnalysisLabId: existing.id,
					analysisId: a.analysisId,
					value: a.value ?? null,
					createdById: user,
				},
			});
		}
	}

	await tx.analysisLab.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			materialId: data.materialId,
			updatedById: user,
		},
	});
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
			updatedAt: true,
			updatedById: true,
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

	const data = await Promise.all(
		labs.map(async (item) => {
			const materialName = item.materialId
				? await api.getMaterialName(item.materialId, accessToken)
				: null;

			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;
			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;

			return {
				uuid: item.id,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				materialId: item.materialId,
				materialName: materialName?.name ?? null,
				analysisTypeCount: item.LabAnalysisTypes.length,
				analysisTypes:
					item.LabAnalysisTypes.map((a) => ({
						id: a.MaterialAnalysis.id,
						type: a.MaterialAnalysis.type,
						name: a.MaterialAnalysis.description,
						value: a.value?.toString() ?? null, // Include the new value field
					})) || [],
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdById: item.createdById,
				updatedById: item.updatedById,
				createdUser: createdUser,
				updatedUser: updatedUser,
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

	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;
	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;

	return {
		uuid: item.id,
		transactionDate: extractDateTime(item.transactionDate, "date"),
		materialId: item.materialId,
		materialName: materialName?.name || null,
		analysis: item.LabAnalysisTypes.map((a) => ({
			id: a.MaterialAnalysis.id,
			type: a.MaterialAnalysis.type,
			name: a.MaterialAnalysis.description,
			value: a.value?.toString() ?? null,
		})),
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdById: item.createdById,
		updatedById: item.updatedById,
		createdUser: createdUser,
		updatedUser: updatedUser,
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
