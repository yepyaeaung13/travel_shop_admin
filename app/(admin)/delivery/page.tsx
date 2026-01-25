"use client";

import ConfirmDialog from "@/components/confirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CustomSwitch, Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronLeft, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const regions = [
  "Ayeyarwady",
  "Bago",
  "Magway",
  "Mandalay",
  "Sagaing",
  "Yangon",
  "Naypyidaw",
  "Kachin",
  "Kayah",
  "Kayin",
];

type DialogModal = {
  isOpen: boolean;
  title: string;
  message: string;
  deliveryType?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeliveryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const id = searchParams.get("regionId") ?? "0";
  const regionId = parseInt(id);

  const [disabled, setDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deliveryType, setDeliveryType] = useState<
    "none" | "free" | "perTown" | "allTown"
  >("none");
  const [dialogModal, setDialogModal] = useState<DialogModal>({
    isOpen: false,
    title: "",
    message: "",
    deliveryType: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const resetDialogModal = () => {
    setDialogModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      onCancel: () => {},
    });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setDialogModal({
      isOpen: true,
      title: "Are you sure you want to save your changes?",
      message: "",
      onConfirm: () => {
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
    setIsSaving(false);
  };

  const handleDiscard = () => {
    setDialogModal({
      isOpen: true,
      title: "Unsave Changes",
      message:
        "Are you sure you want to exit? If you leave now your current information will not be saved",
      onConfirm: () => {
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
        router.back();
      },
      onCancel: resetDialogModal,
    });
  };

  const handleDiscardAll = () => {
    setDialogModal({
      isOpen: true,
      title: "Are you sure you want to discard all changes?",
      message: "This action cannot be undone",
      onConfirm: () => {
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
        router.back();
      },
      onCancel: resetDialogModal,
    });
  };

  const handleTurnOnFreeDeli = () => {
    setDialogModal({
      isOpen: true,
      title: "Are you sure you want to set free delivery for all townships?",
      message: "",
      onConfirm: () => {
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
        setDeliveryType("free");
      },
      onCancel: resetDialogModal,
    });
  };

  const handleTurnOffFreeDeli = () => {
    setDialogModal({
      isOpen: true,
      title:
        "Are you sure you want to disable free delivery for all townships?",
      message: "",
      onConfirm: () => {
        setDeliveryType("none");
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handleFreeDeliChecked = (checked: boolean) => {
    if (checked) {
      handleTurnOnFreeDeli();
    } else {
      handleTurnOffFreeDeli();
    }
  };

  const handleTurnOnPerTownship = () => {
    setDialogModal({
      isOpen: true,
      title: "Are you sure you want to set delivery fees per township?",
      message: "",
      onConfirm: () => {
        setDeliveryType("perTown");
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handleTurnOffPerTownship = () => {
    setDialogModal({
      isOpen: true,
      title: "Are you sure you want to disable delivery fees per township?",
      message: "",
      onConfirm: () => {
        setDeliveryType("none");
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handlePerTownChecked = (checked: boolean) => {
    if (checked) {
      handleTurnOnPerTownship();
    } else {
      handleTurnOffPerTownship();
    }
  };

  const handleTurnOnAllTownship = () => {
    setDialogModal({
      isOpen: true,
      title: "Are you sure you want to set universal delivery fees?",
      message: "",
      onConfirm: () => {
        setDeliveryType("allTown");
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handleTurnOffAllTownship = () => {
    setDialogModal({
      isOpen: true,
      title: "Are you sure you want to disable universal delivery fees?",
      message: "",
      onConfirm: () => {
        setDeliveryType("none");
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handleAllTownChecked = (checked: boolean) => {
    if (checked) {
      handleTurnOnAllTownship();
    } else {
      handleTurnOffAllTownship();
    }
  };

  const handleDisableDelivery = () => {
    setDeliveryType("none");
    setDialogModal({
      isOpen: true,
      title: `Are you sure you want to disable delivery for ${regions[regionId]}?`,
      message: "",
      onConfirm: () => {
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const dialogToggle = (state: boolean) => {
    resetDialogModal();
    setDialogModal({
      ...dialogModal,
      isOpen: state,
    });
  };

  const handleSelectRegion = (id: number) => {
    router.push(`/delivery?regionId=${id}`);
    // handleDiscard();
  };

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="hidden md:flex items-center justify-between w-full">
        <h1 className="text-xl md:text-2xl font-medium text-black">
          Region and States List
        </h1>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={handleDiscard}
            disabled={isSaving || disabled}
            className={cn(
              "h-auto w-[135px] rounded-[10px] bg-[#A1A1A1] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#444444] active:scale-95 md:w-[135px] md:text-lg",
              disabled || (isSaving && "bg-[#444444]/50"),
            )}
          >
            Discard
          </Button>
          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || disabled}
            className={cn(
              "bg-primary h-auto w-[135px] rounded-[10px] py-1.5 text-base font-medium text-white duration-300 active:scale-95 md:w-[135px] md:text-lg",
              disabled && "bg-primary/50",
            )}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-5">
        <Card
          className={cn(
            "w-full md:w-[320px] rounded-[10px] p-5 shrink-0 h-full md:h-[75vh] overflow-y-scroll hide-scrollbar",
            isMobile && regionId && "hidden",
          )}
        >
          <CardContent className="px-0 space-y-5">
            <CardTitle className="text-lg md:text-xl font-medium text-black">
              All Regions and states
            </CardTitle>
            <div className="w-full relative border border-[#A1A1A1] h-10 rounded-full">
              <Search className="text-[#A1A1A1] size-6 absolute top-1/2 -translate-y-1/2 left-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" border-[#44444480] pl-12 h-10 rounded-full w-full md:text-lg md:placeholder:text-lg"
              />
            </div>
            <div className="space-y-2.5">
              {regions.map((region, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectRegion(index)}
                  className={cn(
                    "cursor-pointer px-3 py-4 flex justify-between items-center border border-[#A1A1A1]/50 rounded-[10px]",
                    regionId === index && "bg-[#616FF5]/20",
                  )}
                >
                  <p className="text-base md:text-lg font-normal text-[#303030]">
                    {region}
                  </p>
                  <CustomSwitch
                    onCheckedChange={(checked: boolean) => {
                      if (!checked) handleDisableDelivery();
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isMobile && regionId ? (
          <div className="flex gap-2.5 items-center" onClick={() => router.back()}>
            <ChevronLeft className="size-6" />
            <div className="text-lg font-normal text-[#1E1E1E]">
              {regions[regionId]}
            </div>
          </div>
        ): null}

        <Card
          className={cn(
            "w-full rounded-[10px] p-5 max-h-[75vh] overflow-y-scroll hide-scrollbar",
            isMobile && !regionId && "hidden",
          )}
        >
          <CardContent className="px-0 space-y-5">
            <h3 className="text-lg md:text-xl font-medium text-black">
              Payment method
            </h3>
            <div className="flex items-center gap-2.5">
              <Checkbox id="cod" className="size-5" />
              <label
                htmlFor="cod"
                className="text-lg font-normal cursor-pointer"
              >
                Cash on Delivery (COD)
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="prepaid" className="size-5" />
              <label
                htmlFor="prepaid"
                className="text-lg font-normal cursor-pointer"
              >
                Prepaid
              </label>
            </div>
            <div className="w-full h-[1px] bg-[#A1A1A1]/50" />
            <div className=" flex justify-between items-center">
              <p className="text-base md:text-lg font-normal text-[#303030]">
                Free delivery for all township
              </p>
              <CustomSwitch
                checked={deliveryType === "free"}
                onCheckedChange={handleFreeDeliChecked}
              />
            </div>
            <div className="space-y-4">
              <div className=" flex justify-between items-center">
                <p className="text-base md:text-lg font-normal text-[#303030]">
                  Universal fee for this region
                </p>
                <CustomSwitch
                  checked={deliveryType === "allTown"}
                  onCheckedChange={handleAllTownChecked}
                />
              </div>
              {deliveryType === "allTown" && (
                <div className="w-full md:w-[242px] h-11 md:h-14 rounded-[10px] border border-[#3C3C3C]/30  relative">
                  <Input
                    placeholder=""
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" border-[#44444480] pl-4 pr-10 h-11 md:h-14 rounded-[10px] w-full md:w-[242px] text-sm placeholder:text-sm md:text-base md:placeholder:text-base"
                  />
                  <span className="text-base md:text-lg absolute top-1/2 -translate-y-1/2 right-4">
                    Ks
                  </span>
                </div>
              )}
            </div>
            <div className="w-full h-[1px] bg-[#A1A1A1]/50" />
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-medium text-black">
                Delivery fee per township
              </h3>
              <CustomSwitch
                checked={deliveryType === "perTown"}
                onCheckedChange={handlePerTownChecked}
              />
            </div>
            {deliveryType === "perTown" && (
              <>
                <div className="w-full md:w-[340px] relative border border-[#A1A1A1] h-10 rounded-full">
                  <Search className="text-[#A1A1A1] size-6 absolute top-1/2 -translate-y-1/2 left-4" />
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" border-[#44444480] pl-12 h-10 rounded-full w-full md:w-[340px] md:text-lg md:placeholder:text-lg"
                  />
                </div>
                {isMobile ? (
                  <div className="space-y-4">
                    {regions.map((region, index) => (
                      <div key={index} className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="text-base md:text-lg font-normal">
                            {region}
                          </div>
                          <CustomSwitch />
                        </div>
                        <div className="w-full md:w-[242px] h-11 md:h-14 rounded-[10px] border border-[#3C3C3C]/30  relative">
                          <Input
                            placeholder=""
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className=" border-[#44444480] pl-4 pr-10 h-11 md:h-14 rounded-[10px] w-full md:w-[242px] text-sm placeholder:text-sm md:text-base md:placeholder:text-base"
                          />
                          <span className="text-base md:text-lg absolute top-1/2 -translate-y-1/2 right-4">
                            Ks
                          </span>
                        </div>{" "}
                      </div>
                    ))}
                  </div>
                ) : (
                  <table className="w-[calc(100%+40px)] table-fixed -translate-x-5 overflow-visible">
                    <thead className="bg-[#EEEEEE]">
                      <tr>
                        <th className="w-1/3 text-start py-4 px-5 text-base md:text-lg font-medium">
                          Township
                        </th>
                        <th className="w-1/3 text-center py-4 px-5 text-base md:text-lg font-medium">
                          Amount
                        </th>
                        <th className="w-1/3 text-end py-4 px-5 text-base md:text-lg font-medium">
                          Delivery availability
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {regions.map((region, index) => (
                        <tr key={index}>
                          <td className="w-1/3 text-start text-base md:text-lg font-normal pt-4 px-5">
                            {region}
                          </td>
                          <td className="w-1/3 text-center pt-4 px-5">
                            <div className="w-full flex items-center justify-center">
                              <div className="w-[242px] h-14 rounded-[10px] border border-[#3C3C3C]/30  relative">
                                <Input
                                  placeholder=""
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  className=" border-[#44444480] pl-4 pr-10 h-14 rounded-[10px] w-[242px] text-sm placeholder:text-sm md:text-base md:placeholder:text-base"
                                />
                                <span className="text-base md:text-lg absolute top-1/2 -translate-y-1/2 right-4">
                                  Ks
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="w-1/3 pt-4 px-5">
                            <div className="flex justify-end pr-14 items-center w-full">
                              <CustomSwitch />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex items-center justify-between w-full gap-2.5">
            <Button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving || disabled}
              className={cn(
                "h-auto w-full flex-1 rounded-[10px] bg-[#A1A1A1] py-1.5 text-base font-medium text-white duration-300 hover:bg-[#444444] active:scale-95 mfull md:text-lg",
                disabled || (isSaving && "bg-[#444444]/50"),
              )}
            >
              Discard
            </Button>
            <Button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving || disabled}
              className={cn(
                "bg-primary flex-1 h-auto w-full rounded-[10px] py-1.5 text-base font-medium text-white duration-300 active:scale-95 md:w-[135px] md:text-lg",
                disabled && "bg-primary/50",
              )}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={dialogModal.isOpen}
        setOpen={dialogToggle}
        callback={dialogModal.onConfirm}
        loading={false}
        title={dialogModal.title}
        description={dialogModal.message}
      />
    </section>
  );
};

export default DeliveryPage;
