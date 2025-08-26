// src/modules/subEquipment/controllers/subEquipment.controller.ts
import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
  getAllSubEquipmentUsecase,
  getIdSubEquipmentUsecase,
  createSubEquipmentUsecase,
  updateSubEquipmentUsecase,
  deleteSubEquipmentUsecase
} from "../usecases/subEquipment.usecase";
import { Status } from "@prisma/client";

export const getAllSubEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {status, pageNumber, pageSize } = req.query;
    const result = await getAllSubEquipmentUsecase(status as Status ,pageNumber as string, pageSize as string);
    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const getIdSubEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await getIdSubEquipmentUsecase(id);
    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const createSubEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
        code: "unauthorized",
        statusCode: 401,
        success: false,
        message: "User is not authenticated"
      });
    }
    const data = req.body;
    await createSubEquipmentUsecase(data, user);
    const response = responses.generate("success",
			{
				message: "SubEquipment created successfully!"
			});
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const updateSubEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
        code: "unauthorized",
        statusCode: 401,
        success: false,
        message: "User is not authenticated"
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        code: "bad_request",
        statusCode: 400,
        success: false,
        message: "ID parameter is required"
      });

    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        code: "bad_request",
        statusCode: 400,
        success: false,
        message: "Request body cannot be empty"
      });
    }

    await updateSubEquipmentUsecase(id, req.body, user);
    const response = responses.generate("success",
			{
				message:"SubEquipment updated successfully!"
				});
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const deleteSubEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
        code: "unauthorized",
        statusCode: 401,
        success: false,
        message: "User is not authenticated"
      });
    }
    const { id } = req.params;
    await deleteSubEquipmentUsecase(id, user);
    const response = responses.generate("success",
			{
				message: "SubEquipment deleted successfully!"
			});
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};
