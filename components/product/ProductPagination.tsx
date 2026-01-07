"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectIcon,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import {PaginationInfo} from "@/types/shared/pagination.types";

interface ProductPaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

/** Helper: compute visible page numbers including ellipses */
function getVisiblePages(current: number, totalPages: number, delta = 2) {
    const range: (number | string)[] = [];
    const pages: (number | string)[] = [];

    // Middle range of pages
    for (
        let i = Math.max(2, current - delta);
        i <= Math.min(totalPages - 1, current + delta);
        i++
    ) {
        range.push(i);
    }

    // Beginning + ellipsis
    if (current - delta > 2) pages.push(1, "…");
    else pages.push(1);

    // Middle
    pages.push(...range);

    // Ending + ellipsis
    if (current + delta < totalPages - 1) pages.push("…", totalPages);
    else if (totalPages > 1) pages.push(totalPages);

    return pages;
}

export default function ProductPagination({
                                              pagination,
                                              onPageChange,
                                              onPageSizeChange,
                                          }: ProductPaginationProps) {
    const { page, size, total, totalPages, hasNextPage, hasPrevPage } = pagination;

    const visiblePages = useMemo(
        () => getVisiblePages(page, totalPages),
        [page, totalPages],
    );

    return (
        <div className="flex flex-col items-center justify-between gap-4 py-2 md:flex-row md:gap-0 md:pt-4">
            {/* Page size selector */}
            <div className="text-accent-foreground flex items-center gap-2 text-xs md:text-base">
                <span>Showing</span>
                <Select
                    value={size.toString()}
                    onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                    <SelectTrigger
                        disabledIcon
                        className="!bg-primary h-8 w-16 rounded-xl text-white"
                    >
                        <SelectValue placeholder={size.toString()} />
                        <SelectIcon>
                            <ChevronDown className="size-4 text-white" />
                        </SelectIcon>
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 25, 50, 100].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                                {n}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span>of {total}</span>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-fit rounded-3xl px-5 text-nowrap text-black"
                    onClick={() => onPageChange(page - 1)}
                    disabled={!hasPrevPage}
                >
                    <ChevronLeft className="translate-y-0.5 size-4" />
                    <span className="ml-1">Prev</span>
                </Button>

                {visiblePages.map((p, i) =>
                        p === "…" ? (
                            <span key={`dots-${i}`} className="px-2 text-muted-foreground">
              …
            </span>
                        ) : (
                            <Button
                                key={p}
                                variant={page === p ? "default" : "outline"}
                                size="icon"
                                className={`aspect-square h-8 min-w-8 rounded-full ${
                                    page === p ? "text-white" : ""
                                }`}
                                onClick={() => onPageChange(p as number)}
                            >
                                {p}
                            </Button>
                        ),
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-fit rounded-3xl px-5 text-black"
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasNextPage}
                >
                    <span className="mr-1">Next</span>
                    <ChevronRight className="size-4 translate-y-0.5" />
                </Button>
            </div>
        </div>
    );
}