import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";
import { Status } from "@prisma/client";
import { extractDateTime } from "../../../../shared/utils/date/index";
import { getDepartmentName, getEquipmentName } from "common/api";
import getUserData from "@shared/prisma/queries/getUserById";

// const formatDate = (date?: Date | null) =>
// 	date ? date.toISOString().replace("T", " ").substring(0, 19) : null;

export const getAllProblemCode = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const totalRecords = await tx.problemCode.count({
		where: { isActive: true },
	});
	const whereClause: any = {
		isActive: true,
		...(status ? { status: status as Status } : {}),
	};

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
			ProblemMaster: {
				select: {
					problemName: true,
				},
			},
		},
	});

	const data = await Promise.all(
		problemCodes.map(async (item) => {
			const equipmentName =
				item.equipmentId && accessToken
					? await getEquipmentName(item.equipmentId, accessToken)
					: null;

			const departmentName =
				item.departmentId && accessToken
					? await getDepartmentName(item.departmentId, accessToken)
					: null;

			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;
			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;

			return {
				uuid: item.id,
				problemId: item.problemId,
				problemName: item.ProblemMaster?.problemName,
				equipmentId: item.equipmentId,
				equipmentName: equipmentName ? equipmentName.name : null,
				departmentId: item.departmentId,
				departmentName: departmentName ? departmentName.name : null,
				problemCode: item.problemcode,
				createdAt: extractDateTime(item.createdAt, "both"),
				createdBy: item.createdById,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedBy: item.updatedById,
				status: item.status,
				isActive: item.isActive,
				createdUser: createdUser,
				updatedUser: updatedUser,
			};
		})
	);

	return { totalRecords, data };
};

export const getIdProblemCode = async (
	id: string,
	accessToken: string,
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
			isActive: true,
			ProblemMaster: {
				select: {
					problemName: true,
				},
			},
		},
	});

	if (!item) throw new Error("Problem code not found.");

	const equipmentName =
		item.equipmentId && accessToken
			? await getEquipmentName(item.equipmentId, accessToken)
			: null;

	const departmentName =
		item.departmentId && accessToken
			? await getDepartmentName(item.departmentId, accessToken)
			: null;

	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;
	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;

	return {
		data: {
			uuid: item.id,
			problemId: item.problemId,
			problemName: item.ProblemMaster?.problemName,
			equipmentId: item.equipmentId,
			equipmentName: equipmentName ? equipmentName.name : null,
			departmentId: item.departmentId,
			departmentName: departmentName ? departmentName.name : null,
			problemCode: item.problemcode,
			createdAt: extractDateTime(item.createdAt, "both"),
			updatedAt: extractDateTime(item.updatedAt, "both"),
			status: item.status,
			isActive: item.isActive,
			createdBy: item.createdById,
			updatedBy: item.updatedById,
			createdUser: createdUser,
			updatedUser: updatedUser,
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

export const getProblemsByDepartment = async (
	departmentId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!departmentId) throw new Error("departmentId is required.");

	return await tx.problem.findMany({
		where: {
			departmentId,
			isActive: true,
			status: "active", // only active ones
		},
		select: {
			id: true,
			problemName: true,
		},
		orderBy: { sortOrder: "asc" },
	});
};
