"use client";
import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import OrderInfo from "@/components/Order/OrderDetail/order-info";
import PaymentInfo from "@/components/Order/OrderDetail/payment-info";
import CustomerDetail from "@/components/Order/OrderDetail/customer-detail";
import ShippingAddress from "@/components/Order/OrderDetail/shipping-address";
import OrderHeader from "@/components/Order/OrderDetail/order-header";
import AcceptRejectModal from "@/components/Order/OrderDetail/accept-reject-modal";
import SelectOrderStatus from "@/components/Order/OrderDetail/order-status";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "next/navigation";
import {
  useGetOrderDetail,
  useOrderPaymentStatusChange,
} from "@/queries/order";

export default function Page() {
  return (
    <Suspense fallback="">
      <OrderDetails />
    </Suspense>
  );
}

const OrderDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<"Accept" | "Reject">(
    "Accept",
  );
  const { mutate: changePaymentStatus, isPending } =
    useOrderPaymentStatusChange();
  const { data: orderDetail, isLoading } = useGetOrderDetail(Number(id));

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePaymentStatus = (notes: string) => {
    const payload = {
      id: orderDetail?.data?.id,
      paymentStatus: modalVariant === "Accept" ? "Approved" : "Rejected",
      rejectedNote: notes,
    };
    changePaymentStatus(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  // if (!orderDetail || isOrderDetailLoading) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col p-0">
      <OrderHeader />
      <div className="flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="relative grid h-full grid-cols-1 gap-4 md:grid-cols-3">
            {/* Left 2/3 */}
            <div className="col-span-1 flex flex-col gap-4 md:col-span-2">
              <OrderInfo order={orderDetail?.data} />
              <div className="bg-card flex-1 space-y-2.5 md:space-y-5 rounded-md p-4 md:p-5">
                <h3 className="text-foreground text-xl font-medium">
                  Order summary
                </h3>
                <div className="space-y-2.5 text-lg">
                  <div className="flex justify-between">
                    <span className="text-custom-dark-gray">Sub total</span>
                    <span className="font-medium">
                      {Number(
                        orderDetail?.data?.subTotalAmount,
                      ).toLocaleString()}{" "}
                      Ks
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-custom-dark-gray">Shipping fee</span>
                    <span className="font-medium">
                      {Number(orderDetail?.data?.deliveryFee).toLocaleString()}{" "}
                      Ks
                    </span>
                  </div>
                </div>
                <div className="border-t pt-2.5 md:pt-5">
                  <div className="flex justify-between">
                    <span className="text-custom-dark-gray text-lg font-medium">
                      Total
                    </span>
                    <span className="text-custom-dark-gray text-lg font-medium">
                      {Number(orderDetail?.data?.totalAmount).toLocaleString()}{" "}
                      Ks
                    </span>
                  </div>
                </div>
              </div>
              <PaymentInfo
                order={orderDetail?.data}
                setIsModalOpen={setIsModalOpen}
                setModalVariant={setModalVariant}
              />
            </div>
            {/* Right 1/3 */}
            <div className="col-span-1 flex flex-col gap-4">
              <SelectOrderStatus order={orderDetail?.data} />
              <CustomerDetail order={orderDetail?.data} />
              {/* <ShippingAddress /> */}
              <Button className="bg-primary hover:bg-primary/90 mt-1 h-10 md:h-12 w-full rounded-[10px] text-lg text-white">
                View Receipt
              </Button>
              {isMobile && (
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
            </div>
          </div>
        </div>
      </div>
      <AcceptRejectModal
        isOpen={isModalOpen}
        onClick={handlePaymentStatus}
        onClose={handleCloseModal}
        variant={modalVariant}
      />
    </div>
  );
};
