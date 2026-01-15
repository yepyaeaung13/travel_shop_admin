"use client";
import { useProductSubmit } from "@/hooks/products/useProductSubmit";
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

export default function ProductCreatePage() {
  const router = useRouter();
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
    productVarints,
    setField,
    images,
    addImage,
    removeImage,
    reset,
  } = useCreateProductStore();
  // const { submit, saveDraft } = useProductSubmit();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const buildPayload = async (
    store: ReturnType<typeof useCreateProductStore.getState>,
    status: "ACTIVE" | "DRAFT"
  ) => {
    const uploadedImages = await Promise.all(
      store.images.map(async (img, index) => {
        const res = await uploadImage(img.file!);
        return {
          url: res.data.key,
          isMain: index === 0,
        };
      })
    );

    return {
      name: store.name,
      description: store.description,
      buyingPriceMMK: store.buyingPriceMMK,
      sellingPriceMMK: store.sellingPriceMMK,
      sellingPriceCNY: store.sellingPriceCNY,
      sellingPriceUSD: store.sellingPriceUSD,
      promoteType: store.promoteType,
      promoteValue: store.promoteValue,
      stock: store.stock,
      status,
      mainCategoryId: store.mainCategoryId!,
      subCategoryId: store.subCategoryId!,
      images: uploadedImages,
      variants: store.variants,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const store = useCreateProductStore.getState();
      const payload = await buildPayload(store, "ACTIVE");

      createProduct(payload, {
        onSuccess: () => {
          reset();
          router.push("/product");
        },
      });
    } catch (err) {
      console.error("Create product failed", err);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const store = useCreateProductStore.getState();
      const payload = await buildPayload(store, "DRAFT");

      createProduct(payload, {
        onSuccess: () => {
          router.push("/product");
        },
      });
    } catch (err) {
      console.error("Save draft failed", err);
    }
  };

  return (
    <div>
      {categoryLoading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductHeader isEdit={false} />

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
              variants={variants}
              productVarints={productVarints}
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
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Save draft
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <IconLoading /> : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
