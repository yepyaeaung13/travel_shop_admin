"use client";

import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, MoreVertical, Star } from "lucide-react";
import IconImagePlus from "@/utils/icons/IconImagePlus";
import { cn } from "@/lib/utils";
import { FormMessage } from "@/components/ui/form";
import { CreateProductPayload } from "@/types/product/product-form.schemas";
import { useProductImages } from "@/hooks/products/useProductImages";

interface PhotoSectionProps {
  form: UseFormReturn<CreateProductPayload>;
}

export default function PhotoSection({ form }: PhotoSectionProps) {
  const maxImages = 5;
  const images = form.watch("images") ?? [];
  const error = form.getFieldState("images")?.error;

  const {
    showcase,
    others,
    addFiles,
    removeImage,
    setShowcase,
    replaceMainImage,
  } = useProductImages({
    images,
    maxImages,
    onChange: (next) => {
      form.setValue("images", next);
      form.clearErrors("images");
    },
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    addFiles(files);
    event.target.value = "";
  };

  const handleMainImageReplace = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      replaceMainImage(file);
    }
    event.target.value = "";
  };

  const renderImageSlot = (
    image: { url: string; isMain: boolean },
    isShowcase = false,
  ) => (
    <div
      key={image.url}
      className={cn([
        "group relative size-36 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 md:size-32",
        { "h-48 w-full md:w-40": isShowcase },
      ])}
    >
      <img
        src={image.url || "/placeholder.svg"}
        alt="Product"
        className="h-full w-full object-cover"
      />

      {isShowcase && (
        <div className="absolute left-1 top-1 rounded-full bg-yellow-500 p-1 text-white">
          <Star className="h-3 w-3 fill-current" />
        </div>
      )}

      <div className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full bg-black/50 p-1 text-white hover:bg-black/70">
              <MoreVertical className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {isShowcase ? (
              // Options for Main Image: Edit only
              <DropdownMenuItem asChild>
                <label className="flex h-full w-full cursor-pointer items-center justify-center hover:bg-gray-50 hover:dark:bg-neutral-800">
                  Edit
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageReplace}
                    className="hidden"
                  />
                </label>
              </DropdownMenuItem>
            ) : (
              // Options for Other Images: Set Showcase & Delete
              <>
                {!image.isMain && (
                  <DropdownMenuItem
                    onClick={() => setShowcase(image.url)}
                    className="text-sm"
                  >
                    <Star className="mr-2 h-3 w-3" />
                    Set as showcase
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => removeImage(image.url)}
                  className="text-sm text-red-600"
                >
                  <X className="mr-2 h-3 w-3" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const renderUploadSlots = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="size-36 overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 md:size-32"
      >
        <label className="flex h-full w-full cursor-pointer items-center justify-center hover:bg-gray-50 hover:dark:bg-neutral-800">
          <IconImagePlus className="h-6 w-6 text-gray-400" />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    ));

  const remainingSlots = maxImages - images.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Showcase */}
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Showcase photo <span className="text-red-500">*</span>
            </div>

            {showcase ? (
              renderImageSlot(showcase, true)
            ) : (
              <label className="flex h-48 w-full cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 md:w-40 dark:bg-transparent hover:dark:bg-neutral-800">
                <div className="text-center text-gray-400">
                  <IconImagePlus className="mx-auto mb-1 h-8 w-8" />
                  <div className="text-xs">Upload photos</div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                </div>
              </label>
            )}
          </div>

          {/* Grid */}
          <div className="flex-1 space-y-2">
            <div className="text-sm font-medium">
              Photos{" "}
              <span className="text-gray-500">
                (max {maxImages} photos)
              </span>
              <span className="text-red-500">*</span>
            </div>

            <div className="grid max-w-[600px] grid-cols-2 gap-2 md:grid-cols-4">
              {others.map((image) => renderImageSlot(image))}
              {remainingSlots > 0 &&
                renderUploadSlots(remainingSlots)}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {error && <FormMessage>{error.message}</FormMessage>}
      </CardFooter>
    </Card>
  );
}