import { Button } from "@/components/ui/button";
import React from "react";

const ChangePassword = () => {
  return (
    <div className="bg-card w-full rounded-[20px]">
      <h2 className="border-b p-5 text-xl font-medium">Change Password</h2>
      <div className="flex w-full flex-col">
        <div className="flex h-full w-full  flex-col gap-3 px-4 pt-4 md:flex-row md:gap-5 md:px-5 md:pt-8">
          <div className="flex w-full flex-col space-y-1 md:space-y-2.5">
            <label className="text-lg font-medium text-[#303030] dark:text-white">
              Old Password
            </label>
            <input
              className="h-auto rounded-[20px] border border-[#A1A1A1] p-3 text-lg font-normal text-[#A1A1A1]"
              placeholder="Enter old password"
            />
          </div>
          <div className="flex w-full flex-col space-y-1 md:space-y-2.5">
            <label className="text-lg font-medium text-[#303030] dark:text-white">
              New Password
            </label>
            <input
              className="h-auto rounded-[20px] border border-[#A1A1A1] p-3 text-lg font-normal text-[#A1A1A1]"
              placeholder="Enter new password"
            />
          </div>
          <div className="flex w-full flex-col space-y-1 md:space-y-2.5">
            <label className="text-lg font-medium text-[#303030] dark:text-white">
              Confirm Password
            </label>
            <input
              className="h-auto rounded-[20px] border border-[#A1A1A1] p-3 text-lg font-normal text-[#A1A1A1]"
              placeholder="Enter confirm password"
            />
          </div>
        </div>
        <div className="flex w-full justify-end p-4 md:p-5">
          <Button className="w-36">Save</Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
