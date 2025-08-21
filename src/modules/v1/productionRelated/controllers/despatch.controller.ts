import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import { getAlldespatchUsecase } from "../usecases/despatch.usecase";
import { getIddespatchUsecase } from "../usecases/despatch.usecase";
import { createdespatchUsecase } from "../usecases/despatch.usecase";
import { updatedespatchUsecase } from "../usecases/despatch.usecase";
import { deletedespatchUsecase } from "../usecases/despatch.usecase";

export const getAlldespatch = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const result = await getAlldespatchUsecase(
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

export const getIddespatch = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { pageNumber, pageSize } = req.query;
		const result = await getIddespatchUsecase(id);
		const response = responses.generate("success", {
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createdespatch = async (
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
		const despatchData = req.body;
		await createdespatchUsecase(despatchData, user);

		const response = responses.generate("success", {
			message: "Status updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updatedespatch = async (
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
		const despatchData = req.body;
		await updatedespatchUsecase(id, despatchData, user);

		const response = responses.generate("success", {
			message: "despatch updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deletedespatch = async (
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
		// Assuming deletedespatchUsecase is implemented
		await deletedespatchUsecase(id, user);
		const response = responses.generate("success", {
			message: "despatch deleted successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
