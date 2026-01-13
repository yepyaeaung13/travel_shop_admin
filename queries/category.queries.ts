import { SortOptionValue } from "@/components/Category/CategoryTable";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  CreateCategoryResponse,
  CreateCategoryRequest,
  toggleStatus,
  getCategoryById,
  UpdateCategoryRequest,
  deleteSubCategory,
} from "@/services/category.service";
import {
  CategoryGetResponse,
  CategoryListResponse,
} from "@/types/category.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCategories = ({
  sortBy,
  searchText,
  page,
  limit,
}: {
  sortBy?: SortOptionValue;
  searchText?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<CategoryListResponse, Error>({
    queryKey: ["Categories", page, limit, sortBy, searchText],
    queryFn: () => getCategories({ sortBy, searchText, page, limit }),
  });
};

export const useGetCategoryById = ({ id }: { id: number }) => {
  return useQuery<CategoryGetResponse, Error>({
    queryKey: ["Category", id],
    queryFn: () => getCategoryById({ id }),
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["Create-Category"],
    mutationFn: (payload: CreateCategoryRequest) => createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

export const useToggleStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["Toggle-Category"],
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      toggleStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const qr = useQueryClient();
  return useMutation<CreateCategoryResponse, Error, UpdateCategoryRequest>({
    mutationKey: ["Update-Category"],
    mutationFn: (data) => updateCategory(data),
    onSuccess() {
      qr.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const qr = useQueryClient();
  return useMutation<CreateCategoryResponse, Error, number[]>({
    mutationKey: ["Delete-Category"],
    mutationFn: (ids: number[]) => deleteCategory(ids),
    onSuccess() {
      qr.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

export const useDeleteSubCategory = () => {
  const qr = useQueryClient();
  return useMutation<CreateCategoryResponse, Error, number>({
    mutationKey: ["Delete-Sub-Category"],
    mutationFn: (id: number) => deleteSubCategory(id),
    onSuccess() {
      qr.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};
