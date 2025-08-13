import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

export const createMaterialAnalysis = async (
	materialAnalysisData: {
		materialId: string,
		analysisId: string,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {

	const {materialId, analysisId} = materialAnalysisData;

	const create = await tx.materialAnalysis.create({
		data: {
			materialId,
			analysisId,
			createdById: user,
			createdAt: new Date()
		}
	});
};

export const updateMaterialAnalysis = async (
	id: string,
	updateMaterialTypeData: {
		materialId: string,
		analysisId: string,
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	const {materialId, analysisId} = updateMaterialTypeData;

	if(!user){
		throw new Error("User is not Authorized");
	}

	await tx.materialAnalysis.update({
		where: { id },
		data: {
			materialId,
			analysisId,
      updatedById: user,
			updatedAt: new Date()
		}
	})
}

export const getAllMaterialAnalysis = async (
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const result = await tx.materialAnalysis.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			materialId: true,
			analysisId: true,
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
	const result = await tx.materialAnalysis.findUnique({
		where: {id},
		select: {
			id: true,
			materialId: true,
			analysisId: true,
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

export const deleteMaterialAnalysis = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma 
) => {
	if(!id) {throw new Error("ID is required for deleting.");}

	await tx.materialAnalysis.update({
		where: {id},
		data: {
			isActive: false,
			updatedById: user,
			updatedAt: new Date()
		},
	});


};

