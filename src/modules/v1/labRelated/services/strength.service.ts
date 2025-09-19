import { getMaterialName } from "common/api";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import { subDays } from "date-fns";
import getUserData from "@shared/prisma/queries/getUserById";

// ✅ Create Strength
export const createStrength = async (
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const createPromises = [];

	// Process Day 1 sample
	if (data.samples[0] && data.samples[0].sampleDate1) {
		createPromises.push(
			tx.strength.create({
				data: {
					transactionDate: parseDateOnly(data.transactionDate),
					materialId: data.materialId,
					sampleDate1: parseDateOnly(data.samples[0].sampleDate1),
					day1: data.samples[0].day1 ?? 0,
					expansion: data.samples[0].expansion ?? 0,
					createdById: user,
				},
			})
		);
	}

	// Process Day 3 sample
	if (data.samples[1] && data.samples[1].sampleDate3) {
		createPromises.push(
			tx.strength.create({
				data: {
					transactionDate: parseDateOnly(data.transactionDate),
					materialId: data.materialId,
					sampleDate3: parseDateOnly(data.samples[1].sampleDate3),
					day3: data.samples[1].day3 ?? 0,
					createdById: user,
				},
			})
		);
	}

	// Process Day 7 sample
	if (data.samples[2] && data.samples[2].sampleDate7) {
		createPromises.push(
			tx.strength.create({
				data: {
					transactionDate: parseDateOnly(data.transactionDate),
					materialId: data.materialId,
					sampleDate7: parseDateOnly(data.samples[2].sampleDate7),
					day7: data.samples[2].day7 ?? 0,
					createdById: user,
				},
			})
		);
	}

	// Process Day 28 sample
	if (data.samples[3] && data.samples[3].sampleDate28) {
		createPromises.push(
			tx.strength.create({
				data: {
					transactionDate: parseDateOnly(data.transactionDate),
					materialId: data.materialId,
					sampleDate28: parseDateOnly(data.samples[3].sampleDate28),
					day28: data.samples[3].day28 ?? 0,
					createdById: user,
				},
			})
		);
	}

	return Promise.all(createPromises);
};

// ✅ Update Strength - now with ID parameter for updating specific records
export const updateStrength = async (
	id: string,
	data: any,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// Get the strength record first
	const record = await tx.strength.findUnique({
		where: { id },
	});

	if (!record) {
		throw new Error("Strength record not found");
	}

	const updateData: any = {
		transactionDate: parseDateOnly(data.transactionDate),
		materialId: data.materialId,
		updatedById: user,
	};

	// Process Day 1 sample
	if (data.samples[0] && data.samples[0].sampleDate1) {
		updateData.sampleDate1 = parseDateOnly(data.samples[0].sampleDate1);
		updateData.day1 = data.samples[0].day1 ?? record.day1;
		updateData.expansion = data.samples[0].expansion ?? record.expansion;
	}

	// Process Day 3 sample
	if (data.samples[1] && data.samples[1].sampleDate3) {
		updateData.sampleDate3 = parseDateOnly(data.samples[1].sampleDate3);
		updateData.day3 = data.samples[1].day3 ?? record.day3;
	}

	// Process Day 7 sample
	if (data.samples[2] && data.samples[2].sampleDate7) {
		updateData.sampleDate7 = parseDateOnly(data.samples[2].sampleDate7);
		updateData.day7 = data.samples[2].day7 ?? record.day7;
	}

	// Process Day 28 sample
	if (data.samples[3] && data.samples[3].sampleDate28) {
		updateData.sampleDate28 = parseDateOnly(data.samples[3].sampleDate28);
		updateData.day28 = data.samples[3].day28 ?? record.day28;
	}

	return tx.strength.update({
		where: { id },
		data: updateData,
	});
};

