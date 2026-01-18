"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { ChevronDown, PlusCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IconTrash from "@/assets/icons/Trash";
import { useState } from "react";
import { UpdateSubCategory } from "@/types/category.types";
import CameraUpIcon from "@/assets/icons/CameraUpIcon";
import { errorToast } from "../toast";

type Props = {
  indexNo: number;
  subCategory: UpdateSubCategory;
  removeSubCategory: (indexNo: number) => void;
  updateSubCategory: (
    indexNo: number,
    name?: string,
    image?: string,
    file?: File,
    variants?: { id: number; name: string }[]
  ) => void;
};

export default function UpdateSubCategoryItem({
  indexNo,
  subCategory,
  removeSubCategory,
  updateSubCategory,
}: Props) {

  if (!subCategory) return null;

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
    const image = URL.createObjectURL(file);
    updateSubCategory(indexNo, subCategory.name, image, file);
  };

  //   console.log("subcategories", subCategory)

  return (
    <div className="border-b border-[#3C3C3C]/30">
      <div className="flex items-center gap-4 pb-4">
        {/* Image */}
        <label className="w-fit cursor-pointer">
          <Avatar className="size-[50px] md:size-[60px]">
            {subCategory.image ? (
              <AvatarImage src={subCategory.image}/>
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
        </div>
      </div>
    </div>
  );
}
