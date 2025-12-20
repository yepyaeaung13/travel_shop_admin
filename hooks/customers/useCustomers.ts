import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { PaginationInfo } from "@/types/product.types";
import { UserSortOption } from "@/types/users.types";
import { useQueryParams } from "@/hooks/use-query-params";
import { useUsers } from "@/queries/users.queries";

export interface CustomerListFilters {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
}

export interface UseCustomerListProps {
  initialFilters?: Partial<CustomerListFilters>;
}

export function useCustomerList({ initialFilters = {} }: UseCustomerListProps = {}) {
  const { getParam } = useQueryParams();

  // Extract sort from URL params
  const sortBy = (getParam("sortBy") as UserSortOption) ?? UserSortOption.NEWEST;

  // Local states
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState<CustomerListFilters>({
    searchQuery: initialFilters.searchQuery ?? "",
    statusFilter: initialFilters.statusFilter ?? "all",
    categoryFilter: initialFilters.categoryFilter ?? "all",
    ...initialFilters,
  });

  // Debounced search
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  // Fetch users data
  const { data: rawCustomerLists, isLoading } = useUsers({
    sort: sortBy,
    page: pagination.page,
    limit: pagination.size,
    searchText: debouncedSearchQuery,
  });

  const customerLists = rawCustomerLists?.data ?? [];

  // Update pagination from API response
  useEffect(() => {
    if (!rawCustomerLists?.meta) return;

    const { page = 1, take = 10, skip = 0 } = rawCustomerLists.meta;
    const currentPage = Number(page);
    const pageSize = Number(take);
    const totalItems = Number(skip) + rawCustomerLists.data?.length || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    setPagination((prev) => ({
      ...prev,
      page: currentPage,
      size: pageSize,
      total: totalItems,
      totalPages,
      hasNextPage: rawCustomerLists.data?.length === pageSize,
      hasPrevPage: currentPage > 1
    }));
  }, [rawCustomerLists]);

  // Reset pagination when search changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery]);

  // Update filters
  const updateFilters = (newFilters: Partial<CustomerListFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, size, page: 1 }));
  };

  // Reset pagination when any filter changes (except search, which is handled above)
  const handleFilterChange = (filterKey: keyof CustomerListFilters, value: string) => {
    const newFilters = { [filterKey]: value };
    setFilters(prev => ({ ...prev, ...newFilters }));

    // Reset page for non-search filters
    if (filterKey !== 'searchQuery') {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  return {
    customerLists,
    pagination,
    filters,
    isLoading,
    updateFilters,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  };
}