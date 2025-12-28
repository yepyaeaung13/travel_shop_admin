"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useWatch, type UseFormReturn, type Path } from "react-hook-form";

import {
  VariantCombination,
  VariantOption,
  VariantValue,
} from "@/types/product";
import { CreateProductPayload } from "@/types/product/product-form.schemas";
import { CategoryVariantGroup } from "@/types/categories";

interface Props {
  form: UseFormReturn<CreateProductPayload>;
  categoryVariantGroups: CategoryVariantGroup[];
}

export function useVariantsLogic({ form, categoryVariantGroups }: Props) {
  const { control, setValue, getValues, formState: { errors } } = form;

  // --- 1. STATE MANAGEMENT ---
  const [localOptions, setLocalOptions] = useState<VariantOption[]>(() =>
    categoryVariantGroups.map((g) => ({ id: g.id, name: g.name, values: [] }))
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Tracks for synchronous render-time sync
  const [prevGroups, setPrevGroups] = useState(categoryVariantGroups);
  const [prevOptions, setPrevOptions] = useState(localOptions);

  // --- 2. SYNCHRONOUS SYNC (Avoids ESLint Error) ---

  // Sync if Category Groups change (Reset everything)
  if (categoryVariantGroups !== prevGroups) {
    setPrevGroups(categoryVariantGroups);
    setLocalOptions(
      categoryVariantGroups.map((g) => ({ id: g.id, name: g.name, values: [] }))
    );
    setIsGenerating(false);
  }

  // Sync Loading State if Options change (Start Loading)
  // This detects changes during render and updates state before paint
  if (localOptions !== prevOptions) {
    setPrevOptions(localOptions);
    const hasValues = localOptions.length > 0 && localOptions.every((o) => o.values.length > 0);
    if (hasValues) {
      setIsGenerating(true);
    } else {
      // If user deleted a tag and broke the requirement, stop loading immediately
      setIsGenerating(false);
    }
  }

  const watchedVariants = useWatch({ control, name: "variants" });
  const variants = useMemo(
    () => (watchedVariants || []) as VariantCombination[],
    [watchedVariants]
  );

  /* ------------------------- Tag Logic ------------------------- */

  const addVariantValue = useCallback((groupId: number, valueName: string) => {
    const trimmed = valueName.trim().replace(/,/g, "");
    if (!trimmed) return;

    setLocalOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === groupId) {
          if (opt.values.some((v) => v.value.toLowerCase() === trimmed.toLowerCase())) {
            return opt;
          }
          const newValue: VariantValue = {
            id: Date.now().toString(),
            value: trimmed,
          };
          return { ...opt, values: [...opt.values, newValue] };
        }
        return opt;
      })
    );
  }, []);

  const removeVariantValue = useCallback((groupId: number, valueId: string) => {
    setLocalOptions((prev) =>
      prev.map((opt) =>
        opt.id === groupId
          ? { ...opt, values: opt.values.filter((v) => v.id !== valueId) }
          : opt
      )
    );
  }, []);

  /* ------------------------- Debounced Generation ------------------------- */

  useEffect(() => {
    const hasValues =
      localOptions.length > 0 && localOptions.every((o) => o.values.length > 0);

    const timeoutId = setTimeout(() => {
      if (hasValues) {
        const generated = generateVariants(localOptions, getValues);
        setValue("variants", generated, { shouldValidate: true });
      } else {
        setValue("variants", []);
      }
      // Stop loading after calculation (Async is fine in useEffect)
      setIsGenerating(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [localOptions, setValue, getValues]);

  /* ------------------------- Helper Methods ------------------------- */

  const updateField = useCallback(
    (idx: number, field: keyof VariantCombination, value: string | number) => {
      const path = `variants.${idx}.${field}` as Path<CreateProductPayload>;
      setValue(path, value, { shouldValidate: true });
    },
    [setValue]
  );
  const updateFields = useCallback(
    (idx: number, data: Partial<VariantCombination>) => {
      // 1. Get the keys from the incoming data
      const keys = Object.keys(data) as Array<keyof VariantCombination>;

      keys.forEach((key) => {
        const value = data[key];

        // 2. Skip undefined and 'id' (id is usually internal to UI)
        if (value !== undefined && key !== "id") {
          const path = `variants.${idx}.${key}` as Path<CreateProductPayload>;


          setValue(path, value as any, { shouldValidate: true });
        }
      });
    },
    [setValue]
  );
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);

  const toggleVariantSelection = useCallback((id: number) => {
    setSelectedVariants((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedVariants((p) =>
      p.length === variants.length ? [] : variants.map((v) => v.id as number)
    );
  }, [variants]);

  const deleteSelected = useCallback(() => {
    const remaining = variants.filter(
      (v) => !selectedVariants.includes(v.id as number)
    );
    setValue("variants", remaining, { shouldValidate: true });
    if(remaining.length <= 0) {
      setLocalOptions((prev) => prev.map((opt) => ({...opt, values: [] })))
    }
    setSelectedVariants([]);
  }, [variants, selectedVariants, setValue]);

  return {
    variants,
    localOptions,
    isGenerating,
    selectedVariants,
    errors,
    addVariantValue,
    removeVariantValue,
    toggleVariantSelection,
    toggleSelectAll,
    deleteSelected,
    updateField,
    updateFields
  };
}

/* ------------------------- Pure Helpers ------------------------- */

function generateVariants(
  options: VariantOption[],
  getValues: UseFormReturn<CreateProductPayload>["getValues"]
): VariantCombination[] {
  const combos: Record<string, string>[] = [];
  const build = (i: number, curr: Record<string, string>) => {
    if (i === options.length) {
      combos.push({ ...curr });
      return;
    }
    const opt = options[i];
    opt.values.forEach((v) => build(i + 1, { ...curr, [opt.name]: v.value }));
  };
  build(0, {});

  const baseSku = getValues("sku") || "SKU";
  const purchasePrice = Number(getValues("purchasePrice")) || 0;
  const sellingPrice = Number(getValues("sellingPrice")) || 0;

  return combos.map((c, i) => {
    const variantName = Object.values(c).join("-");
    return {
      id: i + 1,
      name: variantName,
      sku: `${baseSku}-${variantName}`,
      purchasePrice,
      sellingPrice,
      quantity: 0,
      combination: c,
    };
  });
}