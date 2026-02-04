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
import { OrderStatus } from "../OrderDetail/order-info";
import IconSortDownArrow from "@/assets/icons/common/arrows/IconSortDownArrow";

enum OrderSortOption {
  ALL = "all",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  FULLFILLED = "fullfilled",
  REJECTED = "rejected",
}

const defaultFilterOptions = [
  { label: "All", value: OrderSortOption.ALL },
  { label: "Pending", value: OrderSortOption.PENDING },
  { label: "Confirmed", value: OrderSortOption.CONFIRMED },
  { label: "Preparing", value: OrderSortOption.PREPARING },
  { label: "Shipped", value: OrderSortOption.SHIPPED },
  { label: "Delivered", value: OrderSortOption.DELIVERED },
  { label: "Fullfilled", value: OrderSortOption.FULLFILLED },
  { label: "Rejected", value: OrderSortOption.REJECTED },
];

export default function OrderSortByBtn({
  customFilterOptions = defaultFilterOptions,
}: {
  customFilterOptions?: { label: string; value: string }[];
} = {}) {
  const { setParam, getParam } = useQueryParams();

  const sortByParms = getParam("sortBy") as ProductSortOption | undefined;

  const handleSortChange = (value: OrderStatus) => {
    setParam("sortBy", value);
  };

  // find the title for the current sortBy
  const selectedLabel = useMemo(() => {
    const option = customFilterOptions.find((o) => o.value === sortByParms);
    return option?.label;
  }, [sortByParms, customFilterOptions]);

  return (
    <Select
      value={selectedLabel ? sortByParms : undefined}
      onValueChange={(val) => {
        handleSortChange(val as OrderStatus);
      }}
    >
      <SelectTrigger
        disabledIcon
        className="h-[42px]! flex w-full items-center justify-center gap-3 rounded-[10px] bg-white font-medium !text-black dark:!text-white md:w-[236px] md:text-lg"
      >
        <IconSortDownArrow className="size-5!" />
        <span>
          {sortByParms && !!selectedLabel
            ? `Sort by: ${selectedLabel}`
            : "Sort by: All"}
        </span>
      </SelectTrigger>

      <SelectContent className="rounded-[10px] [&>div:nth-child(2)]:p-0">
        {customFilterOptions.map((option) => {
          return (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-none border-b-[1px] border-[#EEEEEE] px-4 py-3.5 hover:!bg-[#E4E6FF] data-[state=checked]:!bg-[#E4E6FF] dark:hover:!bg-neutral-400 dark:hover:!text-neutral-100 dark:data-[state=checked]:!bg-neutral-400"
            >
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