// ✅ Get Strength Schedule
export const getStrengthSchedule = async (
	accessToken: string,
	transactionDate: string,
	materialId: string
) => {
	const trnDate = parseDateOnly(transactionDate);

	// Define test days with offsets
	const testDays = [
		{ key: "day1", daysBefore: 2, label: "Day 1" },
		{ key: "day3", daysBefore: 4, label: "Day 3" },
		{ key: "day7", daysBefore: 8, label: "Day 7" },
		{ key: "day28", daysBefore: 29, label: "Day 28" },
	];

	// Compute sample dates
	const sampleDates = testDays.map((t) => ({
		key: t.key,
		label: t.label,
		sampleDate: subDays(trnDate, t.daysBefore),
	}));

	// Fetch records for day1, day3, day7, day28
	const sampleDateStrings = sampleDates.map(
		(d) => d.sampleDate.toISOString().split("T")[0]
	);

	// Query structure for each day's data
	const day1Records = await prisma.strength.findMany({
		where: {
			sampleDate1: { in: sampleDates.map((d) => d.sampleDate) },
			materialId,
			isActive: true,
		},
	});

	const day3Records = await prisma.strength.findMany({
		where: {
			sampleDate3: { in: sampleDates.map((d) => d.sampleDate) },
			materialId,
			isActive: true,
		},
	});

	const day7Records = await prisma.strength.findMany({
		where: {
			sampleDate7: { in: sampleDates.map((d) => d.sampleDate) },
			materialId,
			isActive: true,
		},
	});

	const day28Records = await prisma.strength.findMany({
		where: {
			sampleDate28: { in: sampleDates.map((d) => d.sampleDate) },
			materialId,
			isActive: true,
		},
	});

	// Create maps for each day's records
	const day1Map = new Map();
	const day3Map = new Map();
	const day7Map = new Map();
	const day28Map = new Map();
	const expansionMap = new Map();

	day1Records.forEach((rec) => {
		if (rec.sampleDate1) {
			const dateStr = rec.sampleDate1.toISOString().split("T")[0];
			day1Map.set(dateStr, Number(rec.day1 ?? 0));
			expansionMap.set(dateStr, Number(rec.expansion ?? 0));
		}
	});

	day3Records.forEach((rec) => {
		if (rec.sampleDate3) {
			const dateStr = rec.sampleDate3.toISOString().split("T")[0];
			day3Map.set(dateStr, Number(rec.day3 ?? 0));
		}
	});

	day7Records.forEach((rec) => {
		if (rec.sampleDate7) {
			const dateStr = rec.sampleDate7.toISOString().split("T")[0];
			day7Map.set(dateStr, Number(rec.day7 ?? 0));
		}
	});

	day28Records.forEach((rec) => {
		if (rec.sampleDate28) {
			const dateStr = rec.sampleDate28.toISOString().split("T")[0];
			day28Map.set(dateStr, Number(rec.day28 ?? 0));
		}
	});

	// Find first record to get creator/updater info
	const anyRecord = [
		...day1Records,
		...day3Records,
		...day7Records,
		...day28Records,
	][0];

	// Determine which day is editable (first unfilled day)
	let editableKey: string | null = null;
	for (const sd of sampleDates) {
		const dateStr = sd.sampleDate.toISOString().split("T")[0];
		const filled =
			(sd.key === "day1" && day1Map.has(dateStr)) ||
			(sd.key === "day3" && day3Map.has(dateStr)) ||
			(sd.key === "day7" && day7Map.has(dateStr)) ||
			(sd.key === "day28" && day28Map.has(dateStr));

		if (!filled) {
			editableKey = sd.key;
			break;
		}
	}
	if (!editableKey) editableKey = "day1";

	// Build schedule response
	const schedule = sampleDates.map((sd) => {
		const dateStr = sd.sampleDate.toISOString().split("T")[0];
		return {
			key: sd.key,
			label: sd.label,
			sampleDate: extractDateTime(sd.sampleDate, "date"),
			day1: day1Map.get(dateStr) || 0,
			day3: day3Map.get(dateStr) || 0,
			day7: day7Map.get(dateStr) || 0,
			day28: day28Map.get(dateStr) || 0,
			expansion: expansionMap.get(dateStr) || 0,
			editable: sd.key === editableKey,
		};
	});

	// Get material name and user info
	const materialName = materialId
		? await getMaterialName(materialId, accessToken)
		: null;

	const createdUser = anyRecord?.createdById
		? await getUserData(anyRecord.createdById)
		: null;

	const updatedUser = anyRecord?.updatedById
		? await getUserData(anyRecord.updatedById)
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

	// Get unique transaction dates for grouping
	const uniqueTransactions = await tx.strength.groupBy({
		by: ["transactionDate", "materialId"],
		where: { isActive: true },
		orderBy: { transactionDate: "desc" },
		skip,
		take,
	});

	const totalRecords = await tx.strength.groupBy({
		by: ["transactionDate", "materialId"],
		where: { isActive: true },
		_count: true,
	});

	// Map and fetch additional data for each transaction
	const data = await Promise.all(
		uniqueTransactions.map(async (t) => {
			// Get the first record for this transaction to get user info
			const record = await tx.strength.findFirst({
				where: {
					transactionDate: t.transactionDate,
					materialId: t.materialId,
					isActive: true,
				},
				orderBy: { createdAt: "desc" },
			});

			if (!record) return null;

			const materialName = record.materialId
				? await getMaterialName(record.materialId, accessToken)
				: null;

			const createdUser = record.createdById
				? await getUserData(record.createdById)
				: null;

			const updatedUser = record.updatedById
				? await getUserData(record.updatedById)
				: null;

			// Count samples for this transaction
			const sampleCount = await tx.strength.count({
				where: {
					transactionDate: t.transactionDate,
					materialId: t.materialId,
					isActive: true,
				},
			});

			return {
				uuid: record.id, // Using ID of first record as reference
				transactionDate: extractDateTime(t.transactionDate, "date"),
				materialId: t.materialId,
				materialName: materialName ? materialName.name : null,
				sampleCount,
				createdAt: extractDateTime(record.createdAt, "both"),
				createdById: record.createdById,
				updatedAt: record.updatedAt
					? extractDateTime(record.updatedAt, "both")
					: null,
				updatedById: record.updatedById,
				createdUser,
				updatedUser,
			};
		})
	);

	return {
		totalRecords: totalRecords.length,
		data: data.filter(Boolean),
	};
};

