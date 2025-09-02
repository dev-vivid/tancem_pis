import { Status ,YesNo} from "@prisma/client";
import { getEquipmentName } from "common/api";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";

// ✅ Yes/No enum for dropdowns
// export enum YesNo {
//   Yes = "Yes",
//   No = "No",
// }

// ✅ helper for validating string values
// const validateYesNo = (value: string | undefined, field: string) => {
//   if (value && !Object.values(YesNo).includes(value as YesNo)) {
//     throw new Error(`Invalid value for ${field}. Allowed: Yes / No`);
//   }
// };

export const getAllEquipment = async (
	accessToken: string,
  pageNumber?: string,
  pageSize?: string,
  status?: string,
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
      analysis: true,
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


		const result = await Promise.all(
			data.map(async (item) => {
				const equipmentName =
					item.equipmentId && accessToken
						? await getEquipmentName(item.equipmentId, accessToken)
						: null;

				return {
					...item,
					equipmentName: equipmentName?.name||null,
					createdAt: extractDateTime(item.createdAt, "both"),
					updatedAt: extractDateTime(item.updatedAt, "both"),
				};
			})
		);

		return { totalRecords, result };
	};


export const getEquipmentById = async (id: string) => {
  return await prisma.equipment.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      equipmentId: true,
      equipmentDescription: true,
      analysis: true,
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
  analysis: string;
  strength: string;
  quality: string;
  power: string;
  storage: string;
  powerGroup: string;
  orderOfAppearance: string;
  isActive?: boolean;
  status?: Status;
};

export const createEquipment = async (data: TEquipmentData, user: string) => {
  // ✅ validate enum-like fields
  // validateYesNo(data.analysis, "analysis");
  // validateYesNo(data.strength, "strength");
  // validateYesNo(data.quality, "quality");
  // validateYesNo(data.power, "power");
  // validateYesNo(data.storage, "storage");

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
  // ✅ validate enum-like fields
  // validateYesNo(data.analysis, "analysis");
  // validateYesNo(data.strength, "strength");
  // validateYesNo(data.quality, "quality");
  // validateYesNo(data.power, "power");
  // validateYesNo(data.storage, "storage");

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
