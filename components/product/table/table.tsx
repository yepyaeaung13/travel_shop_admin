"use client";

import type { Product } from "@/types/product";
import {
  ColumnDef,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";
import { PaginationInfo } from "@/types/shared/pagination.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductTableProps {
  table: ReactTable<Product>;
  columns: ColumnDef<Product>[];
  pagination: PaginationInfo;
  isLoading?: boolean;
}

const ProductTable = ({
  table,
  columns,
  isLoading = false,
}: ProductTableProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-400 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="!bg-gray-200 dark:!bg-neutral-800"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* {selectedProductId && (
        <EditProductModal
          isOpen={selectedProductId ? true : false}
          onOpenChange={() => handleCloseEditProductModal()}
          id={selectedProductId}
        />
      )} */}
    </div>
  );
};

export default ProductTable;
