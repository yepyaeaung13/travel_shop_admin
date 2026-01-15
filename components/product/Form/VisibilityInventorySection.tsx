"use client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CreateProductState, Variant } from "@/store/useProductStore";
import { useEffect } from "react";

type Props = {
  sku: string;
  stock: number;
  setField: <K extends keyof CreateProductState>(
    key: K,
    value: CreateProductState[K]
  ) => void;
  variants: Variant[];
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
  }, variants);

  return (
    <div className={cn("space-y-6", isDisabled && "relative")}>
      {isDisabled && (
        <div
          className="absolute inset-0 z-10 rounded-lg bg-background/40 select-none"
          aria-hidden="true"
        />
      )}

      <Card className={cn(isDisabled && "opacity-40")}>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stock - Updated field name */}
          <div>
            <label>
              Stock <span className="text-red-500">*</span>
            </label>

            <Input
              type="number"
              disabled={isDisabled}
              placeholder="Stock"
              value={stock}
              onChange={(e) => setField("stock", Number(e.target.value))}
              className="h-12 rounded-[10px] p-4"
            />
          </div>

          <div>
            <label>Product SKU</label>
            <Input
              value={sku}
              disabled={isDisabled}
              onChange={(e) => setField("sku", e.target.value)}
              placeholder="Product SKU"
              className="h-12 rounded-[10px] p-4"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
