import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IconTrash from "@/assets/icons/Trash";
import Link from "next/link";
import { ArrowUpDown, ArrowUpIcon } from "lucide-react";
import { useMemo } from "react";
import { useQueryParams } from "@/hooks/use-query-params";
import EditIcon2 from "@/assets/icons/EditIcon2";
import Image from "next/image";
import dayjs from "dayjs";
import { Product } from "@/types/product.types";

export enum SortOptionValue {
  NEWEST = "newest",
  OLDEST = "oldest",
  NAME_ASC = "nameAsc",
  NAME_DESC = "nameDesc",
  CATEGORY_ASC = "catAsc",
  CATEGORY_DESC = "catDesc",
  STATUS_ASC = "statusAsc",
  STATUS_DESC = "statusDesc",
}

export const nameSortOptions = [
  { label: "A-Z", value: SortOptionValue.NAME_ASC },
  { label: "Z-A", value: SortOptionValue.NAME_DESC },
];

export const statusSortOptions = [
  { label: "A-Z", value: SortOptionValue.STATUS_ASC },
  { label: "Z-A", value: SortOptionValue.STATUS_DESC },
];

export const categorySortOptions = [
  { label: "A-Z", value: SortOptionValue.CATEGORY_ASC },
  { label: "Z-A", value: SortOptionValue.CATEGORY_DESC },
];

type Props = {
  products: Product[];
  selectProduct: number[];
  handleSelectProduct: (id: number) => void;
  handleSetDeleteProduct: (id: number) => void;
  handleSetChangeProduct: (product: Product) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  handleSelectAll: (checked: boolean | "indeterminate") => void;
};

