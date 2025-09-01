import { Status, YesNo } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "@shared/prisma";
import { pageConfig } from "@shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";




type TMaterial={
   
  materialTypeId:string,
  materialDescription:string
  strength?:YesNo
  analysis?: YesNo
  quality?: YesNo
  glCode: string
  orderOfAppearance: string
  // status: Status;
  isActive?: boolean;
}


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

  const totalRecords = await tx.material.count({ where: whereClause });

  const data = await tx.material.findMany({
    skip,
    take,
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      materialTypeId: true,
      materialDescription: true,
      strength: true,
      analysis: true,
      quality: true,
      glCode: true,
      orderOfAppearance: true,
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
export const getMaterialId = async (
  id: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const mapping = await tx.material.findUnique({
    where: { id },
    select: {
      id: true,
   materialTypeId:true,
  materialDescription:true,
  strength:true,
  analysis: true,
  quality: true,
  glCode: true,
  orderOfAppearance: true,
     status: true,
      isActive: true,
      createdAt: true,
      createdById: true,
      updatedAt: true,
      updatedById: true,
    },
  });

  if (!mapping) throw new Error("Material mapping not found");

  const { materialTypeId,materialDescription,strength,analysis,quality,glCode,orderOfAppearance,status,isActive, createdAt, updatedAt, ...rest } = mapping;

  const data = {
    ...rest,
  materialTypeId,
  materialDescription,
  strength,analysis,
  quality,
  glCode,
  orderOfAppearance,
  status,isActive,
    createdAt: extractDateTime(createdAt, "both"),
    updatedAt: extractDateTime(updatedAt, "both"),
  };

  return { data };
};






// Create material mapping
export const createMaterial = async (
  materialData: TMaterial,
  user: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  const { materialTypeId,materialDescription,strength,analysis,quality,glCode,orderOfAppearance} = materialData;

  if (!materialTypeId) throw new Error("materialTypeId is required");
  if (!materialDescription) throw new Error("materialDescription is required");
  if (!strength) throw new Error("strength is required");
    if (!analysis) throw new Error("analysis is required");
      if (!quality) throw new Error("quality is required");
        if (!glCode) throw new Error("glCode is required");
          if (!orderOfAppearance) throw new Error("orderOfAppearance is required");

  return await tx.material.create({
    data: {
      materialTypeId: materialData.materialTypeId,
      materialDescription: materialData.materialDescription,
       strength: strength ?? "NO",  
  analysis: analysis ?? "NO",  
  quality: quality ?? "NO",    
      glCode: materialData.glCode,
      orderOfAppearance: materialData.orderOfAppearance,
    //  status: materialData.status ?? Status.active,
      isActive: materialData.isActive ?? true,
      createdById: user,
    },
  });
};



export const updateMaterial = async (
  id: string,
  updateData: Partial<TMaterial>,
  userId: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {

  if (!id) throw new Error("ID is required for updating material mapping");
  return await tx.material.update({
    where: { id },
    data: {
      ...updateData,
      updatedById: userId,
    },
  });
};

//  Delete material (soft delete = isActive false)
export const deleteMaterial = async (
  id: string,
  userId: string,
  tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
  return await tx.material.update({
    where: { id },
    data: {
      isActive: false,
      updatedById: userId,
    },
  });
}
