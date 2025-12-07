"use client";

import * as React from "react";
import {
  FileText,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import TitleHeader from "./title-header";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: false,
      items: [
        // {
        //   title: "History",
        //   url: "#",
        // }
      ],
    },
    {
      title: "Product Management",
      url: "#",
      icon: Package,
      isActive: false,
      items: [
        {
          title: "Products",
          url: "#",
        },
        {
          title: "Categories",
          url: "#",
        },
      ],
    },
    {
      title: "Order Management",
      url: "#",
      icon: FileText,
      isActive: false,
      items: [
        {
          title: "Orders",
          url: "#",
        },
        {
          title: "Customers",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      isActive: false,
      items: [
        {
          title: "Account settings",
          url: "/settings",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TitleHeader />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
