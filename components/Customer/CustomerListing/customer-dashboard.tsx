import { IconCustomer } from "@/assets/icons/customer/IconCustomer";
import { IconCustomerActive } from "@/assets/icons/customer/IconCustomerActive";
import { IconCustomerInactive } from "@/assets/icons/customer/IconCustomerInactive";
import { IconCustomers } from "@/assets/icons/customer/IconCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserDashboard } from "@/queries/users.queries";

const CustomerDashboard = () => {
  const { data: dashbaordData, isLoading: dashboardLoading } =
    useGetUserDashboard();

  return (
    <div className="h-auto grid grid-cols-2 md:grid-cols-4 gap-3 pb-1 md:pb-3">
      {dashboardLoading ? (
        <>
          <Skeleton className="h-[106px] bg-gray-300 rounded-[20px]" />
          <Skeleton className="h-[106px] bg-gray-300 rounded-[20px]" />
          <Skeleton className="h-[106px] bg-gray-300 rounded-[20px]" />
          <Skeleton className="h-[106px] bg-gray-300 rounded-[20px]" />
        </>
      ) : (
        <>
          <div className="rounded-[20px] py-5 px-6 bg-white flex justify-between">
            <div className="space-y-[11px]">
              <h2 className="text-[#1E1E1E] text-[24px] md:text-[28px] font-medium md:font-semibold">
                {dashbaordData?.data?.totalUsers?.toLocaleString()}
              </h2>
              <p className="text-[#303030] max-sm:text-sm">Total users</p>
            </div>
            <span
              className="md:mt-2 rounded-[12px] shadow-[0px_2px_10px_0px_#7C8DB51F]
 size-11 flex items-center justify-center"
            >
              <IconCustomers />
            </span>
          </div>

          <div className="rounded-[20px] py-5 px-6 bg-white flex justify-between">
            <div className="space-y-[11px]">
              <h2 className="text-[#1E1E1E] text-[24px] md:text-[28px] font-medium md:font-semibold">
                {dashbaordData?.data?.newUsersLastMonth?.toLocaleString()}
              </h2>
              <p className="text-[#303030] max-sm:text-sm">
                New users{" "}
                <span className="text-gray-400 text-xs">in the last month</span>
              </p>
            </div>
            <span
              className="md:mt-2 rounded-[12px] shadow-[0px_2px_10px_0px_#7C8DB51F]
 size-11 flex items-center justify-center"
            >
              <IconCustomer />
            </span>
          </div>

          <div className="rounded-[20px] py-5 px-6 bg-white flex justify-between">
            <div className="space-y-[11px]">
              <h2 className="text-[#1E1E1E] text-[24px] md:text-[28px] font-medium md:font-semibold">
                {dashbaordData?.data?.activeUsers?.toLocaleString()}
              </h2>
              <p className="text-[#303030] max-sm:text-sm">Active users</p>
            </div>
            <span
              className="md:mt-2 rounded-[12px] shadow-[0px_2px_10px_0px_#7C8DB51F]
 size-11 flex items-center justify-center"
            >
              <IconCustomerActive />
            </span>
          </div>

          <div className="rounded-[20px] py-5 px-6 bg-white flex justify-between">
            <div className="space-y-[11px]">
              <h2 className="text-[#1E1E1E] text-[24px] md:text-[28px] font-medium md:font-semibold">
                {dashbaordData?.data?.inactiveUsers?.toLocaleString()}
              </h2>
              <p className="text-[#303030] max-sm:text-sm">Inactive users</p>
            </div>

            <span
              className="md:mt-2 rounded-[12px] shadow-[0px_2px_10px_0px_#7C8DB51F]
 size-11 flex items-center justify-center"
            >
              <IconCustomerInactive />
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerDashboard;
