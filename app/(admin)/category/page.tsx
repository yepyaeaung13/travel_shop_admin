"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, CirclePlus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Component imports ---
import IconTrash from "@/assets/icons/Trash";
import IconNoYet from "@/assets/icons/NoYet";
import IconNoFound from "@/assets/icons/NoFound";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import ConfirmChangeDialog from "@/components/common/ConfirmChangeDialog";
import TablePagination from "@/components/TablePagination";
import CategoryTable from "@/components/Category/CategoryTable";
import IconBtnLoading from "@/components/BtnLoading";
import IconLoading from "@/components/Loading";
import { successToast, errorToast } from "@/components/toast";

import { useQueryParams } from "@/hooks/use-query-params";
import { SortOptionValue } from "@/components/Category/CategoryTable";
import { CategoryResponse } from "@/types/category.types";
import {
  useDeleteCategory,
  useGetCategories,
  useToggleStatus,
} from "@/queries/category.queries";
import { getToggleCategoryStatus } from "@/utils/commonHelper";
import IconDefaultCategory from "@/assets/icons/category/IconDefaultCategory";

type ListCategoryArgs = {
  page: number;
  limit: number;
  search?: string;
  sortBy: SortOptionValue;
};

export default function Page() {
  return (
    <Suspense fallback="">
      <CategoryList />
    </Suspense>
  );
}

