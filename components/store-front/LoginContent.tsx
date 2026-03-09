"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BannerImageUpload from "./BannerImageUpload";
import { Button } from "../ui/button";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";
import {
  useCreateBanners,
  useGetBanners,
  useUpdateBanners,
} from "@/queries/web";
import {
  BannerType,
  CreateBannerInput,
  DeviceType,
  MediaType,
  PageType,
  UpdateBannerInput,
} from "@/services/web.service";
import { uploadImage } from "@/services/common.service";
import { errorToast, successToast } from "../toast";
import { file } from "zod";

const LoginContent = () => {
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState<CreateBannerInput | UpdateBannerInput>(
    [
      {
        image: "",
        order: 1,
        file: null,
        pageType: PageType.login,
        mediaType: MediaType.image,
        deviceType: DeviceType.web,
        bannerType: BannerType.default,
      },
      {
        image: "",
        order: 2,
        file: null,
        pageType: PageType.login,
        mediaType: MediaType.image,
        deviceType: DeviceType.web,
        bannerType: BannerType.default,
      },
      {
        image: "",
        order: 3,
        file: null,
        pageType: PageType.login,
        mediaType: MediaType.image,
        deviceType: DeviceType.web,
        bannerType: BannerType.default,
      },
    ],
  );
  const { data: bannersData, isLoading } = useGetBanners();
  const { mutate: createBanner, isPending: createLoading } = useCreateBanners();
  const { mutate: updateBanner, isPending: updateLoading } = useUpdateBanners();

  const handleCreateBanners = async () => {
    setLoading(true);

    const uploadedBanners = await Promise.all(
      banners.map(async (ba) => {
        if(!ba.file) return ba;
        
        const uploadedImage = await uploadImage(ba.file!);

        return {
          ...ba,
          image: uploadedImage?.data?.cid,
        };
      }),
    );

    createBanner(uploadedBanners, {
      onSuccess: async (res: any) => {
        successToast("Suucess", "Login banners created!");
        setLoading(false);
      },
      onError: (error: any) => {
        errorToast(
          "Failed",
          error?.response?.data?.message ||
            "Create banners unsuccefully, please try again.",
        );
        setLoading(false);
      },
    });
  };

   const handleUpdateBanners = async () => {
    setLoading(true);

    const uploadedBanners = await Promise.all(
      banners.map(async (ba) => {
        if(!ba.file) return ba;
        
        const uploadedImage = await uploadImage(ba.file!);

        return {
          ...ba,
          image: uploadedImage?.data?.cid,
        };
      }),
    );

    updateBanner(uploadedBanners, {
      onSuccess: async (res: any) => {
        successToast("Suucess", "Login banners created!");
        setLoading(false);
      },
      onError: (error: any) => {
        errorToast(
          "Failed",
          error?.response?.data?.message ||
            "Create banners unsuccefully, please try again.",
        );
        setLoading(false);
      },
    });
  };

  const handleFileChange = (order: number, file: File) => {
    setBanners((prev) => {
      return prev.map((pv) => (pv.order === order ? { ...pv, file } : pv));
    });
  };

  const renderBanners = useMemo(() => {
    if (!bannersData) return banners;

    return bannersData.data.login;
  }, [bannersData]);

  console.log("data", renderBanners);
  return (
    <>
      <Card className="p-4 rounded-[10px] bg-white gap-5!">
        <CardHeader className="text-2xl px-0 max-md:hidden">
          Log In Page
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-2.5">
            <p className="md:text-xl text-base font-normal md:font-medium">
              Banners
            </p>
            <div className="flex items-center justify-center gap-4 md:gap-5 max-md:flex-col max-md:h-[550px]">
              {renderBanners.map((b: any) => (
                <BannerImageUpload
                  key={b.order}
                  onImageUpload={(va) => handleFileChange(b.order, va)}
                  isImage={true}
                  isVideo={false}
                  imageUrl={
                    b.image
                      ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                      : null
                  }
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-0 flex justify-end">
          <div className="flex w-full items-center justify-end gap-2.5 pt-2.5">
            <Button
              type="button"
              className="h-[41px] max-md:flex-1 w-full md:w-[195px] rounded-[10px] bg-[#A1A1A1] text-lg text-white hover:opacity-90 md:h-[47px]"
              onClick={() => setDiscardModalOpen(true)}
              disabled={false}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateBanners}
              className="bg-primary max-md:flex-1 w-full h-[41px] md:w-[195px] rounded-[10px] text-lg text-white hover:opacity-90 md:h-[47px]"
              disabled={false}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ConfirmDialog
        open={discardModalOpen}
        setOpen={setDiscardModalOpen}
        callback={() => {
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

export default LoginContent;
