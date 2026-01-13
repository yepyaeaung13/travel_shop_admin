import { Button } from "@/components/ui/button";
import { ChevronLeft, CopyIcon } from "lucide-react";
import React from "react";

export default function ProductHeader({
  isEdit = false,
  title = "Add new product",
  handleDuplicate,
}: {
  isEdit?: boolean;
  title?: string;
  handleDuplicate?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Button asChild variant="ghost" className="flex items-center">
          <a href="/product" className="flex items-center text-xl font-medium">
            <ChevronLeft className="size-6" /> {title}
          </a>
        </Button>
        {isEdit && (
          <Button type="button" variant="ghost" onClick={handleDuplicate}>
            <CopyIcon /> Duplicate
          </Button>
        )}
      </div>
    </div>
  );
}
