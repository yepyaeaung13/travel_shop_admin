"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React from "react";
import {UseFormReturn, Path} from "react-hook-form";
import {CreateProductPayload} from "@/types/product/product-form.schemas";
import {cn} from "@/lib/utils";

// ✅ Price fields union type - ONLY price fields allowed!
type PriceFieldName =
  | "buyingPriceMMK"
  | "sellingPriceMMK"
  | "sellingPriceUSD"
  | "sellingPriceCNY";

interface PriceFieldProps {
  form: UseFormReturn<CreateProductPayload>;
  name: PriceFieldName; // ✅ Only price fields allowed!
  label: string;
  placeholder: string;
  isRequired?: boolean;
  unit?: string;
  onChange?: (value: number) => void;
  onBlur?: () => void;
}

export function PriceField({
  form,
  name,
  label,
  placeholder,
  isRequired,
  unit = 'Ks',
  onChange,
  onBlur
}: PriceFieldProps) {
  return (
    <FormField<CreateProductPayload>
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem>
          <FormLabel>
            {label} {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder={placeholder}
                className="h-12 rounded-[10px] p-4 pr-12"
                {...field}
                // @ts-expect-error Error is expected cause name type is include string type and other fields apart from price field !! YOU SHOULD ONLY USE price field for this components
                value={typeof field.value === "number" ? (field.value) : field.value ?? ""}
                onChange={(e) => {
                  // ✅ Numbers only!
                  const rawValue = e.target.value;
                  const numericValue = rawValue.replace(/[^0-9.]/g, '');

                  // Prevent multiple decimals
                  const parts = numericValue.split('.');
                  const validValue = parts.length > 2
                    ? parts[0] + '.' + parts.slice(1).join('')
                    : numericValue;

                  field.onChange(validValue);
                  onChange?.(parseFloat(validValue) || 0);
                }}
                onBlur={(e) => {
                  field.onBlur();
                  const numValue = parseFloat(e.target.value) || 0;
                  field.onChange(numValue);
                  onBlur?.();
                }}
              />
              <span
                className={cn(["absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 text-sm font-medium", {"text-primary text-lg": unit !== "Ks"}])}>
                {unit}
              </span>
            </div>
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
}