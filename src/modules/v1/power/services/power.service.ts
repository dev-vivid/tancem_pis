import { constants } from "@config/constant";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import { getEquipmentName, getDepartmentName } from "common/api";
import {
	createWorkflowRequest,
	fetchClosedWorkflowIdsWithoutRole,
	getCurrentState,
	getNextAction,
	getRemarks,
} from "common/workflow";
import getUserData from "@shared/prisma/queries/getUserById";

export const getAllPowerTransactions = async (
	accessToken: string,
	isOpen?: string,
	status?: string,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const totalRecords = await tx.powerTransaction.count({
		where: { isActive: true },
	});

	const getWfId = await fetchClosedWorkflowIdsWithoutRole(
		constants.power_workflow_process_ID,
		isOpen || "",
		status || ""
	);

	const transactions = await tx.powerTransaction.findMany({
		skip,
		take,
		where: {
			isActive: true,
			// wfRequestId: {
			// 	in: getWfId,
			// },
		},
		orderBy: { createdAt: "desc" },
		include: {
			powerDetails: {
				where: { isActive: true },
				orderBy: { createdAt: "desc" },
			},
		},
	});

	const data = await Promise.all(
		transactions.map(async (item) => {
			return Promise.all(
				item.powerDetails.map(async (power) => {
					const equipmentName = await getEquipmentName(
						power.equipmentId,
						accessToken
					);
					const createdUser = item.createdById
						? await getUserData(item.createdById)
						: null;

					const updatedUser = item.updatedById
						? await getUserData(item.updatedById)
						: null;

					return {
						uuid: power.id,
						transactionId: item.id,
						// transactionCode: item.code,
						transactionDate: extractDateTime(item.transactionDate, "date"),
						wfRequestId: item.wfRequestId,
						// transactionCreatedAt: extractDateTime(item.createdAt, "both"),
						// transactionUpdatedAt: extractDateTime(item.updatedAt, "both"),
						// transactionCreatedById: item.createdById,
						// transactionUpdatedById: item.updatedById,
						// transactionCreatedUser: createdUser,
						// transactionUpdatedUser: updatedUser,
						// transactionIsActive: item.isActive,

						powerCode: power.code,
						equipmentId: power.equipmentId,
						equipmentName: equipmentName ? equipmentName.name : null,
						units: power.units,
						powerCreatedAt: extractDateTime(power.createdAt, "both"),
						powerUpdatedAt: extractDateTime(power.updatedAt, "both"),
						powerCreatedById: power.createdById,
						powerUpdatedById: power.updatedById,
						powerCreatedUser: createdUser,
						powerUpdatedUser: updatedUser,
						powerIsActive: power.isActive,
					};
				})
			);
		})
	);

	return { data: data.flat() };
};

export const getPowerTransactionById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const getPowerTransactionById = await tx.powerTransaction.findFirst({
		where: { id, isActive: true },
		orderBy: { createdAt: "desc" },
		include: {
			powerDetails: {
				where: { isActive: true },
				orderBy: { createdAt: "desc" },
			},
		},
	});

	if (!getPowerTransactionById) {
		throw new Error(`Id not found 404`);
	}
	const powerDetails = await Promise.all(
		getPowerTransactionById.powerDetails.map(async (detail) => {
			const equipmentName =
				detail.equipmentId && accessToken
					? await getEquipmentName(detail.equipmentId, accessToken)
					: null;

			return {
				uuid: detail.id,
				code: detail.code,
				transactionId: detail.transactionId,
				equipmentId: detail.equipmentId,
				equipmentName: equipmentName ? equipmentName.name : null,
				units: detail.units,
				createdAt: extractDateTime(detail.createdAt, "both"),
				updatedAt: extractDateTime(detail.updatedAt, "both"),
				createdById: detail.createdById,
				updatedById: detail.updatedById,
				isActive: detail.isActive,
			};
		})
	);

	// const [currentState, nextAction, remarks] = await Promise.all([
	// 	getCurrentState(getPowerTransactionById.wfRequestId),
	// 	getNextAction(getPowerTransactionById.wfRequestId),
	// 	getRemarks(getPowerTransactionById.wfRequestId),
	// ]);

	return {
		...getPowerTransactionById,
		transactionDate: extractDateTime(
			getPowerTransactionById.transactionDate,
			"date"
		),
		createdAt: extractDateTime(getPowerTransactionById.createdAt, "both"),
		updatedAt: extractDateTime(getPowerTransactionById.updatedAt, "both"),
		powerDetails,
		// workflow: {
		// 	currentState,
		// 	nextAction,
		// 	remarks,
		// },
	};
};

