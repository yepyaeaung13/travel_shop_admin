"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
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
  ArrowBigDown,
  ArrowBigUp,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRightIcon,
  ChevronUp,
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
import {
  GroupedVariant,
  ProductVariant,
  VariantItem,
} from "@/store/useProductStore";
import IconTrash from "@/assets/icons/Trash";

interface Props {
  variants: GroupedVariant[];
  addVariant: (variant: GroupedVariant[]) => void;
  removeVariantItem: (parentIndexNo: number, index: number) => void;
  updateVariantItem: (
    parentIndexNo: number,
    index: number,
    variant: VariantItem
  ) => void;
  productVarints: ProductVariant[];
  addProductVariant: (value: ProductVariant) => void;
  removeProductVariant: (index: number) => void;
  updateProductVariant: (indexNo: number, varint: ProductVariant) => void;
  categoryVariantGroups: CategoryVariantGroup[];
  isDuplicate?: boolean;
}

type EditProductVarint = { indexNo: number } & ProductVariant;

export default function VariantSection({
  variants,
  addVariant,
  removeVariantItem,
  updateVariantItem,
  productVarints,
  addProductVariant,
  removeProductVariant,
  updateProductVariant,
  categoryVariantGroups,
  isDuplicate = false,
}: Props) {
  const [dialogSelectedVariant, setDialogSelectedVariant] =
    useState<VariantItem | null>(null);
  const [deleteItemIds, setDeleteItemIds] = useState<
    { parentIndexNo: number; indexNo: number }[]
  >([]);
  const [tempProductVarint, setTempProductVarint] = useState<ProductVariant>({
    name: "",
    values: [],
  });
  const [editProductVarint, setEditProductVarint] = useState<EditProductVarint>(
    {
      name: "",
      values: [],
      indexNo: 0,
    }
  );

  const [showEdit, setShowEdit] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newEditValue, setNewEditValue] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);

  const handleDeleteValue = (index: number) => {
    const updateValues = tempProductVarint.values.filter(
      (v, idx) => idx !== index
    );

    setTempProductVarint({
      name: tempProductVarint.name,
      values: updateValues,
    });
  };

  const handleDeleteValueForEdit = (index: number) => {
    const updateValues = editProductVarint.values.filter(
      (v, idx) => idx !== index
    );

    setEditProductVarint({
      name: editProductVarint.name,
      values: updateValues,
      indexNo: editProductVarint.indexNo,
    });
  };

  const handleDeleteTemp = () => {
    setTempProductVarint({ name: "", values: [] });
  };

  const handleDeleteItem = () => {
    removeProductVariant(editProductVarint.indexNo);
    setEditProductVarint({ name: "", values: [], indexNo: 0 });
    setShowEdit(false);
  };

  const handleAddNew = () => {
    addProductVariant(tempProductVarint);
    setTempProductVarint({ name: "", values: [] });
    setShowNew(false);
  };

  const handleUpdate = () => {
    updateProductVariant(editProductVarint.indexNo, {
      name: editProductVarint.name,
      values: editProductVarint.values,
    });
    setEditProductVarint({ name: "", values: [], indexNo: 0 });
    setShowEdit(false);
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleGroup = (name: string) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleDeleteItem = (parentIndexNo: number, indexNo: number) => {
    setDeleteItemIds((prev) => {
      const exists = prev.some(
        (i) => i.parentIndexNo === parentIndexNo && i.indexNo === indexNo
      );

      if (exists) {
        // unselect
        return prev.filter(
          (i) => !(i.parentIndexNo === parentIndexNo && i.indexNo === indexNo)
        );
      }

      // select
      return [...prev, { parentIndexNo, indexNo }];
    });
  };

  const isItemSelected = (parentIndexNo: number, indexNo: number) =>
    deleteItemIds.some(
      (i) => i.parentIndexNo === parentIndexNo && i.indexNo === indexNo
    );

  const deleteSelectedItems = () => {
    deleteItemIds
      .sort((a, b) => b.indexNo - a.indexNo) // important
      .forEach(({ parentIndexNo, indexNo }) => {
        removeVariantItem(parentIndexNo, indexNo);
      });

    setDeleteItemIds([]);
  };

  const getMinMaxPrice = (items: { sellingPrice: number }[]) => {
    if (!items.length) return { min: 0, max: 0 };

    let min = items[0].sellingPrice;
    let max = items[0].sellingPrice;

    for (const item of items) {
      if (item.sellingPrice < min) min = item.sellingPrice;
      if (item.sellingPrice > max) max = item.sellingPrice;
    }

    return { min, max };
  };

  useEffect(() => {
    const result = generateGroupedVariants(productVarints);
    addVariant(result);
  }, [productVarints]);

  console.log("isdelete", deleteItemIds);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Variant</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Options Section */}
          <div className="space-y-4">
            {productVarints.map((pv, index) => (
              <div
                key={index}
                onClick={() => {
                  setEditProductVarint({ ...pv, indexNo: index });
                  setShowEdit(true);
                }}
                className="hover:bg-gray-100 cursor-pointer border rounded-[10px] border-[#EEEEEE] p-5 flex flex-col gap-2.5"
              >
                <label htmlFor="">{pv.name}</label>
                <div className="flex gap-1.5">
                  {pv.values.map((pvv) => (
                    <button className="bg-primary text-white py-1 px-2.5 rounded-[4px]">
                      {pvv}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {showNew && (
              <div className="border rounded-[10px] border-[#EEEEEE] p-5 flex flex-col gap-2.5">
                <label htmlFor="">Option name</label>
                <Input
                  placeholder="Option name"
                  value={tempProductVarint.name}
                  onChange={(e) =>
                    setTempProductVarint({
                      ...tempProductVarint,
                      name: e.target.value,
                    })
                  }
                />
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
                    if (e.key === "Enter" && newValue.trim()) {
                      e.preventDefault();

                      setTempProductVarint((prev) => ({
                        ...prev,
                        values: [...prev.values, newValue.trim()],
                      }));

                      setNewValue("");
                    }
                  }}
                />

                <div className="w-full flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleDeleteTemp}
                    className="bg-[#FF3333] text-white rounded-[10px] w-[80px] h-[40px]"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="bg-[#616FF5] text-white rounded-[10px] w-[80px] h-[40px]"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
            {showEdit && (
              <div className="border rounded-[10px] border-[#EEEEEE] p-5 flex flex-col gap-2.5">
                <label htmlFor="">Option name</label>
                <Input
                  placeholder="Option name"
                  value={editProductVarint.name}
                  onChange={(e) =>
                    setEditProductVarint({
                      ...editProductVarint,
                      name: e.target.value,
                    })
                  }
                />
                <label htmlFor="">Option values</label>
                {editProductVarint.values.map((v, index) => (
                  <div key={index} className="relative flex items-center">
                    <Input
                      placeholder="Option values"
                      className="pointer-events-none"
                      defaultValue={v}
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteValueForEdit(index)}
                      className="absolute right-5"
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
                <Input
                  type="text"
                  placeholder="Option values"
                  value={newEditValue}
                  onChange={(e) => setNewEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newEditValue.trim()) {
                      e.preventDefault();

                      setEditProductVarint((prev) => ({
                        ...prev,
                        values: [...prev.values, newEditValue.trim()],
                      }));

                      setNewEditValue("");
                    }
                  }}
                />

                <div className="w-full flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleDeleteItem}
                    className="bg-[#FF3333] text-white rounded-[10px] w-[80px] h-[40px]"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="bg-[#616FF5] text-white rounded-[10px] w-[80px] h-[40px]"
                  >
                    Done
                  </button>
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
          {variants.length > 0 && (
            <div className="relative min-h-[200px]">
              <div className="flex items-center py-4 space-x-5 px-2">
                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={deleteSelectedItems}
                  className={cn([
                    "w-fit cursor-pointer bg-destructive/10 rounded-lg hover:bg-destructive/15",
                    { hidden: deleteItemIds.length <= 0 },
                  ])}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EEEEEE]">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Variants</TableHead>
                    {/* <TableHead>Buying price</TableHead> */}
                    <TableHead>Selling price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {variants.map((group, groupIndex) => {
                    const { min, max } = getMinMaxPrice(group.variantItems);
                    return (
                      <Fragment key={group.name}>
                        {/* GROUP ROW */}
                        <TableRow className="bg-muted/40">
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-semibold capitalize">
                            {group.name}
                            <p
                              onClick={() => toggleGroup(group.name)}
                              className="text-xs text-[#3C3C3CCC] font-normal flex gap-1.5 items-center"
                            >
                              {group.variantItems.length} Variants{" "}
                              {expanded[group.name] ? (
                                <ChevronUp className="size-4" />
                              ) : (
                                <ChevronDown className="size-4" />
                              )}
                            </p>
                          </TableCell>
                          <TableCell
                            colSpan={1}
                            className="text-sm text-muted-foreground"
                          >
                            {min === max ? (
                              <Input className="h-8 w-36 pointer-events-none" value={min} />
                            ) : (
                              <Input className="h-8 w-36 pointer-events-none" value={`${min} – ${max}`} />
                               
                            )}
                            {/* <Input
                              defaultValue={group.variantItems.reduce(
                                (pv, cv) => pv + cv.sellingPrice,
                                0
                              )}
                              className="h-8 w-24 pointer-events-none"
                            /> */}
                          </TableCell>
                          <TableCell
                            colSpan={4}
                            className="text-sm text-muted-foreground"
                          >
                            <Input
                              defaultValue={group.variantItems.reduce(
                                (pv, cv) => pv + cv.stock,
                                0
                              )}
                              className="h-8 w-24 pointer-events-none"
                            />
                          </TableCell>
                        </TableRow>

                        {/* VARIANT ITEMS */}
                        {expanded[group.name] &&
                          group.variantItems.map((item, itemIndex) => (
                            <TableRow key={item.sku}>
                              <TableCell className="pl-8">
                                <Checkbox
                                  checked={isItemSelected(
                                    groupIndex,
                                    itemIndex
                                  )}
                                  onCheckedChange={() =>
                                    toggleDeleteItem(groupIndex, itemIndex)
                                  }
                                />
                              </TableCell>

                              <TableCell className="pl-8">
                                {item.name}
                              </TableCell>

                              {/* <TableCell>
                              <Input
                                value={item.buyingPrice}
                                className="h-8 w-24"
                                onChange={(e) =>
                                  updateVariantItem(groupIndex, itemIndex, {
                                    ...item,
                                    buyingPrice: Number(e.target.value),
                                  })
                                }
                              />
                            </TableCell> */}

                              <TableCell>
                                <Input
                                  value={item.sellingPrice}
                                  className="h-8 w-24"
                                  onChange={(e) =>
                                    updateVariantItem(groupIndex, itemIndex, {
                                      ...item,
                                      sellingPrice: Number(e.target.value),
                                    })
                                  }
                                />
                              </TableCell>

                              <TableCell>
                                <Input
                                  value={item.stock}
                                  className="h-8 w-20"
                                  onChange={(e) =>
                                    updateVariantItem(groupIndex, itemIndex, {
                                      ...item,
                                      stock: Number(e.target.value),
                                    })
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
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

function cartesian<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]]
  );
}

export function generateGroupedVariants(
  variants: ProductVariant[]
): GroupedVariant[] {
  if (variants.length === 0) return [];

  const [baseVariant, ...otherVariants] = variants;

  // If only 1 variant (e.g. only Size)
  if (otherVariants.length === 0) {
    return baseVariant.values.map((base) => ({
      name: base,
      variantItems: [
        {
          name: base,
          sku: base.toUpperCase(),
          buyingPrice: 0,
          sellingPrice: 0,
          stock: 0,
        },
      ],
    }));
  }

  const otherValueSets = otherVariants.map((v) => v.values);
  const combinations = cartesian(otherValueSets);

  return baseVariant.values.map((baseValue) => ({
    name: baseValue,
    variantItems: combinations.map((combo) => {
      const fullValues = [baseValue, ...combo];

      return {
        name: combo.join(" / "),
        sku: fullValues
          .map((v) => v.toUpperCase().replace(/\s+/g, "-"))
          .join("-"),
        buyingPrice: 0,
        sellingPrice: 0,
        stock: 0,
      };
    }),
  }));
}
