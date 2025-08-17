import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

// ✅ Create AnalysisLab record
// export const createAnalysisLab = async (
// 	data: any,
// 	user: string,
// 	tx: IPrismaTransactionClient | typeof prisma = prisma
// ) => {
// 	const analysisExists = await prisma.analysis.findUnique({
// 		where: { id: data.analysisId },
// 	});

// 	if (!analysisExists) {
// 		throw new Error("Invalid analysisId. Analysis record does not exist.");
// 	}

// 	return await tx.analysisLab.create({
// 		data: {
// 			transactionDate: new Date(data.transactionDate),
// 			materialId: data.materialId,
// 			analysisId: data.analysisId,
// 			createdById: user,
// 		},
// 	});
// };

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
		},
	});

	const data = labs.map((item) => ({
		...item,
		createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
	}));

	return {
		totalRecords,
		data,
	};
};

// ✅ Get by ID
export const getAnalysisLabById = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.analysisLab.findUnique({
		where: { id },
	});
	if (!item) throw new Error("Analysis Lab not found.");

	return item;
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
