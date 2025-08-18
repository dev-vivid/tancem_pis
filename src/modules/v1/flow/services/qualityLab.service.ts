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

// 	return await tx.qualityLab.create({
// 		data: {
// 			transactionDate: new Date(data.transactionDate),
// 			materialId: data.materialId,
// 			analysisId: data.analysisId,
// 			createdById: user,
// 		},
// 	});
// };

export const createQualityLab = async (data: any, user: string) => {
	return await prisma.qualityLab.create({
		data: {
			transactionDate: new Date(data.transactionDate),
			materialId: data.materialId,
			equipmentId: data.equipmentId,
			ist: data.ist,
			fst: data.fst,
			blaine: data.blaine,
			createdById: user,
		},
	});
};

// ✅ Get all with pagination
export const getAllQualityLab = async (
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.qualityLab.count();

	const labs = await tx.qualityLab.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			transactionDate: true,
			materialId: true,
			equipmentId: true,
			ist: true,
			fst: true,
			blaine: true,
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
export const getQualityLabById = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.qualityLab.findUnique({
		where: { id },
	});
	console.log(item);
	if (!item) throw new Error("Analysis Lab not found.");

	return item;
};

// ✅ Update
export const updateQualityLab = async (
	id: string,
	data: {
		transactionDate: Date;
		materialId: string;
		equipmentId: string;
		ist: string;
		fst: string;
		blaine: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.qualityLab.update({
		where: { id },
		data: {
			transactionDate: data.transactionDate,
			materialId: data.materialId,
			equipmentId: data.equipmentId,
			ist: data.ist,
			fst: data.fst,
			blaine: data.blaine,
			updatedById: user,
		},
	});
};

// ✅ Delete
export const deleteQualityLab = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting qualityLab.");
	}
	await tx.qualityLab.update({
		where: {
			id: id,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
