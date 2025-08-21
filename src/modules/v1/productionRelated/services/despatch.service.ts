import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";

export const getAlldespatch = async (
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.despatch.count();

	const despatch = await tx.despatch.findMany({
		skip,
		take,
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			code: true,
			transactionDate: true,
			materialId: true,
			railQuantity: true,
			roadQuantity: true,
			exportQuantity: true,
			inlandQuantity: true,
			createdAt: true,
			createdById: true,
		},
	});

	// Convert snake_case to camelCase in the result
	const data = despatch.map((item) => ({
		uuid: item.id,
		despatchCode: item.code,
		transactionDate: item.transactionDate
			? new Date(item.transactionDate).toISOString().split("T")[0] // 👈 gives YYYY-MM-DD only
			: null,
		materialId: item.materialId,
		railQuantity: item.railQuantity,
		roadQuantity: item.roadQuantity,
		exportQuantity: item.exportQuantity,
		inlandQuantity: item.inlandQuantity,
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

export const getIddespatch = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.despatch.findUnique({
		where: { id },
		select: {
			id: true,
			code: true,
			transactionDate: true,
			materialId: true,
			railQuantity: true,
			roadQuantity: true,
			exportQuantity: true,
			inlandQuantity: true,
			createdAt: true,
			createdById: true,
		},
	});

	if (!item) {
		throw new Error("despatch not found.");
	}

	const data = {
		uuid: item.id,
		despatchCode: item.code,
		transactionDate: item.transactionDate
			? new Date(item.transactionDate).toISOString().split("T")[0] // 👈 gives YYYY-MM-DD only
			: null,
		materialId: item.materialId,
		railQuantity: item.railQuantity,
		roadQuantity: item.roadQuantity,
		exportQuantity: item.exportQuantity,
		inlandQuantity: item.inlandQuantity,
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

type DespatchData = {
	transactionDate: string; // incoming from req.body
	materialId: string;
	railQuantity?: string;
	roadQuantity?: string;
	exportQuantity?: string;
	inlandQuantity?: string;
};

function parseDDMMYYYY(dateStr: string): Date | null {
	if (!dateStr) return null;
	const [day, month, year] = dateStr.split("-");
	if (!day || !month || !year) return null;
	return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
}

export const createdespatch = async (
	despatchData: DespatchData,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const parsedDate = parseDDMMYYYY(despatchData.transactionDate);
	if (!parsedDate || isNaN(parsedDate.getTime())) {
		throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	}
	return await tx.despatch.create({
		data: {
			materialId: despatchData.materialId,
			transactionDate: parsedDate,
			railQuantity: despatchData.railQuantity
				? Number(despatchData.railQuantity)
				: 0,
			roadQuantity: despatchData.roadQuantity
				? Number(despatchData.roadQuantity)
				: 0,
			exportQuantity: despatchData.exportQuantity
				? Number(despatchData.exportQuantity)
				: 0,
			inlandQuantity: despatchData.inlandQuantity
				? Number(despatchData.inlandQuantity)
				: 0,
			createdById: user,
		},
	});
};

export const updatedespatch = async (
	id: string,
	despatchData: any, // directly from req.body
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for updating despatch.");
	}
	const parsedDate = parseDDMMYYYY(despatchData.transactionDate);
	if (!parsedDate || isNaN(parsedDate.getTime())) {
		throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	}
	return await tx.despatch.update({
		where: { id },
		data: {
			materialId: despatchData.materialId,
			transactionDate: parsedDate,
			railQuantity: despatchData.railQuantity
				? Number(despatchData.railQuantity)
				: 0,
			roadQuantity: despatchData.roadQuantity
				? Number(despatchData.roadQuantity)
				: 0,
			exportQuantity: despatchData.exportQuantity
				? Number(despatchData.exportQuantity)
				: 0,
			inlandQuantity: despatchData.inlandQuantity
				? Number(despatchData.inlandQuantity)
				: 0,
			updatedById: user,
		},
	});
};

export const deletedespatch = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting despatch.");
	}
	await tx.despatch.update({
		where: {
			id: id,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
