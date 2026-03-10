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

const LandingContent = () => {
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState("Website");

  const [loading, setLoading] = useState(false);
  const [announceText, setAnnounceText] = useState<any>({
    text: "",
  });
  const [landingWebBanners, setLandingWebBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.landing,
      mediaType: MediaType.image,
      deviceType: DeviceType.web,
      bannerType: BannerType.default,
    })),
  );

  const [landingMobBanners, setLandingMobBanners] = useState<
    CreateBannerInput | UpdateBannerInput
  >(
    Array.from({ length: 5 }, (_, i) => ({
      image: "",
      order: i + 1,
      file: null,
      pageType: PageType.landing,
      mediaType: MediaType.image,
      deviceType: DeviceType.mobile,
      bannerType: BannerType.default,
    })),
  );
  const [selectedBanners, setSelectedBanners] =
    useState<any>(landingWebBanners);
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
      { banners: uploadedBanners, announceText },
      {
        onSuccess: async (res: any) => {
          successToast("Suucess", "landing banners created!");
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
      { banners: uploadedBanners, announceText },
      {
        onSuccess: async (res: any) => {
          successToast("Suucess", "landing banners updated!");
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
    if (file.type === "video/mp4") {
      setSelectedBanners((prev: any) => {
        return prev.map((pv: any) =>
          pv.order === order ? { ...pv, file, mediaType: MediaType.video } : pv,
        );
      });
    } else {
      setSelectedBanners((prev: any) => {
        return prev.map((pv: any) =>
          pv.order === order ? { ...pv, file } : pv,
        );
      });
    }
  };

  const handleDeleteImage = (order: number) => {
    setSelectedBanners((prev: any) => {
      return prev.map((pv: any) =>
        pv.order === order ? { ...pv, image: null } : pv,
      );
    });
  };

  useEffect(() => {
    if (bannersData?.data?.landing.length > 0) {
      const webCategoryBanners = bannersData?.data?.landing?.filter(
        (b: any) => b.deviceType === DeviceType.web,
      );
      const mobCategoryBanners = bannersData?.data?.landing?.filter(
        (b: any) => b.deviceType === DeviceType.mobile,
      );

      const announcement = bannersData?.data?.announcement[0] ?? announceText;

      setAnnounceText(announcement);

      setLandingWebBanners(
        webCategoryBanners.length > 0 ? webCategoryBanners : landingWebBanners,
      );
      setLandingMobBanners(
        mobCategoryBanners.length > 0 ? mobCategoryBanners : landingMobBanners,
      );
    }
  }, [bannersData]);

  useEffect(() => {
    if (!bannersData?.data?.landing) return;

    if (activePlatform === "Website") {
      setSelectedBanners(landingWebBanners);
    } else {
      setSelectedBanners(landingMobBanners);
    }
  }, [landingWebBanners, landingMobBanners, activePlatform]);

  return (
    <>
      <Card className="p-4 rounded-[10px] bg-white gap-5!">
        <CardHeader className="text-2xl px-0 max-md:hidden">
          Landing Page
        </CardHeader>
        <CardContent className="px-0 space-y-5 max-md:py-1">
          <div className="space-y-2.5">
            <p className="text-base font-normal md:font-medium md:text-xl">
              Announcement Bar
            </p>
            <div className="relative">
              <Textarea
                placeholder="e.g, 10% off today"
                value={announceText.text}
                onChange={(e) =>
                  setAnnounceText({ ...announceText, text: e.target.value })
                }
                className="text-base placeholder:text-base font-normal rounded-[10px] border h-[130px] md:h-[90px] resize-none border-[#3C3C3C]/30 placeholder:font-normal placeholder:text-[#3C3C3C]/50 text-black"
              />
              <p className="text-base backdrop-blur-3xl rounded-full font-normal text-[#3C3C3C]/50 bottom-4 right-5 absolute">
                0/20
              </p>
            </div>
          </div>
          <div className="space-y-2.5">
            <Tabs
              defaultValue="Website"
              value={activePlatform}
              onValueChange={setActivePlatform}
            >
              <div className="flex items-center justify-between">
                <p className="md:text-xl text-base font-normal md:font-medium">
                  Banners
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
                <div className="space-y-4">
                  {selectedBanners.slice(0, 2).map((b: any) => (
                    <BannerImageUpload
                      key={b.order}
                      onImageUpload={(va) => handleFileChange(b.order, va)}
                      onVideoUpload={(file: File) =>
                        handleFileChange(b.order, file)
                      }
                      handleDeleteImage={() => handleDeleteImage(b.order)}
                      isImage={true}
                      isVideo={true}
                      imageUrl={
                        b.image && b.mediaType === MediaType.image
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                      videoUrl={
                        b.image && b.mediaType === MediaType.video
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                    />
                  ))}
                  <div className="flex max-md:flex-col max-md:h-[360px] items-center justify-center gap-4 md:gap-5">
                    {selectedBanners.slice(2, 4).map((b: any) => (
                      <BannerImageUpload
                        key={b.order}
                        onImageUpload={(va) => handleFileChange(b.order, va)}
                        onVideoUpload={(file: File) =>
                          handleFileChange(b.order, file)
                        }
                        handleDeleteImage={() => handleDeleteImage(b.order)}
                        isImage={true}
                        isVideo={true}
                        imageUrl={
                          b.image && b.mediaType === MediaType.image
                            ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                            : null
                        }
                        videoUrl={
                          b.image && b.mediaType === MediaType.video
                            ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                            : null
                        }
                      />
                    ))}
                  </div>
                  {selectedBanners.slice(4, 5).map((b: any) => (
                    <BannerImageUpload
                      key={b.order}
                      onImageUpload={(va) => handleFileChange(b.order, va)}
                      onVideoUpload={(file: File) =>
                        handleFileChange(b.order, file)
                      }
                      handleDeleteImage={() => handleDeleteImage(b.order)}
                      isImage={true}
                      isVideo={true}
                      imageUrl={
                        b.image && b.mediaType === MediaType.image
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                      videoUrl={
                        b.image && b.mediaType === MediaType.video
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="Mobile">
                <div className="space-y-4">
                  {selectedBanners.slice(0, 2).map((b: any) => (
                    <BannerImageUpload
                      key={b.order}
                      onImageUpload={(va) => handleFileChange(b.order, va)}
                      onVideoUpload={(file: File) =>
                        handleFileChange(b.order, file)
                      }
                      handleDeleteImage={() => handleDeleteImage(b.order)}
                      isImage={true}
                      isVideo={true}
                      imageUrl={
                        b.image && b.mediaType === MediaType.image
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                      videoUrl={
                        b.image && b.mediaType === MediaType.video
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                    />
                  ))}
                  <div className="flex max-md:flex-col max-md:h-[360px] items-center justify-center gap-4 md:gap-5">
                    {selectedBanners.slice(2, 4).map((b: any) => (
                      <BannerImageUpload
                        key={b.order}
                        onImageUpload={(va) => handleFileChange(b.order, va)}
                        onVideoUpload={(file: File) =>
                          handleFileChange(b.order, file)
                        }
                        handleDeleteImage={() => handleDeleteImage(b.order)}
                        isImage={true}
                        isVideo={true}
                        imageUrl={
                          b.image && b.mediaType === MediaType.image
                            ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                            : null
                        }
                        videoUrl={
                          b.image && b.mediaType === MediaType.video
                            ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                            : null
                        }
                      />
                    ))}
                  </div>
                  {selectedBanners.slice(4, 5).map((b: any) => (
                    <BannerImageUpload
                      key={b.order}
                      onImageUpload={(va) => handleFileChange(b.order, va)}
                      onVideoUpload={(file: File) =>
                        handleFileChange(b.order, file)
                      }
                      handleDeleteImage={() => handleDeleteImage(b.order)}
                      isImage={true}
                      isVideo={true}
                      imageUrl={
                        b.image && b.mediaType === MediaType.image
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                      videoUrl={
                        b.image && b.mediaType === MediaType.video
                          ? `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${b.image}`
                          : null
                      }
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="px-0 flex justify-end">
          <div className="flex w-full items-center justify-end gap-2.5 pt-2.5">
            <Button
              type="button"
              className="h-[41px] max-md:flex-1 w-full md:w-[195px] rounded-[10px] bg-[#A1A1A1] text-lg text-white hover:opacity-90 md:h-[47px]"
              onClick={() => setDiscardModalOpen(true)}
              disabled={loading || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-primary max-md:flex-1 w-full h-[41px] md:w-[195px] rounded-[10px] text-lg text-white hover:opacity-90 md:h-[47px]"
              disabled={loading || isLoading}
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

export default LandingContent;
