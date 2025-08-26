import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";


export const getAllProductionCategory = async (
  status: Status,
  pageNumber?: string,
  pageSize?: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  const totalRecords = await tx.productionCategory.count({
    where: {
      isActive: true,
      status, // ✅ now filtering by status
    },
  });

  const records = await tx.productionCategory.findMany({
    skip,
    take,
    where: {
      isActive: true,
      status, // ✅ added here as well
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    totalRecords,
    data: records.map(item => ({
      id: item.id,
      code: item.code,
      name: item.name,
      // categoryCode: item.productCatagoryCode,
      createdAt:extractDateTime(item.createdAt, "both"),
      updatedAt:extractDateTime(item.updatedAt, "both"),
      createdById: item.createdById,
      updatedById: item.updatedById,
      isActive: item.isActive,
      status: item.status,
    })),
  };
};

export const getIdProductionCategory = async (
  id: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const item = await tx.productionCategory.findUnique({ where: { id } });
  if (!item) throw new Error("Production Category not found.");
  return { totalRecords: 1, data: item };
};

export const createProductionCategory = async (
  data: {
    name: string;
    // categoryName?: string;
  },
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  if (!data.name) throw new Error("name is required.");
  // if (!data.categoryName) throw new Error("categoryName is required.");
  await tx.productionCategory.create({
    data: {
      name: data.name,
      // productCatagoryCode: data.categoryName?? null,
      createdById: user,
      isActive: true, // keep consistency with delete
    },
  });
};

export const updateProductionCategory = async (
  id: string,
  data: {
		name?: string;
		// categoryName?: string;
		status: Status
	},
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  await tx.productionCategory.update({
    where: { id },
    data: {
      ...data,
      // productCatagoryCode: data.categoryName?? undefined,
      updatedById: user,
    },
  });
};

export const deleteProductionCategory = async (
  id: string,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  await tx.productionCategory.update({
    where: { id },
    data: {
			isActive: false,
			updatedById: user
		},
  });
};
