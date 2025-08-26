import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "../../../../shared/utils/date/index";
import path from "path";

export const getAllanalysis = async (
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
			...(status ? { status: status as Status } : {})
	}

	const totalRecords = await tx.analysis.count();

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
			isActive: true
		},
	});

	// Convert snake_case to camelCase in the result
	const data = analysis.map((item) => ({
		uuid: item.id,
		analysisCode: item.code,
		analysisType: item.type,
		description: item.description,
		materialId: item.materialId,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedId: extractDateTime(item.updatedAt, "both"),
		createdBy: item.createdById,
		updatedBy: item.updatedById,
		status: item.status,
		isActive: item.isActive
	}));

	return {
		totalRecords,
		data,
	};
};

export const getIdanalysis = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.analysis.findUnique({
		where: {
			id: id,
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
			isActive: true

		},
	});

	if (!item) {
		throw new Error("Analysis not found.");
	}

	const data = {
		uuid: item.id,
		analysisCode: item.code,
		analysisType: item.type,
		description: item.description,
		materialId: item.materialId,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedId: extractDateTime(item.updatedAt, "both"),
		createdBy: item.createdById,
		updatedBy: item.updatedById,
		status: item.status,
		isActive: item.isActive
	};

	return {
		data
	};
};

export const createAnalysis = async (
	analysisData: { analysisType: string; description?: string; materialId: string },
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { analysisType, description, materialId} = analysisData;

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
	analysisData: { analysisType: string; description?: string },
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { analysisType, description } = analysisData;

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
