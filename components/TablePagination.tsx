import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "./ui/button"; 
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  totalPages: number;
  currentPage: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  count: number;
};

export default function TablePagination({
  totalPages,
  currentPage,
  limit,
  setPage,
  setLimit,
  count
}: Props) {
  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];

    // Case 1: totalPages small enough, show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Case 2: currentPage is in the first 3 pages
    if (currentPage <= 3) {
      pages.push(1, 2, 3);
      pages.push("ellipsis", totalPages);
      return pages;
    }

    // Case 3: currentPage is in the last 3 pages
    if (currentPage >= totalPages - 2) {
      pages.push(1, "ellipsis");
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Case 4: currentPage is somewhere in the middle
    pages.push(
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages
    );
    return pages;
  };

  const pages = getPages();
  return (
    <div className="py-2.5 flex max-sm:flex-col gap-5 w-full items-center md:justify-between justify-center md:text-lg">
      <div className="flex items-center gap-[14px]">
        <label htmlFor="rows-per-page" className="text-nowrap font-medium">
          Showing
        </label>
        <Select
          value={`${limit}`}
          onValueChange={(value) => {
            setLimit(Number(value));
          }}
        >
          <SelectTrigger
            size="sm"
            className="w-[70px] text-lg rounded-[10px] bg-primary *:data-[slot=select-value]:text-white focus-visible:ring-0 border-none [&_svg:not([class*='text-'])]:text-white"
            id="rows-per-page"
          >
            <SelectValue placeholder={10} />
          </SelectTrigger>
          <SelectContent side="top" className="min-w-[60px] bg-white">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`} className="cursor-pointer">
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>of {count}</span>
      </div>
      <div>
        <Pagination>
          <PaginationContent className="gap-1 md:gap-2.5">
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(currentPage - 1, 1))}
                className="bg-transparent w-[78px] md:w-[100px] text-[#444444] border-[#4444444D] rounded-[20px] md:text-lg"
              >
                <ChevronLeft className="size-6" />
                Prev
              </Button>
            </PaginationItem>

            {pages.map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="border border-[#44444480] rounded-full" />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={() => setPage(page)}
                    className={cn(
                      "md:text-lg rounded-full border",
                      currentPage === page
                        ? "bg-primary text-white hover:bg-primary hover:text-white"
                        : "bg-transparent text-[#44444480] border-[#44444480]"
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
                className="bg-transparent w-[78px] md:w-[100px] text-[#444444] border-[#4444444D] rounded-[20px] md:text-lg"
              >
                Next
                <ChevronRight className="size-6" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
