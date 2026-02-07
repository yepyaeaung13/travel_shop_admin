"use client";

import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import OrderListHeader from "./order-list-header";
import OrderListFilters from "./order-list-filter";
import { useQueryParams } from "@/hooks/use-query-params";
import OrderAnalyzeSection from "./order-analyze-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/TablePagination";
import OrderTable from "./OrderTable";
import IconLoading from "@/components/Loading";
import IconNoYet from "@/assets/icons/NoYet";
import IconNoFound from "@/assets/icons/NoFound";
import { useGetOrderList } from "@/queries/order";
import { OrderStatus } from "./sort-dropdown";

type ListOrderArgs = {
  page: number;
  limit: number;
  search?: string;
  status: OrderStatus | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
};

export interface OrderListProps {
  onImport?: () => void;
  onExport?: () => void;
}

export default function OrderList({ onImport, onExport }: OrderListProps) {
  // --- State Initialization ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- PAGINATION AND SORT LOGIC ---
  const [currentPage, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<ListOrderArgs["status"]>(
    OrderStatus.ALL,
  );
  const [date, setDate] = useState<{
    from: string | undefined;
    to: string | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const { getParam } = useQueryParams();
  const statusValue = getParam("status") as OrderStatus;
  const fromDate = getParam("from");
  const toDate = getParam("to");

  useEffect(() => {
    if (statusValue) {
      setStatus(statusValue);
    }
    setDate({ from: fromDate || undefined, to: toDate || undefined });
  }, [statusValue, fromDate, toDate]);

  // --- Side Effects ---
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- QUERY ---
  const queryArgs: ListOrderArgs = useMemo(
    () => ({
      page: currentPage,
      limit: limit,
      search: debouncedSearch.trim() || undefined,
      status: status === OrderStatus.ALL ? undefined : status,
      fromDate: date.from ?? undefined,
      toDate: date.to ?? undefined,
    }),
    [currentPage, limit, debouncedSearch, status, date],
  );

  const { data: res, isLoading } = useGetOrderList({
    sort: queryArgs.status as OrderStatus,
    limit: queryArgs.limit,
    page: queryArgs.page,
    searchText: queryArgs.search,
    status: queryArgs.status,
    fromDate: queryArgs.fromDate,
    toDate: queryArgs.toDate,
  });
  const orders: any[] = res?.data?.orders || [];
  const totalItems = res?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // --- RENDER LOGIC ---
  const showNoOrderYet = totalItems === 0 && !debouncedSearch;
  const showNoResult = totalItems === 0 && debouncedSearch;

  // ------------------------------------
  // --- JSX RENDER ---
  // ------------------------------------

  return (
    <div className="w-full">
      <div className="h-full space-y-2.5 md:space-y-3">
        <OrderAnalyzeSection />
        <OrderListHeader onImport={onImport} onExport={onExport} />

        {/* Categories Table */}
        <Card className="min-h-full gap-4 border-none py-5">
          <CardHeader className="max-sm:px-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-nowrap flex gap-5 font-medium md:text-xl">
                All Orders
              </CardTitle>
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search customer name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-44 border-[#44444480] pl-10 md:w-80 md:text-lg md:placeholder:text-lg"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <OrderTable orders={orders as any[]} />

            {isLoading && (
              <div className="flex h-96 w-full items-center justify-center">
                <IconLoading className="size-40" />
              </div>
            )}

            {orders !== undefined && showNoOrderYet && orders?.length === 0 && (
              <div className="flex w-full flex-col items-center justify-center gap-5 pb-16 pt-24">
                <IconNoYet className="h-[149px] w-[200px] md:h-[225px] md:w-[300px]" />
                <span className="text-xl font-medium text-[#444444]">
                  No order yet
                </span>
              </div>
            )}

            {showNoResult && orders && (
              <div className="flex w-full flex-col items-center justify-center gap-5 pb-16 pt-24">
                <IconNoFound className="h-[114px] w-[200px] md:h-[170px] md:w-[300px]" />
                <span className="text-xl font-medium text-[#444444]">
                  No result found
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* {totalItems > 0 && ( */}
        {true && (
          <div className="pt-3 md:pb-5">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={setPage}
              setLimit={setLimit}
              limit={limit}
              count={totalItems}
            />
          </div>
        )}
      </div>
    </div>
  );
}
