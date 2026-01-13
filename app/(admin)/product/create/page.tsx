"use client";
import { ProductForm } from "@/components/product/Form/ProductForm";
import { useProductSubmit } from "@/hooks/products/useProductSubmit";
import { useProductForm } from "@/hooks/products/useProductForm";
import { FormProvider } from "react-hook-form";
import { IconLoading } from "@/assets/icons/IconLoading";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function ProductCreatePage() {
  const {
    form,
    categories,
    categoryVariantGroups,
    setSelectedCategory,
    selectedCategory,
    discount,
    categoryLoading,
  } = useProductForm();
  const { submit, saveDraft } = useProductSubmit();

  return (
    <FormProvider {...form}>
      <div>
        {categoryLoading && <LoadingSpinner />}
        <ProductForm
          form={form}
          discount={discount}
          categories={categories}
          categoryVariantGroups={categoryVariantGroups}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          onSubmit={submit}
          onDraft={() => saveDraft(form.getValues())}
        />
      </div>
    </FormProvider>
  );
}
