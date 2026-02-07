"use client";
import React, { useCallback, useMemo } from "react";
import { ArrowDownWideNarrowIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-query-params";
import IconSortDownArrow from "@/assets/icons/common/arrows/IconSortDownArrow";

export enum OrderStatus {
  ALL = "all",
  Pending = "Pending",
  Confirmed = "Confirmed",
  Preparing = "Preparing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Fulfilled = "Fulfilled",
  Rejected = "Rejected",
}

const defaultFilterOptions = [
  { label: "All", value: OrderStatus.ALL },
  { label: "Pending", value: OrderStatus.Pending },
  { label: "Confirmed", value: OrderStatus.Confirmed },
  { label: "Preparing", value: OrderStatus.Preparing },
  { label: "Shipped", value: OrderStatus.Shipped },
  { label: "Delivered", value: OrderStatus.Delivered },
  { label: "Fullfilled", value: OrderStatus.Fulfilled },
  { label: "Rejected", value: OrderStatus.Rejected },
];

export default function OrderSortByBtn({
  customFilterOptions = defaultFilterOptions,
}: {
  customFilterOptions?: { label: string; value: string }[];
} = {}) {
  const { setParam, getParam } = useQueryParams();

  const sortByParms = getParam("status") as OrderStatus | undefined;

  const handleSortChange = (value: OrderStatus) => {
    setParam("status", value);
  };

  // find the title for the current sortBy
  const selectedLabel = useMemo(() => {
    const option = customFilterOptions.find((o) => o.value === sortByParms);
    return option?.label;
  }, [sortByParms, customFilterOptions]);

  return (
    <Select
      value={sortByParms ?? "ALL"}
      onValueChange={(val) => handleSortChange(val as OrderStatus)}
    >
      <SelectTrigger
        disabledIcon
        className="h-[42px]! flex w-full items-center justify-center gap-3 rounded-[10px] bg-white font-medium !text-black dark:!text-white md:w-[236px] md:text-lg"
      >
        <IconSortDownArrow className="size-5!" />

        <span>Sort by: {selectedLabel ?? "All"}</span>
      </SelectTrigger>

      <SelectContent
        position="popper"
        className="rounded-[10px] [&>div:nth-child(2)]:p-0"
      >
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
