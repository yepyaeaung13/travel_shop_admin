"use client";

import { SortByDate } from "./sort-date";
import OrderSortByBtn from "./sort-dropdown";

interface OrderListHeaderProps {
  onImport?: () => void;
  onExport?: () => void;
}

const OrderListHeader = ({ onImport, onExport }: OrderListHeaderProps) => {
  return (
    <div className="flex items-center w-full py-4 md:justify-between">
      <h1 className="hidden text-2xl font-medium md:flex">Order List</h1>
      <div className="flex flex-col w-full md:w-auto md:flex-row md:items-center gap-2">
        <OrderSortByBtn />
        <SortByDate />
      </div>
    </div>
  );
};

export default OrderListHeader;
