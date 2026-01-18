"use client";

import { SortOptionValue } from "@/components/Category/CategoryTable";
import { useGetCategories } from "@/queries/category.queries";
import React, { useState } from "react";

export function useProductForm() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

  // --- Category Data logic (unchanged) ---
  const { data: rawCategories, isLoading: categoryLoading } = useGetCategories({
    sortBy: SortOptionValue.NEWEST,
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
