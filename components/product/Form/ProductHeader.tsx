"use client";

import ConfirmDialog from "@/components/confirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProductHeader({
  title = "Add new product",
}: {
  title?: string;
}) {
  const router = useRouter();
  const [openConfirmDlg, setOpenConfirmDlg] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Button
            onClick={() => setOpenConfirmDlg(true)}
            asChild
            variant="ghost"
            className="flex items-center"
          >
            <p className="flex items-center text-xl font-medium">
              <ChevronLeft className="size-6 -ml-3" /> {title}
            </p>
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={openConfirmDlg}
        setOpen={setOpenConfirmDlg}
        callback={() => {
          router.back();
          setOpenConfirmDlg(false);
        }}
        loading={false}
        title={"Unsaved Changes"}
        description="Are you sure you want to exit? If you leave now your current information will not be saved "
        className="w-[450px]"
        titleClassName="max-w-full"
      />
    </>
  );
}
