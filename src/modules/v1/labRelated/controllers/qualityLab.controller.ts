import * as usecase from "../usecases/qualityLab.usecase";
import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

// ✅ Create
export const createQualityLab = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id || "system"; // fallback if auth middleware not set
		const result = await usecase.createQualityLabUsecase(req.body, user);
		res.status(201).send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

// ✅ Get all
export const getAllQualityLab = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const result = await usecase.getAllQualityLabUsecase(
			pageNumber as string | undefined,
			pageSize as string | undefined
		);
		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

// ✅ Get by ID
// export const getQualityLabById = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const { id } = req.params;
// 		if (!id) {
// 			return res.status(400).json({
// 				code: "bad_request",
// 				statusCode: 400,
// 				success: false,
// 				message: "ID parameter is required",
// 			});
// 		}
// 		const result = await usecase.getQualityLabByIdUsecase(id);
// 		res.send(responses.generate("success", { data: result }));
// 	} catch (err) {
// 		next(err);
// 	}
// };
export const getQualityLabById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "ID parameter is required",
			});
		}

		const result = await usecase.getQualityLabByIdUsecase(id);

		if (!result) {
			return res.status(404).json({
				code: "not_found",
				statusCode: 404,
				success: false,
				message: `QualityLab with ID ${id} not found`,
			});
		}

		return res.json(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

// ✅ Update
export const updateQualityLab = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id || "system";
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "ID parameter is required",
			});
		}
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "Request body cannot be empty",
			});
		}

		const result = await usecase.updateQualityLabUsecase(id, req.body, user);
		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

// ✅ Delete (soft delete with updatedById)
export const deleteQualityLab = async (
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

		await usecase.deleteQualityLabUsecase(id, user);

		const response = responses.generate("success", {
			message: "QualityLab deleted successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (err) {
		next(err);
	}
};
