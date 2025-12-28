"use client";
import {ProductForm} from "@/components/product/Form/ProductForm";
import {useProductSubmit} from "@/hooks/products/useProductSubmit";
import {useProductForm} from "@/hooks/products/useProductForm";
import {FormProvider} from "react-hook-form";

export default function ProductCreatePage() {
  const { form, categories, categoryVariantGroups,setSelectedCategoryId,discount } = useProductForm();
  const { submit, saveDraft } = useProductSubmit();

  return (
    <FormProvider {...form}>
    <ProductForm
      form={form}
      discount={discount}
      categories={categories}
      categoryVariantGroups={categoryVariantGroups}
      setSelectedCategoryId={setSelectedCategoryId}
      onSubmit={submit}
      onDraft={() => saveDraft(form.getValues())}
    />
    </FormProvider>

  );
}