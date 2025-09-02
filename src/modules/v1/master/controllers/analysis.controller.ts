import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import { getAllanalysisUsecase } from "../usecases/analysis.usecase";
import { getIdanalysisUsecase } from "../usecases/analysis.usecase";
import { createAnalysisUsecase } from "../usecases/analysis.usecase";
import { updateAnalysisUsecase } from "../usecases/analysis.usecase";
import { deleteAnalysisUsecase } from "../usecases/analysis.usecase";

export const getAllanalysis = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize, status, materialId } = req.query;
		const accessToken = req.headers.authorization;
		const result = await getAllanalysisUsecase(
			accessToken as string,
			materialId as string,
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

export const getIdanalysis = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const accessToken = req.headers.authorization;
		// const { pageNumber, pageSize } = req.query;
		if (!id) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "ID parameter is required",
			});
		}
		const result = await getIdanalysisUsecase(id, accessToken || "");
		const response = responses.generate("success", {
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createAnalysis = async (
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
		const analysisData = req.body;
		await createAnalysisUsecase(analysisData, user);

		const response = responses.generate("success", {
			message: "Status updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateAnalysis = async (
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
		const analysisData = req.body;
		await updateAnalysisUsecase(id, analysisData, user);

		const response = responses.generate("success", {
			message: "Analysis updated successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteAnalysis = async (
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
		await deleteAnalysisUsecase(id, user);
		const response = responses.generate("success", {
			message: "Analysis deleted successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

// export const getMaterialAnalysis = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const { materialId } = req.query;
// 		// const accessToken = req.headers.authorization;
// 		const result = await getMaterialAnalysisUsecase(
// 			materialId as string
// 			// pageNumber as string | undefined,
// 			// pageSize as string | undefined,
// 			// status as string | undefined
// 		);
// 		const response = responses.generate("success", {
// 			data: result,
// 		});
// 		res.status(response.statusCode).send(response);
// 	} catch (error) {
// 		next(error);
// 	}
// };
