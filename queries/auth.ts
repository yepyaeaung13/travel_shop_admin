import {
  adminLogin,
  changePasswordSeller,
  PasswordChangeSellerParams,
  updateProfile,
  UpdateProfileParams,
} from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      adminLogin(payload),
  });
};

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