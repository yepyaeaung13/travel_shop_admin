"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationInfo } from "@/types/product.types";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const { page, size, total, totalPages, hasNextPage, hasPrevPage } =
    pagination;
  // const startRow = (page - 1) * size + 1;
  // const endRow = Math.min(page * size, total);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center justify-center gap-1 text-lg font-medium text-[#303030]">
        <span>Showing</span>
        <Select
          value={size.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 px-1.5 text-lg font-medium text-white [&_svg:not([class*='text-'])]:text-white bg-[#616FF5] rounded-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
        <span>of {total}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getVisiblePages().map((pageNum, index) => (
          <div key={index}>
            {pageNum === "..." ? (
              <span className="px-2 text-gray-400">...</span>
            ) : (
              <Button
                variant={page === pageNum ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-white"
                onClick={() => onPageChange(pageNum as number)}
              >
                {pageNum}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
