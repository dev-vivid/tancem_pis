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
					remarks: p.remarks && p.remarks.trim() !== "" ? p.remarks : null,
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
		problemId?: string;
		problemHours?: string; // HH:MM
		remarks?: string;
		noOfStoppages?: number;
	},
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// 1. Find parent stoppage id
	const child = await tx.stoppageProblem.findUnique({
		where: { id: id },
		select: { stoppageId: true },
	});

	if (!child) {
		throw new Error("StoppageProblem not found");
	}
	const stoppageId = child.stoppageId;

	// 2. Determine if any child fields are present
	const hasChildFields =
		data.problemId !== undefined ||
		data.problemHours !== undefined ||
		data.remarks !== undefined ||
		data.noOfStoppages !== undefined;

	// 3. Update child if fields exist
	if (hasChildFields) {
		await tx.stoppageProblem.update({
			where: { id: id },
			data: {
				...(data.problemId ? { problemId: data.problemId } : {}),
				...(data.problemHours ? { problemHours: data.problemHours } : {}),
				...(data.remarks !== undefined
					? {
							remarks:
								data.remarks && data.remarks.trim() !== ""
									? data.remarks
									: null,
					  }
					: {}),
				...(data.noOfStoppages !== undefined
					? { noOfStoppages: data.noOfStoppages }
					: {}),
				updatedById: user,
			},
		});
	}

	// 4. Recalculate parent totals from all child problems
	const allProblems = await tx.stoppageProblem.findMany({
		where: { stoppageId },
		select: { problemHours: true },
	});

	const totalProblemMinutes = allProblems.reduce((sum, p) => {
		if (p.problemHours) return sum + timeStringToMinutes(p.problemHours);
		return sum;
	}, 0);

	const stoppageHours = minutesToTimeString(totalProblemMinutes);
	const totalHours = "24:00";
	const runningMinutes = Math.max(24 * 60 - totalProblemMinutes, 0);
	const runningHours = minutesToTimeString(runningMinutes);

	// 5. Update parent stoppage
	const updated = await tx.stoppage.update({
		where: { id: stoppageId },
		data: {
			...(data.transactionDate
				? { transactionDate: parseDateOnly(data.transactionDate) }
				: {}),
			...(data.departmentId ? { departmentId: data.departmentId } : {}),
			...(data.equipmentMainId
				? { equipmentMainId: data.equipmentMainId }
				: {}),
			...(data.equipmentSubGroupId
				? { equipmentSubGroupId: data.equipmentSubGroupId }
				: {}),
			runningHours,
			stoppageHours,
			totalHours,
			updatedById: user,
		},
		include: { stoppageproblems: true },
	});

	// return updated;
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
				createdAt: extractDateTime(problem.createdAt, "both"),
				updatedAt: extractDateTime(problem.updatedAt, "both"),
				createdById: problem.createdById,
				updatedById: problem.updatedById,
				isActive: problem.isActive,
				createdUser: createdUser?.userName,
				updatedUser: updatedUser?.userName,
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
	// 1. Fetch the child with its parent
	const problem = await tx.stoppageProblem.findFirst({
		where: { id: id, isActive: true },
		include: {
			stoppageFk: true, // parent stoppage
			ProblemFk: true, // problem details
		},
	});

	if (!problem) {
		throw new Error("StoppageProblem not found");
	}

	const parent = problem.stoppageFk;

	// 2. Fetch related names
	const equipmentName = parent.equipmentMainId
		? await getEquipmentName(parent.equipmentMainId, accessToken)
		: null;

	const equipmentSubGroupName = parent.equipmentSubGroupId
		? await getEquipmentSubGroupName(parent.equipmentSubGroupId, accessToken)
		: null;

	const departmentName = parent.departmentId
		? await getDepartmentName(parent.departmentId, accessToken)
		: null;

	const createdUser = problem.createdById
		? await getUserData(problem.createdById)
		: null;
	const updatedUser = problem.updatedById
		? await getUserData(problem.updatedById)
		: null;

	const validSubGroup =
		equipmentSubGroupName &&
		equipmentSubGroupName.equipmentGroupId === parent.equipmentMainId
			? equipmentSubGroupName
			: null;

	// 3. Map to response
	const data = {
		uuid: problem.id,
		stoppageId: parent.id,
		stoppageCode: parent.code,
		transactionDate: extractDateTime(parent.transactionDate, "date"),
		departmentId: parent.departmentId,
		departmentName: departmentName ? departmentName.name : null,
		equipmentMainId: parent.equipmentMainId,
		equipmentMainName: equipmentName ? equipmentName.name : null,
		equipmentSubGroupId: parent.equipmentSubGroupId,
		equipmentSubGroupName: validSubGroup ? validSubGroup.name : null,
		runningHours: parent.runningHours,
		stoppageHours: parent.stoppageHours,
		totalHours: parent.totalHours,

		// child problem details
		problemId: problem.problemId,
		problemName: problem.ProblemFk.problemName || null,
		problemHours: problem.problemHours,
		noOfStoppages: problem.noOfStoppages,
		remarks: problem.remarks,
		createdAt: extractDateTime(problem.createdAt, "both"),
		updatedAt: extractDateTime(problem.updatedAt, "both"),
		createdById: problem.createdById,
		updatedById: problem.updatedById,
		isActive: problem.isActive,
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
	};

	return data;
};

export const deleteStoppage = async (
	id: string,
	user: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// 1. Find the child and its parent
	const child = await tx.stoppageProblem.findUnique({
		where: { id: id },
		select: { stoppageId: true },
	});

	if (!child) {
		throw new Error("StoppageProblem not found");
	}

	const stoppageId = child.stoppageId;

	// 2. Soft delete the specific child
	await tx.stoppageProblem.update({
		where: { id: id },
		data: {
			isActive: false,
			updatedById: user,
		},
	});

	// 3. Get all remaining active child problems
	const remainingChildren = await tx.stoppageProblem.findMany({
		where: { stoppageId, isActive: true },
		select: { problemHours: true },
	});

	if (remainingChildren.length > 0) {
		// Recalculate totals for parent
		const totalProblemMinutes = remainingChildren.reduce((sum, p) => {
			if (p.problemHours) return sum + timeStringToMinutes(p.problemHours);
			return sum;
		}, 0);

		const stoppageHours = minutesToTimeString(totalProblemMinutes);
		const totalHours = "24:00";
		const runningMinutes = Math.max(24 * 60 - totalProblemMinutes, 0);
		const runningHours = minutesToTimeString(runningMinutes);

		// Update parent stoppage totals
		await tx.stoppage.update({
			where: { id: stoppageId },
			data: {
				runningHours,
				stoppageHours,
				totalHours,
				updatedById: user,
			},
		});
	} else {
		// No children left → soft delete parent
		await tx.stoppage.update({
			where: { id: stoppageId },
			data: {
				isActive: false,
				updatedById: user,
			},
		});
	}
};
