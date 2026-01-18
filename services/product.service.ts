import axiosClient from "@/lib/axios";
import {
  GetProductByIdResponse,
  GetProductsParams,
  GetProductsResponse,
} from "@/types/product.types";

export const createProduct = async (payload: any) => {
  const res = await axiosClient.post("/v1/products", payload);
  return res.data;
};

export const updateProduct = async ({
  payload,
  id,
}: {
  payload: any;
  id: number;
}) => {
  const res = await axiosClient.put(`/v1/products/${id}`, payload);
  return res.data;
};

export const getProductListing = async (
  params?: GetProductsParams
): Promise<GetProductsResponse> => {
  const res = await axiosClient.get("/v1/products", { params });
  return res.data;
};

export const getProductById = async (
  id: number
): Promise<GetProductByIdResponse> => {
  const res = await axiosClient.get(`/v1/products/${id}`);
  return res.data;
};

export const statusUpdateProduct = async (id: number, status: string) => {
  const res = await axiosClient.put(`/v1/products/changeStatus/${id}`, {
    status,
  });
  return res.data;
};

export const deleteProduct = async (id: number) => {
  await axiosClient.delete(`/v1/products/${id}`);
};

export const deleteProducts = async (ids: number[]) => {
  const res = await axiosClient.delete("/v1/products", {
    data: { ids },
  });
  return res.data;
};
