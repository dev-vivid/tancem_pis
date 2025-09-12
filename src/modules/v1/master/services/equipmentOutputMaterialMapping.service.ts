import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";
import getUserData from "@shared/prisma/queries/getUserById";
import { getEquipmentName, getMaterialName } from "common/api";

// ✅ Get all mappings
export const getAllEquipmentOutputMaterialMappings = async (
	accessToken: string,
	equipmentId?: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const whereClause: any = {
		isActive: true,
		...(status ? { status: status as Status } : {}),
		...(equipmentId ? { equipmentId } : {}),

	};

	const totalRecords = await tx.equipmentOutputMaterialMapping.count({
		where: whereClause,
	});

	const records = await tx.equipmentOutputMaterialMapping.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			code: true,
			equipmentId: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	const data = await Promise.all(
		records.map(async (item) => {
			const equipment =
				item.equipmentId && accessToken
					? await getEquipmentName(item.equipmentId, accessToken)
					: null;

			const material =
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
				equipmentId: item.equipmentId,
				equipmentName: equipment?.name || null,
				materialId: item.materialId,
				materialName: material?.name || null,
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
				createdUser: createdUser,
				updatedUser: updatedUser,
				status: item.status,
				isActive: item.isActive,
			};
		})
	);

	return { totalRecords, data };
};

// ✅ Get mapping by ID
export const getEquipmentOutputMaterialMappingById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const record = await tx.equipmentOutputMaterialMapping.findUnique({
		where: { id },
		select: {
			id: true,
			code: true,
			equipmentId: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true,
		},
	});

	if (!record) throw new Error("Mapping not found");

	const equipment =
		record.equipmentId && accessToken
			? await getEquipmentName(record.equipmentId, accessToken)
			: null;

	const material =
		record.materialId && accessToken
			? await getMaterialName(record.materialId, accessToken)
			: null;

	const createdUser = record.createdById
		? await getUserData(record.createdById)
		: null;
	const updatedUser = record.updatedById
		? await getUserData(record.updatedById)
		: null;

	const data = {
		uuid: record.id,
		code: record.code,
		equipmentId: record.equipmentId,
		equipmentName: equipment?.name || null,
		materialId: record.materialId,
		materialName: material?.name || null,
		createdAt: extractDateTime(record.createdAt, "both"),
		updatedAt: extractDateTime(record.updatedAt, "both"),
		createdUser: createdUser,
		updatedUser: updatedUser,
		status: record.status,
		isActive: record.isActive,
	};

	return { data };
};

// ✅ Create mapping
// Create multiple mappings
export const createEquipmentOutputMaterialMapping = async (
	mappingsWrapper: { mappings: { equipmentId: string; materialId: string }[] },
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { mappings } = mappingsWrapper;

	if (!mappings || mappings.length === 0) {
		throw new Error("At least one mapping is required");
	}

	const records = await tx.equipmentOutputMaterialMapping.createMany({
		data: mappings.map((mapping) => ({
			equipmentId: mapping.equipmentId,
			materialId: mapping.materialId,
			createdById: user,
		})),
		skipDuplicates: true,
	});

	// return records;
};

// ✅ Update multiple mappings
export const updateEquipmentOutputMaterialMapping = async (
	id: string,
	mappingsWrapper: {
		mappings: {
			equipmentId?: string;
			materialId?: string;
			status: Status;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { mappings } = mappingsWrapper;

	if (!mappings || mappings.length === 0) {
		throw new Error("At least one mapping is required for update");
	}

	const updatePromises = mappings.map((mapping) =>
		tx.equipmentOutputMaterialMapping.update({
			where: { id },
			data: {
				equipmentId: mapping.equipmentId,
				materialId: mapping.materialId,
				status: mapping.status,
				updatedById: user,
			},
		})
	);

	// Execute all updates in parallel
	const updatedRecords = await Promise.all(updatePromises);

	// return updatedRecords;
};

// ✅ Soft delete mapping
export const deleteEquipmentOutputMaterialMapping = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("ID is required for deleting mapping");

	await tx.equipmentOutputMaterialMapping.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
