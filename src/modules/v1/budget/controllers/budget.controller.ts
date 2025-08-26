import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
	getAllBudgetsUsecase,
	getBudgetByIdUsecase,
	createBudgetUsecase,
	updateBudgetUsecase,
	deleteBudgetUsecase,
} from "../usecases/budget.usecase";

export const getAllBudgetsController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const result = await getAllBudgetsUsecase(
			pageNumber as string | undefined,
			pageSize as string | undefined
		);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getBudgetByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const result = await getBudgetByIdUsecase(id);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createBudgetController = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await createBudgetUsecase(req.body, user);
		let response = responses.generate("success", { data: result });
		response.message = "Budget record has been created";
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateBudgetController = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await updateBudgetUsecase(id, req.body, user);
		const response = responses.generate("success", {
			message: "Budget record has been updated",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteBudgetController = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await deleteBudgetUsecase(id, user);
		const response = responses.generate("success", {
			message: "Budget record has been deleted",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
