"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import logoutImg from "@/assets/setting/logout.png";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  const { setLoginInfo } = useAuthStore();
  const onLogout = () => {
    setLoginInfo(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.replace("/login");
    toast.success("Logout successfully")
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
          {/* Logout Icon */}
          <div className="relative mb-4 mt-8">
            <div className="h-[100px] w-[100px] overflow-hidden rounded-full">
              <Image
                src={logoutImg}
                alt="logout"
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Confirmation text */}
          <p className="mb-6 text-lg font-medium text-black">
            Do you want to log out?
          </p>

          {/* Action buttons */}
          <div className="flex w-full gap-3">
            <Button
              onClick={onClose}
              variant="secondary"
              className="h-[41px] flex-1 cursor-pointer rounded-[10px] border-0 bg-gray-400 text-base font-medium text-white hover:bg-gray-500 md:h-12 md:text-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={onLogout}
              className="h-[41px] flex-1 cursor-pointer rounded-[10px] border-0 bg-red-500 text-base font-medium text-white hover:bg-red-600 md:h-12 md:text-lg"
            >
              Log out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
