"use client";

import { useRef, useState, useMemo } from "react";
import { z } from "zod"; // Added ZodIssueCode
import { handleInputAmountChange } from "@/utils/numberFormat";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { VariantCombination } from "@/types/product";
import {variantSchema} from "@/types/product/product-form.schemas"; // Ensure correct path

/* --- SCHEMAS --- */

const WeightBranch = variantSchema.extend({
  mode: z.literal("Weight"),
  weightValue: z
    .number({ error: "Weight value must be a number." })
    .nonnegative()
    .optional(),
  weightUnit: z.string().optional(),
});

const SizeBranch = variantSchema.extend({
  mode: z.literal("Size"),
  sizeValue: z.string().optional(),
  sizeUnit: z.string().optional(),
});

const VariantEditSchema = z
  .discriminatedUnion("mode", [WeightBranch, SizeBranch])
  .superRefine((data, ctx) => {
    if (data.mode === "Weight") {
      if (data.weightValue != null && !data.weightUnit) {
        ctx.addIssue({
          code: "custom",
          message: "Unit is required.",
          path: ["weightUnit"],
        });
      }
    } else if (data.mode === "Size") {
      if (data.sizeValue != null && !data.sizeUnit) {
        ctx.addIssue({
          code: "custom",
          message: "Unit is required.",
          path: ["sizeUnit"],
        });
      }
    }
  });

/* --- HELPER --- */

const ErrorMessage = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <FormMessage className={errorMessage ? "opacity-100" : "opacity-0"}>
      {errorMessage || "No error"}
    </FormMessage>
  );
};

/* --- COMPONENT --- */

interface Props {
  variants: VariantCombination[];
  SelectedVariant: VariantCombination;
  updateVariantFields: (id: number, data: any) => void;
  handleClose: () => void;
}

export default function VariantEditDialog({
  variants,
  SelectedVariant,
  updateVariantFields,
  handleClose,
}: Props) {
  const fresh = useMemo(
    () => variants.find((v) => v.id === SelectedVariant.id) ?? SelectedVariant,
    [variants, SelectedVariant]
  );

  const skuRef = useRef<HTMLInputElement>(null);
  const bpRef = useRef<HTMLInputElement>(null);
  const spRef = useRef<HTMLInputElement>(null);
  const stRef = useRef<HTMLInputElement>(null);
  const wvRef = useRef<HTMLInputElement>(null);
  const svRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [mode, setMode] = useState<"Weight" | "Size">(
    fresh.weightValue != null ? "Weight" : "Size"
  );
  const [weightUnit, setWeightUnit] = useState(fresh.weightUnit ?? "kg");
  const [sizeUnit, setSizeUnit] = useState(fresh.sizeUnit ?? "cm");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track previous ID for synchronous sync (Fixes ESLint setState error)
  const [prevId, setPrevId] = useState(fresh.id);

  if (fresh.id !== prevId) {
    setPrevId(fresh.id);
    setMode(fresh.weightValue != null ? "Weight" : "Size");
    setWeightUnit(fresh.weightUnit ?? "kg");
    setSizeUnit(fresh.sizeUnit ?? "cm");
    setErrors({});
  }

  const handleSave = () => {
    const raw = {
      mode,
      sku: skuRef.current?.value.trim() ?? "",
      purchasePrice: Number(bpRef.current?.value) || 0,
      sellingPrice: Number(spRef.current?.value) || 0,
      quantity: Number(stRef.current?.value) || 0,
      weightValue: mode === "Weight" ? Number(wvRef.current?.value) || undefined : undefined,
      weightUnit: mode === "Weight" ? weightUnit : undefined,
      sizeValue: mode === "Size" ? svRef.current?.value.trim() : undefined,
      sizeUnit: mode === "Size" ? sizeUnit : undefined,
    };

    const result = VariantEditSchema.safeParse(raw);
    if (!result.success) {
      const out: Record<string, string> = {};
      // Using .issues instead of deprecated .flatten()
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString();
        if (path) out[path] = issue.message;
      });
      setErrors(out);
      return;
    }

    updateVariantFields(SelectedVariant.id as number, result.data);
    handleClose();
  };

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>Edit {fresh.name}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Separator />
        <h2 className="text-lg font-medium">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Buying Price</FormLabel>
            <div className="relative">
              <Input
                ref={bpRef}
                defaultValue={fresh.purchasePrice}
                onChange={(e) => {
                  if (bpRef.current) bpRef.current.value = handleInputAmountChange(e);
                }}
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">Ks</span>
            </div>
            <ErrorMessage errorMessage={errors.purchasePrice} />
          </FormItem>
          <FormItem>
            <FormLabel>Selling Price</FormLabel>
            <div className="relative">
              <Input
                ref={spRef}
                defaultValue={fresh.sellingPrice}
                onChange={(e) => {
                  if (spRef.current) spRef.current.value = handleInputAmountChange(e);
                }}
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">Ks</span>
            </div>
            <ErrorMessage errorMessage={errors.sellingPrice} />
          </FormItem>
        </div>

        <h2 className="text-lg font-medium">Inventory</h2>
        <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <Input ref={stRef} defaultValue={fresh.quantity} />
              <ErrorMessage errorMessage={errors.quantity} />
            </FormItem>
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <Input ref={skuRef} defaultValue={fresh.sku} />
              <ErrorMessage errorMessage={errors.sku} />
            </FormItem>

        </div>
      </div>

      <DialogFooter>
        <Button
          variant="secondary"
          className="w-1/2 bg-[#a1a1a1] text-white transition-colors duration-300 hover:bg-[#a1a1a1b5]"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} className="w-1/2 text-white">
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}