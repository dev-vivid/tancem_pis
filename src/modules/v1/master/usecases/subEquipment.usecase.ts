// src/modules/subEquipment/usecases/subEquipment.usecases.ts
import { Status } from "@prisma/client";
import {
  getAllSubEquipments as getAllService,
  getSubEquipmentById as getByIdService,
  createSubEquipment as createService,
  updateSubEquipment as updateService,
  deleteSubEquipment as deleteService
} from "../services/subEquipment.service";

export const getAllSubEquipmentUsecase = (status:Status ,pageNumber?: string, pageSize?: string) =>
  getAllService(status,pageNumber, pageSize);

export const getIdSubEquipmentUsecase = (id: string) =>
  getByIdService(id);

export const createSubEquipmentUsecase = (
  data: {
    subEquipmentNo: string;
    subEquipmentDescription: string;
    equipmentSubGroupId: string;
    eq_id: string;
  },
  user: string
) => createService(data, user);

export const updateSubEquipmentUsecase = (
  id: string,
  data: Partial<{
    subEquipmentNo: string;
    subEquipmentDescription: string;
    equipmentSubGroupId: string;
    eq_id: string;
		status:Status
  }>,
  user: string
) => updateService(id, data, user);

export const deleteSubEquipmentUsecase = (id: string, user: string) =>
  deleteService(id, user);
