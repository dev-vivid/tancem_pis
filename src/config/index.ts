import { AppError } from "@utils/errorHandler/appError";
import { config } from "dotenv";
config();

import { env } from "node:process";

const getEnvVariable = (
	key: string,
	options?: { defaultValue?: string }
): string => {
	const value = env[key];
	const defaultValue = options?.defaultValue;
	if (!value && !defaultValue) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	if (value) {
		return value;
	}
	if (defaultValue) {
		return defaultValue;
	}
	throw new AppError(
		"envVariableNotFound",
		404,
		`Environment variable '${key}' not found`
	);
};

export const DATABASE_URL = getEnvVariable("DATABASE_URL");
export const PORT = getEnvVariable("APP_PORT", { defaultValue: "3000" });
export const ENV = getEnvVariable("NODE_ENV", { defaultValue: "development" });
export const BASE_PATH = getEnvVariable("APP_BASE_PATH");
export const BASE_URL = getEnvVariable("BASE_URL");

export const MICROSERVICE_BASE_URL = getEnvVariable("MICROSERVICE_BASE_URL");
export const SESSION_VALIDATION_URL = getEnvVariable("SESSION_VALIDATION_URL");
export const INVENTORY_URL = getEnvVariable("INVENTORY_URL");
export const ASSET_URL = getEnvVariable("ASSET_URL");
export const USER_MANAGEMENT_URL = getEnvVariable("USER_MANAGEMENT_URL");
export const USER_DATABASE_URL = getEnvVariable("USER_DATABASE_URL");

export const UPLOAD_PATH = getEnvVariable("UPLOAD_PATH");
export const V1_BASE_PATH = `/${BASE_PATH}/v1`;
export const USER_DATABASE_NAME = getEnvVariable("USER_DATABASE_NAME");
