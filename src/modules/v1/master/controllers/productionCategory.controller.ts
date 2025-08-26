import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
  getAllProductionCategoryUsecase,
  getIdProductionCategoryUsecase,
  createProductionCategoryUsecase,
  updateProductionCategoryUsecase,
  deleteProductionCategoryUsecase
} from "../usecases/productionCategory.usecases";
import { Status } from "@prisma/client";

export const getAllProductionCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status , pageNumber, pageSize } = req.query;
    const result = await getAllProductionCategoryUsecase(status as Status, pageNumber as string, pageSize as string);
    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const getIdProductionCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await getIdProductionCategoryUsecase(id);
    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const createProductionCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated" });
    }
    const data = req.body;
    await createProductionCategoryUsecase(data, user);
    const response = responses.generate("success", { message: "Production Category created successfully!", data: null });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const updateProductionCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
				code: "unauthorized",
				 statusCode: 401, success:
				 false, message: "User is not authenticated"
				});
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
				 code: "bad_request",
				 statusCode: 400, success: false,
				  message: "ID parameter is required"
				 });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
				code: "bad_request",
				statusCode: 400, success: false,
				message: "Request body cannot be empty" });
    }

    await updateProductionCategoryUsecase(id, req.body, user);
    const response = responses.generate("success",
			{
				 message: "Production Category updated successfully!", data: null
				 });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const deleteProductionCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
				 code: "unauthorized",
				 statusCode: 401, success: false,
				 message: "User is not authenticated" });
    }
    const { id } = req.params;
    await deleteProductionCategoryUsecase(id, user);
    const response = responses.generate("success", {
			message: "Production Category deleted successfully!", data: null
		 });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};
