import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import * as api from "../../../../common/api";
import { extractDateTime, parseDateOnly } from "../../../../shared/utils/date";
import getUserData from "@shared/prisma/queries/getUserById";

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

	const totalRecords = await tx.qualityLab.count({
		where: {
			isActive: true,
		},
	});

	const labs = await tx.qualityLab.findMany({
		skip,
		take,
		orderBy: { createdAt: "desc" },
		where: { isActive: true },
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
			updatedAt: true,
			updatedById: true,
			isActive: true,
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

			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;
			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;

			return {
				uuid: item.id,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				materialId: item.materialId,
				materialName: materialObj?.name || "",
				equipmentId: item.equipmentId,
				equipmentName: equipmentObj?.name || "",
				ist: item.ist,
				fst: item.fst,
				blaine: item.blaine,
				isActive: item.isActive,
				createdAt: extractDateTime(item.createdAt, "both"),
				updatedAt: extractDateTime(item.updatedAt, "both"),
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
	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;
	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;
	return {
		uuid: item.id,
		transactionDate: extractDateTime(item.transactionDate, "date"),
		materialId: item.materialId,
		materialName: materialName?.name || "",
		equipmentId: item.equipmentId,
		equipmentName: equipmentName?.name || "",
		ist: item.ist,
		fst: item.fst,
		blaine: item.blaine,
		isActive: item.isActive,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdUser,
		updatedUser,
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
			transactionDate: parseDateOnly(data.transactionDate),
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
