import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
  getAllEquipmentUsecase,
  getEquipmentByIdUsecase,
  createEquipmentUsecase,
  updateEquipmentUsecase,
  deleteEquipmentUsecase
} from "../usecases/equipment.usecase";

export const getAllEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageNumber, pageSize } = req.query;
    const result = await getAllEquipmentUsecase(pageNumber as string, pageSize as string);
    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const getEquipmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await getEquipmentByIdUsecase(id);
    const response = responses.generate("success", { data: result });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
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
    await createEquipmentUsecase(req.body, user);
    const response = responses.generate("success",
			 {
				message: "Equipment created successfully!"
		});
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated" });
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
    await updateEquipmentUsecase(id, req.body, user);
    const response = responses.generate("success",
			 {
				 message: "Equipment updated successfully!",
			  });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};

export const deleteEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated" });
    }
    const { id } = req.params;
    await deleteEquipmentUsecase(id, user);
    const response = responses.generate("success",
			 {
			message: "Equipment deleted successfully!",
		 });
    res.status(response.statusCode).send(response);
  } catch (error) {
    next(error);
  }
};
