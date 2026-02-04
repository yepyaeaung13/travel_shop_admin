"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import AcceptImg from "@/assets/order/order-accpet-icon.png";
import RejectImg from "@/assets/order/order-reject-icon.png";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (value: string) => void;
  variant: "Reject" | "Accept";
}

const AcceptRejectModal = ({
  isOpen,
  onClose,
  onClick,
  variant,
}: ModalProps) => {
  const [editNotes, setEditNotes] = useState("");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">Accept or Reject Dialog</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl border-0 bg-white p-0 shadow-xl dark:bg-gray-800 sm:max-w-md"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="dark:hover:gray-600 absolute right-4 top-4 z-10 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Modal content */}
        <div className="flex flex-col items-center px-6 py-8 text-center">
          {/* Profile image with block icon */}
          <div className="relative mb-4">
            <Image
              src={variant === "Accept" ? AcceptImg : RejectImg}
              alt={variant}
              width={100}
              height={100}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Confirmation text */}
          <p className="mb-6 text-lg font-medium text-black dark:text-white">
            Do you want to {variant === "Accept" ? "accept" : "reject"} this
            order?
          </p>

          {variant === "Reject" && (
            <div className="flex w-full flex-col items-start space-y-2.5 pb-4 md:pb-5">
              <p className="text-base font-normal">
                Reason for rejection <span className="text-red-600">*</span>
              </p>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="E.g, Payment slip is unclear, name doesn’t match"
                aria-label="Reject notes"
                className="text-custom-dark-gray min-h-[96px] w-full resize-none rounded-[10px] border border-[#3C3C3C]/50 p-4 text-sm md:text-base leading-relaxed dark:bg-gray-800"
                maxLength={500}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex w-full gap-3">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1 cursor-pointer rounded-[10px] border-0 bg-gray-400 py-3 font-medium text-white hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onClick(editNotes)}
              className={cn(
                "flex-1 cursor-pointer rounded-[10px] border-0  py-3 font-medium text-white",
                variant === "Accept"
                  ? "bg-primary hover:bg-primary/70"
                  : "bg-red-500 hover:bg-red-600",
              )}
            >
              {variant === "Accept" ? "Accept" : "Reject"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptRejectModal;
