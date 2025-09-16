import { createWorkflowRequest } from "common/workflow";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";
import { constants } from "@config/constant";
import { extractDateTime, parseDateOnly } from "@utils/date";
import getUserData from "@shared/prisma/queries/getUserById";
import { getMaterialName } from "common/api";

export const getAllreceipt = async (
	accessToken: string,
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.receiptConsumption.count({
		where: { isActive: true },
	});

	const receipt = await tx.receiptConsumption.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			code: true,
			transactionDate: true,
			quantity: true,
			wfRequestId: true,
			materialId: true,
			materialType: true,
			transactionType: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
			transactionTypes: {
				select: {
					id: true,
					name: true,
				},
			},
			// ✅ include materialType master table
			materialTypes: {
				select: {
					id: true,
					materialTypeMaster: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});

	const data = await Promise.all(
		receipt.map(async (item) => {
			const materialName = item.materialId
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
				receiptCode: item.code,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				quantity: item.quantity,
				materialId: item.materialId,
				materialName: materialName ? materialName.name : null,
				materialType: item.materialType,
				materialTypeName: item.materialTypes?.materialTypeMaster?.name,
				// ✅ added field
				transactionType: item.transactionType,
				transactionTypeName: item.transactionTypes?.name,
				wfRequestId: item.wfRequestId,
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdBy: item.createdById,
				updatedBy: item.updatedById,
				isActive: item.isActive,
				createdUser,
				updatedUser,
			};
		})
	);

	return {
		totalRecords,
		data,
	};
};

export const getIdreceipt = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.receiptConsumption.findFirst({
		where: { id, isActive: true },
		select: {
			id: true,
			code: true,
			transactionDate: true,
			quantity: true,
			materialId: true,
			materialType: true,
			transactionType: true,
			wfRequestId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
			transactionTypes: {
				select: {
					id: true,
					name: true,
				},
			},
			// ✅ include materialType master table
			materialTypes: {
				select: {
					id: true,
					materialTypeMaster: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});

	if (!item) {
		throw new Error("receipt not found.");
	}

	const materialName = item.materialId
		? await getMaterialName(item.materialId, accessToken)
		: null;

	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;

	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;

	const data = {
		uuid: item.id,
		receiptCode: item.code,
		transactionDate: extractDateTime(item.transactionDate, "date"),
		quantity: item.quantity,
		materialId: item.materialId,
		materialName: materialName ? materialName.name : null,
		materialType: item.materialType,
		materialTypeName: item.materialTypes?.materialTypeMaster?.name || null,
		// ✅ added field
		transactionType: item.transactionType,
		transactionTypeName: item.transactionTypes?.name || null,
		wfRequestId: item.wfRequestId,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdBy: item.createdById,
		updatedBy: item.updatedById,
		isActive: item.isActive,
		createdUser,
		updatedUser,
	};

	return {
		totalRecords: 1,
		data,
	};
};

type receiptData = {
	transactionDate: string; // single
	receiptDetails: {
		quantity: string;
		materialId: string;
		materialType: string;
		transactionType: string;
	}[];
	initiatorRoleId?: string;
	remarks?: string;
	status?: string;
};

// function parseDDMMYYYY(dateStr: string): Date | null {
// 	if (!dateStr) return null;
// 	const [day, month, year] = dateStr.split("-");
// 	if (!day || !month || !year) return null;
// 	return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
// }

export const createreceipt = async (
	receiptData: receiptData,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const parsedDate = parseDateOnly(receiptData.transactionDate);
	// if (!parsedDate || isNaN(parsedDate.getTime())) {
	// 	throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	// }
	// const wfRequestId = await createWorkflowRequest({
	// 	userId: user,
	// 	initiatorRoleId: receiptData.initiatorRoleId,
	// 	processId: constants.power_workflow_process_ID,
	// 	remarks: receiptData.remarks,
	// 	status: receiptData.status,
	// });

	const records = receiptData.receiptDetails.map((r) => ({
		transactionDate: parsedDate,
		quantity: r.quantity ? Number(r.quantity) : 0,
		materialId: r.materialId,
		materialType: r.materialType,
		transactionType: r.transactionType,
		wfRequestId: "",
		createdById: user,
	}));

	const created = await tx.receiptConsumption.createMany({
		data: records,
	});
};

export const updatereceipt = async (
	id: string,
	receiptData: any, // directly from req.body
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for updating receipt.");
	}

	const updateData: any = { updatedById: user };

	// update only when provided
	if (receiptData.transactionDate) {
		updateData.transactionDate = parseDateOnly(receiptData.transactionDate);
	}

	if (receiptData.quantity) {
		updateData.quantity = Number(receiptData.quantity);
	}

	if (receiptData.materialId) {
		updateData.materialId = receiptData.materialId;
	}

	if (receiptData.materialType) {
		updateData.materialType = receiptData.materialType;
	}

	if (receiptData.transactionType) {
		updateData.transactionType = receiptData.transactionType;
	}

	return await tx.receiptConsumption.update({
		where: { id },
		data: updateData,
	});
};

export const deletereceipt = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting receipt.");
	}
	await tx.receiptConsumption.update({
		where: {
			id: id,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
