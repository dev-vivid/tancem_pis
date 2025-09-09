import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import * as api from "../../../../common/api";
import { parseDateOnly } from "../../../../shared/utils/date";

export const createQualityLab = async (data: any, user: string) => {
	await prisma.qualityLab.create({
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			// transactionDate: new Date(data.transactionDate),
			materialId: data.materialId,
			equipmentId: data.equipmentId,
			ist: data.ist,
			fst: data.fst,
			blaine: data.blaine,
			wfRequestId: "",
			createdById: user,
		},
	});
};

// ✅ Get all with pagination
export const getAllQualityLab = async (
	accessToken: string,
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.qualityLab.count();

	const labs = await tx.qualityLab.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			transactionDate: true,
			materialId: true,
			equipmentId: true,
			ist: true,
			fst: true,
			blaine: true,
			createdAt: true,
			createdById: true,
		},
	});

	const data = await Promise.all(
		labs.map(async (item) => {
			const materialObj = item.materialId
				? await api.getMaterialName(item.materialId, accessToken)
				: null;

			const equipmentObj = item.equipmentId
				? await api.getEquipmentName(item.equipmentId, accessToken)
				: null;

			// console.log("Material API Response:", materialObj);

			return {
				...item,
				materialName: materialObj?.name || "",
				equipmentName: equipmentObj?.name || "",
				createdAt: item.createdAt
					.toISOString()
					.replace("T", " ")
					.substring(0, 19),
			};
		})
	);

	return {
		totalRecords,
		data,
	};
};

// ✅ Get by ID
export const getQualityLabById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.qualityLab.findUnique({
		where: { id },
	});
	console.log(item);
	if (!item) throw new Error("Analysis Lab not found.");
	const materialName = item.materialId
		? await api.getMaterialName(item.materialId, accessToken)
		: null;
	console.log(materialName);
	const equipmentName = item.equipmentId
		? await api.getEquipmentName(item.equipmentId, accessToken)
		: null;
	return {
		...item,
		materialName: materialName?.name || null,
		equipmentName: equipmentName?.name || null,
		createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
	};
};

// ✅ Update
export const updateQualityLab = async (
	id: string,
	data: {
		transactionDate: Date;
		materialId: string;
		equipmentId: string;
		ist: string;
		fst: string;
		blaine: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.qualityLab.update({
		where: { id },
		data: {
			transactionDate: data.transactionDate,
			materialId: data.materialId,
			equipmentId: data.equipmentId,
			ist: data.ist,
			fst: data.fst,
			blaine: data.blaine,
			updatedById: user,
		},
	});
};

// ✅ Delete
export const deleteQualityLab = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting qualityLab.");
	}
	await tx.qualityLab.update({
		where: {
			id: id,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
