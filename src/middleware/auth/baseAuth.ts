import { MICROSERVICE_BASE_URL, SESSION_VALIDATION_URL } from "@config/index";
import { NextFunction, Request, Response } from "express";

import { AppError } from "@utils/errorHandler/appError";
import { IAuthUser } from "./../../index.d";
import createError from "http-errors";
import prisma from "@shared/prisma";

const baseAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers.authorization) {
			return next(createError.Unauthorized("Access token is required"));
		}

		const authHeader = req.headers["authorization"];

		const [_tokenType, accessToken] = authHeader.split(" ");

		if (!accessToken)
			throw new AppError("tokenMissing", 403, "Token is missing in header");

		if (!MICROSERVICE_BASE_URL || !SESSION_VALIDATION_URL)
			throw new AppError(
				"validationUrlNotFound",
				404,
				"URL for validation is not found"
			);

		const validationUrl = MICROSERVICE_BASE_URL + SESSION_VALIDATION_URL;
		const response = await fetch(validationUrl, {
			method: "POST",
			headers: new Headers({
				"content-type": "application/json",
			}),
			body: JSON.stringify({
				accessToken: accessToken,
			}),
		})
			.then(async (_res) => [_res.status, await _res.json()])
			.then((e) => e);
		// console.log(
		// 	"response",
		// 	response.map((i) => i.data)
		// );
		if (response[0] !== 201)
			throw new AppError(
				"sessionInvalid",
				403,
				"Token invalid or expired. Please login again"
			);

		const user = response[1].data.user as IAuthUser;
		req.user = user as IAuthUser;
		next();
	} catch (error: any) {
		next(error);
	}
};

export default baseAuth;
