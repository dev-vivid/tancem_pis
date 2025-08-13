import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import { getAllMaterialTypeUsecase, getIdMaterialTypeUsecase, createMaterialTypeUsecase, updateMaterialTypeUsecase, deleteMaterialTypeUsecase } 
from "../usecases/materialType.usecase";

export const getAllMaterialType = async (req: Request, res: Response, next: NextFunction) => {
 try {

	const { pageNumber, pageSize } = req.query;
	const result = await getAllMaterialTypeUsecase(
		pageNumber as string | undefined,
		pageSize as string | undefined
	);
	const response = responses.generate("success", {
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const getIdMaterialType = async (req: Request, res: Response, next: NextFunction) => {
 try {
	const { id } = req.params;
	const result = await getIdMaterialTypeUsecase(id);

	const response = responses.generate("success", {
		data: result,
	});
	
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const createMaterialType = async (req: Request, res: Response, next: NextFunction) => {
 try {
	const user = req.user?.id;
	if(!user){
		return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
		});
	}
	const problemData = req.body;
	const result = await createMaterialTypeUsecase(problemData, user);

	let response = responses.generate("success", {
		data: result,
	});
	response.message = "Material Type has been created"
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const updateMaterialType = async (req: Request, res: Response, next: NextFunction) => {
 try {
	const user = req.user?.id;
	if(!user){
		return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
		});
	}	
	const {id } = req.params;
	const updateData = req.body;

	const result = await updateMaterialTypeUsecase(id, updateData, user);

	const response = responses.generate("success", {
		message: "Material Type has been updated",
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const deleteMaterialType = async (req: Request, res: Response, next: NextFunction) => {
 try {

	const {id} = req.params;

	const user = req.user?.id;
	if(!user){
		return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
	}
	const result = await deleteMaterialTypeUsecase(id, user);

	const response = responses.generate("success", {
		message: "Material Type has been deleted",
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};
