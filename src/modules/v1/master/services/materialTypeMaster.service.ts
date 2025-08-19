import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

export const getAllMaterialTypeMaster = async (
  pageNumber?: string,
  pageSize?: string
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  const data = await prisma.materialTypeMaster.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      materialTypeCode: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      updatedById: true,
    },
  });

  // Rename `name` to `materialType`
  return data.map(item => ({
    ...item,
    materialType: item.name,
  }));
};

export const getIdMaterialTypeMaster = async (id: string) => {
  return await prisma.materialTypeMaster.findUnique({ where: { id } });
};

type TMaterialTypeMasterData = {
  name: string;
  materialTypeCode: string;
  isActive?: boolean;
};

export const createMaterialTypeMaster = async (
  data: TMaterialTypeMasterData,
  user: string
) => {
  return await prisma.materialTypeMaster.create({
    data: {
      ...data,
      createdById: user,
    },
  });
};

export const updateMaterialTypeMaster = async (
  id: string,
  data: TMaterialTypeMasterData,
  user: string
) => {
  return await prisma.materialTypeMaster.update({
    where: { id },
    data: {
      ...data,
      updatedById: user,
    },
  });
};

export const deleteMaterialTypeMaster = async (id: string, user: string) => {
  return await prisma.materialTypeMaster.update({
    where: { id },
    data: {
      isActive: false,
      updatedById: user,
    },
  });
};
