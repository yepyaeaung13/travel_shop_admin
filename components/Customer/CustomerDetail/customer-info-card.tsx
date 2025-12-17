"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserById } from "@/queries/users.queries";
import Locationarrow from "./Locationarrow";
import { User } from "@/types/users.types";

interface CustomerInfoCardProps {
  customer: User;
}

export default function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  const status = customer?.status as "ACTIVE" | "INACTIVE" | "SUSPENDED";

  const color =
    {
      ACTIVE: "bg-[#E4FFDF] text-[#126D00]",
      INACTIVE: "bg-yellow-100 text-yellow-800",
      SUSPENDED: "bg-red-100 text-red-800",
    }[status] ?? "bg-gray-100 text-gray-800";

  return (
    <div className="flex flex-col justify-center rounded-[20px] bg-white py-4 text-base text-black font-medium md:flex-row md:justify-start gap-3 md:gap-14 p-4 md:p-10">
      <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
        <Avatar className="h-28 w-28">
          <AvatarImage
            src={customer.picture || "/placeholder.svg"}
            alt={customer.name}
          />
          <AvatarFallback className="bg-gray-600 text-2xl text-white">
            {customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center gap-y-1 text-center md:items-start">
          <p className="text-lg font-medium">{customer?.name}</p>
          <span className="text-sm text-[#3C3C3C]">
            #{customer?.id.toString().padStart(4, "0")}
          </span>
        </div>
      </div>

      <div className="flex h-full w-full flex-col justify-between space-y-2 md:w-[449px] md:border-x md:border-[#EEEEEE]">
        <div className="flex items-start justify-between">
          <span className="text-[#303030] text-lg font-medium">Phone Number</span>
          <p>{customer?.phoneNumber}</p>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[#303030] text-lg font-medium">Email</span>
          <p>{customer?.email}</p>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[#303030] text-lg font-medium">Gender</span>
          <p>{customer?.gender || "_"}</p>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[#303030] text-lg font-medium">Status</span>
          <span
            className={`inline-block w-24 rounded-full px-3 py-1 text-center text-sm font-normal ${color}`}
          >
            {customer?.status == "ACTIVE" ? "Active" : "Block"}
          </span>
        </div>
      </div>

      <div className="">
        <span className="text-[#303030]">Address</span>
        <p>{customer?.address ?? "_"}</p>
        {customer?.address && (
          <div className="flex items-start justify-center gap-1 text-[#303030]">
            <Locationarrow />
            <span>Near City Mart</span>
          </div>
        )}
      </div>
    </div>
  );
}
