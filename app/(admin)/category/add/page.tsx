"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
// Assuming these are all configured correctly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Component imports ---
import { cn } from "@/lib/utils";
import SubCategoryItem from "@/components/Category/SubCategoryItem"; // SubCategory,
import FullLoading from "@/components/fullloading";
import CategoryImageUpload from "@/components/Category/CategoryImageUpload";
import { Category } from "@/types/category.types";
import IconTrash from "@/assets/icons/Trash";
import { useCreateCategory } from "@/queries/category.queries";
import { uploadImage } from "@/services/common.service";
import { errorToast, successToast } from "@/components/toast";

export default function CreateCategory() {
  const router = useRouter();

  const { mutate: createCategory, isPending } = useCreateCategory();

  // --- State Initialization ---
  const [isSaving, setIsSaving] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [hasSubCategory, setHasSubCategory] = useState(false);
  const [hasVariant, setHasVariant] = useState(false);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<string[]>([]);
  const [showSubCategoryError, setShowSubCategoryError] = useState(false);
  const [sameName, setSameName] = useState(false);
  const [image, setImage] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });

  useEffect(() => {
    if (subCategories.length === 0) {
      setHasSubCategory(false);
      setShowSubCategoryError(false);
    }
  }, [subCategories]);

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
        parentId: null,
        image: "",
        description: "",
        variations: [],
        status: "active",
      },
    ]);
  };

  const removeSubCategory = (id: number) => {
    setSubCategories((prev) => {
      return prev.filter((sub) => sub.id !== id);
    });
  };

  const updateSubCategory = (
    indexNo: number,
    name?: string,
    image?: string,
    file?: File,
    variants?: string[]
  ) => {
    const subCategoriesName = subCategories
      .filter((sub, index) => indexNo !== index)
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
              image: image ?? sub.image,
              file: file ?? sub.file,
              variations: variants ?? sub.variations,
            }
          : sub
      )
    );
  };

  // ------------------------------------
  // --- Variant Handler ---
  // ------------------------------------

  const handleAddVariant = () => {
    const updatedVariants = [...(variants || []), ""];
    setVariants(updatedVariants);
  };

  const handleUpdateVariant = (index: number, value: string) => {
    const updated = [...(variants || [])];
    updated[index] = value;

    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = [...(variants || [])];
    updated.splice(index, 1);

    setVariants(updated);
  };

  // --- CREATE CATEGORY FORM ---
  const handleSubmitWithStatus = async (status: "active" | "inactive") => {
    if (!image.file) return;
    // return
    setIsSaving(true);
    const uploadedImage = await uploadImage(image.file);

    const currentVariants = [...variants];
    const payload = {
      name: categoryName,
      description: "",
      parentId: null,
      image: uploadedImage.data.key,
      variations: currentVariants,
      status,
    };

    createCategory(payload, {
      onSuccess: async (res: any) => {
        const parentId = res?.data?.id;
        successToast("Suucess", "Main Category created!");
        if (subCategories?.length > 0 && parentId) {
          for (let index = 0; index < subCategories.length; index++) {
            const uploadedImage = await uploadImage(subCategories[index].file!);
            createCategory(
              {
                name: subCategories[index]?.name || "",
                description: "",
                image: uploadedImage.data.key,
                parentId: parentId,
                variations: subCategories[index]?.variations || [],
                status,
              },
              {
                onSuccess: () => {
                  successToast(
                    "Success",
                    `Sub-category creating ${index + 1}/${
                      subCategories.length
                    }...`
                  );
                },
                onError: () => {
                  errorToast(
                    "Failed",
                    `Sub-category creating ${index + 1}/${
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
      onError: () => {
        errorToast("Failed", "Create category unsuccefully, please try again.");
        setIsSaving(false);
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
    setImage({ file: null, preview: null });
  };

  const disabled = useMemo(() => {
    if (categoryName == "" || sameName || !image.file) {
      return true;
    } else if (hasSubCategory && subCategories.length > 0) {
      const status = subCategories.map((sub) => {
        if (!sub.name || !sub.file) {
          return true;
        }
        if (sub.variations.length > 0) {
          return sub.variations.includes("") ? true : false;
        }
        return false;
      });
      return status.includes(true) ? true : false;
    } else if (variants.length > 0) {
      return variants.includes("") ? true : false;
    } else {
      return false;
    }
  }, [categoryName, subCategories, sameName, image, variants]);

  if (isSaving) {
    return <FullLoading label="Creating category..." />;
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
            Add new category
          </h1>
        </button>
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
                      Main category <span className="text-[#FF3333]">*</span>
                    </Label>
                    <Input
                      id="category-name"
                      placeholder="Category name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="h-12 rounded-[10px] text-sm md:h-14 md:text-base border-[#3C3C3C4D]"
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
                      <span className="text-xs">(Maximun 10)</span>
                    </Label>
                    <div className="rotate-180">
                      <Switch
                        id="has-subcategory"
                        checked={hasSubCategory}
                        onCheckedChange={(value) => {
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
                          <SubCategoryItem
                            key={index}
                            indexNo={index}
                            subCategory={subCategory}
                            updateSubCategory={updateSubCategory}
                            removeSubCategory={removeSubCategory}
                          />
                        ))}
                      </div>

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
                                value={variant}
                                onChange={(e) =>
                                  handleUpdateVariant(index, e.target.value)
                                }
                                className={cn(
                                  "h-10 w-full rounded-[10px] text-sm md:h-10 md:max-w-[344px] md:text-base border-border"
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
              />
            </div>

            <div className="order-3 flex justify-between gap-2.5 py-5 md:justify-end lg:col-span-3">
              {/* UNPUBLISH Button - calls the core logic explicitly */}
              <Button
                type="button"
                onClick={() => handleSubmitWithStatus("inactive")}
                disabled={isSaving || disabled}
                className={cn(
                  "h-auto w-[47%] rounded-[10px] bg-[#444444] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#444444] active:scale-95 md:w-[190px] md:text-lg",
                  disabled && "bg-[#444444]/50"
                )}
              >
                {isSaving ? "..." : "Unpublish"}
              </Button>

              {/* PUBLISH Button - calls the core logic explicitly */}
              <Button
                type="button"
                onClick={() => handleSubmitWithStatus("active")}
                disabled={isSaving || disabled}
                className={cn(
                  "bg-primary h-auto w-[47%] rounded-[10px] py-1.5 text-base font-medium text-white duration-300 active:scale-95 md:w-[190px] md:text-lg",
                  disabled && "bg-primary/50"
                )}
              >
                {isSaving ? "..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
