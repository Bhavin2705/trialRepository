export interface PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export class PaginationHelper {
    static buildQuery(query: PaginationQuery) {
        const page = Math.max(1, query.page || 1);
        const limit = Math.min(100, Math.max(1, query.limit || 10));
        const skip = (page - 1) * limit;

        const sortField = query.sort || 'createdAt';
        const sortOrder = query.order === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortOrder };

        return { page, limit, skip, sort };
    }

    static buildResponse<T>(
        data: T[],
        total: number,
        page: number,
        limit: number
    ): PaginationResult<T> {
        const pages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages,
                hasNext: page < pages,
                hasPrev: page > 1
            }
        };
    }
}

export default PaginationHelper;