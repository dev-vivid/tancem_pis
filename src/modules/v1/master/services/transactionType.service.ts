import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "@shared/prisma/query.helper";

// 1. Get all transaction types (with pagination)
export const getAllTransactionTypes = async (
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.transactionType.count({
		where: { isActive: true },
	});

	const records = await tx.transactionType.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
		//	code: true,
			name: true,
			createdAt: true,
			updatedAt: true,
			createdById: true,
			updatedById: true,
		},
	});

	const data = records.map((item:{ 
	id: string;
// code: number;
	name: string;
	createdAt: Date;
	createdById: string | null;
	updatedAt:Date
	updatedById:string|null;
}) => ({
		uuid: item.id,
		createdAt: item.createdAt
			? new Date(item.createdAt).toISOString().replace("T", " ").substring(0, 19)
			: null,
		updatedAt:item.updatedAt
			?  new Date(item.updatedAt).toISOString().replace("T"," ").substring(0,19)
			: null
	}));
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
		   //	code: true,
			name: true,
			createdAt: true,
			createdById: true,
		},
	});

	if (!item) {
		throw new Error("Transaction type not found.");
	}

	const data = {
		uuid: item.id,
		//code: item.code,
		name: item.name,
		createdAt: item.createdAt
			? new Date(item.createdAt).toISOString().replace("T", " ").substring(0, 19)
			: null,
		createdById: item.createdById,
	};

	return {
		totalRecords: 1,
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
	transactionTypeData: { name: string },
	userId: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { name } = transactionTypeData;

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





