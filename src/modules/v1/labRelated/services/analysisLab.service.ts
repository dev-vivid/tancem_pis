import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import * as api from "../../../../common/api";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import getUserData from "@shared/prisma/queries/getUserById";

// ✅ Get all with pagination

export const createAnalysisLab = async (
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
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
				orderBy: { createdAt: "desc" },
			},
		},
	});

	const flattenedData: any[] = [];

	for (const item of labs) {
		const materialName = item.materialId
			? await api.getMaterialName(item.materialId, accessToken)
			: null;

		// If there are no child analysis records, keep a parent-only row (uuid stays the parent id)
		if (!item.LabAnalysisTypes || item.LabAnalysisTypes.length === 0) {
			flattenedData.push({
				uuid: item.id,
				labId: item.id,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				materialId: item.materialId,
				materialName: materialName?.name ?? null,
				analysisTypeCount: 0,
				analysisId: null,
				analysisTypeStr: "-",
				analysisValueStr: "-",
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdById: item.createdById,
				updatedById: item.updatedById,
				createdUser: item.createdById
					? await getUserData(item.createdById)
					: null,
				updatedUser: item.updatedById
					? await getUserData(item.updatedById)
					: null,
			});
			continue;
		}

		for (const analysis of item.LabAnalysisTypes) {
			const createdUser = analysis.createdById
				? await getUserData(analysis.createdById)
				: null;
			const updatedUser = analysis.updatedById
				? await getUserData(analysis.updatedById)
				: null;

			flattenedData.push({
				uuid: analysis.id, // child table id as requested
				labId: item.id, // parent id for reference
				transactionDate: extractDateTime(item.transactionDate, "date"),
				materialId: item.materialId,
				materialName: materialName?.name ?? null,
				analysisTypeCount: 1,
				analysisId: analysis.analysisId,
				analysisTypeStr: analysis.MaterialAnalysis?.type ?? "-",
				analysisValueStr: analysis.value?.toString() ?? "-",
				createdAt: extractDateTime(analysis.createdAt, "both"),
				updatedAt: extractDateTime(analysis.updatedAt, "both"),
				createdById: analysis.createdById,
				updatedById: analysis.updatedById,
				createdUser: createdUser?.userName,
				updatedUser: updatedUser?.userName,
			});
		}
	}

	return {
		totalRecords,
		data: flattenedData,
	};
};

export const getAnalysisLabById = async (
	childId: string, // this is LabAnalysisTypes.id
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const record = await tx.labAnalysisTypes.findFirst({
		where: { id: childId, isActive: true },
		include: {
			lab: true,
			MaterialAnalysis: {
				select: {
					id: true,
					type: true,
					description: true,
				},
			},
		},
	});

	if (!record) throw new Error("Analysis record not found.");

	const parent = record.lab;
	const materialName =
		parent?.materialId && accessToken
			? await api.getMaterialName(parent.materialId, accessToken)
			: null;

	const createdUser = record.createdById
		? await getUserData(record.createdById)
		: null;
	const updatedUser = record.updatedById
		? await getUserData(record.updatedById)
		: null;

	return {
		uuid: record.id,
		labId: parent?.id ?? null,
		transactionDate: parent
			? extractDateTime(parent.transactionDate, "date")
			: null,
		materialId: parent?.materialId ?? null,
		materialName: materialName?.name ?? null,

		// // keep the original structured analysis object
		// analysis: {
		// 	id: record.MaterialAnalysis?.id ?? null,
		// 	type: record.MaterialAnalysis?.type ?? null,
		// 	name: record.MaterialAnalysis?.description ?? null,
		// 	value: record.value?.toString() ?? null,
		// },
		analysisTypeCount: 1,
		analysisId: record.analysisId,
		analysisTypeStr: record.MaterialAnalysis?.type ?? "-",
		analysisValueStr: record.value?.toString() ?? "-",

		createdAt: extractDateTime(record.createdAt, "both"),
		updatedAt: extractDateTime(record.updatedAt, "both"),
		createdById: record.createdById,
		updatedById: record.updatedById,
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
	};
};

// ✅ Delete
export const deleteAnalysisLab = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error(
			"Child ID (LabAnalysisTypes.id) is required for deleting analysis."
		);
	}

	const childRecord = await tx.labAnalysisTypes.findUnique({
		where: { id: id },
		select: { AnalysisLabId: true, isActive: true },
	});

	if (!childRecord) {
		throw new Error("Analysis child record not found.");
	}

	await tx.labAnalysisTypes.update({
		where: { id: id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});

	const parentId = childRecord.AnalysisLabId;

	const remainingChildren = await tx.labAnalysisTypes.count({
		where: {
			AnalysisLabId: parentId,
			isActive: true,
		},
	});

	if (remainingChildren === 0) {
		await tx.analysisLab.update({
			where: { id: parentId },
			data: {
				isActive: false,
				updatedById: user,
			},
		});
	} else {
		await tx.analysisLab.update({
			where: { id: parentId },
			data: {
				updatedById: user,
			},
		});
	}
};

export const updateAnalysisLab = async (
	id: string,
	data: {
		value: number | null;
		materialId?: string;
		transactionDate?: string;
		analysisId?: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const analysisRecord = await tx.labAnalysisTypes.findUnique({
		where: { id, isActive: true },
		include: { lab: true },
	});

	if (!analysisRecord) {
		throw new Error("Analysis record not found");
	}

	// 1️⃣ Update child row (LabAnalysisTypes)
	await tx.labAnalysisTypes.update({
		where: { id },
		data: {
			value: data.value ?? undefined,
			analysisId: data.analysisId ?? undefined,
			updatedById: user,
		},
	});

	// 2️⃣ Update parent row (AnalysisLab) if needed
	if (data.transactionDate || data.materialId) {
		await tx.analysisLab.update({
			where: { id: analysisRecord.AnalysisLabId },
			data: {
				...(data.transactionDate
					? { transactionDate: parseDateOnly(data.transactionDate) }
					: {}),
				...(data.materialId ? { materialId: data.materialId } : {}),
				updatedById: user,
			},
		});
	}
};
