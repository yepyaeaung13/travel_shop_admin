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
    getProductListing,
    updateProduct,
} from "@/services/product";
import {
    GetProductsParams,
    GetProductsResponse,
    Product,
} from "@/types/product";
import {CreateProductPayload} from "@/types/product/product-form.schemas";

export const useGetProductListing = (params?: GetProductsParams) =>
    useQuery<GetProductsResponse, Error>({
        queryKey: ["product-listing", params],
        queryFn: () => getProductListing(params),
        placeholderData: (previousData) => previousData, // no explicit type here
    });

export const useGetProductById = (id: number): UseQueryResult<any, Error> =>
    useQuery<any, Error>({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
    });

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation<Product, Error, CreateProductPayload>({
        mutationFn: (payload) => createProduct(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey:["product-listing"],
            });
            // e.g. invalidate ["product-listing"]
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Product,
        Error,
        { id: number; payload: CreateProductPayload }
    >({
        mutationFn: ({ id, payload }) => updateProduct({ id, payload }),
        onSuccess: (product) => {
           void queryClient.invalidateQueries({
                queryKey:["product-listing", "product", product.id]
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

export const useDeleteProducts = () =>
    useMutation<Product, Error, number[]>({
        mutationFn: (ids) => deleteProducts(ids),
        onSuccess: () => {
            // e.g. invalidate ["product-listing"]
        },
    });
