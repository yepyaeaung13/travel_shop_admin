"use client";

import {Form} from "@/components/ui/form";
import ProductInfoSection from "./product-info-section";
import {Button} from "@/components/ui/button";
import PhotoSection from "@/components/product/Form/PhotoSection";
import PricingSection from "@/components/product/Form/pricing-section";
import VariantSection from "@/components/product/Form/VariantSection";
import ProductHeader from "@/components/product/Form/ProductHeader";
import VisibilityInventorySection from "@/components/product/Form/VisibilityInventorySection";
import {CategoryVariantGroup} from "@/types/categories";
import {CreateProductPayload} from "@/types/product/product-form.schemas";
import {UseFormReturn} from "react-hook-form";

type Props = {
  form:  UseFormReturn<CreateProductPayload>;
  categories: any[];
  categoryVariantGroups: CategoryVariantGroup[];
  isEdit?: boolean;
  onSubmit: (data: any) => void;
  onDraft: () => void;
  setSelectedCategoryId: (id:number|null) => void;
  discount: {
    enabled: boolean;
    type: string;
    isPercentage: boolean;
  };
};

export function ProductForm({
  form,
  categories,
  categoryVariantGroups,
  isEdit,
  onSubmit,
  onDraft,
  setSelectedCategoryId,
  discount
}: Props) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProductHeader isEdit={isEdit}/>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ProductInfoSection
              form={form}
              categories={categories}
              setSelectedCategoryId={setSelectedCategoryId}
            />
            <PhotoSection form={form}/>
            <PricingSection form={form} discount={discount} />
            <VariantSection
              form={form}
              categoryVariantGroups={categoryVariantGroups}
            />
          </div>

          <VisibilityInventorySection form={form}/>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onDraft}>
            Save draft
          </Button>
          <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}