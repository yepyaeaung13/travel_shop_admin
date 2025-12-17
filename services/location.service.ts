import axiosClient from "@/lib/axios";

export const getRegions = async () => {
  const res = await axiosClient.get(`/v1/locations/regions`);
  return res.data;
};
export const getCities = async (id: string) => {
  const res = await axiosClient.get(`/v1/locations/cities/${id}`);
  return res.data;
};
export const getTownships = async (id: string) => {
  const res = await axiosClient.get(`/v1/locations/townships/${id}`);
  return res.data;
};