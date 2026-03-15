// components/AdminTopbar.tsx
"use client";

import { GripVertical } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import IconNotification from "@/assets/icons/sidebar/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavStore } from "@/store/useNavStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UnReadNotiContainer } from "@/components/notification/notification-container";
import NavBarNotification from "../notification/navbar-notification";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetNoti } from "@/queries/noti";
import IconNavbar from "@/assets/icons/sidebar/IconNavbar";

const header = (pathname: string) => {
  // Product
  if (pathname.startsWith("/product") || pathname.startsWith("/product/add")) {
    return "Product Management";
  }

  // Category
  if (
    pathname.startsWith("/category") ||
    pathname.startsWith("/category/add") ||
    pathname.startsWith("/category/products")
  ) {
    return "Category Management";
  }

  // orders
  if (pathname.startsWith("/orders")) {
    return "Order Management";
  }

  // customers
  if (pathname.startsWith("/customers")) {
    return "Customer Management";
  }

  // delivery
  if (pathname.startsWith("/delivery")) {
    return "Delivery Management";
  }

   // wallet
  if (pathname.startsWith("/wallet")) {
    return "Wallet Setup";
  }

   // noti
  if (pathname.startsWith("/notification")) {
    return "Notifications";
  }
  
  // settings
  if (pathname.startsWith("/settings") || pathname.startsWith("/store-front")) {
    return "Settings";
  }

  return "Admin dashboard";
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { open, setOpen } = useNavStore();
  const { loginInfo } = useAuthStore();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const isSeen = false;

  const { data: notiList, isLoading } = useGetNoti(limit, isSeen);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const title = useMemo(() => header(pathname), [pathname]);

  if (pathname.startsWith("/admin/signin")) return null;

  return (
    <header className="bg-card relative z-50 flex flex-col px-4 py-2.5 md:gap-12 md:px-7">
      <div className="bg-card relative flex items-center gap-1">
        <button
          onClick={toggleOpen}
          className={cn(
            "flex h-[40px] w-[40px] md:mr-10 items-center justify-center rounded-full",
          )}
        >
          <IconNavbar
            fill={open ? "#616ff5" : "#E4E6FF"}
            fill2={open ? "#fff" : "#3C3C3C"}
          />
        </button>
        <div className="flex items-center space-x-2 py-2 max-md:hidden md:space-x-4">
          <Image
            src="/logo.svg"
            alt="logo"
            width={40}
            height={40}
            className="w-6 2xl:w-10"
          />
          <h1 className="text-xl font-semibold 2xl:text-2xl">{title}</h1>
        </div>
        <div className="flex w-full flex-1 items-center justify-end">
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <button className="cursor-pointer relative">
                <IconNotification className="size-6 mr-4" />
                {notiList?.data?.length > 0 && (
                  <span className="absolute -top-3 md:-top-5 right-1.5 bg-red-500 text-white h-6 w-6 rounded-full text-[10px] flex justify-center items-center">
                    {notiList?.data?.length}{" "}
                    {notiList?.data?.length >= 10 && "+"}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="max-md:ml-6 mt-2 w-[350px] h-[523px] overflow-y-scroll hide-scrollbar py-5 px-4 border-none"
            >
              <NavBarNotification
                notiList={notiList?.data || []}
                setNotificationOpen={setNotificationOpen}
              />
            </PopoverContent>
          </Popover>
          {loginInfo?.picture ? (
            <Avatar>
              <AvatarImage
                src={loginInfo.picture}
                alt="Profile"
                width={40}
                height={40}
                className="size-10 rounded-full border"
              ></AvatarImage>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          ) : (
            <button className="size-10 bg-gray-300 rounded-full"></button>
          )}

          <div className="flex flex-col pl-2.5 max-md:hidden">
            <p className="text-lg font-normal">{loginInfo?.name}</p>
            <p className="text-sm font-normal">Admin</p>
          </div>
        </div>
      </div>
      <h1 className="text-xl font-semibold md:hidden md:text-2xl py-2">
        {title}
      </h1>
    </header>
  );
}
