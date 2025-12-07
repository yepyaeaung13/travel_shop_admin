"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  isEditInfo: boolean;
  loading: boolean;
}

export function ChangeConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isEditInfo,
  loading,
}: Props) {
  const onConfirmChange = () => {
    onConfirm?.();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl border-0 bg-white p-0 shadow-xl sm:max-w-md"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        {/* Modal content */}
        <div className="flex flex-col items-center p-4 text-center">
          {/* Confirmation text */}
          <p className="mb-2.5 mt-8 text-xl font-medium text-black">
            Confirm changes
          </p>
          <p className="mb-5 text-base font-medium text-black">
            You are about to change you login credentials
          </p>

          <div className="mb-5 rounded-[10px] border border-[#FF3333] bg-[#FF3333]/10 p-4 text-base font-normal text-[#FF3333]">
            {isEditInfo ? (
              <p className="text-center">
                You new email will be used for future logins.
              </p>
            ) : (
              <>
                <p className="text-center">
                  You new password will be used for future logins.
                </p>
                <p className="text-center">
                  Please remember you new credentials. You will need them to log
                  in next time
                </p>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex w-full gap-3">
            <Button
              onClick={onClose}
              disabled={loading}
              variant="secondary"
              className="h-[41px] flex-1 cursor-pointer rounded-[10px] border-0 bg-gray-400 text-base font-medium text-white hover:bg-gray-500 md:h-12 md:text-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirmChange}
              disabled={loading}
              className="bg-primary hover:bg-primary h-[41px] flex-1 cursor-pointer rounded-[10px] border-0 text-base font-medium text-white md:h-12 md:text-lg"
            >
              {loading ? "..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
