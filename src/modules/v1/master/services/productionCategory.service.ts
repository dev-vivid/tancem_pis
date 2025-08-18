import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

const formatDate = (date?: Date | null) =>
  date ? date.toISOString().replace("T", " ").substring(0, 19) : null;

export const getAllProductionCategory = async (
  pageNumber?: string,
  pageSize?: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  const totalRecords = await tx.productionCategory.count({ where: { isActive: true } });

  const records = await tx.productionCategory.findMany({
    skip,
    take,
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    totalRecords,
    data: records.map(item => ({
      id: item.id,
      code: item.code,
      name: item.name,
      categoryCode: item.productCatagoryCode,
      createdAt: formatDate(item.createdAt),
      updatedAt: formatDate(item.updatedAt),
      createdById: item.createdById,
      updatedById: item.updatedById,
      isActive: item.isActive
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
  data: { name: string; productCatagoryCode: string },
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  if (!data.name) throw new Error("name is required.");
  if (!data.productCatagoryCode) throw new Error("productCatagoryCode is required.");
  await tx.productionCategory.create({
    data: { ...data, createdById: user, isActive: true },
  });
};

export const updateProductionCategory = async (
  id: string,
  data: { name?: string; productCatagoryCode?: string },
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  await tx.productionCategory.update({
    where: { id },
    data: { ...data, updatedById: user },
  });
};

export const deleteProductionCategory = async (
  id: string,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  await tx.productionCategory.update({
    where: { id },
    data: { isActive: false, updatedById: user },
  });
};
