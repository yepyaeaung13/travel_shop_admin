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
  console.log("select", selectedCategory)
  return (
    <Card id="product-info">
      <CardHeader>
        <CardTitle>Product Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Name */}
        <div>
          <label>
            Product name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Product name"
            value={name}
            onChange={(e) => setField("name", e.target.value)}
            className="h-12 rounded-[10px] p-4"
          />
        </div>

        {/* Description */}
        <div>
          <label>
            Description <span className="text-red-500">*</span>
          </label>
          <Editor
            value={description || ""}
            onChange={(value) => setField("description", value)}
            placeholder="Enter product description..."
          />
        </div>

        <div>
          <label>
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedCategory?.id?.toString()}
            onValueChange={(value) => {
              if (value === "") return;
              const n = Number(value);
              setSelectedCategory(categories.find((c) => c.id === n));
            }}
          >
            <SelectTrigger className="!h-12 w-full cursor-pointer rounded-2xl text-black">
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

        <div>
          <label>
            Sub Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedSubCategory?.id?.toString()}
            onValueChange={(value) => {
              if (value === "") return;
              const n = Number(value);
              setSelectedSubCategory(selectedCategory.subCategories.find((c: any) => c.id === n));
            }}
          >
            <SelectTrigger
              className={cn(
                "!h-12 w-full cursor-pointer rounded-2xl",
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
