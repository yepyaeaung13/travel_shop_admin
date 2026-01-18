import {
  CreateProductState,
  GroupedVariant,
  ProductVariant,
  VariantItem,
} from "@/store/useProductStore";

export function mapProductToStore(product: any): Partial<CreateProductState> {
  const TOpts = product.variantOptions.map((opt: any) => ({
    id: opt.id,
    name: opt.name,
    values: opt.values.split(","),
  }));
  return {
    name: product.name,
    description: product.description,

    buyingPriceMMK: Number(product.buyingPriceMMK ?? 0),
    sellingPriceMMK: Number(product.sellingPriceMMK ?? 0),
    sellingPriceCNY: Number(product.sellingPriceCNY ?? 0),
    sellingPriceUSD: Number(product.sellingPriceUSD ?? 0),

    promoteType: product.promoteType,
    promoteValue: Number(product.promoteValue ?? 0),
    isPromote: product.isPromote,

    stock: product.stock,
    sku: product.sku,
    status: product.status,

    mainCategoryId: product.mainCategory?.id ?? null,
    subCategoryId: product.subCategory?.id ?? null,

    images: product.images.map((img: any) => ({
      id: img.id,
      url: `${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${img.url}`,
      isMain: img.isMain,
    })),

    // 🔥 grouped variants (important)
    variants: generateGroupedVariantsUpdate(TOpts, product.variants),

    // 🔥 variant options (Size / Color)
    productVarints: TOpts,
  };
}

function cartesian<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]],
  );
}

export function generateGroupedVariants(
  variants: ProductVariant[],
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
          showSKU: "",
          status: "active",
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
        showSKU: "",
        status: "active",
      };
    }),
  }));
}

export function generateGroupedVariantsUpdate(
  variants: ProductVariant[],
  variantItems: VariantItem[],
): GroupedVariant[] {
  if (variants.length === 0) return [];

  const [baseVariant, ...otherVariants] = variants;
  // If only 1 variant (e.g. only Size)
  if (otherVariants.length === 0) {
    return baseVariant.values.map((base) => {
      const sku = base.toUpperCase().replace(/\s+/g, "-");
      const variant = variantItems.find((v) => v.sku === sku);

      // ❗ If variant was deleted → do NOT recreate it
      let genVariant;
      if (variant) {
        genVariant = {
          ...variant,
          buyingPrice: Number(variant.buyingPrice),
          sellingPrice: Number(variant.sellingPrice),
        };
      } else {
        genVariant = {
          name: base,
          sku: base.toUpperCase(),
          buyingPrice: 0,
          sellingPrice: 0,
          stock: 0,
          showSKU: "",
          status: "active",
        };
      }

      return {
        name: base,
        variantItems: [genVariant],
      };
    }) as GroupedVariant[];
  }

  const otherValueSets = otherVariants.map((v) => v.values);
  const combinations = cartesian(otherValueSets);

  return baseVariant.values.map((baseValue) => ({
    name: baseValue,
    variantItems: combinations.map((combo) => {
      const fullValues = [baseValue, ...combo];
      const sku = fullValues
        .map((v) => v.toUpperCase().replace(/\s+/g, "-"))
        .join("-");

      const variant = variantItems.find((v) => v.sku === sku);
      let genVariant;
      if (variant) {
        genVariant = {
          ...variant,
          buyingPrice: Number(variant.buyingPrice),
          sellingPrice: Number(variant.sellingPrice),
        };
      } else {
        genVariant = {
          name: combo.join(" / "),
          sku: fullValues
            .map((v) => v.toUpperCase().replace(/\s+/g, "-"))
            .join("-"),
          buyingPrice: 0,
          sellingPrice: 0,
          stock: 0,
          showSKU: "",
          status: "active",
        };
      }

      return genVariant;
    }),
  })) as GroupedVariant[];
}
