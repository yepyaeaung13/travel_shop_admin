import React from "react";
import UserInfo from "@/components/settings/UserInfo";
import LogoutButton from "@/components/settings/LogoutButton";

export default function Home(): React.ReactElement {
  return (
    <div className="h-full md:pb-10 space-y-5">
      <div className="max-md:hidden">
        <h2 className="text-2xl">Account Settings</h2>
      </div>
      <div className="bg-white space-y-2.5 px-4 rounded-[20px]">
        <UserInfo />
      </div>

      <div className="block md:hidden">
        <LogoutButton />
      </div>
    </div>
  );
}