export const createPowerTransaction = async (
	data: {
		transactionDate: Date;
		powerDetails: {
			equipmentId: string;
			units: number;
		}[];
		initiatorRoleId?: string;
		remarks?: string;
		status?: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// if (!data.initiatorRoleId) {
	// 	throw new Error("initiatorRoleId is required");
	// }

	// Create workflow request first
	// const wfRequestId = await createWorkflowRequest({
	// 	userId: user,
	// 	initiatorRoleId: data.initiatorRoleId,
	// 	processId: constants.power_workflow_process_ID,
	// 	remarks: data.remarks,
	// 	status: data.status,
	// });

	// Create transaction with child details
	const createdTransaction = await tx.powerTransaction.create({
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			wfRequestId: "",
			createdById: user,
			powerDetails: {
				create: data.powerDetails.map((p) => ({
					equipmentId: p.equipmentId,
					units: p.units,
					createdById: user,
				})),
			},
		},
		include: { powerDetails: true },
	});
};

export const updatePowerTransaction = async (
	id: string,
	data: {
		transactionDate?: string; // optional for partial update
		powerDetails?: {
			id?: string;
			equipmentId?: string;
			units?: number;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// Parent update
	const parentUpdate: any = { updatedById: user };
	if (data.transactionDate !== undefined) {
		parentUpdate.transactionDate = parseDateOnly(data.transactionDate);
	}

	// --- Separate child updates ---
	const updateDetails = (data.powerDetails || [])
		.filter((d) => d.id)
		.map((d) => {
			const updateData: any = { updatedById: user };
			if (d.equipmentId !== undefined) updateData.equipmentId = d.equipmentId;
			if (d.units !== undefined) updateData.units = d.units;

			return {
				where: { id: d.id! },
				data: updateData,
			};
		});

	const createDetails = (data.powerDetails || [])
		.filter((d) => !d.id)
		.map((d) => ({
			equipmentId: d.equipmentId!,
			units: d.units ?? 0,
			createdById: user,
			updatedById: user,
			isActive: true,
		}));

	// --- Find current active children in DB ---
	const existingDetails = await tx.power.findMany({
		where: { transactionId: id, isActive: true },
		select: { id: true },
	});
	const existingIds = existingDetails.map((d) => d.id);

	// IDs from request
	const sentIds = (data.powerDetails || [])
		.filter((d) => d.id)
		.map((d) => d.id!);

	// To soft delete = in DB but not in request
	const deleteIds = existingIds.filter((eid) => !sentIds.includes(eid));

	// --- Update parent and child records ---
	const updatedTransaction = await tx.powerTransaction.update({
		where: { id },
		data: {
			...parentUpdate,
			powerDetails: {
				update: updateDetails,
				create: createDetails,
			},
		},
		include: {
			powerDetails: {
				where: { isActive: true }, // only return active children
			},
		},
	});

	// --- Soft delete missing children ---
	if (deleteIds.length) {
		await tx.power.updateMany({
			where: { id: { in: deleteIds } },
			data: { isActive: false, updatedById: user },
		});
	}

	// return updatedTransaction;
};

export const deletePowerTransaction = async (
	powerid: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// Soft delete only specific child records
	const childRecord = await tx.power.findUnique({
		where: { id: powerid },
		select: { transactionId: true },
	});

	if (!childRecord) {
		throw new Error("Child record not found");
	}

	const transactionId = childRecord.transactionId;

	// Soft delete the specific child record
	await tx.power.updateMany({
		where: { id: powerid, isActive: true },
		data: { isActive: false, updatedById: user },
	});

	// Count remaining active child records
	const remainingDetails = await tx.power.count({
		where: { transactionId, isActive: true },
	});

	// If no children left → soft delete parent
	if (remainingDetails === 0) {
		await tx.powerTransaction.update({
			where: { id: transactionId },
			data: { isActive: false, updatedById: user },
		});
	}
};
