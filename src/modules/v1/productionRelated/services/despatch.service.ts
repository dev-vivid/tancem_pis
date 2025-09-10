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
			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;

			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;

			return item.Despatches.map((detail) => ({
				// ---- Parent (Despatch) ----
				despatchId: item.id,
				despatchCode: item.code,
				transactionDate: extractDateTime(item.transactionDate, "date"),

				despatchCreatedAt: extractDateTime(item.createdAt, "both"),
				despatchUpdatedAt: extractDateTime(item.updatedAt, "both"),
				despatchCreatedById: item.createdById,
				despatchUpdatedById: item.updatedById,
				despatchCreatedUser: createdUser,
				despatchUpdatedUser: updatedUser,
				despatchIsActive: item.isActive,

				// ---- Child (DespatchDetails) ----
				despatchDetailId: detail.id,
				materialCode: detail.code,
				materialId: detail.materialId,

				railQuantity: detail.railQuantity,
				roadQuantity: detail.roadQuantity,
				exportQuantity: detail.exportQuantity,
				inlandQuantity: detail.inlandQuantity,

				detailCreatedAt: extractDateTime(detail.createdAt, "both"),
				detailUpdatedAt: extractDateTime(detail.updatedAt, "both"),
				detailCreatedById: detail.createdById,
				detailUpdatedById: detail.updatedById,
				detailIsActive: detail.isActive,
			}));
		})
	);

	return { data: data.flat() };
};

export const getIddespatch = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) {
		throw new Error("Despatch ID is required.");
	}

	const despatch = await tx.despatch.findFirst({
		where: { id, isActive: true },
		include: {
			Despatches: {
				where: { isActive: true },
				orderBy: { createdAt: "desc" },
			},
		},
	});

	if (!despatch) {
		return null;
	}

	const createdUser = despatch.createdById
		? await getUserData(despatch.createdById)
		: null;

	const updatedUser = despatch.updatedById
		? await getUserData(despatch.updatedById)
		: null;

	const data = despatch.Despatches.map((detail) => ({
		despatchId: despatch.id,
		despatchCode: despatch.code,
		transactionDate: extractDateTime(despatch.transactionDate, "date"),
		despatchCreatedAt: extractDateTime(despatch.createdAt, "both"),
		despatchUpdatedAt: extractDateTime(despatch.updatedAt, "both"),
		despatchCreatedById: despatch.createdById,
		despatchUpdatedById: despatch.updatedById,
		despatchCreatedUser: createdUser,
		despatchUpdatedUser: updatedUser,
		despatchIsActive: despatch.isActive,

		despatchDetailId: detail.id,
		materialCode: detail.code,
		materialId: detail.materialId,

		railQuantity: detail.railQuantity,
		roadQuantity: detail.roadQuantity,
		exportQuantity: detail.exportQuantity,
		inlandQuantity: detail.inlandQuantity,

		detailCreatedAt: extractDateTime(detail.createdAt, "both"),
		detailUpdatedAt: extractDateTime(detail.updatedAt, "both"),
		detailCreatedById: detail.createdById,
		detailUpdatedById: detail.updatedById,
		detailIsActive: detail.isActive,
	}));

	return { data };
};

export const createdespatch = async (
	despatchData: {
		transactionDate: string;
		initiatorRoleId: string;
		remarks: string;
		status: string;
		details: {
			materialId: string;
			railQuantity?: string;
			roadQuantity?: string;
			exportQuantity?: string;
			inlandQuantity?: string;
		}[];
	}[],
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const createdDespatches = [];

	for (const data of despatchData) {
		if (!data.initiatorRoleId) throw new Error("initiatorRoleId is required");

		// Create workflow
		const wfRequestId = await createWorkflowRequest({
			userId: user,
			initiatorRoleId: data.initiatorRoleId,
			processId: constants.power_workflow_process_ID,
			remarks: data.remarks,
			status: data.status,
		});

		// Create Despatch header with details
		const created = await tx.despatch.create({
			data: {
				transactionDate: parseDateOnly(data.transactionDate),
				wfRequestId,
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

		createdDespatches.push(created);
	}

	return createdDespatches;
};

export const updateDespatch = async (
	despatchId: string,
	data: {
		transactionDate: string;
		details: {
			id?: string; // existing detail id (if updating)
			materialId?: string;
			railQuantity?: string;
			roadQuantity?: string;
			exportQuantity?: string;
			inlandQuantity?: string;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const updated = await tx.despatch.update({
		where: { id: despatchId },
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			updatedById: user,
			Despatches: {
				upsert: data.details.map((d) => {
					// build update object only with provided keys
					const updateData: any = { updatedById: user };
					if (d.materialId !== undefined) updateData.materialId = d.materialId;
					if (d.railQuantity !== undefined)
						updateData.railQuantity = Number(d.railQuantity);
					if (d.roadQuantity !== undefined)
						updateData.roadQuantity = Number(d.roadQuantity);
					if (d.exportQuantity !== undefined)
						updateData.exportQuantity = Number(d.exportQuantity);
					if (d.inlandQuantity !== undefined)
						updateData.inlandQuantity = Number(d.inlandQuantity);

					// build create object (here you may want defaults if not provided)
					const createData: any = { createdById: user };
					if (d.materialId !== undefined) createData.materialId = d.materialId;
					if (d.railQuantity !== undefined)
						createData.railQuantity = Number(d.railQuantity);
					if (d.roadQuantity !== undefined)
						createData.roadQuantity = Number(d.roadQuantity);
					if (d.exportQuantity !== undefined)
						createData.exportQuantity = Number(d.exportQuantity);
					if (d.inlandQuantity !== undefined)
						createData.inlandQuantity = Number(d.inlandQuantity);

					return {
						where: { id: d.id ?? "" },
						update: updateData,
						create: createData,
					};
				}),
			},
		},
		include: { Despatches: true },
	});

	return updated;
};

export const deletedespatch = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	if (!id) throw new Error("ID is required");

	// Soft delete Despatch header and its details
	await tx.despatch.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
			Despatches: {
				updateMany: {
					where: { isActive: true },
					data: { isActive: false, updatedById: user },
				},
			},
		},
	});
};
