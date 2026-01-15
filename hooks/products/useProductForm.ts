"use client";

import React, { useCallback, useState } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetCategories } from "@/queries/category";
import {
  CreateProductPayload,
  CreateProductSchema,
} from "@/types/product/product-form.schemas";
import { ProductSortOption } from "@/types/product";

export function useProductForm() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

  // --- Category Data logic (unchanged) ---
  const { data: rawCategories, isLoading: categoryLoading } = useGetCategories({
    sort: ProductSortOption.NEWEST,
    page: 1,
    limit: 10,
  });

  return {
    categories: rawCategories?.data || [],
    categoryVariantGroups: [],
    categoryLoading,
    setSelectedCategory,
    selectedCategory,
    setSelectedSubCategory,
    selectedSubCategory,
  };
}
