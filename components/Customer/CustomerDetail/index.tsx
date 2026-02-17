"use client";

import CustomerInfoCard from "./customer-info-card";
import { OrderTable } from "./OrderTable/order-table";
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
          <OrderTable orders={customer?.order || []} />
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
