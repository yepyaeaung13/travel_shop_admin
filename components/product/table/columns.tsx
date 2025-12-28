import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";
import { ProductSortOption, type Product } from "@/types/product";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {SortableHeader} from "@/components/common/sortable-header";

export const ProductTableColumns = (
    onDeleteProduct?: (ids: number[],name:string) => void,
): ColumnDef<Product>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                className="border-[#303030] data-[state=checked]:!bg-[#3C3C3C]"
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                className="border-[#303030] data-[state=checked]:!bg-[#3C3C3C]"
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: () => (
            <SortableHeader
                title="Product"
                sortOptions={[
                    { label: "Name (A → Z)", value: ProductSortOption.NAME_ASC },
                    { label: "Name (Z → A)", value: ProductSortOption.NAME_DESC },
                ]}
            />
        ),
        cell: ({ row }) => (
            <div className="px-4 font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "category",
        accessorFn: (row) => row.mainCategory?.name ?? "-",
        header: () => (
            <SortableHeader
                title="Category"
                sortOptions={[
                    { label: "Category (A → Z)", value: ProductSortOption.CATEGORY_ASC },
                    { label: "Category (Z → A)", value: ProductSortOption.CATEGORY_DESC },
                ]}
            />
        ),
        cell: ({ row }) => <div className="px-4">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "sellingPrice",
        header: () => (
            <SortableHeader
                title="Selling price"
                sortOptions={[
                    {
                        label: "Price (Low → High)",
                        value: ProductSortOption.PRICE_LOW_HIGH,
                    },
                    {
                        label: "Price (High → Low)",
                        value: ProductSortOption.PRICE_HIGH_LOW,
                    },
                ]}
            />
        ),
        cell: ({ row }) => (
            <div className="px-4">{row.getValue("sellingPrice")} Ks</div>
        ),
    },
    {
        accessorKey: "quantity",
        header: () => (
            <SortableHeader
                title="Stock"
                sortOptions={[
                    {
                        label: "Quantity (Low → High)",
                        value: ProductSortOption.QUANTITY_LOW_HIGH,
                    },
                    {
                        label: "Quantity (High → Low)",
                        value: ProductSortOption.QUANTITY_HIGH_LOW,
                    },
                ]}
            />
        ),
        cell: ({ row }) => <div className="px-4">{row.getValue("quantity")}</div>,
    },
    {
        accessorKey: "status",
        header: () => (
            <SortableHeader
                title="Status"
                sortOptions={[
                    { label: "Status (A → Z)", value: ProductSortOption.STATUS_ASC },
                    { label: "Status (Z → A)", value: ProductSortOption.STATUS_DESC },
                ]}
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="px-4">
                    <h2
                        className={cn(
                            "w-fit rounded-full bg-[#FFFAA3] px-4 py-1 text-sm text-[#827C00]",
                            {
                                "bg-[#E4FFDF] text-[#126D00]":
                                    row.getValue("status") === "PUBLISH",
                            },
                        )}
                    >
                        {row.getValue("status") === "PUBLISH"
                            ? "Published"
                            : row.getValue("status") === "DRAFT"
                                ? "Draft"
                                : row.getValue("status")}
                    </h2>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="!bg-muted-foreground/10 hover:!bg-muted-forground size-7 cursor-pointer rounded-full p-1.5 text-[#616FF5] hover:text-[#616FF5]"
                    >
                        <Link href={`/products/edit/${product.id}`}>
                            <Edit />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="!bg-muted-foreground/10 hover:!bg-muted-forground size-7 cursor-pointer rounded-full p-1.5 text-[#FF3333] hover:text-[#FF3333]"
                        onClick={() => {
                            toast.info("Product deleted successfully !!");
                            onDeleteProduct?.([product.id],'delete');
                        }}
                    >
                        <Trash2 />
                    </Button>
                </div>
            );
        },
    },
];

// const SortableHeaderV1 = ({
//   title,
//   column,
// }: {
//   title: string;
//   column: any;
// }) => (
//   <Button
//     variant="ghost"
//     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//     className="h-auto p-0 font-medium"
//   >
//     {title}
//     <ArrowUpDown className="ml-2 h-4 w-4" />
//   </Button>
// );
