import { useGetProductListing } from "@/queries/product";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductSortOption } from "@/types/product";
import { useState } from "react";
import { PaginationInfo } from "@/types/shared/pagination.types";

export function useProductListQuery(defaultSort = ProductSortOption.NEWEST) {
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [sort, setSort] = useState<ProductSortOption>(defaultSort);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const { data, isLoading, refetch } = useGetProductListing({
        sort,
        page: pagination.page,
        limit: pagination.size,
        searchText: debouncedSearch,
    });

    // Derive pagination info from query data
    const updatedPagination: PaginationInfo = {
        page: pagination.page,
        size: pagination.size,
        total: data?.meta?.total || 0,
        totalPages: Math.ceil((data?.meta?.total || 0) / pagination.size),
        hasNextPage:
            (data?.meta?.page || 1) <
            Math.ceil((data?.meta?.total || 0) / pagination.size),
        hasPrevPage: (data?.meta?.page || 1) > 1,
    };

    // #region Handlers
    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const handlePageSizeChange = (size: number) => {
        setPagination((prev) => ({ ...prev, size, page: 1 }));
    };

    const handleSortChange = (value: ProductSortOption) => {
        setSort(value);
        // Reset page to 1 whenever the sort changes
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        // Optionally reset page to 1 on new searches
        setPagination((prev) => ({ ...prev, page: 1 }));
    };
    // #endregion

    return {
        data: data?.data || [],
        isLoading,
        refetch,
        pagination: updatedPagination,
        handlePageChange,
        handlePageSizeChange,
        handleSortChange,
        handleSearchChange,
        sort,
        search,
    };
}