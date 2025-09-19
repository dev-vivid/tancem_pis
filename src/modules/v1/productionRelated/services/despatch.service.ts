import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import path from "path";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import { getMaterialName } from "common/api";
import {
	createWorkflowRequest,
	fetchClosedWorkflowIdsWithoutRole,
	getCurrentState,
	getNextAction,
	getRemarks,
} from "common/workflow";
import getUserData from "@shared/prisma/queries/getUserById";
import { constants } from "@config/constant";

export const getAlldespatch = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	// Fetch despatches with their child details
	const transactions = await tx.despatch.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
		include: {
			Despatches: {
				where: { isActive: true },
				orderBy: { createdAt: "desc" },
			},
		},
	});

	// Map response
	const data = await Promise.all(
		transactions.flatMap(async (item) => {
			// const createdUser_ = item.createdById
			// 	? await getUserData(item.createdById)
			// 	: null;

			// const updatedUser_ = item.updatedById
			// 	? await getUserData(item.updatedById)
			// 	: null;

			// Map each child detail
			const detailsMapped = await Promise.all(
				item.Despatches.map(async (detail) => {
					const materialName =
						detail.materialId && accessToken
							? await getMaterialName(detail.materialId, accessToken)
							: null;

					const createdUser = detail.createdById
						? await getUserData(detail.createdById)
						: null;

					const updatedUser = detail.updatedById
						? await getUserData(detail.updatedById)
						: null;

					return {
						// ---- Parent (Despatch) ----
						uuid: detail.id,
						despatchId: item.id,
						despatchCode: item.code,
						transactionDate: extractDateTime(item.transactionDate, "date"),

						// despatchCreatedAt: extractDateTime(item.createdAt, "both"),
						// despatchUpdatedAt: extractDateTime(item.updatedAt, "both"),
						// despatchCreatedById: item.createdById,
						// despatchUpdatedById: item.updatedById,
						// despatchCreatedUser: createdUser,
						// despatchUpdatedUser: updatedUser,
						// despatchIsActive: item.isActive,

						// ---- Child (DespatchDetails) ----
						materialCode: detail.code,
						materialId: detail.materialId,
						materialName: materialName?.name ?? null,
						railQuantity: detail.railQuantity,
						roadQuantity: detail.roadQuantity,
						exportQuantity: detail.exportQuantity,
						inlandQuantity: detail.inlandQuantity,

						createdAt: extractDateTime(detail.createdAt, "both"),
						updatedAt: extractDateTime(detail.updatedAt, "both"),
						createdById: detail.createdById,
						updatedById: detail.updatedById,
						isActive: detail.isActive,
						createdUser: createdUser?.userName,
						updatedUser: updatedUser?.userName,
					};
				})
			);

			return detailsMapped;
		})
	);

	return { data: data.flat() };
};

export const getIddespatch = async (
	detailId: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const detail = await tx.despatchDetails.findFirst({
		where: { id: detailId, isActive: true },
		include: { despatch: true },
	});

	if (!detail) return null;

	const materialName =
		detail.materialId && accessToken
			? await getMaterialName(detail.materialId, accessToken)
			: null;

	const createdUser = detail.createdById
		? await getUserData(detail.createdById)
		: null;

	const updatedUser = detail.updatedById
		? await getUserData(detail.updatedById)
		: null;

	return {
		uuid: detail.id,
		despatchId: detail.despatchId,
		despatchCode: detail.despatch.code,
		transactionDate: extractDateTime(detail.despatch.transactionDate, "date"),
		wfRequestId: "",

		materialCode: detail.code,
		materialId: detail.materialId,
		materialName: materialName?.name ?? null,
		railQuantity: detail.railQuantity,
		roadQuantity: detail.roadQuantity,
		exportQuantity: detail.exportQuantity,
		inlandQuantity: detail.inlandQuantity,

		createdAt: extractDateTime(detail.createdAt, "both"),
		updatedAt: extractDateTime(detail.updatedAt, "both"),
		createdById: detail.createdById,
		updatedById: detail.updatedById,
		isActive: detail.isActive,
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
	};
};

export const createdespatch = async (
	despatchData: {
		transactionDate: string;
		initiatorRoleId?: string;
		remarks?: string;
		status?: string;
		details: {
			materialId: string;
			railQuantity?: string;
			roadQuantity?: string;
			exportQuantity?: string;
			inlandQuantity?: string;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// for (const data of despatchData) {
	// 	if (!data.initiatorRoleId) throw new Error("initiatorRoleId is required");

	// Create workflow
	// const wfRequestId = await createWorkflowRequest({
	// 	userId: user,
	// 	initiatorRoleId: data.initiatorRoleId,
	// 	processId: constants.power_workflow_process_ID,
	// 	remarks: data.remarks,
	// 	status: data.status,
	// });
	const data = despatchData;
	console.log(despatchData);

	// Create Despatch header with details
	const created = await tx.despatch.create({
		data: {
			transactionDate: parseDateOnly(despatchData.transactionDate),
			wfRequestId: "",
			createdById: user,
			Despatches: {
				create: data.details.map((d) => ({
					materialId: d.materialId,
					railQuantity: d.railQuantity ? Number(d.railQuantity) : 0,
					roadQuantity: d.roadQuantity ? Number(d.roadQuantity) : 0,
					exportQuantity: d.exportQuantity ? Number(d.exportQuantity) : 0,
					inlandQuantity: d.inlandQuantity ? Number(d.inlandQuantity) : 0,
					createdById: user,
				})),
			},
		},
		include: { Despatches: true },
	});

	// return createdDespatches;
};

export const updateDespatch = async (
	detailId: string,
	data: {
		materialId?: string;
		railQuantity?: string;
		roadQuantity?: string;
		exportQuantity?: string;
		inlandQuantity?: string;
		transactionDate?: Date;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const updateData: any = { updatedById: user };

	if (data.materialId !== undefined) updateData.materialId = data.materialId;
	if (data.railQuantity !== undefined)
		updateData.railQuantity = Number(data.railQuantity || 0);
	if (data.roadQuantity !== undefined)
		updateData.roadQuantity = Number(data.roadQuantity || 0);
	if (data.exportQuantity !== undefined)
		updateData.exportQuantity = Number(data.exportQuantity || 0);
	if (data.inlandQuantity !== undefined)
		updateData.inlandQuantity = Number(data.inlandQuantity || 0);

	const updatedDetail = await tx.despatchDetails.update({
		where: { id: detailId },
		data: {
			...updateData,
			despatch: data.transactionDate
				? { update: { transactionDate: parseDateOnly(data.transactionDate) } } // 👈 parent update
				: undefined,
		},
		include: { despatch: true },
	});

	return updatedDetail;
};

export const deletedespatch = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("Detail ID is required");

	const detailRecord = await tx.despatchDetails.findUnique({
		where: { id: id },
		select: { despatchId: true },
	});

	if (!detailRecord) {
		throw new Error("Despatch detail not found");
	}

	const despatchId = detailRecord.despatchId;

	await tx.despatchDetails.update({
		where: { id: id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});

	const remainingDetails = await tx.despatchDetails.count({
		where: { despatchId, isActive: true },
	});

	if (remainingDetails === 0) {
		await tx.despatch.update({
			where: { id: despatchId },
			data: { isActive: false, updatedById: user },
		});
	}
};
