"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "./order-status-badge";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [
    OrderStatus.PROCESSING,
    OrderStatus.PACKAGING,
    OrderStatus.DELIVERING,
    OrderStatus.DELIVERED,
    OrderStatus.REJECTED,
  ],
  [OrderStatus.PROCESSING]: [
    OrderStatus.PACKAGING,
    OrderStatus.DELIVERING,
    OrderStatus.DELIVERED,
    OrderStatus.REJECTED,
  ],
  [OrderStatus.PACKAGING]: [
    OrderStatus.DELIVERING,
    OrderStatus.DELIVERED,
    OrderStatus.REJECTED,
  ],
  [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED, OrderStatus.REJECTED],
  [OrderStatus.DELIVERED]: [OrderStatus.REJECTED],
  [OrderStatus.REJECTED]: [OrderStatus.RESTOCKED],
  [OrderStatus.RESTOCKED]: [],
};

const statusLabelMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.PACKAGING]: "Packaging",
  [OrderStatus.DELIVERING]: "Delivering",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.REJECTED]: "Rejected",
  [OrderStatus.RESTOCKED]: "Restocked",
};

type Props = {
  id: number;
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
};

const OrderStatusChanger = ({ id, value, onChange }: Props) => {
  // const { mutate: updateOrderStatus } = useUpdateOrderStatus(id);

  const handleChange = (val: string) => {
    // updateOrderStatus(val as OrderStatus, {
    //   onSuccess: (data) => {
    //     toast.success(
    //       `Order Status Changed Successfully to ${
    //         statusLabelMap[data.data as OrderStatus]
    //       }`
    //     );
    //   },
    //   onError: (error) => {
    //     const err = error as { response?: { data?: { error?: string } } };
    //     if (err?.response) toast.error(err.response.data?.error);
    //   },
    // });
    // onChange(val as OrderStatus);
  };

  const options = React.useMemo(() => {
    const allowed = validTransitions[value] ?? [];
    // include current value first (disabled), then allowed transitions
    return [value, ...allowed].filter(
      (v, i, arr) => arr.indexOf(v) === i
    ) as OrderStatus[];
  }, [value]);

  return (
    <Select onValueChange={handleChange} value={value}>
      <SelectTrigger
        className="bg-primary text-accent w-[150px]"
        disabledIcon={true}
      >
        <SelectValue placeholder="Change status" className="text-accent" />
        <ChevronDownIcon className="size-4 text-accent opacity-50" />
      </SelectTrigger>
      <SelectContent className="rounded-[10px] p-0">
        {options.map((key) => (
          <SelectItem
            key={key}
            value={key}
            disabled={key === value}
            className=""
          >
            {statusLabelMap[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrderStatusChanger;
