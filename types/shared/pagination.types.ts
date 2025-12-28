export interface PaginationInfo {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}