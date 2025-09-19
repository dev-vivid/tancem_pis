import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "../../../../shared/utils/date/index";
import { Status } from "@prisma/client";
import { getMaterialName } from "common/api";
import getUserData from "@shared/prisma/queries/getUserById";

export const createMaterialType = async (
	materialTypeData: {
		materialId: string;
		materialTypeMasterId: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { materialId, materialTypeMasterId } = materialTypeData;

	const create = await tx.materialType.create({
		data: {
			materialId,
			materialTypeMasterId,
			createdById: user,
		},
	});
};

export const updateMaterialType = async (
	id: string,
	updateMaterialTypeData: {
		materialId: string;
		materialTypeMasterId: string;
		status: Status;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { materialId, materialTypeMasterId, status } = updateMaterialTypeData;

	if (!user) {
		throw new Error("User is not Authorized");
	}

	await tx.materialType.update({
		where: { id },
		data: {
			materialId,
			materialTypeMasterId,
			status,
			updatedById: user,
		},
	});
};

export const getAllMaterialType = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const whereClause: any = {
		isActive: true,
		...(status ? { status: status as Status } : {}),
	};

	const result = await tx.materialType.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			code: true,
			materialId: true,
			materialTypeMasterId: true,
			status: true,
			updatedAt: true,
			createdAt: true,
			createdById: true,
			updatedById: true,
			isActive: true,
			materialTypeMaster: {
				select: {
					name: true,
					materialTypeCode: true,
				},
			},
		},
	});

	const data = await Promise.all(
		result.map(async (item) => {
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
				materialTypeMasterId: item.materialTypeMasterId,
				materialTypeMasterDetails: {
					name: item.materialTypeMaster?.name || null,
					materialTypeCode: item.materialTypeMaster?.materialTypeCode || null,
				},
				createdAt: extractDateTime(item.createdAt, "both"),
				createdBy: item.createdById,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedBy: item.updatedById,
				isActive: item.isActive,
				status: item.status,
				createdUser: createdUser?.userName,
				updatedUser: updatedUser?.userName,
			};
		})
	);

	return data;
};

export const getByID = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const result = await tx.materialType.findUnique({
		where: { id },
		select: {
			id: true,
			code: true,
			materialId: true,
			materialTypeMasterId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
			materialTypeMaster: {
				select: {
					name: true,
					materialTypeCode: true,
				},
			},
		},
	});

	if (!result) {
		throw new Error("materialType not found");
	}

	const materialName =
		result.materialId && accessToken
			? await getMaterialName(result.materialId, accessToken)
			: null;

	const createdUser = result.createdById
		? await getUserData(result.createdById)
		: null;
	const updatedUser = result.updatedById
		? await getUserData(result.updatedById)
		: null;

	const data = {
		id: result.id,
		code: result.code,
		materialId: result.materialId,
		materialName: materialName ? materialName.name : null,
		materialTypeMasterId: result.materialTypeMasterId,
		materialTypeMasterDetails: {
			name: result.materialTypeMaster?.name || null,
			materialTypeCode: result.materialTypeMaster?.materialTypeCode || null,
		},
		createdAt: extractDateTime(result.createdAt, "both"),
		createdById: result.createdById,
		updatedAt: extractDateTime(result.updatedAt, "both"),
		updatedById: result.updatedById,
		isActive: result.isActive,
		status: result.status,
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
	};

	return {
		data,
	};
};

export const deleteMaterialType = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting.");
	}

	await tx.materialType.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};

export const getMaterialsByMaterialTypeId = async (
	materialTypeId: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const materialTypes = await tx.materialType.findMany({
		where: { materialTypeMasterId: materialTypeId, isActive: true },
		select: { materialId: true },
	});

	// Fetch material names from external API
	const materials = await Promise.all(
		materialTypes.map(async (mt) => {
			if (mt.materialId && accessToken) {
				const material = await getMaterialName(mt.materialId, accessToken);
				return {
					id: mt.materialId,
					name: material ? material.name : null,
				};
			}
			return null;
		})
	);

	// remove nulls
	return materials.filter(Boolean);
};
