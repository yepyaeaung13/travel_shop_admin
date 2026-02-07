"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar1 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import IconSortSlide from "@/assets/icons/common/arrows/IconSortSlide";

export function SortByDate() {
  const [open, setOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleConfirm = () => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", dateRange?.from?.toISOString() || "");
    params.set("to", dateRange?.to?.toISOString() || "");
    router.replace(`?${params.toString()}`);
  };

  const handleClear = () => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    router.replace(`?${params.toString()}`);
    setDateRange({
      from: undefined,
      to: undefined,
    });
  };

  return (
    <div className="relative">
      <div
        onClick={handleOpen}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-white p-1",
          open || dateRange?.from || dateRange?.to ? "" : "max-sm:w-fit",
        )}
      >
        <div className="size-10 flex items-center justify-center rounded-[8px] bg-[#EEEEEE]">
          <IconSortSlide />
        </div>
        <p
          className={cn(
            "w-full md:w-52",
            open || dateRange?.from || dateRange?.to ? "" : "hidden",
          )}
        >
          <span>Date: </span>
          <span className="text-[#3C3C3C]/30">
            {dateRange?.from?.toLocaleDateString("en-US")} -{" "}
            {dateRange?.to?.toLocaleDateString("en-US")}
          </span>
        </p>
      </div>
      <div
        className={cn(
          "absolute right-0 top-14 z-50 flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-white shadow-sm md:w-auto ",
          open ? "visible" : "invisible",
        )}
      >
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          className="w-full md:w-auto"
        />
        <div className="flex w-full justify-end gap-4 px-4 pb-3">
          <button onClick={handleClear} className="text-[#FF3333]">
            Clear
          </button>
          <button onClick={handleConfirm} className="text-primary">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
