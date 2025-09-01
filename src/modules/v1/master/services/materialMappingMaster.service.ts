// src/modules/v1/master/services/materialMapping.service.ts

import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";

type TMaterialMappingData = {
  materialMasterId: string;
  sourceId: string;
  status?: Status;
  isActive?: boolean;
};

// Get all material mappings with optional status filter
export const getAllMaterial = async (
  status?: Status,
  pageNumber?: string,
  pageSize?: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { skip, take } = pageConfig({ pageNumber, pageSize });

  const whereClause: any = { isActive: true };
  if (status) whereClause.status = status;

  const totalRecords = await tx.materialMappingMaster.count({ where: whereClause });

  const data = await tx.materialMappingMaster.findMany({
    skip,
    take,
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      materialMasterId:true,
      sourceId:true,
      isActive: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      updatedById: true,
    },
  });

  return data.map((item) => ({
    ...item,
    totalRecords,
    createdAt: extractDateTime(item.createdAt, "both"),
    updatedAt: extractDateTime(item.updatedAt, "both"),
  }));
};









// Get material mapping by ID
export const getMaterialMappingById = async (
  id: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const mapping = await tx.materialMappingMaster.findUnique({
    where: { id },
    select: {
      id: true,
      materialMasterId: true,
      sourceId: true,
      status: true,
      isActive: true,
      createdAt: true,
      createdById: true,
      updatedAt: true,
      updatedById: true,
    },
  });

  if (!mapping) throw new Error("Material mapping not found");

  const { materialMasterId, sourceId, createdAt, updatedAt, ...rest } = mapping;

  const data = {
    ...rest,
    materialMasterId: materialMasterId,
    sourceId,
    createdAt: extractDateTime(createdAt, "both"),
    updatedAt: extractDateTime(updatedAt, "both"),
  };

  return { data };
};

// Create material mapping
export const createMaterialMapping = async (
  mappingData: TMaterialMappingData,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { materialMasterId, sourceId } = mappingData;

  if (!materialMasterId) throw new Error("materialId is required");
  if (!sourceId) throw new Error("sourceId is required");

  return await tx.materialMappingMaster.create({
    data: {
      materialMasterId: materialMasterId,
      sourceId,
      createdById: user,
    },
  });
};

// Update material mapping
export const updateMaterialMapping = async (
  id: string,
  mappingData: Partial<TMaterialMappingData>,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  if (!id) throw new Error("ID is required for updating material mapping");

  return await tx.materialMappingMaster.update({
    where: { id },
    data: {
      ...mappingData,
      updatedById: user,
    },
  });
};

// Soft delete material mapping
export const deleteMaterialMapping = async (
  id: string,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  if (!id) throw new Error("ID is required for deleting material mapping");

  return await tx.materialMappingMaster.update({
    where: { id },
    data: {
      isActive: false,
      updatedById: user,
    },
  });
};
