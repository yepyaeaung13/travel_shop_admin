// components/AdminSidebarExpanded.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import IconProduct from "@/assets/icons/sidebar/Product";
import IconCategory from "@/assets/icons/sidebar/Category";
import IconLogout from "@/assets/icons/sidebar/Logout";
import { useState } from "react";
import ConfirmLogoutDialog from "./ConfirmLogoutDialog";
import Cookies from "js-cookie";
import IconOrder from "@/assets/icons/sidebar/Order";
import IconCustomer from "@/assets/icons/sidebar/Customer";
import IconPayment from "@/assets/icons/sidebar/Payment";
import IconNotification from "@/assets/icons/sidebar/Notification";
import IconSetting from "@/assets/icons/sidebar/Setting";
import { useNavStore } from "@/store/useNavStore";
import { successToast } from "../toast";

export const sidebarItems = [
  { icon: IconProduct, label: "Product management", path: "/product" },
  {
    icon: IconCategory,
    label: "Category management",
    path: "/category",
  },
  {
    icon: IconOrder,
    label: "Order management",
    path: "/orders",
  },
  {
    icon: IconCustomer,
    label: "Customer management",
    path: "/customers",
  },
  {
    icon: IconPayment,
    label: "Payment management",
    path: "/payments",
  },
  {
    icon: IconNotification,
    label: "Notification management",
    path: "/notification",
  },
  {
    icon: IconSetting,
    label: "Setting",
    path: "/settings",
  },
  // { icon: IconInquiry, label: "Inquiry management", path: "/inquiries" },
  // { icon: IconBlog, label: "Blog management", path: "/blogs" },
  // {
  //   icon: IconActivity,
  //   label: "Activity management",
  //   path: "/activities",
  // },
];

export default function AdminSidebarExpanded() {
  const pathname = usePathname();
  const { open, setOpen } = useNavStore();
  const toggleOpen = () => {
    setOpen(!open);
  };
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
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
    <>
      {/* Overlay Background */}
      {open && <div className="fixed inset-0 z-40" onClick={toggleOpen} />}

      {/* Expanded Sidebar Panel */}
      <div
        className={cn(
          "absolute left-[0px] top-0 z-50 h-full w-[300px] border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="py-7">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.path ||
                pathname === `${item.path}/new` ||
                pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={toggleOpen}
                    className={cn(
                      "flex h-[50px] items-center gap-3 px-6 transition-colors md:px-7",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon
                      className="h-6 w-6"
                      fill={isActive ? "white" : "#444"}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => setDialogOpen(true)}
                className="flex h-[50px] w-full items-center gap-3 rounded-md px-6 text-gray-700 hover:bg-gray-100 md:px-7"
              >
                <IconLogout className="h-6 w-6" fill={"#444"} />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <ConfirmLogoutDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        loading={loading}
        callback={handleSignout}
      />
    </>
  );
}
