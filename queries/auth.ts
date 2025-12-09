import {
  adminLogin,
  changePasswordSeller,
  getLoginInfo,
  PasswordChangeSellerParams,
  updateProfile,
  UpdateProfileParams,
} from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      adminLogin(payload),
  });
};

export const useGetLoginInfo = (id: number | undefined) => {
  console.log("id", id)
  return useQuery({
    queryKey: ["login-user", id],
    queryFn: () => getLoginInfo(id),
    enabled: !!id
  })
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: UpdateProfileParams;
      id: number;
    }) => updateProfile({payload, id}),
  });
};

export const useChangeSellerPassword = () => {
  return useMutation({
    mutationFn: ({
      payload,
      id
    }: {
      payload: PasswordChangeSellerParams,
      id: number
    }) => changePasswordSeller({payload, id})
  })
}