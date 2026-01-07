import {
  Product,
  GetProductByIdResponse,
  GetProductsParams,
  GetProductsResponse,
} from "@/types/product";
import {CreateProductPayload} from "@/types/product/product-form.schemas";
import axiosClient from "@/lib/axios";
import {productEndpoints} from "@/utils/constants/apiEndpoints";


export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const res = await axiosClient.post(productEndpoints.products, payload);
  return res.data;
};

export const updateProduct = async ({
  payload,
  id,
}: {
  payload: CreateProductPayload;
  id: number;
}): Promise<Product> => {
  const res = await axiosClient.put(productEndpoints.products, {

    ...payload,
    productId: id,
  });
  return res.data;
};

export const getProductListing = async (
  params?: GetProductsParams,
): Promise<GetProductsResponse> => {
  const qp = new URLSearchParams();

  if (params?.sort) qp.append("sortBy", params.sort);
  if (params?.page) qp.append("page", params.page.toString());
  if (params?.limit) qp.append("limit", params.limit.toString());
  if (params?.searchText) qp.append("searchText", params.searchText);

  const query = qp.toString();
  const url = query
    ? `${productEndpoints.products}?${query}`
    : productEndpoints.products;

  const res = await axiosClient.get(url);
  return res.data;
};

export const getProductById = async (
  id: number,
): Promise<GetProductByIdResponse> => {
  const res = await axiosClient.get(`${productEndpoints.products}/${id}`);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosClient.delete(`${productEndpoints.products}/${id}`);
};

export const deleteProducts = async (ids: number[]): Promise<Product> => {
  const res = await axiosClient.delete(productEndpoints.products, {
    data: {ids},
  });
  return res.data;
};
