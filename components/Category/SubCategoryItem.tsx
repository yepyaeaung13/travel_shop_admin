"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { ChevronDown, PlusCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IconTrash from "@/assets/icons/Trash";
import { useState } from "react";
import { Category } from "@/types/category.types";
import CameraUpIcon from "@/assets/icons/CameraUpIcon";
import { errorToast } from "../toast";

type Props = {
  indexNo: number;
  subCategory: Category;
  removeSubCategory: (indexNo: number) => void;
  updateSubCategory: (
    indexNo: number,
    name?: string,
    image?: string,
    file?: File,
    variants?: string[]
  ) => void;
};

export default function SubCategoryItem({
  indexNo,
  subCategory,
  removeSubCategory,
  updateSubCategory,
}: Props) {
  const [openVariantBox, setOpenVariantBox] = useState(false);

  if (!subCategory) return null;

  const handleToggleVariantBox = () => {
    setOpenVariantBox((prev) => !prev);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSubCategory(indexNo, e.target.value, subCategory.image);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_SIZE = 512 * 1024;
    if (file.size > MAX_SIZE) {
      // show error toast / alert
      errorToast("Image too large", "Image must be under 512 KB");
      e.target.value = ""; // reset input
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    updateSubCategory(indexNo, subCategory.name, imageUrl, file);
  };

  const handleAddVariant = () => {
    const updatedVariants = [...(subCategory.variations || []), ""];
    updateSubCategory(
      indexNo,
      subCategory.name,
      subCategory.image,
      subCategory.file,
      updatedVariants
    );
    setOpenVariantBox(true);
  };

  const handleUpdateVariant = (index: number, value: string) => {
    const updated = [...(subCategory.variations || [])];
    updated[index] = value;

    updateSubCategory(
      indexNo,
      subCategory.name,
      subCategory.image,
      subCategory.file,
      updated
    );
  };

  const handleRemoveVariant = (index: number) => {
    const updated = [...(subCategory.variations || [])];
    updated.splice(index, 1);

    updateSubCategory(
      indexNo,
      subCategory.name,
      subCategory.image,
      subCategory.file,
      updated
    );

    console.log(subCategory?.variations?.length);

    if (index === 0) {
      setOpenVariantBox(false);
    }
  };

  return (
    <div className="border-b border-[#3C3C3C]/30">
      <div className="flex items-center gap-4 pb-4">
        {/* Image */}
        <label className="w-fit cursor-pointer">
          <Avatar className="size-[50px] md:size-[60px]">
            {subCategory.image ? (
              <AvatarImage src={subCategory.image} />
            ) : (
              <AvatarFallback className="border-2 border-dashed border-[#3C3C3C4D]">
                <CameraUpIcon />
              </AvatarFallback>
            )}
          </Avatar>
          <input
            type="file"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleImageChange}
          />
        </label>

        {/* Name */}
        <div className="flex-1">
          <Input
            placeholder="Sub-category name"
            value={subCategory.name}
            onChange={handleNameChange}
            className={cn(
              "h-12 w-full rounded-[10px] text-sm md:h-14 md:max-w-[344px] md:text-base border-[#3C3C3C4D]"
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => removeSubCategory(indexNo)}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#44444414]"
          >
            <IconTrash />
          </button>

          {subCategory.variations?.length ? (
            <button
              type="button"
              onClick={handleToggleVariantBox}
              className={cn(
                "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#44444414] transition-transform",
                openVariantBox && "rotate-180"
              )}
            >
              <ChevronDown />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-primary flex items-center gap-2"
            >
              <PlusCircleIcon className="text-primary size-5" />
              <span className="max-md:hidden">Add variant</span>
            </button>
          )}
        </div>
      </div>

      {/* Variants UI */}
      {openVariantBox && (
        <div className="flex w-full flex-col space-y-2.5 pb-4">
          <p className="text-lg">Variants</p>
          <p className="text-base font-normal text-[#3C3C3C]">Option title</p>
          <div className="space-y-2.5">
            {subCategory.variations?.map((variant, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Variant name"
                    value={variant}
                    onChange={(e) => handleUpdateVariant(index, e.target.value)}
                    className={cn(
                      "h-10 w-full rounded-[10px] text-sm md:h-10 md:max-w-[344px] md:text-base border-[#3C3C3C4D]"
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
    </div>
  );
}
