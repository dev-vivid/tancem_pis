import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import { getMaterialName } from "common/api";
import {
	createWorkflowRequest,
	fetchClosedWorkflowIdsWithoutRole,
	getCurrentState,
	getNextAction,
	getRemarks,
} from "common/workflow";
import getUserData from "@shared/prisma/queries/getUserById";
import { constants } from "@config/constant";

export const getAlldespatch = async (
	accessToken: string,
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.despatch.count({
		where: {
			isActive: true,
		},
	});

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
			wfRequestId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
		},
	});

	// Convert snake_case to camelCase in the result
	const data = await Promise.all(
		despatch.map(async (item) => {
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
				despatchCode: item.code,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				materialId: item.materialId,
				materialName: materialName ? materialName.name : null,
				railQuantity: item.railQuantity,
				roadQuantity: item.roadQuantity,
				exportQuantity: item.exportQuantity,
				inlandQuantity: item.inlandQuantity,
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

export const getIddespatch = async (
	id: string,
	accessToken: string,
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
			updatedAt: true,
			updatedById: true,
		},
	});

	if (!item) {
		throw new Error("despatch not found.");
	}

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

	const data = {
		uuid: item.id,
		despatchCode: item.code,
		transactionDate: extractDateTime(item.transactionDate, "date"),
		materialId: item.materialId,
		materialName: materialName ? materialName.name : null,
		railQuantity: item.railQuantity,
		roadQuantity: item.roadQuantity,
		exportQuantity: item.exportQuantity,
		inlandQuantity: item.inlandQuantity,
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

type DespatchData = {
	transactionDate: string; // incoming from req.body
	materialId: string;
	railQuantity?: string;
	roadQuantity?: string;
	exportQuantity?: string;
	inlandQuantity?: string;
	initiatorRoleId: string;
	remarks: string;
	status: string;
};

// function parseDDMMYYYY(dateStr: string): Date | null {
// 	if (!dateStr) return null;
// 	const [day, month, year] = dateStr.split("-");
// 	if (!day || !month || !year) return null;
// 	return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
// }

export const createdespatch = async (
	despatchData: DespatchData,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// const parsedDate = parseDDMMYYYY(despatchData.transactionDate);
	// if (!parsedDate || isNaN(parsedDate.getTime())) {
	// 	throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	// }
	const wfRequestId = await createWorkflowRequest({
		userId: user,
		initiatorRoleId: despatchData.initiatorRoleId,
		processId: constants.power_workflow_process_ID,
		remarks: despatchData.remarks,
		status: despatchData.status,
	});
	return await tx.despatch.create({
		data: {
			materialId: despatchData.materialId,
			transactionDate: parseDateOnly(despatchData.transactionDate),
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
			wfRequestId,
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
	// const parsedDate = parseDDMMYYYY(despatchData.transactionDate);
	// if (!parsedDate || isNaN(parsedDate.getTime())) {
	// 	throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	// }
	return await tx.despatch.update({
		where: { id },
		data: {
			materialId: despatchData.materialId,
			transactionDate: parseDateOnly(despatchData.transactionDate),
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
