"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, MoreVertical, Star } from "lucide-react";
import IconImagePlus from "@/utils/icons/IconImagePlus";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/store/useProductStore";
import IconTrash from "@/assets/icons/Trash";
import { ImageCrop } from "@/components/ImageCrop";

type Props = {
  images: ProductImage[];
  replaceMainImage: (image: ProductImage) => void;
  addImage: (image: ProductImage) => void;
  removeImage: (index: number) => void;
  cropHeight?: number;
  cropWidth?: number;
};

const MAX_IMAGES = 5;

export default function PhotoSection({
  images,
  replaceMainImage,
  addImage,
  removeImage,
  cropHeight = 500,
  cropWidth = 500,
}: Props) {
  const [cropSlot, setCropSlot] = useState<number | null>(null);
  const [isMainCrop, setIsMainCrop] = useState(false);

  const handleUploadClick = (e: React.MouseEvent, slot: number, isMain: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setCropSlot(slot);
    setIsMainCrop(isMain);
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
    const image: ProductImage = {
      file,
      url: URL.createObjectURL(file),
      isMain: isMainCrop,
    };

    if (cropSlot === 0 || isMainCrop) {
      replaceMainImage(image);
    } else if (cropSlot !== null) {
      addImage(image);
    }

    setCropSlot(null);
  };

  const handleCropCancel = () => {
    setCropSlot(null);
  };

  const renderImage = (image: ProductImage, index: number, isMain = false) => (
    <div
      key={image.url}
      className={cn(
        "group relative",
        isMain ? "h-[241px] md:h-48 w-full md:w-40" : "size-36 md:size-32",
      )}
    >
      {isMain ? (
        <div className="relative cursor-pointer" onClick={(e) => handleUploadClick(e, 0, true)}>
          <img
            src={image.url || "/placeholder.svg"}
            alt="Product"
            className="h-[241px] md:h-full w-full object-cover rounded-[20px]"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px] flex items-center justify-center">
            <span className="text-white text-sm">Click to change</span>
          </div>
        </div>
      ) : (
        <img
          src={image.url || "/placeholder.svg"}
          alt="Product"
          className="h-full w-full object-cover rounded-[20px]"
        />
      )}

      {!isMain && (
        <div className="absolute right-2 top-2">
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="text-red-600 bg-[#F6F1F4] w-[30px] h-[30px] rounded-full flex items-center justify-center"
          >
            <IconTrash />
          </button>
        </div>
      )}
    </div>
  );

  const renderUploadSlot = (size: "main" | "other", slot: number) => (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 hover:dark:bg-neutral-800",
        size === "main" ? "h-48 w-full md:w-40" : "h-[144px] w-full md:size-32",
        size === "other" && images.length >= MAX_IMAGES && "cursor-not-allowed opacity-50",
      )}
      onClick={(e) => handleUploadClick(e, slot, size === "main")}
    >
      <div className="text-center text-gray-400">
        <IconImagePlus className={size === "main" ? "h-8 w-8" : "h-6 w-6"} />
      </div>
    </div>
  );

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-medium">Photo</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 md:flex-row gap-5">
          {/* MAIN SLOT (index 0) */}
          <div className="space-y-2">
            <div className="text-base md:text-lg font-normal text-[#303030]">
              Showcase photo <span className="text-red-500">*</span>
            </div>

            {images[0]
              ? renderImage(images[0], 0, true)
              : renderUploadSlot("main", 0)}
          </div>

          {/* OTHER 4 SLOTS (index 1–4) */}
          <div className="space-y-2">
            <div className="text-base md:text-lg font-normal text-[#303030]/50">
              Photos <span className="">(max 5 photos)</span>
            </div>

            <div
              className={cn(
                "grid max-w-[600px] grid-cols-2 gap-2 md:grid-cols-4",
              )}
            >
              {Array.from({ length: 4 }).map((_, slotIndex) => {
                const imageIndex = slotIndex + 1;
                const image = images[imageIndex];

                return image ? (
                  renderImage(image, imageIndex)
                ) : (
                  <div key={slotIndex}>
                    {renderUploadSlot("other", imageIndex)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>

      {/* IMAGE CROP DIALOG */}
      {cropSlot !== null && (
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
                className=""
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
