"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "./rich-editor";
import { SelectGroup } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { CreateProductState } from "@/store/useProductStore";

interface ProductInfoSectionProps {
  name: string;
  description: string | null;
  categories: any[];
  setSelectedCategory: (value: number) => void;
  selectedCategory: any;
  setSelectedSubCategory: (value: number) => void;
  selectedSubCategory: any;
  setField: <K extends keyof CreateProductState>(
    key: K,
    value: CreateProductState[K]
  ) => void;
}

export default function ProductInfoSection({
  name,
  description,
  categories,
  setSelectedCategory,
  selectedCategory,
  setSelectedSubCategory,
  selectedSubCategory,
  setField
}: ProductInfoSectionProps) {
 
  return (
    <Card id="product-info" className="gap-2">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-medium">Product Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Name */}
        <div className="flex flex-col gap-2">
          <label className="text-base md:text-lg font-normal text-[#303030]">
            Product name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Product name"
            value={name}
            onChange={(e) => setField("name", e.target.value)}
            className="h-12 md:h-14 rounded-[10px] p-4 placeholder:text-base text-base"
            required
            maxLength={60}
          />
          {name.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {name.length}/60 characters
            </span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-base md:text-lg font-normal text-[#303030]">
            Description
          </label>
          <Editor
            value={description || ""}
            onChange={(value) => {
              if (value.length <= 1000) {
                setField("description", value);
              }
            }}
            placeholder="Enter product description..."
          />
          {description && description.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {description.length}/1000 characters
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base md:text-lg font-normal text-[#303030]">
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedCategory?.id?.toString()}
            onValueChange={(value) => {
              if (value === "") return;
              const n = Number(value);
              setSelectedCategory(categories.find((c) => c.id === n));
              setField("mainCategoryId", n);
            }}
            required
          >
            <SelectTrigger className="!h-12 md:!h-14 w-full cursor-pointer rounded-2xl text-black md:text-base">
              <SelectValue placeholder="Main category" />
            </SelectTrigger>

            <SelectContent position={"popper"}>
              <SelectGroup>
                {categories.map((cat, index) => (
                  <SelectItem
                    key={index}
                    value={cat?.id?.toString() ?? ""}
                    className="cursor-pointer text-black"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base md:text-lg font-normal text-[#303030]">
            Sub Category
          </label>
          <Select
            value={selectedSubCategory?.id?.toString()}
            onValueChange={(value) => {
              if (value === "") return;
              const n = Number(value);
              setSelectedSubCategory(selectedCategory.subCategories.find((c: any) => c.id === n));
              setField("subCategoryId", n);
            }}
            required={selectedCategory?.subCategories.length > 0}
          >
            <SelectTrigger
              className={cn(
                "!h-12 md:text-base md:!h-14 w-full cursor-pointer rounded-2xl",
                selectedCategory && selectedCategory?.subCategories.length > 0
                  ? ""
                  : "cursor-not-allowed pointer-events-none"
              )}
            >
              <SelectValue placeholder="Sub category" />
            </SelectTrigger>

            <SelectContent position={"popper"}>
              <SelectGroup>
                {selectedCategory?.subCategories &&
                  selectedCategory?.subCategories.map((sub: any) => (
                    <SelectItem
                      key={sub.id}
                      value={sub?.id?.toString() ?? ""}
                      className="cursor-pointer"
                    >
                      {sub.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
