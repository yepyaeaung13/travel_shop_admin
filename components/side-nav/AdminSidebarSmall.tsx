// components/AdminSidebarSmall.tsx
"use client";

import { cn } from "@/lib/utils";
import IconLogout from "@/assets/icons/sidebar/Logout";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { sidebarItems } from "./AdminSidebarExpanded";
import ConfirmLogoutDialog from "./ConfirmLogoutDialog";
import { useState } from "react";
import Cookies from "js-cookie";
import { successToast } from "../toast";

export default function AdminSidebarSmall() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignout = () => {
    setLoading(true);
    localStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.replace("/login");
    console.log("Log out");
    successToast("Logout successfully");
    setLoading(false);
  };

  return (
    <aside className="hidden w-[100px] flex-col items-center space-y-1 bg-white py-7 md:flex">
      {sidebarItems.map((item) => {
        const isActive =
          pathname === item.path ||
          pathname === `${item.path}/new` ||
          pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            title={item.label}
            className={cn(
              "flex h-[50px] w-[50px] items-center justify-center rounded-[10px]",
              isActive ? "bg-primary" : "hover:bg-[#44444410]"
            )}
          >
            <item.icon className="h-6 w-6" fill={isActive ? "white" : "#444"} />
          </Link>
        );
      })}
      <button
        onClick={() => setOpen(true)}
        title="Logout"
        className={cn(
          "flex h-[50px] w-[50px] items-center justify-center rounded-[10px]"
        )}
      >
        <IconLogout className="h-6 w-6" fill={"#444"} />
      </button>

      <ConfirmLogoutDialog
        open={open}
        setOpen={setOpen}
        loading={loading}
        callback={handleSignout}
      />
    </aside>
  );
}
