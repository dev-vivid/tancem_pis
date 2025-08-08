export type SearchQueryParamType = {
	search?: string;
};

export type PaginationQueryParamType = {
	pageNumber?: string;
	pageSize?: string;
};

export type OrderByQueryParam = {
	sortBy?: string;
	orderBy?: "asc" | "desc";
};

export type IsActiveQueryParam = {
	isActive?: boolean;
};

export type BaseQueryParamType = {
	$schema?: string;
} & PaginationQueryParamType &
	SearchQueryParamType &
	OrderByQueryParam &
	IsActiveQueryParam;
