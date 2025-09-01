import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
	getAllEquipmentUsecase,
	getEquipmentByIdUsecase,
	createEquipmentUsecase,
	updateEquipmentUsecase,
	deleteEquipmentUsecase,
} from "../usecases/equipment.usecase";

export const getAllEquipmentController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { status, pageNumber, pageSize } = req.query;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];

		const result = await getAllEquipmentUsecase(
			accessToken,
			pageNumber as string | undefined,
			pageSize as string | undefined,
			status as string | undefined,
		);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getEquipmentByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];

		const result = await getEquipmentByIdUsecase(id, accessToken);
		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createEquipmentController = async (req: Request, res: Response, next: NextFunction) => {
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

		const result = await createEquipmentUsecase(req.body, user);
		let response = responses.generate("success", { data: result });
		response.message = "Equipment record has been created";

		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateEquipmentController = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await updateEquipmentUsecase(id, req.body, user);

		const response = responses.generate("success", {
			message: "Equipment record has been updated",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteEquipmentController = async (req: Request, res: Response, next: NextFunction) => {
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

		const result = await deleteEquipmentUsecase(id, user);
		const response = responses.generate("success", {
			message: "Equipment record has been deleted",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
