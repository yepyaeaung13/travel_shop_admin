import axiosClient from "@/lib/axios";

export const getNoti = async (limit: number, isSeen?: boolean) => {
  const res = await axiosClient.get("/v1/noti", { params: { limit, isSeen } });
  return res.data;
};

export const updateSeenNoti = async (payload: { ids: number[] }) => {
  const res = await axiosClient.put("/v1/noti/seen", payload);
  return res.data;
};

export const markAsAllRead = async () => {
  const res = await axiosClient.put("/v1/noti/markAsAllReadByAdmin");
  return res.data;
};
