// src/modules/subEquipment/services/subEquipment.service.ts
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";

const formatDate = (date?: Date | null) =>
  date ? date.toISOString().replace("T", " ").substring(0, 19) : null;

export const getAllSubEquipments = async (
  pageNumber?: string,
  pageSize?: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  const totalRecords = await tx.subEquipment.count({
    where: { isActive: true },
  });

  const records = await tx.subEquipment.findMany({
    skip,
    take,
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { equipment: true }, // include parent equipment info
  });

  return {
    totalRecords,
    data: records.map((item) => ({
      id: item.id,
      code: item.code,
      subEquipmentNo: item.subEquipmentNo,
      subEquipmentDescription: item.subEquipmentDescription,
      equipmentSubGroupId: item.equipmentSubGroupId,
      eq_id: item.eq_id,
      equipmentId: item.equipment?.id || null,
      createdAt: formatDate(item.createdAt),
      updatedAt: formatDate(item.updatedAt),
      createdById: item.createdById,
      updatedById: item.updatedById,
      isActive: item.isActive,
    })),
  };
};

export const getSubEquipmentById = async (
  id: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const item = await tx.subEquipment.findUnique({
    where: { id },
    include: { equipment: true },
  });
  if (!item) throw new Error("SubEquipment not found.");
  return { totalRecords: 1, data: item };
};

export const createSubEquipment = async (
  data: {
    subEquipmentNo: string;
    subEquipmentDescription: string;
    equipmentSubGroupId: string;
    equipmentId?: string; // optional: caller can pass it
  },
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  if (!data.subEquipmentNo) throw new Error("subEquipmentNo is required.");
  if (!data.subEquipmentDescription) throw new Error("subEquipmentDescription is required.");
  if (!data.equipmentSubGroupId) throw new Error("equipmentSubGroupId is required.");

  let equipmentId = data.equipmentId;

  // If caller didn’t provide equipmentId, auto-pick latest equipment
  if (!equipmentId) {
    const equipment = await tx.equipment.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!equipment) {
      throw new Error("No Equipment found to link with SubEquipment.");
    }
    equipmentId = equipment.id;
  }

  // Use Prisma relation connect
  const subeq = await tx.subEquipment.create({
    data: {
      subEquipmentNo: data.subEquipmentNo,
      subEquipmentDescription: data.subEquipmentDescription,
      equipmentSubGroupId: data.equipmentSubGroupId,
      equipment: { connect: { id: equipmentId } },
      createdById: user,
    },
    include: { equipment: true },
  });

  return subeq;
};

export const updateSubEquipment = async (
  id: string,
  data: Partial<{
    subEquipmentNo: string;
    subEquipmentDescription: string;
    equipmentSubGroupId: string;
    equipmentId: string; // allow updating equipment relation
  }>,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  return tx.subEquipment.update({
    where: { id },
    data: {
      subEquipmentNo: data.subEquipmentNo,
      subEquipmentDescription: data.subEquipmentDescription,
      equipmentSubGroupId: data.equipmentSubGroupId,
      ...(data.equipmentId
        ? { equipment: { connect: { id: data.equipmentId } } }
        : {}),
      updatedById: user,
    },
    include: { equipment: true },
  });
};

export const deleteSubEquipment = async (
  id: string,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  await tx.subEquipment.update({
    where: { id },
    data: {
      isActive: false,
      updatedById: user,
    },
  });
};
