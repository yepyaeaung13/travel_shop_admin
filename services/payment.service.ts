import axiosClient from "@/lib/axios";
import { UpdatePaymentType, UpdateStatusPaymentType } from "@/types/payment";

export const getPayments = async () => {
  const res = await axiosClient.get("/v1/payments");
  return res.data;
};

export const updatePayment = async (data: { id: number; payload: UpdatePaymentType }) => {
  const res = await axiosClient.put(`/v1/payments/${data.id}`, data.payload);
  return res.data;
};

export const updateStatusPayment = async (data: { id: number; payload: UpdateStatusPaymentType }) => {
  const res = await axiosClient.put(`/v1/payments/${data.id}/changeStatus`, data.payload);
  return res.data;
};
