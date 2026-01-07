"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import {usePricingHandlers} from "@/hooks/products/usePricingHandlers";
import {PriceField} from "@/components/common/form/PriceField";
import {DiscountValueField} from "@/components/common/form/DiscountValueField";
import type {UseFormReturn} from "react-hook-form";
import {CreateProductPayload} from "@/types/product/product-form.schemas";

interface PricingSectionProps {
  form: UseFormReturn<CreateProductPayload>;
  discount: {
    enabled: boolean;
    type: string;
    isPercentage: boolean;
  };
}

export default function PricingSection({ form, discount }: PricingSectionProps) {
  const { handlers } = usePricingHandlers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <PriceField
            form={form}
            name="buyingPriceMMK"
            label="Buying Price"
            placeholder="Buying price"
            unit="Ks"
            isRequired
            onChange={handlers.handleBuyingPriceMMKChange}
          />
          <PriceField
            form={form}
            name="sellingPriceMMK"
            label="Selling Price"
            placeholder="Selling price"
            unit="Ks"
            isRequired
            onChange={handlers.handleSellingPriceMMKChange}
          />
          <PriceField
            form={form}
            name="sellingPriceUSD"
            label="Selling Price (USD)"
            placeholder="Selling Price in Dollar"
            unit="$"
            onChange={handlers.handleSellingPriceUSDChange}
          />
          <PriceField
            form={form}
            name="sellingPriceCNY"
            label="Selling Price (CNY)"
            placeholder="Selling Price in Yuan"
            unit="¥"
            onChange={handlers.handleSellingPriceCNYChange}
          />
        </div>


        <div className="space-y-4">
          <FormField
            control={form.control}
            name="promoteType"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Enable discount with default type
                        handlers.handleDiscountToggle(true);
                      } else {
                        // Disable discount by clearing promoteType
                        form.setValue("promoteType", undefined);
                        form.setValue("promoteValue", 0);
                      }
                    }}
                  />
                </FormControl>
                <FormLabel>Discount</FormLabel>
              </FormItem>
            )}
          />

          {discount.enabled && (
            <div className="space-y-4 pl-4">
              <FormField
                control={form.control}
                name="promoteType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={handlers.handleDiscountTypeChange}
                        value={field.value ?? "PERCENTAGE"}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="PERCENTAGE"
                            id="discount-percentage"
                          />
                          <Label htmlFor="discount-percentage" className="cursor-pointer">
                            Percentage
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="AMOUNT" id="discount-amount" />
                          <Label htmlFor="discount-amount" className="cursor-pointer">
                            Amount
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <DiscountValueField
                form={form}
                discount={discount}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}