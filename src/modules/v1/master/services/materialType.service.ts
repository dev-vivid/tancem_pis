import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "../../../../shared/utils/date/index";
import { Status } from "@prisma/client";
import { getMaterialName } from "common/api";


export const createMaterialType = async (
	materialTypeData: {
		materialId: string,
		materialTypeMasterId: string,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {

	const {materialId, materialTypeMasterId} = materialTypeData;

	const create = await tx.materialType.create({
		data: {
			materialId,
			materialTypeMasterId,
			createdById: user,
		}
	});
};

export const updateMaterialType = async (
	id: string,
	updateMaterialTypeData: {
		materialId: string,
		materialTypeMasterId: string,
		status: Status;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	const {materialId, materialTypeMasterId, status} = updateMaterialTypeData;

	if(!user){
		throw new Error("User is not Authorized");
	}

	await tx.materialType.update({
		where: { id },
		data: {
			materialId,
			materialTypeMasterId,
			status,
      updatedById: user
		}
	});
}

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
		...(status ? { status: status as Status } : {})
	}

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
		},
	});

	const data = await Promise.all(
		result.map(async (item) => {
			const materialName =
				item.materialId && accessToken
					? await getMaterialName(item.materialId, accessToken)
					: null;

			return {
				uuid: item.id,
				code: item.code,
				materialId: item.materialId,
				materialName, 
				materialTypeMasterId: item.materialTypeMasterId,
				createdAt: extractDateTime(item.createdAt, "both"),
				createdBy: item.createdById,
				updatedAt: extractDateTime(item.updatedAt, "both"),
				updatedBy: item.updatedById,
				isActive: item.isActive,
				status: item.status
			};
		})
	);

	return data;

}

export const getByID = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	const result = await tx.materialType.findUnique({
		where: {id, },
		select: {
			id: true,
			code: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			status: true,
			isActive: true
		}
	});

	if(!result) {throw new Error("materialType not found");}

	const materialName = result.materialId && accessToken ? await getMaterialName(result.materialId, accessToken) : null;

		const data = {
		id: result.id,
		code: result.code,
		materialId: result.materialId,
		materialName, 
		createdAt: extractDateTime(result.createdAt, "both"),
		createdById: result.createdById,
		updatedAt: extractDateTime(result.updatedAt, "both"),
		updatedById: result.updatedById,
		isActive: result.isActive,
		status: result.status
	};

	return {
		data
	};

};

export const deleteMaterialType = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	if(!id) {throw new Error("ID is required for deleting.");}

	await tx.materialType.update({
		where: {id},
		data: {
			isActive: false,
			updatedById: user,
		},
	});


};

