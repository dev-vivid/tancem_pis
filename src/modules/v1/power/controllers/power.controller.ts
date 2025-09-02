import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
	getAllPowerTransactionsUsecase,
	getPowerTransactionByIdUsecase,
	createPowerTransactionUsecase,
	updatePowerTransactionUsecase,
	deletePowerTransactionUsecase
} from "../usecases/power.usecase";

export const getAllPower = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const authHeader = req.headers.authorization;
		
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];		
		const result = await getAllPowerTransactionsUsecase(
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

export const getPowerById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const authHeader = req.headers.authorization;
		
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];		
		const result = await getPowerTransactionByIdUsecase(id, accessToken);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createPower = async (req: Request, res: Response, next: NextFunction) => {
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
		const powerData = req.body;
		const result = await createPowerTransactionUsecase(powerData, user);

		let response = responses.generate("success", { data: result });
		response.message = "Power record has been created";
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updatePower = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await updatePowerTransactionUsecase(id, updateData, user);

		const response = responses.generate("success", {
			message: "Power record has been updated",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deletePower = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { powerDetailsId } = req.body;
		const user = req.user?.id;
		if (!user) {
			return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
		}
		const result = await deletePowerTransactionUsecase(id, powerDetailsId, user);
		const response = responses.generate("success", {
			message: "Power record has been deleted",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
