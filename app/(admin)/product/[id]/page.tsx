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
import { useParams, useRouter } from "next/navigation";
import {
  useDeleteProducts,
  useGetProductById,
  useUpdateProduct,
} from "@/queries/product";
import { uploadImage } from "@/services/common.service";
import { Suspense, useEffect, useMemo, useState } from "react";
import { mapProductToStore } from "@/utils/product";
import { cn } from "@/lib/utils";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import { errorToast, successToast } from "@/components/toast";

export default function Page() {
  return (
    <Suspense fallback={""}>
      <ProductCreatePage />
    </Suspense>
  );
}

function ProductCreatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: product, isPending: productLoading } = useGetProductById(
    Number(id) as number,
  );

  console.log("product", product);
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
    setInitialData,
  } = useCreateProductStore();
  // const { submit, saveDraft } = useProductSubmit();
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { mutate: deleteMutation, isPending: deleteLoading } =
    useDeleteProducts();

  const buildPayload = async (
    store: ReturnType<typeof useCreateProductStore.getState>,
    status: "active" | "inactive",
  ) => {
    const uploadedImages = await Promise.all(
      store.images.map(async (img, index) => {
        let url;
        if (img.file) {
          const res = await uploadImage(img.file!);
          url = res.data.cid;
        } else {
          const originImg = product.data.images.find(
            (im: any) => im.id === img.id,
          );
          url = originImg.url;
        }
        return {
          url,
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

      updateProduct(
        { id, payload },
        {
          onSuccess: () => {
            reset();
            router.push("/product");
          },
          onError: () => {
            setLoading(false);
          },
        },
      );
    } catch (err) {
      console.error("Update product failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product?.data || categories.length === 0) return;
    const updateData = mapProductToStore(product.data);
    const selectedCat = categories.find(
      (cat) => cat.id === product.data.mainCategory.id,
    );
    const selectedSubCat = selectedCat?.subCategories?.find(
      (cat) => cat.id === product.data.mainCategory.id,
    );
    setSelectedCategory(selectedCat);
    setSelectedSubCategory(selectedSubCat);
    setInitialData(updateData);
  }, [product?.data, setInitialData]);

  const disabled = useMemo(() => {
    if (images.length === 0) return true;
  }, [images]);

  const handleDelete = async () => {
    deleteMutation([Number(id)], {
      onSuccess: (res) => {
        reset();
        successToast("Success!", `Product deleted successfully!`);
        router.back();
      },
      onError(error: any) {
        errorToast(
          "Failed",
          error?.response?.data?.message || "Failed to delete product.",
        );
      },
    });
  };

  // console.log(loading, isPending, disabled);

  return (
    <div>
      {(categoryLoading || productLoading || isPending || loading) && (
        <LoadingSpinner />
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between">
          <ProductHeader title="Edit product" />

          <div className="md:flex justify-between gap-2.5 md:justify-end lg:col-span-3 hidden">
            {/* UNPUBLISH Button - calls the core logic explicitly */}
            <Button
              type="button"
              onClick={() => setOpen(true)}
              disabled={isPending || disabled}
              className={cn(
                "h-auto w-[135px] rounded-[10px] border border-[#FF3333] py-1.5 text-base font-medium text-[#FF3333] duration-300 bg-transparent hover:bg-transparent active:scale-95 md:w-[135px] md:text-lg",
                disabled || (isPending && "bg-[#444444]/50"),
              )}
            >
              Delete
            </Button>
            {/* UNPUBLISH Button - calls the core logic explicitly */}
            <Button
              type="button"
              onClick={() => router.back()}
              className={cn(
                "h-auto w-[135px] rounded-[10px] bg-[#A1A1A1] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#444444] active:scale-95 md:w-[135px] md:text-lg",
              )}
            >
              Discard
            </Button>

            {/* PUBLISH Button - calls the core logic explicitly */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || disabled}
              className={cn(
                "bg-primary h-auto w-[135px] rounded-[10px] py-1.5 text-base font-medium text-white duration-300 active:scale-95 md:w-[135px] md:text-lg",
                disabled && "bg-primary/50",
              )}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

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
              isEdit={true}
              variantItems={product?.data?.variants}
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
      </form>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={open}
        setOpen={setOpen}
        loading={deleteLoading}
        callback={handleDelete}
      />
    </div>
  );
}
