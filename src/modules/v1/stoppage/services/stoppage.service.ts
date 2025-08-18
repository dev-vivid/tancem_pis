import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";


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
    equipmentId: string;
    equipmentMainId: string;
    equipmentSubGroupId: string;
    equipmentSubSubGroupId: string;
    problems: {
      problemId: string;
      problemHours?: string; // HH:MM
      remarks?: string;
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
      transactionDate: new Date(data.transactionDate),
      departmentId: data.departmentId,
      equipmentId: data.equipmentId,
      equipmentMainId: data.equipmentMainId,
      equipmentSubGroupId: data.equipmentSubGroupId,
      equipmentSubSubGroupId: data.equipmentSubSubGroupId,
      runningHours,
      stoppageHours,
      totalHours,
      createdById: user,
      stoppageproblems: {
        create: data.problems.map((p) => ({
          problemId: p.problemId,
          problemHours: p.problemHours ?? null,
          remarks: p.remarks ?? null,
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
    equipmentId?: string;
    equipmentMainId?: string;
    equipmentSubGroupId?: string;
    equipmentSubSubGroupId?: string;
    problems?: {
      id: string;
      problemId?: string;
      problemHours?: string; // HH:MM
      remarks?: string;
    }[];
  },
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  // If problems exist → recalc hours
  let stoppageHours: string | undefined;
  let runningHours: string | undefined;
  const totalHours = "24:00";

  if (data.problems && data.problems.length > 0) {
    const totalProblemMinutes = data.problems.reduce((sum, p) => {
      if (p.problemHours) return sum + timeStringToMinutes(p.problemHours);
      return sum;
    }, 0);

    stoppageHours = minutesToTimeString(totalProblemMinutes);
    const totalMinutes = 24 * 60;
    const runningMinutes = Math.max(totalMinutes - totalProblemMinutes, 0);
    runningHours = minutesToTimeString(runningMinutes);
  }

  const updatedStoppage = await tx.stoppage.update({
    where: { id },
    data: {
      transactionDate: data.transactionDate ? new Date(data.transactionDate) : undefined,
      departmentId: data.departmentId,
      equipmentId: data.equipmentId,
      equipmentMainId: data.equipmentMainId,
      equipmentSubGroupId: data.equipmentSubGroupId,
      equipmentSubSubGroupId: data.equipmentSubSubGroupId,
      stoppageHours,
      runningHours,
      totalHours,
      updatedById: user,

      stoppageproblems: data.problems
        ? {
            update: data.problems.map((p) => ({
              where: { id: p.id },
              data: {
                ...(p.problemId !== undefined && { problemId: p.problemId }),
                ...(p.problemHours !== undefined && { problemHours: p.problemHours }),
                ...(p.remarks !== undefined && { remarks: p.remarks }),
                updatedById: user,
              },
            })),
          }
        : undefined,
    },
  });

  return updatedStoppage;
};


export const getAllStoppage = async (
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({pageNumber, pageSize});

	return tx.stoppage.findMany({
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

	return stoppageById;
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
