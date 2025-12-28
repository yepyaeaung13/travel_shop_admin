import {
  createCategory,
  getCategories,
  updateCategory,
  createVariants,
  updateVariants,
  deleteCategory,
} from "@/services/category";
import {
  ProductSortOption,
  VariantOptionPayloadType,
  VariantOptionResponseType,
  VariantOptionType,
} from "@/types/product";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  CategoryFormType,
  CreateCategoryResponseType,
  GetCategoriesResponseType, UpdateCategoryType
} from "@/types/categories";

export const useGetCategories = ({
  sort,
  searchText,
  page,
  limit,
}: {
  sort: ProductSortOption;
  searchText?: string;
  page: number;
  limit: number;
}) => {
  return useQuery<GetCategoriesResponseType, Error>({
    queryKey: ["Categories", page, limit, sort, searchText],
    queryFn: () => getCategories({sortBy: sort, searchText, page, limit}),
  });
};

export const useCreateCategory = () => {
  const qr = useQueryClient();
  return useMutation<CreateCategoryResponseType, Error, CategoryFormType>({
    mutationKey: ["Create-Category"],
    mutationFn: (data: CategoryFormType) => createCategory(data),
    onSuccess() {
      void qr.invalidateQueries({
        queryKey: ["Categories"],
      });
    },
  });
};

export const useCreateVariants = () => {
  return useMutation<
    VariantOptionResponseType,
    Error,
    VariantOptionPayloadType
  >({
    mutationKey: ["Create-Variants"],
    mutationFn: (data: VariantOptionPayloadType) => createVariants(data),
  });
};

export const useUpdateVariants = () => {
  return useMutation<VariantOptionResponseType, Error, VariantOptionType>({
    mutationKey: ["Update-Variants"],
    mutationFn: (data: VariantOptionType) => updateVariants(data),
  });
};

export const useUpdateCategory = () => {
  const qr = useQueryClient();
  return useMutation<CreateCategoryResponseType, Error, UpdateCategoryType>({
    mutationKey: ["Update-Category"],
    mutationFn: (data) => updateCategory(data),
    onSuccess() {
      void qr.invalidateQueries({
        queryKey: ["Categories"]
      });
    },
  });
};

export const useDeleteCategory = () => {
  const qr = useQueryClient();
  return useMutation<CreateCategoryResponseType, Error, number>({
    mutationKey: ["Delete-Category"],
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess() {
      void qr.invalidateQueries({
        queryKey: ["Categories"]
      });
    },
  });
};