"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { handleInputAmountChange } from "@/utils/numberFormat";
import React, { useCallback } from "react";
import { CreateProductPayload } from "@/types/product/product-form.schemas";
import {discountType} from "@/types/product";

export function usePricingHandlers() {
  const { control, setValue } = useFormContext<CreateProductPayload>();

  // Watch promoteType for discount logic
  const promoteType = useWatch({ control, name: "promoteType" });
  const isPercentage = (promoteType ?? "PERCENTAGE") === "PERCENTAGE";

  // MMK Handlers
  const handleBuyingPriceMMKChange = useCallback((value: number) => {
    setValue("buyingPriceMMK", Number(value) || 0, { shouldValidate: true });
  }, [setValue]);

  const handleSellingPriceMMKChange = useCallback((value: number) => {
    setValue("sellingPriceMMK", Number(value) || 0, { shouldValidate: true });
  }, [setValue]);

  // USD Handler
  const handleSellingPriceUSDChange = useCallback((value: number) => {
    setValue("sellingPriceUSD", Number(value) || 0, { shouldValidate: true });
  }, [setValue]);

  // CNY Handler
  const handleSellingPriceCNYChange = useCallback((value: number) => {
    setValue("sellingPriceCNY", Number(value) || 0, { shouldValidate: true });
  }, [setValue]);

  // Discount handlers
  const handleDiscountValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const limit = isPercentage ? 2 : 10;
    const value = handleInputAmountChange(event, limit);
    setValue("promoteValue", Number(value) || 0, { shouldValidate: true });
  }, [setValue, isPercentage]);

  const handleDiscountToggle = useCallback((enabled: boolean) => {
    if (enabled) {
      setValue("promoteType", "PERCENTAGE" as discountType);
      setValue("promoteValue", 0);
    } else {
      setValue("promoteType", undefined);
      setValue("promoteValue", 0);
    }
  }, [setValue]);

  const handleDiscountTypeChange = useCallback((type: discountType) => {
    setValue("promoteType", type );
    setValue("promoteValue", 0);
  }, [setValue]);

  return {
    handlers: {
      // MMK handlers
      handleBuyingPriceMMKChange,
      handleSellingPriceMMKChange,

      // Other currency handlers
      handleSellingPriceUSDChange,
      handleSellingPriceCNYChange,

      // Discount handlers
      handleDiscountValueChange,
      handleDiscountToggle,
      handleDiscountTypeChange,
    },
  };
}