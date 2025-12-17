"use client";

import CustomerInfoCard from "./customer-info-card";
import { OrderTable } from "./OrderTable/order-table";
import { mockOrders } from "./OrderTable/dummyData";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetUserById } from "@/queries/users.queries";

interface CustomerDetailsPageProps {
  customerId: string;
}

export default function CustomerDetailsPage({
  customerId,
}: CustomerDetailsPageProps) {
  const router = useRouter();
  // Mock order data
  const orderData = {
    totalOrders: 20,
    totalSpend: "350,000 MMK",
    orders: [
      { id: "ORD-001", date: "2024-05-15" },
      { id: "ORD-002", date: "2024-05-14" },
      { id: "ORD-003", date: "2024-05-13" },
      { id: "ORD-004", date: "2024-05-12" },
      { id: "ORD-005", date: "2024-05-11" },
      { id: "ORD-006", date: "2024-05-10" },
      { id: "ORD-007", date: "2024-05-09" },
      { id: "ORD-008", date: "2024-05-08" },
    ],
  };

  // Mock activity data
  const activityData = [
    {
      id: "1",
      type: "wishlist" as const,
      description: "{customerName} added {productName} to wish list.",
      timestamp: "5/6/2024 at 11:30 AM",
      customerName: "Customer name",
      productName: "product name",
    },
    {
      id: "2",
      type: "wishlist" as const,
      description: "{customerName} added {productName} to wish list.",
      timestamp: "5/6/2024 at 11:30 AM",
      customerName: "Customer name",
      productName: "product name",
    },
    {
      id: "3",
      type: "wishlist" as const,
      description: "{customerName} added {productName} to wish list.",
      timestamp: "5/6/2024 at 11:30 AM",
      customerName: "Customer name",
      productName: "product name",
    },
    {
      id: "4",
      type: "wishlist" as const,
      description: "{customerName} added {productName} to wish list.",
      timestamp: "5/6/2024 at 11:30 AM",
      customerName: "Customer name",
      productName: "product name",
    },
    {
      id: "5",
      type: "wishlist" as const,
      description: "{customerName} added {productName} to wish list.",
      timestamp: "5/6/2024 at 11:30 AM",
      customerName: "Customer name",
      productName: "product name",
    },
  ];

  if (!customerId) return null;

  // need to uncomment
  const { data : CustomerData, isLoading: fetchingUserDetail, isError : isErrorUserDetail , error:errorUserDetail } = useGetUserById(customerId);

  // @ts-ignore
  if(isErrorUserDetail && errorUserDetail.response?.status === 403) {
   return <div className="max-w-[1280px] mx-auto p-6">
     <h1>User is Deleted by Admin</h1>
   </div>
  }

if(fetchingUserDetail || !CustomerData)
 return null;


const customer = CustomerData.data;


  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-y-5 pb-10">
        <div className="flex items-center gap-1 group cursor-pointer" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-black group-hover:text-[#616FF5]"/>
          <p className="text-lg font-medium text-black group-hover:text-[#616FF5]">Customer Details</p>
        </div>
        <div className="">
          <CustomerInfoCard customer={customer} />
        </div>

        <div className="">
          <OrderTable orders={mockOrders} />
          {/* Order Summary */}
          {/* <OrderSummaryCard
            totalOrders={orderData.totalOrders}
            totalSpend={orderData.totalSpend}
            orders={orderData.orders}
          /> */}

          {/* Activity Timeline */}
          {/* <ActivityTimeline activities={activityData} /> */}
        </div>
      </div>
    </div>
  );
}