// ✅ Get by ID
export const getStrengthById = async (
	id: string,
	accessToken: string,
	tx = prisma
) => {
	const record = await tx.strength.findUnique({
		where: { id },
	});

	if (!record) {
		throw new Error("Strength record not found");
	}

	// Find all related records with the same transaction date and material
	const relatedRecords = await tx.strength.findMany({
		where: {
			transactionDate: record.transactionDate,
			materialId: record.materialId,
			isActive: true,
		},
	});

	// Process records into sample format
	const samples = [];

	// Check for Day 1 sample
	const day1Record = relatedRecords.find((r) => r.sampleDate1 !== null);
	if (day1Record && day1Record.sampleDate1) {
		samples.push({
			id: day1Record.id,
			sampleDate: extractDateTime(day1Record.sampleDate1, "date"),
			day1_strength: day1Record.day1,
			day3_strength: 0,
			day7_strength: 0,
			day28_strength: 0,
			expansion: day1Record.expansion,
		});
	}

	// Check for Day 3 sample
	const day3Record = relatedRecords.find((r) => r.sampleDate3 !== null);
	if (day3Record && day3Record.sampleDate3) {
		samples.push({
			id: day3Record.id,
			sampleDate: extractDateTime(day3Record.sampleDate3, "date"),
			day1_strength: 0,
			day3_strength: day3Record.day3,
			day7_strength: 0,
			day28_strength: 0,
			expansion: 0,
		});
	}

	// Check for Day 7 sample
	const day7Record = relatedRecords.find((r) => r.sampleDate7 !== null);
	if (day7Record && day7Record.sampleDate7) {
		samples.push({
			id: day7Record.id,
			sampleDate: extractDateTime(day7Record.sampleDate7, "date"),
			day1_strength: 0,
			day3_strength: 0,
			day7_strength: day7Record.day7,
			day28_strength: 0,
			expansion: 0,
		});
	}

	// Check for Day 28 sample
	const day28Record = relatedRecords.find((r) => r.sampleDate28 !== null);
	if (day28Record && day28Record.sampleDate28) {
		samples.push({
			id: day28Record.id,
			sampleDate: extractDateTime(day28Record.sampleDate28, "date"),
			day1_strength: 0,
			day3_strength: 0,
			day7_strength: 0,
			day28_strength: day28Record.day28,
			expansion: 0,
		});
	}

	// Get material and user info
	const materialName = record.materialId
		? await getMaterialName(record.materialId, accessToken)
		: null;

	const createdUser = record.createdById
		? await getUserData(record.createdById)
		: null;

	const updatedUser = record.updatedById
		? await getUserData(record.updatedById)
		: null;

	return {
		id: record.id,
		transactionDate: extractDateTime(record.transactionDate, "date"),
		materialId: record.materialId,
		materialName: materialName ? materialName.name : null,
		samples,
		createdAt: extractDateTime(record.createdAt, "both"),
		createdById: record.createdById,
		updatedAt: extractDateTime(record.updatedAt, "both"),
		updatedById: record.updatedById,
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
	const record = await tx.strength.findUnique({
		where: { id },
	});

	if (!record) {
		throw new Error("Strength record not found");
	}

	await tx.strength.updateMany({
		where: {
			transactionDate: record.transactionDate,
			materialId: record.materialId,
		},
		data: {
			isActive: false,
			updatedById: user,
		},
	});

	return { success: true };
};
