"use client";

// import AddCustomerModal from "../CreateCustomer/create-customer-modal";
import { SortDropdown } from "./sort-dropdown";
import SortByButton from "@/utils/SortByButton";

const CustomerListHeader = () => {
  return (
    <div className="flex items-center justify-end md:justify-between pb-4">
      <h1 className="text-2xl font-medium hidden md:flex">Customer List</h1>
      <div className="flex items-center gap-2">
        {/* <SortByButton /> */}
        {/*<SortDropdown />*/}
        {/*<AddCustomerModal />*/}
      </div>
    </div>
  );
};

export default CustomerListHeader;
