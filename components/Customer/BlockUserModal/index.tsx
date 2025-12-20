"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Ban } from "lucide-react";
import Image from "next/image";
import { User } from "@/types/users.types";

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: () => void;
  user: User | null;
}

export function BlockUserModal({
  isOpen,
  onClose,
  onBlock,
  user,
}: BlockUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl border-0 bg-white p-0 shadow-xl sm:max-w-md"
      >
        {/* Close button */}
        <DialogHeader>
          <DialogTitle className='sr-only'>{user?.name}</DialogTitle>
        </DialogHeader>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Modal content */}
        <div className="flex flex-col items-center px-6 py-8 text-center">
          {/* Profile image with block icon */}
          <div className="relative mb-4">
            <div className="h-20 w-20 overflow-hidden rounded-full">
              <Image
                src={"/placeholder.svg?height=80&width=80"}
                alt={user?.name || "user"}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Block icon overlay */}
            {user?.status === "ACTIVE" && (
              <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500">
                <Ban className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* User name */}
          <h2 className="mb-3 text-lg font-normal text-[#303030]">
            {user?.name}
          </h2>

          {/* Confirmation text */}
          <p className="mb-6 text-lg font-medium text-black">
            Do you want to {user?.status === "ACTIVE" ? "block": "unblock"} this account?
          </p>

          {/* Action buttons */}
          <div className="flex w-full gap-3">
            <Button
              onClick={onClose}
              variant="secondary"
              className="cursor-pointer flex-1 rounded-full border-0 bg-gray-400 py-3 font-medium text-white hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={onBlock}
              className="cursor-pointer flex-1 rounded-full border-0 bg-red-500 py-3 font-medium text-white hover:bg-red-600"
            >
              {user?.status === "ACTIVE" ? "Block": "Unblock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
