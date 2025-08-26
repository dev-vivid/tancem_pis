import { Request, Response } from "express";
import {
  getAllMaterialTypeMasterUsecase,
  getIdMaterialTypeMasterUsecase,
  createMaterialTypeMasterUsecase,
  updateMaterialTypeMasterUsecase,
  deleteMaterialTypeMasterUsecase,
} from "../usecases/materialTypeMaster.usecase";
import { Status } from "@prisma/client";

export const getAllMaterialTypeMaster = async (req: Request, res: Response) => {
  const { status, pageNumber, pageSize } = req.query as {
    status?: string;
    pageNumber?: string;
    pageSize?: string;
  };

  // 👇 Convert string to Prisma Status (if provided)
  const parsedStatus = status as Status | undefined;

  const result = await getAllMaterialTypeMasterUsecase(
    parsedStatus!,
    pageNumber,
    pageSize
  );

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
