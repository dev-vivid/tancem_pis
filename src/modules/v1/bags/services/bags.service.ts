import { getMaterialName } from "common/api";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import { userManagementDb } from "@shared/prisma/second_db";
import getUserData from "@shared/prisma/queries/getUserById";

// Get all bags
export const getAllBags = async (
	accessToken: string,
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
		where: { isActive: true },
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
			isActive: true,
		},
	});
	// getUserData(bags[0].createdById || "");

	const data = await Promise.all(
		bags.map(async (item) => {
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

			return {
				uuid: item.id,
				code: item.code,
				materialId: item.materialId,
				materialName: materialName ? materialName.name : null,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				opc: item.opc,
				ppc: item.ppc,
				src: item.src,
				burstopc: item.burstopc,
				burstppc: item.burstppc,
				burstsrc: item.burstsrc,
				export: item.export,
				deport: item.deport,
				transferQty: item.transferQty,
				createdAt: extractDateTime(item.createdAt, "both"),
				createdBy: item.createdById,
				createdUser: createdUser,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedBy: item.updatedById,
				updatedUser: updatedUser,
				isActive: item.isActive,
			};
		})
	);

	return { totalRecords, data };
};

// Get bags by ID
export const getIdBags = async (
	id: string,
	accessToken: string,
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
			isActive: true,
		},
	});

	if (!bag) throw new Error("Bags record not found");

	const materialName =
		bag.materialId && accessToken
			? await getMaterialName(bag.materialId, accessToken)
			: null;

	const createdUser = bag.createdById
		? await getUserData(bag.createdById)
		: null;
	const updatedUser = bag.updatedById
		? await getUserData(bag.updatedById)
		: null;

	const data = {
		uuid: bag.id,
		code: bag.code,
		transactionDate: extractDateTime(bag.transactionDate, "date"),
		materialId: bag.materialId,
		materialName: materialName ? materialName.name : null,
		opc: bag.opc,
		ppc: bag.ppc,
		src: bag.src,
		burstopc: bag.burstopc,
		burstppc: bag.burstppc,
		burstsrc: bag.burstsrc,
		export: bag.export,
		deport: bag.deport,
		transferQty: bag.transferQty,
		createdAt: extractDateTime(bag.createdAt, "both"),
		createdById: bag.createdById,
		createdUser: createdUser,
		updatedAt: extractDateTime(bag.updatedAt, "both"),
		updatedById: bag.updatedById,
		updatedUser: updatedUser,
		isActive: bag.isActive,
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
			transactionDate: parseDateOnly(bagsData.transactionDate),
			createdById: user,
		},
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
			transactionDate: parseDateOnly(bagsData.transactionDate),
			updatedById: user,
		},
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
		},
	});
};
