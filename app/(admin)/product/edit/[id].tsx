'use client';
import {ProductForm} from "@/components/product/Form/ProductForm";
import {useGetProductById} from "@/queries/product";
import {useProductForm} from "@/hooks/products/useProductForm";
import {useProductSubmit} from "@/hooks/products/useProductSubmit";
import {FormProvider} from "react-hook-form";

export default function ProductEditPage({ id }: { id: number }) {
  const product = useGetProductById(id);
  const { form, categories, categoryVariantGroups, setSelectedCategoryId } = useProductForm(
    product.data?.data,
  );
  const { submit, saveDraft } = useProductSubmit(id);

  return (
    <FormProvider {...form}>
    <ProductForm
      form={form}
      categories={categories}
      categoryVariantGroups={categoryVariantGroups}
      setSelectedCategoryId={setSelectedCategoryId}
      isEdit
      onSubmit={submit}
      onDraft={() => saveDraft(form.getValues())}
    />
    </FormProvider>
  );
}