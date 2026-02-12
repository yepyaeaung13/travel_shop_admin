import { Button } from "@/components/ui/button";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { OrderStatus } from "./order-info";
import { cn } from "@/lib/utils";
import { useOrderStatusChange } from "@/queries/order";
import { successToast } from "@/components/toast";

const orderStatus = [
  // OrderStatus.Rejected,
  OrderStatus.Pending,
  OrderStatus.Confirmed,
  OrderStatus.Preparing,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
  OrderStatus.Fulfilled,
];

const SelectOrderStatus = ({ order }: { order: any }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };
  const { mutate: changeOrderStatus, isPending } = useOrderStatusChange();

  useEffect(() => {
    if (order) {
      setSelectedStatus(order?.status);
    }
  }, [order]);

  const handleOrderChange = () => {
    // change order status
    const payload = {
      id: order?.id,
      status: selectedStatus,
    };
    changeOrderStatus(payload, {
      onSuccess: () => {
        successToast("Changed", "Order status was changed successfully.");
      },
    });
  };

  return (
    <div className="bg-card space-y-5 rounded-md pb-4 md:pb-5">
      <h3 className="text-custom-dark-gray border-b p-4 md:p-5 text-xl font-medium">
        Order status
      </h3>
      <div
        className={cn(
          "flex w-full flex-col space-y-2.5 px-4 md:px-5",
          (order?.payment?.status === "Pending" ||
            order?.payment?.status === "Rejected") &&
            "pointer-events-none opacity-50",
        )}
      >
        <p className="text-base font-normal text-[#3C3C3C]">Current status</p>
        {selectedStatus && (
          <Select
            value={selectedStatus ? selectedStatus : undefined}
            onValueChange={(val) => {
              handleStatusChange(val as string);
            }}
          >
            <SelectTrigger
              onClick={(e) => console.log("clicl")}
              className="!h-12 !w-full gap-3 rounded-[10px] text-base bg-white font-normal !text-black dark:!text-white"
            >
              <SelectValue
                placeholder={capitalizeWords(selectedStatus || "")}
              />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="rounded-[10px] [&>div:nth-child(2)]:p-0"
            >
              {orderStatus.map((option) => {
                return (
                  <SelectItem
                    key={option}
                    value={option}
                    className="rounded-none border-b-[1px] border-[#EEEEEE] px-4 py-3.5 hover:!bg-[#E4E6FF] data-[state=checked]:!bg-[#E4E6FF] dark:hover:!bg-neutral-400 dark:hover:!text-neutral-100 dark:data-[state=checked]:!bg-neutral-400"
                  >
                    {capitalizeWords(option)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        <Button
          onClick={handleOrderChange}
          className="bg-primary text-white hover:bg-primary/90 mt-1 h-10 md:h-12 w-full flex-1 rounded-[10px] text-lg"
        >
          Update status
        </Button>
      </div>
      <div className="px-4 md:px-5">
        {order?.payment?.status === "Pending" && (
          <span className="text-sm font-normal text-[#FF3333]">
            Please approve payment before updating order status
          </span>
        )}
      </div>
    </div>
  );
};

export default SelectOrderStatus;

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
