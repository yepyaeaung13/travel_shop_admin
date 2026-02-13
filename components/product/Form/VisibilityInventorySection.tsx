"use client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CreateProductState,
  GroupedVariant,
  VariantItem,
} from "@/store/useProductStore";
import { useEffect } from "react";

type Props = {
  sku: string;
  stock: number;
  setField: <K extends keyof CreateProductState>(
    key: K,
    value: CreateProductState[K]
  ) => void;
  variants: GroupedVariant[];
};

export default function VisibilityInventorySection({
  sku,
  stock,
  setField,
  variants,
}: Props) {
  const isDisabled = variants.length > 0;

  useEffect(() => {
    if (variants.length > 0) {
      setField("stock", 0);
      setField("sku", "");
    }
  }, [variants]);

  return (
    <div className={cn("space-y-6")}>
      <Card className={cn("gap-2", isDisabled && "opacity-40")}>
        <CardHeader>
          <CardTitle className="text-lg mdLtext-xl font-medium text-[#303030]">Inventory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stock - Updated field name */}
          <div className="flex flex-col gap-2">
            <label className="text-base md:text-lg font-normal text-[#303030]">Stock</label>

            <Input
              type="number"
              disabled={isDisabled}
              required={!isDisabled}
              placeholder="Stock"
              value={stock.toString()}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => {
                const rawValue = e.target.value;
                const numericValue = rawValue.replace(/[^0-9.]/g, "");
                setField("stock", Number(numericValue));
              }}
              className="h-12 md:h-14 placeholder:md:text-base md:text-base rounded-[10px] p-4"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base md:text-lg font-normal text-[#303030]">Product SKU</label>
            <Input
              value={sku}
              disabled={isDisabled}
              // required={!isDisabled}
              onChange={(e) => setField("sku", e.target.value)}
              placeholder="Product SKU"
              className="h-12 md:h-14 placeholder:md:h-base md:text-base rounded-[10px] p-4"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
