"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {UseFormReturn} from "react-hook-form";
import {CreateProductPayload} from "@/types/product/product-form.schemas";

interface DiscountValueFieldProps {
  form: UseFormReturn<CreateProductPayload>;
  discount: {
    enabled: boolean;
    type: string;
    isPercentage: boolean;
  };
}

export function DiscountValueField({
  form,
  discount
}: DiscountValueFieldProps) {
  return (
    <FormField
      control={form.control}
      name='promoteValue'
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Input
                type="number"
                placeholder={discount.isPercentage ? "Enter percentage" : "Enter amount"}
                onChange={e => {
                  field.onChange(Number(e.target.value))
                }}
                className="h-12 rounded-[10px] p-4 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 text-sm font-medium">
                {discount.isPercentage ? "%" : "Ks"}
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}