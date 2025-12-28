"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import SortByButton from "@/components/common/SortByButton";

export default function ProductListHeader() {
    return (
        <div className="flex items-center justify-end pb-4 md:justify-between">
            <h1 className="hidden text-2xl font-semibold md:inline-block">
                Product List
            </h1>
            <div className="flex items-center gap-2">
                <SortByButton />
                <Button size="sm" asChild className="rounded-full !p-5 !py-[18px]">
                    <Link href="/product/create">
                        <CirclePlusIcon className="h-6 w-6" /> Add Product
                    </Link>
                </Button>
            </div>
        </div>
    );
}
