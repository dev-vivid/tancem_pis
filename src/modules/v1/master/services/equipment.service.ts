import prisma from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

export const getAllEquipment = async (
  pageNumber?: string,
  pageSize?: string
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  const data = await prisma.equipment.findMany({
    skip,
    take,
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
      createdAt: true,
      updatedAt: true,
      createdById: true,
      updatedById: true,
    },
  });

  return data;
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
