import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import {
	getAllAnnualMaterialBudgetUsecase,
	getIdAnnualMaterialBudgetUsecase,
	createAnnualMaterialBudgetUsecase,
	updateAnnualMaterialBudgetUsecase,
	deleteAnnualMaterialBudgetUsecase
} from "../usecases/annualMaterialBudget.usecase";

export const getAllAnnualMaterialBudget = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { pageNumber, pageSize, status} = req.query;
		const result = await getAllAnnualMaterialBudgetUsecase(
			pageNumber as string | undefined,
			pageSize as string | undefined,
			status as string | undefined
		);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getIdAnnualMaterialBudget = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const result = await getIdAnnualMaterialBudgetUsecase(id);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createAnnualMaterialBudget = async (req: Request, res: Response, next: NextFunction) => {
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
		const budgetData = req.body;
		const result = await createAnnualMaterialBudgetUsecase(budgetData, user);

		let response = responses.generate("success", { data: result });
		response.message = "Annual Material Budget has been created";
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateAnnualMaterialBudget = async (req: Request, res: Response, next: NextFunction) => {
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
		const updateData = req.body;

		const result = await updateAnnualMaterialBudgetUsecase(id, updateData, user);

		const response = responses.generate("success", {
			message: "Annual Material Budget has been updated",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteAnnualMaterialBudget = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await deleteAnnualMaterialBudgetUsecase(id, user);

		const response = responses.generate("success", {
			message: "Annual Material Budget has been deleted",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
