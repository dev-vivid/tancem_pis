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
	// Transform the samples data to match the database schema
	const transformedSamples = [];

	if (data.samples && data.samples.length > 0) {
		// Process Day 1 sample
		if (data.samples[0] && data.samples[0].sampleDate1) {
			transformedSamples.push({
				sampleDate: parseDateOnly(data.samples[0].sampleDate1),
				day1_strength: data.samples[0].day1 ?? 0,
				day3_strength: data.samples[0].day3 ?? 0,
				day7_strength: data.samples[0].day7 ?? 0,
				day28_strength: data.samples[0].day28 ?? 0,
				expansion: data.samples[0].expansion ?? 0,
				createdById: user,
			});
		}

		// Process Day 3 sample
		if (data.samples[1] && data.samples[1].sampleDate3) {
			transformedSamples.push({
				sampleDate: parseDateOnly(data.samples[1].sampleDate3),
				day1_strength: data.samples[1].day1 ?? 0,
				day3_strength: data.samples[1].day3 ?? 0,
				day7_strength: data.samples[1].day7 ?? 0,
				day28_strength: data.samples[1].day28 ?? 0,
				expansion: data.samples[1].expansion ?? 0,
				createdById: user,
			});
		}

		// Process Day 7 sample
		if (data.samples[2] && data.samples[2].sampleDate7) {
			transformedSamples.push({
				sampleDate: parseDateOnly(data.samples[2].sampleDate7),
				day1_strength: data.samples[2].day1 ?? 0,
				day3_strength: data.samples[2].day3 ?? 0,
				day7_strength: data.samples[2].day7 ?? 0,
				day28_strength: data.samples[2].day28 ?? 0,
				expansion: data.samples[2].expansion ?? 0,
				createdById: user,
			});
		}

		// Process Day 28 sample
		if (data.samples[3] && data.samples[3].sampleDate28) {
			transformedSamples.push({
				sampleDate: parseDateOnly(data.samples[3].sampleDate28),
				day1_strength: data.samples[3].day1 ?? 0,
				day3_strength: data.samples[3].day3 ?? 0,
				day7_strength: data.samples[3].day7 ?? 0,
				day28_strength: data.samples[3].day28 ?? 0,
				expansion: data.samples[3].expansion ?? 0,
				createdById: user,
			});
		}
	}

	return tx.strengthTransactions.create({
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			materialId: data.materialId,
			createdById: user,
			samples: {
				create: transformedSamples,
			},
		},
		include: { samples: true },
	});
};

