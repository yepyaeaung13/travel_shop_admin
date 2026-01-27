"use client";
import ImageUpload from "@/assets/icons/upload/ImageUpload";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { WalletPay } from "@/app/(admin)/wallet/page";
import Image from "next/image";
import { CustomSwitch } from "../ui/switch";
import { ChevronDown } from "lucide-react";
import ImageUpload2 from "@/assets/icons/upload/ImageUpload2";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";

type Props = {
  wallet: WalletPay;
  handlePublishStatus: (id: number) => void;
};

const WalletItem = ({ wallet, handlePublishStatus }: Props) => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [QRImage, setQRImage] = useState("");

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setQRImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-full rounded-[10px] bg-white space-y-4">
      <div className="flex justify-between pl-5">
        <div className="flex items-center gap-4 py-5">
          <Image
            src={wallet.image || "/images/kpay.png"}
            alt="kpay"
            width={50}
            height={50}
            className="size-10 md:size-[50px] rounded-[10px]"
          />
          <p className="text-base md:text-lg font-medium text-[#303030]">
            {wallet.name}
          </p>
        </div>
        <div className="flex items-center">
          <div
            className={cn(
              "size-4 rounded-full mr-4 md:mr-[30px]",
              wallet.status ? "bg-[#126D00]" : "bg-[#3C3C3C]/50",
            )}
          />
          <CustomSwitch
            checked={wallet.status}
            onCheckedChange={() => handlePublishStatus(wallet.id)}
          />
          <div
            className={cn(
              "ml-4 md:ml-[30px] h-full flex items-center p-3 md:p-5 justify-center",
              !openDropdown && "border-l border-[#A1A1A1]/50",
            )}
          >
            <ChevronDown
              className="size-6 text-[#3C3C3C]  cursor-pointer"
              onClick={() => setOpenDropdown(!openDropdown)}
            />
          </div>
        </div>
      </div>
      {openDropdown && (
        <div className="px-5 pb-5 flex flex-col md:flex-row md:items-start md:justify-between gap-2.5 md:gap-5">
          {wallet.type === "pay" && (
            <>
              {QRImage ? (
                <div className="w-[120px] md:w-[161px] shrink-0 aspect-square relative">
                  <Image
                    src={QRImage}
                    alt="slip"
                    width={161}
                    height={161}
                    className="w-[120px] md:w-[161px] h-[120px] md:h-[161px] rounded-[10px]"
                  />
                  <label
                    htmlFor="qr"
                    className="cursor-pointer absolute bottom-1.5 right-1.5"
                  >
                    <ImageUpload2 />
                    <input
                      id="qr"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleUploadImage}
                    />
                  </label>
                </div>
              ) : (
                <label
                  className="flex flex-col space-y-2.5 cursor-pointer"
                  htmlFor="qr"
                >
                  <input
                    id="qr"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUploadImage}
                  />
                  <span className="text-base md:text-lg font-normal text-[#303030]">
                    QR photo <span className="text-[#FF3333]">*</span>
                  </span>
                  <div className="border-dashed border rounded-[20px] flex items-center justify-center w-[120px] md:w-[161px] aspect-square border-[#A1A1A1]">
                    <ImageUpload />
                  </div>
                </label>
              )}
            </>
          )}
          <div className="w-full h-full flex flex-col">
            <div className="space-y-2.5 flex flex-col">
              <span className="text-base md:text-lg font-normal text-[#303030]">
                Account name <span className="text-[#FF3333]">*</span>
              </span>
              <input
                placeholder="Account name"
                className="border rounded-[10px] border-[#3C3C3C]/30 h-[46px] md:h-14 px-5 text-sm md:text-base font-normal"
              />
            </div>
            <div className="space-y-2.5 flex flex-col md:mt-4 md:mb-5 mt-2.5 mb-4">
              <span className="te xt-base md:text-lg font-normal text-[#303030]">
                Account phone number <span className="text-[#FF3333]">*</span>
              </span>
              <input
                placeholder="Account phone number"
                className="border rounded-[10px] border-[#3C3C3C]/30 h-[46px] md:h-14 px-5 text-sm md:text-base font-normal"
              />
            </div>
            <div className="flex items-center justify-center gap-2.5 w-full">
              {wallet.type === "bank" && (
                <div className="w-[30%] max-md:hidden" />
              )}
              <Button
                type="button"
                onClick={() => setDiscardModalOpen(true)}
                disabled={isSaving || disabled}
                className={cn(
                  "h-12 w-full flex-1 rounded-[10px] bg-[#A1A1A1] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#444444] active:scale-95 md:w-full md:text-lg",
                  disabled || (isSaving && "bg-[#444444]/50"),
                )}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setSaveModalOpen(true)}
                disabled={isSaving || disabled}
                className={cn(
                  "bg-primary h-12 w-full flex-1 rounded-[10px] py-1.5 text-base font-medium text-white duration-300 active:scale-95 md:w-full md:text-lg",
                  disabled && "bg-primary/50",
                )}
              >
                {wallet.status
                  ? isSaving
                    ? "Saving..."
                    : "Save"
                  : isSaving
                    ? "Publishing..."
                    : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={saveModalOpen}
        setOpen={setSaveModalOpen}
        callback={() => {
          setSaveModalOpen(false);
        }}
        loading={false}
        title="Are you sure you want to save your changes?"
        description={""}
        className="w-[450px]"
        titleClassName="w-full"
      />

      <ConfirmDialog
        open={discardModalOpen}
        setOpen={setDiscardModalOpen}
        callback={() => {
          setDiscardModalOpen(false);
        }}
        loading={false}
        title="Are you sure you want to discard all changes?"
        description="This action cannot be undone"
        className="w-[450px]"
        titleClassName="max-w-[290px]"
      />
    </div>
  );
};

export default WalletItem;
