import axiosClient from "@/lib/axios";

export const getDeliveryRegion = async () => {
  const res = await axiosClient.get("/v1/deliveries");
  return res.data;
};

export const getDeliveryRegionById = async (id: number) => {
  const res = await axiosClient.get(`/v1/deliveries/${id}`);
  return res.data;
};

export const updateDeliveryRegionById = async (data: any) => {
  const res = await axiosClient.put(`/v1/deliveries`, data);
  return res.data;
};

export const changeStatusRegionById = async (data: {
  id: number;
  status: string;
}) => {
  const res = await axiosClient.put(`/v1/deliveries/${data.id}/change-status`, {
    status: data.status,
  });
  return res.data;
};
