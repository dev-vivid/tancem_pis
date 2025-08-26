import responses from "../../../../shared/utils/responses";

import { Request, Response,NextFunction } from "express";
import * as transactionTypeUsecase from "../usecases/transactionType.usecase";


export const getAllTransactionTypes = async (
  req: Request, 
  res: Response,next: NextFunction) => {
	try {
		const { pageNumber, pageSize, status } = req.query;

		const result = await transactionTypeUsecase.getAllTransactionTypesUsecase(
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
}



export const getTransactionTypeById = async (req: Request, res: Response,next:NextFunction) => {
	try {
		const { id } = req.params;
		const result = await transactionTypeUsecase.getTransactionTypeByIdUsecase(id);

    const response=responses.generate("success", {
			data: result,
		})
    	res.status(response.statusCode).send(response);

	} catch (error) {
		next(error);
	}
};

export const createTransactionType = async (
  req: Request, 
  res: Response,
  next: NextFunction) => {
	try {
		const payload = req.body;
    	//  Get logged-in user's ID
		const userId: string = req.user?.id;


if (!userId) {
			return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
		}

   	const transactionData = req.body;
    await transactionTypeUsecase.createTransactionTypeUsecase(transactionData,userId);
      const response=responses.generate("success", {
			message: " updated successfully!",
			data: null,
		});
    res.status(response.statusCode).send(response);
  } catch (error) {
	   next(error);
	}
};

export const updateTransactionType = async (req: Request, res: Response,next:NextFunction) => {
	try {
	
//  Get the logged-in user's ID

		const userId: string = req.user?.id 
     if(!userId){
      return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
     }
     	const { id } = req.params;
		const payload = req.body;

		const result = await transactionTypeUsecase.updateTransactionTypeUsecase(id, payload,userId);
		const response = responses.generate("success", {
		message: " Updated",
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const deleteTransactionType = async (req: Request, res: Response,next: NextFunction) => {
	try {
		const { id } = req.params;
    	//  Declare userId here
		const userId = req.user?.id  
		// "system" is just a fallback — replace with actual logged-in user ID if available
		if(!userId){
      return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
    }

const result = await transactionTypeUsecase.deleteTransactionTypeUsecase(id,userId);

	const response = responses.generate("success", {
		message: "transaction has been deleted",
		data: result,
	});
	res.status(response.statusCode).send(response);
}
catch (error) {
	next(error)
 }
}
