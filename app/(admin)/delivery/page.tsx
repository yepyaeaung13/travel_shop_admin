"use client";

import ConfirmDialog from "@/components/confirm-dialog/confirm-dialog";
import { successToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CustomSwitch, Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  useGetDeliveryRegion,
  useGetDeliveryRegionById,
  useUpdateDeliveryRegionById,
  useUpdateStatusRegionById,
} from "@/queries/delivery";
import { ChevronDown, ChevronLeft, ChevronUp, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

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

export default function Page() {
  return (
    <Suspense fallback="">
      <DeliveryPage />
    </Suspense>
  );
}

const DeliveryPage = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [disabled, setDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
  const [expandedDistricts, setExpandedDistricts] = useState<number[]>([]);

  const { data: deliveryRegionData, isLoading } = useGetDeliveryRegion();
  const { data: regionDetail, isLoading: detailLoading } =
    useGetDeliveryRegionById(selectedRegion?.id);
  const { mutate: updateStatusRegion, isPending } = useUpdateStatusRegionById();
  const { mutate: updateRegion, isPending: updateRegionLoading } =
    useUpdateDeliveryRegionById();

  const [regionState, setRegionState] = useState<any | null>(null);

  useEffect(() => {
    if (regionDetail?.data) {
      setRegionState(regionDetail.data);
    }
  }, [regionDetail]);

  useEffect(() => {
    if (deliveryRegionData?.data) {
      setSelectedRegion(deliveryRegionData?.data[0]);
    }
  }, [deliveryRegionData]);

  type RegionDeliveryField =
    | "deliveryFeePerTownship"
    | "deliveryFree"
    | "deliveryFeeForAllTownship"
    | "deliveryFee";

  const updateRegionFieldForBoolean = (
    field: RegionDeliveryField,
    checked: boolean,
  ) => {
    setRegionState((prev: any) => {
      // start by turning all off
      const next = {
        ...prev,
        deliveryFeePerTownship: false,
        deliveryFree: false,
        deliveryFeeForAllTownship: false,
      };

      // if checked, enable only the selected field
      if (checked) {
        next[field] = true;
      }

      return next;
    });
  };

  const updateRegionField = (field: RegionDeliveryField, value: any) => {
    setRegionState((prev: any) => {
      // start by turning all off
      const next = {
        ...prev,
        [field]: value,
      };

      return next;
    });
  };

  const updateDistrictField = (
    districtId: number,
    field: string,
    value: any,
  ) => {
    setRegionState((prev: any) => ({
      ...prev,
      districts: prev.districts.map((d: any) =>
        d.id === districtId ? { ...d, [field]: value } : d,
      ),
    }));
  };

  const updateTownshipField = (
    districtId: number,
    townshipId: number,
    field: "fee" | "status",
    value: any,
  ) => {
    setRegionState((prev: any) => ({
      ...prev,
      districts: prev.districts.map((d: any) => {
        if (d.id !== districtId) return d;

        return {
          ...d,
          townships: d.townships.map((t: any) =>
            t.id === townshipId ? { ...t, [field]: value } : t,
          ),
        };
      }),
    }));
  };

  const toggleDistrict = (id: number) => {
    setExpandedDistricts((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const getDistrictFeeRange = (townships: { fee: number }[]) => {
    if (!townships.length) return { min: 0, max: 0 };

    const fees = townships.map((t) => t.fee);
    return {
      min: Math.min(...fees),
      max: Math.max(...fees),
    };
  };

  const updateDistrictTownshipFee = (districtId: number, fee: number) => {
    setRegionState((prev: any) => ({
      ...prev,
      districts: prev.districts.map((d: any) => {
        if (d.id !== districtId) return d;

        return {
          ...d,
          townships: d.townships.map((t: any) => ({
            ...t,
            fee,
          })),
        };
      }),
    }));
  };

  const updateDistrictTownshipStatus = (districtId: number, status: string) => {
    setRegionState((prev: any) => ({
      ...prev,
      districts: prev.districts.map((d: any) => {
        if (d.id !== districtId) return d;

        return {
          ...d,
          townships: d.townships.map((t: any) => ({
            ...t,
            status,
          })),
        };
      }),
    }));
  };

  const togglePaymentMethod = (methodId: number, checked: boolean) => {
    setRegionState((prev: any) => {
      const current = prev.paymentMethods ?? [];

      return {
        ...prev,
        paymentMethods: checked
          ? [...current, methodId] // add
          : current.filter((id: number) => id !== methodId), // remove
      };
    });
  };

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
        const { allPaymentMethods, ...payload } = regionState;
        updateRegion(payload, {
          onSuccess: () => {
            successToast(
              "Success",
              `${regionState.name} region update successfully.`,
            );
            setDialogModal({
              ...dialogModal,
              isOpen: false,
            });
          },
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

  const handleTurnOnFreeDeli = (checked: boolean) => {
    setDialogModal({
      isOpen: true,
      title: `Are you sure you want to ${checked ? "set" : "disable"} set free delivery for all townships?`,
      message: "",
      onConfirm: () => {
        updateRegionFieldForBoolean("deliveryFree", checked);
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handleTurnOnPerTownship = (checked: boolean) => {
    setDialogModal({
      isOpen: true,
      title: `Are you sure you want to ${checked ? "set" : "disable"} delivery fees per township?`,
      message: "",
      onConfirm: () => {
        updateRegionFieldForBoolean("deliveryFeePerTownship", checked);
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handleTurnOnAllTownship = (checked: boolean) => {
    setDialogModal({
      isOpen: true,
      title: `Are you sure you want to ${checked ? "set" : "disable"} universal delivery fees?`,
      message: "",
      onConfirm: () => {
        updateRegionFieldForBoolean("deliveryFeeForAllTownship", checked);
        setDialogModal({
          ...dialogModal,
          isOpen: false,
        });
      },
      onCancel: resetDialogModal,
    });
  };

  const handleDisableDelivery = (id: number, checked: boolean) => {
    setDeliveryType("none");
    const selectedRegion = deliveryRegionData?.data.find(
      (r: any) => r.id === id,
    );
    setDialogModal({
      isOpen: true,
      title: `Are you sure you want to ${checked ? "enable" : "disable"} delivery for ${selectedRegion.name}?`,
      message: "",
      onConfirm: () => {
        updateStatusRegion(
          { id, status: checked ? "ACTIVE" : "INACTIVE" },
          {
            onSuccess: () => {
              successToast("Success", "Status update successfully.");
              setDialogModal({
                ...dialogModal,
                isOpen: false,
              });
            },
          },
        );
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

  const handleSelectRegion = (region: any) => {
    setSelectedRegion(region);
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
            isMobile && selectedRegion && "hidden",
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
              {isLoading ? (
                <p className="text-center">loading...</p>
              ) : (
                deliveryRegionData?.data?.map((region: any) => (
                  <div
                    key={region.id}
                    onClick={() => handleSelectRegion(region)}
                    className={cn(
                      "cursor-pointer px-3 py-4 flex justify-between items-center border border-[#A1A1A1]/50 rounded-[10px]",
                      selectedRegion?.id === region.id && "bg-[#616FF5]/20",
                    )}
                  >
                    <p className="text-base md:text-lg font-normal text-[#303030]">
                      {region.name}
                    </p>
                    <CustomSwitch
                      checked={region.status === "ACTIVE"}
                      onCheckedChange={(checked: boolean) => {
                        handleDisableDelivery(region.id, checked);
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {isMobile && selectedRegion ? (
          <div
            className="flex gap-2.5 items-center"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-6" />
            <div className="text-lg font-normal text-[#1E1E1E]">
              {selectedRegion.name}
            </div>
          </div>
        ) : null}

        <Card
          className={cn(
            "w-full rounded-[10px] p-5 max-h-[75vh] overflow-y-scroll hide-scrollbar",
            isMobile && !selectedRegion && "hidden",
          )}
        >
          {isLoading || detailLoading ? (
            <div className="min-h-[75vh] flex items-center justify-center">
              <p className="text-center">loading...</p>
            </div>
          ) : (
            <CardContent className="px-0 space-y-5">
              <h3 className="text-lg md:text-xl font-medium text-black">
                Payment method
              </h3>
              {regionState?.allPaymentMethods.map(
                (method: { id: number; name: string }) => (
                  <div key={method.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={method.name}
                      className="size-5"
                      checked={regionState?.paymentMethods?.includes(method.id)}
                      onCheckedChange={(checked) =>
                        togglePaymentMethod(method.id, Boolean(checked))
                      }
                    />
                    <label
                      htmlFor={method.name}
                      className="text-lg font-normal cursor-pointer"
                    >
                      {method.name}
                    </label>
                  </div>
                ),
              )}
              <div className="w-full h-[1px] bg-[#A1A1A1]/50" />
              <div className=" flex justify-between items-center">
                <p className="text-base md:text-lg font-normal text-[#303030]">
                  Free delivery for all township
                </p>
                <CustomSwitch
                  checked={regionState?.deliveryFree}
                  onCheckedChange={handleTurnOnFreeDeli}
                />
              </div>
              <div className="space-y-4">
                <div className=" flex justify-between items-center">
                  <p className="text-base md:text-lg font-normal text-[#303030]">
                    Universal fee for this region
                  </p>
                  <CustomSwitch
                    checked={regionState?.deliveryFeeForAllTownship}
                    onCheckedChange={handleTurnOnAllTownship}
                  />
                </div>
                {regionState?.deliveryFeeForAllTownship && (
                  <div className="w-full md:w-[242px] h-11 md:h-14 rounded-[10px] border border-[#3C3C3C]/30  relative">
                    <Input
                      type="number"
                      placeholder=""
                      value={regionState?.deliveryFee.toString()}
                      onChange={(e) =>
                        updateRegionField("deliveryFee", Number(e.target.value))
                      }
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
                  checked={regionState?.deliveryFeePerTownship}
                  onCheckedChange={handleTurnOnPerTownship}
                />
              </div>
              {regionState?.deliveryFeePerTownship && (
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
                      {regionState.districts.map(
                        (distrct: {
                          id: number;
                          name: string;
                          townships: any[];
                        }) => (
                          <div key={distrct.id} className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="text-base md:text-lg font-normal">
                                {distrct.name}
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
                        ),
                      )}
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
                        {regionState.districts.map(
                          (district: {
                            id: number;
                            name: string;
                            status: string;
                            townships: {
                              id: number;
                              name: string;
                              fee: number;
                              status: string;
                            }[];
                          }) => {
                            const isExpanded = expandedDistricts.includes(
                              district.id,
                            );
                            const { min, max } = getDistrictFeeRange(
                              district.townships,
                            );

                            return (
                              <React.Fragment key={district.id}>
                                {/* 🔹 DISTRICT ROW */}
                                <tr className="">
                                  <td
                                    className="w-1/3 text-start text-base md:text-lg font-medium py-2 px-5 cursor-pointer"
                                    onClick={() => toggleDistrict(district.id)}
                                  >
                                    <div className="flex items-center gap-2">
                                      {isExpanded ? (
                                        <ChevronUp className="size-4" />
                                      ) : (
                                        <ChevronDown className="size-4" />
                                      )}
                                      {district.name}
                                    </div>
                                  </td>

                                  <td className="w-1/3 text-center py-2 px-5">
                                    <div className="w-full flex items-center justify-center">
                                      <div className="w-[242px] h-12 rounded-[10px] border border-[#3C3C3C]/30 relative">
                                        <Input
                                          key={district.id}
                                          className="pl-4 pr-10 h-12 rounded-[10px] w-[242px]"
                                          value={min === max ? min : ""}
                                          placeholder={
                                            min === max
                                              ? undefined
                                              : `${min} – ${max}`
                                          }
                                          onChange={(e) => {
                                            const rawValue = e.target.value;
                                            const numericValue =
                                              rawValue.replace(/[^0-9]/g, "");

                                            updateDistrictTownshipFee(
                                              district.id,
                                              Number(numericValue),
                                            );
                                          }}
                                        />
                                        <span className="absolute top-1/2 -translate-y-1/2 right-4">
                                          Ks
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="w-1/3 py-2 px-5">
                                    <div className="flex justify-end pr-14">
                                      <CustomSwitch
                                        checked={district.status === "ACTIVE"}
                                        onCheckedChange={(v) => {
                                          const status = v
                                            ? "ACTIVE"
                                            : "INACTIVE";

                                          updateDistrictField(
                                            district.id,
                                            "status",
                                            status,
                                          );
                                          updateDistrictTownshipStatus(
                                            district.id,
                                            status,
                                          );
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>

                                {/* 🔸 TOWNSHIP ROWS */}
                                {isExpanded &&
                                  district.townships.map((ts) => (
                                    <tr key={ts.id} className="bg-white">
                                      <td className="pl-14 pt-3 pb-3 text-sm md:text-base">
                                        {ts.name}
                                      </td>

                                      <td className="text-center pt-3 pb-3">
                                        <div className="flex justify-center">
                                          <div className="w-[242px] h-10 rounded-[8px] border border-[#3C3C3C]/30 relative">
                                            <Input
                                              value={ts.fee}
                                              onChange={(e) =>
                                                updateTownshipField(
                                                  district.id,
                                                  ts.id,
                                                  "fee",
                                                  Number(e.target.value),
                                                )
                                              }
                                              className="pl-4 pr-10 h-10 rounded-[8px]"
                                            />
                                            <span className="absolute top-1/2 -translate-y-1/2 right-4 text-sm">
                                              Ks
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="pt-3 pb-3">
                                        <div className="flex justify-end pr-18">
                                          <CustomSwitch
                                            checked={ts.status === "ACTIVE"}
                                            onCheckedChange={(v) =>
                                              updateTownshipField(
                                                district.id,
                                                ts.id,
                                                "status",
                                                v ? "ACTIVE" : "INACTIVE",
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              </React.Fragment>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </CardContent>
          )}
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
        loading={isPending || updateRegionLoading}
        title={dialogModal.title}
        description={dialogModal.message}
      />
    </section>
  );
};
