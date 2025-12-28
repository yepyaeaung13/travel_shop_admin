"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleInputAmountChange } from "@/utils/numberFormat";
import { CreateProductPayload } from "@/types/product/product-form.schemas";
import { cn } from "@/lib/utils";

interface VisibilityInventorySectionProps {
  form: UseFormReturn<CreateProductPayload>;
}

export default function VisibilityInventorySection({
  form,
}: VisibilityInventorySectionProps) {
  const variants = form.watch("variants");

  // choose your rule:
  const isDisabled = variants?.length > 0;

  return (
    <div className={cn("space-y-6", isDisabled && "relative")}>
      {isDisabled && (
        <div
          className="absolute inset-0 z-10 rounded-lg bg-background/40 select-none"
          aria-hidden="true"
        />
      )}

      <Card className={cn(isDisabled && "opacity-40")}>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stock - Updated field name */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Stock <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isDisabled}
                    placeholder="Stock"
                    onChange={(e) =>
                      field.onChange(Number(handleInputAmountChange(e)))
                    }
                    value={field.value === 0 ? "" : field.value}
                    className="h-12 rounded-[10px] p-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku" // Add back if your API supports it
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product SKU</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isDisabled}
                    placeholder="Product SKU"
                    className="h-12 rounded-[10px] p-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}