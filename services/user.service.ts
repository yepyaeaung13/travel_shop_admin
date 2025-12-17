import axiosClient from "@/lib/axios";
import { User, UserSortOption } from "@/types/users.types";
import Cookies from "js-cookie";

interface GetUsersParams {
  sort?: UserSortOption;
  page?: number;
  limit?: number;
  searchText?: string;
}

export const registerUser = async (payload: Partial<User>) => {
  const res = await axiosClient.post("/v1/users", payload);
  return res.data;
};

export const getUsers = async (params?: GetUsersParams) => {
  const res = await axiosClient.get("/v1/users", { params  });
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await axiosClient.get(`/v1/users/${id}`);
  return res.data;
};

export const getDeleteUser = async (id: string) => {
  const res = await axiosClient.delete(`/v1/users/${id}`);
  return res.data;
};

export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const response = await axiosClient.post("/v1/users/refresh-token", {
    refreshToken: refreshToken,
  });
  return response.data; // Should contain { newAccessToken, newRefreshToken }
};

export const updateUserStatus = async (payload: {
  userId: number;
  status: string;
}) => {
  const res = await axiosClient.post(`/v1/users/${payload.userId}/unsuspend`, payload);
  return res.data;
};
