import Joi from "joi";

export const SearchQuerySchema = Joi.object({
	search: Joi.string().optional(),
});

export const PaginationJoiSchema = Joi.object({
	pageNumber: Joi.number().min(1).default(1),
	pageSize: Joi.number().min(1).default(10),
});

export const isActiveJoiSchema = Joi.object({
	isActive: Joi.boolean()
		.truthy("true")
		.truthy("1")
		.falsy("false")
		.falsy("0")
		.valid("true", "false", "1", "0")
		.optional(),
});

export const sortOrderJoiSchema = Joi.object({
	sortBy: Joi.string().optional().default("createdAt"),
	orderBy: Joi.string().valid("asc", "desc").optional().default("desc"),
});

// FIXME: need to check the isActiveJoiSchema
export const BaseQueryFilterSchema = Joi.object({
	$schema: Joi.string().optional(),
})
	.concat(PaginationJoiSchema)
	.concat(SearchQuerySchema)
	// .concat(isActiveJoiSchema)
	.concat(sortOrderJoiSchema);
