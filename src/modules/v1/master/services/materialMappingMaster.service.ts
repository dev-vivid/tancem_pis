// src/modules/v1/master/services/materialMapping.service.ts

import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";
import { getOfficeName } from "common/api";
import { Request } from "express";
import { getAllMaterialMapUsecase } from "../usecases/materialMappingMaster.usecase";

// src/modules/v1/master/services/materialMappingMaster.service.ts

type TMaterialMappingData = {
	materialMasterId: string;
	sourceId: string;
	status?: Status;
};

export const getAllMaterialmap = async (
	accessToken: string,
	status: string, // 🆕 Added
	pageNumber?: string, // 🔄 Changed type from number → string
	pageSize?: string, // 🔄 Changed type from number → string
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });
	//  Count total records
	const totalRecords = await tx.materialMappingMaster.count({
		where: { isActive: true },
	});

	const records = await tx.materialMappingMaster.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			//code: true,

			materialMasterId: true,
			sourceId: true,
			status: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	const data = await Promise.all(
		records.map(async (item) => {
			const sourceName =
				item.sourceId && accessToken
					? await getOfficeName(item.sourceId, accessToken)
					: null;
			const office = sourceName.find((o: any) => o.id === item.sourceId);

			// console.log(sourceName);

			return {
				uuid: item.id,
				materialMasterId: item.materialMasterId,
				sourceId: item.sourceId,
				sourceName: office ? office.name : null,
				status: item.status,
				createdAt: extractDateTime(item.createdAt, "both"),
				createdById: item.createdById,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedById: item.updatedById,
				isActive: item.isActive,
			};
		})
	);

	return {
		totalRecords,
		data,
	};
};

// Get material mapping by ID (improved)

export const getMaterialMappingById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.materialMappingMaster.findUnique({
		where: { id, isActive: true },
		select: {
			id: true,
			code: true,
			materialMasterId: true,
			sourceId: true,
			status: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	if (!item) throw new Error("Material mapping not found");

	//  Fetch plant/source name from another service
	const sourceName =
		item.sourceId && accessToken
			? await getOfficeName(item.sourceId, accessToken) // <-- implement like getMaterialName
			: null;

	const data = {
		uuid: item.id,
		materialMasterId: item.materialMasterId,
		sourceId: item.sourceId,
		sourceName: sourceName ? sourceName.officeDescription : null,
		status: item.status,
		isActive: item.isActive,
		createdAt: item.createdAt
			? new Date(item.createdAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		updatedAt: item.updatedAt
			? new Date(item.updatedAt)
					.toISOString()
					.replace("T", " ")
					.substring(0, 19)
			: null,
		createdById: item.createdById,
		updatedById: item.updatedById,
	};

	return {
		totalRecords: 1,
		data,
	};
};

// Create material mapping
export const createMaterialMapping = async (
	mappingData: TMaterialMappingData,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { materialMasterId, sourceId } = mappingData;

	if (!materialMasterId) throw new Error("materialId is required");
	if (!sourceId) throw new Error("sourceId is required");

	return await tx.materialMappingMaster.create({
		data: {
			materialMasterId: materialMasterId,
			sourceId,
			createdById: user,
		},
	});
};

// Update material mapping
export const updateMaterialMapping = async (
	id: string,
	mappingData: Partial<TMaterialMappingData>,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("ID is required for updating material mapping");

	return await tx.materialMappingMaster.update({
		where: { id },
		data: {
			...mappingData,
			updatedById: user,
		},
	});
};

// Soft delete material mapping
export const deleteMaterialMapping = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("ID is required for deleting material mapping");

	return await tx.materialMappingMaster.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
