"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronRightIcon,
  Loader2Icon,
  PlusCircle,
  Trash2,
  XIcon,
} from "lucide-react";
import { handleInputAmountChange } from "@/utils/numberFormat";
import { UseFormReturn } from "react-hook-form";
import { CreateProductPayload } from "@/types/product/product-form.schemas";
import { useVariantsLogic } from "@/hooks/products/useVariantsLogic";
import { Badge } from "@/components/ui/badge";
import { CategoryVariantGroup } from "@/types/categories";
import { Dialog } from "@/components/ui/dialog";
import { VariantCombination } from "@/types/product";
import VariantEditDialog from "./VariantEditDialog";
import { cn } from "@/lib/utils";
import { ProductVariant, Variant } from "@/store/useProductStore";
import IconTrash from "@/assets/icons/Trash";

interface Props {
  variants: Variant[];
  productVarints: ProductVariant[];
  categoryVariantGroups: CategoryVariantGroup[];
  isDuplicate?: boolean;
}

export default function VariantSection({
  variants,
  productVarints,
  categoryVariantGroups,
  isDuplicate = false,
}: Props) {
  const [dialogSelectedVariant, setDialogSelectedVariant] =
    useState<VariantCombination | null>(null);
  const [tempProductVarint, setTempProductVarint] = useState<ProductVariant>({
    name: "",
    values: [],
  });

  const [newValue, setNewValue] = useState("");

  const handleDeleteValue = (index: number) => {
    const updateValues = tempProductVarint.values.filter(
      (v, idx) => idx !== index
    );

    setTempProductVarint({
      name: tempProductVarint.name,
      values: updateValues,
    });
  };

  const handleDeleteTemp = () => {
    setTempProductVarint(name: "", values: [])
  }

  const [showNew, setShowNew] = useState(true);

  console.log(tempProductVarint);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Variant</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Options Section */}
          <div className="space-y-4">
            {showNew && (
              <div className="border rounded-[10px] border-[#EEEEEE] p-5 flex flex-col gap-2.5">
                <label htmlFor="">Option name</label>
                <Input placeholder="Option name" />
                <label htmlFor="">Option values</label>
                {tempProductVarint.values.map((v, index) => (
                  <div key={index} className="relative flex items-center">
                    <Input
                      placeholder="Option values"
                      className="pointer-events-none"
                      defaultValue={v}
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteValue(index)}
                      className="absolute right-5"
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
                <Input
                  type="text"
                  placeholder="Option values"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("here");
                      setTempProductVarint({
                        name: tempProductVarint.name,
                        values: [...tempProductVarint.values, newValue],
                      });

                      setNewValue("");
                    }
                  }}
                />

                <div className="w-full flex justify-between items-center">
                  <button type="button" className="bg-[#FF3333] text-white rounded-[10px] w-[80px] h-[40px]">Delete</button>
                  <button type="button" className="bg-[#616FF5] text-white rounded-[10px] w-[80px] h-[40px]">Done</button>
                </div>
              </div>
            )}
            <button
              className="text-primary flex gap-2"
              onClick={() => setShowNew(true)}
            >
              <PlusCircle />
              Add Add option
            </button>
          </div>

          {/* Table Section */}
          {/* <div className="relative min-h-[200px]">
            <div className="flex items-center py-4 space-x-5 px-2">
              <h3 className="font-medium text-xl py-1">List</h3>
              <Button
                size="sm"
                type="button"
                variant="destructive"
                onClick={deleteSelected}
                className={cn([
                  "w-fit cursor-pointer bg-destructive/10 rounded-lg hover:bg-destructive/15",
                  { hidden: selectedVariants.length <= 0 },
                ])}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>

            {isGenerating && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[1px]">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  Generating...
                </p>
              </div>
            )} */}

          {/* {variants.length > 0 ? (
              <Table className={isGenerating ? "opacity-50" : ""}>
                <TableHeader>
                  <TableRow className="border-t !border-b-0 border-[#A1A1A1B2]">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedVariants.length === variants.length &&
                          variants.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                        className="border-[#303030] data-[state=checked]:!bg-[#3C3C3C] data-[state=checked]:!text-white"
                      />
                    </TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Buying price</TableHead>
                    <TableHead>Selling price</TableHead>
                    <TableHead>{isDuplicate ? "Sku" : "Stock"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant, idx) => {
                    return (
                      <TableRow
                        key={variant.id}
                        className="cursor-pointer border-none"
                      >
                        <TableCell className="no-row-click">
                          <Checkbox
                            checked={selectedVariants.includes(
                              variant.id as number
                            )}
                            onCheckedChange={() =>
                              toggleVariantSelection(variant.id as number)
                            }
                            className="border-[#303030] data-[state=checked]:!bg-[#3C3C3C] data-[state=checked]:!text-white"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {variant.name}
                        </TableCell>
                       
                        <TableCell className="no-row-click">
                          <div className="relative w-24">
                            <Input
                              value={variant.purchasePrice}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                updateField(
                                  idx,
                                  "purchasePrice",
                                  handleInputAmountChange(e)
                                )
                              }
                              className="h-8"
                            />
                            <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] text-gray-500">
                              Ks
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="no-row-click">
                          <div className="relative w-24">
                            <Input
                              value={variant.sellingPrice}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                updateField(
                                  idx,
                                  "sellingPrice",
                                  handleInputAmountChange(e)
                                )
                              }
                              className="h-8"
                            />
                            <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] text-gray-500">
                              Ks
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="no-row-click">
                          <Input
                            value={isDuplicate ? variant.sku : variant.quantity}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              updateField(
                                idx,
                                isDuplicate ? "sku" : "quantity",
                                e.target.value
                              )
                            }
                            className="h-8 w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className="rounded-full"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              setDialogSelectedVariant(variant);
                            }}
                          >
                            <ChevronRightIcon className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              !isGenerating && (
                <div className="flex min-h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
                  Variants will appear once you add values.
                </div>
              )
            )} */}
          {/* </div> */}
        </CardContent>
      </Card>

      {/* --- DIALOG COMPONENT --- */}
      {/* <Dialog
        open={!!dialogSelectedVariant}
        onOpenChange={(open) => {
          if (!open) setDialogSelectedVariant(null);
        }}
      >
        {dialogSelectedVariant && (
          <VariantEditDialog
            variants={variants}
            SelectedVariant={dialogSelectedVariant}
            updateVariantFields={(vid, data) => {
              const i = variants.findIndex((v) => v.id === Number(vid));
              if (i > -1) {
                const { ...payload } = data;
                updateFields(i, payload);
              }
            }}
            handleClose={() => setDialogSelectedVariant(null)}
          />
        )}
      </Dialog> */}
    </>
  );
}
