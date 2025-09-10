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
			transactionTypes: {
				select: {
					id: true,
					name: true,
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
				transactionType: item.transactionType,
				transactionTypeName: item.transactionTypes
					? item.transactionTypes.name
					: null,
				wfRequestId: item.wfRequestId,
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdBy: item.createdById,
				updatedBy: item.updatedById,
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

export const getIdreceipt = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.receiptConsumption.findUnique({
		where: { id },
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
			transactionTypes: {
				select: {
					id: true,
					name: true,
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
		transactionType: item.transactionType,
		transactionTypeName: item.transactionTypes
			? item.transactionTypes.name
			: null,
		wfRequestId: item.wfRequestId,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdBy: item.createdById,
		updatedBy: item.updatedById,
		createdUser: createdUser,
		updatedUser: updatedUser,
	};

	return {
		totalRecords: 1,
		data,
	};
};

type receiptData = {
	transactionDate: string; // incoming from req.body
	quantity: string;
	materialId: string;
	materialType: string;
	transactionType: string;
	initiatorRoleId: string;
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
	// const parsedDate = parseDDMMYYYY(receiptData.transactionDate);
	// if (!parsedDate || isNaN(parsedDate.getTime())) {
	// 	throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	// }
	const wfRequestId = await createWorkflowRequest({
		userId: user,
		initiatorRoleId: receiptData.initiatorRoleId,
		processId: constants.power_workflow_process_ID,
		remarks: receiptData.remarks,
		status: receiptData.status,
	});

	return await tx.receiptConsumption.create({
		data: {
			transactionDate: parseDateOnly(receiptData.transactionDate),
			quantity: receiptData.quantity ? Number(receiptData.quantity) : 0,
			materialId: receiptData.materialId,
			materialType: receiptData.materialType,
			transactionType: receiptData.transactionType,
			wfRequestId,
			createdById: user,
		},
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
	// const parsedDate = parseDDMMYYYY(receiptData.transactionDate);
	// if (!parsedDate || isNaN(parsedDate.getTime())) {
	// 	throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	// }
	return await tx.receiptConsumption.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(receiptData.transactionDate),
			quantity: receiptData.quantity ? Number(receiptData.quantity) : 0,
			materialId: receiptData.materialId,
			materialType: receiptData.materialType,
			transactionType: receiptData.transactionType,
			updatedById: user,
		},
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
