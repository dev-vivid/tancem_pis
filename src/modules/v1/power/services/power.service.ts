import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime, parseDateOnly } from "../../../../shared/utils/date/index";

export const getAllPowerTransactions = async (
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

	const data = transactions.map(item => ({
    ...item,
		transactionDate: extractDateTime(item.transactionDate, "date"),
    createdAt: extractDateTime(item.createdAt, "both"),
    updatedAt: extractDateTime(item.updatedAt, "both"),
    powerDetails: item.powerDetails.map(detail => ({
      ...detail,
      createdAt: extractDateTime(detail.createdAt, "both"),
      updatedAt: extractDateTime(detail.updatedAt, "both"),
    })),
  }));

	return { totalRecords, data };
};

export const getPowerTransactionById = async (
  id: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const getPowerTransactionById = await tx.powerTransaction.findFirst({
    where: { id, isActive: true },
		orderBy: {createdAt: "desc"},
    include: {
      powerDetails: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

	if(!getPowerTransactionById){
		throw new Error(`Id not found 404`);
	}

	return {
		...getPowerTransactionById,
		transactionDate: extractDateTime(getPowerTransactionById.transactionDate, "date"),
    createdAt: extractDateTime(getPowerTransactionById.createdAt, "both"),
    updatedAt: extractDateTime(getPowerTransactionById.updatedAt, "both"),
    powerDetails: getPowerTransactionById.powerDetails.map(detail => ({
      ...detail,
      createdAt: extractDateTime(detail.createdAt, "both"),
      updatedAt: extractDateTime(detail.updatedAt, "both"),
    })),
  };
};

export const createPowerTransaction = async (
  data: {
    transactionDate: Date;
    powerDetails: {
      equipmentId: string;
      units: number;
    }[];
  },
	user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma,
) => {
  await tx.powerTransaction.create({
    data: {
      transactionDate: parseDateOnly(data.transactionDate),
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
      isActive: true
    },
    data: { isActive: false, updatedById:user },
  });

  // Optionally, check if the parent transaction should also be soft deleted
  const remainingDetails = await tx.power.count({
    where: { transactionId, isActive: true },
  });

  if (remainingDetails === 0) {
    await tx.powerTransaction.update({
      where: { id: transactionId },
      data: { isActive: false, updatedById:user },
    });
  }
};
