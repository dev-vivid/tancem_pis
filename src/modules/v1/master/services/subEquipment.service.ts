// src/modules/subEquipment/services/subEquipment.service.ts
import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";
import { getEquipmentSubGroupName } from "common/api";

// ✅ Get all subEquipments
export const getAllSubEquipments = async (
  accessToken: string,
  status?: Status,
  pageNumber?: string,
  pageSize?: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  const whereClause: any = {};
  if (status) whereClause.status = status;

  const totalRecords = await tx.subEquipment.count({
    where: whereClause,
  });

  const subEquipments = await tx.subEquipment.findMany({
    skip,
    take,
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { equipment: true },
  });

  const data = await Promise.all(
    subEquipments.map(async (item) => {
      const subGroup =
        item.equipmentSubGroupId && accessToken
          ? await getEquipmentSubGroupName(item.equipmentSubGroupId, accessToken)
          : null;

      return {
        id: item.id,
        code: item.code,
        subEquipmentNo: item.subEquipmentNo,
        subEquipmentDescription: item.subEquipmentDescription,
        equipmentSubGroupId: item.equipmentSubGroupId,
        equipmentSubGroupName: subGroup?.name || null,
        eq_id: item.eq_id,
        equipmentId: item.equipment?.id || null,
        createdAt: extractDateTime(item.createdAt, "both"),
        updatedAt: extractDateTime(item.updatedAt, "both"),
        createdById: item.createdById,
        updatedById: item.updatedById,
        isActive: item.isActive,
        status: item.status,
      };
    })
  );

  return { totalRecords, data };
};

// ✅ Get subEquipment by ID
export const getSubEquipmentById = async (
  id: string,
  accessToken: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const item = await tx.subEquipment.findUnique({
    where: { id },
  });
  if (!item) throw new Error("SubEquipment not found.");

  const subGroup =
    item.equipmentSubGroupId && accessToken
      ? await getEquipmentSubGroupName(item.equipmentSubGroupId, accessToken)
      : null;

  const data = {
    ...item,
    equipmentSubGroupName: subGroup?.name || null,
    createdAt: extractDateTime(item.createdAt, "both"),
    updatedAt: extractDateTime(item.updatedAt, "both"),
  };

  return { totalRecords: 1, data };
};

// ✅ Create subEquipment
export const createSubEquipment = async (
  data: {
    subEquipmentNo: string;
    subEquipmentDescription: string;
    equipmentSubGroupId: string;
    equipmentId?: string;
  },
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  if (!data.subEquipmentNo) throw new Error("subEquipmentNo is required.");
  if (!data.subEquipmentDescription) throw new Error("subEquipmentDescription is required.");
  if (!data.equipmentSubGroupId) throw new Error("equipmentSubGroupId is required.");

  let equipmentId = data.equipmentId;

  if (!equipmentId) {
    const equipment = await tx.equipment.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!equipment) {
      throw new Error("No Equipment found to link with SubEquipment.");
    }
    equipmentId = equipment.id;
  }

  return await tx.subEquipment.create({
    data: {
      subEquipmentNo: data.subEquipmentNo,
      subEquipmentDescription: data.subEquipmentDescription,
      equipmentSubGroupId: data.equipmentSubGroupId,
      equipment: { connect: { id: equipmentId } },
      createdById: user,
    },
    include: { equipment: true },
  });
};

// ✅ Update subEquipment
export const updateSubEquipment = async (
  id: string,
  data: Partial<{
    subEquipmentNo: string;
    subEquipmentDescription: string;
    equipmentSubGroupId: string;
    equipmentId: string;
    status: Status;
    isActive: boolean;
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
      ...(data.equipmentId ? { equipment: { connect: { id: data.equipmentId } } } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      updatedById: user,
    },
    include: { equipment: true },
  });
};

// ✅ Soft delete subEquipment
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
