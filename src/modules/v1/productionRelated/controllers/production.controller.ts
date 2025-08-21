import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import { getAllproductionUsecase } from "../usecases/production.usecase";
import { getIdproductionUsecase } from "../usecases/production.usecase";
import { createproductionUsecase } from "../usecases/production.usecase";
import { updateproductionUsecase } from "../usecases/production.usecase";
import { deleteproductionUsecase } from "../usecases/production.usecase";

export const getAllproduction = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const result = await getAllproductionUsecase(
			pageNumber as string | undefined,
			pageSize as string | undefined
		);
		const response = responses.generate("success", {
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getIdproduction = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { pageNumber, pageSize } = req.query;
		const result = await getIdproductionUsecase(id);
		const response = responses.generate("success", {
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createproduction = async (
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
		const productionData = req.body;
		await createproductionUsecase(productionData, user);

		const response = responses.generate("success", {
			message: "Status updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateproduction = async (
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
		if (!id) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "ID parameter is required",
			});
		}
		if (!req.body) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "Request body is required",
			});
		}
		if (Object.keys(req.body).length === 0) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "Request body cannot be empty",
			});
		}
		const productionData = req.body;
		await updateproductionUsecase(id, productionData, user);

		const response = responses.generate("success", {
			message: "production updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteproduction = async (
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
		if (!id) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "ID parameter is required",
			});
		}
		// Assuming deleteproductionUsecase is implemented
		await deleteproductionUsecase(id, user);
		const response = responses.generate("success", {
			message: "production deleted successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
