import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { transaction_type } from "@prisma/client";
import { pageConfig } from "@shared/prisma/query.helper";
import { extractDateTime, parseDateOnly } from "@utils/date";
import { getMaterialName, getOfficeName } from "common/api";
import getUserData from "@shared/prisma/queries/getUserById";
import { constants } from "@config/constant";
import { createWorkflowRequest } from "common/workflow";

// 1. Get all transaction types (with pagination)
export const getAllAdjustments = async (
	accessToken: string, // 🆕 Added
	pageNumber?: string, // 🔄 Changed type from number → string
	pageSize?: string, // 🔄 Changed type from number → string
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	//  Count total records
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
			//code: true,
			toSourceId: true,
			quantity: true,
			remarks: true,
			transactionDate: true,
			wfRequestId: true,
			materialId: true,
			transactionType: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	//  Map + enrich data (add material name)
	const data = await Promise.all(
		records.map(async (item) => {
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

			console.log(createdUser, updatedUser);

			return {
				uuid: item.id,
				//code: item.code,
				toSourceId: item.toSourceId,
				quantity: item.quantity,
				remarks: item.remarks,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				materialId: item.materialId,
				materialName: materialName?.name || null, // ✅ added
				transactionType: item.transactionType,
				createdAt: extractDateTime(item.createdAt, "both"),
				createdBy: item.createdById,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedBy: item.updatedById,
				createdUser: createdUser,
				updatedUser: updatedUser,
				isActive: item.isActive,
			};
		})
	);

	return {
		totalRecords,
		data,
	};
};

// 2. Get Material Mapping by ID
export const getAdjustmentById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.adjustment.findUnique({
		where: { id, isActive: true },
		select: {
			id: true,
			code: true,
			toSourceId: true,
			quantity: true,
			remarks: true,
			transactionDate: true,
			materialId: true,
			transactionType: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	if (!item) {
		throw new Error("Material mapping not found.");
	}

	// ✅ Fetch material name (like Bags)
	const materialName =
		item.materialId && accessToken
			? await getMaterialName(item.materialId, accessToken)
			: null;

	const data = {
		uuid: item.id,
		code: item.code,
		toSourceId: item.toSourceId,
		//sourceName: sourceName ? sourceName.officeDescription : null,
		quantity: item.quantity ? item.quantity.toString() : null,
		remarks: item.remarks,
		transactionDate: extractDateTime(item.transactionDate, "date"),
		materialId: item.materialId,
		materialName: materialName ? materialName.name : null,
		transactionType: item.transactionType,

		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdById: item.createdById,
		updatedById: item.updatedById,
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
		initiatorRoleId: string;
		workflowRemarks?: string;
		status?: string;
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
		initiatorRoleId,
		workflowRemarks,
		status,
	} = adjustmentData;

	if (!quantity || !transactionDate || !transactionType) {
		throw new Error(
			"Quantity, Transaction Date, Transaction Type ID, and Type are required."
		);
	}
	const wfRequestId = await createWorkflowRequest({
		userId: userId,
		initiatorRoleId: adjustmentData.initiatorRoleId,
		processId: constants.power_workflow_process_ID,
		remarks: adjustmentData.workflowRemarks,
		status: adjustmentData.status,
	});

	await tx.adjustment.create({
		data: {
			toSourceId,
			quantity,
			remarks,
			wfRequestId,
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
		transactionDate: Date;
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
			transactionDate: parseDateOnly(adjustmentData.transactionDate),
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
