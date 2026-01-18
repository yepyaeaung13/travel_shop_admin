import { Button } from "@/components/ui/button";
import { ChevronLeft, CopyIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductHeader({
  title = "Add new product",
}: {
  title?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Button asChild variant="ghost" className="flex items-center">
          <Link href="/product" className="flex items-center text-xl font-medium">
            <ChevronLeft className="size-6" /> {title}
          </Link>
        </Button>
      </div>
    </div>
  );
}
