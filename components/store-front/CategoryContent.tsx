"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BannerImageUpload from "./BannerImageUpload";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";
import {
  BannerType,
  CreateBannerInput,
  DeviceType,
  MediaType,
  PageType,
  UpdateBannerInput,
} from "@/services/web.service";
import { errorToast, successToast } from "../toast";
import { uploadImage } from "@/services/common.service";
import {
  useCreateBanners,
  useGetBanners,
  useUpdateBanners,
} from "@/queries/web";

const CategoryContent = () => {
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState("Website");

  const [loading, setLoading] = useState(false);
  const [categoryWebBanners, setCategoryWebBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.category,
      mediaType: MediaType.image,
      deviceType: DeviceType.web,
      bannerType: BannerType.default,
    })),
  );

  const [categoryMobBanners, setCategoryMobBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.category,
      mediaType: MediaType.image,
      deviceType: DeviceType.mobile,
      bannerType: BannerType.default,
    })),
  );
  const [selectedBanners, setSelectedBanners] =
    useState<any>(categoryWebBanners);
  const { data: bannersData, isLoading } = useGetBanners();
  const { mutate: createBanner, isPending: createLoading } = useCreateBanners();
  const { mutate: updateBanner, isPending: updateLoading } = useUpdateBanners();

  const handleCreateBanners = async () => {
    setLoading(true);

    const uploadedBanners = await Promise.all(
      selectedBanners.map(async (ba: any) => {
        if (!ba.file) return ba;

        const uploadedImage = await uploadImage(ba.file!);

        return {
          ...ba,
          image: uploadedImage?.data?.cid,
        };
      }),
    );

    createBanner(
      { banners: uploadedBanners },
      {
        onSuccess: async (res: any) => {
          successToast("Suucess", "category banners created!");
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
      },
    );
  };

  const handleUpdateBanners = async () => {
    setLoading(true);

    const uploadedBanners = await Promise.all(
      selectedBanners.map(async (ba: any) => {
        if (!ba.file) return ba;

        const uploadedImage = await uploadImage(ba.file!);

        const { file, ...withoutFileData } = ba;

        return {
          ...withoutFileData,
          image: uploadedImage?.data?.cid,
        };
      }),
    );

    updateBanner(
      { banners: uploadedBanners },
      {
        onSuccess: async (res: any) => {
          successToast("Suucess", "caegory banners updated!");
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
      },
    );
  };

  const handleSubmit = () => {
    if (selectedBanners[0].id) {
      handleUpdateBanners();
    } else {
      handleCreateBanners();
    }
  };

  const handleFileChange = (order: number, file: File) => {
    setSelectedBanners((prev: any) => {
      return prev.map((pv: any) => (pv.order === order ? { ...pv, file } : pv));
    });
  };

  const handleDeleteImage = (order: number) => {
    setSelectedBanners((prev: any) => {
      return prev.map((pv: any) =>
        pv.order === order ? { ...pv, image: null } : pv,
      );
    });
  };

  useEffect(() => {
    if (bannersData?.data?.category.length > 0) {
      const webCategoryBanners = bannersData?.data?.category?.filter(
        (b: any) => b.deviceType === DeviceType.web,
      );
      const mobCategoryBanners = bannersData?.data?.category?.filter(
        (b: any) => b.deviceType === DeviceType.mobile,
      );

      setCategoryWebBanners(
        webCategoryBanners.length > 0 ? webCategoryBanners : categoryWebBanners,
      );
      setCategoryMobBanners(
        mobCategoryBanners.length > 0 ? mobCategoryBanners : categoryMobBanners,
      );
    }
  }, [bannersData]);

  useEffect(() => {
    if (!bannersData?.data?.category) return;

    if (activePlatform === "Website") {
      setSelectedBanners(categoryWebBanners);
    } else {
      setSelectedBanners(categoryMobBanners);
    }
  }, [categoryWebBanners, categoryMobBanners, activePlatform]);

  const renderBannerContent = (banners: any, platform: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-5 max-md:flex-col max-md:h-[550px]">
        {banners.slice(0, 3).map((b: any) => (
          <BannerImageUpload
            key={b.order}
            onImageUpload={(va) => handleFileChange(b.order, va)}
            handleDeleteImage={() => handleDeleteImage(b.order)}
            isImage={true}
            isVideo={b.order === 1 ? true : false}
            imageUrl={
              b.image
                ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                : null
            }
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-5 max-md:flex-col max-md:h-[360px]">
        {banners.slice(3, 5).map((b: any) => (
          <BannerImageUpload
            key={b.order}
            onImageUpload={(va) => handleFileChange(b.order, va)}
            handleDeleteImage={() => handleDeleteImage(b.order)}
            isImage={true}
            isVideo={false}
            imageUrl={
              b.image !== ""
                ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                : null
            }
          />
        ))}
        <div className="h-[200px] w-full flex-1 max-md:hidden" />
      </div>
    </div>
  );

  return (
    <>
      <Card className="p-4 rounded-[10px] bg-white gap-5!">
        <CardHeader className="text-2xl px-0 max-md:hidden">
          Category Page
        </CardHeader>
        <CardContent className="px-0 space-y-5 max-md:py-2">
          <Tabs value={activePlatform} onValueChange={setActivePlatform}>
            <div className="flex items-center justify-between">
              <p className="md:text-xl text-base font-normal md:font-medium">
                Hero Banners
              </p>{" "}
              <TabsList className=" bg-[#F8F8F8] p-1.5 rounded-[4px]">
                {["Website", "Mobile"].map((tab) => (
                  <TabsTrigger
                    value={tab}
                    key={tab}
                    className="flex w-[86px] h-[30px] cursor-pointer items-center justify-center rounded-[4px] text-sm font-normal data-[state=active]:bg-[#616FF5] data-[state=active]:text-white data-[state=inactive]:bg-[#F8F8F8] data-[state=inactive]:text-[#929292]"
                  >
                    {tab.slice(0, 1).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="Website">
              {renderBannerContent(selectedBanners, "Website")}
            </TabsContent>
            <TabsContent value="Mobile">
              {renderBannerContent(selectedBanners, "Mobile")}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="px-0 flex justify-end">
          <div className="flex w-full items-center justify-end gap-2.5 pt-2.5">
            <Button
              type="button"
              className="h-[41px] max-md:flex-1 w-full md:w-[195px] rounded-[10px] bg-[#A1A1A1] text-lg text-white hover:opacity-90 md:h-[47px]"
              onClick={() => setDiscardModalOpen(true)}
              disabled={isLoading || loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-primary max-md:flex-1 w-full h-[41px] md:w-[195px] rounded-[10px] text-lg text-white hover:opacity-90 md:h-[47px]"
              disabled={isLoading || loading}
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

export default CategoryContent;
