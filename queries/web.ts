import {
  CreateBannerInput,
  createBanners,
  createPolicy,
  CreatePolicyInput,
  getBanners,
  getPolicy,
  UpdateBannerInput,
  updateBanners,
  updatePolicy,
  UpdatePolicyInput,
} from "@/services/web.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => getBanners(),
  });
};

export const useCreateBanners = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      banners: CreateBannerInput;
      announceText?: { text: string };
    }) => createBanners(payload.banners, payload.announceText),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["banners"],
        refetchType: "active",
      });
    },
  });
};

export const useUpdateBanners = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      banners: UpdateBannerInput;
      announceText?: { text: string; id: number };
    }) => updateBanners(payload.banners, payload.announceText),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["banners"],
        refetchType: "active",
      });
    },
  });
};

export const useGetPolicy = () => {
  return useQuery({
    queryKey: ["policy"],
    queryFn: () => getPolicy(),
  });
};

export const useCreatePolicy = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePolicyInput) => createPolicy(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["policy"],
        refetchType: "active",
      });
    },
  });
};

export const useUpdatePolicy = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePolicyInput) => updatePolicy(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["policy"],
        refetchType: "active",
      });
    },
  });
};
