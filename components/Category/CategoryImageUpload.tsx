"use client";

import { Card, CardContent } from "@/components/ui/card";
import IconTrash from "../../assets/icons/Trash";
import { Label } from "@/components/ui/label";
import IconUpload from "../../assets/icons/upload";
import IconPhoto from "../../assets/icons/photo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CategoryImageUpload({
  categoryImage,
  imagePreview,
  onImageChange,
  onImageRemove,
  existingImageUrl,
  className,
  text,
  title,
}: {
  categoryImage: File | null;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  existingImageUrl?: string;
  className?: string;
  text: ReactNode;
  title: string;
}) {
  return (
    <Card className="px-5">
      <CardContent className="space-y-4 px-0">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          {title} <span className="text-[#FF3333]">*</span>
        </h2>
        {categoryImage || existingImageUrl ? (
          <div className={cn("relative", className)}>
            <img
              src={imagePreview || existingImageUrl || "/placeholder.svg"}
              alt="Category"
              className="w-full h-full object-cover rounded-lg border border-primary"
            />
            <button
              type="button"
              onClick={onImageRemove}
              className="absolute top-5 right-5 p-2 rounded-[10px] bg-background hover:opacity-90 shadow-md"
            >
              <IconTrash className="w-5 h-5 text-destructive" />
            </button>
          </div>
        ) : (
          <div className="bg-[#616FF514]">
            <Label htmlFor="category-image" className="cursor-pointer">
              <div
                className={cn(
                  "rounded-lg w-full flex flex-col space-y-3 items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors border border-primary",
                  className
                )}
              >
                <IconPhoto />
                <div className="flex flex-row gap-3 items-center">
                  <IconUpload className="w-5 h-5 text-primary" />
                  <p className="text-xs md:text-sm text-primary font-medium">
                    Upload {title}
                  </p>
                </div>
                <p className="text-sm font-normal text-muted-foreground px-4 text-center">
                  {text}
                </p>
              </div>
            </Label>
            <Input
              id="category-image"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
