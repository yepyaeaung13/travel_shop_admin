"use client";
import { ProductForm } from "@/components/product/Form/ProductForm";
import { useGetProductById } from "@/queries/product";
import { useProductForm } from "@/hooks/products/useProductForm";
import { useProductSubmit } from "@/hooks/products/useProductSubmit";
import { FormProvider } from "react-hook-form";
import { useParams } from "next/navigation";

export default function ProductEditPage() {
  const { id } = useParams();
  const product = useGetProductById(Number(id) as number);
  const {
    form,
    categories,
    categoryVariantGroups,
    selectedCategory,
    setSelectedCategory,
    discount,
  } = useProductForm(product.data?.data);
  const { submit, saveDraft } = useProductSubmit(Number(id));

  return (
    <FormProvider {...form}>
      <ProductForm
        form={form}
        categories={categories}
        categoryVariantGroups={categoryVariantGroups}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        isEdit
        onSubmit={submit}
        onDraft={() => saveDraft(form.getValues())}
        discount={discount}
      />
    </FormProvider>
  );
}
