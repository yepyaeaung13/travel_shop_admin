"use client";

import type React from "react";
import { useMemo, useState } from "react";
// Assuming these are all configured correctly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Component imports ---
import { cn } from "@/lib/utils";
import SubCategoryItem from "@/components/Category/SubCategoryItem"; // SubCategory,
import FullLoading from "@/components/fullloading";
import CategoryImageUpload from "@/components/Category/CategoryImageUpload";
import { SubCategory } from "@/types/category.types";
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
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [sameName, setSameName] = useState(false);
  const [image, setImage] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });
  const [bannerImage, setBannerImage] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });

  const addSubCategory = () => {
    setSubCategories((prev) => [
      ...prev,
      {
        name: "",
        image: ""
      },
    ]);
  };

  const removeSubCategory = (indexNo: number) => {
    setSubCategories((prev) => {
      return prev.filter((sub, index) => index !== indexNo);
    });
  };

  const updateSubCategory = (
    indexNo: number,
    name?: string,
    image?: string,
    file?: File
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
            }
          : sub
      )
    );
  };

  // --- CREATE CATEGORY FORM ---
  const handleSubmitWithStatus = async (status: "active" | "inactive") => {
    if (!image.file || !bannerImage.file) return;
    // return
    setIsSaving(true);
    const uploadedImage = await uploadImage(image.file);
    const uploadBanner = await uploadImage(bannerImage.file);

    let subCategoriesData: SubCategory[] = [];

    if (subCategories.length > 0) {
      subCategoriesData = await Promise.all(
        subCategories.map(async (cat) => {
          const uploadedImage = await uploadImage(cat.file!);

          return {
            ...cat,
            image: uploadedImage?.data?.cid,
          };
        })
      );
    }

    const payload = {
      name: categoryName,
      bannerImage: uploadBanner.data.cid,
      image: uploadedImage.data.cid,
      status,
      subCategories: subCategoriesData,
    };

    createCategory(payload, {
      onSuccess: async (res: any) => {
        successToast("Suucess", "Main Category created!");
        router.back();
      },
      onError: (error: any) => {
        console.log("Error", error);
        
        errorToast("Failed", error?.response?.data?.message || "Create category unsuccefully, please try again.");
        setIsSaving(false);
      },
    });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0] as File;
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      // show error toast / alert
      errorToast("Image too large", "Image must be under 1MB");
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

  const handleImageRemove = () => {
    setImage({ file: null, preview: null });
  };

  const handleBannerImageRemove = () => {
    setBannerImage({ file: null, preview: null });
  };

  const disabled = useMemo(() => {
    if (categoryName == "" || sameName || !image.file || !bannerImage.file) {
      return true;
    } else if (subCategories.length > 0) {
      const status = subCategories.map((sub) => {
        if (!sub.name || !sub.file) {
          return true;
        }
        return false;
      });
      return status.includes(true) ? true : false;
    } else {
      return false;
    }
  }, [categoryName, subCategories, sameName, image, bannerImage]);

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
                />
              </div>
              {/* Category Name */}
              <Card className="gap-2 rounded-[10px] p-5">
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category-name"
                      className="text-lg md:text-xl font-medium text-black"
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
              <Card className={cn("gap-2 rounded-[10px] p-5")}>
                <CardContent className="space-y-4 px-0">
                  {/* Has Sub-category Toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <Label
                      htmlFor="has-subcategory"
                      className="cursor-pointer text-lg md:text-xl font-medium text-black"
                    >
                      Add has sub-category
                    </Label>
                  </div>

                  {/* Sub-categories */}
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
                type="submit"
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
