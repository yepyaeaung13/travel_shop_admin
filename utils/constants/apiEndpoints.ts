// Product End Points
const PRODUCT_BASE_PATCH = "/v1/products";
export const productEndpoints = {
    products: PRODUCT_BASE_PATCH,
};

const CATEGORY_BASE_PATH = "v1/categories";
export const categoryEndpoints = {
  categories: CATEGORY_BASE_PATH,
  getAllCategories: `${CATEGORY_BASE_PATH}/getAllCategory`,
  variants: `${CATEGORY_BASE_PATH}/variants`,
  createVariants: `${CATEGORY_BASE_PATH}/createVariants`,
  updateVariants: `${CATEGORY_BASE_PATH}/updateVariants`,
  deleteVariants: `${CATEGORY_BASE_PATH}/deleteVariants`,
  deleteVariantValue: `${CATEGORY_BASE_PATH}/deleteVariantValue`,
};
