import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "../../../../shared/utils/date/index";
import * as api from "../../../../common/api";
import getUserData from "@shared/prisma/queries/getUserById";

import path from "path";

export const getAllanalysis = async (
	accessToken: string,
	materialId?: string,
	pageNumber?: number,
	pageSize?: number,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const whereClause: any = {
		isActive: true,
		...(status ? { status: status as Status } : {}),
		...(materialId ? { materialId } : {}),
	};

	const totalRecords = await tx.analysis.count({
		where: whereClause,
	});
	const analysis = await tx.analysis.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			code: true,
			type: true,
			description: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	// Convert snake_case to camelCase in the result
	const data = await Promise.all(
		analysis.map(async (item) => {
			const materialObj = item.materialId
				? await api.getMaterialName(item.materialId, accessToken)
				: null;
			// const equipmentName = item.equipmentId
			// 	? await api.getEquipmentName(item.equipmentId, accessToken)
			// 	: null;
			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;
			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;
			return {
				...item,
				materialName: materialObj?.name || "",
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
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

// export const getMaterialAnalysis = async (
// 	materialId: string,
// 	// pageNumber?: number,
// 	// pageSize?: number,
// 	// status?: string,
// 	tx: IPrismaTransactionClient | typeof prisma = prisma
// ) => {
// 	// const { skip, take } = pageConfig({
// 	// 	pageNumber: pageNumber?.toString(),
// 	// 	pageSize: pageSize?.toString(),
// 	// });

// 	const whereClause: any = {
// 		isActive: true,
// 		...(status ? { status: status as Status } : {}),
// 	};

// 	const totalRecords = await tx.analysis.count();

// 	const analysis = await tx.analysis.findMany({
// 		// skip,
// 		// take,
// 		where: whereClause,
// 		orderBy: {
// 			createdAt: "desc",
// 		},
// 		select: {
// 			id: true,
// 			code: true,
// 			type: true,
// 			description: true,
// 			materialId: true,
// 			createdAt: true,
// 			createdById: true,
// 			updatedAt: true,
// 			updatedById: true,
// 			status: true,
// 			isActive: true,
// 		},
// 	});

// 	// Convert snake_case to camelCase in the result
// 	const data = await Promise.all(
// 		analysis.map(async (item) => {
// 			const materialObj = item.materialId
// 				? await api.getMaterialName(item.materialId, accessToken)
// 				: null;
// 			// const equipmentName = item.equipmentId
// 			// 	? await api.getEquipmentName(item.equipmentId, accessToken)
// 			// 	: null;
// 			return {
// 				...item,
// 				materialName: materialObj?.productDescription || "",
// 				createdAt: item.createdAt
// 					.toISOString()
// 					.replace("T", " ")
// 					.substring(0, 19),
// 			};
// 		})
// 	);

// 	return {
// 		totalRecords,
// 		data,
// 	};
// };

export const getIdanalysis = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// console.log("🔍 Searching for Analysis ID:", id);

	const item = await tx.analysis.findUnique({
		where: { id: id.trim() },
		select: {
			id: true,
			code: true,
			type: true,
			description: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	// console.log(" Prisma Result:", item);

	if (!item) {
		throw new Error(`Analysis not found for ID: ${id}`);
	}

	// console.log(" Found Analysis:", item.id);

	const materialName = item.materialId
		? await api.getMaterialName(item.materialId, accessToken)
		: null;

	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;
	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;

	// console.log(" Material Name:", materialName);

	const data = {
		uuid: item.id,
		analysisCode: item.code,
		analysisType: item.type,
		description: item.description,
		materialId: item.materialId,
		materialName: materialName?.name || "",
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"), // fixed field name
		createdBy: item.createdById,
		updatedBy: item.updatedById,
		createdUser: createdUser,
		updatedUser: updatedUser,
		status: item.status,
		isActive: item.isActive,
	};

	return { data };
};

export const createAnalysis = async (
	analysisData: {
		analysisType: string;
		description?: string;
		materialId: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { analysisType, description, materialId } = analysisData;

	if (!analysisType) {
		throw new Error("Analysis type is required.");
	}

	await tx.analysis.create({
		data: {
			type: analysisType,
			description: description || null,
			materialId,
			createdById: user,
		},
	});
};

export const updateAnalysis = async (
	id: string,
	analysisData: {
		analysisType: string;
		description?: string;
		materialId: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { analysisType, description, materialId } = analysisData;

	if (!id) {
		throw new Error("ID is required for updating analysis.");
	}

	if (!analysisType) {
		throw new Error("Analysis type is required.");
	}

	await tx.analysis.update({
		where: {
			id: id,
		},
		data: {
			type: analysisType,
			description: description || null,
			materialId,
			updatedById: user,
		},
	});
};

export const deleteAnalysis = async (
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
