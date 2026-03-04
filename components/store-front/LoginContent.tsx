"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BannerImageUpload from "./BannerImageUpload";
import { Button } from "../ui/button";
import ConfirmDialog from "../confirm-dialog/confirm-dialog";

const LoginContent = () => {
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
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
              <BannerImageUpload isImage={true} isVideo={false} />
              <BannerImageUpload isImage={true} isVideo={false} />
              <BannerImageUpload isImage={true} isVideo={false} />
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

export default LoginContent;
