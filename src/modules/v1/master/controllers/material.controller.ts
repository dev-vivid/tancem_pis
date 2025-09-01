import { Response } from "express";
import { Request } from "express";
import { NextFunction } from "express";
import { createMaterialUsecase, deleteMaterialUsecase,  getAllMaterialUsecase,  getIdMaterialUsecase, updateMaterialUsecase } from "../usecases/material.usecase";
import responses from "@utils/responses";
import { Status } from "@prisma/client";
import prisma from "@shared/prisma";

export const getAllMaterial = async (req: Request, res: Response) => {
  const { status, pageNumber, pageSize } = req.query as {
    status?: string;
    pageNumber?: string;
    pageSize?: string;
  };

  const parsedStatus = status as Status | undefined;

  const result = await getAllMaterialUsecase(parsedStatus!, pageNumber, pageSize);
  res.json(result);
};



export const getMaterialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await getIdMaterialUsecase(id);
    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};




export const createMaterial = async (req: Request, res: Response, next: NextFunction) => {
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

    const materialData = req.body;
    const result = await  createMaterialUsecase(materialData, user);

    const response = responses.generate("success", { data: result });
    response.message = "Material Mapping has been created";
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};




export const updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
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

    const result = await updateMaterialUsecase(id, updateData, user);
    const response = responses.generate("success", {
      message: "Material Mapping has been updated",
      data: result,
    });
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};


export const deleteMaterial = async (req: Request, res: Response, next: NextFunction) => {
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

    const result = await deleteMaterialUsecase(id, user);
    const response = responses.generate("success", {
      message: "Material Mapping has been deleted",
      data: result,
    });
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};







