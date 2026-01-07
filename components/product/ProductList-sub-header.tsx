"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Search, Trash2Icon} from "lucide-react";

interface ProductListFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    hasSomeSelectedRows: boolean;
    handleDeleteProducts: () => void;
}

const ProductListSubHeader = ({
                               searchQuery,
                               hasSomeSelectedRows,
                               onSearchChange,
                               handleDeleteProducts,
                           }: ProductListFiltersProps) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <h1 className="scroll-m-20 text-xl font-medium tracking-tight">
                    All Products
                </h1>
                {hasSomeSelectedRows && (
                    <Button
                        variant="destructive"
                        className="rounded-[10px] bg-[#FFDCDC] text-[#FF3333] hover:bg-[#FFB4B4] hover:text-[#FF3333]"
                        onClick={handleDeleteProducts}
                    >
                        Delete
                        <Trash2Icon className="h-4 w-4"/>
                    </Button>
                )}
            </div>

            {!hasSomeSelectedRows && (
                <div className="relative w-64">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"/>
                    <Input
                        placeholder="Search product"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="rounded-3xl pl-10"
                    />
                </div>
            )}
        </div>
    );
};

export default ProductListSubHeader;
