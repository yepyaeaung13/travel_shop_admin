"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import IconOrderConfirm from "@/assets/icons/order/status/IconOrderConfirm";
import IconOrderDelivered from "@/assets/icons/order/status/IconOrderDelivered";
import IconOrderFullfill from "@/assets/icons/order/status/IconOrderFullfill";
import IconOrderPending from "@/assets/icons/order/status/IconOrderPending";
import IconOrderPrepare from "@/assets/icons/order/status/IconOrderPrepare";
import IconOrderReject from "@/assets/icons/order/status/IconOrderReject";
import IconOrderShipped from "@/assets/icons/order/status/IconOrderShipped";

const orders = [
  { icon: <IconOrderPending />, number: 10, label: "Pending orders" },
  { icon: <IconOrderConfirm />, number: 10, label: "Confirmed orders" },
  { icon: <IconOrderPrepare />, number: 10, label: "Preparing orders" },
  { icon: <IconOrderShipped />, number: 10, label: "Shipped orders" },
  { icon: <IconOrderDelivered />, number: 10, label: "Delivered orders" },
  { icon: <IconOrderFullfill />, number: 10, label: "Fullfilled orders" },
  { icon: <IconOrderReject />, number: 10, label: "Rejected orders" },
];

const OrderAnalyzeSection = () => {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollbarRef.current) {
      setCanScrollLeft(scrollbarRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollbarRef.current.scrollLeft + scrollbarRef.current.clientWidth <
          scrollbarRef.current.scrollWidth - 1
      );
    }
  };

  const scroll = (direction: "left" | "right") => {
    scrollbarRef.current?.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 300);
  };

  useEffect(() => {
    scrollbarRef.current?.addEventListener("scroll", checkScroll);
    return () => {
      scrollbarRef.current?.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollbarRef}
        className="hide-scrollbar grid grid-cols-2 gap-x-5 gap-y-2.5 md:flex md:w-full md:gap-2.5 md:overflow-x-scroll"
      >
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md "
          >
            <ChevronLeft className="text-gray-600" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md "
          >
            <ChevronRight className="text-gray-600" />
          </button>
        )}

        {orders.map((order, index) => (
          <OrderCard key={index} {...order} />
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({
  icon,
  number,
  label,
}: {
  icon: React.ReactNode;
  number: number;
  label: string;
}) => {
  return (
    <div className="md:min-w-52 flex w-full flex-col space-y-5 rounded-[10px] bg-white p-2.5 md:w-52 md:space-y-0.5 md:rounded-[20px] md:p-5">
      <div className="flex justify-between">
        <p className="text-2xl font-medium md:text-[28px] md:font-semibold">
          {number}
        </p>
        <div className="size-9 md:size-11 shadow-xs flex items-center justify-center rounded-[12px] bg-white">
          {icon}
        </div>
      </div>
      <p className="text-sm font-normal text-[#303030] md:text-base">{label}</p>
    </div>
  );
};

export default OrderAnalyzeSection;