export default function ProductTable({
  products,
  selectProduct,
  handleSelectProduct,
  handleSetDeleteProduct,
  handleSetChangeProduct,
  isAllSelected,
  isIndeterminate,
  handleSelectAll,
}: Props) {
  const { setParam, getParam, deleteParam } = useQueryParams();

  const handleSortNameChange = () => {
    if (getParam("sortBy") === SortOptionValue.NAME_DESC) {
      deleteParam("sortBy");
    } else if (getParam("sortBy") === SortOptionValue.NAME_ASC) {
      setParam("sortBy", SortOptionValue.NAME_DESC);
    } else {
      setParam("sortBy", SortOptionValue.NAME_ASC);
    }
  };

  const handleSortStatusChange = () => {
    if (getParam("sortBy") === SortOptionValue.STATUS_DESC) {
      deleteParam("sortBy");
    } else if (getParam("sortBy") === SortOptionValue.STATUS_ASC) {
      setParam("sortBy", SortOptionValue.STATUS_DESC);
    } else {
      setParam("sortBy", SortOptionValue.STATUS_ASC);
    }
  };

  const isNameFilterUsed = useMemo(
    () => nameSortOptions.some((option) => option.value === getParam("sortBy")),
    [nameSortOptions, getParam],
  );

  const isStatusFilterUsed = useMemo(
    () =>
      statusSortOptions.some((option) => option.value === getParam("sortBy")),
    [statusSortOptions, getParam],
  );

  const calculateOriginalPrice = (product: any) => {
    return product.variants.length > 0
      ? Number(product.variants[0].sellingPrice)
      : Number(product.sellingPriceMMK);
  };

  const calculatePromotePrice = (product: any) => {
    const originalPrice = calculateOriginalPrice(product);

    if (product.promoteValue == 0) {
      return originalPrice;
    } else {
      if (product?.promoteType == "PERCENTAGE") {
        return originalPrice - (originalPrice * product.promoteValue) / 100;
      } else {
        return originalPrice - product.promoteValue;
      }
    }
  };

  return (
    <Table className="table-fixed md:table-auto">
      <TableHeader className="bg-[#4444441A]">
        <TableRow className="md:text-lg">
          <TableHead className="w-10 pl-5 md:w-10 md:pl-6 text-base md:text-lg py-2 md:py-4">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll as (checked: boolean) => void}
              className="h-5 w-5 rounded-[5px] border-[#444444]"
              // Pass the indeterminate state via the `data-state` attribute for shadcn/ui
              data-state={
                isIndeterminate
                  ? "indeterminate"
                  : isAllSelected
                    ? "checked"
                    : "unchecked"
              }
            />
          </TableHead>

          {/* SORTABLE: Category Name */}
          <TableHead
            className={cn(
              "w-[150px] cursor-pointer md:w-72 2xl:w-96 text-base md:text-lg py-2 md:py-4",
            )}
            onClick={handleSortNameChange}
          >
            Product
          </TableHead>

          <TableHead className="w-[100px] text-base md:text-lg py-2 md:py-4">
            Category
          </TableHead>
          <TableHead className="w-[100px] text-base md:text-lg py-2 md:py-4">
            Stock
          </TableHead>
          <TableHead className="w-[100px] text-base md:text-lg py-2 md:py-4">
            Price
          </TableHead>

          {/* SORTABLE: Status */}
          <TableHead
            className={cn(
              "w-[200px] cursor-pointer text-center text-base md:text-lg py-2 md:py-4",
            )}
            onClick={handleSortStatusChange}
          >
            <span
              className={cn(
                "hover:text-primary flex h-auto items-center justify-center font-medium",
                {
                  "text-primary": isStatusFilterUsed,
                },
              )}
            >
              Status
              {!isStatusFilterUsed ? (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpIcon
                  className={cn("ml-2 h-4 w-4", {
                    "rotate-180":
                      statusSortOptions.at(0)?.value ===
                      (getParam("sortBy") as SortOptionValue),
                  })}
                />
              )}
            </span>
          </TableHead>

          <TableHead className="w-[100px] text-center text-base md:text-lg py-2 md:py-4">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-0">
        {products.length > 0 &&
          products.map((product: any) => {
            return (
              <TableRow key={product.id} className="border-none md:text-lg">
                <TableCell className="pl-5 md:pl-6">
                  <Checkbox
                    checked={selectProduct.includes(product.id)}
                    onCheckedChange={() => handleSelectProduct(product.id)}
                    className="h-5 w-5 rounded-[5px] border-[#444444]"
                  />
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="max-sm:pl-2 flex items-center gap-5 h-[50px]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${product.imageUrl}`}
                      loading="lazy"
                      width={50}
                      height={50}
                      alt="product photo"
                      className="w-[50px] h-[50px] object-cover rounded-lg"
                    />
                    <p className="text-wrap line-clamp-2 break-all md:text-lg">
                      {product.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="">
                    {product.subCategory?.name ?? product.mainCategory?.name}
                  </p>
                </TableCell>
                <TableCell className="">
                  {product.variants.length > 0
                    ? product.variants.reduce(
                        (pv: number, cv: any) => pv + cv.stock,
                        0,
                      )
                    : product.stock}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center">
                    {product?.promoteValue != 0 && (
                      <p className="text-sm text-[#929292] line-through">
                        {calculateOriginalPrice(product)?.toLocaleString()} ks
                      </p>
                    )}
                    <p>{calculatePromotePrice(product)?.toLocaleString()} ks</p>
                  </div>
                </TableCell>
                <TableCell>
                  {(() => {
                    const totalStock =
                      product.variants.length > 0
                        ? product.variants.reduce(
                            (pv: number, cv: any) => pv + cv.stock,
                            0,
                          )
                        : product.stock;

                    if (totalStock === 0) {
                      return (
                        <div className="flex justify-center">
                          <span className="inline-flex w-[128px] h-9 justify-center rounded-[10px] items-center bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                            Out of stock
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div className="flex justify-center">
                        <Select
                          value={product?.status}
                          onValueChange={(value) => {
                            if (value === product.status) return;
                            handleSetChangeProduct(product);
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-[128px] justify-center rounded-[10px] text-sm px-0 focus-visible:ring-0",
                              product?.status === "active"
                                ? "*:data-[slot=select-value]:text-[#97BD3F] border-[#97BD3F]"
                                : "*:data-[slot=select-value]:text-[#444444] border-border",
                            )}
                          >
                            <SelectValue placeholder="Publish" />
                          </SelectTrigger>

                          <SelectContent
                            position="popper"
                            className="min-w-[128px] rounded-[10px] p-0 bg-white border-border"
                          >
                            <SelectItem
                              value="active"
                              className="*:[span]:hidden rounded-none border-b border-border p-3 last:border-b-0 cursor-pointer"
                            >
                              Published
                            </SelectItem>
                            <SelectItem
                              value="inactive"
                              className="*:[span]:hidden border-b border-border p-3 last:border-b-0 cursor-pointer"
                            >
                              Unpublished
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <div className="flex h-full items-center justify-center gap-5">
                    <Link href={`/product/${product.id}`} passHref>
                      <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#44444414]">
                        <EditIcon2 />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        handleSetDeleteProduct(product.id);
                      }}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#44444414]"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
