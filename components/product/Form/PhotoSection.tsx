"use client";

import type React from "react";
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

type Props = {
  images: ProductImage[];
  replaceMainImage: (image: ProductImage) => void;
  addImage: (image: ProductImage) => void;
  removeImage: (index: number) => void;
};

const MAX_IMAGES = 5;

export default function PhotoSection({ images, replaceMainImage, addImage, removeImage }: Props) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= MAX_IMAGES) return;

    addImage({
      file,
      url: URL.createObjectURL(file),
      isMain: true,
    });

    e.target.value = "";
  };

  const handleMainUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    replaceMainImage({
      file,
      url: URL.createObjectURL(file),
      isMain: true,
    });

    e.target.value = "";
  };

  const renderImage = (image: ProductImage, index: number, isMain = false) => (
    <div
      key={image.url}
      className={cn(
        "group relative",
        isMain ? "h-48 w-full md:w-40" : "size-36 md:size-32",
      )}
    >
      {isMain ? (
        <label className="cursor-pointer">
          <img
            src={image.url || "/placeholder.svg"}
            alt="Product"
            className="h-full w-full object-cover rounded-[20px]"
          />
          <input type="file" accept="image/*" hidden onChange={handleMainUpload} />
        </label>
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

  const renderUploadSlot = (
    size: "main" | "other",
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 hover:dark:bg-neutral-800",
        size === "main" ? "h-48 w-full md:w-40" : "size-36 md:size-32",
        images.length === 0 && size === "other" && "cursor-not-allowed",
      )}
      onClick={(e) => {
        if (images.length === 0 && size === "other") {
          e.preventDefault();
        }
      }}
    >
      <div className="text-center text-gray-400">
        <IconImagePlus className={size === "main" ? "h-8 w-8" : "h-6 w-6"} />
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={onUpload}
          required={size === "main"}
        />
      </div>
    </label>
  );

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-medium">Photo</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 md:flex-row">
          {/* MAIN SLOT (index 0) */}
          <div className="space-y-2">
            <div className="text-base md:text-lg font-normal text-[#303030]">
              Showcase photo <span className="text-red-500">*</span>
            </div>

            {images[0]
              ? renderImage(images[0], 0, true)
              : renderUploadSlot("main", handleUpload)}
          </div>

          {/* OTHER 4 SLOTS (index 1–4) */}
          <div className="flex-1 space-y-2">
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
                    {renderUploadSlot("other", handleUpload)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
