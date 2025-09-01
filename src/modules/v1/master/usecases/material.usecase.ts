import { Status, YesNo } from "@prisma/client";
import { createMaterial, deleteMaterial, getAllMaterial, getMaterialId, updateMaterial } from "../services/material.service";
import Joi from "joi";



// Get all material  use case
export const getAllMaterialUsecase = async (
  status: Status,
  pageNumber?: string,
  pageSize?: string
) => {
  return await getAllMaterial(status, pageNumber, pageSize);
};



// Get material  by ID use case
export const getIdMaterialUsecase = async (id: string) => {
  return await getMaterialId(id);
};



//create  Type
type TMaterialCreateData = {
  materialTypeId: string;
  materialDescription: string;
  strength: YesNo;
  analysis: YesNo;
  quality: YesNo;
  glCode: string;
  orderOfAppearance: string;
//  isActive?: boolean;   // optional, defaults to true
//  status?: Status;      // optional, defaults to active
};



 type   TMaterialUpdateData = {
  materialTypeId?: string;
  materialDescription?: string;
  strength?: YesNo;
  analysis?: YesNo;
  quality?: YesNo;
  glCode?: string;
  orderOfAppearance?: string;
  isActive?: boolean;
  status?: Status;
};



// Create material mapping use case
export const createMaterialUsecase = async (
  materialData:  TMaterialCreateData ,
  user: string
) => {
  return await createMaterial (materialData,user);
};



// Update material mapping use case
export const updateMaterialUsecase = async (
  id: string,
  updateMaterialData: TMaterialUpdateData,
  user: string
) => {
  return await updateMaterial(
    id,
    updateMaterialData,
    user
  );
};


// Delete (soft delete) material mapping use case
export const deleteMaterialUsecase = async (
  id: string,
  user: string
) => {
  return await deleteMaterial(id, user);
};


