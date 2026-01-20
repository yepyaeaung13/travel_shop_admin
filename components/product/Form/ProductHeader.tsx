import { Button } from "@/components/ui/button";
import { ChevronLeft, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProductHeader({
  title = "Add new product",
}: {
  title?: string;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between">
      <div>
        <Button onClick={() => router.back()} asChild variant="ghost" className="flex items-center">
          <p className="flex items-center text-xl font-medium">
            <ChevronLeft className="size-6" /> {title}
          </p>
        </Button>
      </div>
    </div>
  );
}
