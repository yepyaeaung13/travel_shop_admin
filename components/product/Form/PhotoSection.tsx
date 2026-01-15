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

type Props = {
  images: ProductImage[];
  addImage: (image: ProductImage) => void;
  removeImage: (index: number) => void;
};

const MAX_IMAGES = 5;

export default function PhotoSection({
  images,
  addImage,
  removeImage,
}: Props) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= MAX_IMAGES) return;

    addImage({
      file,
      url: URL.createObjectURL(file),
      isMain: true
    });

    e.target.value = "";
  };

  const renderImage = (
    image: ProductImage,
    index: number,
    isMain = false
  ) => (
    <div
      key={image.url}
      className={cn(
        "group relative size-36 overflow-hidden rounded-lg border md:size-32",
        isMain && "h-48 w-full md:w-40"
      )}
    >
      <img
        src={image.url || "/placeholder.svg"}
        alt="Product"
        className="h-full w-full object-cover"
      />

      {isMain && (
        <div className="absolute left-1 top-1 rounded-full bg-yellow-500 p-1 text-white">
          <Star className="h-3 w-3 fill-current" />
        </div>
      )}

      <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full bg-black/50 p-1 text-white">
              <MoreVertical className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => removeImage(index)}
              className="text-red-600"
            >
              <X className="mr-2 h-3 w-3" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const renderUploadSlot = (
    size: "main" | "other",
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 hover:dark:bg-neutral-800",
        size === "main"
          ? "h-48 w-full md:w-40"
          : "size-36 md:size-32"
      )}
    >
      <div className="text-center text-gray-400">
        <IconImagePlus
          className={size === "main" ? "h-8 w-8" : "h-6 w-6"}
        />
        <div className="text-xs">Upload</div>
        <input type="file" accept="image/*" hidden onChange={onUpload} />
      </div>
    </label>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 md:flex-row">
          {/* MAIN SLOT (index 0) */}
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Showcase photo <span className="text-red-500">*</span>
            </div>

            {images[0]
              ? renderImage(images[0], 0, true)
              : renderUploadSlot("main", handleUpload)}
          </div>

          {/* OTHER 4 SLOTS (index 1–4) */}
          <div className="flex-1 space-y-2">
            <div className="text-sm font-medium">
              Photos <span className="text-gray-500">(max 5 photos)</span>
            </div>

            <div className={cn("grid max-w-[600px] grid-cols-2 gap-2 md:grid-cols-4", images.length === 0 && "pointer-events-none")}>
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
