// components/AdminTopbar.tsx
"use client";

import { GripVertical } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import IconNotification from "@/assets/icons/sidebar/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavStore } from "@/store/useNavStore";
const header = (pathname: string) => {
  // Product
  if (
    pathname.startsWith("/products") ||
    pathname.startsWith("/products/new") ||
    pathname.startsWith("/products/edit")
  ) {
    return "Product Management";
  }

  // Category
  if (
    pathname.startsWith("/categories") ||
    pathname.startsWith("/categories/new") ||
    pathname.startsWith("/categories/edit")
  ) {
    return "Category Management";
  }

  // customer
  if (pathname.startsWith("/customers")) {
    return "Customer Management";
  }

  // Blog
  if (
    pathname.startsWith("/blogs") ||
    pathname.startsWith("/blogs/new") ||
    pathname.startsWith("/blogs/edit")
  ) {
    return "Blog Management";
  }

  // Activity
  if (
    pathname.startsWith("/activities") ||
    pathname.startsWith("/activities/new") ||
    pathname.startsWith("/activities/edit")
  ) {
    return "Activity management";
  }

  return "Admin dashboard";
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const { open, setOpen } = useNavStore();
  const { loginInfo } = useAuthStore();
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
            open && "bg-[#E4E6FF]"
          )}
        >
          <GripVertical
            className={cn(open ? "text-primary" : "text-[#444444]")}
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
          <IconNotification className="size-6 mr-4" />
          {loginInfo?.picture ? (
            <Image
              src={loginInfo.picture}
              alt="Profile"
              width={40}
              height={40}
              className="size-10 rounded-full border"
            />
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
