import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";

export const getAllMaterialTypeMaster = async (
  status: Status,
  pageNumber?: string,
  pageSize?: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  // ✅ build where clause dynamically
  const whereClause: any = {
    isActive: true,
  };
  if (status) {
    whereClause.status = status;
  }

  const totalRecords = await tx.equipment.count({
    where: whereClause,
  });

  const data = await prisma.materialTypeMaster.findMany({
    skip,
    take,
		where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      materialTypeCode: true,
      isActive: true,
			status:true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      updatedById: true,
    },
  });

  // Rename `name` to `materialType`
  return data.map(item => ({
    ...item,
		totalRecords,
    materialType: item.name,
		 createdAt:extractDateTime(item.createdAt, "both"),
		 updatedAt:extractDateTime(item.updatedAt, "both"),
		 createdById: item.createdById,
		 updatedById: item.updatedById,
		 isActive: item.isActive,
		 status: item.status,
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
