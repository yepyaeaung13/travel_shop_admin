"use client";

import { ChevronLeft } from "lucide-react";
import React from "react";
import OrderStatusChanger from "./order-status-select";
import { useRouter } from "next/navigation";
import { OrderStatus } from "./order-status-badge";

const OrderHeader = ({ order }: { order?: any }) => {
  const router = useRouter();
  return (
    <div className="text-primary flex w-full flex-row items-center justify-between pb-4">
      <div
        className="group flex cursor-pointer items-center justify-center"
        onClick={() => router.back()}
      >
        <ChevronLeft className="text-accent-foreground group-hover:text-primary h-6 w-6" />
        <h2 className="text-accent-foreground group-hover:text-primary text-xl font-semibold capitalize">
          Order Details
        </h2>
      </div>
        <div className="flex flex-row items-center gap-2">
          {/* <OrderStatusChanger
            value={OrderStatus.PENDING}
            onChange={() => {}}
            id={1}
          /> */}
        </div>
    </div>
  );
};

export default OrderHeader;
