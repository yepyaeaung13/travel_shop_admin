"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BannerImageUpload from "./BannerImageUpload";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";

const HomeContent = () => {
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState("Hero");
  const [activePlatform, setActivePlatform] = useState("Website");

  const renderBannerContent = (bannerType: string, platform: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-5 max-md:flex-col max-md:h-[550px]">
        <BannerImageUpload isImage={true} isVideo={true} />
        <BannerImageUpload isImage={true} isVideo={false} />
        <BannerImageUpload isImage={true} isVideo={false} />
      </div>
      <div className="flex items-center justify-center gap-5 max-md:flex-col max-md:h-[360px]">
        <BannerImageUpload isImage={true} isVideo={false} />
        <BannerImageUpload isImage={true} isVideo={false} />
        <div className="h-[200px] w-full flex-1 max-md:hidden" />
      </div>
    </div>
  );

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
                    {renderBannerContent(bannerType, "Website")}
                  </TabsContent>
                  <TabsContent value="Mobile">
                    {renderBannerContent(bannerType, "Mobile")}
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
              disabled={false}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary max-md:flex-1 w-full h-[41px] md:w-[195px] rounded-[10px] text-lg text-white hover:opacity-90 md:h-[47px]"
              disabled={false}
            >
              {false ? "Saving..." : "Save"}
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
