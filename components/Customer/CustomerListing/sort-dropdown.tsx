"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserSortOption } from "@/types/users.types";
import { SortDescIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const sortOptions = [
  { value: UserSortOption.NAME_ASC, label: "A to Z" },
  { value: UserSortOption.NAME_DESC, label: "Z to A" },
  { value: UserSortOption.NEWEST, label: "Newest first" },
  { value: UserSortOption.OLDEST, label: "Oldest first" },
];

export function   SortDropdown() {
  const [selectedSort, setSelectedSort] = useState(UserSortOption.NAME_ASC);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortSelect = (value: UserSortOption) => {
    setSelectedSort(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    router.replace(`?${params.toString()}`);
  };

  const selectedLabel =
    sortOptions.find((option) => option.value === selectedSort)?.label ||
    "A to Z";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-auto cursor-pointer rounded-full bg-[#E4E6FF] dark:bg-gray-900 text-[#303030] dark:text-white text-lg px-4 py-2 font-medium"
        >
          <SortDescIcon className="mt-1 size-5 scale-x-[-1]" />
          Sort by: {selectedLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 border bg-white dark:bg-gray-700 shadow-lg p-0 rounded-[10px]"
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            className={`cursor-pointer px-3 py-2 text-sm text-[#303030] dark:text-white ${
              selectedSort === option.value
                ? "bg-[#E4E6FF] dark:bg-gray-700 font-medium"
                : "hover:bg-[#E4E6FF] hover:dark:bg-gray-800"
            }`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
