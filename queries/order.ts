import {
  changeOrderStatus,
  changePaymentStatus,
  getPrderById,
  getPrderList,
} from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetOrderList = (data: any) => {
  return useQuery({
    queryKey: ["order-list", data],
    queryFn: () => getPrderList(data),
  });
};

export const useGetOrderDetail = (id: number) => {
  return useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => getPrderById(id),
  });
};

export const useOrderPaymentStatusChange = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      paymentStatus,
      rejectedNote,
    }: {
      id: number;
      paymentStatus: string;
      rejectedNote: string;
    }) => changePaymentStatus(id, paymentStatus, rejectedNote),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["order-detail"],
        refetchType: "active",
      });
    },
  });
};

export const useOrderStatusChange = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      changeOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["order-detail"],
        refetchType: "active",
      });
    },
  });
};
