import axiosClient from "@/lib/axios";

export const getOrderDashboard = async () => {
  const res = await axiosClient.get("/v1/orders/dashboard");

  return res?.data;
};

export const getOrderList = async (data: any) => {
  const res = await axiosClient.get("/v1/orders", {
    params: {
      page: data.page,
      limit: data.limit,
      searchText: data.searchText,
      status: data.status,
      fromDate: data.fromDate,
      toDate: data.toDate,
    },
  });

  return res?.data;
};

export const getOrderById = async (id: number) => {
  const res = await axiosClient.get(`/v1/orders/${id}`);

  return res?.data;
};

export const changePaymentStatus = async (
  id: number,
  paymentStatus: string,
  rejectedNote: string,
) => {
  const res = await axiosClient.put(`/v1/orders/${id}/payment-status`, {
    paymentStatus,
    rejectedNote,
  });

  return res?.data;
};

export const changeOrderStatus = async (id: number, status: string) => {
  const res = await axiosClient.put(`/v1/orders/${id}/order-status`, {
    status,
  });

  return res?.data;
};
