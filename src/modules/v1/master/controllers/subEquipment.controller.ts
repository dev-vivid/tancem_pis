// src/modules/subEquipment/controllers/subEquipment.controller.ts
import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
	getAllSubEquipmentUsecase,
	getIdSubEquipmentUsecase,
	createSubEquipmentUsecase,
	updateSubEquipmentUsecase,
	deleteSubEquipmentUsecase,
} from "../usecases/subEquipment.usecase";
import { Status } from "@prisma/client";

// ✅ Get all SubEquipments
export const getAllSubEquipmentController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { status, pageNumber, pageSize } = req.query;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];

		const result = await getAllSubEquipmentUsecase(
			accessToken,
			status as Status,
			pageNumber ? String(pageNumber) : undefined,
			pageSize ? String(pageSize) : undefined
		);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

// ✅ Get SubEquipment by ID
export const getIdSubEquipmentController = async (
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

		const result = await getIdSubEquipmentUsecase(id, accessToken);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

// ✅ Create SubEquipment
export const createSubEquipmentController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
		const result = await createSubEquipmentUsecase(req.body, user);
		let response = responses.generate("success", { data: result });
		response.message = "SubEquipment record has been created";
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

// ✅ Update SubEquipment
export const updateSubEquipmentController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
		const result = await updateSubEquipmentUsecase(id, req.body, user);
		const response = responses.generate("success", {
			message: "SubEquipment record has been updated",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

// ✅ Delete SubEquipment (soft delete)
export const deleteSubEquipmentController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
		const result = await deleteSubEquipmentUsecase(id, user);
		const response = responses.generate("success", {
			message: "SubEquipment record has been deleted",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
