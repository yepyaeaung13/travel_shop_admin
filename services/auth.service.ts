import axiosClient from "@/lib/axios";

export interface UpdateProfileParams {
  name: string;
  email: string;
  picture: string | null;
  phone: string;
}

export interface PasswordChangeSellerParams {
  oldPassword?: string;
  newPassword?: string;
}

export const adminLogin = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosClient.post("/v1/admin/login", payload);
  return data;
};

export const updateProfile = async ({
  payload,
  id,
}: {
  payload: UpdateProfileParams;
  id: number;
}) => {
  const { data } = await axiosClient.put(`/v1/admin/${id}`, payload);
  return data;
};

export const changePasswordSeller = async ({
  payload,
  id,
}: {
  payload: PasswordChangeSellerParams;
  id: number;
}) => {
  const { data } = await axiosClient.post(
    `/v1/admin/${id}/change-password`,
    payload
  );
  return data;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const res = await axiosClient.post("/v1/auth/refreshToken", {
    refreshToken: refreshToken,
  });
  return res.data;
};
