"use client";

import {ColumnDef, Table} from "@tanstack/react-table";
import {Product} from "@/types/product";
import {PaginationInfo} from "@/types/shared/pagination.types";
import ProductListSubHeader from "@/components/product/ProductList-sub-header";
import ProductTable from "@/components/product/table/table";

interface ProductListProps {
  products: Product[] | undefined;
  hasSomeSelectedRows: boolean;
  columns: ColumnDef<Product>[];
  pagination: PaginationInfo;
  isLoadingProducts: boolean;
  table: Table<Product>;
  searchQuery: string;
  handleDeleteProducts: () => void;
  handleSearchChange: (value: string) => void;
}

export default function ProductList({
  hasSomeSelectedRows,
  isLoadingProducts,
  searchQuery,
  pagination,
  products,
  columns,
  table,
  handleSearchChange,
  handleDeleteProducts,
}: ProductListProps) {
  if (isLoadingProducts && !products)
    return (
      <div className="py-8 text-center text-gray-500">
        <p>Product list will be displayed here</p>
      </div>
    );

  return (
    <div className="bg-card w-full rounded-lg">
      <ProductListSubHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        hasSomeSelectedRows={hasSomeSelectedRows}
        handleDeleteProducts={handleDeleteProducts}
      />

      <ProductTable
        table={table}
        columns={columns}
        pagination={pagination}
        isLoading={isLoadingProducts}
      />
    </div>
  );
}
