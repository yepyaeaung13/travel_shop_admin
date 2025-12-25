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
import { CategoryResponse } from "@/types/category.types";
import Link from "next/link";
import { ArrowUpDown, ArrowUpIcon } from "lucide-react";
import { useMemo } from "react";
import { useQueryParams } from "@/hooks/use-query-params";
import EditIcon2 from "@/assets/icons/EditIcon2";
import Image from "next/image";
import dayjs from "dayjs";

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

type CategoryTableProps = {
  categories: CategoryResponse[];
  selectCategory: number[];
  handleSelectCategory: (id: number) => void;
  handleSetDeleteCategory: (id: number) => void;
  handleSetChangeCategory: (product: CategoryResponse) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  handleSelectAll: (checked: boolean | "indeterminate") => void;
};

export default function CategoryTable({
  categories,
  selectCategory,
  handleSelectCategory,
  handleSetDeleteCategory,
  handleSetChangeCategory,
  isAllSelected,
  isIndeterminate,
  handleSelectAll,
}: CategoryTableProps) {
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
    [nameSortOptions, getParam]
  );

  const isStatusFilterUsed = useMemo(
    () =>
      statusSortOptions.some((option) => option.value === getParam("sortBy")),
    [statusSortOptions, getParam]
  );
  return (
    <Table className="table-fixed md:table-auto">
      <TableHeader className="bg-[#4444441A]">
        <TableRow className="md:text-lg">
          <TableHead className="w-10 pl-5 md:w-16 md:pl-6">
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
            className={cn("w-[150px] cursor-pointer md:w-72 2xl:w-96")}
            onClick={handleSortNameChange}
          >
            <span
              className={cn(
                "hover:text-primary flex h-auto items-center font-medium",
                {
                  "text-primary": isNameFilterUsed,
                }
              )}
            >
              Category Name
              {!isNameFilterUsed ? (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpIcon
                  className={cn("ml-2 h-4 w-4", {
                    "rotate-180":
                      nameSortOptions.at(0)?.value ===
                      (getParam("sortBy") as SortOptionValue),
                  })}
                />
              )}
            </span>
          </TableHead>

          <TableHead className="w-[100px] text-center">Sub Category</TableHead>
          <TableHead className="w-[150px] text-center">Date & time</TableHead>

          {/* SORTABLE: Status */}
          <TableHead
            className={cn("w-[200px] cursor-pointer text-center")}
            onClick={handleSortStatusChange}
          >
            <span
              className={cn(
                "hover:text-primary flex h-auto items-center justify-center font-medium",
                {
                  "text-primary": isStatusFilterUsed,
                }
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

          <TableHead className="w-[100px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-0">
        {categories.length > 0 &&
          categories.map((category: any) => {
            return (
              <TableRow key={category.id} className="border-none md:text-lg">
                <TableCell className="pl-5 md:pl-6">
                  <Checkbox
                    checked={selectCategory.includes(category.id)}
                    onCheckedChange={() => handleSelectCategory(category.id)}
                    className="h-5 w-5 rounded-[5px] border-[#444444]"
                  />
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="max-sm:pl-2 flex items-center gap-5 h-[50px]">
                    <Image src={category.image} loading="lazy" width={50} height={50} alt="category photo" />
                    <p className="text-wrap line-clamp-2 break-all md:text-lg">
                      {category.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-center">
                    {category.subCategories > 0
                      ? category.subCategories
                      : "None"}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  {dayjs(category.createdAt).format("MMM DD YYYY [at] hh:mm A")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Select
                      value={
                        category?.status
                      }
                      onValueChange={(value) => {
                        if (value === category.status) return;
                        handleSetChangeCategory(category);
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[128px] justify-center rounded-[10px] px-0 focus-visible:ring-0",
                          category?.status === "active"
                            ? "*:data-[slot=select-value]:text-[#97BD3F] border-[#97BD3F]"
                            : "*:data-[slot=select-value]:text-[#444444] border-border"
                        )}
                      >
                        <SelectValue placeholder="Publish" />
                      </SelectTrigger>

                      <SelectContent className="min-w-[128px] rounded-[10px] p-0 bg-white border-border">
                        <SelectItem
                          value="active"
                          className="*:[span]:hidden rounded-none border-b border-border p-3 last:border-b-0 cursor-pointer"
                        >
                          Publish
                        </SelectItem>
                        <SelectItem
                          value="inactive"
                          className="*:[span]:hidden border-b border-border p-3 last:border-b-0 cursor-pointer"
                        >
                          Unpublish
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex h-full items-center justify-center gap-5">
                    <Link href={`/category/${category.id}`} passHref>
                      <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#44444414]">
                        <EditIcon2 />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        handleSetDeleteCategory(category.id);
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
