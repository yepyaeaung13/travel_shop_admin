"use client";

import { Card, CardContent } from "@/components/ui/card";
import IconTrash from "../../assets/icons/Trash";
import { Label } from "@/components/ui/label";
import IconUpload from "../../assets/icons/upload";
import IconPhoto from "../../assets/icons/photo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import Image from "next/image";
import { ImageCrop } from "@/components/ImageCrop";
import { X } from "lucide-react";

export default function CategoryImageUpload({
  categoryImage,
  imagePreview,
  onImageChange,
  onImageRemove,
  existingImageUrl,
  className,
  text,
  title,
  cropHeight = 300,
  cropWidth = 300,
}: {
  categoryImage: File | null;
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  existingImageUrl?: string;
  className?: string;
  text: ReactNode;
  title: string;
  cropHeight?: number;
  cropWidth?: number;
}) {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImagePreview(event.target?.result as string);
        setShowCropDialog(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
    onImageChange(file);
    setShowCropDialog(false);
    setTempImagePreview(null);
  };

  const handleCropCancel = () => {
    setShowCropDialog(false);
    setTempImagePreview(null);
  };

  return (
    <>
      <Card className="px-5">
        <CardContent className="space-y-4 px-0">
          <h2 className="text-lg md:text-xl font-medium text-black">
            {title} <span className="text-[#FF3333]">*</span>
          </h2>
          {categoryImage || existingImageUrl ? (
            <div className={cn("relative", className)}>
              <Image
                src={imagePreview || `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${existingImageUrl}` || "/placeholder.svg"}
                alt="Category"
                width={400}
                height={200}
                className="w-full h-full object-cover rounded-lg border border-primary"
              />
              <button
                type="button"
                onClick={onImageRemove}
                className="absolute top-5 right-5 p-2 rounded-[10px] bg-background hover:opacity-90 shadow-md"
              >
                <IconTrash className="w-5 h-5 text-destructive" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempImagePreview(imagePreview || `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${existingImageUrl}`);
                  setShowCropDialog(true);
                }}
                className="absolute top-5 right-14 p-2 rounded-[10px] bg-background hover:opacity-90 shadow-md"
              >
                <IconUpload className="w-5 h-5 text-primary" />
              </button>
            </div>
          ) : (
            <div className="bg-[#616FF514]">
              <Label htmlFor={title} className="cursor-pointer">
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
                id={title}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* IMAGE CROP DIALOG */}
      {showCropDialog && (
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
