"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CustomerListFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
}

const CustomerListFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}: CustomerListFiltersProps) => {
  return (
    <div className="flex items-center justify-between rounded-t-[20px] bg-white p-5">
      <h1 className="text-xl font-medium">All Customers</h1>

      <div className="max-w-40 md:max-w-96 relative">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#A1A1A1]" />
        <Input
          placeholder="Search customer name or email"
          title="Search customer name or email"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-auto rounded-[20px] pb-2 pl-10 pt-2.5 text-lg font-medium text-[#A1A1A1]"
        />
      </div>
    </div>
  );
};

export default CustomerListFilters;
