"use client";

import React, {useCallback, useState} from "react";
import {useForm, UseFormReturn, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useGetCategories} from "@/queries/category";
import {CreateProductPayload, CreateProductSchema} from "@/types/product/product-form.schemas";
import {CategoryVariantGroup} from "@/types/categories";
import {productDefaultValues} from "@/utils/productDefaults";
import {ProductSortOption} from "@/types/product";

export function useProductForm(initialValues?: Partial<any>) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const form = useForm({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {...productDefaultValues, ...initialValues},
    mode: "onSubmit",
  });

  // --- Updated Watchers for new flat structure ---
  const promoteType = useWatch({
    control: form.control,
    name: "promoteType",
  });

  // Default to "PERCENTAGE" if not set
  const localDiscountType = promoteType ?? "PERCENTAGE";
  const discountEnabled = !!promoteType; // If promoteType exists, discount is enabled
  const isPercentage = localDiscountType === "PERCENTAGE";

  // --- Category Data logic (unchanged) ---
  const {data: rawCategories, isLoading: categoryLoading} = useGetCategories({
    sort: ProductSortOption.NEWEST,
    page: 1,
    limit: 10
  });

  const categories = React.useMemo(() =>
      rawCategories?.data.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],
    [rawCategories]);

  const categoryVariantGroups: CategoryVariantGroup[] = React.useMemo(() => {
    if (!rawCategories?.data || !selectedCategoryId) return [];
    return rawCategories.data
                        .filter((c) => c.id === selectedCategoryId)
                        .map((c) => c.variations).flat();
  }, [rawCategories, selectedCategoryId]);

  const handleCategoryChange = useCallback((id: number | null) => {
    setSelectedCategoryId(id);
    // Optional: Clear variant groups or reset related fields when category changes
    // form.setValue("variants", []);
  }, [form]);

  return {
    form: form as UseFormReturn<CreateProductPayload>,
    categories,
    categoryVariantGroups,
    categoryLoading,
    setSelectedCategoryId: handleCategoryChange,
    discount: {
      enabled: discountEnabled,
      type: localDiscountType,
      isPercentage,
    },
  };
}