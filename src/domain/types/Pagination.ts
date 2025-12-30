export interface PaginationParams {
	page: number;
	pageSize: number;
}

export interface PaginatedResult<T> {
	data: T[];
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

