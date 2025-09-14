import * as usecase from "../usecases/strength.usecase";
import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

// ✅ Create
export const createStrength = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id || "system"; // fallback if auth middleware not set
		const result = await usecase.createStrengthUsecase(req.body, user);
		res.status(201).send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

export const getStrengthSchedule = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionDate, materialId } = req.query;
		const accessToken = req.headers.authorization;

		if (!transactionDate || !materialId) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "transactionDate and materialId are required",
			});
		}

		const result = await usecase.getStrengthScheduleUsecase(
			accessToken as string,
			transactionDate as string,
			materialId as string
		);

		res.json(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

// ✅ Get all
export const getAllStrength = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const accessToken = req.headers.authorization;
		const result = await usecase.getAllStrengthUsecase(
			accessToken as string,
			pageNumber as string | undefined,
			pageSize as string | undefined
		);
		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

export const getStrengthById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const accessToken = req.headers.authorization;
		if (!id) {
			return res.status(400).json({
				code: "bad_request",
				statusCode: 400,
				success: false,
				message: "ID parameter is required",
			});
		}

		const result = await usecase.getStrengthByIdUsecase(id, accessToken || "");

		if (!result) {
			return res.status(404).json({
				code: "not_found",
				statusCode: 404,
				success: false,
				message: `Strength with ID ${id} not found`,
			});
		}

		return res.json(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

// ✅ Update
export const updateStrength = async (
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

		const result = await usecase.updateStrengthUsecase(id, req.body, user);
		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

// ✅ Delete (soft delete with updatedById)
export const deleteStrength = async (
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

		await usecase.deleteStrengthUsecase(id, user);

		const response = responses.generate("success", {
			message: "Strength deleted successfully!",
			data: null,
		});
		res.status(response.statusCode).send(response);
	} catch (err) {
		next(err);
	}
};
