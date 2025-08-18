import { Request, Response } from "express";
import {
  getAllMaterialTypeMasterUsecase,
  getIdMaterialTypeMasterUsecase,
  createMaterialTypeMasterUsecase,
  updateMaterialTypeMasterUsecase,
  deleteMaterialTypeMasterUsecase,
} from "../usecases/materialTypeMaster.usecase";

export const getAllMaterialTypeMaster = async (req: Request, res: Response) => {
  const { pageNumber, pageSize } = req.query as { pageNumber?: string; pageSize?: string };
  const result = await getAllMaterialTypeMasterUsecase(pageNumber, pageSize);
  res.json(result);
};

export const getMaterialTypeMasterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getIdMaterialTypeMasterUsecase(id);
  res.json(result);
};

export const createMaterialTypeMaster = async (req: Request, res: Response) => {
  const user = req.user?.id || "system"; // Assuming you attach user in auth middleware
  const result = await createMaterialTypeMasterUsecase(req.body, user);
  res.status(201).json(result);
};

export const updateMaterialTypeMaster = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user?.id || "system";
  const result = await updateMaterialTypeMasterUsecase(id, req.body, user);
  res.json(result);
};

export const deleteMaterialTypeMaster = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user?.id || "system";
  const result = await deleteMaterialTypeMasterUsecase(id, user);
  res.json(result);
};
