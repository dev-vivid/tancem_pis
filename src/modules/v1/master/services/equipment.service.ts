import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";

export const getAllEquipment = async (
  status?: Status,
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

  const data = await tx.equipment.findMany({
    skip,
    take,
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      equipmentId: true,
      equipmentDescription: true,
      strength: true,
      quality: true,
      power: true,
      powerGroup: true,
      storage: true,
      orderOfAppearance: true,
      isActive: true,
      status:true,
      createdAt:true,
      updatedAt:true,
      createdById: true,
      updatedById: true,
    },
  });

 return data.map(item => ({
		...item,
		 totalRecords,
		 equipmentId: item.equipmentId,
		 equipmentDescription: item.equipmentDescription,
		strength: item.strength,
		quality: item.quality,
		power: item.power,
		powerGroup: item.powerGroup,
		storage: item.storage,
		orderOfAppearance: item.orderOfAppearance,
		isActive: item.isActive,
		status: item.status,
		createdAt: extractDateTime(item.createdAt, "both"),
		updatedAt: extractDateTime(item.updatedAt, "both"),
		createdById: item.createdById,
		updatedById: item.updatedById,
	}));
};

export const getEquipmentById = async (id: string) => {
  return await prisma.equipment.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      equipmentId: true,
      equipmentDescription: true,
      strength: true,
      quality: true,
      power: true,
      powerGroup: true,
      storage: true,
      orderOfAppearance: true,
      isActive: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      updatedById: true,
    },
  });
};

type TEquipmentData = {
  equipmentId: string;
  equipmentDescription: string;
  strength: string;
  quality: string;
  power: string;
  powerGroup: string;
  storage: string;
  orderOfAppearance: string;
  isActive?: boolean;
  status?: Status;
};

export const createEquipment = async (data: TEquipmentData, user: string) => {
  return await prisma.equipment.create({
    data: {
      ...data,
      createdById: user,
    },
  });
};

export const updateEquipment = async (
  id: string,
  data: TEquipmentData,
  user: string
) => {
  return await prisma.equipment.update({
    where: { id },
    data: {
      ...data,
      updatedById: user,
    },
  });
};

export const deleteEquipment = async (id: string, user: string) => {
  return await prisma.equipment.update({
    where: { id },
    data: {
      isActive: false,
      updatedById: user,
    },
  });
};
