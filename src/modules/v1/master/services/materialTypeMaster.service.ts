import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";
import getUserData from "@shared/prisma/queries/getUserById";

export const getAllMaterialTypeMaster = async (
	status: Status,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	// ✅ build where clause dynamically
	const whereClause: any = {
		isActive: true,
	};
	if (status) {
		whereClause.status = status;
	}

	const totalRecords = await tx.equipment.count({
		where: whereClause,
	});

	const result = await prisma.materialTypeMaster.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			name: true,
			materialTypeCode: true,
			isActive: true,
			status: true,
			createdAt: true,
			updatedAt: true,
			createdById: true,
			updatedById: true,
		},
	});

	const data = await Promise.all(
		result.map(async (item) => {
			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;
			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;

			// Rename `name` to `materialType`
			return {
				uuid: item.id,
				materialTypeCode: item.materialTypeCode,
				materialType: item.name,
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdById: item.createdById,
				updatedById: item.updatedById,
				isActive: item.isActive,
				status: item.status,
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

// GET by ID
export const getIdMaterialTypeMaster = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.materialTypeMaster.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			materialTypeCode: true,
			isActive: true,
			status: true,
			createdAt: true,
			updatedAt: true,
			createdById: true,
			updatedById: true,
		},
	});

	if (!item) return null;
	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;
	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;

	return {
		uuid: item.id,
		materialType: item.name,
		materialTypeCode: item.materialTypeCode,
		isActive: item.isActive,
		status: item.status,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdById: item.createdById,
		updatedById: item.updatedById,
		createdUser: createdUser,
		updatedUser: updatedUser,
	};
};

type TMaterialTypeMasterData = {
	name: string;
	materialTypeCode: string;
	isActive?: boolean;
};

export const createMaterialTypeMaster = async (
	data: TMaterialTypeMasterData,
	user: string
) => {
	return await prisma.materialTypeMaster.create({
		data: {
			...data,
			createdById: user,
		},
	});
};

export const updateMaterialTypeMaster = async (
	id: string,
	data: TMaterialTypeMasterData,
	user: string
) => {
	return await prisma.materialTypeMaster.update({
		where: { id },
		data: {
			...data,
			updatedById: user,
		},
	});
};

export const deleteMaterialTypeMaster = async (id: string, user: string) => {
	return await prisma.materialTypeMaster.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
