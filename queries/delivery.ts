import {
  changeStatusRegionById,
  getDeliveryRegion,
  getDeliveryRegionById,
  updateDeliveryRegionById,
} from "@/services/delivery.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDeliveryRegion = () => {
  return useQuery({
    queryKey: ["delivery-region"],
    queryFn: () => getDeliveryRegion(),
  });
};

export const useGetDeliveryRegionById = (id: number | undefined) => {
  return useQuery({
    queryKey: ["delivery-region-by-id", id],
    queryFn: () => getDeliveryRegionById(id!),
    enabled: !!id
  });
};

export const useUpdateDeliveryRegionById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      updateDeliveryRegionById(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delivery-region-by-id"],
        refetchType: "active",
      });
    },
  });
};

export const useUpdateStatusRegionById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; status: any }) =>
      changeStatusRegionById(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delivery-region"],
        refetchType: "active",
      });
    },
  });
};
