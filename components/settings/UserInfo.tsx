"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileModal from "./EditProfileModal";
import { KeyRound } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";
import { useAuthStore } from "@/store/useAuthStore";
import LogoutButton from "./LogoutButton";
import { CameraIcon, EditIcon } from "@/assets/icons/settings";
import { useGetLoginInfo } from "@/queries/auth";

const UserInfo = () => {
  const { loginInfo, setLoginInfo } = useAuthStore();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  console.log("loginInfo", loginInfo)

  const userInfo = useGetLoginInfo(loginInfo?.id);

  useEffect(() => {
    console.log("userInfo", userInfo);
    if (userInfo.data?.id) {
      setLoginInfo(userInfo.data);
    }
  }, [userInfo])

  return (
      <div className="bg-card w-full rounded-[20px] md:h-[414px]">
        <div className="flex items-center justify-between border-b border-[#EEEEEE] p-4">
          <h2 className="text-xl font-medium">Personal Information</h2>
        </div>
        <div className="flex flex-col px-4 pt-2.5 md:px-10">
          <div className="flex h-full w-full flex-col gap-5 md:gap-[155px] py-4 md:flex-row md:py-5 md:px-16">
            <div className="flex flex-col items-center gap-4 md:gap-5">
              <div className="size-[100px] md:size-[200px] relative z-0">
                <Avatar className="w-full h-full border border-border">
                  <AvatarImage
                    src={loginInfo?.picture || ""}
                    alt={loginInfo?.name}
                  />
                  <AvatarFallback>{loginInfo?.name}</AvatarFallback>
                </Avatar>
                <button className="absolute z-10 bottom-0 right-2.5 cursor-pointer">
                  <CameraIcon className="size-10" />
                </button>
              </div>

              <div className="hidden md:block">
                <LogoutButton />
              </div>
              <div className="md:hidden space-y-2.5 flex flex-col items-center">
                <h1 className="text-xl text-black">{loginInfo?.name}</h1>
                <p className="text-base text-primary-text">
                  {loginInfo?.role?.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="space-y-5 text-primary-text">
              <div className="space-y-2.5 hidden md:block">
                <h1 className="text-2xl text-black">{loginInfo?.name}</h1>
                <p className="text-lg">{loginInfo?.role?.toLowerCase()}</p>
              </div>
              <div className="space-y-2.5">
                <label className="text-lg">Email</label>
                <p className="text-xl font-medium">{loginInfo?.email}</p>
              </div>
              <div className="space-y-2.5">
                <label>Phone</label>
                <p>{loginInfo?.phone}</p>
              </div>
              <div className="flex flex-col md:flex-row md:gap-5 gap-2.5">
                <button
                  onClick={() => setOpenEditModal(true)}
                  className="border-border hover:bg-primary/10 flex h-11 cursor-pointer items-center justify-center md:justify-between gap-2.5 rounded-[10px] border px-2.5 md:h-[47px] md:px-4"
                >
                  <EditIcon className="max-sm:size-[18px]" />
                  <p className="text-primary-foreground text-sm md:text-lg font-normal">
                    Edit information
                  </p>
                </button>
                <button
                  onClick={() => setOpenPasswordModal(true)}
                  className="border-border hover:bg-primary/10 flex h-11 cursor-pointer items-center justify-center md:justify-between gap-2.5 rounded-[10px] border px-2.5 md:h-[47px] md:px-4"
                >
                  <KeyRound className="text-[#3C3C3C] max-sm:size-[18px]" />
                  <p className="text-primary-foreground text-sm md:text-lg font-normal">
                    Change password
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <EditProfileModal
          user={loginInfo!}
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onOpen={() => setOpenEditModal(true)}
        />

        <ChangePasswordModal
          user={loginInfo!}
          open={openPasswordModal}
          onClose={() => setOpenPasswordModal(false)}
          onOpen={() => setOpenPasswordModal(true)}
        />
      </div>
  );
};

export default UserInfo;
