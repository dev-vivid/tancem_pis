import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";

export const getAllreceipt = async (
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.receiptConsumption.count();

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
			materialId: true,
			materialType: true,
			transactionType: true,
			createdAt: true,
			createdById: true,
		},
	});

	// Convert snake_case to camelCase in the result
	const data = receipt.map((item) => ({
		uuid: item.id,
		receiptCode: item.code,
		transactionDate: item.transactionDate
			? new Date(item.transactionDate).toISOString().split("T")[0] // 👈 gives YYYY-MM-DD only
			: null,
		materialId: item.materialId,
		materialType: item.materialType,
		transactionType: item.transactionType,
		createdAt: item.createdAt
			? new Date(item.createdAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		createdBy: item.createdById,
	}));
	return {
		totalRecords,
		data,
	};
};

export const getIdreceipt = async (
	id: string,
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
			createdAt: true,
			createdById: true,
		},
	});

	if (!item) {
		throw new Error("receipt not found.");
	}

	const data = {
		uuid: item.id,
		receiptCode: item.code,
		transactionDate: item.transactionDate
			? new Date(item.transactionDate).toISOString().split("T")[0] // 👈 gives YYYY-MM-DD only
			: null,
		materialId: item.materialId,
		materialType: item.materialType,
		transactionType: item.transactionType,
		createdAt: item.createdAt
			? new Date(item.createdAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		createdBy: item.createdById,
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
};

function parseDDMMYYYY(dateStr: string): Date | null {
	if (!dateStr) return null;
	const [day, month, year] = dateStr.split("-");
	if (!day || !month || !year) return null;
	return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
}

export const createreceipt = async (
	receiptData: receiptData,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const parsedDate = parseDDMMYYYY(receiptData.transactionDate);
	if (!parsedDate || isNaN(parsedDate.getTime())) {
		throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	}
	return await tx.receiptConsumption.create({
		data: {
			transactionDate: parsedDate,
			quantity: receiptData.quantity ? Number(receiptData.quantity) : 0,
			materialId: receiptData.materialId,
			materialType: receiptData.materialType,
			transactionType: receiptData.transactionType,
			wfRequestId: "",
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
	const parsedDate = parseDDMMYYYY(receiptData.transactionDate);
	if (!parsedDate || isNaN(parsedDate.getTime())) {
		throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	}
	return await tx.receiptConsumption.update({
		where: { id },
		data: {
			transactionDate: parsedDate,
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
