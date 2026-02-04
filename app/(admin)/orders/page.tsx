"use client";

import OrderList from "@/components/Order/OrderListing";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="h-full w-full">
      <Suspense fallback="">
        <OrderList />
      </Suspense>
    </div>
  );
}
