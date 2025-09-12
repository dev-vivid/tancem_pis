import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import {
	extractDateTime,
	parseDateOnly,
} from "../../../../shared/utils/date/index";
import {
	getEquipmentName,
	getDepartmentName,
	getEquipmentSubGroupName,
	getOfficeName,
} from "../../../../common/api";
import getUserData from "@shared/prisma/queries/getUserById";

function timeStringToMinutes(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}

function minutesToTimeString(minutes: number): string {
	const h = Math.floor(minutes / 60)
		.toString()
		.padStart(2, "0");
	const m = (minutes % 60).toString().padStart(2, "0");
	return `${h}:${m}`;
}

export const createStoppage = async (
	stoppagedata: {
		transactionDate: Date;
		departmentId: string;
		equipmentMainId: string;
		equipmentSubGroupId: string;
		problems: {
			problemId: string;
			problemHours?: string; // HH:MM
			remarks?: string;
			noOfStoppages?: number;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// 1. Convert problemHours to minutes and calculate total
	const totalProblemMinutes = stoppagedata.problems.reduce((sum, p) => {
		if (p.problemHours) {
			return sum + timeStringToMinutes(p.problemHours);
		}
		return sum;
	}, 0);

	// 2. Stoppage hours
	const stoppageHours = minutesToTimeString(totalProblemMinutes);

	// 3. Total hours = 24:00
	const totalHours = "24:00";

	// 4. Running hours = total - stoppage
	const runningMinutes = Math.max(24 * 60 - totalProblemMinutes, 0);
	const runningHours = minutesToTimeString(runningMinutes);

	// 5. Create stoppage with problems
	const created = await tx.stoppage.create({
		data: {
			transactionDate: parseDateOnly(stoppagedata.transactionDate),
			departmentId: stoppagedata.departmentId,
			equipmentMainId: stoppagedata.equipmentMainId,
			equipmentSubGroupId: stoppagedata.equipmentSubGroupId,
			runningHours,
			stoppageHours,
			totalHours,
			createdById: user,
			stoppageproblems: {
				create: stoppagedata.problems.map((p) => ({
					problemId: p.problemId,
					problemHours: p.problemHours,
					remarks: p.remarks,
					noOfStoppages: p.noOfStoppages,
					createdById: user,
				})),
			},
		},
		include: { stoppageproblems: true },
	});
};

export const updateStoppage = async (
	id: string,
	data: {
		transactionDate?: Date;
		departmentId?: string;
		equipmentMainId?: string;
		equipmentSubGroupId?: string;
		problems?: {
			id?: string;
			problemId?: string;
			problemHours?: string; // HH:MM
			remarks?: string;
			noOfStoppages?: number;
		}[];
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// --- Separate problems into update & create ---
	const updateProblems = (data.problems || [])
		.filter((p) => p.id)
		.map((p) => ({
			where: { id: p.id! },
			data: {
				...(p.problemId && { problemId: p.problemId }),
				...(p.problemHours && { problemHours: p.problemHours }),
				...(p.remarks && { remarks: p.remarks }),
				...(p.noOfStoppages !== undefined && {
					noOfStoppages: p.noOfStoppages,
				}),
				updatedById: user,
			},
		}));

	const createProblems = (data.problems || [])
		.filter((p) => !p.id)
		.map((p) => ({
			stoppageId: id,
			problemId: p.problemId!,
			problemHours: p.problemHours ?? "00:00",
			noOfStoppages: p.noOfStoppages ?? 0,
			remarks: p.remarks,
			createdById: user,
			updatedById: user,
			isActive: true,
		}));

	// --- Find current active problems in DB ---
	const existingProblems = await tx.stoppageProblem.findMany({
		where: { stoppageId: id, isActive: true },
		select: { id: true },
	});
	const existingIds = existingProblems.map((p) => p.id);

	// IDs sent in request
	const sentIds = (data.problems || []).filter((p) => p.id).map((p) => p.id!);

	// To soft delete
	const deleteIds = existingIds.filter((eid) => !sentIds.includes(eid));

	// --- Update parent + children ---
	await tx.stoppage.update({
		where: { id },
		data: {
			transactionDate: data.transactionDate
				? parseDateOnly(data.transactionDate)
				: undefined,
			departmentId: data.departmentId,
			equipmentMainId: data.equipmentMainId,
			equipmentSubGroupId: data.equipmentSubGroupId,
			updatedById: user,
			stoppageproblems: {
				update: updateProblems,
				create: createProblems,
			},
		},
	});

	// --- Soft delete problems ---
	if (deleteIds.length) {
		await tx.stoppageProblem.updateMany({
			where: { id: { in: deleteIds } },
			data: { isActive: false, updatedById: user },
		});
	}

	// --- Recalculate totals from active problems ---
	const problems = await tx.stoppageProblem.findMany({
		where: { stoppageId: id, isActive: true },
		select: { problemHours: true },
	});

	const totalProblemMinutes = problems.reduce(
		(sum, p) =>
			sum + (p.problemHours ? timeStringToMinutes(p.problemHours) : 0),
		0
	);

	const stoppageHours = minutesToTimeString(totalProblemMinutes);
	const runningHours = minutesToTimeString(
		Math.max(24 * 60 - totalProblemMinutes, 0)
	);

	// --- Update calculated fields ---
	const updatedStoppage = await tx.stoppage.update({
		where: { id },
		data: {
			stoppageHours,
			runningHours,
			totalHours: "24:00",
			updatedById: user,
		},
		include: {
			stoppageproblems: {
				where: { isActive: true }, // return only active problems
			},
		},
	});

	// return updatedStoppage;
};

export const getAllStoppage = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	// const totalRecords = await tx.stoppage.count({
	//   where: { isActive: true },
	// });

	const transactions = await tx.stoppage.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
		include: {
			stoppageproblems: {
				where: { isActive: true },
				orderBy: { createdAt: "desc" },
				include: {
					ProblemFk: true,
				},
			},
		},
	});

	const data = await Promise.all(
		transactions.flatMap(async (item) => {
			const equipmentName = await getEquipmentName(
				item.equipmentMainId,
				accessToken
			);
			const equipmentSubGroupName = await getEquipmentSubGroupName(
				item.equipmentSubGroupId,
				accessToken
			);
			const departmentName = await getDepartmentName(
				item.departmentId,
				accessToken
			);

			const createdUser = item.createdById
				? await getUserData(item.createdById)
				: null;

			const updatedUser = item.updatedById
				? await getUserData(item.updatedById)
				: null;

			const validSubGroup =
				equipmentSubGroupName &&
				equipmentSubGroupName.equipmentGroupId === item.equipmentMainId
					? equipmentSubGroupName
					: null;

			return item.stoppageproblems.map((problem) => ({
				uuid: problem.id,
				stoppageId: item.id,
				stoppageCode: item.code,
				transactionDate: extractDateTime(item.transactionDate, "date"),
				departmentId: item.departmentId,
				departmentName: departmentName ? departmentName.name : null,
				equipmentMainId: item.equipmentMainId,
				equipmentMainName: equipmentName ? equipmentName.name : null,
				equipmentSubGroupId: item.equipmentSubGroupId,
				equipmentSubGroupName: validSubGroup ? validSubGroup.name : null,
				runningHours: item.runningHours,
				stoppageHours: item.stoppageHours,
				totalHours: item.totalHours,
				// stoppageCreatedAt: extractDateTime(item.createdAt, "both"),
				// stoppageUpdatedAt: extractDateTime(item.updatedAt, "both"),
				// stoppageCreatedById: item.createdById,
				// stoppageUpdatedById: item.updatedById,
				// stoppageCreatedUser: createdUser,
				// stoppageUpdatedUser: updatedUser,
				// stoppageIsActive: item.isActive,

				// problemCode: problem.code,
				problemId: problem.problemId,
				problemName: problem.ProblemFk.problemName || null,
				problemHours: problem.problemHours,
				noOfStoppages: problem.noOfStoppages,
				remarks: problem.remarks,
				reatedAt: extractDateTime(problem.createdAt, "both"),
				updatedAt: extractDateTime(problem.updatedAt, "both"),
				createdById: problem.createdById,
				updatedById: problem.updatedById,
				isActive: problem.isActive,
				createdUser: createdUser,
				updatedUser: updatedUser,
			}));
		})
	);
	return { data: data.flat() };
};

