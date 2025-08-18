import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import { createStoppageUsecase, getAllStoppageUsecase, stoppageByIdUsecase,updateStoppageUsecase, deleteStoppageUsecase } from '../usecases/stoppage.usecase';

export const createStoppageController = async (req: Request, res: Response, next: NextFunction) => {
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
		const stoppageData = req.body;
		const result = await createStoppageUsecase(stoppageData, user);

		let response = responses.generate("success", { data: result });
		response.message = "Stoppage record has been created";
		
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getAllStoppageController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { pageNumber, pageSize } = req.query;
		const result = await getAllStoppageUsecase(
			pageNumber as string | undefined, 
			pageSize as string | undefined
		);

		const response = responses.generate("success", { data: result });
		
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const stoppageByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params
		
		const result = await stoppageByIdUsecase(id);

		const response = responses.generate("success", { data: result });
		
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateStoppageController = async (req: Request, res: Response, next: NextFunction) => {
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
		const stoppageData = req.body;
		const result = await updateStoppageUsecase(id, stoppageData, user);

		let response = responses.generate("success", { data: result });
		response.message = "Stoppage record has been created";
		
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteStoppageController = async (req: Request, res: Response, next: NextFunction) => {
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
		const result = await deleteStoppageUsecase(id, user);

		const response = responses.generate("success", { data: result });
		
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
