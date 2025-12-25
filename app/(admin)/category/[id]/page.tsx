"use client";

import type React from "react";
import { Suspense, useEffect, useMemo, useState } from "react";
// Assuming these are all configured correctly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, PlusCircleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

// --- Component imports ---
import { cn } from "@/lib/utils";
import FullLoading from "@/components/fullloading";
import CategoryImageUpload from "@/components/Category/CategoryImageUpload";
import { UpdateCategory } from "@/types/category.types";
import IconTrash from "@/assets/icons/Trash";
import {
  useDeleteCategory,
  useGetCategoryById,
  useUpdateCategory,
} from "@/queries/category.queries";
import { uploadImage } from "@/services/common.service";
import { errorToast, successToast } from "@/components/toast";
import UpdateSubCategoryItem from "@/components/Category/UpdateSubCategoryItem";
import ConfirmDeleteDialog from "@/components/Category/ConfirmDeleteDialog";

export default function Page() {
  return (
    <Suspense fallback="">
      <EditCategory />
    </Suspense>
  );
}

function EditCategory() {
  const router = useRouter();
  const { id } = useParams();

  const { mutate: updateCategory, isPending: isSaving } = useUpdateCategory();
  const { data: categoryDetail, isLoading, refetch } = useGetCategoryById({
    id: Number(id),
  });
  const { mutate: deleteMutation, isPending } = useDeleteCategory();

  // --- State Initialization ---
  const [categoryName, setCategoryName] = useState("");
  const [hasSubCategory, setHasSubCategory] = useState(false);
  const [hasVariant, setHasVariant] = useState(false);
  const [subCategories, setSubCategories] = useState<UpdateCategory[]>([]);
  const [variants, setVariants] = useState<{ id: number; name: string }[]>([]);
  const [showSubCategoryError, setShowSubCategoryError] = useState(false);
  const [sameName, setSameName] = useState(false);
  const [image, setImage] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [deleteSubCategoryId, setDeleteSubCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (subCategories.length === 0) {
      setHasSubCategory(false);
      setShowSubCategoryError(false);
    }
  }, [subCategories]);

  useEffect(() => {
    const category = categoryDetail?.data;

    if (!category) return;

    // main
    setCategoryName(category.name || "");
    setImageUrl(category.imageUrl);

    // variants from API (extract names)
    const apiVariants = category.variations ?? [];

    setVariants(apiVariants);
    setHasVariant(apiVariants.length > 0);

    // sub categories from API
    const apiSubCategories =
      category.subCategories?.map((sub) => ({
        id: sub.id,
        name: sub.name || "",
        parentId: sub.parentId ?? 0,
        image: sub.image || "",
        imageUrl: sub.imageUrl,
        description: sub.description || "",
        variations: sub.variations ?? [],
        status: sub.status,
      })) ?? [];

    setSubCategories(apiSubCategories);
    setHasSubCategory(apiSubCategories.length > 0);
  }, [categoryDetail]);

  // --- Core Logic ---

  // ------------------------------------
  // --- SUB-CATEGORY HANDLERS ---
  // ------------------------------------
  const addSubCategory = () => {
    setSubCategories((prev) => [
      ...prev,
      {
        id: 0,
        name: "",
        parentId: 0,
        image: "",
        file: undefined,
        description: "",
        status: "active",
        variations: [],
      },
    ]);
  };

  const removeSubCategory = (indexNo: number) => {
    const removeCategory = subCategories.find(
      (sub, index) => index !== indexNo
    );
    if (removeCategory && removeCategory.id !== 0) {
      setDeleteSubCategoryId(removeCategory.id);
      setSubOpen(true);
    } else {
      setSubCategories((prev) => {
        return prev.filter((sub, index) => index !== indexNo);
      });
    }
  };

  const updateSubCategory = (
    indexNo: number,
    name?: string,
    image?: string,
    file?: File,
    variants?: { id: number; name: string }[],
    status?: "active" | "inactive"
  ) => {
    const subCategoriesName = subCategories
      .filter((sub, index) => index !== indexNo)
      .map((sub) => sub.name);
    if (name && subCategoriesName.includes(name)) {
      setSameName(true);
    } else {
      setSameName(false);
    }
    setSubCategories((prev) =>
      prev.map((sub, index) =>
        index === indexNo
          ? {
              ...sub,
              name: name ?? sub.name,
              image: sub.image,
              imageUrl: image ?? sub.imageUrl,
              file: file ?? sub.file,
              variations: variants ?? sub.variations,
              status: status ?? sub.status,
            }
          : sub
      )
    );
  };

  // ------------------------------------
  // --- Variant Handler ---
  // ------------------------------------

  const handleAddVariant = () => {
    const updatedVariants = [...(variants || []), { id: 0, name: "" }];
    setVariants(updatedVariants);
  };

  const handleUpdateVariant = (index: number, value: string) => {
    const updated = [...(variants || [])];
    updated[index].name = value;

    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = [...(variants || [])];
    updated.splice(index, 1);

    setVariants(updated);
  };

  // ------------------------------------
  // --- SUBMISSION LOGIC ---
  // ------------------------------------

  // --- CREATE CATEGORY FORM ---
  const handleSubmit = async () => {
    let uploadedImage;
    if (image.file) {
      uploadedImage = await uploadImage(image.file);
    }
    const currentVariants = [...variants];

    // return;
    const payload = {
      id: categoryDetail?.data.id!,
      name: categoryName,
      description: "",
      parentId: null,
      image: uploadedImage?.data?.key || categoryDetail?.data.image!,
      variations: currentVariants,
      status: categoryDetail?.data.status!,
    };

    updateCategory(payload, {
      onSuccess: async (res) => {
        const parentId = res?.data?.id;
        successToast("Success", "Main Category updated!");
        if (subCategories?.length > 0 && parentId) {
          for (let index = 0; index < subCategories.length; index++) {
            let uploadedImage;
            if (subCategories[index].file!) {
              uploadedImage = await uploadImage(subCategories[index].file!);
            }
            updateCategory(
              {
                id: subCategories[index]?.id,
                name: subCategories[index]?.name || "",
                description: "",
                image: uploadedImage?.data?.key || subCategories[index]?.image,
                parentId: parentId,
                variations: subCategories[index]?.variations || [],
                status: categoryDetail?.data.status!,
              },
              {
                onSuccess: () => {
                  successToast(
                    "Success",
                    `Sub-category updating ${index + 1}/${
                      subCategories.length
                    }...`
                  );
                },
                onError: () => {
                  errorToast(
                    "Failed",
                    `Sub-category updating ${index + 1}/${
                      subCategories.length
                    }...`
                  );
                },
              }
            );
          }
        }
        router.back();
      },
    });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0] as File;
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage({ file, preview });
    }
  };

  const handleImageRemove = () => {
    if (imageUrl) {
      setImageUrl(undefined);
    } else {
      setImage({ file: null, preview: null });
    }
  };

  const handleDelete = async () => {
    deleteMutation([categoryDetail?.data.id!], {
      onSuccess: (res) => {
        successToast("Success!", `Category deleted successfully!`);
        router.back();
      },
      onError(error: any, variables, context) {
        errorToast("Failed", error?.response?.data?.message || "Failed to delete category.");
      },
    });
  };

  const handleDeleteSubCategory = async () => {
    if(!deleteSubCategoryId) return;

    deleteMutation([deleteSubCategoryId], {
      onSuccess: (res) => {
        refetch();
        setSubOpen(false)
        successToast("Success!", `Category deleted successfully!`);
      },
      onError(error: any, variables, context) {
        errorToast("Failed", error?.response?.data?.message || "Failed to delete category.");
      },
    });
  };

  const disabled = useMemo(() => {
    if (categoryName == "" || sameName || (!imageUrl && !image.file)) {
      return true;
    } else if (hasSubCategory && subCategories.length > 0) {
      const status = subCategories.map((sub) => {
        if (!sub.name || (sub.imageUrl && sub.file)) {
          return true;
        }
        if (sub.variations.length > 0) {
          const variantsName = sub.variations.map((v) => v.name);
          return variantsName.includes("") ? true : false;
        }
        return false;
      });
      return status.includes(true) ? true : false;
    } else if (variants.length > 0) {
      const variantsName = variants.map((v) => v.name);
      return variantsName.includes("") ? true : false;
    } else {
      return false;
    }
  }, [categoryName, subCategories, sameName, variants, imageUrl, image]);

  if (isSaving || isLoading) {
    const loadingText = isLoading ? "Loading...." : "Updating category...";
    return <FullLoading label={loadingText} />;
  }

  // ------------------------------------
  // --- JSX RENDER ---
  // ------------------------------------
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
        >
          <ChevronLeft className="h-6 w-6" />
          <h1 className="text-foreground text-lg font-medium md:text-xl">
            Edit category
          </h1>
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ffffff50]"
        >
          <IconTrash />
        </button>

        <div className="md:flex justify-between gap-2.5 md:justify-end lg:col-span-3 hidden">
          {/* UNPUBLISH Button - calls the core logic explicitly */}
          <Button
            type="button"
            onClick={() => setOpen(true)}
            disabled={isSaving || disabled}
            className={cn(
              "h-auto w-[135px] rounded-[10px] bg-[#FF333350] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#FF3333] active:scale-95 md:w-[135px] md:text-lg",
              disabled || (isSaving && "bg-[#444444]/50")
            )}
          >
            Delete
          </Button>
          {/* UNPUBLISH Button - calls the core logic explicitly */}
          <Button
            type="button"
            onClick={() => router.back()}
            disabled={isSaving || disabled}
            className={cn(
              "h-auto w-[135px] rounded-[10px] bg-[#A1A1A1] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#444444] active:scale-95 md:w-[135px] md:text-lg",
              disabled || (isSaving && "bg-[#444444]/50")
            )}
          >
            Discard
          </Button>

          {/* PUBLISH Button - calls the core logic explicitly */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || disabled}
            className={cn(
              "bg-primary h-auto w-[135px] rounded-[10px] py-1.5 text-base font-medium text-white duration-300 active:scale-95 md:w-[135px] md:text-lg",
              disabled && "bg-primary/50"
            )}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form id="category-form">
        <div className="">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Left Column - Category Details */}
            <div className="order-2 md:order-1 space-y-2.5 lg:col-span-2">
              {/* Category Name */}
              <Card className="gap-2 rounded-[10px] p-5">
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category-name"
                      className="text-base font-medium md:text-lg"
                    >
                      Main category <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="category-name"
                      placeholder="Category name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="h-12 text-sm md:h-14 md:text-base border-border rounded-[10px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* sub category */}
              <Card
                className={cn(
                  "gap-2 rounded-[10px] p-5",
                  hasVariant && "opacity-50 pointer-events-none"
                )}
              >
                <CardContent className="space-y-4 px-0">
                  {/* Has Sub-category Toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <Label
                      htmlFor="has-subcategory"
                      className="cursor-pointer text-base font-medium md:text-lg"
                    >
                      Add has sub-category{" "}
                      <span className="md:text-xs">(Maximun 10)</span>
                    </Label>
                    <div className="rotate-180">
                      <Switch
                        id="has-subcategory"
                        checked={hasSubCategory}
                        onCheckedChange={(value) => {
                          // disable for update
                          if (value) {
                            // addSubCategory();
                            setHasSubCategory(value);
                            setHasVariant(false);
                            setVariants([]);
                          } else {
                            setHasSubCategory(value);
                            setSubCategories([]);
                            // setShowSubCategoryError(true);
                          }
                        }}
                        className={cn(
                          showSubCategoryError && "cursor-not-allowed"
                        )}
                      />
                    </div>
                  </div>

                  {/* Sub-categories */}
                  {hasSubCategory && (
                    <div className="space-y-2">
                      <div className="space-y-4">
                        {subCategories.map((subCategory, index) => (
                          <UpdateSubCategoryItem
                            key={index}
                            indexNo={index}
                            subCategory={subCategory}
                            updateSubCategory={updateSubCategory}
                            removeSubCategory={removeSubCategory}
                          />
                        ))}
                      </div>

                      {/* {showSubCategoryError && (
                        <div>
                          <p className="text-sm text-[#FF3333]">
                            You need to delete all sub-categories to close
                            sub-category toggle.
                          </p>
                        </div>
                      )} */}
                      {sameName && (
                        <div>
                          <p className="text-sm text-[#FF3333]">
                            Subcategory names must be different.
                          </p>
                        </div>
                      )}

                      {/* Add Sub-category Button */}
                      <div className="flex justify-start pt-2">
                        <button
                          type="button"
                          onClick={addSubCategory}
                          className="text-primary flex items-center gap-2"
                        >
                          <PlusCircleIcon className="text-primary size-5" />
                          <span>Add sub-category</span>
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* variants */}
              <Card
                className={cn(
                  "gap-2 rounded-[10px] p-5",
                  hasSubCategory && "opacity-50 pointer-events-none"
                )}
              >
                <CardContent className="space-y-4 px-0">
                  {/* Has Sub-category Toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <Label
                      htmlFor="has-variant"
                      className="cursor-pointer text-base font-medium md:text-lg"
                    >
                      Add variant
                    </Label>
                    <div className="rotate-180">
                      <Switch
                        id="has-varaint"
                        checked={hasVariant}
                        onCheckedChange={(value) => {
                          //disable for update
                          if (value) {
                            // handleAddVariant()
                            setHasVariant(value);
                            setHasSubCategory(false);
                            setSubCategories([]);
                          } else {
                            setHasVariant(value);
                            setVariants([]);
                            // setShowSubCategoryError(true);
                          }
                        }}
                        // className={cn(
                        //   showSubCategoryError && "cursor-not-allowed"
                        // )}
                      />
                    </div>
                  </div>

                  {/* variants */}
                  {hasVariant && (
                    <div className="flex w-full flex-col space-y-2.5 pb-4">
                      {variants?.length > 0 && (
                        <p className="text-base font-normal text-[#3C3C3C]">
                          Option title
                        </p>
                      )}
                      <div className="space-y-2.5">
                        {variants?.map((variant, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex-1">
                              <Input
                                placeholder="Variant name"
                                value={variant.name}
                                onChange={(e) =>
                                  handleUpdateVariant(index, e.target.value)
                                }
                                className={cn(
                                  "h-10 w-full text-sm md:h-10 md:max-w-[344px] md:text-base border-border"
                                )}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#44444414]"
                            >
                              <IconTrash />
                            </button>
                          </div>
                        ))}

                        {/* Add more variant */}
                        <button
                          type="button"
                          onClick={handleAddVariant}
                          className="text-primary flex items-center gap-2"
                        >
                          <PlusCircleIcon className="text-primary size-5" />
                          <span>Add variant</span>
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="order-1 md:order-2">
              {/* Right Column - Image Upload  */}
              <CategoryImageUpload
                categoryImage={image.file}
                imagePreview={image.preview}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                existingImageUrl={imageUrl}
              />
            </div>
          </div>

          <div className="py-5 flex justify-between gap-2.5 md:justify-end lg:col-span-3 md:hidden">
            {/* UNPUBLISH Button - calls the core logic explicitly */}
            <Button
              type="button"
              onClick={() => router.back()}
              disabled={isSaving || disabled}
              className={cn(
                "h-auto w-[169px] rounded-[10px] bg-[#A1A1A1] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#444444] active:scale-95 md:w-[135px] md:text-lg",
                disabled || (isSaving && "bg-[#444444]/50")
              )}
            >
              Discard
            </Button>

            {/* PUBLISH Button - calls the core logic explicitly */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || disabled}
              className={cn(
                "bg-primary h-auto w-[169px] rounded-[10px] py-1.5 text-base font-medium text-white duration-300 active:scale-95 md:w-[135px] md:text-lg",
                disabled && "bg-primary/50"
              )}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={open}
        setOpen={setOpen}
        loading={isPending}
        callback={handleDelete}
      />

       {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={subOpen}
        setOpen={setSubOpen}
        loading={isPending}
        callback={handleDeleteSubCategory}
      />
    </div>
  );
}
