"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
import { CreateProductPayload } from "@/types/product/product-form.schemas";
import { cn } from "@/lib/utils";

interface ProductInfoSectionProps {
  form: UseFormReturn<CreateProductPayload>;
  categories: any[];
  setSelectedCategory: (value: number) => void;
  selectedCategory: any;
}

export default function ProductInfoSection({
  form,
  categories,
  setSelectedCategory,
  selectedCategory,
}: ProductInfoSectionProps) {
  return (
    <Card id="product-info">
      <CardHeader>
        <CardTitle>Product Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Product name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Product name"
                  {...field}
                  className="h-12 rounded-[10px] p-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={() => {
            return (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <Editor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter product description..."
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value?.toString() ?? ""}
                onValueChange={(value) => {
                  if (value === "") return;
                  const n = Number(value);
                  field.onChange(n);
                  setSelectedCategory(categories.find((c) => c.id === n));
                }}
              >
                <SelectTrigger className="!h-12 w-full cursor-pointer rounded-2xl">
                  <SelectValue placeholder="Main category" />
                </SelectTrigger>

                <SelectContent position={"popper"}>
                  <SelectGroup>
                    {categories.map((cat, index) => (
                      <SelectItem
                        key={index}
                        value={cat?.id?.toString() ?? ""}
                        className="cursor-pointer"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sub Category <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value?.toString() ?? ""}
                onValueChange={(value) => {
                  if (value === "") return;
                  const n = Number(value);
                  field.onChange(n);
                  setSelectedCategory(n);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "!h-12 w-full cursor-pointer rounded-2xl",
                    selectedCategory &&
                      selectedCategory?.subCategories.length > 0
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

              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
