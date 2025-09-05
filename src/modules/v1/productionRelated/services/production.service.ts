import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";

export const getAllproduction = async (
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.production.count();

	const production = await tx.production.findMany({
		skip,
		take,
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			code: true,
			transactionDate: true,
			equipmentId: true,
			materialId: true,
			runningHours: true,
			quantity: true,
			fuelConsumption: true,
			remarks: true,
			createdAt: true,
			createdById: true,
		},
	});

	// Convert snake_case to camelCase in the result
	const data = production.map((item) => ({
		uuid: item.id,
		productionCode: item.code,
		transactionDate: item.transactionDate
			? new Date(item.transactionDate).toISOString().split("T")[0] // 👈 gives YYYY-MM-DD only
			: null,
		equipmentId: item.equipmentId,
		materialId: item.materialId,
		runningHours: item.runningHours,
		quantity: item.quantity,
		fuelConsumption: item.fuelConsumption,
		remarks: item.remarks,
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

export const getIdproduction = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.production.findUnique({
		where: { id },
		select: {
			id: true,
			code: true,
			transactionDate: true,
			equipmentId: true,
			materialId: true,
			runningHours: true,
			quantity: true,
			fuelConsumption: true,
			remarks: true,
			createdAt: true,
			createdById: true,
		},
	});

	if (!item) {
		throw new Error("production not found.");
	}

	const data = {
		uuid: item.id,
		productionCode: item.code,
		transactionDate: item.transactionDate
			? new Date(item.transactionDate).toISOString().split("T")[0] // 👈 gives YYYY-MM-DD only
			: null,
		equipmentId: item.equipmentId,
		materialId: item.materialId,
		runningHours: item.runningHours,
		quantity: item.quantity,
		fuelConsumption: item.fuelConsumption,
		remarks: item.remarks,
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

type productionData = {
	transactionDate: string; // incoming from req.body
	equipmentId: string;
	materialId: string;
	runningHours: string;
	quantity: string;
	fuelConsumption?: string;
	remarks?: string;
};

function parseDDMMYYYY(dateStr: string): Date | null {
	if (!dateStr) return null;
	const [day, month, year] = dateStr.split("-");
	if (!day || !month || !year) return null;
	return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
}

export const createproduction = async (
	productionData: productionData,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const parsedDate = parseDDMMYYYY(productionData.transactionDate);
	if (!parsedDate || isNaN(parsedDate.getTime())) {
		throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	}
	return await tx.production.create({
		data: {
			transactionDate: parsedDate,
			equipmentId: productionData.equipmentId,
			materialId: productionData.materialId,
			runningHours: productionData.runningHours,
			wfRequestId: "",
			quantity: productionData.quantity ? Number(productionData.quantity) : 0,
			fuelConsumption: productionData.fuelConsumption
				? Number(productionData.fuelConsumption)
				: 0,
			remarks: productionData.remarks,
			createdById: user,
		},
	});
};

export const updateproduction = async (
	id: string,
	productionData: any, // directly from req.body
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for updating production.");
	}
	const parsedDate = parseDDMMYYYY(productionData.transactionDate);
	if (!parsedDate || isNaN(parsedDate.getTime())) {
		throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	}
	return await tx.production.update({
		where: { id },
		data: {
			transactionDate: parsedDate,
			equipmentId: productionData.equipmentId,
			materialId: productionData.materialId,
			runningHours: productionData.runningHours,
			quantity: productionData.quantity ? Number(productionData.quantity) : 0,
			fuelConsumption: productionData.fuelConsumption
				? Number(productionData.fuelConsumption)
				: 0,
			remarks: productionData.remarks,
			updatedById: user,
		},
	});
};

export const deleteproduction = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting production.");
	}
	await tx.production.update({
		where: {
			id: id,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
