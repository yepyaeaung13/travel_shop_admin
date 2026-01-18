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
import { SubCategory, UpdateSubCategory } from "@/types/category.types";
import IconTrash from "@/assets/icons/Trash";
import {
  useDeleteCategory,
  useDeleteSubCategory,
  useGetCategoryById,
  useUpdateCategory,
} from "@/queries/category.queries";
import { uploadImage } from "@/services/common.service";
import { errorToast, successToast } from "@/components/toast";
import UpdateSubCategoryItem from "@/components/Category/UpdateSubCategoryItem";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";

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
  const {
    data: categoryDetail,
    isLoading,
    refetch,
  } = useGetCategoryById({
    id: Number(id),
  });
  const { mutate: deleteMutation, isPending } = useDeleteCategory();
  const { mutate: deleteSubMutation, isPending: isPendingSub } =
    useDeleteSubCategory();

  // --- State Initialization ---
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState<UpdateSubCategory[]>([]);
  const [sameName, setSameName] = useState(false);
  const [image, setImage] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });
  const [bannerImage, setBannerImage] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [deleteSubCategoryId, setDeleteSubCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const category = categoryDetail?.data;

    if (!category) return;

    // main
    setCategoryName(category.name || "");
    setImageUrl(category.image);
    setBannerImageUrl(category.bannerImage);

    // sub categories from API
    const apiSubCategories =
      category.subCategories?.map((sub) => ({
        id: sub.id,
        name: sub.name || "",
        image: `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${sub.image}` || ""
      })) ?? [];

    setSubCategories(apiSubCategories);
  }, [categoryDetail]);

  // --- Core Logic ---

  // ------------------------------------
  // --- SUB-CATEGORY HANDLERS ---
  // ------------------------------------
  const addSubCategory = () => {
    setSubCategories((prev) => [
      ...prev,
      {
        name: "",
        image: "",
        file: undefined,
      },
    ]);
  };

  const removeSubCategory = (indexNo: number) => {
    const removeCategory = subCategories.find(
      (sub, index) => index === indexNo
    );
    if (removeCategory && removeCategory.id) {
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
    file?: File
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
              image: image ?? sub.image,
              file: file ?? sub.file,
            }
          : sub
      )
    );
  };

  // ------------------------------------
  // --- SUBMISSION LOGIC ---
  // ------------------------------------

  // --- CREATE CATEGORY FORM ---
  const handleSubmit = async () => {
    let uploadedImage;
    let uploaddedBanner;
    if (image.file) {
      uploadedImage = await uploadImage(image.file);
    }
    if (bannerImage.file) {
      uploaddedBanner = await uploadImage(bannerImage.file);
    }

    let subCategoriesData: SubCategory[] = [];

    if (subCategories.length > 0) {
      subCategoriesData = await Promise.all(
        subCategories.map(async (cat) => {
          let uploadedImage;
          if (cat.file) {
            uploadedImage = await uploadImage(cat.file!);
          }

          return {
            ...cat,
            image: uploadedImage?.data?.cid || cat.image,
          };
        })
      );
    }

    // return;
    const payload = {
      id: categoryDetail?.data.id!,
      name: categoryName,
      bannerImage:
        uploaddedBanner?.data?.cid || categoryDetail?.data.bannerImage!,
      image: uploadedImage?.data?.cid || categoryDetail?.data.image!,
      subCategories: subCategoriesData,
      status: categoryDetail?.data.status!,
    };

    updateCategory(payload, {
      onSuccess: async (res) => {
        successToast("Success", "Main Category updated!");
        router.back();
      },
    });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0] as File;
    const MAX_SIZE = 512 * 1024;
    if (file.size > MAX_SIZE) {
      // show error toast / alert
      errorToast("Image too large", "Image must be under 512 KB");
      e.target.value = ""; // reset input
      return;
    }
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage({ file, preview });
    }
  };

  const handleBannerImageChange = (e: any) => {
    const file = e.target.files[0] as File;
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      // show error toast / alert
      errorToast("Image too large", "Image must be under 1 MB");
      e.target.value = ""; // reset input
      return;
    }
    if (file) {
      const preview = URL.createObjectURL(file);
      setBannerImage({ file, preview });
    }
  };

  const handleBannerImageRemove = () => {
    if (imageUrl) {
      setBannerImageUrl(undefined);
    } else {
      setBannerImage({ file: null, preview: null });
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
        errorToast(
          "Failed",
          error?.response?.data?.message || "Failed to delete category."
        );
      },
    });
  };

  const handleDeleteSubCategory = async () => {
    if (!deleteSubCategoryId) return;

    deleteSubMutation(deleteSubCategoryId, {
      onSuccess: (res) => {
        refetch();
        setSubOpen(false);
        successToast("Success!", `Category deleted successfully!`);
      },
      onError(error: any, variables, context) {
        errorToast(
          "Failed",
          error?.response?.data?.message || "Failed to delete category."
        );
      },
    });
  };

  const disabled = useMemo(() => {
    if (
      categoryName == "" ||
      sameName ||
      (!imageUrl && !image.file) ||
      (!bannerImageUrl && !bannerImage.file)
    ) {
      return true;
    } else if (subCategories.length > 0) {
      const status = subCategories.map((sub) => {
        if (!sub.name || (!sub.image && !sub.file)) {
          return true;
        }
        return false;
      });
      return status.includes(true) ? true : false;
    } else {
      return false;
    }
  }, [
    categoryName,
    subCategories,
    sameName,
    imageUrl,
    bannerImageUrl,
    image,
    bannerImage,
  ]);

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
              {/* category banner */}
              <div className="">
                {/* Right Column - Image Upload  */}
                <CategoryImageUpload
                  categoryImage={bannerImage.file}
                  imagePreview={bannerImage.preview}
                  onImageChange={handleBannerImageChange}
                  onImageRemove={handleBannerImageRemove}
                  className={"h-[208px]"}
                  text={
                    <span>
                      Upload a banner for your category
                      <br /> Image size : 1440 × 640 px
                    </span>
                  }
                  title={"Banner"}
                  existingImageUrl={bannerImageUrl}
                />
              </div>
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
              <Card className={cn("gap-2 rounded-[10px] p-5")}>
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
                  </div>

                  {/* Sub-categories */}
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
                className={"aspect-4/3"}
                text="Upload a cover image for your category."
                title={"Image"}
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
        loading={isPendingSub}
        callback={handleDeleteSubCategory}
      />
    </div>
  );
}
