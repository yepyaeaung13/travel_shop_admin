"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BannerImageUpload from "./BannerImageUpload";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";
import { errorToast, successToast } from "../toast";
import { uploadImage } from "@/services/common.service";
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

const HomeContent = () => {
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState("Hero");
  const [activePlatform, setActivePlatform] = useState("Website");

  const [loading, setLoading] = useState(false);
  const [heroWebBanners, setHeroWebBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.home,
      mediaType: MediaType.image,
      deviceType: DeviceType.web,
      bannerType: BannerType.hero,
    })),
  );

  const [heroMobBanners, setHeroMobBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.home,
      mediaType: MediaType.image,
      deviceType: DeviceType.mobile,
      bannerType: BannerType.hero,
    })),
  );

  const [adsWebBanners, setAdsWebBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.home,
      mediaType: MediaType.image,
      deviceType: DeviceType.web,
      bannerType: BannerType.ads,
    })),
  );

  const [adsMobBanners, setAdsMobBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.home,
      mediaType: MediaType.image,
      deviceType: DeviceType.mobile,
      bannerType: BannerType.ads,
    })),
  );
  const [selectedBanners, setSelectedBanners] = useState<any>(heroWebBanners);
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
          successToast("Suucess", "home banners created!");
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
          successToast("Suucess", "home banners updated!");
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
    if (bannersData?.data?.home.length > 0) {
      const webHeroBanners = bannersData?.data?.home?.filter(
        (b: any) =>
          b.deviceType === DeviceType.web && b.bannerType === BannerType.hero,
      );
      const mobHeroBanners = bannersData?.data?.home?.filter(
        (b: any) =>
          b.deviceType === DeviceType.mobile &&
          b.bannerType === BannerType.hero,
      );

      const webAdsBanners = bannersData?.data?.home?.filter(
        (b: any) =>
          b.deviceType === DeviceType.web && b.bannerType === BannerType.ads,
      );

      const mobAdsBanners = bannersData?.data?.home?.filter(
        (b: any) =>
          b.deviceType === DeviceType.mobile && b.bannerType === BannerType.ads,
      );

      setHeroWebBanners(
        webHeroBanners.length > 0 ? webHeroBanners : heroWebBanners,
      );
      setHeroMobBanners(
        mobHeroBanners.length > 0 ? mobHeroBanners : heroMobBanners,
      );
      setAdsWebBanners(
        webAdsBanners.length > 0 ? webAdsBanners : adsWebBanners,
      );
      setAdsMobBanners(
        mobAdsBanners.length > 0 ? mobAdsBanners : adsMobBanners,
      );
    }
  }, [bannersData]);

  const renderBannerContent = (
    banners: any,
    bannerType: string,
    platform: string,
  ) => (
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

  useEffect(() => {
    if (!bannersData?.data?.home) return;

    if (activeBanner === "Ads") {
      if (activePlatform === "Website") {
        setSelectedBanners(adsWebBanners);
      } else {
        setSelectedBanners(adsMobBanners);
      }
    } else {
      if (activePlatform === "Website") {
        setSelectedBanners(heroWebBanners);
      } else {
        setSelectedBanners(heroMobBanners);
      }
    }
  }, [
    heroWebBanners,
    heroMobBanners,
    adsWebBanners,
    adsMobBanners,
    activeBanner,
    activePlatform,
  ]);

  // console.log("selectedNBanners", selectedBanners);

  return (
    <>
      <Card className="p-4 rounded-[10px] bg-white gap-5!">
        <CardHeader className="text-2xl px-0 max-md:hidden">
          Home Page
        </CardHeader>
        <CardContent className="px-0 space-y-5 max-md:py-2">
          <div className="">
            <Tabs value={activeBanner} onValueChange={setActiveBanner}>
              <TabsList className="bg-white">
                {["Hero", "Ads"].map((tab) => (
                  <TabsTrigger
                    value={tab}
                    key={tab}
                    className="flex w-[150px] h-12 cursor-pointer items-center justify-center rounded-full text-lg font-medium data-[state=active]:bg-[#616FF5] data-[state=active]:text-white data-[state=inactive]:bg-[#ffffff] data-[state=inactive]:text-[#929292]"
                  >
                    {tab}
                    {" Banner"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="space-y-2.5">
            {["Hero", "Ads"].map((bannerType) => (
              <div
                key={bannerType}
                className={activeBanner === bannerType ? "block" : "hidden"}
              >
                <Tabs value={activePlatform} onValueChange={setActivePlatform}>
                  <div className="flex items-center justify-between">
                    <p className="md:text-xl text-base font-normal md:font-medium">
                      Hero Banners
                    </p>
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
                    {renderBannerContent(
                      selectedBanners,
                      bannerType,
                      "Website",
                    )}
                  </TabsContent>
                  <TabsContent value="Mobile">
                    {renderBannerContent(selectedBanners, bannerType, "Mobile")}
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
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

export default HomeContent;
