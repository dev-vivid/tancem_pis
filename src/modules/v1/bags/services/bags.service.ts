import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

// Get all bags
export const getAllBags = async (
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const totalRecords = await tx.bags.count();

	const bags = await tx.bags.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		where: { isActive: true, },
		select: {
			id: true,
			code: true,
			transactionDate: true,
			materialId: true,
			opc: true,
			ppc: true,
			src: true,
			burstopc: true,
			burstppc: true,
			burstsrc: true,
			export: true,
			deport: true,
			transferQty: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true
		},
	});

	const data = bags.map(item => ({
		...item,
		transactionDate: item.transactionDate.toISOString().substring(0, 10),
		createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
		updatedAt: item.updatedAt.toISOString().replace("T", " ").substring(0, 19)
	}));

	return { totalRecords, data };
};

// Get bags by ID
export const getIdBags = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const bag = await tx.bags.findUnique({
		where: { id, isActive: true },
		select: {
			id: true,
			code: true,
			transactionDate: true,
			materialId: true,
			opc: true,
			ppc: true,
			src: true,
			burstopc: true,
			burstppc: true,
			burstsrc: true,
			export: true,
			deport: true,
			transferQty: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true
		},
	});

	if (!bag) throw new Error("Bags record not found");

	const data = {
		...bag,
		transactionDate: bag.transactionDate.toISOString().substring(0, 10),
		createdAt: bag.createdAt.toISOString().replace("T", " ").substring(0, 19),
		updatedAt: bag.updatedAt.toISOString().replace("T", " ").substring(0, 19)
	};

	return { data };
};

// Create bags
export const createBags = async (
	bagsData: {
		transactionDate: Date;
		materialId: string;
		opc: number;
		ppc: number;
		src: number;
		burstopc: number;
		burstppc: number;
		burstsrc: number;
		export: number;
		deport: number;
		transferQty: number;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	await tx.bags.create({
		data: {
			...bagsData,
			transactionDate: new Date(bagsData.transactionDate),
			createdById: user,
			createdAt: new Date()
		}
	});
};

// Update bags
export const updateBags = async (
	id: string,
	bagsData: {
		transactionDate: Date;
		materialId: string;
		opc: number;
		ppc: number;
		src: number;
		burstopc: number;
		burstppc: number;
		burstsrc: number;
		export: number;
		deport: number;
		transferQty: number;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("ID is required for updating bags record.");

	await tx.bags.update({
		where: { id },
		data: {
			...bagsData,
			transactionDate: new Date(bagsData.transactionDate),
			updatedById: user,
			updatedAt: new Date()
		}
	});
};

// Soft delete bags
export const deleteBags = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("ID is required for deleting bags record.");

	await tx.bags.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
			updatedAt: new Date()
		}
	});
};
