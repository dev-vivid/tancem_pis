import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";
import { Status } from "@prisma/client";
import { extractDateTime } from "../../../../shared/utils/date/index";

const formatDate = (date?: Date | null) =>
	date ? date.toISOString().replace("T", " ").substring(0, 19) : null;

export const getAllProblemCode = async (
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	// const totalRecords = await tx.problemCode.count();
	const whereClause: any = {
			isActive: true,
			...(status ? { status: status as Status } : {})
	}

	const problemCodes = await tx.problemCode.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		where: whereClause,
		select: {
			id: true,
			problemId: true,
			equipmentId: true,
			departmentId: true,
			problemcode: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});
	const totalRecords = problemCodes.length;
	return {
		totalRecords,
		data: problemCodes.map((item) => ({
			uuid: item.id,
			problemId: item.problemId,
			equipmentId: item.equipmentId,
			departmentId: item.departmentId,
			problemCode: item.problemcode,
			createdAt: extractDateTime(item.createdAt, "both"),
			createdBy: item.createdById,
			updatedAt: extractDateTime(item.updatedAt, "both"),
			updatedBy: item.updatedById,
			status: item.status,
			isActive: item.isActive,
		})),
	};
};

export const getIdProblemCode = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.problemCode.findUnique({
		where: { id },
		select: {
			id: true,
			problemId: true,
			equipmentId: true,
			departmentId: true,
			problemcode: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true
		},
	});

	if (!item) throw new Error("Problem code not found.");

	return {
		totalRecords: 1,
		data: {
			uuid: item.id,
			problemId: item.problemId,
			equipmentId: item.equipmentId,
			departmentId: item.departmentId,
			problemCode: item.problemcode,
			createdAt: extractDateTime(item.createdAt, "both"),
			updatedAt: extractDateTime(item.updatedAt, "both"),
			status: item.status,
			isActive: item.isActive,
			createdBy: item.createdById,
		},
	};
};

export const createProblemCode = async (
	problemCodeData: {
		problemId: string;
		equipmentId: string;
		departmentId: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { problemId, equipmentId, departmentId } = problemCodeData;

	if (!problemId) throw new Error("problemId is required.");
	if (!equipmentId) throw new Error("equipmentId is required.");
	if (!departmentId) throw new Error("departmentId is required.");

	const lastRecord = await tx.problemCode.findFirst({
		orderBy: { problemcode: "desc" },
		select: { problemcode: true },
	});

	const newProblemCode = (lastRecord?.problemcode ?? 0) + 1;

	await tx.problemCode.create({
		data: {
			problemcode: newProblemCode,
			problemId,
			equipmentId,
			departmentId,
			createdById: user,
		},
	});
};

export const updateProblemCode = async (
	id: string,
	problemCodeData: {
		problemId: string;
		equipmentId: string;
		departmentId: string;
		status: Status;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { problemId, equipmentId, departmentId, status } = problemCodeData;

	if (!id) throw new Error("ID is required.");
	if (!problemId) throw new Error("problemId is required.");
	if (!equipmentId) throw new Error("equipmentId is required.");
	if (!departmentId) throw new Error("departmentId is required.");

	await tx.problemCode.update({
		where: { id },
		data: {
			problemId,
			equipmentId,
			departmentId,
			status,
			updatedById: user,
		},
	});
};

export const deleteProblemCode = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("ID is required for delete");

	await tx.problemCode.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
