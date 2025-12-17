"use client";

import CustomerListHeader from "./customer-list-header";
import CustomerListFilter from "./customer-list-filter";
import CustomerTable from "./customer-list-table";
import { CustomerListFilters, useCustomerList } from "@/hooks/customers/useCustomers";

interface CustomerListProps {
  initialFilters?: Partial<CustomerListFilters>;
}

export default function CustomerList({ initialFilters }: CustomerListProps) {
  const {
    customerLists,
    pagination,
    filters,
    isLoading,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useCustomerList({ initialFilters });

  return (
    <div className="w-full pb-10">
      <CustomerListHeader />

      <CustomerListFilter
        searchQuery={filters.searchQuery}
        onSearchChange={(value) => handleFilterChange('searchQuery', value)}
      />

      <CustomerTable
        data={customerLists}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading}
      />
    </div>
  );
}