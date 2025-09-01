import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { transaction_type } from "@prisma/client";
import { pageConfig } from "@shared/prisma/query.helper";
import { parseDateOnly } from "@utils/date";

// 1. Get all transaction types (with pagination)
export const getAllAdjustments = async (
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.adjustment.count({
		where: { isActive: true },
	});

	const records = await tx.adjustment.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			//	code: true,
			remarks: true,
			createdAt: true,
			updatedAt: true,
			createdById: true,
			updatedById: true,
		},
	});

	const data = records.map((item) => ({
		uuid: item.id,
		remarks: item.remarks,
		createdAt: item.createdAt
			? new Date(item.createdAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		createdById: item.createdById,
		updatedAt: item.updatedAt
			? new Date(item.updatedAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		updatedById: item.updatedById,
	}));

	return {
		totalRecords,
		data,
	};
};

// 2.Get Adjustment by ID
export const getAdjustmentById = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.adjustment.findUnique({
		where: { id },
		select: {
			id: true,
			code: true,
			transactionType: true, // enum field
			toSourceId: true,
			quantity: true,
			remarks: true,
			transactionDate: true,
			materialId: true,
			//	transactionTypeId: true,
			//type: true, // enum field
			createdAt: true,
			updatedAt: true,
			createdById: true,
			updatedById: true,
			isActive: true,
		},
	});

	if (!item) {
		throw new Error("Adjustment not found.");
	}

	const data = {
		uuid: item.id,
		code: item.code,
		transactionType: item.transactionType,
		toSourceId: item.toSourceId,
		quantity: item.quantity?.toString() ?? null, // Decimal to string
		remarks: item.remarks,
		transactionDate: item.transactionDate
			? new Date(item.transactionDate)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		materialId: item.materialId,

		createdAt: item.createdAt
			? new Date(item.createdAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		updatedAt: item.updatedAt
			? new Date(item.updatedAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		createdById: item.createdById,
		updatedById: item.updatedById,
		isActive: item.isActive,
	};

	return {
		totalRecords: 1,
		data,
	};
};

// export const createAdjustment = async (
//   data: {
//     toSourceId: string;
//     quantity: string;
//     remarks: string;
//     transactionDate: Date;
//     materialId: string;
//     type: transaction_type;
//   },
//   userId: string,
//   tx: IPrismaTransactionClient | typeof prisma = prisma

// ) => {
//   return prisma.adjustment.create({
//     data: {
//     toSourceId: data.toSourceId,
//     quantity: data.quantity,
//     remarks: data.remarks,
//     transactionDate: data.transactionDate,
//     materialId: data.materialId,
//     type: data.type,
//     createdById: userId,
//     updatedById: userId

//       //  Correct way to assign the relation
//       // transactionType: {
//       //   connect: { id: data.transactionTypeId }
//       // }
//     }
//   });
// };

// 3. Create Adjustment
export const createAdjustment = async (
	adjustmentData: {
		toSourceId?: string;
		quantity: string;
		remarks?: string;
		transactionDate: Date;
		transactionType: transaction_type;
		materialId?: string;

		type: transaction_type;
	},
	userId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const {
		toSourceId,
		quantity,
		remarks,
		transactionDate,
		materialId,
		transactionType,
	} = adjustmentData;

	if (!quantity || !transactionDate || !transactionType) {
		throw new Error(
			"Quantity, Transaction Date, Transaction Type ID, and Type are required."
		);
	}

	await tx.adjustment.create({
		data: {
			toSourceId,
			quantity,
			remarks,
			transactionDate: parseDateOnly(transactionDate),
			materialId,
			transactionType,
			createdById: userId,
		},
	});
};

// 4. Update adjustment
export const updateAdjustment = async (
	id: string,
	adjustmentData: {
		toSourceId?: string;
		quantity?: string;
		remarks?: string;
		transactionDate?: Date;
		materialId?: string;
		transactionType: transaction_type;
	},
	userId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for updating.");
	}

	// Ensure there's something to update
	if (Object.keys(adjustmentData).length === 0) {
		throw new Error("No update data provided.");
	}

	await tx.adjustment.update({
		where: { id },
		data: {
			...adjustmentData,
			transactionDate: adjustmentData.transactionDate
				? new Date(adjustmentData.transactionDate)
				: undefined, // optional handling,
			updatedById: userId,
		},
	});
};

// 5.Delete adjustment
// export const deleteAdjustment = async (
// 	id: string,
// 	tx: IPrismaTransactionClient | typeof prisma = prisma
// ) => {
// 	if (!id) {
// 		throw new Error("ID is required for deletion.");
// 	}

// 	await tx.adjustment.delete({
// 		where: { id },
// 	});

// DELETE  adjustment.service.ts
export const deleteAdjustment = async (
	id: string,
	userId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.adjustment.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: userId,
			updatedAt: new Date(),
		},
	});
};
