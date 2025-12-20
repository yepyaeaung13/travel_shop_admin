"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSortOption } from "@/types/users.types";

interface SortOption {
  label: string;
  value: UserSortOption;
}

interface SortableHeaderProps {
  title: string;
  sortOptions: SortOption[];
}

export const SortableHeader = ({ title, sortOptions }: SortableHeaderProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const noSortUI = sortOptions.length === 0;

  const handleSortChange = (value: UserSortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    router.replace(`?${params.toString()}`);
    setOpen(false);
  };

  if (noSortUI) {
    return (
      <Button
        variant="ghost"
        className="flex h-auto w-full cursor-pointer justify-start p-0 py-4 text-lg font-medium hover:bg-inherit hover:opacity-90"
      >
        {title}
        <div className="w-4"></div>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-auto w-full cursor-pointer justify-start p-0 py-4 text-lg font-medium hover:bg-inherit hover:opacity-90"
        >
          {title}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-56 rounded-lg bg-white p-1 shadow"
      >
        {sortOptions.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={cn(
              "hover:bg-muted w-full rounded-md px-3 py-2 text-left text-sm",
              index < sortOptions.length - 1 && "border-b border-gray-100",
            )}
          >
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
