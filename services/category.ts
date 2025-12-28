import {
  ProductSortOption,
  VariantOptionPayloadType,
  VariantOptionResponseType,
  VariantOptionType,
} from "@/types/product";
import axiosClient from "@/lib/axios";
import {
  CategoryFormType,
  CreateCategoryResponseType,
  GetCategoriesResponseType,
  UpdateCategoryType
} from "@/types/categories";
import {categoryEndpoints} from "@/utils/constants/apiEndpoints";

export const getCategories = async ({
  sortBy,
  searchText,
  page,
  limit,
}: {
  sortBy: ProductSortOption;
  searchText?: string;
  page: number;
  limit: number;
}): Promise<GetCategoriesResponseType> => {
  const params = Object.fromEntries(
    Object.entries({ sortBy, searchText, page, limit }).filter(
      ([_, value]) => value !== undefined,
    ),
  );

  const res = await axiosClient.get(categoryEndpoints.getAllCategories, {
    params,
  });
  return res.data;
};

export const createCategory = async (
  data: CategoryFormType,
): Promise<CreateCategoryResponseType> => {
  const res = await axiosClient.post(categoryEndpoints.categories, {
    ...data,
    parentId: null,
  });
  return res.data;
};

export const updateCategory = async (
  data: UpdateCategoryType,
): Promise<CreateCategoryResponseType> => {
  const res = await axiosClient.put(categoryEndpoints.categories, data);
  return res.data;
};

export const createVariants = async (
  data: VariantOptionPayloadType,
): Promise<VariantOptionResponseType> => {
  const res = await axiosClient.post(categoryEndpoints.createVariants, data);
  return res.data;
};

export const updateVariants = async (
  data: VariantOptionType,
): Promise<VariantOptionResponseType> => {
  const res = await axiosClient.put(categoryEndpoints.updateVariants, data);
  return res.data;
};

export const deleteCategory = async (
  id: number,
): Promise<CreateCategoryResponseType> => {
  const res = await axiosClient.delete(`${categoryEndpoints.categories}/${id}`);
  return res.data;
};
