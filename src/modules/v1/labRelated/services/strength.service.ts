import { getMaterialName } from "common/api";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import { subDays } from "date-fns";
import getUserData from "@shared/prisma/queries/getUserById";

// ✅ Create
export const createStrength = async (
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return tx.strengthTransactions.create({
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			materialId: data.materialId,
			createdById: user,
			samples: {
				create: (data.samples || []).map((s: any) => {
					return {
						sampleDate: parseDateOnly(s.sampleDate),
						day1_strength: s.day1_strength ?? 0,
						day3_strength: s.day3_strength ?? 0,
						day7_strength: s.day7_strength ?? 0,
						day28_strength: s.day28_strength ?? 0,
						expansion: s.expansion ?? 0,
						createdById: user,
					};
				}),
			},
		},
		include: { samples: true },
	});
};

export const getStrengthSchedule = async (
	accessToken: string,
	transactionDate: string,
	materialId: string
) => {
	const trnDate = parseDateOnly(transactionDate);

	// Required sample days based on your format
	const testDays: Record<string, number> = {
		day1_strength: 2,
		day3_strength: 4,
		day7_strength: 8,
		day28_strength: 29,
	};

	const sampleDates = Object.entries(testDays).map(([key, days]) => ({
		key,
		date: subDays(trnDate, days),
	}));

	// Fetch existing samples from DB
	const existing = await prisma.strengthSamples.findMany({
		where: {
			transaction: { materialId, isActive: true },
			sampleDate: { in: sampleDates.map((d) => d.date) },
		},
		include: {
			transaction: true, // ✅ so we can access createdById, updatedById, materialId
		},
	});

	// Build response
	const schedule = sampleDates.map(({ date, key }) => {
		const sample = existing.find(
			(s) =>
				s.sampleDate.toISOString().split("T")[0] ===
				date.toISOString().split("T")[0]
		);

		return {
			sampleDate: date.toISOString().split("T")[0],
			day1: key === "day1_strength" ? sample?.day1_strength ?? 0 : 0,
			day3: key === "day3_strength" ? sample?.day3_strength ?? 0 : 0,
			day7: key === "day7_strength" ? sample?.day7_strength ?? 0 : 0,
			day28: key === "day28_strength" ? sample?.day28_strength ?? 0 : 0,
		};
	});

	// Pick transaction metadata (if exists in first sample)
	const transaction = existing[0]?.transaction;

	// Add material name + user info
	const materialName = materialId
		? await getMaterialName(materialId, accessToken)
		: null;

	const createdUser = transaction?.createdById
		? await getUserData(transaction.createdById)
		: null;

	const updatedUser = transaction?.updatedById
		? await getUserData(transaction.updatedById)
		: null;

	return {
		transactionDate,
		materialId,
		materialName: materialName ? materialName.name : null,
		createdUser,
		updatedUser,
		samples: schedule,
	};
};
// ✅ Update
export const updateStrength = async (
	id: string,
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return tx.strengthTransactions.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			materialId: data.materialId,
			updatedById: user,
			samples: {
				updateMany: (data.samples || []).map((s: any) => {
					const updateData: any = {
						updatedById: user,
					};

					if (s.day1 !== undefined) updateData.day1_strength = s.day1;
					if (s.day3 !== undefined) updateData.day3_strength = s.day3;
					if (s.day7 !== undefined) updateData.day7_strength = s.day7;
					if (s.day28 !== undefined) updateData.day28_strength = s.day28;
					if (s.expansion !== undefined) updateData.expansion = s.expansion;

					return {
						where: {
							sampleDate: parseDateOnly(s.sampleDate),
							transactionId: id,
						},
						data: updateData,
					};
				}),
			},
		},
		include: { samples: true },
	});
};

// ✅ Get all with pagination
export const getAllStrength = async (
	accessToken: string,
	pageNumber?: number,
	pageSize?: number,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({
		pageNumber: pageNumber?.toString(),
		pageSize: pageSize?.toString(),
	});

	const totalRecords = await tx.strengthTransactions.count({
		where: { isActive: true },
	});

	const rows = await tx.strengthTransactions.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
		include: {
			samples: true,
		},
	});

	// Map + async fetch for material & user data
	const data = await Promise.all(
		rows.map(async (t) => {
			const materialName = t.materialId
				? await getMaterialName(t.materialId, accessToken)
				: null;

			const createdUser = t.createdById
				? await getUserData(t.createdById)
				: null;

			const updatedUser = t.updatedById
				? await getUserData(t.updatedById)
				: null;

			return {
				id: t.id,
				transactionDate: extractDateTime(t.transactionDate, "date"),
				materialId: t.materialId,
				materialName: materialName ? materialName.name : null,
				sampleCount: t.samples.length,
				createdAt: extractDateTime(t.createdAt, "both"),
				createdById: t.createdById,
				updatedAt: t.updatedAt,
				updatedById: t.updatedById,
				createdUser,
				updatedUser,
			};
		})
	);

	return { totalRecords, data };
};

// ✅ Get by ID
export const getStrengthById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const transaction = await tx.strengthTransactions.findUnique({
		where: { id },
		include: {
			samples: {
				orderBy: { sampleDate: "desc" }, // ✅ Order by latest first
			},
		},
	});

	if (!transaction) throw new Error("Strength transaction not found");

	// 🔹 Fetch extra info
	const materialName = transaction.materialId
		? await getMaterialName(transaction.materialId, accessToken)
		: null;

	const createdUser = transaction.createdById
		? await getUserData(transaction.createdById)
		: null;

	const updatedUser = transaction.updatedById
		? await getUserData(transaction.updatedById)
		: null;

	return {
		id: transaction.id,
		transactionDate: extractDateTime(transaction.transactionDate, "date"),
		materialId: transaction.materialId,
		materialName: materialName ? materialName.name : null,
		samples: transaction.samples.map((s) => ({
			id: s.id,
			sampleDate: extractDateTime(s.sampleDate, "date"),
			day1_strength: s.day1_strength,
			day3_strength: s.day3_strength,
			day7_strength: s.day7_strength,
			day28_strength: s.day28_strength,
			expansion: s.expansion,
		})),
		createdAt: extractDateTime(transaction.createdAt, "both"),
		createdById: transaction.createdById,
		updatedAt: extractDateTime(transaction.updatedAt, "both"),
		updatedById: transaction.updatedById,
		createdUser,
		updatedUser,
	};
};

// ✅ Soft delete
export const deleteStrength = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	await tx.strengthSamples.updateMany({
		where: { transactionId: id },
		data: { isActive: false, updatedById: user },
	});

	return tx.strengthTransactions.update({
		where: { id },
		data: { isActive: false, updatedById: user },
	});
};
