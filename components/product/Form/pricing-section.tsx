"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CreateProductState,
  PromoteType,
  useCreateProductStore,
} from "@/store/useProductStore";
import { useEffect } from "react";

interface PricingSectionProps {
  promoteType: PromoteType;
  promoteValue: number;
  isPromote: boolean;
  setField: <K extends keyof CreateProductState>(
    key: K,
    value: CreateProductState[K],
  ) => void;
  sellingPriceMMK: number;
  sellingPriceUSD: number;
  sellingPriceCNY: number;
}

export default function PricingSection({
  promoteType,
  promoteValue,
  isPromote,
  setField,
  sellingPriceMMK,
  sellingPriceUSD,
  sellingPriceCNY,
}: PricingSectionProps) {
  const { variants } = useCreateProductStore.getState();

  const variantItems = variants.flatMap((v) => v.variantItems);

  const minVariantPriceMMK =
    variantItems.length > 0
      ? Math.min(
          ...variantItems.map((v) => v.sellingPrice ?? 0).filter((p) => p > 0),
        )
      : 0;

  useEffect(() => {
    if (variants.length > 0) {
      setField("sellingPriceMMK", 0);
    }
  }, [variants]);

  const clampDiscountValue = (
    value: number,
    promoteType: PromoteType,
    sellingPriceMMK: number,
  ) => {
    if (value < 0) return 0;

    if (promoteType === PromoteType.PERCENT) {
      return Math.min(value, 100);
    }

    if (variantItems.length > 0) {
      return Math.min(value, minVariantPriceMMK);
    }

    // AMOUNT
    return Math.min(value, sellingPriceMMK);
  };

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-medium">
          Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 grid grid-cols-2 gap-5">
        <div className={cn("space-y-6")}>
          <div
            className={cn(
              variants.length > 0 && "pointer-events-none opacity-50",
            )}
          >
            <PriceField
              name="sellingPriceMMK"
              label="Selling Price"
              placeholder="Selling price"
              unit="Ks"
              isRequired={true}
              value={sellingPriceMMK.toString()}
              onChangeValue={(value: number) =>
                setField("sellingPriceMMK", value)
              }
            />
          </div>
          <PriceField
            name="sellingPriceUSD"
            label="Selling Price (USD)"
            placeholder="Selling Price in Dollar"
            unit="$"
            isRequired={false}
            value={sellingPriceUSD.toString()}
            onChangeValue={(value: number) =>
              setField("sellingPriceUSD", value)
            }
          />
          <PriceField
            name="sellingPriceCNY"
            label="Selling Price (CNY)"
            placeholder="Selling Price in Yuan"
            unit="¥"
            isRequired={false}
            value={sellingPriceCNY.toString()}
            onChangeValue={(value: number) =>
              setField("sellingPriceCNY", value)
            }
          />
        </div>

        <div className="space-y-4 md:space-y-2">
          <div className="flex justify-between items-center space-x-2">
            <label className="text-base md:text-lg font-medium text-[#303030]">
              Discount
            </label>
            <Switch
              checked={isPromote}
              onCheckedChange={(checked) => {
                setField("isPromote", checked);
                if (!checked) {
                  // Disable discount by clearing promoteType
                  setField("promoteType", PromoteType.PERCENT);
                  setField("promoteValue", 0);
                }
              }}
            />
          </div>

          <div
            className={cn(
              "space-y-4 pl-4 md:pl-0",
              !isPromote && "pointer-events-none opacity-50",
            )}
          >
            <div className="relative">
              <Input
                type="number"
                placeholder={
                  promoteType === PromoteType.PERCENT
                    ? "Enter percentage"
                    : "Enter amount"
                }
                value={promoteValue.toString()}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => {
                  const raw = Number(e.target.value);

                  const safeValue = clampDiscountValue(
                    raw,
                    promoteType,
                    sellingPriceMMK,
                  );

                  console.log("safe", safeValue);

                  setField("promoteValue", safeValue);
                }}
                className="h-12 md:h-14 placeholder:md:text-base md:text-base rounded-[10px] p-4 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 text-sm md:text-lg font-normal">
                {promoteType === PromoteType.PERCENT ? "%" : "Ks"}
              </span>
            </div>
            <div>
              <RadioGroup
                onValueChange={(value) => {
                  setField("promoteType", value as PromoteType);
                  setField("promoteValue", 0);
                }}
                value={promoteType}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PERCENT" id="discount-percentage" />
                  <Label
                    htmlFor="discount-percentage"
                    className="cursor-pointer md:text-lg font-normal"
                  >
                    Percentage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="AMOUNT" id="discount-amount" />
                  <Label
                    htmlFor="discount-amount"
                    className="cursor-pointer md:text-lg font-normal"
                  >
                    Amount
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceField({
  name,
  label,
  isRequired,
  placeholder,
  unit,
  value,
  onChangeValue,
}: {
  name: string;
  label: string;
  isRequired: boolean;
  placeholder: string;
  unit: string;
  value: string;
  onChangeValue: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base md:text-lg font-medium text-[#303030]">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Input
          type="number"
          inputMode="decimal"
          pattern="[0-9]*"
          placeholder={placeholder}
          name={name}
          className="h-12 md:h-14 rounded-[10px] p-4 pr-12 placeholder:md:text-base md:text-base"
          value={value}
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => {
            // ✅ Numbers only!
            const rawValue = e.target.value;
            const numericValue = rawValue.replace(/[^0-9.]/g, "");

            // add logic
            onChangeValue(Number(numericValue));
          }}
        />
        <span
          className={cn([
            "absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 text-sm md:text-lg font-normal",
            { "text-primary text-lg": unit !== "Ks" },
          ])}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}
