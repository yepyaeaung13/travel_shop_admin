import {
  Category,
  CategoryGetResponse,
  CategoryListResponse,
  UpdateCategory,
} from "@/types/category.types";
import { SortOptionValue } from "@/components/Category/CategoryTable";
import axiosClient from "@/lib/axios";

export type CreateCategoryRequest = Omit<Category, "id">;
export type UpdateCategoryRequest = UpdateCategory;

export type CreateCategoryResponse = {
  success: true;
  message: string;
  data: {
    id: 3;
    name: string;
    parentId: 0;
    image: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    variations: {
      id: number;
      name: string;
    }[];
  };
  meta: {};
};

export const getCategories = async ({
  sortBy,
  searchText,
  page,
  limit,
}: {
  sortBy?: SortOptionValue;
  searchText?: string;
  page?: number;
  limit?: number;
}): Promise<CategoryListResponse> => {
  const params = Object.fromEntries(
    Object.entries({ sortBy, searchText, page, limit }).filter(
      ([_, value]) => value !== undefined
    )
  );

  const res = await axiosClient.get("/v1/categories", {
    params,
  });
  return res.data;
};

export const getCategoryById = async ({
  id,
}: {
  id: number;
}): Promise<CategoryGetResponse> => {
  const res = await axiosClient.get(`/v1/categories/${id}`);
  return res.data;
};

export const createCategory = async (
  payload: CreateCategoryRequest
): Promise<CreateCategoryResponse> => {
  const res = await axiosClient.post("/v1/categories", payload);
  return res.data;
};

export const updateCategory = async (
  payload: UpdateCategoryRequest
): Promise<CreateCategoryResponse> => {
  const res = await axiosClient.put(`/v1/categories/${payload.id}`, payload);
  return res.data;
};

export const toggleStatus = async (
  id: number,
  status: string
): Promise<CreateCategoryResponse> => {
  const res = await axiosClient.put(`/v1/categories/changeStatus/${id}`, {
    status,
  });
  return res.data;
};

export const deleteCategory = async (ids: number[]) => {
  const res = await axiosClient.delete(`/v1/categories`, { data: { ids } });
  return res.data;
};
