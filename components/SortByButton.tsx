"use client";
import React, { useCallback, useMemo } from "react";
import { ArrowDownWideNarrowIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProductSortOption } from "@/types/product.types";
import { useQueryParams } from "@/hooks/use-query-params";

const orderByOptions = [
  { label: "A to Z", value: ProductSortOption.NAME_ASC },
  { label: "Z to A", value: ProductSortOption.NAME_DESC },
  { label: "Newest", value: ProductSortOption.NEWEST },
  { label: "Oldest", value: ProductSortOption.OLDEST },
  { label: "Category: A to Z", value: ProductSortOption.CATEGORY_ASC },
  { label: "Category: Z to A", value: ProductSortOption.CATEGORY_DESC },
  { label: "Price: Low to High", value: ProductSortOption.PRICE_LOW_HIGH },
  { label: "Price: High to Low", value: ProductSortOption.PRICE_HIGH_LOW },
  {
    label: "Quantity: Low to High",
    value: ProductSortOption.QUANTITY_LOW_HIGH,
  },
  {
    label: "Quantity: High to Low",
    value: ProductSortOption.QUANTITY_HIGH_LOW,
  },
  { label: "Status: A to Z", value: ProductSortOption.STATUS_ASC },
  { label: "Status: Z to A", value: ProductSortOption.STATUS_DESC },
  {
    label: "Product Count: A to Z",
    value: ProductSortOption.PRODUCT_COUNT_ASC,
  },
  {
    label: "Product Count: Z to A",
    value: ProductSortOption.PRODUCT_COUNT_DESC,
  },
];

const defaultFilterOptions = [
  { label: "A to Z", value: ProductSortOption.NAME_ASC },
  { label: "Z to A", value: ProductSortOption.NAME_DESC },
  { label: "Newest", value: ProductSortOption.NEWEST },
  { label: "Oldest", value: ProductSortOption.OLDEST },
];

export default function SortByButton({
  customFilterOptions = defaultFilterOptions,
}: {
  customFilterOptions?: { label: string; value: string }[];
} = {}) {
  const { setParam, getParam } = useQueryParams();

  const sortByParms = getParam("sortBy") as ProductSortOption | undefined;

  const handleSortChange = (value: ProductSortOption) => {
    setParam("sortBy", value);
  };

  // find the title for the current sortBy
  const selectedLabel = useMemo(() => {
    const option =
      customFilterOptions.find((o) => o.value === sortByParms) ||
      orderByOptions.find((o) => o.value === sortByParms);
    return option?.label;
  }, [sortByParms, customFilterOptions]);

  return (
    <Select
      value={selectedLabel ? sortByParms : undefined}
      onValueChange={(val) => {
        handleSortChange(val as ProductSortOption);
      }}
    >
      <SelectTrigger
        disabledIcon
        className="flex h-8 items-center gap-2 rounded-full bg-[#E4E6FF] p-5 py-4 font-medium !text-black dark:!text-white"
      >
        <ArrowDownWideNarrowIcon className="size-4 translate-y-0.5 opacity-60" />
        <span>
          {sortByParms && !!selectedLabel
            ? `Sort by : ${selectedLabel}`
            : "Sort by"}
        </span>
      </SelectTrigger>

      <SelectContent className="[&>div:nth-child(2)]:p-0">
        {customFilterOptions.map((option) => {
          return (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-none hover:!bg-[#E4E6FF] data-[state=checked]:!bg-[#E4E6FF] dark:hover:!bg-neutral-400 dark:hover:!text-neutral-100 dark:data-[state=checked]:!bg-neutral-400"
            >
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
