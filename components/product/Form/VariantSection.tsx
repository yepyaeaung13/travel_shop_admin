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
  ChevronDown,
  ChevronUp,
  CircleChevronRight,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { CategoryVariantGroup } from "@/types/categories";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  GroupedVariant,
  ProductVariant,
  VariantItem,
} from "@/store/useProductStore";
import IconTrash from "@/assets/icons/Trash";
import {
  generateGroupedVariants,
  generateGroupedVariantsUpdate,
} from "@/utils/product";

interface Props {
  isEdit: boolean;
  variantItems?: VariantItem[];
  variants: GroupedVariant[];
  addVariant: (variant: GroupedVariant[]) => void;
  removeVariantItem: (parentIndexNo: number, index: number) => void;
  updateVariantItem: (
    parentIndexNo: number,
    index: number,
    variant: VariantItem,
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
  isEdit,
  variantItems,
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
  const [tempProductVarint, setTempProductVarint] = useState<ProductVariant>({
    name: "",
    values: [],
  });
  const [editProductVarint, setEditProductVarint] = useState<EditProductVarint>(
    {
      name: "",
      values: [],
      indexNo: 0,
    },
  );
  const [showError, setShowError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newEditValue, setNewEditValue] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<{
    groupIndex: number;
    itemIndex: number;
    variantItem: VariantItem;
  } | null>(null);

  const handleDeleteValue = (index: number) => {
    const updateValues = tempProductVarint.values.filter(
      (v, idx) => idx !== index,
    );

    setTempProductVarint({
      name: tempProductVarint.name,
      values: updateValues,
    });
  };

  const handleDeleteValueForEdit = (index: number) => {
    const updateValues = editProductVarint.values.filter(
      (v, idx) => idx !== index,
    );

    setEditProductVarint({
      name: editProductVarint.name,
      values: updateValues,
      indexNo: editProductVarint.indexNo,
    });
  };

  const handleDeleteTemp = () => {
    setTempProductVarint({ name: "", values: [] });
    setNewValue("");
    setShowNew(false);
  };

  const handleDeleteItem = () => {
    removeProductVariant(editProductVarint.indexNo);
    setEditProductVarint({ name: "", values: [], indexNo: 0 });
    setNewEditValue("");
    setShowEdit(false);
  };

  const handleAddNew = () => {
    if (newValue !== "") {
      setShowError("Please press Enter for new value.");
      return;
    }
    addProductVariant(tempProductVarint);
    setTempProductVarint({ name: "", values: [] });
    setNewValue("");
    setShowNew(false);
  };

  const handleUpdate = () => {
    if (newEditValue !== "") {
      setShowError("Please press Enter for new value.");
      return;
    }
    updateProductVariant(editProductVarint.indexNo, {
      name: editProductVarint.name,
      values: editProductVarint.values,
    });
    setEditProductVarint({ name: "", values: [], indexNo: 0 });
    setNewEditValue("");
    setShowEdit(false);
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleGroup = (name: string) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
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

  const updateGroupSellingPrice = (groupIndex: number, price: number) => {
    const nextVariants = variants.map((group, gIdx) =>
      gIdx === groupIndex
        ? {
            ...group,
            variantItems: group.variantItems.map((item) => ({
              ...item,
              sellingPrice: price,
            })),
          }
        : group,
    );

    addVariant(nextVariants);
  };

  useEffect(() => {
    // if (isEdit && variantItems) {
    //   const result = generateGroupedVariantsUpdate(
    //     productVarints,
    //     variantItems!,
    //   );
    //   addVariant(result);
    // } else {
    // const result = generateGroupedVariants(productVarints);
    const localVariantItems = variants.flatMap((v) => v.variantItems);
    const result = generateGroupedVariantsUpdate(
      productVarints,
      localVariantItems!,
    );
    addVariant(result);
    // }
  }, [productVarints]);

  return (
    <>
      <Card className="gap-2">
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
                  setShowError("");
                  setNewEditValue("");
                  setShowEdit(true);
                }}
                className="hover:bg-gray-100 cursor-pointer border rounded-[10px] border-[#EEEEEE] p-5 flex flex-col gap-2.5"
              >
                <label htmlFor="">{pv.name}</label>
                <div className="flex gap-1.5">
                  {pv.values.map((pvv) => (
                    <button
                      key={pvv}
                      className="bg-primary text-white py-1 px-2.5 rounded-[4px]"
                    >
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
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
                  placeholder="Type value and press Enter"
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

                {showError && (
                  <p className="text-sm text-red-500">{showError}</p>
                )}

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

            <Dialog
              open={showEdit}
              onOpenChange={() => {
                setShowEdit(false);
              }}
            >
              <DialogContent className="max-w-[600px] flex flex-col items-center justify-center gap-7 rounded-[10px]">
                <div className="w-full max-h-[500px] p-5 flex flex-col gap-2.5 overflow-y-auto scrollbar-none">
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

                  {showError && (
                    <p className="text-sm text-red-500">{showError}</p>
                  )}

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
              </DialogContent>
            </Dialog>
            <button
              className={cn(
                "text-primary flex gap-2",
                showNew && "opacity-50 cursor-not-allowed",
              )}
              type="button"
              onClick={() => {
                setShowError("");
                setNewValue("");
                setShowNew(true);
              }}
              disabled={showNew}
            >
              <PlusCircle />
              Add option
            </button>
          </div>

          {/* Table Section */}
          {variants.length > 0 && (
            <div className="relative min-h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EEEEEE]">
                    <TableHead className="pl-5">Variants</TableHead>
                    {/* <TableHead>Buying price</TableHead> */}
                    <TableHead>Selling price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {variants.map((group, groupIndex) => {
                    const { min, max } = getMinMaxPrice(group.variantItems);

                    if (productVarints.length === 1) {
                      return group.variantItems.map((item, itemIndex) => (
                        <TableRow key={item.sku}>
                          <TableCell className="pl-5 flex gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                updateVariantItem(groupIndex, itemIndex, {
                                  ...item,
                                  status:
                                    item.status === "active"
                                      ? "inactive"
                                      : "active",
                                });
                              }}
                            >
                              {item.status === "active" ? (
                                <ToggleRight className="text-primary" />
                              ) : (
                                <ToggleLeft />
                              )}
                            </button>
                            {item.name}
                          </TableCell>

                          <TableCell>
                            <Input
                              value={item.sellingPrice.toString()}
                              className="h-8 w-24"
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(
                                  /[^0-9.]/g,
                                  "",
                                );
                                updateVariantItem(groupIndex, itemIndex, {
                                  ...item,
                                  sellingPrice: Number(numericValue),
                                });
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Input
                              value={item.stock.toString()}
                              className="h-8 w-20"
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(
                                  /[^0-9.]/g,
                                  "",
                                );
                                updateVariantItem(groupIndex, itemIndex, {
                                  ...item,
                                  stock: Number(numericValue),
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <button
                              type="button"
                              className=""
                              onClick={() =>
                                setSelectedVariant({
                                  groupIndex,
                                  itemIndex,
                                  variantItem: item,
                                })
                              }
                            >
                              <CircleChevronRight />
                            </button>
                          </TableCell>
                        </TableRow>
                      ));
                    }

                    return (
                      <Fragment key={group.name}>
                        {/* GROUP ROW */}
                        <TableRow className="bg-muted/40">
                          <TableCell className="pl-5 font-semibold capitalize">
                            {group.name}
                            <button
                              onClick={() => toggleGroup(group.name)}
                              className="text-xs text-[#3C3C3CCC] font-normal flex gap-1.5 items-center cursor-pointer"
                              type="button"
                            >
                              {group.variantItems.length} Variants{" "}
                              {expanded[group.name] ? (
                                <ChevronUp className="size-4" />
                              ) : (
                                <ChevronDown className="size-4" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell
                            colSpan={1}
                            className="text-sm text-muted-foreground"
                          >
                            <Input
                              className="h-8 w-36"
                              value={min === max ? min : ""}
                              placeholder={
                                min === max ? undefined : `${min} – ${max}`
                              }
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(
                                  /[^0-9.]/g,
                                  "",
                                );
                                updateGroupSellingPrice(
                                  groupIndex,
                                  Number(numericValue),
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell
                            colSpan={4}
                            className="text-sm text-muted-foreground"
                          >
                            <Input
                              value={group.variantItems.reduce(
                                (pv, cv) => pv + cv.stock,
                                0,
                              )}
                              onChange={() => {}}
                              className="h-8 w-24 pointer-events-none"
                            />
                          </TableCell>
                        </TableRow>

                        {/* VARIANT ITEMS */}
                        {expanded[group.name] &&
                          group.variantItems.map((item, itemIndex) => (
                            <TableRow key={item.sku}>
                              <TableCell className="pl-5 flex gap-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateVariantItem(groupIndex, itemIndex, {
                                      ...item,
                                      status:
                                        item.status === "active"
                                          ? "inactive"
                                          : "active",
                                    });
                                  }}
                                >
                                  {item.status === "active" ? (
                                    <ToggleRight className="text-primary" />
                                  ) : (
                                    <ToggleLeft />
                                  )}
                                </button>
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
                                  value={item.sellingPrice.toString()}
                                  className="h-8 w-24"
                                  onChange={(e) => {
                                    const rawValue = e.target.value;
                                    const numericValue = rawValue.replace(
                                      /[^0-9.]/g,
                                      "",
                                    );
                                    updateVariantItem(groupIndex, itemIndex, {
                                      ...item,
                                      sellingPrice: Number(numericValue),
                                    });
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Input
                                  value={item.stock}
                                  className="h-8 w-20"
                                  onChange={(e) => {
                                    const rawValue = e.target.value;
                                    const numericValue = rawValue.replace(
                                      /[^0-9.]/g,
                                      "",
                                    );
                                    updateVariantItem(groupIndex, itemIndex, {
                                      ...item,
                                      stock: Number(numericValue),
                                    });
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <button
                                  type="button"
                                  className=""
                                  onClick={() =>
                                    setSelectedVariant({
                                      groupIndex,
                                      itemIndex,
                                      variantItem: item,
                                    })
                                  }
                                >
                                  <CircleChevronRight />
                                </button>
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
      <Dialog
        open={!!selectedVariant}
        onOpenChange={() => setSelectedVariant(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogTitle>Edit {selectedVariant?.variantItem?.sku}</DialogTitle>
          <div className="w-full space-y-4">
            <div className="w-full flex flex-col gap-2">
              <label>Price (MMK)</label>
              <Input
                value={selectedVariant?.variantItem?.sellingPrice.toString()}
                className="h-10"
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const numericValue = rawValue.replace(/[^0-9.]/g, "");
                  setSelectedVariant({
                    ...selectedVariant,
                    variantItem: {
                      ...selectedVariant?.variantItem,
                      sellingPrice: Number(numericValue),
                    },
                  } as any);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Stock</label>
              <Input
                value={selectedVariant?.variantItem?.stock.toString()}
                className="h-10"
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const numericValue = rawValue.replace(/[^0-9.]/g, "");
                  setSelectedVariant({
                    ...selectedVariant,
                    variantItem: {
                      ...selectedVariant?.variantItem,
                      stock: Number(numericValue),
                    },
                  } as any);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>SKU</label>
              <Input
                type="text"
                value={selectedVariant?.variantItem?.showSKU}
                className="h-10"
                placeholder="enter sku"
                onChange={(e) =>
                  setSelectedVariant({
                    ...selectedVariant,
                    variantItem: {
                      ...selectedVariant?.variantItem,
                      showSKU: e.target.value,
                    },
                  } as any)
                }
              />
            </div>
          </div>
          <div className="flex justify-between gap-5">
            <button
              type="button"
              className="h-[47px] w-full flex items-center justify-center bg-[#A1A1A1] text-white rounded-[10px] text-lg"
              onClick={() => setSelectedVariant(null)}
            >
              cancel
            </button>
            <button
              type="button"
              className="h-[47px] w-full flex items-center justify-center bg-primary text-white rounded-[10px] text-lg"
              onClick={() => {
                updateVariantItem(
                  selectedVariant?.groupIndex!,
                  selectedVariant?.itemIndex!,
                  selectedVariant?.variantItem!,
                );
                setSelectedVariant(null);
              }}
            >
              save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
