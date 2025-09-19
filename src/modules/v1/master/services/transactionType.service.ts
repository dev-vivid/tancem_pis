import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import getUserData from "@shared/prisma/queries/getUserById";
import { pageConfig } from "@shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";
import { it } from "node:test";

// 1. Get all transaction types (with pagination)
export const getAllTransactionTypes = async (
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
	};

	const totalRecords = await tx.transactionType.count({
		where: { isActive: true },
	});

	const records = await tx.transactionType.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			code: true,
			name: true,
			createdAt: true,
			updatedAt: true,
			createdById: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	const data = await Promise.all(
		records.map(async ({ createdAt, updatedAt, ...rest }) => {
			const createdUser = rest.createdById
				? await getUserData(rest.createdById)
				: null;

			const updatedUser = rest.updatedById
				? await getUserData(rest.updatedById)
				: null;

			return {
				...rest,
				createdAt: extractDateTime(createdAt, "both"),
				updatedAt: extractDateTime(updatedAt, "both"),
				createdUser: createdUser?.userName,
				updatedUser: updatedUser?.userName,
			};
		})
	);

	return {
		totalRecords,
		data,
	};
};

// 2. Get transaction type by ID
export const getTransactionTypeById = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.transactionType.findUnique({
		where: { id },
		select: {
			id: true,
			code: true,
			name: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	if (!item) {
		throw new Error("Transaction type not found.");
	}

	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;
	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;

	const data = {
		uuid: item.id,
		code: item.code,
		name: item.name,
		createdAt: extractDateTime(item.createdAt, "both"),
		createdById: item.createdById,
		updatedAt: item.updatedAt,
		updatedById: item.updatedById,
		status: item.status,
		isActive: item.isActive,
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
	};

	return {
		data,
	};
};

// 3. Create transaction type
export const createTransactionType = async (
	transactionTypeData: { name: string },
	userId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { name } = transactionTypeData;

	if (!name) {
		throw new Error("Name is required.");
	}

	await tx.transactionType.create({
		data: {
			name,
			createdById: userId,
		},
	});
};

// 4. Update transaction type
export const updateTransactionType = async (
	id: string,
	transactionTypeData: { name: string; status: Status },
	userId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { name, status } = transactionTypeData;

	if (!id) {
		throw new Error("ID is required for updating.");
	}

	if (!name) {
		throw new Error("Name is required.");
	}

	await tx.transactionType.update({
		where: { id },
		data: {
			name,
			status,
			updatedById: userId,
		},
	});
};

// 5. Soft delete transaction type
export const deleteTransactionType = async (
	id: string,
	userId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting.");
	}

	await tx.transactionType.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: userId,
		},
	});
};
