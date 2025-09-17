import { createWorkflowRequest } from "common/workflow";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import path from "path";
import { constants } from "@config/constant";
import { getMaterialName, getEquipmentName } from "common/api";
import getUserData from "@shared/prisma/queries/getUserById";

export const getAllproduction = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });
	console.log({ skip, take });

	const totalRecords = await tx.production.count({
		where: { isActive: true },
	});

	const production = await tx.production.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			code: true,
			transactionDate: true,
			equipmentId: true,
			materialId: true,
			runningHours: true,
			quantity: true,
			fuelConsumption: true,
			wfRequestId: true,
			remarks: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	const data = await Promise.all(
		production.map(async (item) => {
			const materialName = item.materialId
				? await getMaterialName(item.materialId, accessToken)
				: null;

			const equipmentName = item.equipmentId
				? await getEquipmentName(item.equipmentId, accessToken)
				: null;

			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;

			return {
				uuid: item.id,
				productionCode: item.code,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				equipmentId: item.equipmentId,
				equipmentName: equipmentName ? equipmentName.name : null,
				materialId: item.materialId,
				materialName: materialName ? materialName.name : null,
				runningHours: item.runningHours,
				quantity: item.quantity,
				fuelConsumption: item.fuelConsumption,
				remarks: item.remarks,
				wfRequestId: item.wfRequestId,
				createdAt: extractDateTime(item.createdAt, "both"),
				isActive: item.isActive,
				createdBy: item.createdById,
				createdByUser: createdUser,
			};
		})
	);

	return {
		totalRecords,
		data,
	};
};

export const getIdproduction = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const item = await tx.production.findFirst({
		where: { id, isActive: true },
		select: {
			id: true,
			code: true,
			transactionDate: true,
			equipmentId: true,
			materialId: true,
			runningHours: true,
			quantity: true,
			fuelConsumption: true,
			wfRequestId: true,
			remarks: true,
			createdAt: true,
			createdById: true,
			updatedAt: true,
			updatedById: true,
			isActive: true,
		},
	});

	if (!item) {
		throw new Error("production not found.");
	}

	const materialName = item.materialId
		? await getMaterialName(item.materialId, accessToken)
		: null;

	const equipmentName = item.equipmentId
		? await getEquipmentName(item.equipmentId, accessToken)
		: null;

	const createdUser = item.createdById
		? await getUserData(item.createdById)
		: null;

	const updatedUser = item.updatedById
		? await getUserData(item.updatedById)
		: null;

	const data = {
		uuid: item.id,
		productionCode: item.code,
		transactionDate: extractDateTime(item.transactionDate, "date"),
		equipmentId: item.equipmentId,
		equipmentName: equipmentName ? equipmentName.name : null,
		materialId: item.materialId,
		materialName: materialName ? materialName.name : null,
		runningHours: item.runningHours,
		quantity: item.quantity,
		fuelConsumption: item.fuelConsumption,
		remarks: item.remarks,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdBy: item.createdById,
		updatedBy: item.updatedById,
		isActive: item.isActive,
		createdUser: createdUser,
		updatedUser: updatedUser,
	};

	return {
		totalRecords: 1,
		data,
	};
};

type productionData = {
	transactionDate: string; // incoming from req.body
	equipmentId: string;
	materialId: string;
	runningHours: string;
	quantity: string;
	fuelConsumption?: string;
	remarks?: string;
	initiatorRoleId?: string;
	workflowRemarks?: string;
	status?: string;
};

// function parseDDMMYYYY(dateStr: string): Date | null {
// 	if (!dateStr) return null;
// 	const [day, month, year] = dateStr.split("-");
// 	if (!day || !month || !year) return null;
// 	return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
// }

export const createproduction = async (
	productionData: productionData,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// const parsedDate = parseDDMMYYYY(productionData.transactionDate);
	// if (!parsedDate || isNaN(parsedDate.getTime())) {
	// 	throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	// }

	// const wfRequestId = await createWorkflowRequest({
	// 	userId: user,
	// 	initiatorRoleId: productionData.initiatorRoleId,
	// 	processId: constants.power_workflow_process_ID,
	// 	remarks: productionData.workflowRemarks,
	// 	status: productionData.status,
	// });

	return await tx.production.create({
		data: {
			transactionDate: parseDateOnly(productionData.transactionDate),
			equipmentId: productionData.equipmentId,
			materialId: productionData.materialId,
			runningHours: productionData.runningHours,
			wfRequestId: "",
			quantity: productionData.quantity ? Number(productionData.quantity) : 0,
			fuelConsumption: productionData.fuelConsumption
				? Number(productionData.fuelConsumption)
				: 0,
			remarks: productionData.remarks || undefined,

			createdById: user,
		},
	});
};

export const updateproduction = async (
	id: string,
	productionData: any, // directly from req.body
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for updating production.");
	}
	// const parsedDate = parseDDMMYYYY(productionData.transactionDate);
	// if (!parsedDate || isNaN(parsedDate.getTime())) {
	// 	throw new Error("Invalid transactionDate format. Expected DD-MM-YYYY");
	// }
	return await tx.production.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(productionData.transactionDate),
			equipmentId: productionData.equipmentId,
			materialId: productionData.materialId,
			runningHours: productionData.runningHours,
			quantity: productionData.quantity ? Number(productionData.quantity) : 0,
			fuelConsumption: productionData.fuelConsumption
				? Number(productionData.fuelConsumption)
				: 0,
			remarks: productionData.remarks,
			updatedById: user,
		},
	});
};

export const deleteproduction = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("ID is required for deleting production.");
	}
	await tx.production.update({
		where: {
			id: id,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});
};
