"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BannerImageUpload from "./BannerImageUpload";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";
import { useRouter } from "next/navigation";
import { CreatePolicyInput } from "@/services/web.service";
import { useCreatePolicy, useGetPolicy, useUpdatePolicy } from "@/queries/web";
import { errorToast, successToast } from "../toast";

const PrivacyContent = () => {
  const router = useRouter();
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [policy, setPolicy] = useState<any>({
    title: "",
    description: "",
  });

  const { data, isLoading } = useGetPolicy();

  useEffect(() => {
    if (data?.data?.length > 0) {
      setPolicy(data?.data[0]);
    }
  }, [data]);

  const { mutate: createPolicy, isPending: createLoading } = useCreatePolicy();
  const { mutate: updatePolicy, isPending: updateLoading } = useUpdatePolicy();

  const handleCreatePolicy = async () => {
    createPolicy(policy, {
      onSuccess: async (res: any) => {
        successToast("Suucess", "policy created!");
      },
      onError: (error: any) => {
        errorToast(
          "Failed",
          error?.response?.data?.message ||
            "Create banners unsuccefully, please try again.",
        );
      },
    });
  };

  const handleUpdatePolicy = async () => {
    updatePolicy(policy, {
      onSuccess: async (res: any) => {
        successToast("Suucess", "policy updated!");
      },
      onError: (error: any) => {
        errorToast(
          "Failed",
          error?.response?.data?.message ||
            "Create banners unsuccefully, please try again.",
        );
      },
    });
  };

  const handleSubmit = () => {
    if (policy.id) {
      handleUpdatePolicy();
    } else {
      handleCreatePolicy();
    }
  };

  // console.log("data", data);

  return (
    <>
      <Card className="p-4 rounded-[10px] bg-white gap-5!">
        <CardHeader className="text-2xl px-0 max-md:hidden">
          Privacy & Policy
        </CardHeader>
        <CardContent className="px-0 space-y-5">
          <div className="space-y-2.5">
            <p className="text-base font-normal md:font-medium md:text-xl">
              Title
            </p>
            <div className="relative">
              <Textarea
                placeholder="Title"
                value={policy.title}
                onChange={(e) =>
                  setPolicy({ ...policy, title: e.target.value })
                }
                className="text-base placeholder:text-base font-normal rounded-[10px] border h-[90px] resize-none border-[#3C3C3C]/30 placeholder:font-normal placeholder:text-[#3C3C3C]/50 text-black"
              />
              <p className="text-base backdrop-blur-3xl rounded-full font-normal text-[#3C3C3C]/50 bottom-4 right-5 absolute">
                0/20
              </p>
            </div>
          </div>
          <div className="space-y-2.5">
            <p className="text-base font-normal md:font-medium md:text-xl">
              Description
            </p>
            <div className="relative">
              <Textarea
                placeholder="Description"
                value={policy.description}
                onChange={(e) =>
                  setPolicy({ ...policy, description: e.target.value })
                }
                className="text-base placeholder:text-base font-normal rounded-[10px] border h-[373px] resize-none border-[#3C3C3C]/30 placeholder:font-normal placeholder:text-[#3C3C3C]/50 text-black"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-0 flex justify-end">
          <div className="flex w-full items-center justify-end gap-2.5 pt-2.5">
            <Button
              type="button"
              className="h-[41px] max-md:flex-1 w-full md:w-[195px] rounded-[10px] bg-[#A1A1A1] text-lg text-white hover:opacity-90 md:h-[47px]"
              onClick={() => setDiscardModalOpen(true)}
              disabled={createLoading || updateLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-primary max-md:flex-1 w-full h-[41px] md:w-[195px] rounded-[10px] text-lg text-white hover:opacity-90 md:h-[47px]"
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ConfirmDialog
        open={discardModalOpen}
        setOpen={setDiscardModalOpen}
        callback={() => {
          router.back();
          setDiscardModalOpen(false);
        }}
        loading={false}
        title="Are you sure you want to discard all changes?"
        description="This action cannot be undone"
        className="w-[450px]"
        titleClassName="max-w-[300px]"
      />
    </>
  );
};

export default PrivacyContent;