// Revised getStrengthSchedule
export const getStrengthSchedule = async (
	accessToken: string,
	transactionDate: string, // e.g. "2025-07-03"
	materialId: string
) => {
	const trnDate = parseDateOnly(transactionDate);

	// offsets: number of days between sampleDate and the transaction date
	const testDays: {
		key: "day1" | "day3" | "day7" | "day28";
		daysBefore: number;
		label: string;
	}[] = [
		{ key: "day1", daysBefore: 2, label: "Day 1" },
		{ key: "day3", daysBefore: 4, label: "Day 3" },
		{ key: "day7", daysBefore: 8, label: "Day 7" },
		{ key: "day28", daysBefore: 29, label: "Day 28" },
	];

	// compute sample dates (Date objects)
	const sampleDates = testDays.map((t) => ({
		key: t.key,
		label: t.label,
		sampleDate: subDays(trnDate, t.daysBefore),
	}));

	// fetch any existing samples for these sampleDates for the given material
	const sampleDateStrings = sampleDates.map(
		(d) => d.sampleDate.toISOString().split("T")[0]
	);

	const existing = await prisma.strengthSamples.findMany({
		where: {
			transaction: { materialId, isActive: true },
			sampleDate: { in: sampleDates.map((d) => d.sampleDate) },
			// if your DB stores date-only, you can compare directly; else adjust accordingly
		},
		include: { transaction: true },
	});

	// normalize existing samples into map by date string (YYYY-MM-DD)
	const existingByDate = new Map<string, any>();
	for (const s of existing) {
		const key = s.sampleDate.toISOString().split("T")[0];
		existingByDate.set(key, s);
	}
	let editableKey: string | null = null;
	const candidates = sampleDates.map((sd) => {
		const keyStr = sd.sampleDate.toISOString().split("T")[0];
		const sample = existingByDate.get(keyStr);
		const filled =
			!!sample &&
			((sd.key === "day1" && sample.day1_strength) ||
				(sd.key === "day3" && sample.day3_strength) ||
				(sd.key === "day7" && sample.day7_strength) ||
				(sd.key === "day28" && sample.day28_strength));
		return { key: sd.key, daysBefore: sd.sampleDate, sample, filled };
	});

	for (const c of candidates) {
		if (!c.filled) {
			editableKey = c.key;
			break;
		}
	}
	if (!editableKey) editableKey = "day1";

	const schedule = sampleDates.map((sd) => {
		const day1Sample = existingByDate.get(
			subDays(trnDate, testDays.find((t) => t.key === "day1")!.daysBefore)
				.toISOString()
				.split("T")[0]
		);
		const day3Sample = existingByDate.get(
			subDays(trnDate, testDays.find((t) => t.key === "day3")!.daysBefore)
				.toISOString()
				.split("T")[0]
		);
		const day7Sample = existingByDate.get(
			subDays(trnDate, testDays.find((t) => t.key === "day7")!.daysBefore)
				.toISOString()
				.split("T")[0]
		);
		const day28Sample = existingByDate.get(
			subDays(trnDate, testDays.find((t) => t.key === "day28")!.daysBefore)
				.toISOString()
				.split("T")[0]
		);

		return {
			key: sd.key,
			label: sd.label,
			sampleDate: extractDateTime(sd.sampleDate, "date"),
			day1: day1Sample ? Number(day1Sample.day1_strength ?? 0) : 0,
			day3: day3Sample ? Number(day3Sample.day3_strength ?? 0) : 0,
			day7: day7Sample ? Number(day7Sample.day7_strength ?? 0) : 0,
			day28: day28Sample ? Number(day28Sample.day28_strength ?? 0) : 0,
			expansion:
				existingByDate.get(sd.sampleDate.toISOString().split("T")[0])
					?.expansion ?? 0,
			editable: sd.key === editableKey, // only the chosen day is editable
		};
	});

	const materialName = materialId
		? await getMaterialName(materialId, accessToken)
		: null;
	const transaction = existing[0]?.transaction;
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
	// Get the transaction first to access its samples
	const transaction = await tx.strengthTransactions.findUnique({
		where: { id },
		include: { samples: true },
	});

	if (!transaction) {
		throw new Error("Strength transaction not found");
	}

	// Create a map for sample dates to identify which samples to update
	const sampleMap = new Map<string, string>();
	transaction.samples.forEach((sample) => {
		const dateStr = sample.sampleDate.toISOString().split("T")[0];
		sampleMap.set(dateStr, sample.id);
	});

	const updateOperations = [];

	// Process Day 1 sample
	if (data.samples[0] && data.samples[0].sampleDate1) {
		const sampleDate = parseDateOnly(data.samples[0].sampleDate1);
		const dateStr = sampleDate.toISOString().split("T")[0];
		const sampleId = sampleMap.get(dateStr);

		if (sampleId) {
			updateOperations.push({
				where: { id: sampleId },
				data: {
					day1_strength: data.samples[0].day1 ?? 0,
					day3_strength: data.samples[0].day3 ?? 0,
					day7_strength: data.samples[0].day7 ?? 0,
					day28_strength: data.samples[0].day28 ?? 0,
					expansion: data.samples[0].expansion ?? 0,
					updatedById: user,
				},
			});
		}
	}

	// Process Day 3 sample
	if (data.samples[1] && data.samples[1].sampleDate3) {
		const sampleDate = parseDateOnly(data.samples[1].sampleDate3);
		const dateStr = sampleDate.toISOString().split("T")[0];
		const sampleId = sampleMap.get(dateStr);

		if (sampleId) {
			updateOperations.push({
				where: { id: sampleId },
				data: {
					day1_strength: data.samples[1].day1 ?? 0,
					day3_strength: data.samples[1].day3 ?? 0,
					day7_strength: data.samples[1].day7 ?? 0,
					day28_strength: data.samples[1].day28 ?? 0,
					expansion: data.samples[1].expansion ?? 0,
					updatedById: user,
				},
			});
		}
	}

	// Process Day 7 sample
	if (data.samples[2] && data.samples[2].sampleDate7) {
		const sampleDate = parseDateOnly(data.samples[2].sampleDate7);
		const dateStr = sampleDate.toISOString().split("T")[0];
		const sampleId = sampleMap.get(dateStr);

		if (sampleId) {
			updateOperations.push({
				where: { id: sampleId },
				data: {
					day1_strength: data.samples[2].day1 ?? 0,
					day3_strength: data.samples[2].day3 ?? 0,
					day7_strength: data.samples[2].day7 ?? 0,
					day28_strength: data.samples[2].day28 ?? 0,
					expansion: data.samples[2].expansion ?? 0,
					updatedById: user,
				},
			});
		}
	}

	// Process Day 28 sample
	if (data.samples[3] && data.samples[3].sampleDate28) {
		const sampleDate = parseDateOnly(data.samples[3].sampleDate28);
		const dateStr = sampleDate.toISOString().split("T")[0];
		const sampleId = sampleMap.get(dateStr);

		if (sampleId) {
			updateOperations.push({
				where: { id: sampleId },
				data: {
					day1_strength: data.samples[3].day1 ?? 0,
					day3_strength: data.samples[3].day3 ?? 0,
					day7_strength: data.samples[3].day7 ?? 0,
					day28_strength: data.samples[3].day28 ?? 0,
					expansion: data.samples[3].expansion ?? 0,
					updatedById: user,
				},
			});
		}
	}

	return tx.strengthTransactions.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			materialId: data.materialId,
			updatedById: user,
			samples: {
				updateMany: updateOperations,
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
				uuid: t.id,
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
	tx = prisma
) => {
	const transaction = await tx.strengthTransactions.findUnique({
		where: { id },
		include: { samples: { orderBy: { sampleDate: "desc" } } },
	});
	if (!transaction) throw new Error("Strength transaction not found");

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
