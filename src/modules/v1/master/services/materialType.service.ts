import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

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
			createdAt: new Date()
		}
	});
};

export const updateMaterialType = async (
	id: string,
	updateMaterialTypeData: {
		materialId: string,
		materialTypeMasterId: string,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	const {materialId, materialTypeMasterId} = updateMaterialTypeData;

	if(!user){
		throw new Error("User is not Authorized");
	}

	await tx.materialType.update({
		where: { id },
		data: {
			materialId,
			materialTypeMasterId,
      updatedById: user,
			updatedAt: new Date()
		}
	});
}

export const getAllMaterialType = async (
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const result = await tx.materialType.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
		},
	});

	const data = result.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
        updatedAt: item.updatedAt.toISOString().replace("T", " ").substring(0, 19)
   }));

	return data;

}

export const getByID = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	const result = await tx.materialType.findUnique({
		where: {id, },
		select: {
			id: true,
			materialId: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
		}
	});

	if(!result) {throw new Error("materialType not found");}

	const data = { 
        ...result,
        createdAt: result.createdAt.toISOString().replace("T", " ").substring(0, 19),
        updatedAt: result.updatedAt.toISOString().replace("T", " ").substring(0, 19)
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
			updatedAt: new Date()
		},
	});


};

