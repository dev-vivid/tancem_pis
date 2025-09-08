import prisma, {
	IPrismaTransactionClient,
	userPrimsa,
} from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import { getEquipmentName } from "common/api";
import { createWorkflowRequest } from "common/workflow";

export const getAllPowerTransactions = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const totalRecords = await tx.powerTransaction.count({
		where: { isActive: true },
	});

	const transactions = await tx.powerTransaction.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
		include: {
			powerDetails: {
				where: { isActive: true },
				orderBy: { createdAt: "desc" },
			},
		},
	});

	// const data = transactions.map(item => ({
	//   ...item,
	// 	transactionDate: extractDateTime(item.transactionDate, "date"),
	//   createdAt: extractDateTime(item.createdAt, "both"),
	//   updatedAt: extractDateTime(item.updatedAt, "both"),
	//   powerDetails: item.powerDetails.map(detail => ({
	//     ...detail,
	//     createdAt: extractDateTime(detail.createdAt, "both"),
	//     updatedAt: extractDateTime(detail.updatedAt, "both"),
	//   })),
	// }));

	// 	const data = transactions.flatMap(item =>
	//   item.powerDetails.map(detail => ({
	//     powerDetailsId: detail.id,
	//     transactionId: item.id,
	//     equipmentId: detail.equipmentId,
	//     units: detail.units,
	//     transactionDate: extractDateTime(item.transactionDate, "date"),
	//     createdAt: extractDateTime(detail.createdAt, "both"),
	//     updatedAt: extractDateTime(detail.updatedAt, "both"),
	//     createdBy: detail.createdById,
	//     updatedBy: detail.updatedById,
	//     isActive: item.isActive,
	//   }))
	// );

	const data = await Promise.all(
		transactions.map(async (item) => {
			return Promise.all(
				item.powerDetails.map(async (power) => {
					const equipmentName = await getEquipmentName(
						power.equipmentId,
						accessToken
					);

					return {
						transactionId: item.id,
						transactionCode: item.code,
						transactionDate: extractDateTime(item.transactionDate, "date"),
						wfRequestId: item.wfRequestId,
						transactionCreatedAt: extractDateTime(item.createdAt, "both"),
						transactionUpdatedAt: extractDateTime(item.updatedAt, "both"),
						transactionCreatedById: item.createdById,
						transactionUpdatedById: item.updatedById,
						transactionIsActive: item.isActive,

						powerId: power.id,
						powerCode: power.code,
						equipmentId: power.equipmentId,
						equipmentName: equipmentName ? equipmentName.name : null,
						units: power.units,
						powerCreatedAt: extractDateTime(power.createdAt, "both"),
						powerUpdatedAt: extractDateTime(power.updatedAt, "both"),
						powerCreatedById: power.createdById,
						powerUpdatedById: power.updatedById,
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
				id: detail.id,
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

	return {
		...getPowerTransactionById,
		transactionDate: extractDateTime(
			getPowerTransactionById.transactionDate,
			"date"
		),
		createdAt: extractDateTime(getPowerTransactionById.createdAt, "both"),
		updatedAt: extractDateTime(getPowerTransactionById.updatedAt, "both"),
		powerDetails,
	};
};

export const createPowerTransaction = async (
	data: {
		transactionDate: Date;
		powerDetails: {
			equipmentId: string;
			units: number;
		}[];
		initiatorRoleId: string;
		remarks?: string;
		status?: string;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const wfRequestId = await createWorkflowRequest({
		userId: user,
		initiatorRoleId: data.initiatorRoleId,
		remarks: data.remarks,
		status: data.status,
	});

	await tx.powerTransaction.create({
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			wfRequestId,
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
		transactionDate: Date;
		powerDetails?: {
			equipmentId: string;
			units: number;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// Update main transaction
	const updatedTransaction = await tx.powerTransaction.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			updatedById: user,
		},
	});

	// Update only existing details
	if (data.powerDetails?.length) {
		for (const detail of data.powerDetails) {
			await tx.power.updateMany({
				where: {
					transactionId: id,
					equipmentId: detail.equipmentId,
					isActive: true,
				},
				data: {
					units: detail.units,
					updatedById: user,
				},
			});
		}
	}

	return updatedTransaction;
};

export const deletePowerTransaction = async (
	transactionId: string,
	detailIds: string[],
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// Soft delete only specific child records
	await tx.power.updateMany({
		where: {
			transactionId,
			id: { in: detailIds },
			isActive: true,
		},
		data: { isActive: false, updatedById: user },
	});

	// Optionally, check if the parent transaction should also be soft deleted
	const remainingDetails = await tx.power.count({
		where: { transactionId, isActive: true },
	});

	if (remainingDetails === 0) {
		await tx.powerTransaction.update({
			where: { id: transactionId },
			data: { isActive: false, updatedById: user },
		});
	}
};
