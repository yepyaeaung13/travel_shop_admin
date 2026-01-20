import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  deleteProducts,
  getProductById,
  getProductDashboard,
  getProductListing,
  getProductsByCategory,
  statusUpdateProduct,
  updateProduct,
} from "@/services/product.service";
import {
  GetProductsParams,
  GetProductsResponse,
  Product,
} from "@/types/product.types";

export const useGetProductDashboard = () => {
  return useQuery({
    queryKey: ["product-dashboard"],
    queryFn: () => getProductDashboard(),
  });
};

export const useGetProductListing = (params: GetProductsParams) =>
  useQuery<GetProductsResponse, Error>({
    queryKey: ["product-list", params],
    queryFn: () => getProductListing(params),
  });

export const useGetProductById = (id: number): UseQueryResult<any, Error> =>
  useQuery<any, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

export const useGetProductsByCategory = (categoryId: number, take: number) => {
  return useQuery({
    queryKey: ["product-category", categoryId, take],
    queryFn: () => getProductsByCategory(categoryId, take),
  });
};

export const useCreateProduct = () => {
  return useMutation<Product, Error, any>({
    mutationFn: (payload) => createProduct(payload),
  });
};

export const useUpdateProduct = () => {
  // const queryClient = useQueryClient();
  return useMutation<Product, Error, any>({
    mutationFn: ({ id, payload }) => updateProduct({ id, payload }),
  });
};

export const useStatusUpdateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      statusUpdateProduct(id, status),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["product-list"],
        refetchType: "active",
      });
    },
  });
};

export const useDeleteProduct = () =>
  useMutation<void, Error, number>({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      // e.g. invalidate ["product-listing"]
    },
  });

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, number[]>({
    mutationFn: (ids) => deleteProducts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-list"],
        refetchType: "active",
      });
      // e.g. invalidate ["product-listing"]
    },
  });
};
