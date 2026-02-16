import {
  getPayments,
  updatePayment,
  updateStatusPayment,
} from "@/services/payment.service";
import { UpdatePaymentType, UpdateStatusPaymentType } from "@/types/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; payload: UpdatePaymentType }) =>
      updatePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
        refetchType: "active",
      });
    },
  });
};

export const useUpdateStatusPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; payload: UpdateStatusPaymentType }) =>
      updateStatusPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
        refetchType: "active",
      });
    },
  });
};
