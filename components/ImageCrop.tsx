"use client";

import React, { useCallback, useState, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X, Upload, RotateCw, Check } from "lucide-react";
import clsx from "clsx";

interface ImageCropProps {
  height: number;
  width: number;
  onCropComplete: (blob: Blob) => void;
  onCancel?: () => void;
  initialImage?: string;
  aspect?: number;
  className?: string;
}

export function ImageCrop({
  height,
  width,
  onCropComplete,
  onCancel,
  initialImage,
  aspect,
  className,
}: ImageCropProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(initialImage || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatio = aspect || width / height;

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCroppedAreaPixels(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });

  const handleCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const { width: cropWidth, height: cropHeight } = croppedAreaPixels;
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.translate(cropWidth / 2, cropHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-cropWidth / 2, -cropHeight / 2);

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
          }
          setIsProcessing(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Error cropping image:", error);
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation, onCropComplete]);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      {!imageSrc ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 mb-1">Click to upload an image</p>
          <p className="text-sm text-gray-500">
            Recommended size: {width} x {height} pixels
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Reset"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex max-md:flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setImageSrc(null);
                if (onCancel) onCancel();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleCrop}
              disabled={!croppedAreaPixels || isProcessing}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isProcessing ? "Processing..." : "Crop"}
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <p className="text-gray-600">Processing image...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCrop;
