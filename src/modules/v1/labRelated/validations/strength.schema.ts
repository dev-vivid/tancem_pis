import Joi from "joi";

export const strengthFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const strengthFormSchema = Joi.object({
	transactionDate: Joi.string().required(),
	materialId: Joi.string().required(),
	samples: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().optional(), // for updates
				sampleDate: Joi.string().required(),
				day1_strength: Joi.number().allow(null),
				day3_strength: Joi.number().allow(null),
				day7_strength: Joi.number().allow(null),
				day28_strength: Joi.number().allow(null),
				expansion: Joi.number().allow(null),
			})
		)
		.min(1)
		.required(),
});
