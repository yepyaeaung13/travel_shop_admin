"use client";

import React, { useRef, useState } from "react";
import { ImageCrop } from "../ImageCrop";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import IconTrash from "@/assets/icons/Trash";

type Props = {
  isImage: boolean;
  isVideo: boolean;
  onImageUpload?: (blob: Blob) => void;
  onVideoUpload?: (file: File) => void;
};

const BannerImageUpload = ({
  isImage,
  isVideo,
  onImageUpload,
  onVideoUpload,
}: Props) => {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
  const [showVideoErrorDialog, setShowVideoErrorDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<"image" | "video" | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleVideoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check video duration
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 5) {
          setShowVideoErrorDialog(true);
        } else {
          const videoUrl = URL.createObjectURL(file);
          setUploadedVideo(videoUrl);
          if (onVideoUpload) {
            onVideoUpload(file);
          }
        }
      };

      video.src = URL.createObjectURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = (blob: Blob) => {
    const imageUrl = URL.createObjectURL(blob);
    setUploadedImage(imageUrl);
    if (onImageUpload) {
      onImageUpload(blob);
    }
    setShowCropDialog(false);
    setTempImagePreview(null);
  };

  const handleCropCancel = () => {
    setShowCropDialog(false);
    setTempImagePreview(null);
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleVideoButtonClick = () => {
    videoInputRef.current?.click();
  };

  const handleDeleteClick = (type: "image" | "video") => {
    setDeleteType(type);
    setShowDeleteConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteType === "image" && uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
    } else if (deleteType === "video" && uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo);
      setUploadedVideo(null);
    }
    setShowDeleteConfirmDialog(false);
    setDeleteType(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmDialog(false);
    setDeleteType(null);
  };

  // Show uploaded image
  if (uploadedImage) {
    return (
      <>
        <div className="h-[170px] md:h-[200px] w-full flex-1 relative">
          <div className="w-full h-full flex items-center justify-center border border-dashed rounded-[16px] border-[#A1A1A1] overflow-hidden">
            <img
              src={uploadedImage}
              alt="Uploaded banner"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            onClick={() => handleDeleteClick("image")}
            className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>

        {/* DELETE CONFIRM DIALOG */}
        {showDeleteConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex items-start justify-end w-full">
                  <X
                    className="size-7 p-1 cursor-pointer rounded-full hover:bg-gray-300"
                    onClick={() => setShowVideoErrorDialog(false)}
                  />
                </div>
                <p className="text-black mb-4">
                  Are you sure you want to delete this banner?
                </p>
                <div className="flex items-center w-full justify-between gap-2.5">
                  <Button
                    type="button"
                    onClick={handleCancelDelete}
                    className="bg-[#A1A1A1] hover:bg-[#A1A1A1] h-[41px] w-full flex-1 rounded-[10px] text-base font-normal text-white hover:opacity-90 md:h-[47px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleConfirmDelete}
                    className="bg-[#FF3333] hover:bg-[#FF3333] h-[41px] w-full flex-1 rounded-[10px] text-base font-normal text-white hover:opacity-90 md:h-[47px]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Show uploaded video
  if (uploadedVideo) {
    return (
      <>
        <div className="h-[170px] md:h-[200px] w-full flex-1 relative">
          <div className="w-full h-full flex items-center justify-center border border-dashed rounded-[16px] border-[#A1A1A1] overflow-hidden">
            <video
              src={uploadedVideo}
              className="max-h-full max-w-full object-contain"
              controls
            />
          </div>
          <button
            onClick={() => handleDeleteClick("video")}
            className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>

        {/* DELETE CONFIRM DIALOG */}
        {showDeleteConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex items-start justify-end w-full">
                  <X
                    className="size-7 p-1 cursor-pointer rounded-full hover:bg-gray-300"
                    onClick={() => setShowVideoErrorDialog(false)}
                  />
                </div>
                <p className="text-black mb-4">
                  Are you sure you want to delete this banner?
                </p>
                <div className="flex items-center w-full justify-between gap-2.5">
                  <Button
                    type="button"
                    onClick={handleCancelDelete}
                    className="bg-[#A1A1A1] hover:bg-[#A1A1A1] h-[41px] w-full flex-1 rounded-[10px] text-base font-normal text-white hover:opacity-90 md:h-[47px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleConfirmDelete}
                    className="bg-[#FF3333] hover:bg-[#FF3333] h-[41px] w-full flex-1 rounded-[10px] text-base font-normal text-white hover:opacity-90 md:h-[47px]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="h-[170px] md:h-[200px] w-full flex-1">
        <div className="w-full h-full flex flex-col items-center justify-center border border-dashed rounded-[16px] border-[#A1A1A1]">
          <span className="text-base md:text-lg font-medium text-black pb-2.5">Upload</span>
          <div className="text-sm md:text-base text-center font-normal text-[#3C3C3C]/50">
            {isVideo && <p>Video must be under 5 seconds. </p>}
            {isImage && <p>Image size: 1440 × 661 px.</p>}
          </div>
          <div className="flex pt-5 gap-4 items-center justify-center">
            {isImage && (
              <button
                onClick={handleImageButtonClick}
                className="border border-[#303030]/60 rounded-[10px] h-10 md:h-[45px] w-[130px] md:w-[140px] flex items-center justify-center"
              >
                Image
              </button>
            )}
            {isVideo && (
              <button
                onClick={handleVideoButtonClick}
                className="border border-[#303030]/60 rounded-[10px] h-10 md:h-[45px] w-[130px] md:w-[140px] flex items-center justify-center"
              >
                Video
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoFileChange}
        className="hidden"
      />

      {/* IMAGE CROP DIALOG */}
      {showCropDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
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
                height={661}
                width={1440}
                aspect={1440 / 661}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
                initialImage={tempImagePreview || undefined}
                className="min-h-[400px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIDEO ERROR DIALOG */}
      {showVideoErrorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-start justify-between w-full">
                <div className="size-6" />
                <div>
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M27.0833 6.77344H14.5833C7.45833 6.77344 4.6875 9.54427 4.6875 16.6693V33.3359C4.6875 38.1276 7.29167 43.2318 14.5833 43.2318H27.0833C34.2083 43.2318 36.9792 40.4609 36.9792 33.3359V16.6693C36.9792 9.54427 34.2083 6.77344 27.0833 6.77344Z"
                      fill="#616FF5"
                    />
                    <path
                      d="M23.9596 23.7083C26.1228 23.7083 27.8763 21.9548 27.8763 19.7917C27.8763 17.6286 26.1228 15.875 23.9596 15.875C21.7965 15.875 20.043 17.6286 20.043 19.7917C20.043 21.9548 21.7965 23.7083 23.9596 23.7083Z"
                      fill="#616FF5"
                    />
                    <path
                      d="M45.1042 12.8522C44.25 12.4147 42.4583 11.9147 40.0208 13.6231L36.9375 15.7897C36.9583 16.0814 36.9792 16.3522 36.9792 16.6647V33.3314C36.9792 33.6439 36.9375 33.9147 36.9375 34.2064L40.0208 36.3731C41.3125 37.2897 42.4375 37.5814 43.3333 37.5814C44.1042 37.5814 44.7083 37.3731 45.1042 37.1647C45.9583 36.7272 47.3958 35.5397 47.3958 32.5606V17.4564C47.3958 14.4772 45.9583 13.2897 45.1042 12.8522Z"
                      fill="#616FF5"
                    />
                  </svg>
                </div>
                <X
                  className="size-7 p-1 cursor-pointer rounded-full hover:bg-gray-300"
                  onClick={() => setShowVideoErrorDialog(false)}
                />
              </div>
              <p className="text-gray-600 mb-4">
                Video must be under 5 seconds
              </p>
              <Button
                type="submit"
                onClick={() => setShowVideoErrorDialog(false)}
                className="bg-primary h-[41px] w-full rounded-[10px] text-base font-normal text-white hover:opacity-90 md:h-[47px]"
              >
                Chooose new one
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannerImageUpload;
