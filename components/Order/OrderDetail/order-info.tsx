"use client";
import Image from "next/image";
import { getOrderStatusColor } from "../OrderListing/OrderTable";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Preparing = "Preparing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Fulfilled = "Fulfilled",
  Rejected = "Rejected",
}

const OrderInfo = ({ order }: { order: any }) => {
  return (
    <div className="bg-card rounded-md">
      {/* Order Info */}
      <div className="flex items-start justify-between gap-14 p-4 md:p-5">
        <div>
          <h2 className="text-custom-dark-gray mb-1 text-2xl font-medium">
            Order ID - #{order?.id?.toString().padStart(3, "0")}
          </h2>
          <p className="text-custom-gray-100">
            Ordered time at{" "}
            {dayjs(order?.createdAt).format("DD MMM YYYY [at] hh:mm A")}
          </p>
        </div>
        <p
          className={cn(
            "max-sm:text-sm min-w-[110px] rounded-[20px] md:rounded-full max-sm:px-2 py-1.5 text-center",
            getOrderStatusColor(order?.status),
          )}
        >
          {capitalizeWords(order?.status || "")}
        </p>
      </div>

      {/* Ordered Items */}
      <div className="border-t border-[#A1A1A180] p-4 md:p-5">
        <h3 className="text-custom-dark-gray text-base font-medium">
          Ordered Items
        </h3>

        {order?.items.map((item: any) => (
          <div
            key={item.id}
            className="grid grid-cols-3 border-b border-[#A1A1A180] py-3 md:grid-cols-6 md:gap-4"
          >
            <div className="col-span-3 flex items-center justify-between gap-3 md:order-1">
              <div className="flex h-[100px] w-[100px] items-center justify-center rounded-lg bg-white dark:bg-neutral-800">
                <Image
                  src={`${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${item.image}`}
                  alt={""}
                  width={100}
                  height={100}
                  className="rounded-[20px] object-cover"
                />
              </div>
              <div className="flex h-full w-full items-center gap-4 2xl:gap-10">
                <div className="flex flex-col justify-center">
                  <h4 className="text-custom-gray-100 text-xl font-medium">
                    {item.name}
                  </h4>
                  <p className="text-custom-gray-100 text-base font-normal">
                    {item.variant}
                  </p>
                </div>
                {item.isPromote && (
                  <p className="w-fit h-fit rounded-full bg-[#FF3333]/20 px-3 py-1.5 text-center text-[#FF3333]">
                    {item.promoteType === "PERCENT"
                      ? item.promoteValue + "%"
                      : item.promoteValue.toLocaleString() + "Ks"}
                    off
                  </p>
                )}
              </div>
            </div>
            <div className="order-3 col-span-3 flex items-center justify-end gap-4 md:gap-[30px] md:order-2 max-sm:pb-8 max-sm:pt-2.5">
              <div className="w-16 md:hidden"></div>
              <div className="text-center relative">
                {Number(item.originalPrice) !== Number(item.price) && (
                  <p className="hidden md:block absolute -top-6 text-muted-foreground text-base line-through">
                    {Number(item.originalPrice).toLocaleString()} Ks
                  </p>
                )}
                <p className="text-custom-dark-gray md:text-lg font-medium">
                  {Number(item.price).toLocaleString()} Ks
                </p>
                {Number(item.originalPrice) !== Number(item.price) && (
                  <p className="absolute md:hidden text-muted-foreground text-base line-through">
                    {Number(item.originalPrice).toLocaleString()} Ks
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="text-custom-gray-100 text-base">
                  Qty: {item.qty}
                </p>
              </div>
              <div className="text-center">
                <p className="text-custom-dark-gray md:text-lg font-medium">
                  {Number(item.total).toLocaleString()} Ks
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderInfo;

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
