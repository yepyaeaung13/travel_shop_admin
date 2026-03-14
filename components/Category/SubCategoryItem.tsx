"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IconTrash from "@/assets/icons/Trash";
import { SubCategory } from "@/types/category.types";
import CameraUpIcon from "@/assets/icons/CameraUpIcon";
import { errorToast } from "../toast";
import { useState } from "react";
import { ImageCrop } from "@/components/ImageCrop";
import { X } from "lucide-react";

type Props = {
  indexNo: number;
  subCategory: SubCategory;
  removeSubCategory: (indexNo: number) => void;
  updateSubCategory: (
    indexNo: number,
    name?: string,
    image?: string,
    file?: File,
  ) => void;
  cropHeight?: number;
  cropWidth?: number;
};

export default function SubCategoryItem({
  indexNo,
  subCategory,
  removeSubCategory,
  updateSubCategory,
  cropHeight = 300,
  cropWidth = 300,
}: Props) {
  if (!subCategory) return null;

  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // allow only english letters
    if (/^[A-Za-z]*$/.test(value)) {
      updateSubCategory(indexNo, value, subCategory.image);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_SIZE = 512 * 1024;
    if (file.size > MAX_SIZE) {
      errorToast("Image too large", "Image must be under 512 KB");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImagePreview(event.target?.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);
    updateSubCategory(indexNo, subCategory.name, imageUrl, file);
    setShowCropDialog(false);
    setTempImagePreview(null);
  };

  const handleCropCancel = () => {
    setShowCropDialog(false);
    setTempImagePreview(null);
  };

  const handleEditImage = () => {
    setTempImagePreview(subCategory.image);
    setShowCropDialog(true);
  };

  return (
    <>
      <div className="border-b border-[#3C3C3C]/30">
        <div className="flex items-center gap-4 pb-4">
          {/* Image */}
          <div className="relative">
            <label className="w-fit cursor-pointer block">
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
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>
            {subCategory.image && (
              <button
                type="button"
                onClick={handleEditImage}
                className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md border"
              >
                <CameraUpIcon className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Name */}
          <div className="flex-1">
            <Input
              placeholder="Sub-category name"
              value={subCategory.name}
              onChange={handleNameChange}
              className={cn(
                "h-12 w-full rounded-[10px] text-sm md:h-14 md:max-w-[344px] md:text-base border-[#3C3C3C4D]",
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

      {/* IMAGE CROP DIALOG */}
      {showCropDialog && tempImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Crop Image</h3>
              <button
                type="button"
                onClick={handleCropCancel}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <ImageCrop
                height={cropHeight}
                width={cropWidth}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
                initialImage={tempImagePreview || undefined}
                className="min-h-[400px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
