
"use client";
import CustomerList from "@/components/Customer/CustomerListing";
import { Suspense } from "react";

export default function CustomerPage() {
  return (
    <div className="h-full w-full">
      <Suspense fallback="">
         <CustomerList />
     </Suspense>
    </div>
  );
}
