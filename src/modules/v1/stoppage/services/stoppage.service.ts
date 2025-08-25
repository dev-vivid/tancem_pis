import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime, parseDateOnly } from "../../../../shared/utils/date/index";


function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export const createStoppage = async (
  data: {
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
  const totalProblemMinutes = data.problems.reduce((sum, p) => {
    if (p.problemHours) {
      return sum + timeStringToMinutes(p.problemHours);
    }
    return sum;
  }, 0);

  // 2. Stoppage hours
  const stoppageHours = minutesToTimeString(totalProblemMinutes);

  // 3. Total hours is always 24:00 (1440 minutes)
  const totalMinutes = 24 * 60;
  const totalHours = "24:00";

  // 4. Running hours = total - stoppage
  const runningMinutes = Math.max(totalMinutes - totalProblemMinutes, 0);
  const runningHours = minutesToTimeString(runningMinutes);

  // 5. Create Stoppage with Problems
  return tx.stoppage.create({
    data: {
      transactionDate: parseDateOnly(data.transactionDate),
      departmentId: data.departmentId,
      equipmentMainId: data.equipmentMainId,
      equipmentSubGroupId: data.equipmentSubGroupId,
      runningHours,
      stoppageHours,
      totalHours,
      createdById: user,
      stoppageproblems: {
        create: data.problems.map((p) => ({
          problemId: p.problemId,
          problemHours: p.problemHours,
          remarks: p.remarks,
					noOfStoppages: p.noOfStoppages,
          createdById: user,
        })),
      },
    },
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
      id: string;
      problemId?: string;
      problemHours?: string; // HH:MM
      remarks?: string;
      noOfStoppages?: number;
    }[];
  },
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  // Update problems if provided
  if (data.problems?.length) {
    for (const p of data.problems) {
      await tx.stoppageProblem.update({
        where: { id: p.id },
        data: {
          ...(p.problemId && { problemId: p.problemId }),
          ...(p.problemHours && { problemHours: p.problemHours }),
          ...(p.remarks && { remarks: p.remarks }),
          ...(p.noOfStoppages !== undefined && { noOfStoppages: p.noOfStoppages }),
          updatedById: user,
        },
      });
    }
  }

  // Get all active problems for this stoppage
  const problems = await tx.stoppageProblem.findMany({
    where: { stoppageId: id, isActive: true },
    select: { problemHours: true },
  });

  // Recalculate totals
  const totalProblemMinutes = problems.reduce(
    (sum, p) => sum + (p.problemHours ? timeStringToMinutes(p.problemHours) : 0),
    0
  );
  const stoppageHours = minutesToTimeString(totalProblemMinutes);
  const runningHours = minutesToTimeString(Math.max(24 * 60 - totalProblemMinutes, 0));

  // Update main stoppage
  await tx.stoppage.update({
    where: { id },
    data: {
      transactionDate: data.transactionDate ? parseDateOnly(data.transactionDate) : undefined,
      departmentId: data.departmentId,
      equipmentMainId: data.equipmentMainId,
      equipmentSubGroupId: data.equipmentSubGroupId,
      stoppageHours,
      runningHours,
      totalHours: "24:00",
      updatedById: user,
    },
  });
};



export const getAllStoppage = async (
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({pageNumber, pageSize});

	const totalRecords = await tx.stoppage.count({
    where: { isActive: true },
  });

	const transactions = await tx.stoppage.findMany({
		skip,
		take,
		where: { isActive: true, },
		orderBy: { createdAt: "desc"},
		include: {
			stoppageproblems: {
				where: { isActive: true},
				orderBy: { createdAt: "desc"},
			}
		}
	});

	const data = transactions.map(item => ({
    ...item,
		transactionDate: extractDateTime(item.transactionDate, "date"),
    createdAt: extractDateTime(item.createdAt, "both"),
    updatedAt: extractDateTime(item.updatedAt, "both"),
    stoppageproblems: item.stoppageproblems.map(detail => ({
      ...detail,
      createdAt: extractDateTime(detail.createdAt, "both"),
      updatedAt: extractDateTime(detail.updatedAt, "both"),
    })),
  }));

	return { totalRecords, data };
};


export const getStoppageById = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const stoppageById = await tx.stoppage.findFirst({
		where: { id, isActive: true,},
		orderBy: { createdAt: "desc"},
		include: {
			stoppageproblems: {
				where: { isActive: true},
				orderBy: { createdAt: "desc"},
			}
		}
	});

	if(!stoppageById){throw new Error(`Id not found 404`)};


	return {
		...stoppageById,
		transactionDate: extractDateTime(stoppageById.transactionDate, "date"),
    createdAt: extractDateTime(stoppageById.createdAt, "both"),
    updatedAt: extractDateTime(stoppageById.updatedAt, "both"),
    stoppageproblems: stoppageById.stoppageproblems.map(detail => ({
      ...detail,
      createdAt: extractDateTime(detail.createdAt, "both"),
      updatedAt: extractDateTime(detail.updatedAt, "both"),
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
