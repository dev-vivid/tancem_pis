import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import { getAllProblemCodeUsecase } from "../usecases/problemCode.usecase";
import { getIdProblemCodeUsecase } from "../usecases/problemCode.usecase";
import { createProblemCodeUsecase } from "../usecases/problemCode.usecase";
import { updateProblemCodeUsecase } from "../usecases/problemCode.usecase";
import { deleteProblemCodeUsecase } from "../usecases/problemCode.usecase";

export const getAllproblemCode = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize, status } = req.query;
		const result = await getAllProblemCodeUsecase(
			pageNumber as string | undefined,
			pageSize as string | undefined,
			status as string | undefined
		);
		const response = responses.generate("success", {
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getIdproblemCode = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { pageNumber, pageSize } = req.query;
		const result = await getIdProblemCodeUsecase(id);
		const response = responses.generate("success", {
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createproblemCode = async (
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
		const problemCodeData = req.body;
		await createProblemCodeUsecase(problemCodeData, user);

		const response = responses.generate("success", {
			message: "Status updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateproblemCode = async (
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
		const problemCodeData = req.body;
		await updateProblemCodeUsecase(id, problemCodeData, user);

		const response = responses.generate("success", {
			message: "problemCode updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteproblemCode = async (
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
		// Assuming deleteAnalysisUsecase is implemented
		await deleteProblemCodeUsecase(id, user);
		const response = responses.generate("success", {
			message: "Analysis deleted successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
