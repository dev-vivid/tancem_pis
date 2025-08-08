import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";

export const getAllanalysis = async (
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.analysis.count();

	const analysis = await tx.analysis.findMany({
		skip,
		take,
		orderBy: {
			created_at: "desc",
		},
		select: {
			id: true,
			analysis_code: true,
			analysis_type: true,
			description: true,
			created_at: true,
			created_by: true,
		},
	});

	// Convert snake_case to camelCase in the result
	const data = analysis.map((item) => ({
		uuid: item.id,
		analysisCode: item.analysis_code,
		analysisType: item.analysis_type,
		description: item.description,
		createdAt: item.created_at
			? new Date(item.created_at)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		createdBy: item.created_by,
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
			analysis_code: true,
			analysis_type: true,
			description: true,
			created_at: true,
			created_by: true,
		},
	});

	if (!item) {
		throw new Error("Analysis not found.");
	}

	const data = {
		uuid: item.id,
		analysisCode: item.analysis_code,
		analysisType: item.analysis_type,
		description: item.description,
		createdAt: item.created_at
			? new Date(item.created_at)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		createdBy: item.created_by,
	};

	return {
		totalRecords: 1,
		data,
	};
};

export const createAnalysis = async (
	analysisData: { analysisType: string; description?: string },
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { analysisType, description } = analysisData;

	if (!analysisType) {
		throw new Error("Analysis type is required.");
	}

	await tx.analysis.create({
		data: {
			analysis_type: analysisType,
			description: description || null,
			created_by: user,
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
			analysis_type: analysisType,
			description: description || null,
			updated_by: user,
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
			is_active: false,
			updated_by: user,
		},
	});
};
