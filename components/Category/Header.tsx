import React from "react";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import SortByButton from "../SortByButton";

interface CategoryHeaderProps {
  handleAddCategory: () => void;
}

export default function CategoryHeader({
  handleAddCategory,
}: CategoryHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-2 md:pb-4">
      <h1 className="hidden text-base font-semibold md:inline-block lg:text-2xl">
        Product Category List
      </h1>
      <div className="flex items-center gap-2">
        <SortByButton />
        <Button
          size="sm"
          className="rounded-full !p-5 !py-[18px]"
          onClick={handleAddCategory}
        >
          <CirclePlusIcon className="h-6 w-6" /> Add category
        </Button>
      </div>
    </div>
  );
}
