"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BannerImageUpload from "./BannerImageUpload";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";

const LandingContent = () => {
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
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
                className="text-base placeholder:text-base font-normal rounded-[10px] border h-[130px] md:h-[90px] resize-none border-[#3C3C3C]/30 placeholder:font-normal placeholder:text-[#3C3C3C]/50 text-black"
              />
              <p className="text-base backdrop-blur-3xl rounded-full font-normal text-[#3C3C3C]/50 bottom-4 right-5 absolute">
                0/20
              </p>
            </div>
          </div>
          <div className="space-y-2.5">
            <Tabs defaultValue="Website">
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
                  <BannerImageUpload isImage={true} isVideo={true} />
                  <BannerImageUpload isImage={true} isVideo={true} />
                  <div className="flex max-md:flex-col max-md:h-[360px] items-center justify-center gap-4 md:gap-5">
                    <BannerImageUpload isImage={true} isVideo={true} />
                    <BannerImageUpload isImage={true} isVideo={true} />
                  </div>
                  <BannerImageUpload isImage={true} isVideo={true} />
                </div>
              </TabsContent>
              <TabsContent value="Mobile">
                <div className="space-y-4">
                  <BannerImageUpload isImage={true} isVideo={true} />
                  <BannerImageUpload isImage={true} isVideo={true} />
                  <div className="flex max-md:flex-col max-md:h-[360px] items-center justify-center gap-4 md:gap-5">
                    <BannerImageUpload isImage={true} isVideo={true} />
                    <BannerImageUpload isImage={true} isVideo={true} />
                  </div>
                  <BannerImageUpload isImage={true} isVideo={true} />
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

export default LandingContent;