export const getStoppageById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const stoppageById = await tx.stoppage.findFirst({
		where: { id, isActive: true },
		orderBy: { createdAt: "desc" },
		include: {
			stoppageproblems: {
				where: { isActive: true },
				orderBy: { createdAt: "desc" },
				include: {
					ProblemFk: true,
				},
			},
		},
	});

	if (!stoppageById) {
		throw new Error(`Id not found 404`);
	}

	const equipmentName =
		stoppageById.equipmentMainId && accessToken
			? await getEquipmentName(stoppageById.equipmentMainId, accessToken)
			: null;
	const departmentName =
		stoppageById.departmentId && accessToken
			? await getDepartmentName(stoppageById.departmentId, accessToken)
			: null;
	const equipmentSubGroupName =
		stoppageById.equipmentSubGroupId && accessToken
			? await getEquipmentSubGroupName(
					stoppageById.equipmentSubGroupId,
					accessToken
			  )
			: null;

	const createdUser = stoppageById.createdById
		? await getUserData(stoppageById.createdById)
		: null;

	const updatedUser = stoppageById.updatedById
		? await getUserData(stoppageById.updatedById)
		: null;
	const validSubGroup =
		equipmentSubGroupName &&
		equipmentSubGroupName.equipmentGroupId === stoppageById.equipmentMainId
			? equipmentSubGroupName
			: null;

	const stoppageProblems = stoppageById.stoppageproblems.map((problem) => ({
		...problem,
		problemName: problem.ProblemFk?.problemName || null,
		createdAt: extractDateTime(problem.createdAt, "both"),
		updatedAt: extractDateTime(problem.updatedAt, "both"),
	}));

	return {
		uuid: stoppageById.id,
		stoppageCode: stoppageById.code,
		transactionDate: extractDateTime(stoppageById.transactionDate, "date"),
		departmentId: stoppageById.departmentId,
		departmentName: departmentName ? departmentName.name : null,
		equipmentMainId: stoppageById.equipmentMainId,
		equipmentMainName: equipmentName ? equipmentName.name : null,
		equipmentSubGroupId: stoppageById.equipmentSubGroupId,
		equipmentSubGroupName: validSubGroup ? validSubGroup.name : null,
		runningHours: stoppageById.runningHours,
		stoppageHours: stoppageById.stoppageHours,
		totalHours: stoppageById.totalHours,
		// stoppageCreatedAt: extractDateTime(stoppageById.createdAt, "both"),
		// stoppageUpdatedAt: extractDateTime(stoppageById.updatedAt, "both"),
		// stoppageCreatedById: stoppageById.createdById,
		// stoppageUpdatedById: stoppageById.updatedById,
		// stoppageCreatedUser: createdUser,
		// stoppageUpdatedUser: updatedUser,
		// stoppageIsActive: stoppageById.isActive,

		stoppageproblems: stoppageById.stoppageproblems.map((problem) => ({
			stoppageproblemId: problem.id,
			problemCode: problem.code,
			problemId: problem.problemId,
			problemName: problem.ProblemFk?.problemName || null,
			problemHours: problem.problemHours,
			noOfStoppages: problem.noOfStoppages,
			remarks: problem.remarks,
			problemCreatedAt: extractDateTime(problem.createdAt, "both"),
			problemUpdatedAt: extractDateTime(problem.updatedAt, "both"),
			problemCreatedById: problem.createdById,
			problemUpdatedById: problem.updatedById,
			problemIsActive: problem.isActive,
			createdUser: createdUser,
			updatedUser: updatedUser,
		})),
	};
};

export const deleteStoppage = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// First, check if stoppage exists and is active
	const existing = await tx.stoppage.findFirst({
		where: { id, isActive: true },
	});

	if (!existing) {
		throw new Error(`Stoppage with id ${id} not found or already deleted`);
	}

	// Soft delete main stoppage
	const deletedStoppage = await tx.stoppage.update({
		where: { id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});

	// Also soft delete its problems
	await tx.stoppageProblem.updateMany({
		where: { stoppageId: id, isActive: true },
		data: {
			isActive: false,
			updatedById: user,
		},
	});

	return deletedStoppage;
};