function CategoryList() {
  // --- State Initialization ---
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  const [deleteCategoryIds, setDeleteCategoryIds] = useState<number[]>([]);
  const [changeCategory, setChangeCategory] = useState<CategoryResponse | null>(
    null
  );
  const [btnLoading, setBtnLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- PAGINATION AND SORT LOGIC ---
  const [currentPage, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const { getParam } = useQueryParams();
  const sortByValueFromQuery =
    (getParam("sortBy") as SortOptionValue) || SortOptionValue.NEWEST;

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
  const queryArgs: ListCategoryArgs = useMemo(
    () => ({
      page: currentPage,
      limit: limit,
      search: debouncedSearch.trim() || undefined,
      sortBy: sortByValueFromQuery,
    }),
    [currentPage, limit, debouncedSearch, sortByValueFromQuery]
  );

  const { data: res, isLoading } = useGetCategories({
    sortBy: queryArgs.sortBy,
    limit: queryArgs.limit,
    page: queryArgs.page,
    searchText: queryArgs.search,
  });

  const categories: CategoryResponse[] = res?.data || [];
  const totalItems = res?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // --- CONVEX MUTATIONS ---
  const { mutate: toggleStatusMutation, isPending: loading } =
    useToggleStatus();
  const { mutate: deleteMutation, isPending } = useDeleteCategory();

  // --- SELECT ALL LOGIC ---
  const isAllSelected =
    categories.length > 0 && selectedCategory.length === categories.length;
  const isIndeterminate =
    selectedCategory.length > 0 && selectedCategory.length < categories.length;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked) {
      // Select all currently visible categories
      const allVisibleIds = categories.map((c) => c.id);
      setSelectedCategory(allVisibleIds);
    } else {
      // Deselect all
      setSelectedCategory([]);
    }
  };

  // ------------------------------------
  // --- CORE LOGIC HANDLERS ---
  // ------------------------------------

  const handleDelete = async () => {
    if (deleteCategoryIds.length === 0) return;
    deleteMutation(deleteCategoryIds, {
      onSuccess: (res) => {
        successToast(
          "Success!",
          `${deleteCategoryIds.length} category(ies) deleted successfully!`
        );

        setSelectedCategory([]); // Clear selection after deletion
        setOpen(false);
        setDeleteCategoryIds([]);
      },
      onError(error: any, variables, context) {
        errorToast(
          "Failed",
          error?.response?.data?.message || "Failed to delete category."
        );
      },
    });
  };

  const handleStatusChange = async () => {
    if (!changeCategory) return;
    const newStatus = getToggleCategoryStatus(changeCategory.status);

    toggleStatusMutation(
      { id: changeCategory.id, status: newStatus },
      {
        onSuccess(res) {
          setChangeOpen(false);
          successToast("Success", `Category status updated to ${newStatus}!`);
          setChangeCategory(null);
        },
        onError(error) {
          console.error("Status change failed:", error);
          errorToast(
            "Failed",
            (error as Error).message || "Failed to change category status."
          );
        },
      }
    );
  };

  const handleSetDeleteCategory = (id: number) => {
    setDeleteCategoryIds([id]); // Delete single category
    setOpen(true);
  };

  const handleSetDeleteMultiple = () => {
    if (selectedCategory.length > 0) {
      setDeleteCategoryIds(selectedCategory); // Delete all selected
      setOpen(true);
    }
  };

  const handleSetChangeCategory = (category: CategoryResponse) => {
    setChangeOpen(true);
    setChangeCategory(category);
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategory((prev) => {
      return prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
    });
  };

  // --- RENDER LOGIC ---
  const showNoCategoryYet = totalItems === 0 && !debouncedSearch;
  const showNoResult = totalItems === 0 && debouncedSearch;
  const defaultCategory = categories.find((cat) => cat.id === 1);

  // ------------------------------------
  // --- JSX RENDER ---
  // ------------------------------------
  return (
    <div className="h-full space-y-2.5 md:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium md:text-2xl">Category List</h1>
        </div>

        <Button className="bg-primary hover:bg-primary h-auto w-auto rounded-[10px] duration-300 active:scale-95 2xl:px-5 2xl:py-2.5">
          <Link
            href="/category/add"
            className="flex h-6 w-36 text-white items-center justify-center gap-2.5 font-medium md:text-lg"
            onClick={() => setBtnLoading(true)}
          >
            {btnLoading ? (
              <IconBtnLoading />
            ) : (
              <>
                <CirclePlus className="h-6 w-6 text-white" />
                Add Category
              </>
            )}
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl px-5 py-3 flex justify-between">
        <p className="flex items-center gap-4">
          <IconDefaultCategory />
          {defaultCategory?.name}
          </p>
        <Link
          href={`/category/products/${defaultCategory?.id}`}
          className="flex items-center gap-2"
        >
          {defaultCategory?.products.length} products{" "}
          <ChevronRight className="size-5" />
        </Link>
      </div>
      {/* Categories Table */}
      <Card className="min-h-full bg-white gap-4 border-none py-5">
        <CardHeader className="max-sm:px-4">
          <div className="flex items-center justify-between gap-2">
            {/* {selectedCategory.length === 0 ? ( */}
            <CardTitle className="text-nowrap flex gap-5 font-medium md:text-xl">
              All Category ({totalItems})
            </CardTitle>
            <div
              className={cn(
                "relative",
                selectedCategory.length > 0 && "max-sm:hidden"
              )}
            >
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 border-[#44444480] pl-10 md:w-80 md:text-lg md:placeholder:text-lg"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <CategoryTable
            categories={categories.filter((cat) => cat.id !== 1) as any[]}
            selectCategory={selectedCategory}
            handleSelectCategory={handleSelectCategory as (id: number) => void}
            handleSetDeleteCategory={
              handleSetDeleteCategory as (id: number) => void
            }
            handleSetChangeCategory={handleSetChangeCategory as any}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            handleSelectAll={handleSelectAll}
          />

          {isLoading && (
            <div className="flex h-96 w-full items-center justify-center">
              <IconLoading className="size-40" />
            </div>
          )}

          {showNoCategoryYet && !isLoading && (
            <div className="flex w-full flex-col items-center justify-center gap-5 pb-16 pt-24">
              <IconNoYet className="h-[149px] w-[200px] md:h-[225px] md:w-[300px]" />
              <span className="text-xl font-medium text-[#444444]">
                No category yet
              </span>
            </div>
          )}

          {showNoResult && !isLoading && (
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
      {totalItems > 0 && (
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

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={open}
        setOpen={setOpen}
        loading={isPending}
        callback={handleDelete}
      />
      {/* Status Change Dialog */}
      <ConfirmChangeDialog
        status={changeCategory?.status || ""}
        open={changeOpen}
        setOpen={setChangeOpen}
        loading={loading}
        callback={handleStatusChange}
      />
    </div>
  );
}
