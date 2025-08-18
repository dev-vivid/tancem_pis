import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
	getAllBagsUsecase,
	getIdBagsUsecase,
	createBagsUsecase,
	updateBagsUsecase,
	deleteBagsUsecase
} from "../usecases/bags.usecase";

export const getAllBagsController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const result = await getAllBagsUsecase(
			pageNumber as string | undefined,
			pageSize as string | undefined
		);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getBagsByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const result = await getIdBagsUsecase(id);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createBagsController = async (req: Request, res: Response, next: NextFunction) => {
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
		const bagsData = req.body;
		const result = await createBagsUsecase(bagsData, user);

		let response = responses.generate("success", { data: result });
		response.message = "Bags record has been created";
		
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateBagsController = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await updateBagsUsecase(id, updateData, user);

		const response = responses.generate("success", {
			message: "Bags record has been updated",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteBagsController = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await deleteBagsUsecase(id, user);
		const response = responses.generate("success", {
			message: "Bags record has been deleted",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
