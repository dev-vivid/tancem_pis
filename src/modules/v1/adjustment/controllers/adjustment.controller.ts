// src/modules/v1/master/controllers/adjustment.controller.ts

import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import * as adjustmentUsecase from "../usecases/adjustment.usecase";

export const getAllAdjustments = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];
		const result = await adjustmentUsecase.getAllAdjustmentsUsecase(
			accessToken,
			pageNumber as string | undefined,
			pageSize as string | undefined
		);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getAdjustmentById = async (
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

		const result = await adjustmentUsecase.getAdjustmentByIdUsecase(
			id,
			accessToken
		);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createAdjustment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId: string = req.user?.id;
		if (!userId) {
			return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
		}

		const adjustmentData = req.body;
		await adjustmentUsecase.createAdjustmentUsecase(adjustmentData, userId);
		const response = responses.generate("success", {
			message: "Adjustment created successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateAdjustment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId: string = req.user?.id;
		if (!userId) {
			return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
		}

		const { id } = req.params;
		const payload = req.body;
		const result = await adjustmentUsecase.updateAdjustmentUsecase(
			id,
			payload,
			userId
		);
		const response = responses.generate("success", {
			message: "Adjustment updated successfully!",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteAdjustment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId: string = req.user?.id;
		if (!userId) {
			return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
		}

		const { id } = req.params;
		const result = await adjustmentUsecase.deleteAdjustmentUsecase(id, userId);
		const response = responses.generate("success", {
			message: "Adjustment deleted successfully!",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
