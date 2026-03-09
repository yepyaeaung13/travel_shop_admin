import {
  CreateBannerInput,
  createBanners,
  createLandingAssets,
  CreateLandingInput,
  createPolicy,
  CreatePolicyInput,
  getBanners,
  getLandingAssets,
  getPolicy,
  UpdateBannerInput,
  updateBanners,
  updateLandingAssets,
  UpdateLandingInput,
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
    mutationFn: (payload: CreateBannerInput) => createBanners(payload),
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
    mutationFn: (payload: UpdateBannerInput) => updateBanners(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["banners"],
        refetchType: "active",
      });
    },
  });
};

export const useGetLanding = () => {
  return useQuery({
    queryKey: ["landing"],
    queryFn: () => getLandingAssets(),
  });
};

export const useCreateLanding = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLandingInput) => createLandingAssets(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["landing"],
        refetchType: "active",
      });
    },
  });
};

export const useUpdateLanding = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLandingInput) => updateLandingAssets(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["landing"],
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
