"use client";
import { useProductForm } from "@/hooks/products/useProductForm";
import { IconLoading } from "@/assets/icons/IconLoading";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import PhotoSection from "@/components/product/Form/PhotoSection";
import PricingSection from "@/components/product/Form/pricing-section";
import VariantSection from "@/components/product/Form/VariantSection";
import ProductHeader from "@/components/product/Form/ProductHeader";
import VisibilityInventorySection from "@/components/product/Form/VisibilityInventorySection";
import ProductInfoSection from "@/components/product/Form/product-info-section";
import { useCreateProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/queries/product";
import { uploadImage } from "@/services/common.service";
import { useEffect, useMemo, useState } from "react";

export default function ProductCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    categories,
    categoryVariantGroups,
    setSelectedCategory,
    selectedCategory,
    setSelectedSubCategory,
    selectedSubCategory,
    categoryLoading,
  } = useProductForm();
  const {
    name,
    description,
    promoteType,
    promoteValue,
    isPromote,
    sellingPriceMMK,
    sellingPriceUSD,
    sellingPriceCNY,
    stock,
    sku,
    variants,
    addVariant,
    removeVariantItem,
    updateVariantItem,
    productVarints,
    addProductVariant,
    removeProductVariant,
    updateProductVariant,
    setField,
    images,
    replaceMainImage,
    addImage,
    removeImage,
    reset,
  } = useCreateProductStore();
  // const { submit, saveDraft } = useProductSubmit();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const buildPayload = async (
    store: ReturnType<typeof useCreateProductStore.getState>,
    status: "active" | "inactive",
  ) => {
    const uploadedImages = await Promise.all(
      store.images.map(async (img, index) => {
        const res = await uploadImage(img.file!);
        return {
          url: res.data.cid,
          isMain: index === 0,
        };
      }),
    );

    const variantItems = store.variants.flatMap((v) => v.variantItems);
    const options = store.productVarints.map((opt) => ({
      ...opt,
      values: opt.values.join(","),
    }));

    return {
      name: store.name,
      description: store.description,
      buyingPriceMMK: store.buyingPriceMMK,
      sellingPriceMMK: store.sellingPriceMMK,
      sellingPriceCNY: store.sellingPriceCNY,
      sellingPriceUSD: store.sellingPriceUSD,
      isPromote: store.isPromote,
      promoteType: store.promoteType,
      promoteValue: store.promoteValue,
      stock: store.stock,
      sku: store.sku,
      status,
      mainCategoryId: store.mainCategoryId!,
      subCategoryId: store.subCategoryId!,
      images: uploadedImages,
      variants: variantItems,
      variantOptions: options,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const store = useCreateProductStore.getState();
      const payload = await buildPayload(store, "active");

      createProduct(payload, {
        onSuccess: () => {
          reset();
          router.push("/product");
        },
        onError: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("Create product failed", err);
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const store = useCreateProductStore.getState();
      const payload = await buildPayload(store, "inactive");

      createProduct(payload, {
        onSuccess: () => {
          reset();
          router.push("/product");
        },
        onError: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("Save draft failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => reset();
  }, []);

  const disabled = useMemo(() => {
    if (images.length === 0) return true;
  }, [images]);

  // console.log(loading, isPending, disabled);

  return (
    <div>
      {(categoryLoading || isPending || loading) && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductHeader />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ProductInfoSection
              name={name}
              description={description}
              categories={categories}
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedSubCategory={selectedSubCategory}
              setField={setField}
            />
            <PhotoSection
              images={images}
              replaceMainImage={replaceMainImage}
              addImage={addImage}
              removeImage={removeImage}
            />
            <PricingSection
              promoteType={promoteType}
              promoteValue={promoteValue}
              isPromote={isPromote}
              setField={setField}
              sellingPriceMMK={sellingPriceMMK}
              sellingPriceUSD={sellingPriceUSD}
              sellingPriceCNY={sellingPriceCNY}
            />
            <VariantSection
              isEdit={false}
              variants={variants}
              addVariant={addVariant}
              removeVariantItem={removeVariantItem}
              updateVariantItem={updateVariantItem}
              productVarints={productVarints}
              addProductVariant={addProductVariant}
              updateProductVariant={updateProductVariant}
              removeProductVariant={removeProductVariant}
              categoryVariantGroups={categoryVariantGroups}
            />
          </div>

          <VisibilityInventorySection
            sku={sku}
            stock={stock}
            setField={setField}
            variants={variants}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading || isPending || disabled}
          >
            Unpublish
          </Button>
          <Button type="submit" disabled={loading || isPending || disabled}>
            {isPending ? <IconLoading /> : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
