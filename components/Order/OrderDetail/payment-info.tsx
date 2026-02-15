"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import KPaySlip from "@/assets/order/kpay-slip.jpg";
import { cn } from "@/lib/utils";
import { getPaymentStatusColor } from "../OrderListing/OrderTable";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

export enum PaymentStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

const PaymentInfo = ({
  order,
  setIsModalOpen,
  setModalVariant,
}: {
  order: any;
  setIsModalOpen: (value: boolean) => void;
  setModalVariant: (value: any) => void;
}) => {
  const isMobile = useIsMobile();
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  return (
    <>
      <div className="bg-card space-y-2.5 rounded-md p-4 md:space-y-5 md:p-5">
        <h3 className="text-foreground text-xl font-medium">Payment details</h3>

        <div className="space-y-2.5 text-lg">
          <div className="flex justify-between">
            <span className="text-custom-dark-gray">Payment status</span>
            <p
              className={cn(
                "w-[110px] rounded-full py-1.5 text-center",
                getPaymentStatusColor(order?.payment?.status?.toLowerCase()),
              )}
            >
              {capitalizeWords(order?.payment?.status || "")}
            </p>
          </div>

          <div className="flex justify-between">
            <span className="text-custom-dark-gray">Payment method</span>
            <span className="font-medium">
              {order?.payment?.methodName}
            </span>
          </div>
          {order?.payment?.paymentName && (
            <div className="flex justify-between">
              <span className="text-custom-dark-gray">Paid by</span>
              <span className="font-medium">
                {order?.payment?.paymentName}
              </span>
            </div>
          )}
          {order?.payment?.slip && (
            <div className="flex items-start justify-between">
              <p className="text-custom-dark-gray">Payment slip</p>
              <div
                onClick={() => setOpenPaymentDialog(true)}
                className="bg-card flex cursor-pointer items-center justify-center rounded-2xl border"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${order?.payment?.slip}`}
                  alt="Payment screenshot"
                  className="h-24 w-24 rounded-2xl object-cover"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          )}
        </div>

        <Dialog
          open={openPaymentDialog}
          onOpenChange={() => setOpenPaymentDialog(false)}
        >
          <DialogContent
            showCloseButton={false}
            className="gap-0 rounded-2xl border-0 bg-white p-0 shadow-xl dark:bg-gray-800 sm:max-w-md"
          >
            {/* Close button */}
            <button
              onClick={() => setOpenPaymentDialog(false)}
              className="dark:hover:gray-600 absolute right-4 top-4 z-10 cursor-pointer rounded-full bg-gray-800 p-1 transition-colors hover:bg-gray-600"
            >
              <X className="h-5 w-5 text-gray-100" />
            </button>

            <Image
              src={KPaySlip}
              alt="Payment screenshot"
              width={1000}
              height={1000}
              className="h-auto w-screen"
            />
          </DialogContent>
        </Dialog>
      </div>
      {order?.payment?.status?.toLowerCase() === PaymentStatus.REJECTED && (
        <div className="flex-1 space-y-2.5 md:space-y-5 rounded-md border border-[#FF3333] bg-[#FF333333] p-4 md:p-5">
          <div className="space-y-1 md:space-y-2.5">
            <h3 className="text-foreground text-xl font-medium">
              Payment rejected
            </h3>
            <p className="text-[#3C3C3C]">
              By Admin on{" "}
              {dayjs(order?.payment?.updatedAt).format("DD MMM YYYY [at] hh:mm A")}
            </p>
          </div>
          <div className="space-y-1 md:space-y-2.5">
            <p className="font-normal text-[#303030]">Reason for rejection</p>
            <div className="rounded-[10px] bg-white p-3 md:p-5 text-[#3C3C3C]">
              {order?.payment?.rejectedNote}
            </div>
          </div>
        </div>
      )}
      {order?.payment?.status?.toLowerCase() === PaymentStatus.APPROVED && (
        <div className="flex-1 space-y-2.5 md:space-y-5 rounded-md border border-[#126D00] bg-[#126D00]/20 p-4 md:p-5">
          <div className="space-y-1 md:space-y-2.5">
            <h3 className="text-xl font-medium">
              Payment verified and approved
            </h3>
            <p className="text-[#3C3C3C] text-base font-normal">
              By Admin on{" "}
              {dayjs(order?.payment?.updatedAt).format("DD MMM YYYY [at] hh:mm A")}
            </p>
          </div>
        </div>
      )}
      {!isMobile && order?.payment?.status?.toLowerCase() === PaymentStatus.PENDING && (
        <div className=" flex w-full justify-center gap-4 md:gap-8 md:p-5">
          <Button
            variant="outline"
            onClick={() => {
              setIsModalOpen(true);
              setModalVariant("Reject");
            }}
            className="border-input text-lg h-10 md:h-12 w-full rounded-[10px] flex-1 bg-red-200 text-red-500 hover:bg-red-200/90 hover:text-red-500"
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setModalVariant("Accept");
            }}
            className="bg-primary text-lg h-10 md:h-12 rounded-[10px] text-white hover:bg-primary/90 w-40 flex-1"
          >
            Accept
          </Button>
        </div>
      )}
    </>
  );
};

export default PaymentInfo;

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
