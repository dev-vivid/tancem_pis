// src/modules/v1/master/controllers/materialMappingMaster.controller.ts

import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import { 


  createMaterialMappingUsecase,
  updateMaterialMappingUsecase,
  deleteMaterialMappingUsecase,
  getIdMaterialMappingUsecase,
  getAllMaterialMapUsecase
} from "../usecases/materialMappingMaster.usecase";
import { Status } from "@prisma/client";




// Get all Material Mappings
export const getAllMaterialMappings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pageNumber, pageSize, status } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access token provided" });
    }

    const accessToken = authHeader.split(" ")[1];

    const result = await getAllMaterialMapUsecase(
      accessToken,
      status as string,
      pageNumber as string | undefined,
      pageSize as string | undefined
    );

    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

// Get Material Mapping by ID
export const getMaterialMappingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access token provided" });
    }

    const accessToken = authHeader.split(" ")[1];

    const result = await getIdMaterialMappingUsecase(
      id,
      accessToken
    );

    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const createMaterialMapping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
        code: "unauthorized",
        statusCode: 401,
        success: false,
        message: "User is not authenticated",
      });
    }

    const mappingData = req.body;
    const result = await createMaterialMappingUsecase(mappingData, user);

    const response = responses.generate("success", { data: result });
    response.message = "Material Mapping has been created";
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const updateMaterialMapping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
        code: "unauthorized",
        statusCode: 401,
        success: false,
        message: "User is not authenticated",
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const result = await updateMaterialMappingUsecase(id, updateData, user);
    const response = responses.generate("success", {
      message: "Material Mapping has been updated",
      data: result,
    });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterialMapping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
        code: "unauthorized",
        statusCode: 401,
        success: false,
        message: "User is not authenticated",
      });
    }

    const result = await deleteMaterialMappingUsecase(id, user);
    const response = responses.generate("success", {
      message: "Material Mapping has been deleted",
      data: result,
    });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};
