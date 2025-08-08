import Joi from "joi";

export const dateJoi = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/); // Validate YYYY-MM-DD format
